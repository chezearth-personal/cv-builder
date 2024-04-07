import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import multer from 'multer';
// import morgan from 'morgan';
import OpenAI from 'openai';
// import { createLogger, transports } from 'winston';
import { randomUUID } from 'crypto';
import { exit } from 'process';
import logger from './common/logger.js';
import { successHandler, errorHandler } from './common/morganMiddleware.js';

/** OpenAI won't work without a secret key so
  * don't start the server without it 
  */
if (!process.env.OPENAI_API_SECRET_KEY) {
  exit(1);
}

/** Environment: host and port have defaults */
const host = process.env.HOST || 4000;
const port = process.env.PORT || 'localhost';
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET_KEY
});
const imageFileSize = 1024 * 1024 * Number(process.env.IMAGE_FILE_SIZE_MB || 5);

/** Useful text function */
const plurals = (n, singular, plural) => n === 1 ? singular : plural;

/** Database. For now, just an array*/
let database = [];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
/** Set up http logging */
app.use(successHandler);
app.use(errorHandler);
/** file uploads for images */
app.use('/uploads', express.static('uploads'));

app.get('/api', (req, res) => {
  res.json({
    message: `Welcome to the CV-Builder backend!`
  });
});

const gptFunction = async (text) => {
  try {
    const response = await openAI.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: text,
      temperature: 0.6,
      max_tokens: 400,
      top_p: 1,
      frequency_penalty: 1
    });
    return response.choices && response.choices.length > 0 ? response.choices[0]?.text : 'No response from ChatGPT';
  } catch(err) {
    if (err) {console.log('err =\n', err.error)}
    logger.error(err);
    return err && err.error && err.error.message
      ? `Status: ${err.status}, ${err.error.message}`
      : 'Error from ChatGPT means we dunno.';
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: imageFileSize }
});

/** Create strings from arrays for returning as lists to document */
const commaSep = (t) => !t.length ? '' : ', ';
const testArray = (arr, trueStr, falseStr) => { return arr  && arr.length > 0 ? trueStr : falseStr; }
const getStringFromArray = (homeTopics) => !homeTopics || !Array.isArray(homeTopics)
  ? ''
  : homeTopics.reduce(
      (res, itemGroup) => `${res}${commaSep(res)}${itemGroup.name}${
          testArray(itemGroup.itemList, ' (', '')
        }${
          testArray(itemGroup.itemList, getStringFromArray(itemGroup.itemList), '')
        }${
          testArray(itemGroup.itemList, ')', '')
        }`,
      ''
    );
app.post('/cv/create', upload.single('headshotImage'), async (req, res) => {
    const {
      fullName,
      occupation,
      tel,
      email,
      website,
      skillTopics,
      companyDetails /** JSON format*/
    } = req.body;
    const companyDetailsArray = JSON.parse(companyDetails); /** an array */
    const skillTopicsArray = JSON.parse(skillTopics); /** an array */
    /** Group the values into an object */
    const newEntry = {
      id: randomUUID(),
      fullName,
      occupation,
      imageUrl: req.file && `http://localhost:4000/uploads/${req.file.filename}`,
      tel,
      email,
      website,
      skillTopics: skillTopicsArray,
      companyDetails: companyDetailsArray
    };
    /** Calculates the duration */
    const duration = (startDate, isCurrent, endDate) => {
      const elapsedMillis = Date.parse(!isCurrent ? endDate : (new Date).toDateString()) - Date.parse(startDate);
      const elapsedMonths = Math.floor(elapsedMillis / (3600000 * 24 * 30.4375) + 1);
      const elapsedYears = Math.floor(elapsedMonths / 12)
      const remMonths = elapsedMonths % 12;
      return `${elapsedYears} year${plurals(elapsedYears, '', 's')} ${remMonths} month${plurals(remMonths, '', 's')}`
    }
    const getSeparator = (s, c) => s === '' ? '' :  `${c} `;
    /** The profile prompt message */
    const profilePrompt = `I am writing a CV, my name is ${
        fullName
      }. I have the following skills: ${
        getStringFromArray(skillTopicsArray)
      }. Can you write a 50 to 300 words description of my skills and technology experience for the top of the CV (first person writing)?`;
    /** Work history keyPhrases combined into a text string and appended */
    const companyKeyPhrases = companyDetailsArray.map(companyDetail => ({
      ...companyDetail,
      ...{ duration: duration(companyDetail.startDate, companyDetail.isCurrent, companyDetail.endDate) },
      ...{ keyPhraseText: companyDetail.keyPhraseTopics.reduce((acc, keyPhraseTopic) => acc
        + getSeparator(acc, ';')
        + keyPhraseTopic.name
        + (!keyPhraseTopic.itemList || keyPhraseTopic.itemList.length === 0
          ? ''
          : ' (' + keyPhraseTopic.itemList.reduce((acc, item) => acc + getSeparator(acc, ',') + item.name, '') + ')'
        ), '') }
    }));
    logger.debug('companyKeyPhrases = ' + companyKeyPhrases);
    // console.log('companyKeyPhrases =', companyKeyPhrases);
    const companyPrompts = companyKeyPhrases.map(companyKeyPhrase => (
      { ...companyKeyPhrase, ...{ workPrompt: `I am writing a CV, my name is ${
          fullName
        }. I worked at ${companyKeyPhrase.name} as a ${companyKeyPhrase.position} for ${
          duration(companyKeyPhrase.startDate, companyKeyPhrase.isCurrent, companyKeyPhrase.endDate)
        }. My work involved the following points: ${
          companyKeyPhrase.keyPhraseText
      }. Can you write 50 to 300 words for this company, using paragraphs and in an exciting, interesting tone (first person writing)?` } }));
    // console.log('companyPrompts =', companyPrompts);
    /** Generate the GPT-3 results: 1 - The Profile  */
    const profile = await gptFunction(profilePrompt);
    /** Generate the GPT-3 results: 2 - The work history sections, 1 for each company */
    const workHistories = await Promise.all(companyPrompts.map(async (cp) => ({ ...cp, ...{ companyStory: await gptFunction(cp.workPrompt) } })));
    /** Combine the GPT-3 outputs into one object */
    const chatGptData = { profile, workHistories };
    /** Log the result (nothing happens here... yet) */
    const data = { ...newEntry, ...chatGptData };
    // console.log('data =\n', data);
    database.push(data);
    res.json({
      message: 'Request successful!',
      data: data,
    });
});

app.listen(port, host, () => {
  logger.info(`Server listening on ${host}:${port}`);
});

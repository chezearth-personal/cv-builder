import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { exit } from 'process';

/** OpenAI won't work without a secret key */
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
      max_tokens: 250,
      top_p: 1,
      frequency_penalty: 1,
    });
    return response.choices && response.choices.length > 0 ? response.choices[0]?.text : 'No response from ChatGPT';
  } catch(err) {
    if (err) {console.log('err =\n', err.error)}
    return err && err.error && err.error.message
      ? `Status: ${err.status}, ${err.error.message}`
      :'Error from ChatGPT means we dunno.';
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
const getStringFromArray = (itemGroups) => !itemGroups || !Array.isArray(itemGroups)
  ? ''
  : itemGroups.reduce(
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
      tels,
      email,
      skillGroups,
      workHistory /** JSON format*/
    } = req.body;
    const workArray = JSON.parse(workHistory); /** an array */
    const telsArray = JSON.parse(tels); /** an array */
    const skillGroupsArray = JSON.parse(skillGroups); /** an array */
    // console.log('skillGroupsArray =', skillGroupsArray);
    console.log('workArray =', workArray);
    console.log('workArray.keywordGroups =', workArray.keywordGroups);
    /** Group the values into an object */
    const newEntry = {
      id: randomUUID(),
      fullName,
      imageUrl: req.file && `http://localhost:4000/uploads/${req.file.filename}`,
      tels: telsArray,
      email,
      skillGroups: skillGroupsArray,
      workHistory: workArray
    };
    // console.log('newEntry =\n', newEntry);
    console.log('skillsGroupsString =', getStringFromArray(skillGroupsArray));
    // console.log('testArray(skillGroupsArray) =\n', testArray(skillGroupsArray, 'true', 'false'));
    /** Calculates the duration */
    const duration = (startDate, isCurrent, endDate) => {
      const elapsedMillis = Date.parse(!isCurrent ? endDate : (new Date).toDateString()) - Date.parse(startDate);
      const elapsedMonths = Math.floor(elapsedMillis / (3600000 * 24 * 30.4375) + 1);
      const elapsedYears = Math.floor(elapsedMonths / 12)
      const remMonths = elapsedMonths % 12;
      return `${elapsedYears} year${plurals(elapsedYears, '', 's')} ${remMonths} month${plurals(remMonths, '', 's')}`
    }
    const getSeparator = (s => s === '' ? '' : ', ');
    /** Reduces the items in the workArray and convert them to a string */
    // const remainderText = workArray
      // .reduce((acc, work) => acc + ` ${work.name} as a ${}` duration(work.startDate, work.isCurrent, work.endDate), '').trim();
    const remainderText = workArray
      .reduce((res, e) => {
        const elapsedMillis = Date.parse(!e.isCurrent
          ? e.endDate 
          : (new Date).toDateString()
        ) - Date.parse(e.startDate);
        const elapsedMonths = Math.floor(elapsedMillis / (3600000 * 24 * 30.4375) + 1);
        const elapsedYears = Math.floor(elapsedMonths / 12)
        const remMonths = elapsedMonths % 12;
        return res + ` ${e.name} as a ${e.position}, starting in ${
          e.startDate
        } until ${
          !e.isCurrent ? e.endDate : 'now'
        } (${
          elapsedYears
        } year${plurals(elapsedYears, '', 's')} ${
          remMonths
        } month${plurals(remMonths, '', 's')}).`
        }, '').trim();
    /** The job description message */
    const prompt1 = `I am writing a CV, my name is ${
        fullName
      }. I have the following skills: ${
        getStringFromArray(skillGroupsArray)
      }. Can you write a 100 words description of my skills and technology experience for the top of the CV (first person writing)?`;
    /** Work history */
    const workHistoryPrompts = workArray.map(w => `I am writing a CV, my name is ${
        fullName
      }. I worked at ${w.name} as a ${w.position} for ${
        duration(w.startDate, w.isCurrent, w.endDate)
      }. My work covered the following areas: ${
        w.keywordGroups
          .reduce((acc, kwg) => acc 
            + getSeparator(acc) 
            + kwg.name 
            + ' (' 
            + kwg.items.reduce((acc, item) => acc + getSeparator(acc) + item.name) 
            + ')')
      }. Can you write 50 to 150 words for this company (first person writing)?`);
    workHistoryPrompts.forEach((w, index) => console.log(`workHistoryPrompt [${index}] =\n${w}`));
    /** The job responsibilities message */
    const prompt2 = `I am writing a CV, my details are name: ${
        fullName
      } . I work in the following skills: ${
        getStringFromArray(skillGroupsArray)
      }. Can you write 10 points for a CV on what I am good at?`;
    /** The job achievements message */
    const prompt3 = `I am writing a CV, my details are name: ${
        fullName
      }. During my years I worked at ${
        workArray.length
      } companiesr. ${
        remainderText
      } Can you write me 50 words for each company seperated in numbers of my succession in the company (in first person)?`;
    /** Generate a GPT-3 result */
    // console.log('prompt1 = ', prompt1);
    const objective = await gptFunction(prompt1);
    // console.log('prompt2 = ', prompt2);
    const keyPoints = await gptFunction(prompt2);
    // console.log('prompt3 = ', prompt3);
    const jobResponsibilities = await gptFunction(prompt3);
    const response = await workHistoryPrompts.map(async (w) => await gptFunction(w));
    response.forEach((r, index) => console.log(`response [${index}] =\n${r}`));
    /** Put them into an object */
    const chatGptData = { objective , keyPoints, jobResponsibilities };
    /** Log the result */
    const data = { ...newEntry, ...chatGptData };
    // console.log('data =\n', data);
    database.push(data);
    res.json({
      message: 'Request successful!',
      data: data,
    });
});

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});

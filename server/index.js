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


app.post('/cv/create', upload.single('headshotImage'), async (req, res) => {
    const {
      fullName,
      tels,
      email,
      technologies,
      skills,
      workHistory /** JSON format*/
    } = req.body;
    const workArray = JSON.parse(workHistory); /** an array */
    const telsArray = JSON.parse(tels); /** an array */
    const technologiesArray = JSON.parse(technologies); /** an array */
    const skillsArray = JSON.parse(skills); /** an array */
    /** Group the values into an object */
    const newEntry = {
      id: randomUUID(),
      fullName,
      imageUrl: req.file && `http://localhost:4000/uploads/${req.file.filename}`,
      tels: telsArray,
      email,
      technologies: technologiesArray,
      skills: skillsArray,
      workHistory: workArray
    };
    // console.log('newEntry =\n', newEntry);
    /** Reduces the items in the workArray and convert them to a string */
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
    console.log('remainderText =\n', remainderText);
    console.log('technologiesArray =', technologiesArray);
    const technologiesString = technologiesArray.reduce((res, e) => {
      console.log('res =', res, '; !res.length? ', !res.length, '; e.technology = ', e.technology);
      return res + (!res.length ? '' : ', ') + e.technology;
    }, '');
    const skillsString = skillsArray.reduce((res, e) => res + (!res.length ? '' : ', ') + e.skill, '');
    /** The job description message */
    const prompt1 = `I am writing a CV, my name is ${
        fullName
      }. I work with the following technologies: ${
        technologiesString
      }. I have the following skills: ${
        skillsString
      }. Can you write a 100 words description of my skills and technology experience for the top of the CV (first person writing)?`;
    /** The job responsibilities message */
    const prompt2 = `I am writing a CV, my details are name: ${
        fullName
      } . I write in the technologies: ${
        technologiesString
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
    console.log('prompt1 = ', prompt1);
    const objective = await gptFunction(prompt1);
    console.log('prompt2 = ', prompt2);
    const keyPoints = await gptFunction(prompt2);
    console.log('prompt3 = ', prompt3);
    const jobResponsibilities = await gptFunction(prompt3);
    /** Put them into an object */
    const chatGptData = { objective , keyPoints, jobResponsibilities };
    /** Log the result */
    const data = { ...newEntry, ...chatGptData };
    database.push(data);
    res.json({
      message: 'Request successful!',
      data: data,
    });
});

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});

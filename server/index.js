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

const GPTFunction = async (messagesArr) => {
  try {
    const response = await openAI.chat.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      messages: messagesArr,
      // temperature: 0.6,
      // max_tokens: 250,
      // top_p: 1,
      // frequency_penalty: 1,
      // presence_penatly: 1
    });
    return response.data.choices[0].text;
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
  limits: { fileSize: 1024 * 1024 * 5 }
});

const waitForMinute = async () => new Promise(resolve => setTimeout(resolve, 1000 * 61));

app.post('/cv/create', upload.single('headshotImage'), async (req, res) => {
    const {
      fullName,
      currentPosition,
      currentLength,
      currentTechnologies,
      workHistory /** JSON format*/
    } = req.body;
    const workArray = JSON.parse(workHistory); /** an array */
    /** Group the values into an object */
    const newEntry = {
      id: randomUUID(),
      fullName,
      image_url: `http://localhost:4000/uploads/${req.file.filename}`,
      currentPosition,
      currentLength,
      currentTechnologies,
      workHistory: workArray
    };
    /** Reduces the items in the workArray and convert them to a string */
    const remainderText = workArray
      .reduce((res, e) => res + ` ${e.name} as a ${e.position}.`, '');
    // console.log('remainderText =', remainderText);
    /** The job description message */
    const message0 = { role: 'system', content: 'You are a helpful assistant'};
    const message1 = { role: 'user', content: `I am writing a CV, my details are `
      + `\n name: ${fullName} `
      + `\n role: ${currentPosition} (${currentLength} years). `
      + `\n I write in the technologies: ${currentTechnologies}. `
      + `Can you write a 100 words description for the top of the CV (first person writing)?` };
    /** The job responsibilities message */
    const message2 = { role: 'user', content: `I am writing a CV, my details are `
      + `\n name: ${fullName} `
      + `\n role: ${currentPosition} (${currentLength} years). `
      + `\n I write in the technologies: ${currentTechnologies}. `
      + `Can you write 10 points for a CV on what I am good at?` };
    /** The job achievements message */
    const message3 = { role: 'user', content: `I am writing a CV, my details are`
      + `\n name: ${fullName}`
      + `\n role: ${currentPosition} (${currentLength} years).`
      + `\n During my years I worked at ${workArray.length} companies.${remainderText}`
      + `\n Can you write me 50 words for each company seperated in numbers of my succession `
      + `in the company (in first person)?` };
    /** Generate a GPT-3 result */
    const messages = [message0, message1, message2, message3]
    console.log('Sending OpenAI request message1...')
    const objective = await GPTFunction(messages);
    // await waitForMin();
    // console.log('Sending OpenAI request message2...')
    // const keypoints = await GPTFunction(message2);
    // await waitForMin();
    // console.log('Sending OpenAI request message3...')
    // const jobResponsibilities = await GPTFunction(message3);
    /** Put them into an object */
    const chatGptData = { objective } ///, keypoints, jobResponsibilities };
    /** Log the result */
    console.log(chatGptData);
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

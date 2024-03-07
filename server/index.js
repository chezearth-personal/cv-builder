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
      // response_format: { type: "json_object" },
      // messages: messagesArr,
      temperature: 0.6,
      // max_tokens: 250,
      top_p: 1,
      frequency_penalty: 1,
      // presence_penatly: 1
    });
    // let response;
    // for await (const chunk of stream) {
      // console.log('chunk =', chunk.choices[0]?.delta?.content || '');
      // response = (response.length > 0 ? response + ' ' : response) + (chunk.choices[0]?.delta?.content || '');
    // }
    console.log('response.choices[0] =', response.choices.length > 0 ? response.choices[0]?.message?.content : 'No response from ChatGPT');
    return response.choices.length > 0 ? response.choices[0]?.message?.content : 'No response from ChatGPT';
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

// const waitForMinute = async () => new Promise(resolve => setTimeout(resolve, 1000 * 61));

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
    console.log('remainderText =', remainderText);
    /** The job description message */
    // const message0 = { role: 'system', content: 'You are a helpful assistant'};
    const prompt1 = `I am writing a CV, my details are name: ${
        fullName
      } role: ${currentPosition} (${currentLength} years). I write in the technologies: ${
        currentTechnologies
      }. Can you write a 100 words description for the top of the CV (first person writing)?`;
    // console.log('Sending OpenAI request message0...', message0);
    // console.log('Sending OpenAI request message1...', message1);
    /** The job responsibilities message */
    const prompt2 = `I am writing a CV, my details are name: ${
        fullName
      } role: ${currentPosition} (${currentLength} years). I write in the technologies: ${
        currentTechnologies
      }. Can you write 10 points for a CV on what I am good at?`;
    /** The job achievements message */
    const prompt3 = `I am writing a CV, my details are name: ${
        fullName
      } role: ${currentPosition} (${currentLength} years). During my years I worked at ${
        workArray.length
      } companies.${
        remainderText
      }. Can you write me 50 words for each company seperated in numbers of my succession in the company (in first person)?`;
    // console.log('Sending OpenAI request message2...', message2);
    // console.log('Sending OpenAI request message3...', message3);
    /** Generate a GPT-3 result */
    // const prompts = [prompt1, prompt2, prompt3];
    console.log('Getting OpenAI objective: ', prompt1);
    const objective = await gptFunction(prompt1);
    // await waitForMin();
    console.log('Getting OpenAI key points:', prompt2);
    const keyPoints = await gptFunction(prompt2);
    // await waitForMin();
    console.log('Gending OpenAI job Responsibilities:', prompt3);
    const jobResponsibilities = await gptFunction(prompt3);
    /** Put them into an object */
    const chatGptData = { objective , keyPoints, jobResponsibilities };
    /** Log the result */
    console.log('chatGptData =', chatGptData);
    const data = { ...newEntry, ...chatGptData };
    // const data = await messages
      // .map(gptFunction)
      // .reduce((r, e) => Object.assign(r, chatGptData: ), newEntry); //{ ...newEntry, ...chatGptData };
    console.log('data =', data);
    database.push(data);
    res.json({
      message: 'Request successful!',
      data: data,
    });
});

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});

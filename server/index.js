import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';

const app = express();
/** Environment: host and port have defaults */
const host = process.env.HOST_KEY || 4000;
const port = process.env.PORT_KEY || 'Localhost';
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET_KEY
});
// console.log(host, ':', port, randomUUID());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/api', (req, res) => {
  res.json({
    message: `Welcome to the CV-Builder backend!`
  });
});

const GPTFunction = async (text) => {
  try {
    const response = await openAI.chat.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      propmt: text,
      temperature: 0.6,
      max_tokens: 250,
      top_p: 1,
      frequency_penalty: 1,
      presence_penatly: 1
    });
    return response.data.choices[0].text;
  } catch(err) {
    if (err) {console.log('err =\n', err)}
    return 'Error from ChatGPT means we dunno.';
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

const waitForMin = () => new Promise(resolve => setTimeout(resolve, 1000 * 70));

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
    /** The job description prompt */
    const prompt1 = `I am writing a CV, my details are `
      + `\n name: ${fullName} `
      + `\n role: ${currentPosition} (${currentLength} years). `
      + `\n I write in the technologies: ${currentTechnologies}. `
      + `Can you write a 100 words description for the top of the CV (first person writing)?`;
    /** The job responsibilities prompt */
    const prompt2 = `I am writing a CV, my details are `
      + `\n name: ${fullName} `
      + `\n role: ${currentPosition} (${currentLength} years). `
      + `\n I write in the technologies: ${currentTechnologies}. `
      + `Can you write 10 points for a CV on what I am good at?`;
    /** The job achievements prompt */
    const prompt3 = `I am writing a CV, my details are`
      + `\n name: ${fullName}`
      + `\n role: ${currentPosition} (${currentLength} years).`
      + `\n During my years I worked at ${workArray.length} companies.${remainderText}`
      + `\n Can you write me 50 words for each company seperated in numbers of my succession `
      + `in the company (in first person)?`;
    /** Generate a GPT-3 result */
    console.log('Sending OpenAI request prompt1...')
    const objective = await GPTFunction(prompt1);
    await waitForMin();
    console.log('Sending OpenAI request prompt2...')
    const keypoints = await GPTFunction(prompt2);
    await waitForMin();
    console.log('Sending OpenAI request prompt3...')
    const jobResponsibilities = await GPTFunction(prompt3);
    /** Put them into an object */
    const chatGptData = { objective, keypoints, jobResponsibilities };
    /** Log the result */
    console.log(chatGptData);
    res.json({
      message: 'Request successful!',
      data: chatGptData,
    });
});

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});

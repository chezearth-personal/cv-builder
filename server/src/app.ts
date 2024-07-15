import 'dotenv/config';
import config from 'config';
import express, { NextFunction, Request, Response } from 'express';
// import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { randomUUID } from 'crypto';
// import { exit } from 'process';
import { AppDataSource } from './utils/data-source';
import { validateEnv } from './utils/validate-env';
import { logger, successHandler, errorHandler } from './utils/logger';
import { gptFunction } from './middleware/open-ai';

/** Useful text function */
const plurals = (
  n: number,
  singular: string,
  plural: string
): string => n === 1 ? singular : plural;

AppDataSource.initialize()
  .then(() => {
    logger.log('INFO', 'Database initialized');
    /** Validate environment variables */
    validateEnv();
    /** File size constants and text organisation */
    const imageFileSize = 1024 * 1024 * Number(
      config.get<string>('imageFileSizeMb') || 5
    );
    /** Create strings from arrays for returning as lists to document */
    const commaSep = (t: string): string => !t.length ? '' : ', ';
    const testArray = (
      arr: Array<string>,
      trueStr: string, 
      falseStr: string
    ): string => arr  && arr.length > 0 ? trueStr : falseStr;
    const getStringFromArray = (
      homeTopics: Array<any>
    ): string => !homeTopics || !Array.isArray(homeTopics)
      ? ''
      : homeTopics.reduce(
        (res: string, itemGroup) => `${res}${commaSep(res)}${itemGroup.name}${
            testArray(itemGroup.itemList, ' (', '')
          }${
            testArray(itemGroup.itemList, getStringFromArray(itemGroup.itemList), '')
          }${
            testArray(itemGroup.itemList, ')', '')
          }`,
        ''
      );
    /** Start express */
    const app = express();
    /** MIDDLEWARE */
    /** 1. Body parser */
    app.use(express.json({ limit: '100kb' }));
    app.use(express.urlencoded({ extended: true }));
    /** 2. Logger */
    app.use(successHandler);
    app.use(errorHandler);
    /** 3. Cookie parser */
    // app.use(cookieParser());
    /** 4. CORS */
    app.use(
      // cors()
      cors({
        origin: config.get<string>('origin'),
        credentials: true
      })
    );
    /** ROUTES */
    /** 5. file uploads for images */
    app.use('/uploads', express.static('uploads'));
    /** 6. Main GET request */
    app.get('/api', (req, res) => {
      res.json({
        message: `Welcome to the CV-Builder backend!`
      });
    });
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
      // logger.debug(`req.body =\n ${JSON.stringify(req.body)}`);
      // logger.debug(`req.headers =\n ${JSON.stringify(req.headers)}`);
      const {
        fullName,
        occupation,
        tel,
        email,
        website,
        skillTopics,   /** JSON format */
        companyDetails /** JSON format */
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
      logger.log('DEBUG', 'companyKeyPhrases = ' + companyKeyPhrases);
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
      // database.push(data);
      res.json({
        message: 'Request successful!',
        data: data,
      });
    });
    /** START THE SERVER */
    const port = config.get<number>('port');
    app.listen(port);
    logger.log('INFO',`Server started on port ${port}`);
  });

/** Environment: host and port have defaults */
// const host = process.env.HOST || 4000;
// const port = process.env.PORT || 'localhost';


/** Database. For now, just an array*/
// let database = [];

// const app = express();
// app.use(express.json());
// app.use(cors());
/** Set up http logging */
// app.use(successHandler);
// app.use(errorHandler);





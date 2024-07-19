import path from 'path';
import config from 'config';
import express from 'express';
import multer from 'multer';
import { logger } from '../utils/logger';
import { randomUUID } from 'crypto';
import { buildPrompts, gptFunction } from '../controllers/open-ai';

type ItemList = {
  name: string
};
type SkillTopic = {
  name: string,
  itemList: Array<ItemList>
};
type keyPhraseTopic = {
  name: string,
  itemList: Array<ItemList>
};
type CompanyDetail = {
  name: string,
  position: string,
  startDate: string,
  endDate: string,
  isCurrent: boolean,
  keyPhraseTopics: Array<keyPhraseTopic>
  workPrompt: string
};
type CompanyKeyPhrase = {
  duration: string,
  name: string,
  position: string,
  startDate: string,
  endDate: string,
  isCurrent: boolean,
  workPrompt: string,
  keyPhraseTopics: Array<keyPhraseTopic>,
  keyPhraseText: string
};

/** ? Useful text function */
const plurals = (
  n: number,
  singular: string,
  plural: string
): string => n === 1 ? singular : plural;
/** ? Create strings from arrays for returning as lists to document */
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
/** ? File size constants and text organisation */
const imageFileSize = 1024 * 1024 * Number(
  config.get<string>('imageFileSizeMb') || 5
);
/** ? File upload */
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

export const Router = express.Router();

/** ? The main route for accepting data amd generating the CV */
Router.post('/create', validate(req.body), upload.single('headshotImage'), buildPrompts(req.body));
Router.post('/create', upload.single('headshotImage'), async (req, res) => {
});

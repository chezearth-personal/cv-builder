import OpenAI from 'openai';
import { logger } from './logger';
import { CvInput } from '../schemas/cv.schema';

/** ? Helper functons */

/** ? Connector to OpenAI */
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET_KEY
});

/** ? The functions takes the input data and returns an array of prompts for */
/** ? OpenAI to generate the resume. */
export const buildPrompts = (cvInput: CvInput) => {
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
  } = cvInput;
  const skillTopicsArray: Array<SkillTopic> = JSON.parse(skillTopics); /** an array */
  const companyDetailsArray: Array<CompanyDetail> = JSON.parse(companyDetails); /** an array */
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
  const duration = (
    startDate: string,
    isCurrent: boolean,
    endDate: string
  ): string => {
    const elapsedMillis = Date.parse(!isCurrent ? endDate : (new Date).toDateString()) - Date.parse(startDate);
    const elapsedMonths = Math.floor(elapsedMillis / (3600000 * 24 * 30.4375) + 1);
    const elapsedYears = Math.floor(elapsedMonths / 12)
    const remMonths = elapsedMonths % 12;
    return `${
        elapsedYears
      } year${
        plurals(elapsedYears, '', 's')
      } ${
        remMonths
      } month${
        plurals(remMonths, '', 's')
      }`
  }
  const getSeparator = (
    s: string,
    c: string
  ): string => s === '' ? '' :  `${c} `;
  /** The profile prompt message */
  const profilePrompt = `I am writing a CV, my name is ${
      fullName
    }. I have the following skills: ${
      getStringFromArray(skillTopicsArray)
    }. Can you write a 50 to 300 words description of my skills and technology experience for the top of the CV (first person writing)?`;
  /** Work history keyPhrases combined into a text string and appended */
  const companyKeyPhrases: Array<CompanyKeyPhrase> = companyDetailsArray.map(companyDetail => ({
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
  const companyPrompts = companyKeyPhrases.map(companyKeyPhrase => (
    { ...companyKeyPhrase, ...{ workPrompt: `I am writing a CV, my name is ${
        fullName
      }. I worked at ${companyKeyPhrase.name} as a ${companyKeyPhrase.position} for ${
        duration(companyKeyPhrase.startDate, companyKeyPhrase.isCurrent, companyKeyPhrase.endDate)
      }. My work involved the following points: ${
        companyKeyPhrase.keyPhraseText
      }. Can you write 50 to 300 words for this company, using paragraphs and in an exciting, interesting tone (first person writing)?` } }));
  logger.log('DEBUG', 'companyPrompts = ' + companyPrompts);
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
}

/** ? This function takes the prompts and returns the generated resume. */
export const gptFunction = async (text: string) => {
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
    return err && err.message
      ? `Status: ${err.status}, ${err.message}`
      : 'Error from ChatGPT means we don\'t know.';
  }
}

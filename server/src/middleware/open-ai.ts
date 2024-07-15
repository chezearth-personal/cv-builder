import OpenAI from 'openai';
import { logger, successHandler, errorHandler } from '../utils/logger';

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET_KEY
});
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
    if (err) errorHandler(err);
    return err && err.error && err.error.message
      ? `Status: ${err.status}, ${err.error.message}`
      : 'Error from ChatGPT means we don\'t know.';
  }
}

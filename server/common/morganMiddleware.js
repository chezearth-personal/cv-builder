import morgan from 'morgan';
import 'dotenv/config';
import logger from './logger.js';

morgan.token('message', (req, res) => res.statusMessage || '');
const getIPFormat = () => process.env.ENVIRONMENT === 'production' ? ':remote-addr - ' : '';
const successResponseFormat = `${getIPFormat()}:method :url HTTP/:http-version :status :res[content-length] - :response-time ms`;
const errorResponseFormat = `${getIPFormat()}:method :url HTTP/:http-version :status :res[content-length] - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.http(message.trim()) }
})
const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) }
});

export { successHandler, errorHandler };

import 'dotenv/config'
import morgan from 'morgan';
import Winston, { createLogger, format, transports } from 'winston';

const levels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
    trace: 6
  },
  colors: {
    fatal: 'bold red cyanBG',
    error: 'bold red',
    warn: 'yellow',
    info: 'cyan',
    http: 'magenta',
    debug: 'blue',
    trace: 'grey'
  }
};
const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

morgan.token('message', (req, res) => res.statusMessage || '');
const getIPFormat = () => process.env.NODE_ENV === 'production' ? ':remote-addr - ' : '';
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

const logger = createLogger({
    levels: levels.levels,
    level: process.env.NODE_ENV === 'development' ? 'trace' : 'http',
    format: format.combine(
      enumerateErrorFormat(),
      format.timestamp(),
      process.env.NODE_ENV === 'development'
        ? format.colorize()
        : format.uncolorize(),
      format.splat(),
      format.printf(({ level, timestamp, message }) => `[${(`${level}`)}] ${
        (`${level}`).length - 20 === 4 ? ' ' : ''
      }${timestamp} ${message}`)
    ),
    transports: [ new transports.Console() ]
  });

Winston.addColors(levels.colors);

export { logger, successHandler, errorHandler };

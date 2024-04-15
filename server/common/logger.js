import 'dotenv/config'
import { createLogger, format, transports } from 'winston';

// const logLevels = {
  // fatal: 0,
  // error: 1,
  // warn: 2,
  // info: 3,
  // http: 4,
  // debug: 5,
  // trace: 6
// };
const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = createLogger({
    // levels: logLevels,
    level: process.env.ENVIRONMENT === 'development' ? 'silly' : 'http',
    // format: format.cli(),
    format: format.combine(
      enumerateErrorFormat(),
      format.timestamp(),
      format.colorize(),
      process.env.ENVIRONMENT === 'development'
        ? format.colorize()
        : format.uncolorize(),
      format.splat(),
      format.printf(({ level, timestamp, message }) => `[${(`${level}`)}] ${
        (`${level}`).length - 20 === 4 ? ' ' : ''
      }${timestamp} ${message}`)
    ),
    transports: [ new transports.Console() ]
  });

export default logger;

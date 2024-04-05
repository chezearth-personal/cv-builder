import Morgan from 'morgan';
import 'dotenv/config'
import { createLogger, format, transports } from 'winston';

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
  trace: 6
};
const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
  // // return (info instanceof Error) ? {...info, ...{ message: info.stack }} : info;
});
// const logger = createLogger({
  // levels: logLevels,
  // format: format.combine(
    // format.timestamp()
  // ),
  // transports: [ new transports.Console({  }) ]
// });
const customFormat = format.printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`);
const logger = createLogger({
  // levels: logLevels,
  level: process.env.ENVIRONMENT === 'development' ? 'silly' : 'http',
  // format: format.cli(),
  format: format.combine(
    // enumerateErrorFormat(),
    format.colorize(),
    // process.env.ENVIRONMENT === 'development'
      // ? format.colorize()
      // : format.uncolorize(),
    // format.splat(),
    // customFormat
    format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [ new transports.Console() ]
});

export default logger;

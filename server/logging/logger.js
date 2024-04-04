import Morgan from 'morgan';
import 'dotenv/config'
import Winston from 'winston';

const enumerateErrorFormat = Winston.format(info => {
  return (info instanceof Error) ? {...info, ...{ message: info.stack }} : info;
}

const logger = Winston.createLogger({
  level: process.env.ENVIRONMENT === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    process.env.ENVIRONMENT === 'development'
      ? Winston.format.colorize()
      : Winston.format.uncolorize(),
    Winston.format.splat(),
    Winston.format.printf({ level, message } => `${level}: ${message}`)
  ),
  transports: [
    new Winston.transports.Console({
      stderrLevels: ['error'],
    })
  ]
});

export default logger;

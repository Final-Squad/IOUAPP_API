const { createLogger, format, transports } = require('winston');
const { timestamp, combine, printf, errors, json } = format;

const prodLogger = () => {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    // defaultMeta: { service: 'api' }, // remember to specify what service is logging
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'logger/error.log', level: 'error' }),
      new transports.File({ filename: 'logger/combined.log' }),
    ],
  });
}

const devLogger = () => {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `[ ${level} ] ${timestamp}: ${stack || message}`;
  });

  return createLogger({
    level: 'debug',
    format: combine(
      format.colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [new transports.Console()],
  });
}

const logger = process.env.NODE_ENV === 'development' ? devLogger() : prodLogger();

module.exports = logger;

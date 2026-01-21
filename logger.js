const { createLogger, transports, format, level } = require("winston");
const { printf } = format;
const simpleFormat = printf(({ level, message, timestamp, ...data }) => {
  return `${timestamp}: ${level}|${message}-->${data}`;
});
const logger = createLogger({
  level: "http",
  format: format.combine(simpleFormat, format.json(), format.timestamp()),
  transports: [
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new transports.File({ filename: "./logs/all.log" }),
    new transports.Console(),
  ],
});
module.exports = { logger };

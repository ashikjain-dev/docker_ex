const { createLogger, transports, format, level } = require("winston");
const { printf } = format;
const simpleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}: ${level}|${message}`;
});
const logger = createLogger({
  level: "http",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new transports.File({ filename: "./logs/all.log" }),
    new transports.Console(),
  ],
});
module.exports = { logger };

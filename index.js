const express = require("express");
const { rateLimit } = require("express-rate-limit");
require("dotenv").config();
const { logger } = require("./logger");
const { level } = require("winston");
const PORT = process.env.PORT || 3000;
const basicLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: { data: "Too many requests, please try again later." },
  standardHeaders: "draft-8",
});
const app = express();
app.use(basicLimiter);
app.use((req, res, next) => {
  logger.http("request recived", {
    url: req.originalUrl,
    method: req.method,
  });
  next();
});
app.get("/", (req, res, next) => {
  res.json({ data: "ok" });
});
app.use("/", (req, res, next) => {
  res.status(404).json({ data: "not implemented." });
  logger.http("not implemented route", {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
  });
});
app.listen(PORT, () => {
  logger.info("server started", {
    level: "info",
    port: PORT,
  });
});

const validator = require("validator");
const { logger } = require("../logger");
const { getDB } = require("../config/mongo");
const { encrypt, decrypt } = require("../utils/encryptdecrypt");
/**
 * for signin : validate email
 * for signup : validate email,password(strong password),firstName,lastName and age
 */
const validateSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        data: "mandatory fields are: email and password",
      });
      return;
    }
    if (!validator.isEmail(email)) {
      res.status(400).json({ data: "give proper email." });
      return;
    }
    if (validator.isEmpty(password) || String(password).length < 8) {
      res.status(400).json({
        data: "password must not be empty or less than 8 characters",
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ data: "something went wrong" });
    logger.http("server error", {
      statusCode: res.statusCode,
      error: error,
      method: req.method,
      url: req.originalUrl,
    });
  }
};

const validateSignUp = (req, res, next) => {
  try {
    const { email, password, firstName, lastName, age } = req.body;
    if (!email || !password || !firstName || !age) {
      res.status(400).json({
        data: "mandatory fields are: email, password, firstName and age.",
      });
      return;
    }
    if (!validator.isEmail(email)) {
      res.status(400).json({ data: "give proper email." });
      return;
    }
    if (!validator.isStrongPassword(password)) {
      res.status(400).json({
        data: "password must contain minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
      });
      return;
    }
    if (validator.isEmpty(firstName) || String(firstName).length > 10) {
      res.status(400).json({
        data: "first Name must contain atleast one character and less than 10 characters",
      });
      return;
    }
    if (isNaN(age) || age <= 14) {
      res
        .status(400)
        .json({ data: "age must me a number and greater than 14" });
      logger.error("bad age value received", {
        statusCode: res.statusCode,
        details: res.data,
        ageValue: age,
      });
      return;
    }
    if (!isNaN(lastName) || String(lastName).length > 10) {
      res.status(400).json({
        data: "last name must contain atleast one character and less than 10 characters",
      });
      return;
    }
    if (!lastName) {
      req.body.lastName = "";
    }
    next();
  } catch (error) {
    res.status(500).json({ data: "something went wrong" });
    logger.http("server error", {
      statusCode: res.statusCode,
      error: error,
      method: req.method,
      url: req.originalUrl,
    });
  }
};
/**
 * validate article information
 * it must contain article title(less than 20 characters),description,tags(optional)
 */
const validateArticle = (req, res, next) => {
  try {
    if (!req.body) {
      res.status(400).json({
        data: "please send the request body in the json format",
      });
      return;
    }
    let { title, description, tags } = req.body;
    if (!title || !description) {
      res.status(400).json({
        data: "mandatory fields are: title and description.",
      });
      return;
    }
    title = validator.trim(title);
    if (validator.isEmpty(title) || String(title).length > 50) {
      res.status(400).json({
        data: "Title of the article must contain atleast 1 character and upto 50 characters",
      });
      return;
    }
    description = validator.trim(description);
    if (validator.isEmpty(description) || String(description).length > 200) {
      res.status(400).json({
        data: "Description of the article must contain atleast 1 character and upto 200 characters",
      });
      return;
    }
    req.body.title = title;
    req.body.description = description;
    if (!tags) {
      req.body.tags = "";
    }
    if (req.body.tags !== "") {
      req.body.tags = validator.trim(req.body.tags);
      req.body.tags = req.body.tags.split(",");
    } else {
      req.body.tags = [];
    }
    next();
  } catch (error) {
    res.status(500).json({ data: "something went wrong" });
    logger.http("server error", {
      statusCode: res.statusCode,
      error: error.message,
      method: req.method,
      url: req.originalUrl,
    });
  }
};
module.exports = { validateSignIn, validateSignUp, validateArticle };

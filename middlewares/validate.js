const validator = require("validator");
const { logger } = require("../logger");
/**
 * for signin : validate email
 * for signup : validate email,password(strong password),firstName,lastName and age
 */
const validateSignIn = (req, res, next) => {};

const validateSignUp = (req, res, next) => {
  try {
    const { email, password, firstName, lastName, age } = req.body;
    if (!email || !password || !firstName) {
      res
        .status(400)
        .json({ data: "mandatory fields are: email,password and firstName." });
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
        ageValue: req.body.age,
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
      req.body.lastName = null;
    }
    if (!age) {
      req.body.age = null;
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

module.exports = { validateSignIn, validateSignUp };

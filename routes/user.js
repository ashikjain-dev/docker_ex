const express = require("express");
const { logger } = require("../logger");
const { validateSignIn, validateSignUp } = require("../middlewares/validate");
const { getDB } = require("../config/mongo");
const userRoutes = express.Router();
/**
 * signin route takes email and password and generates json web token and add that to cookie and send back the response
 * signup route takes email , password,firstName,lastName and age and encrypt the information and stores in the database
 *  / -> get user information.
 */
userRoutes.get("/", (req, res, next) => {
  try {
  } catch (error) {}
});
userRoutes.post("/signin", (req, res, next) => {
  try {
    const { email, password } = req.body;
  } catch (error) {}
});

userRoutes.post("/signup", validateSignUp, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, age } = req.body;
    const db = await getDB();
    await db
      .collection("users")
      .insertOne({ email, password, firstName, lastName, age });
    res.status(201).json({ data: "created" });
  } catch (error) {
    res.status(500).json({ data: "something went wrong" });
    logger.error("server error", {
      statusCode: res.statusCode,
      error: error.message,
      stack: error.stack,
      method: req.method,
      url: req.originalUrl,
    });
  }
});
module.exports = { userRoutes };

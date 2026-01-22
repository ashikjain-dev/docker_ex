const express = require("express");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { logger } = require("../logger");
const {
  validateSignIn,
  validateSignUp,
  authenticate,
} = require("../middlewares/");
const { getDB } = require("../config/mongo");
const { encrypt, decrypt } = require("../utils/encryptdecrypt");
const userRoutes = express.Router();
const jsonSecretkey = process.env.JSONWEBTOKEN_KEY;

/**
 * signin route takes email and password and generates json web token and add that to cookie and send back the response
 * signup route takes email , password,firstName,lastName and age and encrypt the information and stores in the database
 *  / -> get user information.
 */
userRoutes.get("/", authenticate, async (req, res, next) => {
  try {
    console.log("in / route", req.id);
    const db = await getDB();
    const userInfo = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.id) });
    if (!userInfo) {
      res.status(400).json({ data: "user data not found" });
      logger.info("user data not found in the mongodb", {
        userId: req.id,
      });
      return;
    }
    const email = decrypt(userInfo.email);
    const firstName = decrypt(userInfo.firstName);
    const lastName = decrypt(userInfo.lastName);
    const age = decrypt(userInfo.age);
    res.json({ email, firstName, lastName, age });
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
userRoutes.post("/signin", (req, res, next) => {
  try {
    const { email, password } = req.body;
  } catch (error) {}
});

userRoutes.post("/signup", validateSignUp, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, age } = req.body;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const db = await getDB();
    const resFromDB = await db.collection("users").insertOne({
      email: encrypt(email),
      password: hashedPassword,
      firstName: encrypt(firstName),
      lastName: encrypt(lastName),
      age: encrypt(age),
    });
    const payload = { id: resFromDB.insertedId.toString() };
    const token = jsonwebtoken.sign(payload, jsonSecretkey, {
      expiresIn: "15m",
    });
    res.cookie("token", token, { maxAge: 1000 * 60 * 15 });
    res.status(201).json({ data: resFromDB });
    logger.http("inserted to mongodb is successfull.", {
      statusCode: res.statusCode,
      info: resFromDB,
    });
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

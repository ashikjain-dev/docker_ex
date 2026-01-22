//connect to the mongodb and return db
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { logger } = require("../logger");
const URL = process.env.MONGODB_URL;
let db;
async function connectDB() {
  try {
    const client = await MongoClient.connect(URL, {
      maxPoolSize: 20,
      minPoolSize: 10,
    });
    logger.info("mongo connection is successful");
    db = client.db("blogs");
    return client;
  } catch (error) {
    throw new Error(error);
  }
}
async function getDB() {
  try {
    if (!db) {
      logger.warn("new mongodb connection is going to establish.");
      await connectDB();
    }
    logger.info("access to db is successful.");
    return db;
  } catch (error) {
    logger.error("connection failed", {
      errorMessage: error.message,
      details: error.stack,
    });
    process.exit(1);
  }
}

module.exports = { getDB, connectDB };

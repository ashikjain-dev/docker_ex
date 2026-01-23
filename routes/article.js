const express = require("express");
const { ObjectId } = require("mongodb");
const { authenticate } = require("../middlewares");
const { validateArticle } = require("../middlewares/validate");
const { getDB } = require("../config/mongo");
const { logger } = require("../logger");
const { decrypt } = require("../utils/encryptdecrypt");
const articleRoutes = express.Router();
articleRoutes.post(
  "/create",
  authenticate,
  validateArticle,
  async (req, res, next) => {
    try {
      const { title, description, tags } = req.body;
      const db = await getDB();
      const payload = {
        userId: new ObjectId(req.id),
        title,
        description,
        tags,
        createdAt: new Date(),
      };
      const resFromDB = await db.collection("articles").insertOne(payload);
      res.status(201).json({ data: resFromDB });
      logger.info("insert to article collection is successful.", {
        info: resFromDB,
        statusCode: res.statusCode,
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
  },
);
articleRoutes.get("/", async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    limit = Number(limit) > 30 ? 10 : Number(limit);
    const offset = Number(page) - 1;
    const db = await getDB();
    const resFromDB = await db
      .collection("articles")
      .aggregate([
        { $skip: offset },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "author_details",
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            tags: 1,
            createdAt: 1,
            "author_details.firstName": 1,
            _id: 0,
          },
        },
        {
          $unwind: {
            path: "$author_details",
          },
        },
      ])
      .toArray();
    for (let i = 0; i < resFromDB.length; i++) {
      resFromDB[i].author_details.firstName = decrypt(
        resFromDB[i].author_details.firstName,
      );
    }
    res.status(200).json({ data: resFromDB });
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
module.exports = { articleRoutes };

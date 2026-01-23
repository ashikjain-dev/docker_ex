const express = require("express");
const { authenticate } = require("../middlewares");
const { validateArticle } = require("../middlewares/validate");
const { getDB } = require("../config/mongo");
const { logger } = require("../logger");
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
        userId: req.id,
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
module.exports = { articleRoutes };

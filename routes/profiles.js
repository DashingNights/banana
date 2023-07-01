const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const authMiddleware = require("../middleware/authMiddleware");
const requireAuth = require("../middleware/requireAuth");
const { DiscordLogger } = require("../discordlogger/webhook");
const logger = new DiscordLogger();

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find();
    const updatedArticles = articles.map((article) => {
      article.title = article.title.replace(/\\u[\dA-F]{4}/gi, function (match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
      });
      return article;
    });
    res.render("components/profile/userProfile", {
      articles: updatedArticles,
      req: req,
    });
  } catch (err) {
    logger.logEvent(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

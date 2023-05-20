const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const authMiddleware = require('../middleware/authMiddleware');
const requireAuth = require('../middleware/requireAuth');
const { DiscordLogger } = require('../discordlogger/webhook');
const logger = new DiscordLogger();


router.get('/new', requireAuth, authMiddleware, (req, res) => {
  res.render('articles/new', { article: new Article() });
});

router.get('/edit/:id', requireAuth, authMiddleware, async (req, res) => {
    const article = await Article.findById(req.params.id);
    article.title = article.title.replace(/\\u[\dA-F]{4}/gi, function(match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
    res.render('articles/edit', { article: article });
  });

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect('/');
  article.title = article.title.replace(/\\u[\dA-F]{4}/gi, function(match) {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
  res.render('articles/show', { article: article });
});

router.post('/', requireAuth, authMiddleware, async (req, res, next) => {
  const article = new Article({
    title: req.body.title.split('').map(char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')).join(''),
    description: req.body.description,
    markdown: req.body.markdown,
    hashtags: req.body.hashtags,
    type: req.body.type
  });
  try {
    const newArticle = await article.save();
    
    res.redirect(`/articles/${newArticle.slug}`);
  } catch (err) {
    console.error(err);
    res.render('articles/new', { article: article });
  }
});


router.put('/:id', requireAuth, authMiddleware, async (req, res, next) => {
  req.article = await Article.findById(req.params.id);
  next();
}, saveArticleAndRedirect('edit'));

router.delete('/:id', requireAuth, authMiddleware, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.author = req.body.author;
    article.title = req.body.title.split('').map(char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')).join('');
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    article.hashtags = req.body.hashtags;
    article.type = req.body.type;
    try {
      article = await article.save();
      logger.logEvent('Article Edited', `Article ${article.title} was edited`);
      res.redirect(`/articles/${article.slug}`);
    } catch (err) {
      console.error(err);
      res.render(`articles/${path}`, { article: article });
    }
  };
}
module.exports = router;
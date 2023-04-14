const express = require('express')
const router = express.Router()
const Article = require('./../models/article')
const authMiddleware = require('../middleware/authMiddleware')
const requireAuth = require('../middleware/requireAuth')

router.get('/new', requireAuth, authMiddleware, (req, res) => {
    res.render('articles/new', {article: new Article()})
})

router.get('/edit/:id', requireAuth, authMiddleware, async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article})
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({slug: req.params.slug})
    if (article == null) res.redirect('/')
    res.render('articles/show', {article: article})
})

router.post('/', requireAuth, authMiddleware, async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))


router.put('/:id', requireAuth, authMiddleware, async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', requireAuth, authMiddleware, async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.hashtags = req.body.hashtags
        article.title = req.body.title
        // article.createdAt = req.body.date
        // console.log(article.createdAt)
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.author = req.body.author
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            console.log(e)
            res.render(`articles/${path}`, {article: article})
        }
    }
}

module.exports = router;
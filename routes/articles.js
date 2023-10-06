const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const { DiscordLogger } = require("../discordlogger/webhook");
const logger = new DiscordLogger();
const { auth, requiresAuth } = require("express-openid-connect");
const config = require("../config");
const ManagementClient = require("auth0").ManagementClient;
const auth0 = new ManagementClient(config.auth0.management);
const roleLookup = require("../functions/roleLookup");
const requiresRole = roleLookup;
router.get("/new", requiresAuth(), requiresRole("Administrator"), (req, res) => {
	res.render("new", { article: new Article() });
});

router.get("/edit/:id", requiresAuth(), requiresRole("Administrator"), async (req, res) => {
	const article = await Article.findById(req.params.id);
	article.title = Buffer.from(article.title, "base64").toString();
	res.render("edit", { article: article });
});

router.get("/:slug", async (req, res) => {
	try {
		const article = await Article.findOne({ slug: req.params.slug });
		if (article == null) {
			res.redirect("/");
		}
		article.title = Buffer.from(article.title, "base64").toString();
		res.render("show", {
			req: req,
			article: article,
		});
	} catch (error) {
		console.error(error);
	}
});

router.post("/", requiresAuth(), requiresRole("Administrator"), async (req, res, next) => {
	const article = new Article({
		title: Buffer.from(req.body.title).toString("base64"),
		description: req.body.description,
		markdown: req.body.markdown,
		hashtags: req.body.hashtags,
		type: req.body.type,
	});
	try {
		const newArticle = await article.save();

		res.redirect(`/articles/${newArticle.slug}`);
	} catch (err) {
		console.error(err);
		res.render("new", { article: article });
	}
});

router.put(
	"/:id",
	requiresAuth(),
	requiresRole("Administrator"),
	async (req, res, next) => {
		req.article = await Article.findById(req.params.id);
		next();
	},
	saveArticleAndRedirect("edit")
);

router.delete("/:id", requiresAuth(), requiresRole("Administrator"), async (req, res) => {
	await Article.findByIdAndDelete(req.params.id);
	res.redirect("/adminview");
});

function saveArticleAndRedirect(path) {
	return async (req, res) => {
		let article = req.article;
		article.author = req.body.author;
		article.title = Buffer.from(req.body.title).toString("base64");
		article.description = req.body.description;
		article.markdown = req.body.markdown;
		article.hashtags = req.body.hashtags;
		article.type = req.body.type;
		try {
			article = await article.save();
			res.redirect(`/articles/${article.slug}`);
		} catch (e) {
			console.error(e);
			res.render(`articles/${path}`, { article: article });
		}
	};
}
module.exports = router;

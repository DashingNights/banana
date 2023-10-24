const mongoose = require("mongoose");
const { marked } = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	author: {
		type: String,
		default: "Anonymous",
	},
	hashtags: {
		type: String,
		default: "#KnowYourThing",
		required: true,
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	markdown: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	type: {
		type: String,
		enum: ["Chinese", "English"],
		required: true,
	},
	sanitizedHtml: {
		type: String,
		required: true,
	},
	authorPictureURL: {
		type: String,
		default: "null",
	},
	contentType: {
		type: String,
		enum: ["article", "video"],
		required: true,
		default: "article",
	},
	youtubeUrl: {
		type: String,
		default: "",
	},
	userUpvoteCount: {
		type: Number,
		default: 0,
	},
});

articleSchema.pre("validate", function (next) {
	if (this.title) {
		this.slug = slugify(this.title, { lower: true, strict: true });
	}

	if (this.markdown) {
		this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
	}

	next();
});

module.exports = mongoose.model("Article", articleSchema);

const mongoose = require("mongoose");
const Article = require("../models/article"); // replace with your Article model path
const config = require("../config");

mongoose
.connect("mongodb://" + config.Mongodb.host + "/" + config.Mongodb.name, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false, 
	})	
    .then(() => {
		console.log("MongoDB connected...");
	})
	.catch((err) => console.log(err));

async function updateArticles() {
	try {
		const articles = await Article.find({});

		// Map each field name to its default value
		const defaults = {
			title: "Default title",
			description: "Default description",
			author: "Anonymous",
			hashtags: "#KnowYourThing",
			markdown: "Default markdown",
			type: "English", // Or 'Chinese', depending on your default
			sanitizedHtml: "Default sanitized HTML",
			authorPictureURL: "null",
			contentType: "article",
			youtubeUrl: "",
			userUpvoteCount: 0,
		};

		for (let article of articles) {
			let isModified = false;

			// Check if each parameter is defined and set a default value if it's not
			for (let field in defaults) {
				if (article[field] === undefined) {
					article[field] = defaults[field];
					isModified = true;
				}
			}

			// Save the article if any parameters were missing
			if (isModified) {
				await article.save();
			}
		}

		console.log("Finished updating articles");
	} catch (err) {
		console.error(err);
	}

	// Close the MongoDB connection
	mongoose.connection.close();
}

updateArticles();

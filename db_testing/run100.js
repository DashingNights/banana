const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Article = require("../models/article");
const config = require("../config");

// Connect to the database
mongoose
	.connect("mongodb://" + config.Mongodb.host + "/" + config.Mongodb.name, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch(() => console.log("Error connecting to MongoDB, is the service Online?"));
// Generate 100 sample articles
for (let i = 0; i < 100; i++) {
	// Generate a random title
	const title = btoa(faker.lorem.words(8));

	// Generate a random description
	const description = faker.lorem.words(90);

	// Generate a random markdown content
	const markdown = faker.lorem.paragraphs(10);
	const author = faker.person.fullName();
	const hashtags = "#" + faker.lorem.words(1);
	// Create a new article with the generated data
	const article = new Article({
		title: title,
		description: description,
		markdown: '![Sample image](https://i.ytimg.com/vi/kO5_uqfisD0/maxresdefault.jpg "image" ) ' + markdown,
		type: "English",
		author: author,
		hashtags: hashtags,
	});

	// Save the article to the database
	article
		.save()
		.then(() => console.log(`Saved article ${i + 1}`))
		.catch((err) => console.error(err));
}

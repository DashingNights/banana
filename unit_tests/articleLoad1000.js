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
  .catch(() =>
    console.log("Error connecting to MongoDB, is the service Online?")
  );
// Generate 100 sample articles
for (let i = 0; i < 100; i++) {
  // Generate a random title
  const title = btoa(faker.lorem.words(10));

  // Generate a random description
  const description = faker.lorem.words(10);

  // Generate a random markdown content
  const markdown = faker.lorem.paragraphs(10);
  const author = faker.person.fullName();
  const hashtags = string("#"+faker.lorem.words(6));

  // Create a new article with the generated data
  const article = new Article({
    title: title,
    description: description,
    markdown:
      '![Sample image](https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80 "image" ) ' +
      markdown,
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

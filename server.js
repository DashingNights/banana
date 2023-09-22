const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const config = require("./config");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { DiscordLogger } = require("./discordlogger/webhook");
const logger = new DiscordLogger();
const { auth, requiresAuth } = require('express-openid-connect');
const ManagementClient = require("auth0").ManagementClient;
const auth0 = new ManagementClient(config.auth0.management);
const auth0config = config.auth0.config;
const roleLookup = require("./functions/roleLookup");
const requiresRole = roleLookup;

app.use(auth(auth0config));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.use(
  session({
    secret: config.Session.token,
    resave: false,
    saveUninitialized: false,
  })
);

mongoose
  .connect("mongodb://" + config.Mongodb.host + "/" + config.Mongodb.name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, // Add this line
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(() =>
    console.log("Error connecting to MongoDB, is the service Online?")
  );

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(function (req, res, next) {
  // Check if the fbclid parameter is present in the request URL
  if (req.query.fbclid) {
    // Remove the fbclid parameter from the request URL
    const urlWithoutFbclid = req.originalUrl.replace(/[\?&]fbclid=[^&#]+/g, "");
    // Redirect the user to the same URL without the fbclid parameter
    return res.redirect(urlWithoutFbclid);
  }
  next();
});
app.use(function (req, res, next) {
  // Check if the fbclid parameter is present in the request URL
  if (req.query.fbclid) {
    logger.logEvent(
      "User from INSTAGERAM visited the homepage",
      req.headers["cf-connecting-ip"] ||
        req.headers["x-real-ip"] ||
        req.socket.remoteAddress
    );
    // Remove the fbclid parameter from the request URL
    const urlWithoutFbclid = req.originalUrl.replace(/[\?&]fbclid=[^&#]+/g, "");
    // Redirect the user to the same URL without the fbclid parameter
    return res.redirect(urlWithoutFbclid);
  }
  next();
});

app.get("/", async (req, res) => {
  res.render("landingload");
});

app.get("/home", async (req, res) => {
  const shouldShowOverlay = req.query.landing === "true";
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("home", {
    articles: articles,
    req: req,
    shouldShowOverlay,
  });
  const userIP =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress;
  console.log(userIP);
  logger.logEvent("User visited the homepage", userIP);
});

app.get("/profiles", requiresAuth(), async (req, res) => {
  try {
    const userObj = req.oidc.user;
    const user = await auth0.getUser({ id: userObj.sub });
    const articles = await Article.find();
    const updatedArticles = articles.map((article) => {
      article.title = article.title.replace(/\\u[\dA-F]{4}/gi, function (match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
      });
      return article;
    });
    res.render("components/profile/userProfile", {
      articles: updatedArticles,
      user: user,
      req: req,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});
app.get("/adminview", requiresAuth(), async function (req, res) {
  const userId = req.userId;
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("components/admin/adminview", {
    id: userId,
    articles: articles,
    isAdmin: req.isAdmin,
    req: req,
  });
  logger.logEvent(
    "User visited the admin view",
    req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.socket.remoteAddress
  );
});
app.get("/bugreport", async (req, res) => {
  res.render("bugreport",{
    req: req,
  });
  logger.logEvent(
    "User visited the bug report page",
    req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.socket.remoteAddress
  );
});

app.post("/bugreport", async (req, res) => {
  const problemtitle = req.body.title;
  const issue = req.body.issue;

  logger.bugReport(problemtitle, issue);
  res.redirect("/");
});
app.get("/manifest.json", async (req, res) => {
  res.sendFile(__dirname + "/public/manifest.json");
});

app.get("/portal", requiresAuth(),requiresRole("Administrator"), function (req, res) {
  res.redirect("/adminview");
});
// hardcode for security reasons
app.get("/cdn/:filename", function (req, res) {
  const filename = req.params.filename;
  res.sendFile(__dirname + "/public/" + filename);
});
app.get("/cdn/scripts/:filename", function (req, res) {
  const filename = req.params.filename;
  res.sendFile(__dirname + "/public/scripts/" + filename);
});
app.get("/cdn/svg/:filename", function (req, res) {
  const filename = req.params.filename;
  res.sendFile(__dirname + "/public/svg/" + filename);
});
app.get("/cdn/css/:filename", function (req, res) {
  const filename = req.params.filename;
  res.sendFile(__dirname + "/public/css/" + filename);
});
app.use("/articles", articleRouter);
app.listen(1234);
process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
  logger.bugReport("Uncaught Exception", err.stack);
});
app.get('/userinfo', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});
app.get("*", function (req, res) {
  res.redirect("/");
});

app.use(function (err, req, res, next) {
  if (config.Discord.enabled === true) {
  logger.bugReport("Internal Server Error", err.stack);
  } else {
    console.error(err.stack);
  res.status(500).send("Internal Server Error");
  }
});

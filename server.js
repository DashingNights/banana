const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const config = require("./config");
const articleRouter = require("./routes/articles");
const profileRouter = require("./routes/profiles");
const methodOverride = require("method-override");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const Users = require("./models/User");
const authMiddleware = require("./middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const requireAuth = require("./middleware/requireAuth");
// const cdn = require('./routes/cdn');
const { DiscordLogger } = require("./discordlogger/webhook");
const logger = new DiscordLogger();

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
  res.render("articles/landingload");
});

app.get("/home", async (req, res) => {
  const shouldShowOverlay = req.query.landing === "true";
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", {
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
app.get("/beta", async (req, res) => {
  const shouldShowOverlay = req.query.landing === "true";
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("beta/home", {
    articles: articles,
    req: req,
    shouldShowOverlay,
  });
});
app.use("/profiles", profileRouter);

app.get("/adminview", requireAuth, authMiddleware, async function (req, res) {
  const userId = req.userId;
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("admin/adminview", {
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
  res.render("articles/bugreport");
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
  // Redirect to the root URL
  res.redirect("/");
});
app.get("/manifest.json", async (req, res) => {
  res.sendFile(__dirname + "/public/manifest.json");
});
app.get("/customstyle.css", async (req, res) => {
  res.sendFile(__dirname + "/public/customstyle.css");
});

app.get("/login", function (req, res) {
  res.render("admin/login");
  logger.logEvent(
    "User visited the login page",
    req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.socket.remoteAddress
  );
});
app.get("/portal", function (req, res) {
  res.render("articles/portal");
});
app.get("/cdn/:filename", function (req, res) {
  const filename = req.params.filename;
  res.sendFile(__dirname + "/public/" + filename);
});


app.post("/login", function (req, res) {
  logger.logEvent(
    "User attempt login",
    req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.socket.remoteAddress
  );
  if (!req.body.id || !req.body.password) {
    res.redirect("/");
  } else {
    const user = Object.values(Users).find(
      (u) => u.id === req.body.id && u.password === req.body.password
    );
    if (user) {
      const token = jwt.sign({ userId: user.id }, config.JWT.token, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/adminview");
    } else {
      res.redirect("/");
      console.log(
        "[NOUSER] login failed by: " +
          req.body.id +
          " at " +
          new Date().toLocaleString() +
          ""
      );
      logger.logEvent(
        "Login Failed",
        "User: " +
          req.body.id +
          " at " +
          new Date().toLocaleString() +
          "" +
          " IP: " +
          req.headers["cf-connecting-ip"] ||
          req.headers["x-real-ip"] ||
          req.socket.remoteAddress
      );
    }
  }
});
app.get("/logout", function (req, res) {
  res.clearCookie("token");
  res.redirect("/login");
});

app.use("/articles", articleRouter);
// app.use('/upload', cdn);
app.listen(1234);
process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
  logger.bugReport("Uncaught Exception", err.stack);
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

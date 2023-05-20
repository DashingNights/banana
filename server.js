const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const config = require('./config')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Users = require('./models/User');
const authMiddleware = require('./middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const requireAuth = require("./middleware/requireAuth");
const cdn = require('./routes/cdn');
const axios = require('axios')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array());
app.use(cookieParser());
app.use(session({
    secret: config.Session.token, resave: false, saveUninitialized: false
}));

mongoose.connect('mongodb://' + config.Mongodb.host + '/' + config.Mongodb.name, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
}).then(() =>
        console.log("Connected to MongoDB")
).catch(() =>
    console.log("Error connecting to MongoDB, is the service Online?")
)

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(function(req, res, next) {
    // Check if the fbclid parameter is present in the request URL
    if (req.query.fbclid) {
      // Remove the fbclid parameter from the request URL
      const urlWithoutFbclid = req.originalUrl.replace(/[\?&]fbclid=[^&#]+/g, '');
      // Redirect the user to the same URL without the fbclid parameter
      return res.redirect(urlWithoutFbclid);
    }
    next();
  });
app.use(function(req, res, next) {
// Check if the fbclid parameter is present in the request URL
if (req.query.fbclid) {
    // Remove the fbclid parameter from the request URL
    const urlWithoutFbclid = req.originalUrl.replace(/[\?&]fbclid=[^&#]+/g, '');
    // Redirect the user to the same URL without the fbclid parameter
    return res.redirect(urlWithoutFbclid);
}
next();
});

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', {articles: articles, req: req })
    const userIP = req.socket.remoteAddress;
    console.log(userIP);
})

app.get('/adminview', requireAuth, authMiddleware, async function (req, res) {
    const userId = req.userId;
    const articles = await Article.find().sort({createdAt: 'desc'});
    res.render('admin/adminview', {id: userId, articles: articles, isAdmin: req.isAdmin});
});
app.get('/bugreport', async (req, res) => {
    res.render('articles/bugreport');
});
app.post('/bugreport', async (req, res) => {
    const problemtitle = req.body.title;
    const issue = req.body.issue;
    //debug
    // console.log(problemtitle, issue);
    // console.log(config.Discord.webhook);
    let embeds = [
        {
          title: problemtitle,
          color: 5174599,
          footer: {
            text: `📅 ${Date()}`,
          },
          fields: [
            {
              name: 'Issue',
              value: issue
            },
          ],
        },
      ];
      let data = JSON.stringify({ embeds });
    // Send the bug report to a Discord channel using a webhook
    try {
        var axiosconfig = {
            method: 'POST',
            url: config.Discord.webhook, // Replace with your own webhook URL
            headers: { 'Content-Type': 'application/json' },
            data: data,
          };
          axios(axiosconfig)
          .then((response) => {
            console.log('Bug report delivered successfully');
            return response;
          })
          .catch((error) => {
            console.log(error);
            return error;
          });
    } catch (error) {
      console.error('Error sending Discord message:', error.response);
    }
  
    // Redirect to the root URL
    res.redirect('/');
  });
app.get('/manifest.json', async (req, res) => {
    res.sendFile(__dirname + '/public/manifest.json')
})
app.get('/customstyle.css', async (req, res) => {
    res.sendFile(__dirname + '/public/customstyle.css')
})

app.get('/login', function (req, res) {
    res.render('admin/login');
});
app.get('/portal', function (req, res) {
    res.render('articles/portal');
});
app.get('/cdn/loadingdots', function (req, res) {
    res.sendFile(__dirname + '/public/loadingdots.gif');
});

app.post('/login', function (req, res) {
    if (!req.body.id || !req.body.password) {
        res.redirect('/');
    } else {
        const user = Object.values(Users).find(u => u.id === req.body.id && u.password === req.body.password);
        if (user) {
            const token = jwt.sign({userId: user.id}, config.JWT.token, {expiresIn: '1h'});
            res.cookie('token', token, {httpOnly: true});
            res.redirect('/adminview');
        } else {
            res.redirect('/');
            console.log("[NOUSER] login failed by: " + req.body.id + ' at ' + new Date().toLocaleString() + "")
        }
    }
});
app.get('/logout', function (req, res) {
    res.clearCookie('token');
    res.redirect('/login');
});


app.use('/articles', articleRouter)
app.use('/upload', cdn);
app.listen(1234)
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
app.get('*', function(req, res) {
  res.redirect('/');
});
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const config = require('./config')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');
const Users = require('./models/User');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array());
app.use(cookieParser());
app.use(session({
    secret: config.Session.token,
    resave: false,
    saveUninitialized: false
}));

mongoose.connect('mongodb://' + config.Mongodb.host + '/' + config.Mongodb.name, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', {articles: articles})
    var userIP = req.socket.remoteAddress;
    console.log(userIP);
})
const jwt = require('jsonwebtoken');

app.get('/adminview', function (req, res) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, config.JWT.token, async function (err, decoded) {
            if (err) {
                res.redirect('/login');
            } else {
                const userId = decoded.userId;
                const articles = await Article.find().sort({createdAt: 'desc'});
                res.render('admin/adminview', {id: userId, articles: articles, isAdmin: req.isAdmin});
            }
        });
    } else {
        res.redirect('/login');
    }
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
        }
    }
});
app.get('/logout', function (req, res) {
    res.clearCookie('token');
    res.redirect('/login');
});


app.use('/articles', articleRouter)

app.listen(1234)
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

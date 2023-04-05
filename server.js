const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const config = require('./config')
const articleRouter = require('./routes/articles')
const cdnRouter = require('./routes/cdn')
const methodOverride = require('method-override')
const app = express()
const jwt = require('jsonwebtoken');
const Users = require('./models/User');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const fileRouter = require('./routes/files');
const imageRouter = require('./routes/images');
const uploadRouter = require('./routes/upload');

var bodyParser = require('body-parser');
var upload = multer(); 
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: config.Session.token, resave: false, saveUninitialized: false }));
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

////////////////////////////////
//                            //
//     MongoDB - Mongoose     //
//                            //
////////////////////////////////

mongoose.connect('mongodb://'+ config.Mongodb.host+'/'+config.Mongodb.name, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

////////////////////////////////
//                            //
//           Pages            //
//                            //
////////////////////////////////
app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
  var userIP = req.socket.remoteAddress;
  console.log(userIP);
})

app.get('/portal', function(req, res){
  res.render('articles/portal');
});

////////////////////////////////
//                            //
//       Browser Files        //
//                            //
////////////////////////////////


app.get('/manifest.json', async (req, res) => {
  res.sendFile(__dirname + '/public/manifest.json')
})
app.get('/customstyle.css', async (req, res) => {
  res.sendFile(__dirname + '/public/customstyle.css')
})

////////////////////////////////
//                            //
//       Image Storage        //
//                            //
////////////////////////////////
const imagemongoURI = 'mongodb://'+ config.Mongodb.host+'/'+config.Mongodb.name +'/image';
const imageMongoConn = mongoose.connect(imagemongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
let gfs;

imageMongoConn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});


app.use('/upload', uploadRouter)
app.use('/files', fileRouter)
app.use('/images', imageRouter)

////////////////////////////////
//                            //
//      Articles Handler      //
//                            //
////////////////////////////////

app.use('/articles', articleRouter)
////////////////////////////////
//                            //
//        CDN Handler         //
//                            //
////////////////////////////////

app.use('/cdn', cdnRouter)
////////////////////////////////
//                            //
// User Login/Logout Handling //
//                            //
////////////////////////////////

app.get('/login', function(req, res){
  res.render('admin/login');
});

app.post('/login', function(req, res){
  if(!req.body.id || !req.body.password){
    res.redirect('/');
  } else {
    const user = Object.values(Users).find(u => u.id === req.body.id && u.password === req.body.password);
    if (user) {
      const token = jwt.sign({ userId: user.id }, config.JWT.token, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/adminview');
    } else {
      res.redirect('/');
    }
  }
});

app.get('/logout', function(req, res){
  res.clearCookie('token');
  res.redirect('/login');
});

////////////////////////////////
//                            //
//        Admin Views         //
//                            //
////////////////////////////////

app.get('/adminview', function(req, res){
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, config.JWT.token, async function(err, decoded) {
      if (err) {
        res.redirect('/login');
      } else {
        const userId = decoded.userId;
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('admin/adminview', { id: userId, articles: articles, isAdmin: req.isAdmin });
      }
    });
  } else {
    res.redirect('/login');
  }
});

////////////////////////////////
//                            //
//     Exception handling     //
//                            //
////////////////////////////////

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

////////////////////////////////
//                            //
//       Site Listener        //
//                            //
////////////////////////////////

app.listen(config.Site.port, config.Site.ip, () => console.log('Banana Article Website Started'))


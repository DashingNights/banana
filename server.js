const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); 
var session = require('express-session');
var cookieParser = require('cookie-parser');
const Users = {
  admin: {
    id: "admin",
    password: "admin",
    isAdmin: true
  }
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "aiw8ynhtvo82q60982qynb0vo"}));


mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})
const jwt = require('jsonwebtoken');

app.get('/adminview', function(req, res){
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, '9owlna876b4v9o2q.lab17mq246hb2n7q7', async function(err, decoded) {
      if (err) {
        res.redirect('/login');
      } else {
        const userId = decoded.userId;
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('admin/adminview', { id: req.userId, articles: articles, isAdmin: req.isAdmin });
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


app.get('/login', function(req, res){
  res.render('admin/login');
});

app.post('/login', function(req, res){
  if(!req.body.id || !req.body.password){
    res.redirect('/');
  } else {
    const user = Users.find(u => u.id === req.body.id && u.password === req.body.password);
    if (user) {
      const token = jwt.sign({ userId: user.id }, '9owlna876b4v9o2q.lab17mq246hb2n7q7', { expiresIn: '1h' });
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


app.use('/articles', articleRouter)

app.listen(1234)

// function authMiddleware(req, res, next, isAdmin = false) {
//   const token = req.cookies.token;
//   if (token) {
//     jwt.verify(token, 'secret-key', function(err, decoded) {
//       if (err) {
//         res.redirect('/login');
//       } else {
//         req.userId = decoded.userId;
//         Users.findOne({ id: req.userId }, 'id isAdmin', function(err, user) {
//           if (err) {
//             res.redirect('/login');
//           } else if (user) {
//             if (isAdmin && !user.isAdmin) {
//               res.redirect('/adminview');
//             } else {
//               req.isAdmin = user.isAdmin;
//               next();
//             }
//           } else {
//             res.redirect('/login');
//           }
//         });
//       }
//     });
//   } else {
//     res.redirect('/login');
//   }
// }
// app.use(authMiddleware);
// function requireAuth(req, res, next) {
//   const token = req.cookies.token;
//   if (token) {
//     jwt.verify(token, 'secret-key', function(err, decoded) {
//       if (err) {
//         res.redirect('/login');
//       } else {
//         req.userId = decoded.userId;
//         next();
//       }
//     });
//   } else {
//     res.redirect('/login');
//   }
// }
// app.use(requireAuth);
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
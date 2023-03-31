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
var Users = [
  {
      id:"admin",
      password:"admin"
  }];
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
app.get('/manifest.json', async (req, res) => {
  res.sendFile(__dirname + '/public/manifest.json')
})
app.get('/customstyle.css', async (req, res) => {
  res.sendFile(__dirname + '/public/customstyle.css')
})


app.get('/adminview', async function(req, res){
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('admin/adminview',  { articles: articles, id: req.session.user.id})
  
});

app.get('/login', function(req, res){
  res.render('admin/login');
});

app.post('/login', function(req, res){
  // console.log(Users);
  if(!req.body.id || !req.body.password){
    res.redirect('/')
  } else {
     Users.filter(function(user){
        if(user.id === req.body.id && user.password === req.body.password){
           req.session.user = user;
           res.redirect('/adminview');
        }
     });
    // res.render('admin/login');
  }
});

app.get('/logout', function(req, res){
  req.session.destroy(function(){
     console.log("user logged out.")
  });
  res.redirect('/login');
});


app.use('/articles', articleRouter)

app.listen(1234)
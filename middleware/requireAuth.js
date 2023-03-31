const express = require('express')
const app = express()
function requireAuth(req, res, next) {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, '9owlna876b4v9o2q.lab17mq246hb2n7q7', function(err, decoded) {
        if (err) {
          res.redirect('/login');
        } else {
          req.userId = decoded.userId;
          next();
        }
      });
    } else {
      res.redirect('/login');
    }
  }
  app.use(requireAuth);
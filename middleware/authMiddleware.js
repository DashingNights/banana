const express = require('express')
const app = express()
function authMiddleware(req, res, next, isAdmin = false) {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, '9owlna876b4v9o2q.lab17mq246hb2n7q7', function(err, decoded) {
        if (err) {
          res.redirect('/login');
        } else {
          req.userId = decoded.userId;
          Users.findOne({ id: req.userId }, 'id isAdmin', function(err, user) {
            if (err) {
              res.redirect('/login');
            } else if (user) {
              if (isAdmin && !user.isAdmin) {
                res.redirect('/adminview');
              } else {
                req.isAdmin = user.isAdmin;
                next();
              }
            } else {
              res.redirect('/login');
            }
          });
        }
      });
    } else {
      res.redirect('/login');
    }
  }
  app.use(authMiddleware);
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const Users = require('../models/User');
function authMiddleware(req, res, next, isAdmin = false) {

  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, '9owlna876b4v9o2q.lab17mq246hb2n7q7', function(err, decoded) {
      if (err) {
        res.redirect('/login');
      } else {
        req.userId = decoded.userId;
        const user = Users.admin;
        if (user.id === req.userId) {
          if (isAdmin && !user.isAdmin) {
            res.redirect('/adminview');
          } else {
            req.isAdmin = user.isAdmin;
            next();
          }
        } else {
          res.redirect('/login');
        }
      }
    });
  } else {
    res.redirect('/login');
  }
}

module.exports = authMiddleware

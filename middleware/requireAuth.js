const express = require("express");
const config = require("../config");
const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, config.JWT.token, function (err, decoded) {
      if (err) {
        res.redirect("/login");
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
}

module.exports = requireAuth;

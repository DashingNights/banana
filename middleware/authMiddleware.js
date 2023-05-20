const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const config = require("../config");

function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, config.JWT.token, function (err, decoded) {
      console.log(
        "attempted login by: " +
          decoded.userId +
          " at " +
          new Date().toLocaleString() +
          ""
      );
      if (err) {
        res.redirect("/login");
      } else {
        req.userId = decoded.userId;
        const user = Users.find((u) => u.id === req.userId);
        if (user.isAdmin === true) {
          req.isAdmin = user.isAdmin;
          console.log(
            "login successful by: " +
              decoded.userId +
              " at " +
              new Date().toLocaleString() +
              ""
          );
          next();
        } else {
          res.redirect("/login");
          console.log(
            "[NOPERM] login failed by: " +
              decoded.userId +
              " at " +
              new Date().toLocaleString() +
              ""
          );
        }
      }
    });
  } else {
    res.redirect("/login");
  }
}

module.exports = authMiddleware;

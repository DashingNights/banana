const express = require('express')
const router = express.Router()
const cdnFolder = 'public/cdn/';
const Article = require('./../models/article')
const authMiddleware = require('../middleware/authMiddleware')
const requireAuth = require('../middleware/requireAuth')
const { readdir } = require('fs/promises');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const config = require('../config');
const imagemongoURI = 'mongodb://'+config.Mongodb.host+'/'+config.Mongodb.name +'/image';
const storage = new GridFsStorage({
    url: imagemongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const fileInfo = {
          filename: file.originalname,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    }
  });
const upload = multer({ storage });
router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

module.exports = router;
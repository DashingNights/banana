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
let gfs;
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });

module.exports = router;
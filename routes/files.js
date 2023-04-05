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
router.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // File exists
      return res.json(file);
    });
  });

router.get('/', (req, res) => {
gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
    return res.status(404).json({
        err: 'No files exist'
    });
    }

    // Files exist
    return res.json(files);
});
});
  
module.exports = router;
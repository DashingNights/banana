const express = require('express')
const router = express.Router()
const path = require('path')
const cdnFolder = 'public/cdn/';
const Article = require('./../models/article')
const authMiddleware = require('../middleware/authMiddleware')
const requireAuth = require('../middleware/requireAuth')
const { readdir } = require('fs/promises');
const config = require('../config');

router.get('/:file', async function(req, res){
    res.sendFile(`${req.params.file}`, { root: cdnFolder });
});

module.exports = router;
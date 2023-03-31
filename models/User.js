const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  admin: {
    id: { type: String, default: 'admin'},
    password: { type: String, default: 'admin'},
    isAdmin: { type: Boolean, required: true }
  }
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
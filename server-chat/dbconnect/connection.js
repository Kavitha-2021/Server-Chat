const mongoose = require('mongoose');

const chatUrl = mongoose.createConnection('mongodb://127.0.0.1:27017/chat')

module.exports = chatUrl
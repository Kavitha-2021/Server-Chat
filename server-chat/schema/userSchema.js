const mongoose = require('mongoose')
const chatUrl = require('../dbconnect/connection')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: Number,
    profile: String,
    chats: Array,
})

const userObj = chatUrl.model('user', userSchema)

module.exports = userObj
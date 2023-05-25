const mongoose = require('mongoose')
const chatUrl = require('../dbconnect/connection')

const conversationSchema = new mongoose.Schema({
    members: Array,
    messages: Array,
})

const convObj = chatUrl.model('conversation', conversationSchema)

module.exports = convObj
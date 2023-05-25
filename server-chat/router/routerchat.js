const express = require('express');
const controllerchat = require('../controller/controllerchat')
const Route = express.Router();
const upload = require('../middleware/upload')

Route.get('/', (req, res) => {
    res.send('Hello')
})

Route.post('/signup', upload.single('profile'), controllerchat.addUser)
Route.post('/login', controllerchat.checkUser)
Route.post('/getmsg/:messageId', controllerchat.getMsg)
Route.post('/updateuser', controllerchat.updateUser)
Route.post('/updatpassword', controllerchat.updatePassword)

Route.get('/userchat/:username', controllerchat.getUserChat)
Route.get('/chats/:username', controllerchat.getChat)
Route.get('/search/:username/:searchname', controllerchat.searchUser)
Route.get('/getbyusername/:username', controllerchat.getUserByName)
Route.get('/getlastmsg/:username', controllerchat.getLastMessage)
Route.get('/offlinemessage/:username', controllerchat.getOfflineMessage)

Route.post('/download', controllerchat.downloadFile)

Route.post('/upload', upload.fields([
    { name: "image"},
    { name: "file"},
    { name: "audio"}
]), controllerchat.addMsges )

Route.post('/uploadprofile', upload.single('profile'), controllerchat.uploadProfile)

module.exports = Route
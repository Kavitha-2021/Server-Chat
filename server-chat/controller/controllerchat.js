const chatservice = require('../service/chatservice')

module.exports.addUser = async(req, res) => {
    try {
        var newuser = await chatservice.addUser(req.body, req.file)
        res.json(newuser)
    } catch(err) {
        res.json({ message: 'Signup API failed', status:'unsuccess', data: {} })
    }
}

module.exports.checkUser = async(req, res) => {
    try {
        var chekuser = await chatservice.checkUser(req.body)
        res.json(chekuser)
    } catch(err) {
        res.json({ message: 'Login API failed', status:'unsuccess', data: {} })
    }
}

module.exports.getUserChat = async(req, res) => {
    try {
        var couser = await chatservice.getUserChat(req.params.username);
        res.json(couser)
    } catch(err) {
        res.json({ message: 'Get CoUser API failed', status:'unsuccess', data: {} })
    }
}

module.exports.getMsg = async(req, res) => {
    try {
        var msglst = await chatservice.getMsg(req.params.messageId);
        res.json(msglst)
    } catch(err) {
        res.json({ message: 'Get Message API failed', status:'unsuccess', data: {} })
    }
}

module.exports.getChat = async(req, res) => {
    try {
        var getcontact = await chatservice.getChat(req.params.username)
        res.json(getcontact)
    } catch(err) {
        res.json({ message: 'Get contact API failed', status:'unsuccess', data: {} })
    }
}

module.exports.searchUser = async(req, res) => {
    try {
        var search = await chatservice.searchUser(req.params.username, req.params.searchname)
        res.json(search)
    } catch(err) {
        res.json({ message: 'Get contact API failed', status:'unsuccess', data: {} })
    }
}

module.exports.addMsges = async(req, res) => {
    try {
        var resp;
        if(req.files)
        resp = await chatservice.addMsg(req.body, req.files.file)
        else 
        resp = await chatservice.addMsg(req.body, null)
        res.send(resp)
    } catch(err) {
        res.send(err)
    }
}

module.exports.getUserByName = async(req, res) => {
    try {
        var user = await chatservice.getUser(req.params.username)
        res.json(user)
    } catch(err) {
        res.json({ message: 'Get User By Name API failed', status:'unsuccess', data: {} })
    }
}

module.exports.getLastMessage = async(req, res) => {
    try {
        var mess = await chatservice.getLastMessage(req.params.username)
        res.json(mess)
    } catch(err) {
        res.json({ message: 'Get Last Message API failed', status:'unsuccess', data: {} })       
    }
}

module.exports.downloadFile = async(req, res) => {
    try {
        var resp = await chatservice.downloadFile(req.body.url, req.body.path)
        res.json(resp)
    } catch(err) {
        res.json({ message: 'Download API failed', status:'unsuccess', data: {} })            
    }
}

module.exports.updateUser = async(req, res) => {
    try {
        var resps = await chatservice.updateUser(req.body)
        res.json(resps)
    } catch(err) {
        res.json({ message: 'Upload User API failed', status:'unsuccess', data: {} })
    }
}

module.exports.updatePassword = async(req, res) => {
    try {
        var response = await chatservice.updatePassword(req.body)
        res.json(response)
    } catch(err) {
        res.json({ message: 'Upload User API failed', status:'unsuccess', data: {} })
    }
}

module.exports.uploadProfile = async(req, res) => {
    try {
        var resp = await chatservice.uploadProfile(req.body.username, req.file)
        res.json(resp )
    } catch(err) {
        res.json({ message: 'Upload Profile API failed', status:'unsuccess', data: {} })
    }
}

module.exports.getOfflineMessage = async(req, res) => {
    try {
        var resp = await chatservice.getOfflineMessage(req.params.username)
        res.json(resp)
    } catch(err) {
        res.json({ message: 'Get Offline Message API failed', status:'unsuccess', data: {} })
    }
}
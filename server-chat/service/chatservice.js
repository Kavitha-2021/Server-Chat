const userObj = require('../schema/userSchema')
const convObj = require('../schema/conversationSchema')
const bcrypt = require('bcrypt')
const download = require('download');

require('dotenv').config()

module.exports.addUser = async(user, file) => {
    try {
        var userexist = await userObj.findOne({username: user.username})
        if(userexist) {
            return ({ message: 'Username already exist', status: 'unsuccess', data: {} })  
        } else {
            var h_password = await hashPassword(user.password)
            var newuser = new userObj({...user, password: h_password, profile: `http://localhost:2020/${file.path}`})
            await newuser.save();
            return ({ message: 'New User Added', status: 'success', data: newuser })
        }
    } catch(err) {
        return err
    }
}

async function hashPassword(password) {
    var h_pass =  await bcrypt.hash(password, parseInt(process.env.SALT))
    return h_pass
}

module.exports.checkUser = async(user) => {
    try {
        var dbuser = await userObj.findOne({username: user.username})
        if(dbuser) {
            var match = await comparePassword(dbuser.password, user.password)
            if(match) return ({ message: 'Login Success', status: 'success', data: dbuser })
            else return ({ message: 'Invalid Password', status: 'unsuccess', data: {} })
        } else return ({ message: 'Invalid credentials', status: 'unsuccess', data: {} })
    } catch(err) {
        return err
    }
}

async function comparePassword(dbpassword, reqpassword) {
    var result = await bcrypt.compare(reqpassword, dbpassword)
    return result
}

module.exports.getUserChat = async(username) => {
    try {
        var userchat = await userObj.find({username: username}, { chats: 1})
        if(userchat) return ({ message: 'Data fetched', status: 'success', data: userchat })
        else return ({ message: 'Failed to load data', status: 'unsuccess', data: {} })
    } catch(err) {
        return err
    }
}

module.exports.addMsg = async(content, files) => {
    try {
        var existconv = await convObj.findOne({members: { $all: [ content.author, content.reader] } })
        var newconv;
        if( !existconv ) {
            newconv = new convObj({ members: [content.author, content.reader] })
            await newconv.save();
            var newconvId = newconv._id.toString()
            var reader = await userObj.findOne({ username: content.reader})
            var author = await userObj.findOne({ username: content.author})

            if( !reader && !author )
            return false

            var authorexist = author.chats.filter( e => {
                if( JSON.stringify(e.name) == JSON.stringify(content.reader) )
                return e
            })
            if(authorexist.length == 0) {
                var reader_format = {
                    name: content.reader,
                    id: newconvId
                }
                await userObj.updateOne({ username: author.username}, { $push: { chats: reader_format  }})
            }

            var readerexist = reader.chats.filter( e => {
                if( JSON.stringify(e.name) == JSON.stringify(content.author) )
                return e
            })
            if(readerexist.length == 0) {
                var author_format = {
                    name: content.author,
                    id: newconvId
                }
                await userObj.updateOne({ username: reader.username}, { $push: { chats: author_format  }})
            }
            await formatMessage(newconv, content, files)
        } else {
            await formatMessage(existconv, content, files)
        }
        return true;
    } catch(err) {
        return false;
    }
}

async function formatMessage(conv, content, files) {
    var image = [];
    var file = [];
    if( files && files.length ) {
        files.forEach(element => {
            if(element.mimetype.toString().startsWith('image')) {
                image.push({name: element.originalname, path:`http://localhost:2020/${element.path}`})
            } else {
                file.push({name: element.originalname, path:`http://localhost:2020/${element.path}`})
            }
        })

        conv.messages.push({
            author: content.author,
            reader: content.reader,
            file: file.length > 0 ? file : "",
            image: image.length > 0 ? image : "",
            time: content.time,
            message: content.message,
            status: content.status
        })
    }
    else 
    conv.messages.push(content);
    await conv.save();
}

module.exports.getMsg = async(messageId) => {
    try {
        var msglist = await convObj.findOne({ _id: messageId })
        if(msglist) return  ({ message: 'Data fetched', status: 'success', data: msglist })
        else return ({ message: 'Failed to load data', status: 'unsuccess', data: {} })
    } catch(err) {
        return err
    }
}

module.exports.getChat = async(name) => {
    try {
        var userchat = await userObj.findOne({username: name }, { _id: 0, chats: 1})
        if(userchat) {
        var allchats = []
        for(var i = 0; i < userchat.chats.length; i++) {
            var chat = await userObj.findOne({username: userchat.chats[i].name })
            if(chat)
            allchats.push(chat)
        }
        return  ({ message: 'Chat data fetched', status: 'success', data: allchats })
    } else return ({ message: 'Failed to get Chat', status: 'unsuccess', data: {} })
    } catch (err) {
        return err
    }
}

module.exports.searchUser = async(username, searchname) => {
    try {
        var result = await userObj.find({ username: { $ne: username, $regex: searchname, $options: "i"}})
        if(result) return  ({ message: 'Data fetched', status: 'success', data: result })
        else return ({ message: 'Data not found', status: 'unsuccess', data: {} })
    } catch(err) {
        return err
    }
}

module.exports.getUser = async(username) => {
    try {
        var user = await userObj.findOne({ username: username})
        if(user) return  ({ message: 'Data fetched', status: 'success', data: user })
        else return ({ message: 'Data not found', status: 'unsuccess', data: {} })
    } catch(err) {
        return err
    }
}

module.exports.getLastMessage = async(username) => {
    try {
        var last_msg = {};
        var all_msg;
        var all_chats = await userObj.findOne({username: username}, {_id: 0, chats: 1})
        if(all_chats && all_chats.chats) {
            for(var j = 0; j < all_chats.chats.length; j++) {
                all_msg = await convObj.findOne({ _id: all_chats.chats[j].id})
                if(all_msg) {
                    var l_msg = all_msg.messages[all_msg.messages.length-1]
                    var name =  username == l_msg.author ? l_msg.reader : l_msg.author
                    if(l_msg.message) {
                        last_msg[name] = { message: l_msg.message, author: l_msg.author, status: l_msg.status }
                    } else if(l_msg.image) {
                        last_msg[name] = { message: "Photo", author: l_msg.author, status: l_msg.status }
                    } else {
                        last_msg[name] = { message: "File", author: l_msg.author, status: l_msg.status }
                    }
                    
                }
            }
            return  ({ message: 'Data fetched', status: 'success', data: last_msg })
        } else return ({ message: 'Contact not found', status: 'unsuccess', data: {} })
    } catch(err) {
        return err
    }
}

module.exports.downloadFile = async(url, path) => {
    try {
        await download(url, path)
        return ({ message: 'File Downloaded', status: 'success', data: {} })
    } catch(err) {
        return err
    }
}

module.exports.updateUser = async(user) => {
    try {
        const { phone, email, username} = user
        var user = await userObj.findOne({username: username})
        var resp;
        if(user) {
            resp = await userObj.updateOne({ username: username}, { $set: {phone: phone, email: email} })
            return ({ message: 'Updation success', status: 'success', data: resp })
        } else return ({ message: 'Failed to Update', status: 'unsuccess', data: {} })
    } catch(err) {
        return err
    }
}

module.exports.updatePassword = async(user) => {
    try {
        const { username, newpassword } = user
        var resp;
        var user = await userObj.findOne({username: username})
        if(user) {
            var hnew_password = await hashPassword(newpassword)
            resp = await userObj.updateOne({ username: username}, { $set: {password: hnew_password} })
            return ({ message: 'Updation success', status: 'success', data: resp })
        } else return ({ message: 'Failed to Update', status: 'unsuccess', data: {} })
    } catch(err) {
        return err
    }
}

module.exports.uploadProfile = async(username, file) => {
    try {
        var resp;
        var user = await userObj.findOne({username: username})
        if(user) {
            resp = await userObj.updateOne({ username: username}, { $set: {profile: `http://localhost:2020/${file.path}`} })
            return ({ message: 'Updation success', status: 'success', data: resp })
        } else return ({ message: 'Failed to Update', status: 'unsuccess', data: {} })
    } catch(err) {
        return err
    }
}

module.exports.updateMessageStatus = async(data, status) => {
    try {
        var conversationId = await convObj.findById({ _id: data.messageId[0].id})
        if(conversationId) {
            if( Array.isArray(data.data) ) {
                data.data.forEach( async e => {
                    await convObj.updateOne({ 'messages._id': e._id.toString() }, {$set: { 'messages.$.status': status } })
                })
            } else {
                await convObj.updateOne({ 'messages._id': data.data._id.toString() }, {$set: { 'messages.$.status': status } })
            }
        } else return false

    } catch(err) {
        return err
    }
}

module.exports.getOfflineMessage = async(username) => {
    try {
        const response = {};
        var user = await userObj.findOne({ username: username})
        for( var i = 0; i < user.chats.length; i++) {
            var chat = await convObj.findById({ _id: user.chats[i].id})
            var offlinemessages = [];
            if(chat) {
                offlinemessages = chat.messages.filter( e => {
                    if( e.status && e.status != 3 && e.reader == username)
                    return e;
                })
                if(offlinemessages.length > 0)
                response[user.chats[i].name] = offlinemessages
                offlinemessages = [];
            }
        }
        return ({ message: 'Offline messages', status: 'success', data: response })
    } catch(err) {
        return err
    }

}
const app = require('../index')
const server = require("http").Server(app)
const socket = require('socket.io')
const chatservice = require('../service/chatservice')
// const axios = require('axios')

const io = socket(server, {
    allowEIO3: true,
    cors: {
        origin: ['http://localhost:8080'],
        methods: ["GET", "POST"],
        allowHeaders: ["myheader"],
        credentials: true
    },
    transports: ['websocket']
})

// let users = [];
let clients = [];
let users = {};

io.on('connection', (socket) => {
    console.log(`Connection made with ${socket.id}`)

    socket.on("user_connected", (username) => {
        try {
            if (!users[username])
                users[username] = new Set([]);
            users[username].add(socket.id)
            clients.push(username)
            io.sockets.emit("online", clients)
        } catch (err) {
            socket.emit('error_message', err)
        }
    })

    socket.on("send_message", async (content) => {
        try {
            users[content.author].forEach(element => {
                socket.to(element).emit("return_message", content)
            });
            if (users[content.reader]) {
                users[content.reader].forEach(element => {
                    socket.to(element).emit("receive_message", content)
                }); 
            }
            // socket.to(users[content.reader]).emit("receive_message", content) 
        } catch (err) {
            socket.emit('error_message', err)
        }
    })

    socket.on('message_received', async(data) => {
        try {
            if (users[data.data.author]) {
                users[data.data.author].forEach(element => {
                    socket.to(element).emit('acknowledge_receive', data.data)
                }); 
                await chatservice.updateMessageStatus(data, 2)
            }
        } catch(err) {
            socket.emit('error_message', err)
        }
    })

    socket.on('read_message', async (data) => {
        try {
            if(Array.isArray(data.data)) {
                if (users[data.data[0].author]) {
                    users[data.data[0].author].forEach(element => {
                        socket.to(element).emit('acknowledge_read', data.data)
                    }); 
                }
            } else {
                if (users[data.data.author]) {
                    users[data.data.author].forEach(element => {
                        socket.to(element).emit('acknowledge_read', data.data)
                    }); 
                }
            }
            
            await chatservice.updateMessageStatus(data, 3)
        } catch(err) {
            socket.emit('error_message', err)
        }
    })

    socket.on('start-typing', (data) => {
        if (users[data.receiver]) {
            users[data.receiver].forEach(element => {
                socket.to(element).emit("on-start-typing", data.sender)
            }); 
        }
    })

    socket.on('finish-typing', (data) => {
        if (users[data.receiver]) {
            users[data.receiver].forEach(element => {
                socket.to(element).emit("on-finish-typing", data.sender)
            }); 
        }
    })

    socket.on('user_disconnected', (name) => {
        try {
            console.log(`${socket.id} was disconnected`)
            if (users[name]) {
                users[name].delete(socket.id);
                if (users[name].size === 0) {
                    delete users[name];
                }
            }
            clients.splice(name, 1)
            io.sockets.emit("offline", name)
            socket.disconnect();
        } catch (err) {
            socket.emit('error_message', err)
        }
    })

    socket.on('disconnect', () => {
        try {
            console.log(`${socket.id} was disconnected old`)
            users.forEach(ele => {
                if(ele.has(socket.id))
                users.delete[ele]
            })
        } catch (err) {
            socket.emit('error_message', err)
        }
    })
})

module.exports = server;

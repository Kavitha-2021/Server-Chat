const express = require('express')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const routerchat = require('./router/routerchat')
const server = require('./socket/socketio');

require('dotenv').config()

const PORT = process.env.PORT || 9091
const SOCKETPORT = process.env.SOCKETPORT || 7071

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())
app.use(routerchat)
app.use('/uploads', express.static('uploads'))

app.get('/hiii', (req, res) => {
    res.send('Hello from nodejs ')
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

server.listen(SOCKETPORT, () => {
    console.log(`Socket is listening on port ${SOCKETPORT}`)
})

module.exports = app


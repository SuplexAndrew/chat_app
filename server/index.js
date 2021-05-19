const PORT = 3001
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
})
const fs = require('fs')
const helmet = require('helmet')
const router = require('./adminApi')
const jwt = require('jsonwebtoken')
const key = require('./common/keys.json')["jwt-admin-key"]

app.use(express.json())
app.use(helmet.frameguard())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    const buffer = fs.readFileSync('./common/allowed_sites.json')
    const sites = JSON.parse(buffer)
    sites.map(site => res.setHeader("X-Frame-Options", `ALLOW-FROM ${site.url}`))

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});
app.use('/api', router)
const userController = require('./controllers/UserController')

const onConnection = async (socket) => {
    socket.on('connection', async (token) => {
        const user = await userController.getUserByToken(token)
        if (user) {
            const messages = await userController.getMessages(user.id)
            socket.emit('getMessages', messages)
            const settings = await userController.getSettings(1)
            socket.emit('getSettings', settings)
        } else {
            const i = await userController.createNewToken()
            socket.emit('getToken', i.newToken)
            await userController.addHelloMessage(i.id.rows[0].id)
            const messages = await userController.getMessages(i.id.rows[0].id)
            socket.emit('getMessages', messages)
        }
    })
    socket.on('operator_connection', async (token) => {
        //const t = await jwt.sign(token, key);
        //const j = await jwt.verify(t, key)
        const j = true
        if (j) {
            const lastMessages = await userController.getLastMessages()
            socket.emit('getLastMessages', lastMessages)
        }
    })

    socket.on('chat message', async (raw_message, token) => {
        let userId
        if (raw_message.user_id){
            userId = raw_message.user_id
        } else {
            const user = await userController.getUserByToken(token)
            userId = user.id
        }
        raw_message.status_id = 2
        raw_message.user_id = userId
        await userController.addMessage(raw_message)
            .then(socket.emit('message received', await userController.getMessages(raw_message.user_id)))
    })
    setTimeout(() => {
        socket.emit('interval', 10);
    }, 600000);
    socket.on('disconnect', () => {
        socket.leave()
    })
}

io.on('connection', onConnection)

server.listen(PORT, () => {
    console.log('server started at ' + new Date().toLocaleString("ru"))
})

const Router = require('express');
const router = new Router();
const db = require('./db');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fs = require('fs')
const key = require('./common/keys.json')["jwt-admin-key"]
const userController = require('./controllers/userController')

router.get('/getIframe/:id', (req, res) => {
    try {
        const buffer = fs.readFileSync('./common/chat_settings.json')
        const settings = JSON.parse(buffer)

        const item = settings.find(i => i.id == req.params.id)
        res.send(`<iframe src="http://localhost:3000/" width="${item.width}" height="${item.height}" ></iframe>`)
    } catch {
        res.status(500)
    }

})
router.post('/login', async (req, res) => {
    try {
        const {login, password} = req.body

        const admin = await db.query('SELECT * FROM Admin WHERE login = $1', [login])
        if (admin.rows[0]) {
            const hashed = await bcrypt.hash(password, admin.rows[0].salt)
            console.log(admin.rows[0].password)
            console.log(hashed)
            if (admin.rows[0].password === hashed) {
               res.json(jwt.sign({
                    data: admin.rows[0].id
                }, 'secret', {expiresIn: '1h'}))
            }
        } else {
            res.status(403)
        }
    } catch {
        res.status(403)
    }
})
router.post('/register', async (req, res) => {
    try {
        const j = await  jwt.verify(req.token, key)
        if (j) {
            const {login, password} = req.body
            const salt = bcrypt.genSalt(16)
            const hashed = bcrypt.hash(password, salt)
            await db.query('INSERT INTO Admin (login, password, salt) values ($1, $2, $3)', [login, hashed, salt])
        } else {
            res.status(403)
        }
    } catch {
        res.status(403)
    }
})
router.get('/salt', async (req, res) => {
    const salt = bcrypt.genSaltSync(16)
    res.send(salt)
})
router.get('/token', async (req, res) => {
    const token = await jwt.sign({ foo: 'bar' }, key);
    res.send(token)
})
router.post('/editSettings', async (req, res) => {
    try {
        const j = await jwt.verify(req.token, key)
        if (j) {
            const buffer = fs.readFileSync('./common/chat_settings.json')
            const settings = JSON.parse(buffer)
            const {id, width, height, user_message_color, operator_message_color, placeholder, title} = req.body
            settings[id] = {id, width, height, user_message_color, operator_message_color, placeholder, title}
            const json = JSON.stringify(settings)
            fs.writeFileSync('./common/chat_settings.json', json)
            res.status(200)
        } else {
            res.status(403)
        }
    } catch {
        res.status(500)
    }
})
router.post('/allowUrl', async(req, res) => {
    try {
        const j = await jwt.verify(req.token, key)
        if (j) {
            const buffer = fs.readFileSync('./common/allowed_sites.json')
            const sites = JSON.parse(buffer)
            const url = req.body
            sites.sort()
            sites.push({id: sites[sites.length - 1].id + 1, url})
            const json = JSON.stringify(sites)
            fs.writeFileSync('./common/allowed_sites.json', json)
            res.status(200)
        } else {
            res.status(403)
        }
    } catch {
        res.status(500)
    }

})
router.get('/getMessages/:id', async (req, res) => {
    try {
        const user_id = req.params.id
        const messages = await userController.getMessages(user_id)
        res.json(messages)
    } catch {
        res.status(500)
    }
})
router.get('/getUnreadMessages/:id', async (req, res) => {
    try {
        const user_id = req.params.id
        const messages = await db.query('SELECT * FROM Message WHERE user_id = $1 and status_id != 3', [user_id])
        res.json(messages)
    } catch {
        res.status(500)
    }
})
router.get('/getLastMessages', async (req, res) => {
    try {
        const a = await userController.getLastMessages()
        res.json(a)
    } catch {
        res.status(500)
    }
})
router.post('/addMessage', async (req, res) => {
    try {
        await userController.getMessages(req.body.message)
    } catch {
        res.status(200)
    }
})


module.exports = router

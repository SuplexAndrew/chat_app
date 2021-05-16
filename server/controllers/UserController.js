const db = require('../db');
const fs = require('fs');
const crypto = require('crypto-js');
const cr = require('crypto');
const secretKey = require('../common/keys.json')["user-token-key"]

class UserController {
    async getUserByToken(token) {
        try {
            const decr = crypto.AES.decrypt(token, secretKey).toString(crypto.enc.Utf8)
            const user = await db.query(`SELECT * FROM User_ WHERE token='${decr}'`)
            return user.rows[0]

        } catch {
            return undefined
        }
    }

    async createNewToken() {
        const userKey = cr.randomBytes(16).toString('hex')
        const newToken = crypto.AES.encrypt(userKey, secretKey).toString()
        const id =
            await db.query(`INSERT INTO User_(token, visit_time) values ($1, now()::timestamp(0)) RETURNING id`, [userKey])
        return {newToken, id}
    }

    async getMessages(user_id) {
        const messages = await db.query('SELECT * FROM Message WHERE user_id = $1', [user_id])
        return messages.rows
    }

    async getMessagesByToken(token) {
        const decr = crypto.AES.decrypt(token, secretKey).toString(crypto.enc.Utf8)
        const user = await db.query(`SELECT * FROM User_ WHERE token='${decr}'`)?.rows[0]
        const messages = await db.query('SELECT * FROM Message WHERE user_id = $1', [user.id])
        return messages.rows
    }

    async getLastMessages() {
        const messages
            = await db.query('SELECT Distinct on(user_id) user_id, time_, text FROM Message')
        return (await messages.rows.sort((x, y) => y.time_ - x.time_))
    }

    async getSettings(id) {
        const buffer = fs.readFileSync('./common/chat_settings.json')
        const settings = JSON.parse(buffer)
        return await settings.find(i => i.id == id)
    }

    async addMessage(message) {
        console.log(message)
        const {text, status_id, user_id, sent_by_user} = message
        await db.query('INSERT INTO Message (text, time_, status_id, user_id, sent_by_user) ' +
            'values ($1, now()::timestamp(0), $2, $3, $4)',
            [text, status_id, user_id, sent_by_user])
    }

    async addHelloMessage(user_id) {
        const text = 'Здравствуйте, чем могу вам помочь?'
        await db.query('INSERT INTO Message (text, time_, status_id, user_id, sent_by_user) ' +
            'values ($1, now()::timestamp(0), $2, $3, $4)',
            [text, 2, user_id, false])
    }

}

module.exports = new UserController()

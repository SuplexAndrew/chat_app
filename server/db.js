const Pool = require('pg').Pool
const postgres = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'chatdb',
    password: '123',
    port: 5432,
})
module.exports = postgres

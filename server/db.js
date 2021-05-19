const Pool = require('pg').Pool
const postgres = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'chatdb',
    password: 'root',
    port: 5432,
})
module.exports = postgres

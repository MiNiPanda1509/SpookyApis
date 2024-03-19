const { createPool } = require("mysql")
require("dotenv").config();


const pool = createPool({
    port: process.env.MYSQL_PORT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    connectionLimit: 10
})

module.exports = pool;
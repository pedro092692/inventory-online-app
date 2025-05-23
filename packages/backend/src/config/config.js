/* eslint-disable no-undef */
require('dotenv').config()

const dbConfig = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "postgres"
}

module.exports = {
    development: dbConfig,
    production: dbConfig,
}
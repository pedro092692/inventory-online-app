/* eslint-disable no-undef */
require('dotenv').config()

const dbConfig = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres'
}

const appConfig = {
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10),
    jtw_secret: process.env.JWT_SECRET
}

module.exports = {
    development: {...dbConfig, ...appConfig},
    production: {...dbConfig, ...appConfig},
}
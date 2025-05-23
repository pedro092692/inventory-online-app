import 'dotenv/config' 
import process from 'process'
import { Sequelize } from 'sequelize'
import { initializeUser } from '../models/UserModel.js'


let instance = null

class Database {
    constructor() {
        // if alreday are an instance of sequelize return it 
        // avoid to create a new one. 
        if(instance) {
            return instance
        }
     
        this.sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 2, 
                min: 0,
                acquire: 3000,
                idle: 10000
            }
        })

        this.testConnection()
        this.initializeModels()

        // save instance 
        instance = this
    }

    async testConnection() {
        try{
            await this.sequelize.authenticate()
            console.log('Connection to database has been stablished sucessfully.')
        }catch(error){
            console.error('Unable connect to the database:', error)
        }
    }

    initializeModels() {
        // initialize public models
        initializeUser(this.sequelize)
    }
}

export default Database
import pkg from '../config/config.js'
import process from 'process'
import { Sequelize } from 'sequelize'
import { initializeUser, User } from '../models/UserModel.js'
import { initializeRole, Role } from '../models/RoleModel.js'
import TenantConnection from './tenant_connection.js'

const currentEnv = process.env.NODE_ENV || 'development'
const {username, password, database, host, port, dialect} = pkg[currentEnv]


let instance = null

class Database {
    constructor() {
        // if already are an instance of sequelize return it 
        // avoid to create a new one. 
        if(instance) {
            return instance
        }
     
        this.sequelize = new Sequelize(database, username, password, {
            host: host,
            port: port,
            dialect: dialect,
            logging: false,
            pool: {
                max: 2, 
                min: 0,
                acquire: 3000,
                idle: 10000
            }
        })

        // save connection for tenant
        this.tenantRegister = new Map()

        // save instance 
        instance = this

        this.testConnection()
        this.initializeModels()
        this.initializeRelations()

        this.tenant = new TenantConnection(this.sequelize)
        
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
        initializeRole(this.sequelize)
    
    }

    initializeRelations() {
        // Public models relations
        User.associationRole({Role})
        Role.associationUser({User})
    }

    // get all tenants 
    async getTenants() {
        const schemas = await this.sequelize.getQueryInterface().showAllSchemas()
        return schemas
    }
}
const db = new Database()
const associations = await db.initializeTenantAssociations

export {associations}

export default Database
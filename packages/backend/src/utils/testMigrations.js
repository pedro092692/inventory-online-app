import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import process from 'process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

async function testMigration() {
    // sequelize new instance
    const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        schema: 'test_schema'  // set test schema for testing.
    })

    // queryInterface for migration 
    const queryInterface = sequelize.getQueryInterface()

    // umzug instance 
    const umzug = new Umzug({
        migrations: {
            glob: '../migrations/tenant_migrations/*.js',
            resolve: ({ name, path, context }) => {
                return {
                    name,
                    up: async () => {
                        const migrationPath = pathToFileURL(path)
                        const migration = ( await import(migrationPath)).default
                        migration.up(context.queryInterface, Sequelize, context.schema)
                    }
                }
            }
        },
        context: {
            sequelize,
            queryInterface,
            schema: 'test_schema'
        },
        logger: console,
        storage: new SequelizeStorage({
            sequelize,
            tableName: 'SequelizeMeta',
            schema: 'test_schema'
        })
    })

    const new_migrations = await umzug.pending()
    if(new_migrations.length > 0) {
        await umzug.up() // execute migrations
    }

    console.log('Migrations were executed successfully.')
    
    await sequelize.close() // close the connection
}

await testMigration().then( () => process.exit(0) ).catch(error => {
    console.log('Error executing migrations:', error)
    process.exit(1)
})
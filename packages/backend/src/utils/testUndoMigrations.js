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

/**
 * Reverts all database migrations for the test environment.
 * This script connects to the test database, finds all applied migrations using Umzug,
 * and executes their `down` method to roll back the schema changes. It is designed
 * to be run as part of a testing teardown process.
 * @returns {Promise<void>} A promise that resolves when migrations are reverted or rejects on error.
 */
async function revertTestMigrations() {
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
                    down: async () => {
                        const migrationPath = pathToFileURL(path)
                        const migration = ( await import(migrationPath)).default
                        migration.down(context.queryInterface, Sequelize, context.schema)
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

   

    // --- CHANGE HERE: How to revert ---
    // Option A: Revert ALL migrations (undo everything)
    console.log('Attempting to revert ALL migrations...');
    await umzug.down({ to: 0 }); // This will execute 'down' for all applied migrations
    
    await sequelize.close() // close the connection
}

await revertTestMigrations().then( () => process.exit(0) ).catch(error => {
    console.log('Error reverting migrations:', error)
    process.exit(1)
})
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
 * Reverts all database seeders for the test environment.
 * This script connects to the test database, finds all applied seeders using Umzug,
 * and executes their `down` method to remove the seeded data. It is designed
 * to be run as part of a testing teardown process.
 * @returns {Promise<void>} A promise that resolves when seeders are reverted or rejects on error.
 */
async function revertTestSeeders() {
    // Sequelize new instance 
    const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        schema: 'test_schema'  // set test schema for testing.
    })

    // QueryInterface for seeding
    const queryInterface = sequelize.getQueryInterface()

    // Umzug instance for seeding
    const umzug = new Umzug({
        migrations: {
            glob: '../seeders/*.js',
            resolve: ({ name, path, context }) => {
                return {
                    name,
                    down: async () => {
                        const seederPath = pathToFileURL(path)
                        const seeder = (await import(seederPath)).default
                        await seeder.down(context.queryInterface, Sequelize, context.schema)
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

    // new_seeds
    await umzug.down({ to: 0 }); // This will execute 'down' for all applied migrations
    
    await sequelize.close() // close the connection
}

await revertTestSeeders().then(() => {
    console.log('Test seeders reverted successfully.')
}).catch((error) => {
    console.error('Error reverting test seeders:', error)
    process.exit(1)
})
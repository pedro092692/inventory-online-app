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
 * Runs database seeders for the test environment.
 * This script connects to the test database, finds pending seeders using Umzug,
 * executes them to populate the database with initial data, and then closes the connection.
 * It is designed to be run as part of a testing setup process after migrations.
 * @returns {Promise<void>} A promise that resolves when seeders are complete or rejects on error.
 */
async function testSeeder() {
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
                    up: async () => {
                        const seederPath = pathToFileURL(path)
                        const seeder = (await import(seederPath)).default
                        await seeder.up(context.queryInterface, Sequelize, context.schema)
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
    const new_seeds = await umzug.pending()
    if (new_seeds.length > 0) {
        await umzug.up() // execute seeds
    }

    console.log('Seeds were executed successfully.')
    await sequelize.close() // close the connection
}

await testSeeder().then(() => {
    console.log('Test seeder completed successfully.')
}).catch((error) => {
    console.error('Error during test seeder:', error)
    process.exit(1)
})
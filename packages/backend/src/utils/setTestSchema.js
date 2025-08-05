import Database from '../database/database.js'

async function setPathToTestTenant(req, res, next) {
    const db = new Database();
    const sequelize = db.sequelize

    // change the path to the test schema
    sequelize.query('SET search_path TO "test_tenant"')
    
    next()
}

export default setPathToTestTenant;
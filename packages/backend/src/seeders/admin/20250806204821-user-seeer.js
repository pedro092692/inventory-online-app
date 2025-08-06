'use strict';

const config = require('../../config/config')
const bcrypt = require('bcrypt')
const process = require('process')

const currentEnv = process.env.NODE_ENV || 'development'
const {admin_user, admin_pass, admin_role, admin_tenant, saltRounds} = config[currentEnv]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
     {
        email: admin_user,
        password: await bcrypt.hash(admin_pass, saltRounds),
        role_id: parseInt(admin_role),
        tenant_id: parseInt(admin_tenant)
     }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
        {
          tableName: 'users'
        },
        null, // this means "no condition" = delete all rows
        {
          truncate: true,
          restartIdentity: true,
          cascade: true
        }
     )
  }
};

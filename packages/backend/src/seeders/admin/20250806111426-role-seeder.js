'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     return queryInterface.bulkInsert('roles', [
      {
        name: 'admin'
      },
      {
        name: 'store-owner'
      },
      {
        name: 'store-manager'
      },
      {
        name: 'user'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
     return queryInterface.bulkDelete(
        {
          tableName: 'roles'
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

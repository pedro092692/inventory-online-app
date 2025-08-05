'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'roles', schema: 'public' },
      
      {

        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false, 
          validate: {
            notEmpty: true
          }
        }

      }
    ) 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('roles')
  }
};

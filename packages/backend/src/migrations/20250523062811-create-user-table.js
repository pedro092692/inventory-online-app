'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'users', schema: 'public' },
      
      {
        
        id:{
          type: Sequelize.INTEGER, 
          autoIncrement: true,
          primaryKey: true
        },

        email:{
          type: Sequelize.STRING,
          allowNull: false,
          validate:{
            isEmail: true
          },
          unique: true
        },

        password:{
          type: Sequelize.STRING,
          allowNull: false,
          validate:{
            len:{
              args: [8]
            }
          }
        },

        role_id:{
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'roles',
            key: 'id'
          }
        },
        tenant_id:{
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
  }
};

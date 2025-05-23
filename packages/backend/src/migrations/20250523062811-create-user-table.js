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
            isEmail:{
              msg: "A valid email is required."
            }
          },
          unique:{
            msg: "This email already has been taken."
          }
        },

        password:{
          type: Sequelize.STRING,
          allowNull: false,
          validate:{
            len:{
              args: [8],
              msg: "The password at least must be 8 character long."
            }
          }
        },

        roleId:{
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "roles",
            key: "id"
          }
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
  }
};

export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.createTable(
      "customers",
      {
        id: {
           type: Sequelize.INTEGER,
           autoIncrement: true,
           primaryKey: true
         },

         id_number: {
          type: Sequelize.INTEGER, // int for Venezuelan id
          allowNull: false, 
          validate: {
            notEmpty: true
          }
         }, 

         name: {
          type: Sequelize.STRING,
          allowNull: false, 
          validate: {
            notEmpty: true,
          }
         },
         
         phone: {
          type: Sequelize.STRING,
          allowNull: false,
         }
      },
      {
        schema
      }
    )
  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.dropTable({
      tableName: "customers",
      schema: schema
    })
  }
};

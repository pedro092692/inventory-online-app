export default {
  async up (queryInterface, Sequelize, schema) {
    queryInterface.createTable(
      'payments',
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
        },
        currency: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        }
      },
      {
        schema
      }
    )
  },

  async down (queryInterface, Sequelize, schema) {
    await queryInterface.dropTable({
      tableName: 'payments',
      schema
    })
  }
};

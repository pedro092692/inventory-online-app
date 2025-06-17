export default {
  async up (queryInterface, Sequelize, schema){
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.createTable(
      "dollar-value",
      {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaaryKey: true
        },

        value: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          validate: {
              isNumeric: true
          }
        },

        date: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: {
            isDate: true
          }
        }
      },
      {
        schema
      }
    )
  },

  async down (queryInterface, Sequelize, schema){
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.dropTable({
      tableName: "dollar-value",
      schema
    })
  }
};

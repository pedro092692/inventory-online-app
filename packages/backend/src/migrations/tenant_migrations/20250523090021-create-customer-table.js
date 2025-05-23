export default {
  async up (queryInterface, Sequelize, schema ) {
    await queryInterface.createTable(
      'customers',
      {
        id:{
          type: Sequelize.INTERGER
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    
  }
};

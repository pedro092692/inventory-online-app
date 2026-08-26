'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: 'stores', schema: 'public' },
      'subscription_expires_at',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: 'stores', schema: 'public' },
      'subscription_expires_at'
    )
  }
};

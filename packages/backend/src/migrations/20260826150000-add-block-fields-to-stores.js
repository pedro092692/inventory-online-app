'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: 'stores', schema: 'public' },
      'blocked_reason',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
    await queryInterface.addColumn(
      { tableName: 'stores', schema: 'public' },
      'blocked_at',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: 'stores', schema: 'public' },
      'blocked_reason'
    )
    await queryInterface.removeColumn(
      { tableName: 'stores', schema: 'public' },
      'blocked_at'
    )
  }
};

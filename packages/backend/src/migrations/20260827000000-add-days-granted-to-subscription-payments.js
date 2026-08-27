'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      { tableName: 'subscription_payments', schema: 'public' },
      'days_granted',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    )
  },

  async down (queryInterface) {
    return queryInterface.removeColumn(
      { tableName: 'subscription_payments', schema: 'public' },
      'days_granted'
    )
  }
};

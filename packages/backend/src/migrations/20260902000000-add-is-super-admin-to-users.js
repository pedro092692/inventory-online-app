'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'is_super_admin', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },

  async down (queryInterface) {
    return queryInterface.removeColumn('users', 'is_super_admin')
  }
};

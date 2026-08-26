'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable(
      { tableName: 'subscription_payments', schema: 'public' },
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },

        tenant_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE'
        },

        amount_declared: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false
        },

        amount_expected: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: true
        },

        receipt_key: {
          type: Sequelize.STRING,
          allowNull: false
        },

        status: {
          type: Sequelize.ENUM('pending', 'approved', 'rejected'),
          allowNull: false,
          defaultValue: 'pending'
        },

        submitted_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },

        reviewed_at: {
          type: Sequelize.DATE,
          allowNull: true
        },

        reviewed_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE'
        },

        rejection_reason: {
          type: Sequelize.STRING,
          allowNull: true
        }
      }
    )
  },

  async down (queryInterface) {
    await queryInterface.dropTable({ tableName: 'subscription_payments', schema: 'public' })
    return queryInterface.sequelize.query('DROP TYPE IF EXISTS "public"."enum_subscription_payments_status";')
  }
};

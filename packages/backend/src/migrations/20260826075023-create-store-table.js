'use strict';
/**
 * Sequelize migration to create the `stores` table.
 *
 * Stores the business/profile metadata of each tenant (nombre del negocio,
 * registro fiscal, dirección, teléfono), separada del `User` que es la
 * persona dueña — así "el negocio" no depende de una sola persona.
 *
 * Fields:
 * - `id`: Auto-incrementing primary key.
 * - `tenant_id`: El mismo id usado para nombrar el schema del tenant
 *    (igual al id del owner en `users`). Una tienda por tenant_id.
 * - `name`: Nombre del negocio, requerido.
 * - `fiscal_id`: Número de registro fiscal, opcional.
 * - `address`: Dirección del negocio, requerida.
 * - `phone`: Teléfono del negocio, requerido.
 * - `is_active`: Si la tienda (y por extensión todo su tenant) está activa.
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 * @returns {Promise<void>}
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'stores', schema: 'public' },
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },

        tenant_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          references: {
            model: 'users',
            key: 'id'
          }
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: { notEmpty: true }
        },

        fiscal_id: {
          type: Sequelize.STRING,
          allowNull: true
        },

        address: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: { notEmpty: true }
        },

        phone: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: { notEmpty: true }
        },

        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable({ tableName: 'stores', schema: 'public' })
  }
};
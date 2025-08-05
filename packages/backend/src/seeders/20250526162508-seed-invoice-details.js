import { invoiceDetails } from '../utils/fakerInvoiceDetails.js'
export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: 'invoice_details',
        schema: schema
      },
      invoiceDetails
    );
  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: 'invoice_details',
        schema: schema
      },
      null, // this means "no condition" = delete all rows
      {
        truncate: true,
        restartIdentity: true,
        cascade: true
      }
    );
  }
};

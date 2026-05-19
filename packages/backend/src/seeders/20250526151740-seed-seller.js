  /**
   * Inserts dummy seller data into the `sellers` table within the specified schema.
   *
   * @param {object} queryInterface - Sequelize's query interface for database operations.
   * @param {object} Sequelize - Sequelize library instance (not used directly here).
   * @param {string} schema - The name of the database schema to target.
   * @returns {Promise<void>}
   */
export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
          tableName: 'sellers',
          schema: schema
      },
      [
        {
          user_id: 1,
          is_supervisor: true,
          pin: '8974',
          id_number: 21259867, // Example Venezuelan ID number
          name: 'Pedro Daniel',
          last_name: 'Beltran',
          address: 'San Fernando De Henares, Madrid, Spain' // Example address
        },
        {
          user_id: 2,
          is_supervisor: false,
          pin: '1234',
          id_number: 19101504, // Venezuelan ID number
          name: 'Daniel',
          last_name: 'Ceballos',
          address: '123 Main St, Caracas, Venezuela', // Example address
        },
        {
          user_id: 3,
          is_supervisor: false,
          pin: '5678',
          id_number: 25542141, // Another Venezuelan ID number
          name: 'Andrea',
          last_name: 'Gonzalez',
          address: '456 Elm St, Maracaibo, Venezuela', // Another example address
        },
        {
          user_id: 4,
          is_supervisor: true,
          pin: '9012',
          id_number: 12345661, // Yet another Venezuelan ID number
          name: 'Javier',
          last_name: 'Martinez',
          address: '789 Oak St, Valencia, Venezuela', // Yet another example address
        }
      ]
    )
  },

  /**
   * Deletes all data from the `sellers` table within the specified schema.
   * Uses `truncate` to remove all rows and reset identity counters.
   *
   * @param {object} queryInterface - Sequelize's query interface for database operations.
   * @param {object} Sequelize - Sequelize library instance (not used directly here).
   * @param {string} schema - The name of the database schema to target.
   * @returns {Promise<void>}
   */
  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: 'sellers',
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

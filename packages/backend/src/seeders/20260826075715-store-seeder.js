export default {
  
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      {
        tableName: 'stores',
        schema: 'public'
      },
      [{
        id: 1,
        tenant_id: 1,
        name: 'Bonanza',
        fiscal_id: 'J302843120',
        address: 'Centro comercial residencias palo negro local 5-2',
        phone: '04243067310',
        is_active: true,

      }]
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      {
        tableName: 'stores',
        schema: 'public'
      },
      null,
      {
        truncate: true,
        restartIdentity: true,
        cascade: true
      }
    )
  }
};

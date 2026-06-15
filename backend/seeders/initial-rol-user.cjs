'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Crear Roles
    const roles = await queryInterface.bulkInsert('roles', [
      { nombre: 'Root', descripcion: 'Administrador total', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Administrador', descripcion: 'Administrador limitado', createdAt: new Date(), updatedAt: new Date() }
    ], { returning: ['id'] });

    // 2. Crear Usuario Admin inicial (password: admin123)
    const hashedPassword = await bcrypt.hash('Root123', 10);
    
    await queryInterface.bulkInsert('usuarios', [{
      user: 'Root',
      password: hashedPassword,
      rolId: 1, // Asumiendo que Root es el ID 1
      flagHabilitado: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};

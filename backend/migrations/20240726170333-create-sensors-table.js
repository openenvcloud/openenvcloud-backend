'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sensors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      apiKey: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Dodajemy klucz obcy do tabeli User, jeśli istnieje
    await queryInterface.addConstraint('Sensors', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_sensors_userId', // opcjonalna nazwa klucza obcego
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sensors');
  },
};

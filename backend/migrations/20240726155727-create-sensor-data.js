'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SensorData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      temperature: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      humidity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      airQuality: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING, // Możemy użyć STRING dla prostoty
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SensorData');
  }
};

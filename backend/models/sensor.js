const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SensorData = sequelize.define('SensorData', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  humidity: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  airQuality: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  location: {
    type: DataTypes.GEOGRAPHY,
    allowNull: true,
  },
});

module.exports = SensorData;

// models/sensorData.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sensor = require('./sensor');

const SensorData = sequelize.define('SensorData', {
  sensorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sensor,
      key: 'id',
    },
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
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = SensorData;

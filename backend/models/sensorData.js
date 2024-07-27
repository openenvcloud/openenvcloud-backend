const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sensor = require('./sensor');

const SensorData = sequelize.define('SensorData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sensorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sensor',
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
}, {
  timestamps: true,
});

SensorData.belongsTo(Sensor, { foreignKey: 'sensorId' });

module.exports = SensorData;

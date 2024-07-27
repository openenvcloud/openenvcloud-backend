const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Sensor = require('./sensor');
const SensorData = require('./sensorData');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User;
db.Sensor = Sensor;
db.SensorData = SensorData;

// Define associations
User.hasMany(Sensor, { foreignKey: 'userId' });
Sensor.belongsTo(User, { foreignKey: 'userId' });

Sensor.hasMany(SensorData, { foreignKey: 'sensorId' });
SensorData.belongsTo(Sensor, { foreignKey: 'sensorId' });

module.exports = db;

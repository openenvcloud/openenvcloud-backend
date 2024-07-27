// controllers/sensorController.js
const Sensor = require('../models/sensor');
const SensorData = require('../models/sensorData');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Tworzenie nowego sensora
exports.createSensor = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    const apiKey = jwt.sign({ userId, name }, process.env.API_KEY_SECRET, { expiresIn: '30d' });
    const sensor = await Sensor.create({ userId, name, apiKey });
    res.status(201).json(sensor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sensor', error });
  }
};

// Pobieranie sensorów użytkownika
exports.getSensors = async (req, res) => {
  try {
    const userId = req.user.id;
    const sensors = await Sensor.findAll({ where: { userId } });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensors', error });
  }
};

// Pobieranie danych z sensorów z różnymi filtrami
exports.getSensorData = async (req, res) => {
  try {
    const { location, sensorId, apiKey } = req.query;

    const whereClause = {};

    if (location) {
      whereClause.location = location;
    }
    if (sensorId) {
      whereClause.sensorId = sensorId;
    }
    if (apiKey) {
      const sensor = await Sensor.findOne({ where: { apiKey } });
      if (sensor) {
        whereClause.sensorId = sensor.id;
      }
    }

    const sensorData = await SensorData.findAll({ where: whereClause });
    res.status(200).json(sensorData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor data', error });
  }
};

// Pobieranie najnowszych danych z sensorów
exports.getLatestSensorData = async (req, res) => {
  try {
    const latestSensorData = await sequelize.query(
      `SELECT DISTINCT ON ("sensorId") *
      FROM "SensorData"
      ORDER BY "sensorId", "createdAt" DESC`,
      {
        model: SensorData,
        mapToModel: true
      }
    );

    res.status(200).json(latestSensorData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest sensor data', error });
  }
};

// Pobieranie danych z sensorów na podstawie klucza API
exports.getSensorDataByApiKey = async (req, res) => {
  try {
    const { apiKey } = req.params;
    const sensor = await Sensor.findOne({ where: { apiKey } });

    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    const sensorData = await SensorData.findAll({ where: { sensorId: sensor.id } });
    res.status(200).json(sensorData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor data by API key', error });
  }
};

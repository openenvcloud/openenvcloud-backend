// controllers/sensorController.js
const SensorData = require('../models/sensor');

// Przykład zapisywania danych z sensorów
exports.saveSensorData = async (req, res) => {
  try {
    const { userId, temperature, humidity, airQuality, location } = req.body;
    const newSensorData = await SensorData.create({ userId, temperature, humidity, airQuality, location });
    res.status(201).json(newSensorData);
  } catch (error) {
    res.status(500).json({ message: 'Error saving sensor data', error });
  }
};

// Przykład pobierania danych z sensorów
exports.getSensorData = async (req, res) => {
  try {
    const sensorData = await SensorData.findAll();
    res.status(200).json(sensorData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor data', error });
  }
};

const SensorData = require('../models/sensor');

// Zapisywanie danych z sensorów
exports.saveSensorData = async (req, res) => {
  try {
    const { temperature, humidity, airQuality, location } = req.body;
    const userId = req.user.id; // Pobierz id użytkownika z middleware
    const newSensorData = await SensorData.create({ userId, temperature, humidity, airQuality, location });
    res.status(201).json(newSensorData);
  } catch (error) {
    console.log('Error saving sensor data:', error);
    res.status(500).json({ message: 'Error saving sensor data', error });
  }
};

// Pobieranie danych z sensorów
exports.getSensorData = async (req, res) => {
  try {
    const sensorData = await SensorData.findAll();
    console.log('Used getSensorData');
    res.status(200).json(sensorData);
  } catch (error) {
    console.log('Error fetching sensor data:', error);
    res.status(500).json({ message: 'Error fetching sensor data', error });
  }
};

// controllers/sensorController.js
const Sensor = require('../models/sensor');
const SensorData = require('../models/sensorData');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// Create a new sensor
exports.createSensor = async (req, res) => {
  try {
    const { name, location } = req.body;
    const userId = req.user.id;
    const apiKey = jwt.sign({ userId, name }, process.env.API_KEY_SECRET, { expiresIn: '30d' });
    const sensor = await Sensor.create({ userId, name, apiKey, location });
    res.status(201).json(sensor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sensor', error });
  }
};

// Request all user sensors
exports.getSensors = async (req, res) => {
  try {
    const userId = req.user.id;
    const sensors = await Sensor.findAll({ where: { userId } });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensors', error });
  }
};

// Request sensors data with filtering
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

// Request newest data from sensors
exports.getLatestSensorData = async (req, res) => {
  try {
    // Find all sensors
    const sensors = await Sensor.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    });

    let latestSensorData = [];

    await Promise.all(sensors.map(async (sensor) => {
      const sensorData = await SensorData.findOne({
        where: { sensorId: sensor.id },
        order: [['createdAt', 'DESC']]
      });

      if (sensorData) {
        // Remove API key before response
        const sensorWithoutApiKey = {
          ...sensor.get({ plain: true }),
          apiKey: undefined
        };

        latestSensorData.push({
          sensor: sensorWithoutApiKey,
          sensorData
        });
      }
    }));

    console.log('Fetched latest sensor data:', latestSensorData);

    res.status(200).json(latestSensorData);
  } catch (error) {
    console.error('Error fetching latest sensor data:', error);
    res.status(500).json({ message: 'Error fetching latest sensor data', error: error.message });
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

    const response = {
      "id": sensor.id,
      "userId": sensor.userId,
      "name": sensor.name,
      "location": sensor.location
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor data by API key', error });
  }
};

// Push sensor data to databse and add user a points
exports.addSensorData = async (req, res) => {
  try {
    const { sensorId, temperature, humidity, airQuality } = req.body;
    
    // Pobieranie klucza API z nagłówka Authorization
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const apiKey = authorizationHeader.split(' ')[1]; // For format "Bearer <api_key>"
    if (!apiKey) {
      return res.status(401).json({ message: 'API key is missing' });
    }

    // API Key verification
    const sensor = await Sensor.findOne({ where: { id: sensorId, apiKey } });
    if (!sensor) {
      return res.status(403).json({ message: 'Invalid API key or sensor ID' });
    }

    const user = User.findOne({ where: {} })

    const pointsEarned = 1 + (temperature ? 2 : 0) + (humidity ? 2 : 0) + (airQuality ? 2 : 0);
    await User.increment('points', { by: pointsEarned, where: { id: req.user.userId } });

    const sensorData = await SensorData.create({
      sensorId,
      temperature,
      humidity,
      airQuality,
    });

    res.status(201).json(sensorData);
  } catch (error) {
    console.error('Error adding sensor data:', error); // Dodajemy logowanie błędu do konsoli
    res.status(500).json({ message: 'Error adding sensor data', error });
  }
};

exports.getSensorHistory = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const sensorData = await SensorData.findAll({
      where: { sensorId },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json(sensorData);
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    res.status(500).json({ message: 'Error fetching sensor history', error: error.message });
  }
};

exports.searchSensors = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const sensors = await Sensor.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`
        }
      }
    });

    res.status(200).json(sensors);
  } catch (error) {
    console.error('Error searching sensors:', error);
    res.status(500).json({ message: 'Error searching sensors', error: error.message });
  }
};
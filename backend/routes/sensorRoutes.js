// routes/sensorRoutes.js
const express = require('express');
const { createSensor, getSensors, getSensorData, getLatestSensorData, getSensorDataByApiKey, addSensorData } = require('../controllers/sensorController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, createSensor);
router.get('/', auth, getSensors);
router.get('/data', auth, getSensorData); // Dodajemy różne trasy do filtrowania danych
router.get('/latest', auth, getLatestSensorData);
router.get('/by-api-key/:apiKey', auth, getSensorDataByApiKey);
router.post('/data', auth, addSensorData); // Nowy endpoint do dodawania danych

module.exports = router;

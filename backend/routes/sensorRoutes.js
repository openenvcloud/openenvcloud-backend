// routes/sensorRoutes.js
const express = require('express');
const { createSensor, getSensors, getSensorData, getLatestSensorData, getSensorDataByApiKey } = require('../controllers/sensorController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, createSensor);
router.get('/', auth, getSensors);
router.get('/data', auth, getSensorData); // Dodajemy różne trasy do filtrowania danych
router.get('/latest', auth, getLatestSensorData);
router.get('/by-api-key/:apiKey', auth, getSensorDataByApiKey);

module.exports = router;

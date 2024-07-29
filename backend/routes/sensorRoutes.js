// routes/sensorRoutes.js
const express = require('express');
const { 
    createSensor,
    getSensors, 
    getSensorData, 
    getLatestSensorData, 
    getSensorDataByApiKey, 
    addSensorData, 
    getSensorHistory, 
    searchSensors,
    deleteSensor
} = require('../controllers/sensorController');

const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, createSensor);
router.get('/', auth, getSensors);
router.get('/data', getSensorData); // Dodajemy różne trasy do filtrowania danych
router.get('/latest', getLatestSensorData);
router.get('/by-api-key/:apiKey', getSensorDataByApiKey);
router.post('/data/push', auth, addSensorData); // Nowy endpoint do dodawania danych
router.get('/:sensorId/history', getSensorHistory);
router.get('/search', searchSensors);
router.delete('/sensors/:sensorId', auth, deleteSensor);

module.exports = router;

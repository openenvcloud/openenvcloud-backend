// routes/sensorRoutes.js
const express = require('express');
const { saveSensorData, getSensorData } = require('../controllers/sensorController');
const router = express.Router();

router.post('/', saveSensorData);
router.get('/', getSensorData);

module.exports = router;

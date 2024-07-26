// routes/sensorRoutes.js
const express = require('express');
const { saveSensorData, getSensorData } = require('../controllers/sensorController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, saveSensorData);
router.get('/', auth, getSensorData);

module.exports = router;

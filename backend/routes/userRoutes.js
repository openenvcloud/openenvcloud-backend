// routes/userRoutes.js
const express = require('express');
const { register, login, generateApiKey } = require('../controllers/userController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/api-key', generateApiKey);

module.exports = router;

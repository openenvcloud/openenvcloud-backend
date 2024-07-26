// routes/userRoutes.js
const express = require('express');
const { register, login, generateApiKey } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/api-key', auth, generateApiKey);

module.exports = router;

// routes/userRoutes.js
const express = require('express');
const { register, login, generateApiKey, getLeaderboard } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/api-key', auth, generateApiKey);
router.get('/leaderboard', getLeaderboard);

module.exports = router;

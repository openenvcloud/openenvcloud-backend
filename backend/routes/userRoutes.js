// routes/userRoutes.js
const express = require('express');
const { getLeaderboard } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/leaderboard', getLeaderboard);

module.exports = router;

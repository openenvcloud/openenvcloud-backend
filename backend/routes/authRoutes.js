// routes/userRoutes.js
const express = require('express');
const { 
    register, 
    login, 
    generateApiKey, 
    getProfile, 
    updatePassword, 
    updateUsername 
} = require('../controllers/authController');

const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/api-key', auth, generateApiKey);
router.get('/profile', auth, getProfile);
router.patch('/update-username', auth, updateUsername);
router.patch('/update-password', auth, updatePassword);

module.exports = router;

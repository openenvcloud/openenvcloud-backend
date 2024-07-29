const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// User login
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in user', error });
    }
};

// User register
exports.register = async (req, res) => {
    try {
      const { email, username, password } = req.body;
  
      // Check if email already exists
      const existingUserByEmail = await User.findOne({ where: { email } });
      if (existingUserByEmail) {
        return res.status(400).json({ message: 'Email already taken' });
      }
  
      // Check if username already exists
      const existingUserByUsername = await User.findOne({ where: { username } });
      if (existingUserByUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, username, password: hashedPassword });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
};

// Generate API key for new sensor
exports.generateApiKey = async (req, res) => {
    try {
      const userId = req.user.id; // Auth middleware adding req.user property
      const apiKey = jwt.sign({ id: userId }, process.env.API_KEY_SECRET);
      await User.update({ apiKey }, { where: { id: userId } });
      res.status(200).json({ apiKey });
    } catch (error) {
      res.status(500).json({ message: 'Error generating API key', error });
    }
};

// Get user data  
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
        attributes: ['email', 'username', 'points', 'createdAt']
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error });
    }
};

// Update username
exports.updateUsername = async (req, res) => {
    try {
      const { newUsername, password } = req.body;
      const user = await User.findByPk(req.user.id);
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const existingUsername = await User.findOne({ where: { username: newUsername } });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
  
      user.username = newUsername;
      await user.save();
      res.status(200).json({ message: 'Username updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating username', error });
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findByPk(req.user.id);
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid old password' });
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating password', error });
    }
  };
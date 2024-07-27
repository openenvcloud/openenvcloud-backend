const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Przykład rejestracji użytkownika
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Przykład logowania użytkownika
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error });
  }
};

// Przykład generowania klucza API
exports.generateApiKey = async (req, res) => {
  try {
    const userId = req.user.id; // Zakładamy, że middleware autoryzacyjny doda userId do req.user
    const apiKey = jwt.sign({ id: userId }, process.env.API_KEY_SECRET, { expiresIn: '30d' });
    await User.update({ apiKey }, { where: { id: userId } });
    res.status(200).json({ apiKey });
  } catch (error) {
    res.status(500).json({ message: 'Error generating API key', error });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ['username', 'points'],
      order: [['points', 'DESC']],
      limit: 100
    });

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

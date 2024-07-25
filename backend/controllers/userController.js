const User = require('../models/user');

// Przykład rejestracji użytkownika
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/users', userRoutes); // Routes for user info. Only public data.
app.use('/api/auth', authRoutes); // Routes for account creating, loggin in or changing data on account.
app.use('/api/sensors', sensorRoutes); // Routes for all sensors and sensors data.

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

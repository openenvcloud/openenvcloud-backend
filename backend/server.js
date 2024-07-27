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

app.use('/api/users', userRoutes); // Option for user info. Just now for authorization too
app.use('/api/auth', userRoutes); // Will create a new file with just auth routes like register, login or change password
app.use('/api/sensors', sensorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

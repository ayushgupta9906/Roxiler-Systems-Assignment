// index.js
const express = require('express');
const mongoose = require('mongoose');
const chartsRoute = require('./src/routes/charts');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('your-mongodb-uri', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Middleware to parse JSON
    app.use(express.json());

    // Use the charts route
    app.use('/api', chartsRoute);

    // Start the server after successfully connecting to the database
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));

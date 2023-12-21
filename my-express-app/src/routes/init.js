// routes/init.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Book = require('../models/book');

router.get('/initialize', async (req, res) => {
  try {
    // Fetch data from the third-party API (replace with your actual API endpoint)
    const response = await axios.get('https://api.example.com/books');

    // Extract relevant data from the API response
    const booksData = response.data;

    // Insert data into the MongoDB collection
    await Book.insertMany(booksData);

    res.status(200).json({ message: 'Database initialized with seed data' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

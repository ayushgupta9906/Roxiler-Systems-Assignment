// routes/charts.js
const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// API for bar chart
router.get('/bar-chart/:month', async (req, res) => {
  try {
    const { month } = req.params;

    // Define price ranges
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    // Calculate the number of items in each price range for the selected month
    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Book.countDocuments({
          $expr: {
            $eq: [{ $month: '$dateOfSale' }, parseInt(month, 10)],
          },
          price: { $gte: range.min, $lt: range.max },
        });
        return { range, count };
      })
    );

    res.status(200).json({ barChartData });
  } catch (error) {
    console.error('Error retrieving bar chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API for pie chart
router.get('/pie-chart/:month', async (req, res) => {
  try {
    const { month } = req.params;

    // Calculate the number of items in each category for the selected month
    const pieChartData = await Book.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month, 10)] },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ pieChartData });
  } catch (error) {
    console.error('Error retrieving pie chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API for combined response
router.get('/combined-chart/:month', async (req, res) => {
  try {
    const { month } = req.params;

    // Fetch data from bar chart API
    const barChartDataResponse = await fetch(`http://localhost:3000/api/bar-chart/${month}`);
    const barChartData = await barChartDataResponse.json();

    // Fetch data from pie chart API
    const pieChartDataResponse = await fetch(`http://localhost:3000/api/pie-chart/${month}`);
    const pieChartData = await pieChartDataResponse.json();

    res.status(200).json({ barChartData, pieChartData });
  } catch (error) {
    console.error('Error retrieving combined chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

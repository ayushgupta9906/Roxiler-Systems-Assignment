// src/components/TransactionsStatistics.js
import React, { useState, useEffect } from 'react';
import { fetchStatistics } from '../services/api';

const TransactionsStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    // Fetch statistics on mount and whenever selectedMonth changes
    const fetchData = async () => {
      try {
        const response = await fetchStatistics(selectedMonth);
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchData();
  }, [selectedMonth]);

  return (
    <div>
      <h2>Transactions Statistics</h2>
      {/* Display statistics */}
    </div>
  );
};

export default TransactionsStatistics;

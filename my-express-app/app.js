// app.js

document.addEventListener('DOMContentLoaded', () => {
    const monthDropdown = document.getElementById('month');
    const searchInput = document.getElementById('search');
    const transactionsTableBody = document.querySelector('#transactionsTable tbody');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const totalSaleAmountElement = document.getElementById('totalSaleAmount');
    const totalSoldItemsElement = document.getElementById('totalSoldItems');
    const totalNotSoldItemsElement = document.getElementById('totalNotSoldItems');
    const barChartContainer = document.getElementById('barChartContainer');
    const barChartCanvas = document.getElementById('barChart');
  
    let currentPage = 1;
  
    // Function to fetch data from the backend
    const fetchData = async () => {
      try {
        const month = monthDropdown.value;
        const search = searchInput.value;
  
        // Use fetch to make API requests to your backend
        const response = await fetch(`http://your-backend-api-url/monthly-data?month=${month}&search=${search}`);
        const data = await response.json();
  
        // Update UI with fetched data
        updateTable(data.transactions);
        updateStatistics(data.statistics);
        updateBarChart(data.barChartData);
  
        // Enable/disable buttons based on conditions (replace with your logic)
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = data.transactions.length === 0; // Example condition
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    // Function to update the transactions table
    const updateTable = (transactions) => {
      transactionsTableBody.innerHTML = '';
  
      transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${transaction.title}</td>
          <td>${transaction.description}</td>
          <td>${transaction.price}</td>
        `;
        transactionsTableBody.appendChild(row);
      });
    };
  
    // Function to update the statistics box
    const updateStatistics = (statistics) => {
      totalSaleAmountElement.textContent = statistics.totalSaleAmount;
      totalSoldItemsElement.textContent = statistics.totalSoldItems;
      totalNotSoldItemsElement.textContent = statistics.totalNotSoldItems;
    };
  
    // Function to update the bar chart
    const updateBarChart = (barChartData) => {
      const ctx = barChartCanvas.getContext('2d');
  
      const data = {
        labels: barChartData.priceRanges,
        datasets: [{
          label: 'Number of Items',
          data: barChartData.itemCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      };
  
      const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
  
      // Check if the chart already exists and destroy it to prevent duplicate charts
      if (window.myBarChart) {
        window.myBarChart.destroy();
      }
  
      // Create the bar chart
      window.myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options,
      });
    };
  
    // Event listeners for user interactions
    monthDropdown.addEventListener('change', fetchData);
    searchInput.addEventListener('input', fetchData);
    prevPageButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchData();
      }s
    });
    nextPageButton.addEventListener('click', () => {
      currentPage++;
      fetchData();
    });
  
    // Initial data fetch
    fetchData();
  });
  
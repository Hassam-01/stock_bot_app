import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ChartComponent({ data, tradeDetails }) {
  // State to toggle dataset visibility
  const [visibility, setVisibility] = useState({
    closingPrices: true,
    volumes: true,
    tradePrice: true,
  });
  // Validate timestamps and format dates
  const labels = data.map((entry) => {
    console.log("Value:", entry.timestamp, "Type:", typeof entry.timestamp);
  
    // Ensure timestamp is a valid date
    const timestamp = Date.parse(entry.timestamp); // Parse ISO string to a valid timestamp
    console.log("Parsed Timestamp:", timestamp);
  
    return !isNaN(timestamp)
      ? new Date(timestamp).toLocaleString('en-US', { day: 'numeric', month: 'short' }) // Format to 'day month' (e.g., 5 Dec)
      : 'Invalid Timestamp';
  });
  // Prepare datasets based on visibility state
  const closingPrices = data.map((entry) => entry.closing || null);
  const volumes = data.map((entry) => entry.volume || null);

  const datasets = [];

  if (visibility.closingPrices) {
    datasets.push({
      label: 'Closing Prices',
      data: closingPrices,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    });
  }

  if (visibility.volumes) {
    datasets.push({
      label: 'Volume',
      data: volumes,
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
    });
  }

  if (visibility.tradePrice && tradeDetails) {
    const tradeIndex = data.findIndex(
      (entry) =>
        new Date(entry.timestamp * 1000).toDateString() === tradeDetails.date
    );

    datasets.push({
      label: 'Trade Price',
      data: new Array(data.length).fill(null).map((_, idx) =>
        idx === tradeIndex ? tradeDetails.price : null
      ),
      borderColor: 'rgba(255, 159, 64, 1)',
      pointRadius: 5,
      pointBackgroundColor: 'rgba(255, 159, 64, 1)',
      fill: false,
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  // Chart options with dynamic legend toggling
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        onClick: (e, legendItem) => {
          const label = legendItem.text;
          setVisibility((prev) => ({
            ...prev,
            closingPrices: label === 'Closing Prices' ? !prev.closingPrices : prev.closingPrices,
            volumes: label === 'Volume' ? !prev.volumes : prev.volumes,
            tradePrice: label === 'Trade Price' ? !prev.tradePrice : prev.tradePrice,
          }));
        },
      },
      title: {
        display: true,
        text: 'Stock Data Chart',
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default ChartComponent;

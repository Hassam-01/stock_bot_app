import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/sideBar';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
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

function PythonDataViewer({ data }) {
  return (
    <div className="border rounded p-4 bg-white shadow-lg w-1/3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Python Data</h3>
      {data && Object.keys(data).length > 0 ? (
        <div>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Key</th>
                <th className="border px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-2 font-medium">{key}</td>
                  <td className="border px-4 py-2">{JSON.stringify(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No data available.</p>
      )}
    </div>
  );
}

function Trading() {
  const [trends, setTrends] = useState({ t: [], c: [] });
  const [ticker, setTicker] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [predictionData, setPredictionData] = useState({});
  const [selectedGraph, setSelectedGraph] = useState('closing');
  const [pythonData, setPythonData] = useState({});

  useEffect(() => {
    setTrends({
      t: [1633046400, 1633132800, 1633219200, 1633305600, 1633392000],
      c: [145.09, 145.60, 146.92, 147.54, 148.69],
    });
  }, []);

  const isValidTicker = (ticker) => {
    const regex = /^[A-Z]{1,5}$/;
    return regex.test(ticker);
  };

  const handleGetRecommendation = async () => {
    const upperTicker = ticker.toUpperCase();
    if (!isValidTicker(upperTicker)) {
      toast.error('Invalid ticker symbol! Please enter a valid stock ticker.');
      return;
    }
    toast.info('Fetching recommendation...');

    axios.post('http://localhost:5000/api/recommendation', { ticker: upperTicker }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Include if you are handling cookies or authentication
    })
    .then(response => {
      setRecommendation(response.data.signal);
      // setPredictionData(response.data.predictionData);
      // setPythonData(response.data.pythonData);
      toast.success('Recommendation fetched successfully!');
    })
    .catch(err => {
      console.error('Error fetching recommendation:', err);
      toast.error('Failed to fetch recommendation. Please try again later.');
    });
  };

  const trendGraphData = {
    labels: (trends.t || []).map((timestamp) =>
      new Date(timestamp * 1000).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Closing Prices',
        data: trends.c || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const predictionGraphData = {
    labels: predictionData.dates || [],
    datasets: [
      {
        label: selectedGraph === 'closing' ? 'Closing Prices' : 'Volume',
        data: selectedGraph === 'closing' ? predictionData.closing || [] : predictionData.volume || [],
        borderColor: selectedGraph === 'closing' ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 206, 86, 1)',
        backgroundColor: selectedGraph === 'closing' ? 'rgba(255, 99, 132, 0.2)' : 'rgba(255, 206, 86, 0.2)',
      },
      {
        label: 'Upper Bound',
        data: predictionData.upper || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Lower Bound',
        data: predictionData.lower || [],
        borderColor: 'rgba(153, 102, 255, 1)',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  return (
    <div className="trading-container bg-purple-50 h-screen flex p-8">
      <ToastContainer />
      <div className="flex gap-8 w-full">
        <Sidebar className="h-full" />

        <main className="flex-1">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Trading</h1>
          </header>

          <section className="mb-8 flex gap-8">
            <div className="w-2/3">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Get Recommendation</h2>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Enter Stock Ticker"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="border rounded px-4 py-2"
                />
                <button
                  onClick={handleGetRecommendation}
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Get Recommendation
                </button>
              </div>
              {recommendation && (
                <p className="mt-4 text-lg font-medium text-gray-800">
                  Recommendation: {recommendation.toUpperCase()}
                </p>
              )}
            </div>

            <PythonDataViewer data={pythonData} />
          </section>

          {/* Prediction Graph */}
          {predictionData.dates && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Prediction Data
              </h2>
              <div className="h-64">
                <Line data={predictionGraphData} />
              </div>
            </section>
          )}

          {/* Trend Graph */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Asset Trends</h2>
            <div className="h-64">
              <Line data={trendGraphData} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Trading;

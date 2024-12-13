import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/sideBar';
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
import PythonDataViewer from '../components/pythonDataView';
import ChartComponent from '../components/ChartComponent';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


function Trading() {
  const [trends, setTrends] = useState({ t: [], c: [] });
  const [ticker, setTicker] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [predictionData, setPredictionData] = useState([]);
  const [pythonData, setPythonData] = useState({});
  const [tradeDetails, setTradeDetails] = useState({ date: '', price: '' });

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

    try {
      const response = await axios.post('http://localhost:5000/api/recommendation', {
        ticker: upperTicker,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const { signal, trade_date, trade_price, predictionData, pythonData } = response.data;

      setRecommendation(signal);
      console.log("predictionData", predictionData);
      setPredictionData(predictionData);
      setPythonData(pythonData);
      setTradeDetails({ date: trade_date, price: trade_price });

      toast.success('Recommendation fetched successfully!');
    } catch (err) {
      console.error('Error fetching recommendation:', err);
      toast.error('Failed to fetch recommendation. Please try again later.');
    }
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

          {/* Prediction Graphs */}
          {predictionData && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Prediction Data</h2>
              <ChartComponent
                data={predictionData}
                tradeDetails={tradeDetails}
              />
            </section>
          )}

          {/* Trend Graph */}
          {/* <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Asset Trends</h2>
            <ChartComponent
              data={{ dates: trends.t, closing: trends.c }}
              tradeDetails={null}
            />
          </section> */}
        </main>
      </div>
    </div>
  );
}

export default Trading;

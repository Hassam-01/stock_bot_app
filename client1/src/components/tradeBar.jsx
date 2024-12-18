import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTradeDetail } from '../features/tradeDetail/tradeDetailSlice';

function TradeBar({ tradeBarData }) {
  const { ticker, price, date, signal } = tradeBarData;
  const [quantities, setQuantities] = useState({}); // For SELL signal
  const [buyQuantity, setBuyQuantity] = useState(1); // For BUY signal
  const dispatch = useDispatch();
// const userId = useSelector((state) => state.userId.userId);
    const userId = 1 ;
  // Get the addedTrade state from Redux for SELL signal
  const addedTrade = useSelector((state) => state.setTrade.items);
  // Handle quantity change for SELL
  const handleQuantityChange = (item, value) => {
    setQuantities((prev) => ({
      ...prev,
      [item.price]: Math.min(Math.max(1, parseInt(value) || 1), item.quantity), // Ensure valid quantity
    }));
  };

  // Handle quantity change for BUY
  const handleBuyQuantityChange = (value) => {
    setBuyQuantity(Math.max(1, parseInt(value) || 1)); // Ensure at least 1 quantity
  };

  // Calculate total cost for SELL signal
  const totalSellCost = addedTrade
    .reduce((total, item) => {
      const quantity = quantities[item.price] || 1;
      return total + price * quantity;
    }, 0)
    .toFixed(2);

  // Calculate total cost for BUY signal
  const totalBuyCost = (price * buyQuantity).toFixed(2);

  const handleExecute = async () => {
    // /api/trade/${userId}/${signal.toLowerCase()}`
    const sellData = addedTrade.map(item => ({
      sellPrice: price,
      sellQuantity: buyQuantity || 1,
      sellDate: date,
      sellTicker: item.name,
      sellSignal: signal,
      sellStockId: item.stock_id,
      sellPriceId: item.price_id,
    }));
    dispatch(setTradeDetail({ stockId: sellData.sellStockId, tradePrice: sellData.sellPrice, tradeDate: sellData.sellDate, tradeQuantity: buyQuantity, tradeTicker: sellData.sellTicker, tradeSignal: sellData.sellSignal, priceId: sellData.sellPriceId })); 
    const dataSend = signal === "SELL" ? sellData  : { price, quantity: buyQuantity, date, signal, ticker };
    const response = await axios.post(`http://localhost:3009/api/trade/${userId}/${signal.toLowerCase()}`, {
        dataSend,
        });
    console.log(response.data);
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg w-1/3 mx-auto">
      {/* Trade Bar Label */}
      <div className="mb-4">
        <label htmlFor="quantity" className="block mb-2 text-sm font-semibold text-gray-600">
          Trade Bar: {signal}
        </label>

        {/* SELL Signal: List of Assets */}
        {signal === "SELL" && (
          <div className="flex flex-col gap-2">
            {addedTrade.map((item, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <p className="text-sm text-gray-600 font-medium">
                  Price: <span className="font-semibold">${price}</span>
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Available: <span className="font-semibold">{item.quantity}</span>
                </p>
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  value={quantities[item.price] || 1}
                  onChange={(e) => handleQuantityChange(item, e.target.value)}
                  className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* BUY Signal: Single Asset */}
        {signal === "BUY" && (
          <div className="flex items-center justify-between space-x-4">
            <p className="text-sm text-gray-600 font-medium">
              Ticker: <span className="font-semibold">{ticker}</span>
            </p>
            <p className="text-sm text-gray-600 font-medium">
              Price: <span className="font-semibold">${price}</span>
            </p>
            <input
              type="number"
              min="1"
              value={buyQuantity}
              onChange={(e) => handleBuyQuantityChange(e.target.value)}
              className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
      </div>

      {/* Total Cost */}
      <div className="mb-4 text-center">
        <span className="block text-sm font-semibold text-gray-600 mb-1">Total Cost:</span>
        <span className="text-xl font-bold text-purple-600">
          ${signal === "SELL" ? totalSellCost : totalBuyCost}
        </span>
      </div>

      {/* Execute Button */}
      <button
        onClick={handleExecute}
        className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 text-center"
      >
        Execute
      </button>
    </div>
  );
}

export default TradeBar;

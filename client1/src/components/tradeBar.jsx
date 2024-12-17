import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function TradeBar({ price = 0, onExecute }) {
  // State to hold quantity for each asset
  const [quantities, setQuantities] = useState({});

  // Get the addedTrade state from Redux
  const addedTrade = useSelector((state) => state.setTrade.items);

  // Calculate total cost based on price and individual quantity
  const totalCost = addedTrade.reduce((total, item) => {
    const quantity = quantities[item.price] || 1; // Default quantity to 1 if not set
    return total + (item.price * quantity);
  }, 0).toFixed(2);

  const handleQuantityChange = (item, value) => {
    setQuantities((prev) => ({
      ...prev,
      [item.price]: Math.min(Math.max(1, parseInt(value)), item.quantity), // Ensure valid quantity
    }));
  };

  const handleExecute = () => {
    if (onExecute) {
      const tradeDetails = addedTrade.map((item) => ({
        price: item.price,
        quantity: quantities[item.price] || 1, // Default quantity to 1 if not set
      }));
      onExecute(tradeDetails);
    }
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg max-w-xs mx-auto">
      {/* Trade Bar Label */}
      <div className="mb-4">
        <label htmlFor="quantity" className="block mb-2 text-sm font-semibold text-gray-600 ">
          Trade Bar
        </label>
        <div className="flex flex-col gap-2">
          {/* List of Assets with Price and Available Quantity */}
          {addedTrade.map((item, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <p className="text-sm text-gray-600 font-medium">
                Price: <span className="font-semibold">${item.price}</span>
              </p>
              <p className="text-sm text-gray-600 font-medium">
                Available: <span className="font-semibold">{item.quantity}</span>
              </p>
              <input
                id={`quantity-${item.price}`}
                type="number"
                min="1"
                max={item.quantity}  // Set the maximum quantity available
                value={quantities[item.price] || 1}  // Use the stored quantity for each item
                onChange={(e) => handleQuantityChange(item, e.target.value)}
                className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Total Cost */}
      <div className="mb-4 text-center">
        <span className="block text-sm font-semibold text-gray-600 mb-1">Total Cost:</span>
        <span className="text-xl font-bold text-purple-600">${totalCost}</span>
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

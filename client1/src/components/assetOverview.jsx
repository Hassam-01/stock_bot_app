import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTrade, removeTrade } from '../features/setTrade/setTradeSlice';

// Child Component for Asset Card
const AssetCard = ({ asset, isSelected, onClick }) => (
  <div
    onClick={() => onClick(asset)}
    className={`relative flex-shrink-0 w-40 rounded-lg shadow-md p-3 transition-shadow duration-200 cursor-pointer 
      ${isSelected ? 'bg-purple-800 text-white' : 'bg-purple-600 text-white hover:shadow-lg'}`}
  >
    <p className="text-sm font-medium">
      Price: <span className="font-semibold">${asset.price}</span>
    </p>
    <p className="text-sm font-medium">
      Quantity: <span className="font-semibold">{asset.quantity}</span>
    </p>

    {/* Hover Tooltip */}
    <div
      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs px-2 py-1 rounded-lg"
    >
      Click to {isSelected ? 'remove from' : 'add to'} trade
    </div>
  </div>
);

// Main Component
function AssetOverview({ assets }) {
  const dispatch = useDispatch();
  const addedTrade = useSelector((state) => state.setTrade.items); // Get updated state

  // Function to toggle asset selection
  const toggleAssetSelection = (asset) => {
    const isAlreadySelected = addedTrade.some((item) => item.price === asset.price);

    if (isAlreadySelected) {
      // Remove if already selected
      dispatch(removeTrade(asset));  // Dispatch remove action
    } else {
      // Add if not selected
      dispatch(addTrade(asset));  // Dispatch add action
    }
  };

  return (
    <div className="p-4 bg-white text-purple-600 rounded-lg shadow-md max-w-full -mt-8">
      <h2 className="text-lg font-semibold mb-3">Asset Overview</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-300 p-2">
        {assets && assets.length > 0 ? (
          assets.map((asset, index) => (
            <div className="group" key={index}>
              <AssetCard
                asset={asset}
                isSelected={addedTrade.some((item) => item.price === asset.price)} // Always use latest addedTrade state
                onClick={toggleAssetSelection}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No assets owned for this ticker.</p>
        )}
      </div>
    </div>
  );
}

export default AssetOverview;

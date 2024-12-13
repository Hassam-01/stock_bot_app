import React from 'react';

const ActivityTable = ({ activities }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-gray-600 font-medium">Date</th>
              <th className="px-4 py-2 text-gray-600 font-medium">Description</th>
              <th className="px-4 py-2 text-gray-600 font-medium">Quantity</th>
              <th className="px-4 py-2 text-gray-600 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="px-4 py-2 text-gray-700">{activity.date}</td>
                <td className={`px-4 py-2 ${activity.description && activity.description.toLowerCase() === 'buy' ? 'text-green-500' : activity.description && activity.description.toLowerCase() === 'sell' ? 'text-red-500' : 'text-green-700'}`}>
                  {activity.description}
                </td>
                <td className="px-4 py-2">
                  <span className="text-gray-700">{activity.quantity}</span>
                </td>
                <td className="px-4 py-2 text-gray-700">${activity.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ActivityTable;

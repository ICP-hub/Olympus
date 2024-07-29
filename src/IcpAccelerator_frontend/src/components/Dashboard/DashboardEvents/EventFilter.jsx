// Filters.js
import React from 'react';

const Filters = ({ isOpen }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${isOpen ? 'block' : 'hidden'} md:block sticky top-0`}>
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Event type</label>
        <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option>Select event type</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option>Select price</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date range</label>
        <div className="flex space-x-4">
          <input type="date" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          <input type="date" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          placeholder="E.g., Dubai"
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default Filters;

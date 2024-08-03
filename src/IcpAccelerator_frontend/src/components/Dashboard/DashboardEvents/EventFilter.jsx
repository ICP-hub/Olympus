// // Filters.js
// import React from 'react';

// const Filters = ({ isOpen }) => {
//   return (
//     <div className={`bg-white p-6 rounded-lg shadow-sm ${isOpen ? 'block' : 'hidden'} md:block sticky top-0`}>
//       <h2 className="text-lg font-semibold mb-4">Filters</h2>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Event type</label>
//         <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
//           <option>Select event type</option>
//         </select>
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
//         <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
//           <option>Select price</option>
//         </select>
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Date range</label>
//         <div className="flex space-x-4">
//           <input type="date" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//           <input type="date" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//         </div>
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//         <input
//           type="text"
//           placeholder="E.g., Dubai"
//           className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//         />
//       </div>
//     </div>
//   );
// };

// export default Filters;


// Filters.js
// Filters.js
import React, { useState, useRef } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const Filters = ({ isOpen }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const startDateRef = useRef();
  const endDateRef = useRef();

  const handleDateClick = (inputRef) => {
    inputRef.current.showPicker();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${isOpen ? 'block' : 'hidden'} md:block sticky top-0`}>
      <h2 className="text-[#121926] font-bold mb-4">Filters</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event type</label>
          <div className="relative">
            <select className="text-sm w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-500">
              <option>Select event type</option>
              <option>Select event type 2</option>
              <option>Select event type 3</option>
              <option>Select event type 4</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <div className="relative">
            <select className="text-sm w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-500">
              <option>Select event type</option>
              <option>Select event type 2</option>
              <option>Select event type 3</option>
              <option>Select event type 4</option>
              <option>Select event type 5</option>
              <option>Select event type 6</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date range</label>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <input
                ref={startDateRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="sr-only"
              />
              <input
                type="text"
                value={formatDate(startDate)}
                placeholder="Select date"
                readOnly
                className="text-sm w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-500 bg-white cursor-pointer"
                onClick={() => handleDateClick(startDateRef)}
              />
              <CalendarTodayOutlinedIcon 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" 
                fontSize="small" onClick={() => handleDateClick(startDateRef)}
              />
            </div>
            <div className="relative flex-1">
              <input
                ref={endDateRef}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="sr-only"
              />
              <input
                type="text"
                value={formatDate(endDate)}
                placeholder="Select date"
                readOnly
                className="text-sm w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-500 bg-white cursor-pointer"
                onClick={() => handleDateClick(endDateRef)}
              />
              <CalendarTodayOutlinedIcon 
                className="text-sm absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" 
                fontSize="small" onClick={() => handleDateClick(endDateRef)}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="E.g., Dubai"
            className="text-sm w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
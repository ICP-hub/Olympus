
import React, { useState, useRef } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import Select from 'react-select';

const Filters = ({ isOpen, setSelectedEventType }) => {
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

  // Event type options
  const eventTypeOptions = [
    { value: 'All', label: 'All' },
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'Upcoming', label: 'Upcoming' },
    { value: 'Past', label: 'Past' },
  ];

  // Price options
  const priceOptions = [
    { value: 'Free', label: 'Free' },
    { value: 'Paid', label: 'Paid' },
    { value: 'VIP', label: 'VIP' },
  ];

  const handleEventTypeChange = (selectedOption) => {
    setSelectedEventType(selectedOption.value); // Pass the selected event type to the parent component
    console.log('Selected Event Type:', selectedOption.value);
  };

  const handlePriceChange = (selectedOption) => {
    console.log('Selected Price:', selectedOption.value);
    // Handle price selection logic here, such as passing it to the parent component if needed
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${isOpen ? 'block' : 'hidden'} md:block sticky top-0`}>
      <h2 className="text-[#121926] font-bold mb-4">Filters</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event type</label>
          <div className="relative">
            <Select
              options={eventTypeOptions}
              onChange={handleEventTypeChange}
              className="w-full"
              placeholder="Select event type"
            />
          </div>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <div className="relative">
            <Select
              options={priceOptions}
              onChange={handlePriceChange}
              className="w-full"
              placeholder="Select price type"
            />
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
        </div> */}
      </div>
    </div>
  );
};

export default Filters;


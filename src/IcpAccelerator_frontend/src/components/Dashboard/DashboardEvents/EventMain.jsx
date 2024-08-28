
import React, { useState } from 'react';
import EventCard from './EventCard';
import Filters from './EventFilter';

const EventMain = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('All'); // State for the selected event type

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
      <h1 className="text-3xl font-bold bg-opacity-95 -top-[0.6rem] sticky bg-white z-20 py-6">Discover events</h1>
      <div className="flex">
        <div className="w-full md:w-[70%] pr-6">
          {/* Pass the selected event type to EventCard */}
          <EventCard eventType={selectedEventType} />
        </div>
        <div className="w-full md:w-[30%]">
          {/* Pass the state and its setter to Filters */}
          <Filters isOpen={isFiltersOpen} setSelectedEventType={setSelectedEventType} />
        </div>
      </div>
      <div className="fixed bottom-4 right-4 md:hidden">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          {isFiltersOpen ? 'Close' : '•••'}
        </button>
      </div>
    </div>
  );
};

export default EventMain;


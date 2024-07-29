// Dashboard.js
import React, { useState } from 'react';
import EventCard from './EventCard';
import Filters from './EventFilter';
import eventbg from "../../../../assets/images/bg.png"

const events = [
  {
    date: '20 Jun – 22 Jun',
    time: 'Start at 15:00 GMT+4',
    title: 'Masterclass: How to build a robust community',
    description: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
    type: 'Workshop',
    label: 'Workshop',
    labelColor: 'bg-blue-600',
    mode: 'Online',
    price: '$100',
    attendees: ['https://via.placeholder.com/24', 'https://via.placeholder.com/24', 'https://via.placeholder.com/24', 'https://via.placeholder.com/24'],
    image: eventbg,
  },
  {
    date: '25 Jun',
    time: 'Start at 15:00 GMT+4',
    title: 'Aenean ultricies amet massa eu. Hendrerit a.',
    description: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
    type: 'Masterclass',
    label: 'Masterclass',
    labelColor: 'bg-gray-800',
    mode: 'Online',
    price: 'Free',
    attendees: ['https://via.placeholder.com/24', 'https://via.placeholder.com/24', 'https://via.placeholder.com/24', 'https://via.placeholder.com/24'],
    image: eventbg,
  },
];

const EventMain = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
      <h1 className="text-3xl font-bold mb-6">Discover events</h1>
      <div className="flex">
        <div className="w-full md:w-[70%] pr-6">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
        <div className="w-full md:w-[30%]">
          <Filters isOpen={isFiltersOpen} />
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

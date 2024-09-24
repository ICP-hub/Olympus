import React, { useState } from 'react';
import EventCard from './EventCard';
import Filters from './EventFilter';
import { FaSliders } from 'react-icons/fa6';
import { motion } from 'framer-motion';
const EventMain = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('All');

  console.log('selectedEventType Main',selectedEventType)




  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 bg-white">
      <div className='flex justify-between sticky -top-[1.1rem] md:top-0 bg-opacity-95 -mt-[1.1rem] md:mt-0   bg-white z-20'>
      <h1 className=" text-xl ss1:text-3xl font-bold bg-opacity-95  py-6">
       <span></span> Discover Cohorts
      </h1>

      {/* Filter button  on the left side for mobile */}
      <div className="mt-7 md:hidden  lg:block lgx:hidden">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-lg flex items-center "
        >
          Filters
          <FaSliders className="ml-2" />
        </button>
      </div>
      </div>
      <div className="flex flex-col md:flex-row ">
      
        <div className="w-full md:w-[70%] lg:w-full lgx:w-[70%] pr-6">
          
              <EventCard  selectedEventType={selectedEventType} />
        </div>

        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block lg:hidden lgx:block md:w-[30%]">
          <Filters setSelectedEventType={setSelectedEventType} selectedEventType={selectedEventType} />
        </div>

{isFiltersOpen && (
  <motion.div
    className="block md:hidden lg:block lgx:hidden fixed inset-0 z-30 p-6 overflow-hidden"
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
  >
    {/* Background Overlay */}
    <div
      className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300"
      onClick={() => setIsFiltersOpen(false)}
    ></div>

    {/* Filter modal sliding from the bottom */}
    <motion.div
      className="fixed bottom-0 left-0 lg:left-auto lg:w-[75%] dlg:w-[77%] lgx:w-full lgx:left-0 right-0 bg-white z-40 p-6 rounded-t-3xl shadow-lg min-h-40"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          className="text-4xl text-gray-700"
          onClick={() => setIsFiltersOpen(false)}
        >
          &times;
        </button>
      </div>
      {/* Filters for Mobile */}
      <Filters setSelectedEventType={setSelectedEventType} />
    </motion.div>
  </motion.div>
)}
      </div>
    </div>
  );
};

export default EventMain;
// // Dashboard.js
// import React, { useState } from "react";
// import EventCard from "./EventCard";
// import Filters from "./EventFilter";
// import eventbg from "../../../../assets/images/bg.png";
// import { Link } from "react-router-dom";

// const EventMain = () => {
//   const [isFiltersOpen, setIsFiltersOpen] = useState(false);
// const [selectedEventType,setSelectedEventType]= useState([]);
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
//       <h1 className="text-3xl font-bold  bg-opacity-95 -top-[0.6rem] sticky bg-white z-20 py-6">
//         Discover events
//       </h1>
//       <div className="flex">
//         <div className="w-full md:w-[70%] pr-6">
//           {/* {events.map((event, index) => ( */}
//           <>
//             {/* <Link to='/dashboard/single-event'> */}
//             <EventCard selectedEventType={selectedEventType}/>
//             {/* </Link> */}
//           </>
//           {/* ))} */}
//         </div>
//         <div className="w-full md:w-[30%]">
//           <Filters isOpen={isFiltersOpen} setSelectedEventType={setSelectedEventType}/>
//         </div>
//       </div>
//       <div className="fixed bottom-4 right-4 md:hidden">
//         <button
//           onClick={() => setIsFiltersOpen(!isFiltersOpen)}
//           className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
//         >
//           {isFiltersOpen ? "Close" : "•••"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EventMain;s
import React, { useState } from 'react';
import EventCard from './EventCard';
import Filters from './EventFilter';
import { FaSliders } from 'react-icons/fa6';
import { motion } from 'framer-motion';
const EventMain = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('All');

  // Simulated event data for testing
  const events = [
    { id: 1, title: 'Event 1', type: 'Ongoing' },
    { id: 2, title: 'Event 2', type: 'Upcoming' },
    { id: 3, title: 'Event 3', type: 'Past' },
  ];

  // Filter the events based on selectedEventType
 
  const filteredEvents =
    selectedEventType === 'All'
      ? [events[0]] 
      : events.filter((event) => event.type === selectedEventType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
      <h1 className="text-3xl font-bold bg-opacity-95 -top-[0.6rem] sticky bg-white z-20 py-6">
        Discover events
      </h1>

      {/* Filter button  on the left side for mobile */}
      <div className="mb-4 md:hidden  lg:block lgx:hidden">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-lg flex items-center"
        >
          Filters
          <FaSliders className="ml-2" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row ">
      
        <div className="w-full md:w-[70%] lg:w-full lgx:w-[70%] pr-6">
          
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p>No events available for the selected filter.</p>
          )}
        </div>

        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block lg:hidden lgx:block md:w-[30%]">
          <Filters setSelectedEventType={setSelectedEventType} />
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
      className="fixed bottom-0 left-0 lg:left-auto lg:w-[75%] dlg:w-[77%] lgx:w-full lgx:left-0 right-0 bg-white z-40 p-6 rounded-t-3xl shadow-lg"
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

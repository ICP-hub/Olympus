// EventCard.js
import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 relative">
            <div className='max-w-[160px] absolute top-1 left-1 bg-white p-2 rounded-[8px]'> 
                <p className='text-base font-bold'>20 Jun – 22 Jun</p>
                <p className='text-sm font-normal'>Start at 15:00 GMT+4</p>
            </div>
          <img src={event.image} alt={event.title} className="w-[240px] h-[172px] rounded-lg mr-4" />
          <div className=''>
          <div>
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.description}</p>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">{event.date}</span>
              <span className="text-sm text-gray-500 ml-4">{event.time}</span>
              <span className="text-sm text-gray-500 ml-4">{event.type}</span>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium text-white rounded ${event.labelColor}`}>
          {event.label}
        </span>
          <div className="flex gap-3 items-center mt-4">
        <span className="text-sm text-gray-500">{event.mode}</span>
        <span className="text-sm text-gray-500">{event.price}</span>
        <div className="flex -space-x-1">
          {event.attendees.map((attendee, index) => (
            <img key={index} src={attendee} alt="attendee" className="w-6 h-6 rounded-full border-2 border-white" />
          ))}
        </div>
      </div>
      </div>
        </div>
       
      </div>
      
    </div>
  );
};

export default EventCard;

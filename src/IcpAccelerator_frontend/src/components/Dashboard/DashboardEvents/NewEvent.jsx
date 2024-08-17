import React, { useState } from 'react';
import EventCard from './EventCard';
import Filters from './EventFilter';
import eventbg from "../../../../assets/images/bg.png"
import { Link } from "react-router-dom"
import EventRegMain from '../../Modals/EventRegister/EventRegMain';

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
];

const NewEvent = () => {

    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-col items-end mb-8 max-w-7xl pt-4">
                <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={handleModalOpen}
                >
                    + Add new Event
                </button>
            </div>
            <div className="max-w-7xl mx-auto  bg-white">
                <div className="w-full ">
                    {events.map((event, index) => (
                        <Link to='/dashboard/single-event' key={index}>
                            <EventCard event={event} />
                        </Link>
                    ))}
                </div>
            </div>


            {modalOpen && (
                <EventRegMain modalOpen={modalOpen} setModalOpen={setModalOpen} />
            )}
        </>
    );
};

export default NewEvent;
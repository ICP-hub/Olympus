import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import Filters from './EventFilter';
import eventbg from "../../../../assets/images/bg.png"
import { Link } from "react-router-dom"
import EventRegMain from '../../Modals/EventRegister/EventRegMain';
import { useSelector } from 'react-redux';
import { title } from 'process';

import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

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

const NewEvent = ({ event }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [cohortEvents, setCohortEvents] = useState([]);
    const actor = useSelector((currState) => currState.actors.actor);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    useEffect(() => {
        // Interact with the canister to fetch cohort data
        const fetchCohorts = async () => {
            console.log("FUNCTION K ANDR AAGYA")
            try {
                console.log("TRY K ANDR AAGYA")
                const data = await actor.get_cohorts_by_principal();

                console.log("DATA FROM API changed", data)
                // Map the cohort data to the structure needed for the EventCard component
                const formattedEvents = data.map(cohort => ({
                    title: cohort.cohort.title,
                    cohort_banner: cohort.cohort.cohort_banner,
                    cohort_launch_date: cohort.cohort.cohort_launch_date,
                    cohort_end_date: cohort.cohort.cohort_end_date,
                    start_date: cohort.cohort.start_date,
                    no_of_seats: cohort.cohort.no_of_seats,
                    country: cohort.cohort.country,
                }));

                setCohortEvents(formattedEvents);
                console.log("formattedevents", formattedEvents)
            }

            catch (error) {
                console.log("Catch K ANDR AAGYA")
                console.error('Error fetching cohort data:', error);
            }
        };

        fetchCohorts();
    }, [actor]);
    console.log('SET KIYA HUA DATA', cohortEvents[0]);

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
            <div className="max-w-7xl mx-auto bg-white">
                {cohortEvents.map((event, index) => {
                    console.log('map k andr data', event)
                    return <div key={index} className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 relative">
                                <div className="max-w-[160px] absolute top-1 left-1 bg-white p-2 rounded-[8px]">
                                    <p className="text-base font-bold">{event.no_of_seats}</p>
                                    <p className="text-sm font-normal">{event.start_date}</p>
                                </div>
                                <img
                                    src={eventbg}
                                    alt="Event Background"
                                    className="w-[240px] h-[172px] rounded-lg mr-4 object-cover"
                                />
                                <div>
                                    <p className="bg-white font-medium border-2 border-[#CDD5DF] text-[#364152] w-[86px] px-2 py-1 rounded-full text-sm">
                                        Workshop
                                    </p>
                                    <h3 className="text-lg font-semibold">{event.title}</h3>
                                    <h3 className="text-lg font-semibold">{event.no_of_seats}</h3>
                                    <p className="text-sm text-gray-500">{event.description}</p>
                                    <div className="flex gap-3 items-center mt-4">
                                        <span className="text-sm text-[#121926]">
                                            <PlaceOutlinedIcon
                                                className="text-[#364152]"
                                                fontSize="small"
                                            />
                                            {event.mode}
                                        </span>
                                        <span className="text-sm text-gray-500">{event.country}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>

            {modalOpen && (
                <EventRegMain modalOpen={modalOpen} setModalOpen={setModalOpen} />
            )}
        </>
    );
};

export default NewEvent;

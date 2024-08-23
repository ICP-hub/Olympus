;import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import Filters from './EventFilter';
import eventbg from "../../../../assets/images/bg.png"
import { Link } from "react-router-dom"
import EventRegMain from '../../Modals/EventRegister/EventRegMain';
import { useSelector } from 'react-redux';
import { title } from 'process';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';



import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EventSection from '../Project/EventSection';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';


const descriptionStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 2, // Limits the text to 2 lines
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Add ellipsis (...) if the text overflows
};


const NewEvent = ({ event }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [cohortEvents, setCohortEvents] = useState([]);
    const actor = useSelector((currState) => currState.actors.actor);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    useEffect(() => {
        const fetchCohorts = async () => {
            try {
                const data = await actor.get_cohorts_by_principal();

                if (data && Array.isArray(data) && data.length > 0) {
                    const cohortId = data[0].cohort_id;
                    console.log("Cohort ID:", cohortId);
                } else {
                    console.log("No data found or the structure is not as expected.");
                }
                const formattedEvents = data.map(cohort => {
                    if (!cohort || !cohort.cohort || !cohort.cohort.cohort_banner) {
                        return null;
                    }

                    return {
                        title: cohort.cohort.title,
                        cohort_banner: cohort.cohort.cohort_banner[0]
                            ? uint8ArrayToBase64(cohort.cohort.cohort_banner[0])
                            : [],
                        cohort_launch_date: cohort.cohort.cohort_launch_date,
                        cohort_end_date: cohort.cohort.cohort_end_date,
                        start_date: cohort.cohort.start_date,
                        no_of_seats: cohort.cohort.no_of_seats,
                        tags:cohort.cohort.tags,
                        country: cohort.cohort.country,
                        description: cohort.cohort.description,
                        funding_amount: cohort.cohort.funding_amount,
                        cohort_id: cohort.cohort_id, // Include cohort_id here
                    };
                }).filter(event => event !== null);

                setCohortEvents(formattedEvents);
                console.log("formattedEvents", formattedEvents)
            } catch (error) {
                console.error('Error fetching cohort data:', error);
            }
        };

        fetchCohorts();
    }, [actor]);

    const navigate = useNavigate();

    const handleClick = (cohort_id) => {
        navigate('/dashboard/single-event', { state: { cohort_id } });
    };

    return (
        <>
            {cohortEvents.length === 0 ? (
                <EventSection />
            ) : (
                <>
                    <div className="flex flex-col items-end mb-8 max-w-7xl pt-4">
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            onClick={handleModalOpen}
                        >
                            + Add new Cohort
                        </button>
                    </div>
                    <div className="max-w-7xl mx-auto bg-white">
                        {cohortEvents.map((event, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow p-4 mb-6"
                                onClick={() => handleClick(event.cohort_id)} // Pass cohort_id from the current event
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 w-full relative">
                                        <div className="max-w-[160px] absolute top-1 left-1 bg-white p-2 rounded-[8px]">
                                            <p className="text-sm font-normal">{event.start_date}</p>
                                        </div>
                                        {/* <div className="w-[240px] h-[172px]"> */}
                                        <img
                                            src={event.cohort_banner}
                                            alt="Event Background"
                                            className="w-[240px] h-[172px] rounded-lg mr-4 object-cover object-center"
                                        />
                                       {/* </div>  */}
                                        <div className='w-3/4'>
                                            <div>
                                                <p className="bg-white font-medium border-2 border-[#CDD5DF] text-[#364152] w-[86px] px-2 py-1 rounded-full text-sm">
                                                    Workshop
                                                </p>
                                                <h3 className="text-lg font-bold mt-1">{event.title}</h3>
                                                {/* <h3 className="text-lg font-semibold">{event.no_of_seats}</h3> */}
                                                <p 
  className="text-sm text-gray-500 overflow-hidden text-ellipsis line-clamp-3 mt-2"
  style={{ maxHeight: '3em', lineHeight: '1em' }}
>
  {parse(event.description)}
</p>
                                                <div className="flex gap-3 items-center mt-4">
                                                    <span className="text-sm text-[#121926]">
                                                        <PlaceOutlinedIcon
                                                            className="text-[#364152]"
                                                            fontSize="small"
                                                        />
                                                        {event.country}
                                                    </span>
                                                    <span className="text-sm text-gray-500">${event.funding_amount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {modalOpen && (
                <EventRegMain modalOpen={modalOpen} setModalOpen={setModalOpen} />
            )}
        </>
    );
};

export default NewEvent;

import React, { useEffect, useState } from 'react';
import EventSection from '../Project/EventSection';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EventRegMain from '../../Modals/EventRegister/EventRegMain';
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import parse from 'html-react-parser';
import { Principal } from "@dfinity/principal";
import Edit from "../../../../assets/Logo/edit.png";

const NewEvent = ({ event }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false); // State to track if we are in edit mode
    const [cohortEvents, setCohortEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // State to track the selected event
    const actor = useSelector((currState) => currState.actors.actor);
    const principal = useSelector((currState) => currState.internet.principal);
    const navigate = useNavigate();

    const handleModalOpen = () => {
        setModalOpen(true);
        setEditMode(false); // When creating a new cohort, edit mode is false
        setSelectedEvent(null);
    };

    useEffect(() => {
        const fetchCohorts = async () => {
            try {
                const covertedPrincipal = Principal.fromText(principal);
                const data = await actor.get_cohorts_by_principal(covertedPrincipal);
                if (data && Array.isArray(data) && data.length > 0) {
                    const formattedEvents = data.map(cohort => {
                        if (!cohort || !cohort.cohort || !cohort.cohort.cohort_banner) {
                            return null;
                        }

                        return {
                            title: cohort.cohort.title,
                            cohort_banner: cohort.cohort.cohort_banner[0],
                            cohort_launch_date: cohort.cohort.cohort_launch_date,
                            cohort_end_date: cohort.cohort.cohort_end_date,
                            start_date: cohort.cohort.start_date,
                            no_of_seats: cohort.cohort.no_of_seats,
                            tags: cohort.cohort.tags,
                            country: cohort.cohort.country,
                            description: cohort.cohort.description,
                            funding_amount: cohort.cohort.funding_amount,
                            contact_links: cohort.cohort.contact_links,
                            deadline: cohort.cohort.deadline,
                            eligibility: cohort.cohort.criteria.eligibility,
                            funding_type: cohort.cohort.funding_type,
                            host_name: cohort.cohort.host_name,
                            level_on_rubric: cohort.cohort.criteria.level_on_rubric,
                            cohort_id: cohort.cohort_id,
                        };
                    }).filter(event => event !== null);

                    setCohortEvents(formattedEvents);
                    console.log("formattedEvents", formattedEvents);
                } else {
                    console.log("No data found or the structure is not as expected.");
                }
            } catch (error) {
                console.error('Error fetching cohort data:', error);
            }
        };

        fetchCohorts();
    }, [actor, principal]);

    const handleClick = (cohort_id) => {
        navigate(`/dashboard/single-event/${ cohort_id }`);
    };

    const handleEditClick = (event) => {
        setModalOpen(true);
        setEditMode(true); // Set edit mode to true when editing a cohort
        setSelectedEvent(event);
    };
    return (
        <>
          {cohortEvents.length === 0 ? (
            <EventSection />
          ) : (
            <>
              {/* Add new cohort button */}
              <div className="hidden md:flex flex-col r md:items-end mb-8 max-w-7xl pt-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  onClick={handleModalOpen}
                >
                  + Add new Cohort
                </button>
              </div>
      
              {/* Cohort events container */}
              <div className="max-w-7xl mx-auto bg-white">
                {cohortEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-4 mb-6 relative group" 
                    onClick={() => handleClick(event.cohort_id)}
                  >
                    {/* Edit button */}
                    <div className="absolute top-4 right-4 flex justify-end z-10"

                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleEditClick(event);
                      }}>
                      <img
                        src={Edit}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEditClick(event);
                        }}
                        className="h-6 w-6 cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-50"
                        alt="edit"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
      
                    {/* Event content */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
                      <div className="flex flex-col md:flex-row items-center gap-4 w-full relative">
                        {/* Date */}
                        <div className="max-w-[160px] absolute top-1 left-1 bg-white p-2 rounded-[8px]">
                          <p className="text-sm font-normal">{event.start_date}</p>
                          <div>
                            <p className="text-sm text-gray-600">Start at 15:00 GMT+4</p>
                          </div>
                        </div>
      
                        {/* Event image */}
                        <div className="w-full md:w-[240px] h-[172px]">
                          <img
                            src={event.cohort_banner ?uint8ArrayToBase64(event.cohort_banner):''}
                            alt="Event Background"
                            className="w-full md:w-[240px] h-[172px] rounded-lg object-cover object-center"
                            loading="lazy"
                            draggable={false}
                          />
                        </div>
      
                        {/* Event content */}
                        <div className="w-full md:w-2/3 mt-4 md:mt-0">
                          <p className="bg-white font-medium border-2 border-[#CDD5DF] text-[#364152] w-[86px] px-2 py-1 rounded-full text-sm">
                            Workshop
                          </p>
                          <h3 className="text-lg font-bold mt-1">{event.title}</h3>
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
                ))}
              </div>
              <div className="flex md:hidden flex-col  mb-8  w-full ">
          <button
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={handleModalOpen}
          >
            + Add new Cohort
          </button>
        </div>
            </>
          )}
      
          {/* Modal */}
          {modalOpen && (
            <EventRegMain 
              modalOpen={modalOpen} 
              setModalOpen={setModalOpen} 
              editMode={editMode} 
              singleEventData={selectedEvent} 
              cohortId={selectedEvent?.cohort_id} 
            />
          )}
        </>
      );
      
};

export default NewEvent;


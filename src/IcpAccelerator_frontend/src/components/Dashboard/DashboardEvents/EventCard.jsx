import React, { useEffect, useState } from "react";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import images from "../../../../assets/images/bg.png";
import { formatFullDateFromSimpleDate } from "../../Utils/formatter/formatDateFromBigInt";
import NoData from "../../NoDataCard/NoData";

const EventCard = ({ selectedEventType }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(false);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countData, setCountData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [cohortIds, setCohortIds] = useState([]);

  const navigate = useNavigate();

  const handleClick = (cohort_id) => {
    navigate("/dashboard/single-event", { state: { cohort_id } });
  };

  useEffect(() => {
    let isMounted = true;
  
    const getAllLiveEvents = async (caller, page) => {
      setIsLoading(true);
      try {
        const result = await caller.get_all_cohorts({
          page_size: itemsPerPage,
          page,
        });
  
        console.log("API Response:", result);
  
        if (isMounted) {
          let filteredEvents = [];
  
          // Adjusted logic to map the correct event data
          switch (selectedEventType) {
            case 'Ongoing':
              filteredEvents = result.present_cohorts ?? [];
              break;
            case 'Upcoming':
              filteredEvents = result.upcoming_cohorts ?? [];
              break;
            case 'Past':
              filteredEvents = result.past_cohorts ?? [];
              break;
            case 'All':
            default:
              filteredEvents = result.data ?? [];
              break;
          }
  
          setAllLiveEventsData(filteredEvents);
          setCountData(filteredEvents.length);
          setNoData(filteredEvents.length === 0);
        }
      } catch (error) {
        if (isMounted) {
          setAllLiveEventsData([]);
          setCountData(0);
          setNoData(true);
          console.error("Error in get_all_cohorts:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
  
    if (actor) {
      getAllLiveEvents(actor, currentPage);
    } else {
      getAllLiveEvents(IcpAccelerator_backend, currentPage);
    }
  
    return () => {
      isMounted = false;
    };
  }, [actor, currentPage, itemsPerPage, selectedEventType]);
  
  

  useEffect(() => {
    if (allLiveEventsData?.length > 0) {
      const cohortIdsArray = allLiveEventsData.map((eventData) => eventData.cohort_id);
      setCohortIds(cohortIdsArray);
    }
  }, [allLiveEventsData]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : allLiveEventsData.length > 0 ? (
        <div>
          {allLiveEventsData.map((data, index) => {
            const image = data?.cohort?.cohort_banner[0]
              ? uint8ArrayToBase64(data?.cohort?.cohort_banner[0])
              : images;
            const name = data?.cohort?.title ?? "No Title...";
            const launch_date = data?.cohort?.cohort_launch_date
              ? new Date(data.cohort.cohort_launch_date).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )
              : "";
            const end_date = data?.cohort?.cohort_end_date
              ? new Date(data.cohort.cohort_end_date).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )
              : "";
            const deadline = data?.cohort?.deadline
              ? new Date(data?.cohort?.deadline).toLocaleDateString()
              : "";
            const desc = data?.cohort?.description ?? "";
            const tags = data?.cohort?.tags ?? [];
            const seats = data?.cohort?.no_of_seats ?? 0;
            const start_date = data?.cohort?.start_date ?? "";
            const funding = data?.cohort?.funding_amount ?? "";
            const country = data?.cohort?.country ?? "";

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 mb-6"
                onClick={() => handleClick(data.cohort_id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 relative w-full">
                    <div className="max-w-[160px] absolute top-1 left-1 bg-white p-2 rounded-[8px]">
                      <p className="text-base font-bold">
                        {launch_date} – {end_date}
                      </p>
                      <p className="text-sm font-normal">
                        Start at: {start_date}
                      </p>
                    </div>
                    <div className="w-[240px] h-[172px]">
                      <img
                        src={image}
                        alt={name}
                        className="w-[240px] h-[172px] rounded-lg mr-4 object-cover object-center"
                      />
                    </div>
                    <div className="w-2/3">
                      <div>
                        <div className="bg-[#c8eaef] border-[#45b0c1] border text-[#090907] text-xs px-2 py-1 rounded-full w-[70px]">
                          COHORT
                        </div>
                        <h3 className="text-lg font-bold mt-2">{name}</h3>
                        <p className="text-sm text-gray-500 mb-4 overflow-hidden text-ellipsis max-h-12 line-clamp-2 mt-2">
                          {parse(desc)}
                        </p>
                      </div>
                      <div className="flex gap-3 items-center -bottom-4 relative">
                        <span className="text-sm text-[#121926]">
                          <PlaceOutlinedIcon
                            className="text-[#364152]"
                            fontSize="small"
                          />
                          {country}
                        </span>
                        <span className="text-sm text-[#121926]">
                          ${funding}
                        </span>
                        <div className="flex -space-x-1">
                          {data?.cohort?.attendees?.map((attendee, index) => (
                            <img
                              key={index}
                              src={attendee}
                              alt="attendee"
                              className="w-6 h-6 rounded-full border-2 border-white"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <NoData message={"No Cohort Available"} />
        </div>
      )}
    </div>
  );
};

export default EventCard;

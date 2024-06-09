import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "./NoDataCard";
import SecondEventCard from "../Event/SecondEventCard";
import NoData from "../../../../assets/images/file_not_found.png";
import { useNavigate } from "react-router-dom"

const UpcomingEventsCard = ({ wrap, register }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
  const navigate = useNavigate();
  const getAllLiveEvents = async (caller) => {
    await caller
      .get_all_cohorts()
      .then((result) => {
        console.log("cohort result", result);
        if (!result || result.length === 0) {
          setNoData(true);
          setAllLiveEventsData([]);
        } else {
          setAllLiveEventsData(result);
          setNoData(false);
        }
      })
      .catch((error) => {
        setNoData(true);
        setAllLiveEventsData([]);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllLiveEvents(actor);
    } else {
      getAllLiveEvents(IcpAccelerator_backend);
    }
  }, [actor]);

  const today = new Date();
  const filteredEvents = allLiveEventsData.filter((val) => {
    const launchDate = new Date(val?.cohort?.cohort_launch_date);
    return launchDate > today;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
        <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
          Upcoming Accelerator
        </h1>
        {filteredEvents && filteredEvents.length > 0 && (
          <button
            onClick={() => navigate(`/all-live-events`)}
            className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
          >
            View More
          </button>
        )}{" "}
      </div>

      <div
        className={`flex mb-4 items-start ${
          wrap === true ? "" : "min-h-screen"
        }`}
      >
        {noData || filteredEvents.length === 0 ? (
          <NoDataCard image={NoData} desc={"There is no ongoing accelerator"} />
        ) : (
          <div
            className={`${
              wrap === true
                ? "flex flex-row overflow-x-auto w-full"
                : "flex flex-row flex-wrap w-full px-8"
            }`}
          >
            {filteredEvents.map((val, index) => (
              <div
                key={index}
                className="px-2 w-full sm:min-w-[50%] lg:min-w-[33.33%] sm:max-w-[50%] lg:max-w-[33.33%]"
              >
                <SecondEventCard data={val} register={register} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UpcomingEventsCard;

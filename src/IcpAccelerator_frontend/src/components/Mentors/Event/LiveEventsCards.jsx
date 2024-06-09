import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "./NoDataCard";
import SecondEventCard from "./SecondEventCard";
import NoData from "../../../../assets/images/file_not_found.png";

const LiveEventsCards = ({ wrap, register }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);

  const getAllLiveEvents = async (caller) => {
    try {
      const result = await caller.get_all_cohorts();
      console.log("cohort result", result);

      if (result && Array.isArray(result)) {
        if (
          result.length > 0 ||
          (result.length === 0 && JSON.stringify(result) !== JSON.stringify([]))
        ) {
          setAllLiveEventsData(result);
          setNoData(false);
        } else {
          setNoData(true);
          setAllLiveEventsData([]);
        }
      } else {
        setNoData(true);
        setAllLiveEventsData([]);
      }
    } catch (error) {
      setNoData(true);
      setAllLiveEventsData([]);
    }
  };

  useEffect(() => {
    if (actor) {
      getAllLiveEvents(actor);
    } else {
      getAllLiveEvents(IcpAccelerator_backend);
    }
  }, [actor]);
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // Get only the date part in 'YYYY-MM-DD' format

  const filteredEvents = allLiveEventsData.filter((val) => {
    const launchDateStr = new Date(val?.cohort?.cohort_launch_date)
      .toISOString()
      .split("T")[0];
    console.log("filteredEvents launchDateStr", launchDateStr);
    return launchDateStr <= todayStr;
  });
  console.log("filteredEvents", filteredEvents);
  console.log("filteredEvents today", todayStr);
  return (
    <>
      {filteredEvents && (
        <div
          className={`flex mb-4 items-start ${
            wrap === true ? "" : "min-h-screen"
          }`}
        >
          {noData ? (
            <NoDataCard
              image={NoData}
              desc={"There is no ongoing accelerator"}
            />
          ) : (
            <div
              className={`${
                wrap === true
                  ? "flex flex-row overflow-x-auto w-full"
                  : "flex flex-row flex-wrap w-full px-8"
              }`}
            >
              {filteredEvents &&
                filteredEvents.map((val, index) => {
                  return (
                    <div
                      key={index}
                      className="px-2 w-full sm:min-w-[50%] lg:min-w-[33.33%] sm:max-w-[50%] lg:max-w-[33.33%]"
                    >
                      <SecondEventCard data={val} register={register} />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LiveEventsCards;

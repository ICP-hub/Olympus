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
    await caller
      .get_all_cohorts()
      .then((result) => {
        console.log("cohort result", result);
        if (result && result.length >= 0) {
          setAllLiveEventsData(result);
          setNoData(false);
        } else {
          setNoData(true);
          setAllLiveEventsData([]);
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
    return launchDate >= today;
  });
  console.log("filteredEvents", filteredEvents);
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

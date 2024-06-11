import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "./NoDataCard";
import SecondEventCard from "./SecondEventCard";
import NoData from "../../../../assets/images/file_not_found.png";
import OngoingAcceleratorSkeleton from "../../Dashboard/Skeleton/OngoingAcceleratorskeleton";

const LiveEventsCards = ({ wrap, register }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numSkeletons, setNumSkeletons] = useState(1);

  const updateNumSkeletons = () => {
    if (window.innerWidth >= 1100) {
      setNumSkeletons(3);
    } else if (window.innerWidth >= 768) {
      setNumSkeletons(2);
    } else {
      setNumSkeletons(1);
    }
  };
  useEffect(() => {
    updateNumSkeletons();
    window.addEventListener("resize", updateNumSkeletons);
    return () => {
      window.removeEventListener("resize", updateNumSkeletons);
    };
  }, []);
  const getAllLiveEvents = async (caller) => {
    setIsLoading(true);
    try {
      const result = await caller.get_all_cohorts();
      console.log("cohort result", result);

      if (result && Array.isArray(result)) {
        if (
          result.length > 0 ||
          (result.length === 0 && JSON.stringify(result) !== JSON.stringify([]))
        ) {
          setAllLiveEventsData(result);
          setIsLoading(false);
          setNoData(false);
        } else {
          setNoData(true);
          setIsLoading(false);
          setAllLiveEventsData([]);
        }
      } else {
        setNoData(true);
        setIsLoading(false);
        setAllLiveEventsData([]);
      }
    } catch (error) {
      setNoData(true);
      setIsLoading(false);
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
          {isLoading ? (
            <div
              className={`${
                wrap === true
                  ? "flex flex-row overflow-x-auto w-full"
                  : "flex flex-row flex-wrap w-full px-8"
              }`}
            >
              {Array(numSkeletons)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="px-2 w-full md:min-w-[50%] lg1:min-w-[33.33%] md:max-w-[50%] lg1:max-w-[33.33%]"
                  >
                    {" "}
                    <OngoingAcceleratorSkeleton key={index} />
                  </div>
                ))}
            </div>
          ) : noData ? (
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

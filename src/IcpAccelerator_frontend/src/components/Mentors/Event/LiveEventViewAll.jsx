import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "./NoDataCard";
import SecondEventCard from "./SecondEventCard";
import NoData from "../../../../assets/images/file_not_found.png";
import OngoingAcceleratorSkeleton from "../../Dashboard/Skeleton/OngoingAcceleratorskeleton";

const LiveEventViewAll = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllLiveEvents = async (caller) => {
    setIsLoading(true);
    await caller
      .get_all_cohorts()
      .then((result) => {
        console.log("cohort result", result);
        if (result && result.length >= 0) {
          setAllLiveEventsData(result);
          setIsLoading(false);
          setNoData(false);
        } else {
          setNoData(true);
          setIsLoading(false);
          setAllLiveEventsData([]);
        }
      })
      .catch((error) => {
        setNoData(true);
        setIsLoading(false);
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
  // const today = new Date();
  // const filteredEvents = allLiveEventsData.filter((val) => {
  //   const launchDate = new Date(val?.cohort?.cohort_launch_date);
  //   return launchDate <= today;
  // });

  return (
    <div className="container mx-auto min-h-screen">
      <div className="px-[4%] pb-[4%] pt-[1%]">
        <div className="flex items-center justify-between sm:flex-col sxxs:flex-col md:flex-row">
          <div
            className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-3xl font-extrabold py-4 
       font-fontUse"
          >
            Cohorts
          </div>
        </div>
        {allLiveEventsData && (
          <div
            className="flex mb-4 items-start
             min-h-screen"
          >
            <>
              {isLoading ? (
                Array(1)
                  .fill(0)
                  .map((_, index) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-wrap w-full gap-6">
                      {" "}
                      <OngoingAcceleratorSkeleton key={index} />
                    </div>
                  ))
              ) : noData ? (
                <NoDataCard
                  image={NoData}
                  desc={"There is no ongoing accelerator"}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-wrap w-full gap-6">
                  {allLiveEventsData &&
                    allLiveEventsData.map((val, index) => {
                      return (
                        <div key={index} className="w-min-w-[33%] sm:w-full ">
                          <SecondEventCard data={val} register={false} />
                        </div>
                      );
                    })}
                </div>
              )}
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveEventViewAll;

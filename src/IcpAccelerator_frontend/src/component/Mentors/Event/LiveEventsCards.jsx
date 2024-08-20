import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "./NoDataCard";
import SecondEventCard from "./SecondEventCard";
import NoData from "../../../../assets/images/file_not_found.png";
import OngoingAcceleratorSkeleton from "../../Dashboard/Skeleton/OngoingAcceleratorskeleton";

const LiveEventsCards = ({ wrap, register, onNoDataChange }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countData, setCountData] = useState(0);
  const [filteredLiveEventsData, setFilteredLiveEventsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
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

  useEffect(() => {
    let isMounted = true;

    const getAllLiveEvents = async (caller, page) => {
      setIsLoading(true);
      await caller
        .get_all_cohorts({
          page_size: itemsPerPage,
          page,
        })
        .then((result) => {
          // console.log(" in get_all_cohort", result);
          if (isMounted) {
            if (!result || result.length == 0) {
              setNoData(true);
              setIsLoading(false);
              setAllLiveEventsData([]);
              setCountData("");
              onNoDataChange(true);
            } else {
              setNoData(false);
              setIsLoading(false);
              setAllLiveEventsData(result.data);
              setCountData(result.total_count);
              onNoDataChange(false);
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            setNoData(true);
            setIsLoading(false);
            setCountData("");
            setAllLiveEventsData([]);
            onNoDataChange(true);
            console.log("Error in get_all_cohort", error);
          }
        });
    };

    if (actor) {
      getAllLiveEvents(actor, currentPage);
    } else {
      getAllLiveEvents(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor, currentPage]);

  useEffect(() => {
    // console.log("useEffect triggered for filtering live events");
    // console.log("allLiveEventsData", allLiveEventsData);

    const today = new Date();
    // console.log("today", today);
    today.setHours(0, 0, 0, 0);

    const filteredEvents = allLiveEventsData.filter((val) => {
      const launchDate = new Date(val?.cohort?.cohort_launch_date);
      // console.log("launchDate", launchDate);
      // console.log("launchDate < today:", launchDate < today);

      return launchDate < today;
    });

    setFilteredLiveEventsData(filteredEvents);

    if (filteredEvents.length === 0) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  }, [allLiveEventsData]);
  // console.log("allLiveEventsData", allLiveEventsData);
  // console.log("filteredLiveEventsData", filteredLiveEventsData);
  return (
    <>
      {isLoading ? (
        <div
          className={`${wrap === true
              ? "flex flex-row w-full gap-4"
              : "flex flex-row flex-wrap w-full px-8"
            }`}
        >
          {Array.from({ length: numSkeletons }).map((_, index) => (
            <div
              key={index}
              className=" w-full md:min-w-[50%] lg1:min-w-[33.33%] md:max-w-[50%] lg1:max-w-[33.33%]"
            >
              <OngoingAcceleratorSkeleton key={index} />
            </div>
          ))}
        </div>
      ) : noData ? (
        <NoDataCard image={NoData} desc={"There is no ongoing accelerator"} />
      ) : (
        <div
          className={`${wrap === true
              ? "flex flex-row w-full gap-4"
              : "flex flex-row flex-wrap w-full px-8"
            }`}
        >
          {filteredLiveEventsData &&
            filteredLiveEventsData?.slice(0, numSkeletons).map((val, index) => {
              console.log("val", val);
              return (
                <div
                  key={index}
                  className=" w-full md:min-w-[50%] lg1:min-w-[33.33%] md:max-w-[50%] lg1:max-w-[33.33%]"
                >
                  <SecondEventCard data={val} register={register} />
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default LiveEventsCards;

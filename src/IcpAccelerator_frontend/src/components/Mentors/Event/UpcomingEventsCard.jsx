import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "./NoDataCard";
import SecondEventCard from "../Event/SecondEventCard";
import NoData from "../../../../assets/images/file_not_found.png";
import { useNavigate } from "react-router-dom";
import OngoingAcceleratorSkeleton from "../../Dashboard/Skeleton/OngoingAcceleratorskeleton";

const UpcomingEventsCard = ({ wrap, register }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [countData, setCountData] = useState(0);
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
          console.log(" in get_all_cohort", result);
          if (isMounted) {
            if (!result || result.length == 0) {
              setNoData(true);
              setIsLoading(false);
              setAllLiveEventsData([]);
              setCountData("");
            } else {
              setNoData(false);
              setIsLoading(false);
              setAllLiveEventsData(result.data);
              setCountData(result.total_count);
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            setNoData(true);
            setIsLoading(false);
            setCountData("");
            setAllLiveEventsData([]);
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

  const filteredEvents = allLiveEventsData.filter((val) => {
    const launchDate = new Date(val?.cohort?.cohort_launch_date);
    const applicationDeadline = new Date(val?.cohort?.deadline);
    return applicationDeadline <= launchDate;
  });
  

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
        <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
          Upcoming Accelerator
        </h1>
        {filteredEvents && filteredEvents.length > 0 && (
          <button
            onClick={() => navigate(`/all-live-upcoming-cohort`)}
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
        ) : noData || filteredEvents.length === 0 ? (
          <NoDataCard image={NoData} desc={"There is no Upcoming accelerator"} />
        ) : (
          <div
            className={`${
              wrap === true
                ? "flex flex-row overflow-x-auto w-full"
                : "flex flex-row flex-wrap w-full px-8"
            }`}
          >
            {filteredEvents &&
              filteredEvents?.slice(0, numSkeletons).map((val, index) => (
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

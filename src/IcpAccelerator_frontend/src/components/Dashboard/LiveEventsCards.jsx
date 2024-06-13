import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "../Mentors/Event/NoDataCard";
import NoData from "../../../assets/images/file_not_found.png";
import SecondEventCard from "../Mentors/Event/SecondEventCard";
import OngoingAcceleratorSkeleton from "./Skeleton/OngoingAcceleratorskeleton";

const LiveEventsCards = ({ wrap, register }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [countData, setCountData] = useState(0);
  const [noData, setNoData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 3;
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
  const [numSkeletons, setNumSkeletons] = useState(itemsPerPage);

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

  return (
    <div
      className={`flex mb-4 items-start ${wrap === true ? "" : "min-h-screen"}`}
    >
      <>
        {isLoading ? (
          <div
            className={`${
              wrap === true
                ? "flex flex-row w-full gap-4"
                : "flex flex-row flex-wrap w-full px-8"
            }`}
          >
            {Array(numSkeletons)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className=" w-full md:min-w-[50%] lg1:min-w-[33.33%] md:max-w-[50%] lg1:max-w-[33.33%]"
                >
                  {" "}
                  <OngoingAcceleratorSkeleton key={index} />
                </div>
              ))}
          </div>
        ) : noData ? (
          <NoDataCard image={NoData} desc={"There is no ongoing accelerator"} />
        ) : (
          <div
            className={`${
              wrap === true
                ? "flex flex-row w-full gap-4"
                : "flex flex-row flex-wrap w-full px-8"
            }`}
          >
            {allLiveEventsData &&
              allLiveEventsData?.slice(0, numSkeletons).map((val, index) => {
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
    </div>
  );
};

export default LiveEventsCards;

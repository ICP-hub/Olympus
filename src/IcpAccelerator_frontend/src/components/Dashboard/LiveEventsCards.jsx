import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "../Mentors/Event/NoDataCard";
import NoData from "../../../assets/images/file_not_found.png";
import SecondEventCard from "../Mentors/Event/SecondEventCard";
import OngoingAcceleratorSkeleton from "./Skeleton/OngoingAcceleratorskeleton";

const LiveEventsCards = ({ wrap, register }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
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
  // const getAllLiveEvents = async (caller) => {
  //     await caller
  //         .get_all_cohorts()
  //         .then((result) => {
  //             console.log('cohort result',result)
  //             if (!result || result.length == 0) {
  //                 setNoData(true);
  //                 setAllLiveEventsData([]);
  //             } else {
  //                 setAllLiveEventsData(result);
  //                 setNoData(false);
  //             }
  //         })
  //         .catch((error) => {
  //             setNoData(true);
  //             setAllLiveEventsData([]);
  //         });
  // };

  // useEffect(() => {
  //     if (actor) {
  //         getAllLiveEvents(actor);
  //     } else {
  //         getAllLiveEvents(IcpAccelerator_backend);
  //     }
  // }, [actor]);

  useEffect(() => {
    let isMounted = true;

    const getAllLiveEvents = async (caller) => {
      setIsLoading(true);
      await caller
        .get_all_cohorts()
        .then((result) => {
          if (isMounted) {
            if (!result || result.length == 0) {
              setNoData(true);
              setIsLoading(false);
              setAllLiveEventsData([]);
            } else {
              setAllLiveEventsData(result);
              setIsLoading(false);
              setNoData(false);
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            setNoData(true);
            setIsLoading(false);
            console.log("Error in get_all_cohort", error);
            setAllLiveEventsData([]);
          }
        });
    };

    if (actor) {
      getAllLiveEvents(actor);
    } else {
      getAllLiveEvents(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);
  return (
    <div
      className={`flex mb-4 items-start ${wrap === true ? "" : "min-h-screen"}`}
    >
      <>
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
          <NoDataCard image={NoData} desc={"There is no ongoing accelerator"} />
        ) : (
          <div
            className={`${
              wrap === true
                ? "flex flex-row overflow-x-auto w-full"
                : "flex flex-row flex-wrap w-full px-8"
            }`}
          >
            {allLiveEventsData &&
              allLiveEventsData.map((val, index) => {
                return (
                  <div
                    key={index}
                    className="px-2 w-full md:min-w-[50%] lg1:min-w-[33.33%] md:max-w-[50%] lg1:max-w-[33.33%]"
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

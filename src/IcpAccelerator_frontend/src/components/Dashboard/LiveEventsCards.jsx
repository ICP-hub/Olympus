import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "../Mentors/Event/NoDataCard";
import SecondEventCard from "./SecondEventCard";

const LiveEventsCards = () => {
    const actor = useSelector((currState) => currState.actors.actor);
    const [noData, setNoData] = useState(null);
    const [allLiveEventsData, setAllLiveEventsData] = useState([]);

    const getAllLiveEvents = async (caller) => {
        await caller
            .get_all_cohorts()
            .then((result) => {
                console.log("result-in-get_all_cohorts", result);
                if (!result || result.length == 0) {
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
                console.log("error-in-get_all_cohorts", error);
            });
    };

    useEffect(() => {
        if (actor) {
            getAllLiveEvents(actor);
        } else {
            getAllLiveEvents(IcpAccelerator_backend);
        }
    }, [actor]);

    return (
        <div className="flex mb-4 items-start">
            {noData ?
                (<NoDataCard />
                ) : (
                    <div className="flex flex-row overflow-x-auto w-full">
                        {allLiveEventsData &&
                            allLiveEventsData.map((val, index) => {
                                return (
                                    <div className="px-2 w-full lg:w-1/3 sm:w-1/2">
                                        <SecondEventCard data={val} key={index} />
                                    </div>
                                );
                            })}
                    </div>
                )}
        </div>
    );
};

export default LiveEventsCards;

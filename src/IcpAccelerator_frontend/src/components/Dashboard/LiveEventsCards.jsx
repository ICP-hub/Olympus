import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "../Mentors/Event/LiveEventsNoDataCard";
import SecondEventCard from "./SecondEventCard";

const LiveEventsCards = ({ wrap, register }) => {
    const actor = useSelector((currState) => currState.actors.actor);
    const [noData, setNoData] = useState(null);
    const [allLiveEventsData, setAllLiveEventsData] = useState([]);

    const getAllLiveEvents = async (caller) => {
        await caller
            .get_all_cohorts()
            .then((result) => {
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
                    <div className={`${wrap === true ? 'flex flex-row overflow-x-auto w-full' : 'flex flex-row flex-wrap w-full px-8'}`}>
                        {allLiveEventsData &&
                            allLiveEventsData.map((val, index) => {
                                return (
                                    <div key={index} className="px-2 w-full sm:min-w-[50%] lg:min-w-[33.33%] sm:max-w-[50%] lg:max-w-[33.33%]">
                                        <SecondEventCard data={val} register={register}/>
                                    </div>
                                );
                            })}
                    </div>
                )}
        </div>
    );
};

export default LiveEventsCards;

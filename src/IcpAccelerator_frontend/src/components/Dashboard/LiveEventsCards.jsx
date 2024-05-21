import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "../Mentors/Event/NoDataCard";
import NoData from "../../../assets/images/file_not_found.png";
import SecondEventCard from "../Mentors/Event/SecondEventCard";

const LiveEventsCards = ({ wrap, register }) => {
    const actor = useSelector((currState) => currState.actors.actor);
    const [noData, setNoData] = useState(null);
    const [allLiveEventsData, setAllLiveEventsData] = useState([]);

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
            await caller
                .get_all_cohorts()
                .then((result) => {
                    if (isMounted) { 
                    if (!result || result.length == 0) {
                        setNoData(true);
                        setAllLiveEventsData([]);
                    } else {
                        setAllLiveEventsData(result);
                        setNoData(false);
                    }
                }
                })
                .catch((error) => {
                    if (isMounted) { 
                    setNoData(true);
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
        <div className={`flex mb-4 items-start ${wrap === true?'':'min-h-screen'}`}>
            {noData ?
                (<NoDataCard image={NoData} desc={'There is no ongoing accelerator'}/>
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

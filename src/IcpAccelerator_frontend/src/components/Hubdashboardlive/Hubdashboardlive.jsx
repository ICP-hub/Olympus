import React from 'react';
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import guide from "../../../assets/getStarted/guide.png";
import upvote from "../../../assets/getStarted/upvote.png";
import SubmitSection from "../Footer/SubmitSection";
import LiveProjects from "../Dashboard/LiveProjects";

import ListedProjects from '../Dashboard/ListedProjects';
import project from "../../../assets/images/project.png";
import ment from "../../../assets/images/ment.jpg";
// import btn from "../../../assets/Comprehensive/upote.png";
import { Line } from "rc-progress";

const Hubdashboardlive = () => {
    const actor = useSelector((currState) => currState.actors.actor);

    // console.log("actor in dashboard =>", actor);
  
    useEffect(() => {
        const founderDataFetchHandler = async () => {
            const founderDataFetch = await actor.get_mentor_candid();
            // console.log("dekho dekho founder data aaya => ", founderDataFetch);
        };
        founderDataFetchHandler();
    }, [actor]);
  
    const underline =
        "relative focus:after:content-[''] focus:after:block focus:after:w-full focus:after:h-[2px] focus:after:bg-blue-800 focus:after:absolute focus:after:left-0 focus:after:bottom-[-4px]";
    
    return (
        <div className='p-8'>
            <div className='lg:mt-[-150px] md:mt-[-50px] mt-[270px] '>
            <LiveProjects />
            </div>
           </div>
    )
}

export default Hubdashboardlive;

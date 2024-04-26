import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import NoDataCard from "../Mentors/Event/NoDataCard";

const MentorCard = (mentor) => {
  // console.log(mentor)
  const navigate = useNavigate();
  // const [data, setData] = useState([]);
  // const [noData, setNoData] = useState(null);

  // const actor = useSelector((currState) => currState.actors.actor);
  
  // const getAllMentors = async (caller) => {
  //   await caller.get_all_mentors_candid().then((result) => {
  //     if (!result || result.length == 0) {
  //       setNoData(true)
  //       setData([])
  //     } else {
  //       setData(result);
  //       setNoData(false)
  //     }
  //   }).catch((error) => {
  //     setNoData(true)
  //     setData([])
  //   })
  // }

  // useEffect(() => {
  //   if (actor) {
  //     getAllMentors(actor);
  //   } else {
  //     getAllMentors(IcpAccelerator_backend);
  //   }
  // }, [actor]);

  // if (noData) {
  //   return <div className="items-center w-full">
  //     <NoDataCard />
  //   </div>
  // }
  return (
    <div
    // key={}
    className="bg-white  hover:scale-105 w-full sm:w-1/2 md:w-1/4 rounded-lg mb-5 md:mb-0 p-6"
  >
    <div className="justify-center flex items-center">
      <div
        className="size-48  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
        style={{
          backgroundImage: `url(${mentor.img}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
          backdropFilter: "blur(20px)",
        }}
      >
        <img
          className="object-cover size-48 max-h-44 rounded-full"
          src={mentor.img}
          alt=""
        />
      </div>
    </div>
    <div className="text-black text-start">
      <div className="text-start my-3">
        <span className="font-semibold text-lg truncate">{mentor.name}</span>
        <span className="block text-gray-500 truncate">
          {mentor.category_of_mentoring_service}
        </span>
      </div>
      <div>
        <div className="flex overflow-x-auto gap-2 pb-4 max-md:justify-center">
        {mentor?.skills?.split(',').map((item, index) => {
                return (<span key={index} className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                {item.trim()}
              </span>)
              })}
        </div>
        <button onClick={() => mentor.id ? navigate(`/view-mentor-details/${mentor.id}`) : ''} className="mt-4 text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out">
              View Profile
            </button>
      </div>
    </div>
  </div>
  );
};

export default MentorCard;

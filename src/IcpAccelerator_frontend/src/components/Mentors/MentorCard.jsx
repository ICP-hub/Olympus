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
    <div className="my-3 flex items-stretch justify-between lg:flex-row md:gap-4 w-fit w-full pr-2 max-md:flex-col">
      <div className="bg-white duration-300 ease-in-out hover:scale-105 md:mb-0 mb-5 p-5 rounded-lg shadow-lg transition-transform flex-grow max-md:w-full md:w-1/3">
        <div className=" flex items-center justify-center w-1/2" style={{margin: "auto"}}>
          <img className="w-full object-cover" src={mentor.img} alt="" style={{borderRadius: '50%'}} />
        </div>
        <div className="text-black mt-4 text-center">
          <span className="font-semibold text-lg line-clamp-1">
            {mentor.name}
          </span>
          <span className="block text-gray-500 line-clamp-2 truncate text-wrap md:h-12">
            {mentor.category_of_mentoring_service}
          </span>
          <div>
            <div className="flex flex-wrap gap-2 border-t-2 mt-3 py-3">
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
       
    </div>
  );
};

export default MentorCard;

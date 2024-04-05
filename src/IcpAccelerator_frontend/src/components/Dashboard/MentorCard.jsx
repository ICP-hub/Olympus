import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import NoDataCard from "../Mentors/Event/NoDataCard";

const MentorCard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);

  const actor = useSelector((currState) => currState.actors.actor);
  
  const getAllMentors = async (caller) => {
    await caller.get_all_mentors_candid().then((result) => {
      if (!result || result.length == 0) {
        setNoData(true)
        setData([])
      } else {
        setData(result);
        setNoData(false)
      }
    }).catch((error) => {
      setNoData(true)
      setData([])
    })
  }

  useEffect(() => {
    if (actor) {
      getAllMentors(actor);
    } else {
      getAllMentors(IcpAccelerator_backend);
    }
  }, [actor]);
  if (noData) {
    return <div className="items-center w-full">
      <NoDataCard />
    </div>
  }
  return (
    <div className="flex flex-col lg:flex-row items-center w-full lg:w-11/12">
      {data && data.slice(0,3).map((mentor, index) => {
        let id = null
        let img = ""
        let name = ""
        let skills = ""
        let category_of_mentoring_service = ""
        let role = 'Mentor';
        if (noData === false) {

          id = mentor[0].toText();
          img = uint8ArrayToBase64(mentor[1]?.mentor_profile?.profile?.user_data?.profile_picture[0]);
          name = mentor[1]?.mentor_profile?.profile?.user_data?.full_name;
          skills = mentor[1]?.mentor_profile?.profile?.area_of_expertise;
          category_of_mentoring_service = mentor[1]?.mentor_profile?.profile?.category_of_mentoring_service;
          role = 'Mentor';
        } else {
          id = mentor.id
          img = mentor.image
          name = mentor.name
          skills = mentor.areaOfFocus
          role = mentor.role;
        }
        return (
          <div key={index} className="flex-shrink-0 overflow-hidden bg-white rounded-lg max-w-xs shadow-lg p-5 w-full lg:w-1/3 mx-2 mb-3 hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className=" flex items-center justify-center px-8">
              <img className="w-full h-40 object-cover rounded-md" src={img} alt="" />
            </div>
            <div className="text-black mt-4 text-center">
              <span className="font-semibold text-lg line-clamp-1">
                {name}
              </span>
              <span className="block text-gray-500">
                {category_of_mentoring_service}
              </span>
              <div className="flex flex-wrap gap-2 border-t-2 mt-3 py-3">
                <span className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                  {skills}
                </span>
              </div>
              <button onClick={() => id ? navigate(`/view-mentor-details/${id}`) : ''} className="mt-4 text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out">
                View Profile
              </button>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default MentorCard;

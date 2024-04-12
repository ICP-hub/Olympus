import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import NoDataCard from "../Mentors/Event/MentorsNoDataCard";

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
        console.log('all mentors', result)
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
    return <div className="items-center w-full flex justify-center">
      <NoDataCard />
    </div>
  }
  return (
    <div className="flex items-stretch justify-between lg:flex-row md:gap-4 w-fit w-full pr-2 max-md:flex-col">
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
          skills = mentor[1]?.mentor_profile?.profile?.user_data?.area_of_interest;
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
          <div key={index} className="bg-white max-w-[50%] duration-300 ease-in-out hover:scale-105 md:mb-0 mb-5 p-5 rounded-lg shadow-lg transition-transform flex-grow max-md:w-full md:w-1/3">
            <div className=" flex items-center justify-center w-1/2" style={{margin: "auto"}}>
              <img className="w-14 h-14 object-cover" src={img} alt="" style={{borderRadius: '50%'}} />
            </div>
            <div className="text-black mt-4 text-center">
              <span className="font-semibold text-lg line-clamp-1">
                {name}
              </span>
              <span className="block text-gray-500 line-clamp-2 truncate text-wrap md:h-12">
                {category_of_mentoring_service}
              </span>
              <div>
                <div className="flex overflow-x-scroll gap-2 border-t-2 mt-3 py-3">
                  {skills?.split(',').map((item, index) => {
                    return (<span key= {index} className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                      {item.trim()}
                    </span>)
                  })}
                </div>
                <button onClick={() => id ? navigate(`/view-mentor-details/${id}`) : ''} className="mt-4 text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default MentorCard;

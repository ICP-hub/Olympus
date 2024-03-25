import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import NoDataCard from "../Mentors/Event/NoDataCard";
const mentors = [
  {
    id: null,
    image: image,
    name: "SamyKarim",
    role: "Toshi",
    areaOfFocus: "Kubernetes",
  },
  {
    id: null,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    areaOfFocus: "Observability",
  },
  {
    id: null,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    areaOfFocus: "SRE",
  },

];


const MentorCard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);

  const actor = useSelector((currState) => currState.actors.actor);
  
  const getAllMentors = async (caller) => {
    await caller.get_all_mentors_candid().then((result) => {
      console.log('result-in-get-all-mentors', result)
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
      console.log('error-in-get-all-mentors', error)
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
    <div className="p-1 flex items-center mb-8 gap-8">
      {data && data.map((mentor, index) => {
        let id = null
        let img = ""
        let name = ""
        let skills = ""
        let role = 'Mentor';
        if (noData === false) {

          id = mentor[0].toText();
          img = uint8ArrayToBase64(mentor[1]?.mentor_profile?.profile?.user_data?.profile_picture[0]);
          name = mentor[1]?.mentor_profile?.profile?.user_data?.full_name;
          skills = mentor[1]?.mentor_profile?.profile?.area_of_expertise;
          role = 'Mentor';
        } else {
          id = mentor.id
          img = mentor.image
          name = mentor.name
          skills = mentor.areaOfFocus
          role = mentor.role;
        }
        return (
          <div key={index} className="flex-shrink-0 overflow-hidden bg-white rounded-lg max-w-xs shadow-lg p-5 w-1/3">
            <div className=" flex items-center justify-center px-8">
              <img className="w-full h-40 object-cover rounded-md" src={img} alt="" />
            </div>
            <div className="text-black mt-2 text-center">
              <span className="font-semibold text-lg line-clamp-1">
                {name}
              </span>
              <span className="block font-semibold line-clamp-2 h-10 overflow-y-scroll">
                {role}
              </span>
              <div className="flex flex-wrap gap-2 border-t-2 py-3">
                {/* {mentor.areaOfFocus.map((investment, index) => ( */}
                <span className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                  {skills}
                </span>
                {/* ))} */}
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

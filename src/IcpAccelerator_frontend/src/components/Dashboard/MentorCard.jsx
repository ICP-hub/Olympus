import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
// const mentors = [
//   {
//     id: 1,
//     image: image,
//     name: "SamyKarim",
//     role: "Toshi, Managing Partner. Ex-Binance",
//     areaOfFocus: ["SRE", "Observability ", "Kubernetes"],
//   },
//   {
//     id: 2,
//     image: image,
//     name: "SamyKarim",
//     role: "Toshi, Managing Partner. Ex-Binance",
//     areaOfFocus: ["SRE", "Observability ", "Kubernetes"],
//   },

// ];


const MentorCard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const actor = useSelector((currState) => currState.actors.actor);
  const getAllMentors = async (caller) => {
    await caller.get_all_mentors_candid().then((result) => {
      console.log('result-in-get-all-mentors', result)
      setData(result)
    }).catch((error) => {
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
  return (
    <div className="p-1 flex items-center mb-8 gap-4">
      {data.map((mentor, index) => {
        let id = mentor[1]?.mentor_profile?.uid;
        let img = uint8ArrayToBase64(mentor[1]?.mentor_profile?.profile?.user_data?.profile_picture);
        let name = mentor[1]?.mentor_profile?.profile?.user_data?.full_name;
        let skills = mentor[1]?.mentor_profile?.profile?.area_of_expertise;
        let role = 'Mentor';

        return (
          <div key={index} className="flex-shrink-0 overflow-hidden bg-white rounded-lg max-w-xs shadow-lg p-5">
            <div className=" flex items-center justify-center px-8">
              <img className="w-full h-40 object-fill rounded-md" src={img} alt="" />
            </div>
            <div className="text-black mt-2 text-center">
              <span className="font-semibold text-lg line-clamp-1">
                {name}
              </span>
              <span className="block font-semibold line-clamp-2">
                {role}
              </span>
              <div className="flex flex-wrap gap-2 border-t-2">
                {/* {mentor.areaOfFocus.map((investment, index) => ( */}
                <span className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                  {skills}
                </span>
                {/* ))} */}
              </div>
              <button onClick={() => navigate(`/view-mentor-details/${id}`)} className="mt-4 text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out">
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

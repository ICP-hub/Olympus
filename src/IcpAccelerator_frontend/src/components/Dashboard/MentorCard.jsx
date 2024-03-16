import React from "react";
import image from "../../../assets/images/samya.jpg";
const mentors = [
  {
    id: 1,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    areaOfFocus: ["SRE", "Observability ", "Kubernetes"],
  },
  {
    id: 2,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    areaOfFocus:["SRE", "Observability ", "Kubernetes"],
  },

];

const MentorCard = () => {
  return (
    <div className="p-1 flex flex-wrap items-center mb-8 gap-4">
      {mentors.map((mentor) => (
        <div key={mentor.id} className="flex-shrink-0 overflow-hidden bg-white rounded-lg max-w-xs shadow-lg p-5">
          <div className=" flex items-center justify-center px-8">
            <img className="w-full h-40 object-fill rounded-md" src={mentor.image} alt="" />
          </div>
          <div className="text-black mt-2 text-center">
            <span className="font-semibold text-lg line-clamp-1">
              {mentor.name}
            </span>
            <span className="block font-semibold line-clamp-2">
              {mentor.role}
            </span>
            <div className="flex flex-wrap gap-2 border-t-2">
              {mentor.areaOfFocus.map((investment, index) => (
                <span key={index} className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                  {investment}
                </span>
              ))}
            </div>
            <button className="mt-4  text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out">
            View Profile
                </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MentorCard;

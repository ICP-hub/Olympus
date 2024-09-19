import React from "react";
import { FaPlus } from 'react-icons/fa';
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";

const ProfileHeader = ({ ProfileImage, Fullname, openchat_username }) => (
  <div className="p-6 bg-gray-50">
    <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
      <img
        src={ProfileImage}
        alt={Fullname}
        className="w-full h-full rounded-full object-cover"
        loading="lazy"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FaPlus className="text-white text-xl" />
        <input
          id="file-upload"
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
      </div>
    </div>
    <div className="flex items-center justify-center mb-1">
      <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
      <h2 className="text-xl font-semibold">{Fullname}</h2>
    </div>
    <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
    <button className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center">
      Get in touch
      <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
    </button>
  </div>
);

export default ProfileHeader;

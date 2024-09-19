import React from "react";
import { MoreVert } from "@mui/icons-material"; 
import founder from "../../../assets/Logo/founder.png";
const RoleProfileCard = ({role,image,message}) => {
  return (
    <div className="bg-[#EEF2F6] shadow-md rounded-lg p-6  w-full md:w-3/4 h-60 flex flex-col items-center text-center relative mb-6 md:mb-0">
      <img
        src={image} 
        alt="Profile"
        className="w-20 h-20 rounded-full mb-4"
        loading="lazy"
        draggable={false}
      />
      <div className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2">
        {role}
      </div>
      <p className="text-gray-700 font-semibold mb-4 text-sm lgx:text-sm dxl0:text-base">
        {/* Maximize the expansion of your projects and find investments */}
        {message}
      </p>
      {/* <div className="text-sm text-gray-500">
        <span className="font-semibold">Projects:</span> 1
      </div> */}
    </div>
  );
};

export default RoleProfileCard;

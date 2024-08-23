import React from "react";
import { MoreVert } from "@mui/icons-material"; 
import founder from "../../../assets/Logo/founder.png";
const ProfileCard = ({role,image}) => {
  return (
    <div className="bg-[#EEF2F6] shadow-md rounded-lg p-6 min-w-[220px] max-w-[350px] flex flex-col items-center text-center relative">
      <img
        src={image} 
        alt="Profile"
        className="w-20 h-20 rounded-full mb-4"
      />
      <div className="absolute top-3 right-3">
        <MoreVert className="text-gray-400 cursor-pointer" />
      </div>
      <div className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2">
        {role}
      </div>
      <p className="text-gray-700 font-semibold mb-4">
        Maximize the expansion of your projects and find investments
      </p>
      {/* <div className="text-sm text-gray-500">
        <span className="font-semibold">Projects:</span> 1
      </div> */}
    </div>
  );
};

export default ProfileCard;

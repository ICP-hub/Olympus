import React from "react";
import { MoreVert } from "@mui/icons-material"; 
import founder from "../../../assets/Logo/founder.png";
const RoleProfileCard = ({role,image}) => {
  return (
    <div className="bg-[#EEF2F6] shadow-md rounded-lg p-6 w-3/4 h-60 flex flex-col items-center text-center relative">
      <img
        src={image} 
        alt="Profile"
        className="w-20 h-20 rounded-full mb-4"
      />
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

export default RoleProfileCard;

import React from 'react';
import founder from "../../../assets/Logo/founder.png";

const ProfileRoleCard = () => {
  return (
    <div className="max-w-xs p-4 bg-gray-100 rounded-xl shadow-lg text-center  ">
      <div className="flex justify-center">
        <img
          src={founder}
          alt="Project"
          className="w-20 h-20 rounded-full object-cover mb-4"
        />
      </div>
      <div className="text-blue-600 bg-blue-100 rounded-full px-3 py-1 inline-block text-xs font-semibold mb-2">
        PROJECT
      </div>
      <h3 className="text-gray-800 text-sm font-normal">
        Maximize the expansion of your projects and find investments
      </h3>
      
    </div>
  );
};

export default ProfileRoleCard;

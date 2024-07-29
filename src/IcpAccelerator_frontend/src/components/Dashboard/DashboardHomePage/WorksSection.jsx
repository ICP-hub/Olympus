import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import WorkSectionImage from "../../../../assets/Logo/WorkSectionImage.png";

const WorksSection = () => {
  return (
    <div className="p-6">
      {/* Tab Navigation and Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button className="text-gray-500">Roles</button>
          <button className="text-gray-500 flex items-center">
            Services
            <span className="ml-1 bg-gray-200 text-gray-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </button>
          <button className="text-[#155EEF] border-b-2 border-[#155EEF] flex items-center">
            Works
            <span className="ml-1 bg-[#155EEF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </button>
          <button className="text-gray-500">Rating</button>
        </div>
        <button className="bg-[#155EEF] text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium hover:bg-[#1356D9] transition-colors duration-300">
          <AddIcon className="w-5 h-5" />
          <span>Add new work</span>
        </button>
      </div>

      {/* Work Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md">
        <div className="p-4 bg-[#0D4C92]">
          <img 
            src={WorkSectionImage}
            alt="Landing page design for Startup Business" 
            className="w-full h-auto rounded"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Landing page design for Startup Business</h2>
          <p className="text-gray-600 text-sm mb-4">
            Est malesuada ac elit gravida vel aliquam nec.
            Arcu pelle ntesque convallis quam feugiat non
            viverra massa fringilla.
          </p>
          <div className="flex space-x-2">
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">Web design</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">UX/UI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorksSection;
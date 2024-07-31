import React from 'react';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyBitcoinRoundedIcon from '@mui/icons-material/CurrencyBitcoinRounded';
import LandingPageDesign from "../../../../assets/Logo/LandingPageDesign.png";

const ServiceSection = () => {
  return (
    <div className="p-6">
      {/* Tab-like navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button className="text-gray-500">Roles</button>
          <button className="text-[#155EEF] border-b-2 border-[#155EEF] flex items-center">
            Services
            <span className="ml-1 bg-[#EFF4FF] broder-[#B2CCFF] border text-[#004EEB] text-xs rounded-full w-6 h-4 flex items-center justify-center">
              1
            </span>
          </button>
          <button className="text-gray-500">Works</button>
          <button className="text-gray-500">Rating</button>
        </div>
        <button className="bg-[#155EEF] text-white px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-medium hover:bg-[#1356D9] transition-colors duration-300">
          <AddIcon className="w-5 h-5" />
          <span>Add new service</span>
        </button>
      </div>

      {/* Service Card */}
      <div className="bg-white rounded-lg shadow-md p-4 flex">
        {/* Left side - Image */}

          <div className="w-1/3 pr-4">
            <img
              src={LandingPageDesign}
              alt="Landing page design"
              className="w-full h-auto rounded-lg"
            />
          </div>


        {/* Right side - Content */}
        <div className="w-2/3 relative">
          <IconButton className="absolute top-0 right-0">
            <MoreVertIcon className="flex space-between" />
          </IconButton>

          <h2 className="text-2xl font-bold mb-2">Landing page design</h2>
          <p className="text-gray-600 mb-4">
            Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque
            convallis quam feugiat non viverra massa fringilla.
          </p>

          <div className="flex space-x-2 mb-4">
            <span className="bg-white border-[#CDD5DF] border text-[#364152] rounded-full px-3 py-1 text-sm">
              Web design
            </span>
            <span className="bg-white border-[#CDD5DF] border text-[#364152] rounded-full px-3 py-1 text-sm">
              UX/UI
            </span>
          </div>

          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <AccessTimeIcon className="mr-1" fontSize="small" />1 week
            </div>
            <div className="flex items-center">
              {/* <AttachMoneyIcon className="mr-1" fontSize="small" /> */}
              $1000
            </div>
            <div className="flex items-center">
              <CurrencyBitcoinRoundedIcon className="mr-1" fontSize="small" />
              Yes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
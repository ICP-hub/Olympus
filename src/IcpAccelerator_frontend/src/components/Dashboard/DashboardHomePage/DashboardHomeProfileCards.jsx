import React from 'react';
import { AccountCircle, Star, Group, InfoOutlined, StarBorderOutlined} from '@mui/icons-material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import nodata from "../../../../assets/images/nodata.png"
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import VerifiedIcon from "@mui/icons-material/Verified";

function DashboardHomeProfileCards() {
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Main profile card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Main profile</h2>
          <button className="text-blue-500 font-normal ">Manage &gt;</button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[5px] bg-green-500"
            style={{ width: "35%" }}
          ></div>
          <div className="flex flex-col items-center pt-2">
            <div className="w-20 h-20 bg-gray-300 rounded-full mb-3 overflow-hidden">
              {/* <AccountCircle className="w-full h-full text-gray-400" /> */}
              <img
                src={ProfileImage}
                alt='Profle Image'
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <span className="inline-block bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] text-xs font-semibold px-2 py-1 rounded-md mb-2">
              OLYMPIAN
            </span>
            <h3 className="text-lg font-semibold flex items-center mb-1">
              
              <span className="text-blue-500 ml-1">
              <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
              </span>
              Matt Bowers
            </h3>
            <p className="text-gray-500">@mattbowers</p>
          </div>
        </div>
      </div>

      {/* Rating card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold mr-2">Rating</h2>
            <HelpOutlineOutlinedIcon className="text-gray-400" fontSize="small" />
          </div>
          <button className="text-blue-500 font-normal">
            View details &gt;
          </button>
        </div>
        <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
          <svg
            className="text-gray-200 w-20 h-20 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-gray-700 font-semibold mb-2">No ratings yet</p>
          <p className="text-gray-500 text-sm text-center">
            Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat
            rhoncus tristique ullamcorper sit.
          </p>
        </div>
      </div>

      {/* Roles card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold mr-2">Roles</h2>
            <HelpOutlineOutlinedIcon className="text-gray-400" fontSize="small" />
          </div>
          <button className="text-blue-500 font-normal">Manage &gt;</button>
        </div>
        <div className="mt-2 h-35 flex justify-center items-center border border-dashed border-gray-300 rounded-lg p-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <PersonOutlineOutlinedIcon className="text-gray-400 w-8 h-8" />
          </div>
        </div>
        <div className="mt-8 h-35 flex justify-center items-center border border-dashed border-gray-300 rounded-lg p-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <PersonOutlineOutlinedIcon className="text-gray-400 w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
      <div className='border border-dashed border-gray-300 p-6 '>
      <div className="flex  items-center justify-center h-full text-center">
      <img src={nodata} alt="" className='h-full '/>
    </div>
      </div>
   
  </div>
 </>
  );
}

export default DashboardHomeProfileCards;
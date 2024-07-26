import React from 'react';
import { ArrowBack, Share, MoreVert } from '@mui/icons-material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import CypherpunkLabLogo from "../../../../assets/Logo/CypherpunkLabLogo.png";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NorthEastOutlinedIcon from '@mui/icons-material/NorthEastOutlined';
import DocumentSection from './DocumentSection';
import TeamSection from './TeamSection';

function ProjectProfile() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Top navigation */}
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
          <ArrowBack className="mr-2" fontSize="small" />
          Back to profile
        </button>
        <div className="flex items-center">
          <button className="mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            View public profile
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            <Share className="mr-1" fontSize="small" /> Share
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Profile Card */}
        <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6 rounded-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-1 bg-gray-200">
              <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
            </div>
            <div className="p-4 bg-gray-100">
              <MoreVert className="absolute top-2 right-2 text-gray-500 cursor-pointer" />
              <div className="relative mb-6">
                <img
                  src={CypherpunkLabLogo}
                  alt="Cypherpunk Labs"
                  className="w-32 h-32 mx-auto"
                />
                <button className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 px-4 py-1 rounded text-sm shadow-sm border border-gray-200">
                  Set status ▼
                </button>
              </div>
              <h2 className="text-xl font-bold text-center mb-2">
                Cypherpunk Labs
              </h2>
              <p className="text-gray-600 text-center mb-4">@cypherpunklabs</p>
              <button className="w-4/5 mx-auto bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4 flex items-center justify-center">
              Get in touch
                <NorthEastOutlinedIcon
                  className="ml-1 transform rotate-45"
                  fontSize="small"
                />
              </button>
            </div>

            <div className=" p-4">
              <div className="mb-4">
                <h3 className="font-normal mb-2 text-sm text-gray-500">
                  ASSOCIATIONS
                </h3>
                <div className="flex">
                  <img
                    src={ProfileImage}
                    alt="Association"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              </div>
              <hr className="mb-6"></hr>
              <div className="mb-4">
                <h3 className="font-normal mb-2 text-sm text-gray-500">
                  TAGLINE
                </h3>
                <p>Founder & CEO at Cypherpunk Labs</p>
              </div>

              <div className="mb-4">
                <h3 className="font-normal mb-2 text-sm text-gray-500">
                  ABOUT
                </h3>
                <p>
                  Est malesuada ac elit gravida vel aliquam nec. Arcu pelle
                  ntesque convallis quam feugiat non viverra massa fringilla.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-normal mb-2 text-sm text-gray-500">
                  CATEGORY
                </h3>
                <span className="bg-white text-gray-700 px-2 py-1 rounded-full text-sm border border-gray-200">
                  Infrastructure
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-normal mb-2 text-sm text-gray-500">
                  STAGE
                </h3>
                <span className="bg-white text-gray-700 px-2 py-1 rounded-full text-sm border border-gray-200">
                  MVP
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-normal mb-2 text-sm text-gray-500">
                  ICF NETWORK STATUS
                </h3>
                <button className="bg-gray-100 hover:bg-gray-200 text-sm w-full sm:w-64 px-3 py-1 rounded border border-gray-200 text-left">
                  <span className="inline-block">+ Add information</span>
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-normal mb-2 text-sm text-gray-500">
                  LINKS
                </h3>
                <div className="flex space-x-2">
                  <LinkedInIcon className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                  <GitHubIcon className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                  <TelegramIcon className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Section */}
        {/* <div className="md:w-2/3"><DocumentSection /></div> */}
        <div className="md:w-2/3"><TeamSection /></div>
      </div>
    </div>
  );
}

export default ProjectProfile;
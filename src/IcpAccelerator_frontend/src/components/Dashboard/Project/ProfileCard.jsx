import React from "react";
import CypherpunkLabLogo from "../../../../assets/Logo/CypherpunkLabLogo.png";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import { 
  ArrowBack, 
  ArrowOutwardOutlined as ArrowOutwardOutlinedIcon, 
  MoreVert, 
  LinkedIn, 
  GitHub, 
  Telegram, 
  Add 
} from "@mui/icons-material";

function ProfileCard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Top navigation */}
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
          <ArrowBack className="mr-2" fontSize="small" />
          Back to profile
        </button>
        <div className="flex items-center">
          <button className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            Share This
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-sm">
          <div className="relative h-1 bg-gray-200">
            <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
          </div>
          <div className="p-6 bg-gray-50 relative">
            {/* Three-dot menu button */}
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <MoreVert fontSize="small" />
            </button>
            
            <div className="relative w-28 mx-auto mb-6">
              <img
                src={CypherpunkLabLogo}
                alt="Cypherpunk Labs"
                className="w-full aspect-square object-cover rounded-lg"
              />
              <button className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-center px-3 py-1.5 text-xs font-medium rounded-md shadow-md flex items-center justify-center w-5/6">
                <span className="whitespace-nowrap">Set status</span>
                <span className="ml-1">▼</span>
              </button>
            </div>

            <h2 className="text-2xl font-semibold text-center mb-1">
              Cypherpunk Labs
            </h2>
            <p className="text-gray-600 text-center mb-4">@cypherpunklabs</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-6 flex items-center justify-center">
              Get in touch
              <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
            </button>
          </div>

          <div className="p-6 bg-white">
            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                Status
              </h3>
              <div className="flex space-x-2">
                <span className="bg-[#FFFAEB] border border-[#FEDF89] text-[#B54708] px-3 py-1 rounded-md text-xs font-medium">
                  Under Review
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                ASSOCIATIONS
              </h3>
              <div className="flex space-x-2">
                <img
                  src={ProfileImage}
                  alt="Profile"
                  className="h-[40px] w-[40px] rounded-full"
                />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                Tagline
              </h3>
              <p className="text-sm">Bringing privacy back to users</p>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                About
              </h3>
              <p className="text-sm">
                Est malesuada ac elit gravida vel aliquam nec. Arcu pelle
                ntesque convallis quam feugiat non viverra massa fringilla.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-sm text-gray-500">
                CATEGORY
              </h3>
              <div className="flex space-x-2">
                <span className="bg-white border border-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
                  Infrastructure
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-sm text-gray-500">STAGE</h3>
              <div className="flex space-x-2">
                <span className="bg-white border border-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
                  MVP
                </span>
              </div>
            </div>

            <div className="mb-4 max-w-sm">
              <h3 className="font-normal mb-2 text-sm text-gray-500">
                ICP NETWORK STATUS
              </h3>
              <button className="bg-gray-100 hover:bg-gray-200 text-sm w-full px-3 py-2 rounded border border-gray-200 text-left flex items-center">
                <Add fontSize="small" className="mr-2" />
                <span>Add information</span>
              </button>
            </div>

            <div>
              <h3 className="font-normal mb-2 text-sm text-gray-500">LINKS</h3>
              <div className="flex space-x-2">
                <LinkedIn className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                <GitHub className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                <Telegram className="text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
import React from "react";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import LandingPageDesign from "../../../../assets/Logo/LandingPageDesign.png";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AddIcon from '@mui/icons-material/Add';
import {
  ArrowBack,
  ArrowForward,
  Share,
  MoreVert,
  CheckCircle,
  NorthEastOutlined,
  LinkedIn,
  GitHub,
  Telegram,
  Add,
  LocationOn,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

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
          Share
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Card */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-sm">
          <div className="relative h-1 bg-gray-200">
            <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
          </div>
          <div className="p-6 bg-gray-50">
            <img
              src={ProfileImage}
              alt="Matt Bowers"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <div className="flex items-center justify-center mb-1">
              <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
              <h2 className="text-2xl font-semibold">Matt Bowers</h2>
            </div>
            <p className="text-gray-600 text-center mb-4">@mattbowers</p>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center">
              Get in touch
              <ArrowForward className="ml-1" fontSize="small" />
            </button>
          </div>

          <div className="p-6 bg-white">
            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                Roles
              </h3>
              <div className="flex space-x-2">
                <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-3 py-1 rounded-md text-xs font-medium">
                  OLYMPIAN
                </span>
                <span className="bg-[#ECFDF3] border border-[#ABEFC6] text-[#067647] px-3 py-1 rounded-md text-xs font-medium">
                  TALENT
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex border-b">
                <button className="text-blue-600 border-b-2 border-blue-600 pb-2 mr-4 font-medium">
                  General
                </button>
                <button className="text-gray-400 pb-2 font-medium">
                  Expertise
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                Email
              </h3>
              <div className="flex items-center">
                <p className="mr-2 text-sm">mail@email.com</p>
                <VerifiedIcon
                  className="text-blue-500 mr-2 w-2 h-2"
                  fontSize="small"
                />
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">
                  HIDDEN
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                Tagline
              </h3>
              <p className="text-sm">Founder & CEO at Cypherpunk Labs</p>
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
                INTERESTS
              </h3>
              <div className="flex space-x-2">
                <span className="bg-white border borer-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
                  Web3
                </span>
                <span className="bg-white border borer-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
                  Cryptography
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-sm text-gray-500">
                LOCATION
              </h3>
              <div className="flex items-center">
                <PlaceOutlinedIcon
                  className="text-gray-400 mr-1"
                  fontSize="small"
                />
                <p>San Diego, CA</p>
              </div>
            </div>

            <div className="mb-4 max-w-sm">
              <h3 className="font-normal mb-2 text-sm text-gray-500">
                TIMEZONE
              </h3>
              <button className="bg-gray-100 hover:bg-gray-200 text-sm w-full px-3 py-2 rounded border border-gray-200 text-left flex items-center">
                <Add fontSize="small" className="mr-2" />
                <span>Add timezone</span>
              </button>
            </div>

            <div className="mb-4 max-w-sm">
              <h3 className="font-normal mb-2 text-sm text-gray-500">
                LANGUAGES
              </h3>
              <button className="bg-gray-100 hover:bg-gray-200 text-sm w-full px-3 py-2 rounded border border-gray-200 text-left flex items-center">
                <Add fontSize="small" className="mr-1 inline-block" />
                Add languages
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

        {/*---------------------Service Section------------------------------- */}
        <div className="md:w-2/3">
          <div className="flex flex-col mb-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="text-gray-500 py-2">Roles</button>
                <button className="text-[#155EEF] py-2 flex items-center relative">
                  Services
                  <span className="ml-1 bg-[#EFF4FF] border-[#B2CCFF] border text-[#004EEB] text-xs rounded-full w-6 h-4 flex items-center justify-center">
                    1
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#155EEF]"></div>
                </button>
                <Link to="/dashboard/single-add-new-work">
                  <button className="text-gray-500 py-2">Works</button>
                </Link>
                <button className="text-gray-500 py-2">Rating</button>
              </div>
            </div>
            <hr className="w-full border-t border-gray-200 mt-0" />
            <div className="flex justify-end mt-4">
              <button className="bg-[#155EEF] text-white px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-medium hover:bg-[#1356D9] transition-colors duration-300">
                <AddIcon className="w-5 h-5" />
                <span>Add new service</span>
              </button>
            </div>
          </div>
          {/* Service Card */}
          <Link to="/dashboard/single-project">
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 pr-4 mb-4 md:mb-0">
                <img
                  src={LandingPageDesign}
                  alt="Landing page design"
                  className="w-full h-auto rounded-lg"
                />
              </div>

              <div className="w-full ml-10 md:w-2/3 relative">
                <MoreVert className="absolute top-0 right-0 cursor-pointer" />
                <h2 className="text-2xl font-bold mb-2">Landing page design</h2>
                <p className="text-gray-600 mb-4">
                  Est malesuada ac elit gravida vel aliquam nec. Arcu pelle
                  ntesque convallis quam feugiat non viverra massa fringilla.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-white border-[#CDD5DF] border text-[#364152] rounded-full px-3 py-1 text-sm">
                    Web design
                  </span>
                  <span className="bg-white border-[#CDD5DF] border text-[#364152] rounded-full px-3 py-1 text-sm">
                    UX/UI
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <AccessTimeIcon className="mr-1" fontSize="small" />1 week
                  </div>
                  <div className="flex items-center">$1000</div>
                  <div className="flex items-center">
                    <CurrencyBitcoinIcon className="mr-1" fontSize="small" />
                    Yes
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectProfile;

// import React from 'react'
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
// import VerifiedIcon from '@mui/icons-material/Verified';
// import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// import { Link } from "react-router-dom"
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import TelegramIcon from '@mui/icons-material/Telegram';
// import { locationSvgIcon } from '../Utils/Data/SvgData';

// const ProfileDetail = () => {
//     return (
//         <div className='container  max-w-[400px]  border-2 rounded-xl'>
//             <div className='relative rounded-t-lg pb-5 mb-2 bg-[#EEF2F6]'>
//                 <div className='w-full  bg-[#EEF2F6] rounded-l-xl rounded-r-full h-1.5 mb-4 dark:bg-[#EEF2F6]'>
//                     <div className="bg-green-500 h-1.5 rounded-l-full dark:bg-gray-700 " style={{ width: "65%" }}></div></div>
//                 <div className='absolute top-5 right-4'><MoreVertIcon /></div>
//                 <div className='flex justify-center'>
//                     <div className="bg-gray-200  rounded-full p-4 mb-4">
//                         <svg className="w-9 h-9 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                         </svg>
//                     </div>
//                 </div>
//                 <div className='flex flex-col justify-center items-center mb-5'>
//                     <h2 className='font-bold text-lg'><span><VerifiedIcon sx={{ color: "#155EEF", fontSize: "medium" }} /></span>Matt Bowers</h2>
//                     <p className=''>@mattbowers</p>
//                 </div>
//                 <div className='flex justify-center items-center'>
//                     <button className='border rounded-md bg-[#155EEF] py-1 px-5  text-white'>Get in touch <span className='pl-1 text-white'></span><ArrowOutwardIcon sx={{ marginTop: "-6px", fontSize: "medium" }} /></button>
//                 </div>
//             </div>
//             <div className='p-4'>
//                 <div className='p-1'>
//                     <h3 className='text-xs pb-2 font-normal text-gray-400'>ROLES</h3>
//                     <button className='text-[#026AA2] border rounded-md text-xs p-1 font-semibold bg-[#F0F9FF] '>OLYMPIAN</button>
//                 </div>
//                 <hr />
//                 <div className='p-1 mt-2'>
//                     <h3 className='text-xs pb-2 text-gray-400 font-normal'>EMAIL</h3>
//                     <div className='flex gap-2'>
//                         <p className=' text-sm font-medium '>mail@gmail.com <span className='ml-2'><VerifiedIcon sx={{ color: "#155EEF", fontSize: "small" }} /></span></p>
//                         <button className=' text-xs font-medium border p-1 rounded-md bg-[#F0F9FF]  '>HIDDEN</button></div>
//                 </div>
//                 <div className='p-1 mt-2'>
//                     <h3 className='text-xs pb-2 text-gray-400 font-normal'>TAGLINE</h3>
//                     <p className='text-sm font-medium '>Founder & CEO Cypherpunks Lab</p>
//                 </div>
//                 <div className='p-1 mt-2'>
//                     <h3 className='text-xs pb-2 text-gray-400 font-normal'>ABOUT</h3>
//                     <p className='text-sm font-medium '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, corporis!</p>
//                 </div>
//                 <div className='p-1 mt-2'>
//                     <h3 className='text-xs pb-2 text-gray-400 font-normal'>INTERESTS</h3>
//                     <div className='flex gap-2'>
//                         <button className='border-2 rounded-3xl  px-2 text-sm font-medium ' >Web3</button>
//                         <button className='border-2 rounded-3xl py-1 px-2 text-sm font-medium ' >Cryptography</button>
//                     </div>
//                 </div>
//                 <div className='p-1 mt-2'>
//                     <h3 className='text-xs pb-2 text-gray-400 font-normal'>LOCATION</h3>
//                     <p className='text-sm font-medium flex items-center gap-2'><span className=''>{locationSvgIcon}</span>San Diego,CA</p>
//                 </div>
//                 <div className='p-1 mt-2'>
//                     <h3 className='text-xs pb-2 text-gray-400 font-normal'>TIMEZONE</h3>
//                     <button className='text-sm font-medium w-full border rounded-lg mx-auto p-1 bg-gray-100 text-start'><span className='p-2 font-normal text-2xl'>+</span>Add timezone</button>
//                 </div>
//                 <div className='p-1 mt-2'>
//                     <h3 className='text-xs pb-2 text-gray-400 font-normal'>LANGUAGES</h3>
//                     <button className='text-sm font-medium w-full border rounded-lg mx-auto p-1 bg-gray-100 text-start'><span className='p-2 font-normal text-2xl'>+</span>Add languages</button>
//                 </div>
//                 <div className='p-1 mt-2'>
//                     <h3 className='text-xs pb-2 text-gray-400 font-normal'>LINKS</h3>
//                     <div className='flex gap-3'>
//                         <Link to={"#"}>
//                             <LinkedInIcon sx={{ color: "gray" }} />
//                         </Link>
//                         <Link to={"#"}>
//                             <GitHubIcon sx={{ color: "gray" }} />
//                         </Link>
//                         <Link to={"#"}>
//                             <TelegramIcon sx={{ color: "gray" }} />
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ProfileDetail

import React from 'react'
import ProfileImage from "../../../assets/Logo/ProfileImage.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import {
    ArrowForward,
    LinkedIn,
    GitHub,
    Telegram,
    Add,
  } from "@mui/icons-material";

const ProfileDetail = () => {
    return (
      <div className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-[400px]">
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
            <h2 className="text-xl font-semibold">Matt Bowers</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">@mattbowers</p>
          <button className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center">
            Get in touch
            <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
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
              <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-xs">
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
              Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque
              convallis quam feugiat non viverra massa fringilla.
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
            <h3 className="font-normal mb-2 text-sm text-gray-500">LOCATION</h3>
            <div className="flex items-center">
              <PlaceOutlinedIcon
                className="text-gray-400 mr-1"
                fontSize="small"
              />
              <p className='text-sm'>San Diego, CA</p>
            </div>
          </div>

          <div className="mb-4 max-w-sm">
            <h3 className="font-normal mb-2 text-sm text-gray-500">TIMEZONE</h3>
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
    );
}

export default ProfileDetail
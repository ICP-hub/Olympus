import React from 'react'
import { profile } from '../jsondata/data/profileData';
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

const GeneralDetails = () => {
    const {profiledetails}=profile
  return (
    <>
        <div className="my-4">
            <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
            {profiledetails.user.general.email.label}
            </h3>
            <div className="flex items-center">
              <p className="mr-2 text-sm"> {profiledetails.user.general.email.value}</p>
              <VerifiedIcon
                className="text-blue-500 mr-2 w-2 h-2"
                fontSize="small"
              />
              <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-xs">
              {profiledetails.user.general.hidden}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
            {profiledetails.user.general.tagline.label}
            </h3>
            <p className="text-sm">{profiledetails.user.general.tagline.value}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
              {profiledetails.user.general.about.label}
            </h3>
            <p className="text-sm">
            {profiledetails.user.general.about.value}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-normal mb-2 text-xs text-gray-500">
            {profiledetails.user.general.interests.label}
            </h3>
            <div className="flex space-x-2">
              <span className="bg-white border borer-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
              {profiledetails.user.general.interests.interest1}
              </span>
              <span className="bg-white border borer-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
              {profiledetails.user.general.interests.interest2}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="mb-2 text-xs text-gray-500">{profiledetails.user.general.location.label}</h3>
            <div className="flex items-center">
              <PlaceOutlinedIcon
                className="text-gray-400 mr-1"
                fontSize="small"
              />
              <p className='text-sm'>{profiledetails.user.general.location.value}</p>
            </div>
          </div>

          <div className="mb-4 max-w-sm">
            <h3 className="mb-2 text-xs text-gray-500">{profiledetails.user.general.timezone.label}</h3>
            <button className="bg-gray-100 hover:bg-gray-200 text-sm w-full px-3 py-2 rounded border border-gray-200 text-left flex items-center">
              <Add fontSize="small" className="mr-2" />
              <span>{profiledetails.user.general.timezone.button.label} </span>
            </button>
          </div>

          <div className="mb-4 max-w-sm">
            <h3 className="mb-2 text-xs text-gray-500">
            {profiledetails.user.general.language.label}
            </h3>
            <button className="bg-gray-100 hover:bg-gray-200 text-sm w-full px-3 py-2 rounded border border-gray-200 text-left flex items-center">
              <Add fontSize="small" className="mr-1 inline-block" />
              {profiledetails.user.general.language.button.label}
            </button>
          </div>

          <div>
            <h3 className="mb-2 text-xs text-gray-500">{profiledetails.user.links.label}</h3>
            <div className="flex space-x-2">
              <LinkedIn className="text-gray-400 hover:text-gray-600 cursor-pointer" />
              <GitHub className="text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Telegram className="text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
    </>
  )
}

export default GeneralDetails
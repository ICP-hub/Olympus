import React from 'react';
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import TriciaProfile from "../../../../assets/Logo/TriciaProfile.png";
import BillyProfile from "../../../../assets/Logo/BillyProfile.png";
import DavidProfile from "../../../../assets/Logo/DavidProfile.png";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { PersonAdd, HelpOutline, ArrowDropDown, Delete, Edit } from '@mui/icons-material';

const TeamMember = ({ name, username, role, status, avatar }) => (
  <div className="flex items-center py-4 px-6 border-b border-gray-200 last:border-b-0">
    <div className="w-1/2 flex items-center">
      <input type="checkbox" className="mr-4 h-5 w-5 rounded-md bg-[#F8FAFC] border border-[#CDD5DF] text-blue-600 focus:ring-blue-500" />
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full mr-4" />
      <div>
        <p className="font-medium text-[#121926]">{name}</p>
        <p className="text-sm text-gray-500">{username}</p>
      </div>
    </div>
    <div className="w-1/4 text-gray-600">{role}</div>
    <div className="w-1/4 flex items-center justify-between">
      <span className={`px-2 py-1 rounded text-sm font-medium ${
        status === 'Active' ? 'bg-[#ecfdf3da] rounded-md border-2 border-[#6ceda0] text-green-800' : 'bg-[#FFFAEB] border-2 border-[#FEDF89] text-[#B54708]'
      }`}>
        {status === 'Active' && '• '}{status}
      </span>
      <div className="flex items-center space-x-2">
        <button className="text-gray-400 hover:text-gray-600">
          <Delete fontSize="small" />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <Edit fontSize="small" />
        </button>
      </div>
    </div>
  </div>
);

function TeamSection() {
  return (
    <div className="bg-white  overflow-hidden">
      {/* Tabs */}
      

      <div className="p-6">
        <div className="flex justify-end mb-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center">
            <PersonAdd className="mr-2" fontSize="small" />
            Invite members
          </button>
        </div>

        <div className="rounded-lg overflow-hidden border-2 border-gray-100">
          <div className="flex items-center py-3 px-6 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-700">
            <div className="w-1/2 flex items-center">
              <span className="ml-10">Name</span>
            </div>
            <div className="w-1/4 flex items-center">
              Role
              <HelpOutline fontSize="small" className="ml-1 text-gray-400" />
            </div>
            <div className="w-1/4 flex items-center justify-between pr-8">
              Status
            </div>
          </div>

          <div>
            <TeamMember
              name="Matt Bowers"
              username="@mattbowers"
              role="Founder & CEO"
              status="Active"
              avatar={ProfileImage}
            />
            <TeamMember
              name="Tricia Renner"
              username="@triciarenner"
              role="Co-founder, CTO"
              status="Active"
              avatar={TriciaProfile}
            />
            <TeamMember
              name="Billy Aufderhar"
              username="@billyaufderhar"
              role="Marketing Lead"
              status="Active"
              avatar={BillyProfile}
            />
            <TeamMember
              name="David Wilkinson"
              username="@davidw"
              role="Backend Developer"
              status="Pending"
              avatar={DavidProfile}
            />
          </div>
        </div>
      </div>

   
    </div>
  );
}

export default TeamSection;
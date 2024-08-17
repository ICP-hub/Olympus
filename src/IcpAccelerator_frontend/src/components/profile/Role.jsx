import React, { useEffect, useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import mentor from "../../../assets/Logo/mentor.png";
import talent from "../../../assets/Logo/talent.png";
import founder from "../../../assets/Logo/founder.png";
import Avatar3 from "../../../assets/Logo/Avatar3.png";
import ProfileImage from "../../../assets/Logo/ProfileImage.png";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

import { animatedLeftSvgIcon, animatedRightSvgIcon, userPlusIcon } from '../Utils/Data/SvgData';
import { profile } from '../jsondata/data/profileData';
import { useSelector } from 'react-redux';
import Modal1 from '../Modals/ProjectModal/Modal1';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full text-left py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-medium">{question}</span>
        {isOpen ? (
          <RemoveCircleOutlineOutlinedIcon className="text-[#9AA4B2]" />
        ) : (
          <AddCircleOutlineOutlinedIcon className="text-[#9AA4B2]" />
        )}
      </button>
      {isOpen && (
        <p className="mt-2 text-[#4B5565] font-normal text-sm pb-4">{answer}</p>
      )}
    </div>
  );
};

const FAQ = () => {
  const { roles } = profile

  return (
    <div className="mt-14 text-[#121926] text-[18px] font-medium border-gray-200">
      {roles.faq.questions.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

const Role = () => {
  const { roles } = profile
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const userFullData = useSelector((currState) => currState.userData.data.Ok);

  const userleftRole = "mentor"; 
  const userrightRole = ""; 

  const getLeftRoleSvg = () => {
    switch (userleftRole) {
      case 'mentor':
        return (
          <svg
            width="214"
            height="100"
            viewBox="0 0 199 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="neon-effect neon-red text-red-500"
          >
            <path
              d="M198 0V46.6316C198 59.8864 187.255 70.6316 174 70.6316H25C11.7452 70.6316 1 81.3768 1 94.6316V122"
              className="stroke-current"
              strokeWidth="2"
            />
          </svg>
        );
      case 'founder':
        return (
          <svg
            width="214"
            height="100"
            viewBox="0 0 199 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="neon-effect neon-blue text-blue-500"
          >
            <path
              d="M198 0V46.6316C198 59.8864 187.255 70.6316 174 70.6316H25C11.7452 70.6316 1 81.3768 1 94.6316V122"
              className="stroke-current"
              strokeWidth="2"
            />
          </svg>
        );
      case 'investor':
        return (
          <svg
            width="214"
            height="100"
            viewBox="0 0 199 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="neon-effect neon-green text-green-500"
          >
            <path
              d="M198 0V46.6316C198 59.8864 187.255 70.6316 174 70.6316H25C11.7452 70.6316 1 81.3768 1 94.6316V122"
              className="stroke-current"
              strokeWidth="2"
            />
          </svg>
        );
      case 'talent':
        return (
          <svg
            width="214"
            height="100"
            viewBox="0 0 199 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="neon-effect neon-yellow text-yellow-500"
          >
            <path
              d="M198 0V46.6316C198 59.8864 187.255 70.6316 174 70.6316H25C11.7452 70.6316 1 81.3768 1 94.6316V122"
              className="stroke-current"
              strokeWidth="2"
            />
          </svg>
        );
      case 'user':
      default:
        return (
          <svg width="214" height="100" viewBox="0 0 199 122" fill="none" xmlns="http://www.w3.org/2000/svg"  className="neon-effect neon-gray text-[E3E8EF]">
            <path d="M198 0V46.6316C198 59.8864 187.255 70.6316 174 70.6316H25C11.7452 70.6316 1 81.3768 1 94.6316V122" stroke="#E3E8EF" strokeWidth="2"/>
          </svg>
        );
    }
  };

  const getRightRoleSvg = () => {
    switch (userrightRole) {
      case 'mentor':
        return (
          <svg
            width="214"
            height="100"
            viewBox="0 0 214 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="neon-effect neon-red text-red-500"
          >
            <path
              d="M1 0V46.6316C1 59.8864 11.7452 70.6316 25 70.6316H189C202.255 70.6316 213 81.3768 213 94.6316V122"
              className="stroke-current"
              strokeWidth="2"
            />
          </svg>
        );
      case 'founder':
        return (
          <svg
            width="214"
            height="100"
            viewBox="0 0 214 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="neon-effect neon-blue text-blue-500"
          >
            <path
              d="M1 0V46.6316C1 59.8864 11.7452 70.6316 25 70.6316H189C202.255 70.6316 213 81.3768 213 94.6316V122"
              className="stroke-current"
              strokeWidth="2"
            />
          </svg>
        );
      case 'investor':
        return (
          <svg
            width="214"
            height="100"
            viewBox="0 0 214 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="neon-effect neon-green text-green-500"
          >
            <path
              d="M1 0V46.6316C1 59.8864 11.7452 70.6316 25 70.6316H189C202.255 70.6316 213 81.3768 213 94.6316V122"
              className="stroke-current"
              strokeWidth="2"
            />
          </svg>
        );
      case 'talent':
        return (
          <svg
            width="214"
            height="100"
            viewBox="0 0 214 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="neon-effect neon-yellow text-yellow-500"
          >
            <path
              d="M1 0V46.6316C1 59.8864 11.7452 70.6316 25 70.6316H189C202.255 70.6316 213 81.3768 213 94.6316V122"
              className="stroke-current"
              strokeWidth="2"
            />
          </svg>
        );
      case 'user':
      default:
        return (
          <svg width="214" height="100" viewBox="0 0 214 122" fill="none" xmlns="http://www.w3.org/2000/svg"   className="neon-effect neon-gray text-[E3E8EF]">
            <path d="M1 0V46.6316C1 59.8864 11.7452 70.6316 25 70.6316H189C202.255 70.6316 213 81.3768 213 94.6316V122" stroke="#E3E8EF" strokeWidth="2"/>
          </svg>
        );
    }
  };
  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-center items-center w-full mt-[2%]">
          <div className="border-2 rounded-lg pb-5 text-center min-w-[280px] max-w-[350px]">
            <div className="w-full bg-[#EEF2F6] rounded-l-xl rounded-r-full h-1.5 mb-4 dark:bg-[#EEF2F6]">
              <div className="relative h-1 bg-gray-200">
                <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-gray-200 rounded-full mb-4">
                <img
                  src={userFullData?.profile_picture[0]}
                  alt="Matt Bowers"
                  className="w-20 h-20 mx-auto rounded-full"
                />
              </div>
            </div>
            <div className="mb-1 text-center">
              <button className="text-[#026AA2] border rounded-md text-xs p-1 font-semibold bg-[#F0F9FF]">
                {roles.profile.roles.label}
              </button>
            </div>
            <div className="flex flex-col justify-center items-center mb-3">
              <h2 className="font-bold text-lg">
                <span>
                  <VerifiedIcon sx={{ fontSize: "medium", color: "#155EEF" }} />
                </span>
                {userFullData?.full_name}
              </h2>
              <p> {userFullData?.openchat_username[0]}</p>
            </div>
            <div className="flex justify-center items-center">
              <p className="font-normal">
                {roles.profile.roles.role} <span className="font-medium text-sm">{roles.profile.roles.value}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          {/* <div>{animatedLeftSvgIcon}</div> */}
          {/* Render the Left SVG */}
              <div>{getLeftRoleSvg()}</div>

              {/* Render the Right SVG */}
              <div>{getRightRoleSvg()}</div>
       
        </div>
        <div className="flex justify-around items-center gap-[12%]">
          <div className="border-2 rounded-lg text-center min-w-[220px] max-w-[350px]">
            <div className="p-3 flex justify-center mt-5">
              <AvatarGroup max={4}>
                <Avatar alt="Remy Sharp" src={mentor} />
                <Avatar alt="Travis Howard" src={talent} />
                <Avatar alt="Cindy Baker" src={Avatar3} />
                <Avatar alt="Agnes Walker" src={founder} />
              </AvatarGroup>
            </div>
            <div className="mt-5 px-5">
              <p className="max-w-[250px]">
                {roles.description1}
              </p>
            </div>
            <div className="my-5 px-5 flex items-center">
              <button
                onClick={() => setRoleModalOpen(!roleModalOpen)}
                className="border flex gap-2 justify-center rounded-md bg-[#155EEF] p-2 font-medium w-full text-white"
              >
                <span>{userPlusIcon}</span>{roles.addrole}
              </button>
            </div>
          </div>

          <div className="border-2 rounded-lg text-center min-w-[220px] max-w-[350px]">
            <div className="p-3 flex justify-center mt-5">
              <AvatarGroup max={4}>
                <Avatar alt="Remy Sharp" src={mentor} />
                <Avatar alt="Travis Howard" src={talent} />
                <Avatar alt="Cindy Baker" src={Avatar3} />
                <Avatar alt="Agnes Walker" src={founder} />
              </AvatarGroup>
            </div>
            <div className="mt-5 px-5">
              <p className="max-w-[250px]">
                {roles.description2}
              </p>
            </div>
            <div className="my-5 px-5 flex items-center">
              <button
                onClick={() => setRoleModalOpen(true)}
                className="border flex gap-2 justify-center rounded-md bg-[#155EEF] p-2 font-medium w-full text-white"
              >
                <span>{userPlusIcon}</span>{roles.addrole}
              </button>
            </div>
          </div>
        </div>
        <FAQ />
      </div>

      {roleModalOpen && <Modal1 isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} />}
    </>
  );
};

export default Role;

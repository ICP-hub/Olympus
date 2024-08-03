import React, { useState } from 'react'
import VerifiedIcon from '@mui/icons-material/Verified';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import awtar from "../../../assets/images/icons/gitHubicon.png"
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import Modal1 from '../Modals/Project Modal/modal1';
import { animatedLeftSvgIcon, animatedRightSvgIcon, userPlusIcon } from '../Utils/Data/SvgData';
import talent from "../../../assets/Logo/talent.png";
import mentor from "../../../assets/Logo/mentor.png";
import founder from "../../../assets/Logo/founder.png";
import Avatar3 from "../../../assets/Logo/Avatar3.png";
import ProfileImage from "../../../assets/Logo/ProfileImage.png";



const Role = () => {
    const [role, setRole] = useState(false)
    return (
      <div className="flex flex-col">
        <div className="flex justify-center items-center  w-full  mt-[2%] ">
          <div className="border-2 rounded-lg pb-5 text-center min-w-[280px] max-w-[350px] ">
            <div className="w-full  bg-[#EEF2F6] rounded-l-xl rounded-r-full h-1.5 mb-4 dark:bg-[#EEF2F6]">
              {/* <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div> */}
              <div className="relative h-1 bg-gray-200">
                <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-gray-200  rounded-full  mb-4">
                <img
                  src={ProfileImage}
                  alt="Matt Bowers"
                  className="w-20 h-20 mx-auto rounded-full"
                />
              </div>
            </div>
            <div className="mb-1 text-center">
              <button className="text-[#026AA2] border rounded-md text-xs p-1 font-semibold bg-[#F0F9FF] ">
                OLYMPIAN
              </button>
            </div>
            <div className="flex flex-col justify-center items-center mb-3">
              <h2 className="font-bold text-lg">
                <span>
                  <VerifiedIcon sx={{ fontSize: "medium", color: "#155EEF" }} />
                </span>
                Matt Bowers
              </h2>
              <p className="">@mattbowers</p>
            </div>
            <div className="flex justify-center items-center">
              <p className="font-normal">
                Roles: <span className="font-medium text-sm">0/2</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <div className="">{animatedLeftSvgIcon} </div>
          <div className="">{animatedRightSvgIcon} </div>
        </div>
        <div className="flex justify-around items-center gap-[12%] ">
          <div className="border-2 rounded-lg text-center min-w-[220px] max-w-[350px] ">
            <div className="p-3 flex justify-center mt-5 ">
              <AvatarGroup max={4}>
                <Avatar alt="Remy Sharp" src={mentor} />
                <Avatar alt="Travis Howard" src={talent} />
                <Avatar alt="Cindy Baker" src={Avatar3} />
                <Avatar alt="Agnes Walker" src={founder} />
              </AvatarGroup>
            </div>
            <div className="mt-5 px-5">
              <p className="max-w-[250px] ">
                Extend your profile with roles to seize new opportunites
              </p>
            </div>
            <div className="my-5  px-5 flex items-center ">
              <button
                onClick={() => setRole(true)}
                className="border flex gap-2 justify-center rounded-md bg-[#155EEF] p-2  font-medium w-full text-white"
              >
                <span className="">{userPlusIcon} </span>Add a role{" "}
              </button>
            </div>
            {role === true && <Modal1 isOpen={role} onClose={setRole} />}
          </div>
          <div className="border-2 rounded-lg text-center min-w-[220px] max-w-[350px] ">
            <div className="p-3 flex justify-center mt-5 ">
              <AvatarGroup max={4}>
                <Avatar alt="Remy Sharp" src={mentor} />
                <Avatar alt="Travis Howard" src={talent} />
                <Avatar alt="Cindy Baker" src={Avatar3} />
                <Avatar alt="Agnes Walker" src={founder} />
              </AvatarGroup>
            </div>
            <div className="mt-5 px-5">
              <p className="max-w-[250px]">
                Extend your profile with roles to seize new opportunites
              </p>
            </div>
            <div className="my-5  px-5 flex items-center">
              <button
                onClick={() => setRole(true)}
                className="border flex gap-2 justify-center  rounded-md bg-[#155EEF] p-2  font-medium w-full text-white"
              >
                <span className="">{userPlusIcon} </span>Add a role{" "}
              </button>
            </div>
            {role === true && <Modal1 isOpen={role} onClose={setRole} />}
          </div>
        </div>
      </div>
    );
}

export default Role
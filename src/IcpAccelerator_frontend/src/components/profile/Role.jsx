import React, { useEffect, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import mentor from "../../../assets/Logo/mentor.png";
import user from "../../../assets/Logo/talent.png";
import project from "../../../assets/Logo/founder.png";
import vc from "../../../assets/Logo/Avatar3.png";
import ProfileImage from "../../../assets/Logo/ProfileImage.png";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { useNavigate } from "react-router-dom";
// import RoleProfileCard from "./RoleProfileCard";

import {
  animatedLeftSvgIcon,
  animatedRightSvgIcon,
  userPlusIcon,
} from "../Utils/Data/SvgData";
import { profile } from "../Utils/jsondata/data/profileData";
import { useDispatch, useSelector } from "react-redux";
import Modal1 from "../Modals/ProjectModal/Modal1";
import {
  getCurrentRoleStatusFailureHandler,
  setCurrentActiveRole,
  setCurrentRoleStatus,
} from "../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import RoleProfileCard from "./RoleProfileCard";
import ProfileRoleNoDataCard from "../Common/ProfileRoleNoDataCard";


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
  const { roles } = profile;

  return (
    <div className="mt-14 text-[#121926] text-[18px] font-medium border-gray-200">
      {roles.faq.questions.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

const Role = () => {
  const { roles } = profile;
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
 
  const roledata = [
    {
      name: 'mentor',
      Mentor: true,
      Investor: true,
      Project: false,
       image:mentor
    },
    {
      name: 'vc',
      Mentor: true,
      Investor: true,
      Project: false,
      image:vc
    },
    {
      name: 'project',
      Mentor: false,
      Investor: false,
      Project: true,
      image:project
    },
    {
      name: 'user',
      Mentor:true,
      Investor:true,
      Project: true,
      image:user
    }
  ];
  
  

function mergeData(backendData, additionalData) {
    return backendData?.map(item => {
        const additionalInfo = additionalData?.find(data => data?.name?.toLowerCase() === item?.name?.toLowerCase());
        return additionalInfo ? { ...item, ...additionalInfo } : item;
    });
}

const mergedData = mergeData(userCurrentRoleStatus, roledata);
// console.log('mergedData',mergedData)

  const getRoleSvg = (status, side) => {
    const colors = {
      mentor: { neon: "neon-red", text: "text-red-500" },
      project: { neon: "neon-blue", text: "text-blue-500" },
      investor: { neon: "neon-green", text: "text-green-500" },
      user: { neon: "neon-yellow", text: "text-yellow-500" },
      user: { neon: "neon-gray", text: "text-[#E3E8EF]" }
    };
  
    const color = colors[status] || colors.user;
  
    const pathD = side === "left"
      ? "M198 0V46.6316C198 59.8864 187.255 70.6316 174 70.6316H25C11.7452 70.6316 1 81.3768 1 94.6316V122"
      : "M1 0V46.6316C1 59.8864 11.7452 70.6316 25 70.6316H189C202.255 70.6316 213 81.3768 213 94.6316V122";
  
    const svgClass = side === "left" && status !== "investor" && status !== "user"
      ? `neon-effect ${color.neon} ${color.text}`
      : side === "right" && status === "investor"
      ? `neon-effect ${color.neon} ${color.text}`
      : "neon-effect neon-gray text-[#E3E8EF]";
  
    return (
      <svg
        width="214"
        height="100"
        viewBox="0 0 214 122"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={svgClass}
      >
        <path
          d={pathD}
          className="stroke-current"
          stroke={side === "left" ? (status === "user" ? "#E3E8EF" : "currentColor") : "#E3E8EF"}
          strokeWidth="2"
        />
      </svg>
    );
  };
  
  const renderRoleSvgsOnce = (roles) => {
    let leftSideRendered = false;
    let rightSideRendered = false;
  
    return (
      <div className="flex justify-center gap-4">
        {roles.some(role => role.name === "mentor" || role.name === "project") && !leftSideRendered && (
          <>
            <div>{getRoleSvg(roles.find(role => role.name === "mentor" || role.name === "project").name, 'left')}</div>
            <div>{getRoleSvg("user", 'right')}</div>
            {leftSideRendered = true}
          </>
        )}
  
        {roles.some(role => role.name === "investor") && !rightSideRendered && (
          <>
            <div>{getRoleSvg("user", 'left')}</div>
            <div>{getRoleSvg(roles.find(role => role.name === "investor").name, 'right')}</div>
            {rightSideRendered = true}
          </>
        )}
      </div>
    );
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
                  alt="Profile"
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
              <p>{userFullData?.openchat_username[0]}</p>
            </div>
            <div className="flex justify-center items-center">
              <p className="font-normal">
                {roles.profile.roles.role}{" "}
                <span className="font-medium text-sm">
                  {userCurrentRoleStatus &&
                    userCurrentRoleStatus.map((role) =>
                      role?.approval_status === "approved" ? (
                        <button className="text-[#026AA2] border rounded-md text-xs p-1 mx-1 font-semibold bg-[#F0F9FF] capitalize"key={role.name}>
                          {role?.name}
                        </button>
                      ) : (
                        ""
                      )
                    )}
                </span>
              </p>
            </div>
          </div>
        </div>
        {userCurrentRoleStatus && userCurrentRoleStatus.length > 0 && (
    <div>{renderRoleSvgsOnce
      (userCurrentRoleStatus)}</div>
  )}
 <div className="flex justify-around items-center gap-[12%]">
  {mergedData &&
    (() => {
      let cardsShown = 0; // Counter to keep track of the number of cards shown
      const projectRole = mergedData.find((r) => r.name === "project");
      const mentorRole = mergedData.find((r) => r.name === "mentor");
      const vcRole = mergedData.find((r) => r.name === "vc");

      // Create an array to store the elements to be rendered
      const elements = [];

      // Condition 1: When all roles have 'default' status
      if (
        projectRole?.approval_status === "default" &&
        mentorRole?.approval_status === "default" &&
        vcRole?.approval_status === "default"
      ) {
        for (let i = 0; i < 2 && cardsShown < 2; i++) {
          elements.push(
            <div
              className="border-2 rounded-lg text-center min-w-[220px] max-w-[350px]"
              key={`default-custom-card-${i}`}
            >
              <div className="p-3 flex justify-center mt-5">
                <AvatarGroup max={4}>
                  <Avatar alt="Mentor" src={mentor} />
                  <Avatar alt="user" src={user} />
                  <Avatar alt="vc" src={vc} />
                  <Avatar alt="project" src={project} />
                </AvatarGroup>
              </div>
              <div className="mt-5 px-5">
                <p className="max-w-[250px]">{roles.description1}</p>
              </div>
              <div className="my-5 px-5 flex items-center">
                <button
                  onClick={() => setRoleModalOpen(!roleModalOpen)}
                  className="border flex gap-2 justify-center rounded-md bg-[#155EEF] p-2 font-medium w-full text-white"
                >
                  <span>{userPlusIcon}</span>
                  {roles.addrole}
                </button>
              </div>
            </div>
          );
          cardsShown++;
        }
      }

      // Condition 2: When project is approved and mentor and vc are default, show 'No Data' card
      if (
        projectRole?.approval_status === "approved" &&
        mentorRole?.approval_status === "default" &&
        vcRole?.approval_status === "default"
      ) {
        elements.push(
          <RoleProfileCard key={projectRole.name} role={projectRole.name} image={projectRole.image}/>
        );
        cardsShown++;
        elements.push(
          <ProfileRoleNoDataCard/>
        );
        cardsShown++;
      }

      // Condition 3: When mentor is approved and vc is default
      if (
        mentorRole?.approval_status === "approved" &&
        vcRole?.approval_status === "default"
      ) {
        elements.push(
          <RoleProfileCard key={mentorRole.name} role={mentorRole.name} image={mentorRole.image}/>
        );
        cardsShown++;
        elements.push(
          <div className="border-2 rounded-lg text-center w-3/4 h-60" key="mentor-vc-default-card">
            <div className="p-3 flex justify-center mt-5">
              <AvatarGroup max={4}>
                <Avatar alt="Mentor" src={mentor} />
                <Avatar alt="user" src={user} />
                <Avatar alt="vc" src={vc} />
                <Avatar alt="project" src={project} />
              </AvatarGroup>
            </div>
            <div className="mt-5 px-5">
              <p className="max-w-[250px]">{roles.description1}</p>
            </div>
            <div className="my-5 px-5 flex items-center">
              <button
                onClick={() => setRoleModalOpen(!roleModalOpen)}
                className="border flex gap-2 justify-center rounded-md bg-[#155EEF] p-2 font-medium w-full text-white"
              >
                <span>{userPlusIcon}</span>
                {roles.addrole}
              </button>
            </div>
          </div>
        );
        cardsShown++;
      }

      // Condition 4: When vc is approved, show vc RoleProfileCard and the custom card
      if (
        vcRole?.approval_status === "approved" &&
        mentorRole?.approval_status === "default"
      ) {
        elements.push(
          <RoleProfileCard key={vcRole.name} role={vcRole.name} image={vcRole.image}/>
        );
        cardsShown++;
        elements.push(
          <div className="border-2 rounded-lg text-center w3/4 h-60" key="vc-approved-card">
            <div className="p-3 flex justify-center mt-5">
              <AvatarGroup max={4}>
                <Avatar alt="Mentor" src={mentor} />
                <Avatar alt="user" src={user} />
                <Avatar alt="vc" src={vc} />
                <Avatar alt="project" src={project} />
              </AvatarGroup>
            </div>
            <div className="mt-5 px-5">
              <p className="max-w-[250px]">{roles.description1}</p>
            </div>
            <div className="my-5 px-5 flex items-center">
              <button
                onClick={() => setRoleModalOpen(!roleModalOpen)}
                className="border flex gap-2 justify-center rounded-md bg-[#155EEF] p-2 font-medium w-full text-white"
              >
                <span>{userPlusIcon}</span>
                {roles.addrole}
              </button>
            </div>
          </div>
        );
        cardsShown++;
      }

      // Condition 5: When both mentor and vc are approved, show both RoleProfileCards
      if (
        mentorRole?.approval_status === "approved" &&
        vcRole?.approval_status === "approved"
      ) {
        elements.push(
          <RoleProfileCard key={mentorRole.name} role={mentorRole.name} image={mentorRole.image}/>
        );
        elements.push(
          <RoleProfileCard key={vcRole.name} role={vcRole.name} image={vcRole.image}/>
        );
        cardsShown ++;
      }
      

      return elements; // Return the array of elements to be rendered
    })()}
</div>







        <FAQ />
      </div>
      {roleModalOpen && (
        <Modal1
          isOpen={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
        />
      )}
    </>
  );
};

export default Role;

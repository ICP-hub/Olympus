import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import { Profile2 } from "../../Utils/AdminData/SvgData";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { useLocation } from "react-router-dom";
import UserProfile from "./UserProfile";
import MentorProfile from "./MentorProfile";
import InvestorProfile from "./InvestorProfile";
import Projectdetails from "../Projectdetails";
import founder from "../../../../../IcpAccelerator_frontend/assets/images/founder.png";
import proj from "../../../../../IcpAccelerator_frontend/assets/images/hub.png";
import vc from "../../../../../IcpAccelerator_frontend/assets/images/vc.png";
import mentor from "../../../../../IcpAccelerator_frontend/assets/images/mentor.png";

const UserAllProfile = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const location = useLocation();
  const CurrentUserPrincipal = location.state;

  // console.log("CurrentUserPrincipal", CurrentUserPrincipal);
  const [currentRole, setCurrentRole] = useState("user");
  const [userData, setUserData] = useState(null);

  const roleImages = {
    user: proj,
    investor: vc,
    mentor: mentor,
    project: founder,
  };

  useEffect(() => {
    if (CurrentUserPrincipal) {
      const getAllRequestOfUser = async () => {
        try {
          const convertedPrincipal = await Principal.fromText(
            CurrentUserPrincipal
          );
          const getAll = await actor.get_user_all_data(convertedPrincipal);
          // console.log("gotchaaa data =>", getAll);
          setUserData(getAll);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      getAllRequestOfUser();
    }
  }, [CurrentUserPrincipal, actor]);

  const handleRoleChange = (role) => {
    setCurrentRole(role);
  };

  const roleToIndexMap = {
    user: 0,
    investor: 1,
    mentor: 2,
    project: 3,
  };

  return (
    <div className="w-full px-4">
      <div className="flex flex-row justify-between mt-10 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-black to-gray-800 text-transparent bg-clip-text">
          {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Profile
        </h1>
        <div className="flex text-white text-sm flex-row font-semibold h-auto md:w-[28rem] mr-2 items-center bg-customBlue rounded-lg py-2 px-3 justify-between">
          <div className="md:block hidden">{Profile2}</div>
          <p className="hidden md:block">Change Profile</p>
          {["user", "project", "mentor", "investor"].map((role) => {
            const index = roleToIndexMap[role];
            const isRoleActive =
              userData && userData[index] && userData[index].length > 0;
            return (
              <div
                key={role}
                className={`flex items-center cursor-pointer mx-2 ${
                  isRoleActive ? "opacity-100" : "opacity-50 cursor-not-allowed"
                } ${
                  currentRole === role
                    ? "text-md px-2 pb-[6px] font-bold text-[#0342A7]"
                    : "bg-transparent"
                }`}
                onClick={
                  isRoleActive ? () => handleRoleChange(role) : undefined
                }
              >
                {/* {role.charAt(0).toUpperCase() + role.slice(1)} */}
                <img
                  src={roleImages[role]}
                  alt={role}
                  className="w-6 h-6 md:hidden"
                />
                <span
                  className={`md:block hidden ${
                    currentRole === role ? "font-bold underline" : ""
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {currentRole === "user" && userData && (
        <UserProfile userData={userData[0]} Allrole={userData[4]} />
      )}
      {currentRole === "investor" && userData && userData[1] && (
        <InvestorProfile
          userData={userData[1]}
          Allrole={userData[4]}
          principal={CurrentUserPrincipal}
        />
      )}
      {currentRole === "mentor" && userData && userData[2] && (
        <MentorProfile
          userData={userData[2]}
          Allrole={userData[4]}
          principal={CurrentUserPrincipal}
        />
      )}
      {currentRole === "project" && userData && userData[3] && (
        <Projectdetails
          userData={userData[3]}
          Allrole={userData[4]}
          principal={CurrentUserPrincipal}
        />
      )}
    </div>
  );
};

export default UserAllProfile;

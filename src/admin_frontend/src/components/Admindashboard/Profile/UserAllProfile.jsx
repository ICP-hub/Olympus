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

const UserAllProfile = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const location = useLocation();
  const CurrentUserPrincipal = location.state;
  const [currentRole, setCurrentRole] = useState("user");
  const [userData, setUserData] = useState(null);

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
    <div className="w-full px-[4%]">
      <div className="flex flex-row justify-between mb-3">
        <h1 className="md:text-3xl text-[20px] font-bold bg-black text-transparent bg-clip-text">
          {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Profile
        </h1>
        <div className="flex text-white md:text-md text-xs flex-row font-bold h-auto md:w-[24rem] w-[9.5rem] mr-2 items-center bg-customBlue rounded-lg py-2 px-3 justify-between">
          <div className="md:block hidden">{Profile2}</div>
          <p className="md:text-md text-xs font-bold md:block hidden">
            Change Profile
          </p>
          {["user", "investor", "mentor", "project"].map((role) => {
            const index = roleToIndexMap[role];
            const isRoleActive =
              userData && userData[index] && userData[index].length > 0;
            return (
              <div
                key={role}
                className={`${
                  isRoleActive
                    ? "cursor-pointer text-white"
                    : "cursor-not-allowed text-gray-400"
                } ${currentRole === role ? "underline" : ""}`}
                onClick={
                  isRoleActive ? () => handleRoleChange(role) : undefined
                }
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
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

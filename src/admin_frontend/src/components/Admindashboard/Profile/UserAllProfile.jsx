import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import { Profile2, penSvg } from "../../Utils/AdminData/SvgData";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
    <div className="w-full px-[4%]">
      <div className="mt-10 mb-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center">
          <div className="w-full md:flex md:flex-1 md:items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-800 text-transparent bg-clip-text md:block">
              {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}{" "}
              Profile
            </h1>
            <div className="hidden md:flex text-white text-xs font-semibold h-auto items-center bg-customBlue rounded-lg py-4 px-3 justify-start">
              {["user", "project", "mentor", "investor"].map((role) => {
                const index = roleToIndexMap[role];
                const isRoleActive =
                  userData && userData[index] && userData[index].length > 0;
                return (
                  <div
                    key={role}
                    className={`flex items-center cursor-pointer mx-2 ${
                      isRoleActive
                        ? "opacity-100"
                        : "opacity-50 cursor-not-allowed"
                    } ${
                      currentRole === role
                        ? "text-sm font-bold text-[#0342A7]"
                        : "bg-transparent"
                    }`}
                    onClick={
                      isRoleActive ? () => handleRoleChange(role) : undefined
                    }
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </div>
                );
              })}
            </div>
            <h1 className="border-transparent text-transparent hidden hover:border-[#87888d] hover:cursor-pointer hover:shadow-md md:block p-4 rounded-md">
              {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}{" "}
              Profile
            </h1>
          </div>

          <div className="border-transparent hidden hover:border-[#87888d] hover:cursor-pointer hover:shadow-md md:block p-4 rounded-md">
            {penSvg}
          </div>


          
          <div className="md:hidden flex justify-between items-center w-full mt-2">
    <button onClick={toggleModal} className="p-3 text-3xl">☰</button>
    <div className="border-transparent  hover:border-[#87888d] hover:cursor-pointer hover:shadow-md md:hidden block p-4 rounded-md">
            {penSvg}
          </div>
</div>

        </div>



        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="absolute w-[192px] top-[24%] md:hidden block left-[43px] bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
              {/* <h2 className="text-xl font-bold">Select Role</h2> */}
              {["user", "project", "mentor", "investor"].map((role) => (
                <div
                  key={role}
                  // className="p-2 text-lg cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    handleRoleChange(role);
                    toggleModal();
                  }}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
              ))}
              <button
                className="border-[#9C9C9C] w-[170px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                onClick={toggleModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
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

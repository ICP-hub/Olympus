import React, { useEffect, useState } from "react";
import founder from "../../../../IcpAccelerator_frontend/assets/images/founder.png";
import proj from "../../../../IcpAccelerator_frontend/assets/images/hub.png";
import vc from "../../../../IcpAccelerator_frontend/assets/images/vc.png";
import mentor from "../../../../IcpAccelerator_frontend/assets/images/mentor.png";
import girl from "../../../../IcpAccelerator_frontend/assets/images/girl.jpeg";
import { useSelector } from "react-redux";
// import AnnouncementCard from "../../../../IcpAccelerator_frontend/src/components/Dashboard/AnnouncementCard";
import TopProjects from "./Top/TopProjects";
import TopMentors from "./Top/TopMentors";
import TopInvestors from "./Top/TopInvestors";
import { useNavigate } from "react-router-dom";
import RejectModal from "../models/RejectModal";
import AcceptModal from "../models/AcceptModal";
import { bellSvg } from "../Utils/AdminData/SvgData";
import pending from "../../../assets/image/pending.png";
import { userSvg } from "../Utils/AdminData/SvgData";

const AdminDashboard = () => {
  const principal = useSelector((currState) => currState.internet.principal);
  const mentorCount = useSelector((currState) => currState.count.mentor_count);
  const vcCount = useSelector((currState) => currState.count.vc_count);
  const projectCount = useSelector(
    (currState) => currState.count.project_count
  );
  const totalUser = useSelector((currState) => currState.count.total_user);
  const onlyUser = useSelector((currState) => currState.count.only_user);
  const cycles = useSelector((currState) => currState.cyclePending.cycles);
  const totalPending = useSelector(
    (currState) => currState.totpending.total_Pending
  );
  const allNotification = useSelector(
    (currState) => currState.notification.data
  );
  const totalLive = useSelector((currState) => currState.totalLive.total_Live);
  const totalUpdate = useSelector(
    (currState) => currState.updateProfile.update_Profile
  );
  // console.log("totalUpdate >>>>>>>>>>>>>>>", totalUpdate);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const toggleAcceptModal = () => setIsAcceptModalOpen(!isAcceptModalOpen);
  const toggleRejectModal = () => setIsRejectModalOpen(!isRejectModalOpen);
  const [currentNotificationForAccept, setCurrentNotificationForAccept] =
    useState(null);
  const [currentNotificationForReject, setCurrentNotificationForReject] =
    useState(null);

  // console.log("allNotification in dahboard", allNotification);
  const navigate = useNavigate();

  return (
    <div className="px-[4%] py-[4%] w-full h-auto flex md:flex-row flex-col justify-between md:space-x-6">
      <div className="flex flex-col md:w-9/12 w-full">
        <div className="w-full flex md:flex-row flex-col justify-between">
          <div className="w-full  flex md:flex-row flex-col  gap-4">
            <div className="rounded-[2rem] flex justify-center flex-col h-[200px] w-full bg-[#B9C0F2] drop-shadow-xl border-2">
              <div className="absolute bottom-0 left-0 w-36 h-40 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-800 ellipse-quarter-left rounded-[2rem]"></div>
              <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-100 to-purple-700 w-28 h-28 ellipse-quarter-right rounded-[2rem]"></div>

              <div className="flex flex-col items-center justify-start font-bold text-lg text-white z-10">
                <p className="flex justify-start">Cycles Pending</p>
                <p className="font-extrabold -[59px] h-[62px] text-white flex justify-center xl:lg:text-5xl text-2xl">
                  {cycles.toLocaleString()}
                </p>
              </div>
            </div>
            <div
              onClick={() => navigate("/live")}
              className="rounded-[2rem] cursor-pointer flex justify-center  flex-col h-[200px] w-full bg-[#B9C0F2] drop-shadow-xl border-2"
            >
              <div className="absolute bottom-0 left-0 w-36 h-40 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-800 ellipse-quarter-left rounded-[2rem]"></div>
              <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-100 to-purple-700 w-28 h-28 ellipse-quarter-right rounded-[2rem]"></div>

              <div className="flex flex-col items-center justify-start font-bold text-lg text-white z-10">
                <p className="flex justify-start">Live Projects</p>
                <p className="font-extrabold -[59px] h-[62px] text-white flex justify-center xl:md:text-5xl text-2xl">
                  {totalLive}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col  w-full md:mt-6  mt-2 justify-between gap-2 md:gap-0 md:space-x-4">
          <div
            className="rounded-[1rem] space-x-2 flex px-4   justify-center  flex-col  w-full  bg-white  drop-shadow-xl border-2 "
            onClick={() => navigate("/request")}
          >
            <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
              <div className="gap-2 flex-row flex items-center w-2/3">
                <img src={pending} alt="pending" className="h-10 w-10" />
                <p className="flex font-semibold justify-between text-sm">
                  Registration Requests
                </p>
              </div>
              <p className="font-extrabold  w-1/3 text-2xl h-[62px] flex  justify-center items-center">
                {totalPending}
              </p>
            </div>
          </div>

          <div
            className="rounded-[1rem] space-x-2 flex px-4   justify-center  flex-col  w-full  bg-white  drop-shadow-xl border-2 "
            // onClick={() => navigate("/notification")}
          >
            <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
              <div className="gap-2 flex-row flex items-center w-2/3">
                {bellSvg}
                <p className="flex font-semibold justify-between text-sm">
                  Updation Requests
                </p>
              </div>
              <p className="font-extrabold  w-1/3 text-2xl h-[62px] flex  justify-center items-center">
                {totalUpdate}
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col  w-full mt-2 justify-between gap-2 md:gap-0 md:space-x-4">
          <div className="rounded-[1rem] px-4 space-x-2 flex  justify-center cursor-pointer  flex-col  w-full  bg-white drop-shadow-xl border-2">
            <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
              <div
                onClick={() => navigate("/alluser")}
                className="gap-2 flex flex-row items-center w-2/3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#007BFF"
                  className="w-10 h-10"
                >
                  <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
                </svg>

                <p className="flex font-semibold justify-start text-sm">
                  All Users
                </p>
              </div>
              <p className="font-extrabold -[59px] w-1/3 h-[62px] flex  text-2xl justify-center items-center">
                {totalUser}
              </p>
            </div>
          </div>

          <div
            className="rounded-[1rem] px-4 space-x-2 flex justify-center  flex-col  w-full  bg-white drop-shadow-xl border-2"
            // onClick={() => navigate("/request")}
          >
            <div className="flex  flex-row  flex-wrap justify-around  font-bold text-lg text-black items-center ">
              <div className="gap-2 flex flex-row items-center w-2/3">
                {userSvg}
                <p className="flex justify-start text-sm">Users</p>
              </div>
              <p className="w-1/3 font-extrabold -[59px] h-[62px] flex  text-2xl justify-center items-center">
                {onlyUser}
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate("/live")}
            className="rounded-[1rem] space-x-2 flex px-4   justify-center cursor-pointer flex-col  w-full  bg-white drop-shadow-xl border-2 "
          >
            <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
              <div className="gap-2 flex-row flex items-center w-2/3">
                <img src={founder} alt="founder" className="h-10 w-10" />
                <p className="flex font-semibold justify-start text-sm">
                  Projects
                </p>
              </div>
              <p className="font-extrabold -[59px] h-[62px] flex  text-2xl justify-center w-1/3 items-center">
                {projectCount}
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col  w-full md:mb-6 mb-2  mt-2 justify-between gap-2 md:gap-0 md:space-x-4 ">
          <div className="rounded-[1rem]  space-x-2 flex px-4  justify-center  flex-col  w-full  bg-white drop-shadow-xl border-2">
            <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
              <div className="gap-2 flex flex-row items-center w-2/3">
                <img src={mentor} alt="mentors" className="h-10 w-10" />
                <p className="flex font-semibold justify-start text-sm">
                  Mentors
                </p>
              </div>
              <p className="w-1/3 font-extrabold h-[62px] flex  text-2xl justify-center items-center">
                {mentorCount}
              </p>
            </div>
          </div>

          <div className="rounded-[1rem] space-x-2 flex  px-4    justify-center cursor-pointer flex-col  w-full  bg-white drop-shadow-xl border-2 ">
            <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
              <div className="gap-2 flex-row flex items-center w-2/3">
                <img src={vc} alt="founder" className="h-10 w-10" />
                <p className="flex font-semibold justify-start text-sm">
                  Investors
                </p>
              </div>
              <p className="font-extrabold w-1/3 h-[62px] flex  text-2xl justify-center items-center">
                {vcCount}
              </p>
            </div>
          </div>

          <div className="rounded-[1rem] space-x-2 flex px-4   justify-center  flex-col  w-full  bg-white  drop-shadow-xl border-2 ">
            <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
              <div className="gap-2 flex-row flex items-center w-2/3">
                <img src={proj} alt="proj" className="h-10 w-10" />
                <p className="flex font-semibold justify-between text-sm">
                  Cohorts
                </p>
              </div>
              <p className="font-extrabold  w-1/3 text-2xl h-[62px] flex  justify-center items-center">
                0
              </p>
            </div>
          </div>
        </div>

        {/* <div className="flex bg-white shadow-md w-full mt-2 rounded-[1rem] px-[4%] md:h-[478px] h-auto">
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full my-3">
              <h2 className="text-lg font-extrabold text-transparent bg-gradient-to-r from-purple-900 to-blue-500 bg-clip-text">
                Pendings Requests
              </h2>
              <button
                onClick={() => navigate("/request")}
                className="bg-[#7283EA] hover:bg-transparent hover:text-[#7283EA] border-2 hover:border-[#293162] px-4 text-white text-xs font-bold rounded-md flex-shrink-0 py-2"
              >
                View More
              </button>
            </div>
            <div className="overflow-y-auto">
              {allNotification?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row flex-wrap w-full items-center justify-between mb-2 text-sm gap-2 border p-2 rounded-lg border-gray-200"
                >
                  <div className="space-x-4 flex flex-row items-center">
                    <img
                      src={item.photo}
                      alt="photo"
                      className="w-8 h-8 object-cover rounded-lg"
                    />
                    <div className="flex flex-col justify-around items-start">
                      <p className="font-extrabold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400 font-normal">
                        {item.requestedFor}
                      </p>
                    </div>
                    <p className="truncate w-[15rem] text-xs overflow-hidden text-ellipsis   group-hover:text-left ">
                      {item.sender}
                    </p>
                    <p className="text-blue-600 text-xs">
                      Requested:{" "}
                      <span className="font-bold ">{item.timestamp}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap space-x-2 items-center justify-center">
                  <button
                      onClick={() => navigate("/all", { state: item.sender })}
                      className="px-3 py-1 bg-[#7283EA] hover:bg-[#4755af] text-white font-bold rounded-md"
                    >
                      View
                    </button>
                    
                    <button
                      onClick={() => {
                        setCurrentNotificationForReject(item);
                        toggleRejectModal();
                      }}
                      className="px-3 py-1 bg-[#C60404] hover:bg-red-700 text-white font-bold rounded-md"
                    >
                      Reject
                    </button>
                    <button
                      className="px-3 py-1 bg-[#3505B2] hover:bg-indigo-900 text-white font-bold rounded-md"
                      onClick={() => {
                        setCurrentNotificationForAccept(item);
                        toggleAcceptModal();
                      }}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        <div className="flex bg-white shadow-md w-full mt-2 rounded-[1rem] px-[4%] md:h-[478px] h-auto">
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full my-3">
              <h2 className="text-lg font-extrabold text-transparent bg-gradient-to-r from-purple-900 to-blue-500 bg-clip-text">
                Pending Requests
              </h2>
              <button
                onClick={() => navigate("/request")}
                className="bg-[#7283EA] hover:bg-transparent hover:text-[#7283EA] border-2 hover:border-[#293162] px-4 text-white text-xs font-bold rounded-md flex-shrink-0 py-2"
              >
                View More
              </button>
            </div>
            <div className="overflow-y-auto">
              {allNotification?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row flex-wrap w-full items-center justify-between mb-2 text-sm gap-2 border p-2 rounded-lg border-gray-200"
                >
                  <div className="md:space-x-4 flex-wrap flex flex-row items-center md:justify-around justify-start w-full">
                    <img
                      src={item.photo}
                      alt="photo"
                      className="w-[3rem] h-[3rem] object-cover rounded-lg"
                    />
                    <div className="flex flex-col md:ml-0 ml-4 justify-around items-start">
                      <p className="font-extrabold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400 font-normal">
                        {item.requestedFor}
                      </p>
                    </div>
                    <p className="truncate md:mt-0 mt-2 text-xs overflow-hidden text-ellipsis group-hover:text-left ">
                      {item.sender}
                    </p>
                    <p className="text-blue-600 text-xs">
                      Requested:{" "}
                      <span className="font-bold ">{item.timestamp}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap space-x-2 items-center justify-end w-full md:mt-0 mt-[4px] md:mr-[7px]">
                    <button
                      onClick={() => navigate("/all", { state: item.sender })}
                      className="px-3 py-1 bg-[#7283EA] hover:bg-[#4755af] text-white font-bold rounded-md"
                    >
                      View
                    </button>
                    {/* <button
                      onClick={() => {
                        setCurrentNotificationForReject(item);
                        toggleRejectModal();
                      }}
                      className="px-3 py-1 bg-[#C60404] hover:bg-red-700 text-white font-bold rounded-md"
                    >
                      Reject
                    </button>
                    <button
                      className="px-3 py-1 bg-[#3505B2] hover:bg-indigo-900 text-white font-bold rounded-md"
                      onClick={() => {
                        setCurrentNotificationForAccept(item);
                        toggleAcceptModal();
                      }}
                    >
                      Accept
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:w-3/12 w-full space-y-6">
        <TopProjects />
        <TopMentors />
        <TopInvestors />
      </div>
      {isRejectModalOpen && (
        <RejectModal
          allNotification={currentNotificationForReject}
          onClose={() => setIsRejectModalOpen(false)}
        />
      )}
      {isAcceptModalOpen && (
        <AcceptModal
          allNotification={currentNotificationForAccept}
          onClose={() => setIsAcceptModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

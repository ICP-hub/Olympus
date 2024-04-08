import React, { useState, useEffect, useRef } from "react";
import { projectFilterSvg } from "../Utils/AdminData/SvgData";
import { useSelector } from "react-redux";
import NotificationCard from "../Notification/NotificationCard";
import Loader from "../Loader/Loader";
import NoDataCard from "../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import proj from "../../../../IcpAccelerator_frontend/assets/images/founder.png";
import vc from "../../../../IcpAccelerator_frontend/assets/images/vc.png";
import mentor from "../../../../IcpAccelerator_frontend/assets/images/mentor.png";

const RequestCheck = () => {
  // const principal = useSelector((currState) => currState.internet.principal);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const [activeCategory, setActiveCategory] = useState("Project");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mentorPending = useSelector(
    (currState) => currState.mentor_pending.data
  );
  const mentorApproved = useSelector(
    (currState) => currState.mentor_approved.data
  );
  const mentorDeclined = useSelector(
    (currState) => currState.mentor_declined.data
  );

  const projectPending = useSelector(
    (currState) => currState.project_pending.data
  );
  const projectApproved = useSelector(
    (currState) => currState.project_approved.data
  );
  const projectDeclined = useSelector(
    (currState) => currState.project_declined.data
  );

  const investorPending = useSelector(
    (currState) => currState.investor_pending.data
  );
  const investorApproved = useSelector(
    (currState) => currState.investor_approved.data
  );
  const investorDeclined = useSelector(
    (currState) => currState.investor_declined.data
  );

  // console.log("data in =>=>>>>>> requestcheck", filteredNotifications)

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const isDataLoaded =
      mentorPending.length > 0 ||
      mentorApproved.length > 0 ||
      mentorDeclined.length > 0 ||
      projectPending.length > 0 ||
      projectApproved.length > 0 ||
      projectDeclined.length > 0 ||
      investorPending.length > 0 ||
      investorApproved.length > 0 ||
      investorDeclined.length > 0;

    if (isDataLoaded) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [
    mentorPending,
    mentorApproved,
    mentorDeclined,
    projectPending,
    projectApproved,
    projectDeclined,
    investorPending,
    investorApproved,
    investorDeclined,
  ]);

  useEffect(() => {
    const categoryMapping = {
      Mentor: {
        Pending: mentorPending,
        Approved: mentorApproved,
        Declined: mentorDeclined,
      },
      Project: {
        Pending: projectPending,
        Approved: projectApproved,
        Declined: projectDeclined,
      },
      Investor: {
        Pending: investorPending,
        Approved: investorApproved,
        Declined: investorDeclined,
      },
    };

    const currentData = categoryMapping[activeCategory][selectedStatus];
    // console.log("currentData =>", currentData);
    setFilteredNotifications(currentData);
  }, [
    activeCategory,
    selectedStatus,
    mentorPending,
    mentorApproved,
    mentorDeclined,
    projectPending,
    projectApproved,
    projectDeclined,
    investorPending,
    investorApproved,
    investorDeclined,
  ]);

  return (
    <div className="px-[4%] py-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
      <div className="text-2xl font-semibold text-left my-4 pb-2">
        <span className="inline-block bg-[#3505B2] text-transparent bg-clip-text">
          {selectedStatus}
        </span>
      </div>

      <div className="flex justify-between">
        <div>
          {[
            { name: "Project", icon: proj },
            { name: "Mentor", icon: mentor },
            { name: "Investor", icon: vc },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveCategory(item.name)}
              className={`mr-2 px-4 py-2 text-sm font-medium transition-colors duration-300 ease-in-out ${
                activeCategory === item.name
                  ? "pb-1 border-b-2 border-gray-700 font-bold text-gray-700"
                  : "text-gray-500"
              }`}
            >
              <span className="md:block hidden">{item.name}</span>
              <img
                src={item.icon}
                alt={item.icon}
                className="inline md:hidden w-8 h-8"
              />
            </button>
          ))}
        </div>

        <div
          onClick={() => setIsPopupOpen(!isPopupOpen)}
          className="cursor-pointer"
        >
          {projectFilterSvg}
        </div>

        {isPopupOpen && (
          <div className="absolute  w-[143px]  md:top-[14rem] top-[13rem] right-[1rem] md:right-[7.5rem] bg-white shadow-xl rounded-lg border border-gray-300 md:p-4 z-50">
            {["Pending", "Approved", "Declined"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status);
                  setIsPopupOpen(false);
                }}
                className="block w-full text-left px-4 py-2 md:text-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150 ease-in-out"
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading && isAuthenticated ? (
        <Loader />
      ) : filteredNotifications.length > 0 ? (
        <div className="mt-8">
          {filteredNotifications.map((notification, index) => (
            <NotificationCard
              key={index}
              notificationDetails={{
                role: notification.role,
                principal: notification.principal,
                requestedTime: notification.requestedTime,
                rejectedTime: notification.rejectedTime,
                state: { selectedStatus },
                category: { activeCategory },
                ...notification.profile,
                user_data: { ...notification.profile.user_data },
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center py-4">
          <NoDataCard />
        </div>
      )}
    </div>
  );
};

export default RequestCheck;

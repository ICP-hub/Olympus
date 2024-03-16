import React, { useState, useEffect, useRef } from "react";
import { projectFilterSvg } from "../Utils/AdminData/SvgData";

import ment from "../../../../IcpAccelerator_frontend/assets/images/ment.jpg";
import { Line } from "rc-progress";
import Profile from "../../../../IcpAccelerator_frontend/assets/images/Ellipse 1382.svg";
import ReactSlider from "react-slider";
import Astro from "../../../../IcpAccelerator_frontend/assets/images/AstroLeft.png";
import { useSelector } from "react-redux";
import NotificationCard from "../Notification/NotificationCard";
import Loader from "../Loader/Loader";


const RequestCheck = () => {
  // const allNotification = useSelector(
  //   (currState) => currState.allNotification.data
  // );
  const principal = useSelector((currState) => currState.internet.principal);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const [activeCategory, setActiveCategory] = useState("Project");
  const [selectedStatus, setSelectedStatus] = useState("Pending");

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

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    console.log("currentData =>", currentData);
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

  // console.log(
  //   "dekho dekho mentor data aaya  :) :) :) ",
  //   "pending aaja ",
  //   mentorPending[1]?.profile?.user_data,
  //   "approved aaja",
  //   mentorApproved[1]?.profile?.user_data,
  //   "declined aaja ",
  //   mentorDeclined[1]?.profile?.user_data
  // );

  // console.log(
  //   "dekho dekho investor data aaya :) :) :) ",
  //   "pending aaja ",
  //   investorPending[1]?.profile?.user_data,
  //   "approved aaja",
  //   investorApproved[1]?.profile?.user_data,
  //   "declined aaja ",
  //   investorDeclined[1]?.profile?.user_data
  // );

  // console.log(
  //   "dekho dekho project data aaya :) :) :) ",
  //   "pending aaja ",
  //   projectPending[1]?.profile?.user_data,
  //   "approved aaja",
  //   projectApproved[1]?.profile?.user_data,
  //   "declined aaja ",
  //   projectDeclined[1]?.profile?.user_data
  // );

  // console.log(
  //   "filteredNotifications ,,,,,,,,,,,,,,,,,,,,,,,,,, ",
  //   filteredNotifications
  // );

  return (
    <div className="px-[4%] py-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
     <div className="text-2xl font-semibold text-left my-4 pb-2">
    <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        {selectedStatus}
    </span>
</div>

      <div className="flex justify-between">
        <div>
          {[ "Project","Mentor", "Investor"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`mr-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors duration-300 ease-in-out ${
                activeCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              
            >
              {category}
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
  <div className="absolute w-[250px] top-52 right-16 bg-white shadow-xl rounded-lg border border-gray-300 p-4 z-50">
  {["Pending", "Approved", "Declined"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status);
                  setIsPopupOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150 ease-in-out"
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
        <div className="text-2xl font-semibold text-gray-700 mb-4">
          No Request found
        </div>
        <div className="text-lg text-gray-600">
          Please adjust your filter criteria to view Requests.
        </div>
      </div>
      )}
    </div>
  );
};

export default RequestCheck;

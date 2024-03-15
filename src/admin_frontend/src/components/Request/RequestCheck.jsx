import React, { useState, useEffect, useRef } from "react";
import { projectFilterSvg } from "../Utils/AdminData/SvgData";

import ment from "../../../../IcpAccelerator_frontend/assets/images/ment.jpg";
import { Line } from "rc-progress";
import Profile from "../../../../IcpAccelerator_frontend/assets/images/Ellipse 1382.svg";
import ReactSlider from "react-slider";
import Astro from "../../../../IcpAccelerator_frontend/assets/images/AstroLeft.png";
import { useSelector } from "react-redux";
import NotificationCard from "../Notification/NotificationCard";

// const allMentorDeclinedStatus = [
//   {
//     uid: "7f9329debc6a765eb51dce5e6c2ecc1347088d6ac18267bdfc3ce5fdef7f9e93",
//     active: true,
//     approve: false,
//     decline: false,
//     profile: {
//       user_data: {
//         bio: [],
//         country: "",
//         area_of_intrest: "",
//         profile_picture: [],
//         telegram_id: [],
//         twitter_id: [],
//         openchat_username: ["nafees_04"],
//         email: [],
//         full_name: "nafees",
//       },
//       social_link: "",
//       reason_for_joining: "",
//       existing_icp_mentor: true,
//       preferred_icp_hub: [],
//       website: "",
//       multichain: [],
//       area_of_expertise: "",
//       category_of_mentoring_service: "",
//       years_of_mentoring: "",
//       exisitng_icp_project_porfolio: [],
//       icop_hub_or_spoke: true,
//     },
//   },
//   // Add another mentor object here if needed
// ];

const RequestCheck = () => {
  // const allNotification = useSelector(
  //   (currState) => currState.allNotification.data
  // );
  const principal = useSelector((currState) => currState.internet.principal);

  const [activeCategory, setActiveCategory] = useState("Mentor");
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

  console.log(
    "dekho dekho allMentorPending data aaya :) :) :) ",
    mentorPending[1]?.profile?.user_data
  );

  console.log(
    "dekho dekho mentorApproved data aaya :( :( :( ",
    mentorApproved[1]?.profile?.user_data
  );

  console.log(
    "filteredNotifications ,,,,,,,,,,,,,,,,,,,,,,,,,, ",
    filteredNotifications
  );

  return (
    <div className="px-[4%] py-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
      <div className="flex justify-between">
        <div>
          {["Mentor", "Project", "Investor"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`mr-2 p-2 ${
                activeCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
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
          <div className="absolute w-[250px] top-52 right-16 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
            {["Pending", "Approved", "Declined"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status);
                  setIsPopupOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-xl hover:bg-gray-100"
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredNotifications.length > 0 ? (
        <div className="mt-8">
          {filteredNotifications.map((notification, index) => (
            <NotificationCard
              key={index}
              notificationDetails={{
                principal: notification.principal,

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
          <div className="text-lg text-gray-600">
            No notifications found for the selected filter.
          </div>
          <div className="text-md text-gray-500">
            Please adjust your filter criteria.
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCheck;

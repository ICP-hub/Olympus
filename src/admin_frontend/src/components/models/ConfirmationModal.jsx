import React, { useEffect } from "react";
import { closeModalSvg } from "../Utils/AdminData/SvgData";
import { walletModalSvg } from "../Utils/AdminData/SvgData";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../AdminStateManagement/useContext/useAuth";
import { Principal } from "@dfinity/principal";

const ConfirmationModal = ({
  toggleModelPopUp,
  modalPopUp,
  notificationDetails,
}) => {
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const actor = useSelector((currState) => currState.actors.actor);


  console.log("notificationDetails>>>>>>>>>>>>>>>>>>>", notificationDetails);

  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
      navigate("/admin-dashboard");
    }
  }, [isAuthenticated]);

  const declineUserRoleHandler= (principal, boolean, state) => {
    // dispatch();
    toggleModelPopUp(false);
  };

  const allowUserRoleHnadler = async(principal, boolean, state, category) => {
        const covertedPrincipal= await Principal.fromText(principal)

        console.log("covertedPrincipal ", covertedPrincipal)
    switch (category) {
      case "Mentor":
        switch (state) {
          case "Pending":
           await actor.approve_mentor_creation_request_candid(covertedPrincipal, boolean);
        }
        break;
      case "Investor":
        switch (state) {
          case "Pending":
            await actor.approve_vc_creation_request(covertedPrincipal, boolean);
            break;
        }
        break;
        case "Project":
          switch (state) {
            case "Pending":
              await actor.approve_project_creation_request(covertedPrincipal);
              break;
          }      default:
        return null;
    }
    toggleModelPopUp(false);
  };
  
  return (
    <>
      {modalPopUp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => toggleModelPopUp(false)}
        >
          <div
            className="relative w-full max-w-md p-4 mx-2 bg-white rounded-md shadow max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => toggleModelPopUp(false)}
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div className="flex items-start space-x-4 p-4">
              <img
                src={notificationDetails.user_data.profile_picture || ment}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-grow">
                <h4 className="text-lg font-semibold">
                  {notificationDetails.user_data.full_name}
                </h4>
                <p>prinicpal :{notificationDetails.principal}</p>
                <p>Country: {notificationDetails.user_data.country}</p>
                <p>Bio: {notificationDetails.user_data.bio}</p>
                {notificationDetails.user_data.area_of_interest && (
                  <p>
                    Area of Interest:{" "}
                    {notificationDetails.user_data.area_of_interest}
                  </p>
                )}
                <p>Telegram ID: {notificationDetails.user_data.telegram_id}</p>
                <p>Email: {notificationDetails.user_data.email}</p>
                <p>
                  Openchat Username:{" "}
                  {notificationDetails.user_data.openchat_username}
                </p>
                <p>Twitter ID: {notificationDetails.user_data.twitter_id}</p>
                <p>
                  existing_icp_mentor: {notificationDetails.existing_icp_mentor}
                </p>
                <p>
                  years_of_mentoring: {notificationDetails.years_of_mentoring}
                </p>
                <p>
                  existing_icp_project_porfolio:{" "}
                  {notificationDetails.existing_icp_project_porfolio}
                </p>
                <p>
                  category_of_mentoring_service:{" "}
                  {notificationDetails.category_of_mentoring_service}
                </p>
                <p>
                  icop_hub_or_spoke: {notificationDetails.icop_hub_or_spoke}
                </p>
                <p>
                  area_of_expertise: {notificationDetails.area_of_expertise}
                </p>
                <p>
                  reason_for_joining: {notificationDetails.reason_for_joining}
                </p>
                <p>
                  preferred_icp_hub: {notificationDetails.preferred_icp_hub}
                </p>
                <p>social_link: {notificationDetails.social_link}</p>
                <p>
                  area_of_intrest:{" "}
                  {notificationDetails.user_data.area_of_intrest}
                </p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Are you sure you want to allow to become {notificationDetails.category.activeCategory}?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() =>
                    allowUserRoleHnadler(
                      notificationDetails.principal,
                      true,
                      notificationDetails.state.selectedStatus,
                      notificationDetails.category.activeCategory
                    )
                  }
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    declineUserRoleHandler(
                      notificationDetails.principal,
                      true,
                      notificationDetails.state.selectedStatus,
                      notificationDetails.category.activeCategory
                    )
                  }
                  className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;

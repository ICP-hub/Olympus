import React, { useState, useEffect } from "react";
// import { closeModalSvg } from "../Utils/AdminData/SvgData";
// import { walletModalSvg } from "../Utils/AdminData/SvgData";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../AdminStateManagement/useContext/useAuth";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";

// import { mentorApprovedRequest } from "../AdminStateManagement/Redux/Reducers/mentorApproved";
// import { investorApprovedRequest } from "../AdminStateManagement/Redux/Reducers/investorApproved";
// import { projectApprovedRequest } from "../AdminStateManagement/Redux/Reducers/projectApproved";
// import { mentorDeclinedRequest } from "../AdminStateManagement/Redux/Reducers/mentorDeclined";
// import { investorDeclinedRequest } from "../AdminStateManagement/Redux/Reducers/investorDecline";
// import { projectDeclinedRequest } from "../AdminStateManagement/Redux/Reducers/projectDeclined";

const ConfirmationModal = ({
  toggleModelPopUp,
  modalPopUp,
  notificationDetails,
}) => {
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const actor = useSelector((currState) => currState.actors.actor);

  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  // console.log("notificationDetails>>>>>>>>>>>>>>>>>>>", notificationDetails);

  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const declineUserRoleHandler = async (
    principal,
    boolean,
    state,
    category
  ) => {
    setIsDeclining(true);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      // console.log("Converted Principal ", covertedPrincipal);

      switch (category) {
        case "Mentor":
          if (state === "Pending") {
            await actor.decline_mentor_creation_request_candid(
              covertedPrincipal,
              boolean
            );
            await dispatch(mentorDeclinedRequest());
          }
          break;
        case "Investor":
          if (state === "Pending") {
            await actor.decline_vc_creation_request(covertedPrincipal, boolean);
            await dispatch(investorDeclinedRequest());
          }
          break;
        case "Project":
          if (state === "Pending") {
            await actor.decline_project_creation_request(covertedPrincipal);
            await dispatch(projectDeclinedRequest());
          }
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsDeclining(false);
      toggleModelPopUp(false);
      window.location.reload();
    }
  };

  const allowUserRoleHnadler = async (principal, boolean, state, category) => {
    setIsAccepting(true);

    try {
      const covertedPrincipal = await Principal.fromText(principal);

      switch (category) {
        case "Mentor":
          if (state === "Pending") {
            await actor.approve_mentor_creation_request_candid(
              covertedPrincipal,
              boolean
            );
            await dispatch(mentorApprovedRequest());
          }
          break;
        case "Investor":
          if (state === "Pending") {
            await actor.approve_vc_creation_request(covertedPrincipal, boolean);
            await dispatch(investorApprovedRequest());
          }
          break;
        case "Project":
          if (state === "Pending") {
            await actor.approve_project_creation_request(covertedPrincipal);
            await dispatch(projectApprovedRequest());
          }
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsAccepting(false);
      toggleModelPopUp(false);
      window.location.reload();
    }
  };

  return (
    <>
      {modalPopUp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center w-full min-h-screen overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 backdrop-blur-sm p-4 sm:p-0"
          onClick={() => toggleModelPopUp(false)}
        >
          <div
            className="relative w-full max-w-screen-md p-4 mx-4 md:mx-auto bg-white rounded-md shadow-md max-h-full overflow-y-auto"
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

            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 p-4">
              <img
                src={notificationDetails.user_data.profile_picture}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-grow">
                <h4 className="text-lg font-semibold">
                  {notificationDetails.user_data.full_name}
                </h4>
                <p className="text-gray-500">
                  {" "}
                  prinicpal :{notificationDetails.principal}
                </p>
                <p className="text-gray-500">
                  {" "}
                  Country: {notificationDetails.user_data.country}
                </p>
                <p className="text-gray-500">
                  {" "}
                  Bio: {notificationDetails.user_data.bio}
                </p>
                {notificationDetails.user_data.area_of_interest && (
                  <p className="text-gray-500">
                    {" "}
                    Area of Interest:{" "}
                    {notificationDetails.user_data.area_of_interest}
                  </p>
                )}
                <p className="text-gray-500">
                  Telegram ID: {notificationDetails.user_data.telegram_id}
                </p>
                <p className="text-gray-500">
                  Email: {notificationDetails.user_data.email}
                </p>
                <p className="text-gray-500">
                  Openchat Username:{" "}
                  {notificationDetails.user_data.openchat_username}
                </p>
                <p className="text-gray-500">
                  Twitter ID: {notificationDetails.user_data.twitter_id}
                </p>
                {/* {notificationDetails.existing_icp_mentor && (
                  <p>
                    existing_icp_mentor:{" "}
                    {notificationDetails.existing_icp_mentor}
                  </p>
                )} */}
                <p className="text-gray-500">
                  years_of_mentoring: {notificationDetails.years_of_mentoring}
                </p>
                <p className="text-gray-500">
                  existing_icp_project_porfolio:{" "}
                  {notificationDetails.existing_icp_project_porfolio}
                </p>
                <p className="text-gray-500">
                  category_of_mentoring_service:{" "}
                  {notificationDetails.category_of_mentoring_service}
                </p>
                {/* {notificationDetails.icp_hub_or_spoke && (
                  <p>
                    icp_hub_or_spoke: {notificationDetails.icp_hub_or_spoke}
                  </p>
                )} */}
                <p className="text-gray-500">
                  area_of_expertise: {notificationDetails.area_of_expertise}
                </p>
                <p className="text-gray-500">
                  reason_for_joining: {notificationDetails.reason_for_joining}
                </p>
                {notificationDetails.preferred_icp_hub && (
                  <p className="text-gray-500">
                    preferred_icp_hub: {notificationDetails.preferred_icp_hub}
                  </p>
                )}
                <p className="text-gray-500">
                  area_of_interest:{" "}
                  {notificationDetails.user_data.area_of_interest}
                </p>
              </div>
            </div>

            {notificationDetails.state.selectedStatus === "Pending" && (
              <div className="mt-4 text-center">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                  Are you sure you want to allow to become{" "}
                  {notificationDetails.category.activeCategory}?
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
                    disabled={isAccepting}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                  >
                    {isAccepting ? (
                      <ThreeDots color="#FFF" height={13} width={51} />
                    ) : (
                      "Accept"
                    )}
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
                    disabled={isDeclining}
                    className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100"
                  >
                    {isDeclining ? (
                      <ThreeDots color="#000" height={13} width={51} />
                    ) : (
                      "Decline"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;

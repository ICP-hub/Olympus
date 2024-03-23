import React from "react";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const RejectModal = ({ onClose, allNotification }) => {

  // console.log("allNotification in rejectmodal>>>>>>>>>>>>>>>>>>>>>>", allNotification);

  const actor = useSelector((currState) => currState.actors.actor);

  const [isDeclining, setIsDeclining] = useState(false);

  const declineUserRoleHandler = async (principal, boolean, category) => {
    setIsDeclining(true);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      // console.log("Converted Principal ", covertedPrincipal);

      switch (category) {
        case "mentor":
          await actor.decline_mentor_creation_request_candid(
            covertedPrincipal,
            boolean
          );
          break;
        case "vc":
          await actor.decline_vc_creation_request(covertedPrincipal, boolean);
          break;
        case "project":
          await actor.decline_project_creation_request(covertedPrincipal);
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsDeclining(false);
      onClose();
      window.location.reload();
    }
  };

  return (
    <div  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white/30 backdrop-blur-sm border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full space-y-2">
        <h2 className="text-sm  md:text-xl text-black font-semibold">
          You are rejecting the project,
        </h2>
        <p className="text-black text-sm  md:text-xl font-semibold mb-4">
          Do you want to confirm?
        </p>
        <div className="flex justify-end space-x-2 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-red-600 bg-white font-bold text-xs sm:text-sm focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              declineUserRoleHandler(
                allNotification.sender,
                true,
                allNotification.requestedFor
              )
            }
            disabled={isDeclining}
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white bg-red-600 font-bold text-xs sm:text-sm hover:bg-red-800 focus:outline-none"
          >
            {isDeclining ? (
              <ThreeDots color="#000" height={10} width={40} />
            ) : (
              "Reject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;

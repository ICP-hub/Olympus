import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";

const AcceptModal = ({ onClose, allNotification }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [isAccepting, setIsAccepting] = useState(false);

  // console.log("allNotification>>>>>>>>>>>>>>>>>>>>>>", allNotification);

  const allowUserRoleHnadler = async (principal, boolean, category) => {
    setIsAccepting(true);

    try {
      const convertedPrincipal = await Principal.fromText(principal);

      // console.log(convertedPrincipal, boolean, category);
      switch (category) {
        case "mentor":
          await actor.approve_mentor_creation_request_candid(
            convertedPrincipal,
            boolean
          );
          break;
        case "vc":
          await actor.approve_vc_creation_request(convertedPrincipal, boolean);
          break;
        case "project":
          await actor.approve_project_creation_request(convertedPrincipal);
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsAccepting(false);
      onClose();
      window.location.reload();
    }
  };

  return (
<div className=" fixed inset-0 w-full bg-black bg-opacity-50 z-50 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white/30 backdrop-blur-sm border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full space-y-2">
        <h2 className="text-sm  md:text-xl text-black font-semibold">
          You are accepting the project,
        </h2>
        <p className="text-black text-sm  md:text-xl font-semibold mb-4">
          Do you want to confirm?
        </p>
        <div className="flex justify-end space-x-2 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-blue-700 bg-white font-bold text-xs sm:text-sm focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              allowUserRoleHnadler(
                allNotification.sender,
                true,
                allNotification.requestedFor
              )
            }
            disabled={isAccepting}
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white bg-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-900 focus:outline-none"
          >
            {isAccepting ? (
              <ThreeDots color="#FFF" height={10} width={40} />
            ) : (
              "Accept"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptModal;

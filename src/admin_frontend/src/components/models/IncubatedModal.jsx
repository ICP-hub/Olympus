import React from "react";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const IncubatedModal = ({ onClose, id }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [isDeclining, setIsDeclining] = useState(false);

  // console.log("id aaya in IncubatedModal ", id);

  const liveToIncubateHandler = async (projectId) => {
    setIsDeclining(true);
    try {
      await actor.deactivate_and_remove_project(projectId);
      // console.log("Project removed from live status successfully.");

      onClose();
    } catch (error) {
      console.error("Error processing the project update:", error);
    } finally {
      setIsDeclining(false);
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white/30 backdrop-blur-sm border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full space-y-2">
        <h2 className="text-sm md:text-xl text-black font-semibold">
          Do you want to remove this project from live?
        </h2>
        <p className="text-black text-sm md:text-xl font-semibold mb-4">
          Confirm removal?
        </p>
        <div className="flex justify-end space-x-2 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-blue-600 bg-white font-bold text-xs sm:text-sm focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => liveToIncubateHandler(id)}
            disabled={isDeclining}
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white bg-blue-600 font-bold text-xs sm:text-sm hover:bg-blue-800 focus:outline-none"
          >
            {isDeclining ? (
              <ThreeDots color="#FFF" height={10} width={40} />
            ) : (
              "Remove"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncubatedModal;

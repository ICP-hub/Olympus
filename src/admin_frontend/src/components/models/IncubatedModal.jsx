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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6 sm:px-6 lg:px-8 z-50">
      <div className="max-w-xl w-full bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-xl border border-gray-200">
        <div className="p-6 sm:p-8 md:p-10 space-y-4">
          <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
            Do you want to remove this project from live?
          </h2>
          <p className="text-md md:text-lg text-gray-700 font-medium">
            Confirm removal?
          </p>
          <div className="flex justify-end space-x-3 sm:space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm md:text-md font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-150"
            >
              Cancel
            </button>
            <button
              onClick={() => liveToIncubateHandler(id)}
              disabled={isDeclining}
              className="px-4 py-2 text-sm md:text-md font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-150"
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
    </div>
  );
};

export default IncubatedModal;

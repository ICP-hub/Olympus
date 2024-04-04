import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

const LiveModal = ({ onClose, id }) => {
  const actor = useSelector((state) => state.actors.actor);

  const [isAccepting, setIsAccepting] = useState(false);
  const [projectUrl, setProjectUrl] = useState("");
  const [error, setError] = useState("");

  const isValidUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const incubateToLiveHandler = async (id, status, projectUrl) => {
    if (!isValidUrl(projectUrl)) {
      setError("Invalid URL provided. Please enter a valid URL.");
      return;
    }
    setIsAccepting(true);
    setError("");
    try {
      const newProjectUrl = projectUrl.toString();
      await actor.admin_update_project(id, status, [newProjectUrl]);
      //   console.log("Project updated successfully.");

      await actor.remove_project_from_incubated(id);
      //   console.log("Project removed from incubated status successfully.");

      onClose();
    } catch (error) {
      console.error("Error processing the project update:", error);
      setError("Failed to update the project. Please try again.");
    } finally {
      setIsAccepting(false);
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 w-full bg-black bg-opacity-50 z-50 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white/30 backdrop-blur-sm border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full space-y-2">
        <h2 className="text-sm md:text-xl text-black font-semibold">
          Do you want to make this project live?
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Enter project URL"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <div className="flex justify-end space-x-2 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-blue-700 bg-white font-bold text-xs sm:text-sm focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => incubateToLiveHandler(id, true, projectUrl)}
            disabled={isAccepting || !projectUrl}
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white bg-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-900 focus:outline-none"
          >
            {isAccepting ? (
              <ThreeDots color="#FFF" height={10} width={40} />
            ) : (
              "Make Live"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveModal;

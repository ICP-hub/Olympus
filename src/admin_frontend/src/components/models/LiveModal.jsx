import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

const LiveModal = ({ onClose, id }) => {
  const actor = useSelector((state) => state.actors.actor);

  const [isAccepting, setIsAccepting] = useState(false);
  const [projectUrl, setProjectUrl] = useState("");
  const [error, setError] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
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
      if (isMounted.current) {
        setError("Invalid URL provided. Please enter a valid URL.");
      }
      return;
    }
    if (isMounted.current) {
      setIsAccepting(true);
      setError("");
    }
    try {
      const newProjectUrl = projectUrl.toString();
      const updateResult = await actor.admin_update_project(id, status, [
        newProjectUrl,
      ]);
      console.log("Project update API call result:", updateResult);

      const removeResult = await actor.remove_project_from_incubated(id);
      console.log(
        "Project remove from incubated API call result:",
        removeResult
      );

      if (isMounted.current) {
        onClose();
      }
    } catch (error) {
      console.error("Error processing the project update:", error);
      if (isMounted.current) {
        setError("Failed to update the project. Please try again.");
      }
    } finally {
      if (isMounted.current) {
        setIsAccepting(false);
        // window.location.reload();
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 py-6 bg-black bg-opacity-60 sm:px-6 lg:px-8 z-50">
      <div className="max-w-lg w-full bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-100">
        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Do you want to make this project live?
          </h2>
          {error && <p className="text-red-500 font-medium">{error}</p>}
          <input
            type="text"
            placeholder="Enter project URL"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm md:text-md font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-150"
            >
              Cancel
            </button>
            <button
              onClick={() => incubateToLiveHandler(id, true, projectUrl)}
              disabled={isAccepting || !projectUrl}
              className="px-4 py-2 text-sm md:text-md font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-150"
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
    </div>
  );
};

export default LiveModal;

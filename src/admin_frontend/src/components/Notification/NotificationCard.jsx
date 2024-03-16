import React, { useState } from "react";
import ConfirmationModal from "../models/ConfirmationModal";

function NotificationCard({ notificationDetails }) {
  const [modalPopUp, setModalPopUp] = useState(false);

  const toggleModelPopUp = () => {
    setModalPopUp((prev) => !prev);
  };

  return (
    <>
      <div className="p-4 w-full md:flex md:items-center md:justify-between bg-white rounded-lg shadow border border-gray-200">
        <div className="flex items-start space-x-4 mb-4 md:mb-0">
          <img
            src={notificationDetails.user_data.profile_picture}
            alt="profile"
            className="w-16 h-16 rounded-full object-cover"
          />

          <div className="flex flex-col space-y-2  p-4 ">
            <h4 className="text-xl font-bold text-gray-800">
              {notificationDetails.user_data.full_name}
            </h4>
            <p className="text-sm font-medium text-gray-600">
              State:{" "}
              <span className="text-gray-500">
                {notificationDetails.state.selectedStatus}
              </span>
            </p>
            <p className="text-sm font-medium text-gray-600">
              Category:{" "}
              <span className="text-gray-500">
                {notificationDetails.category.activeCategory}
              </span>
            </p>
            {notificationDetails.user_data.country && (
              <p className="text-sm font-medium text-gray-600">
                Country:{" "}
                <span className="text-gray-500">
                  {notificationDetails.user_data.country}
                </span>
              </p>
            )}
            {notificationDetails.area_of_expertise && (
              <p className="text-sm font-medium text-gray-600">
                Area of Interest:{" "}
                <span className="text-gray-500">
                  {notificationDetails.area_of_expertise}
                </span>
              </p>
            )}
            {notificationDetails.requestedTime && (
              <p className="text-sm font-medium text-gray-600">
                Requested on:{" "}
                <span className="text-gray-500">
                  {notificationDetails.requestedTime}
                </span>
              </p>
            )}
            {notificationDetails.rejectedTime && (
              <p className="text-sm font-medium text-gray-600">
                Rejected on:{" "}
                <span className="text-gray-500">
                  {notificationDetails.rejectedTime}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center md:justify-end space-x-2">
          <button
            onClick={toggleModelPopUp}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 border border-red-700 rounded-md hover:bg-red-100"
          >
            View
          </button>
        </div>

        <ConfirmationModal
          notificationDetails={notificationDetails}
          toggleModelPopUp={toggleModelPopUp}
          modalPopUp={modalPopUp}
        />
      </div>
    </>
  );
}

export default NotificationCard;

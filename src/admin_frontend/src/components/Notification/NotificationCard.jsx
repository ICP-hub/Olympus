import React, { useState } from "react";
import ConfirmationModal from "../models/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const NotificationCard = ({ notificationDetails }) => {
  const [modalPopUp, setModalPopUp] = useState(false);
  const navigate = useNavigate();

  const toggleModelPopUp = () => {
    setModalPopUp((prev) => !prev);
  };

  // console.log("notificationDetails =======================================>=> ", notificationDetails);

  const dataSendToProfileHandler = () => {
    navigate("/all", { state: notificationDetails.principal });
  };

  return (
    <>
      <div className="px-[4%]  py-[2%] w-full flex flex-col mb-6 bg-white rounded-lg shadow border border-gray-200">
        <div className="w-full mb-2 md:justify-between justify-start md:items-center  flex flex-col md:flex-row">
          <div className="space-x-3 flex flex-row items-center">
            <img
              src={notificationDetails.user_data.profile_picture}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h4 className="md:text-2xl text-md font-extrabold text-[#3505B2] ">
              {notificationDetails.user_data.full_name}
            </h4>
            <div>
              {notificationDetails.category.activeCategory && (
                <p className="bg-[#2A353D] md:text-[10px] text-[8px] items-center  rounded-full text-white py-0.5 px-2">
                  {notificationDetails.category.activeCategory}
                </p>
              )}
            </div>
          </div>

          <p className="text-[#3505B2] text-sm">
            {notificationDetails.requestedTime}
          </p>
        </div>

        <div className="flex items-start">
          <div className="flex flex-col space-y-1 w-full mb-3">
            {notificationDetails.user_data.country && (
              <p className="text-sm font-medium flex flex-row text-gray-600">
                <span className="text-gray-500">
                  {notificationDetails.user_data.country}
                </span>
              </p>
            )}
            {notificationDetails.project_description && (
              <div className="text-sm font-medium flex flex-row text-gray-600">
                <span className="text-gray-500">
                  {<p>{notificationDetails.project_description}</p>}
                </span>
              </div>
            )}
            {notificationDetails.rejectedTime && (
              <p className="text-sm font-medium flex flex-row text-gray-600">
                <span className="text-gray-500">
                  {notificationDetails.rejectedTime}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            // onClick={toggleModelPopUp}
            onClick={dataSendToProfileHandler}
            className="capitalize border-2 font-semibold bg-[#3505B2] border-[#3505B2] md:text-sm text-[8px] text-white px-2 py-1 rounded-md  hover:text-[#3505B2] hover:bg-white"
          >
            View User Profile
          </button>
        </div>

        {/* <ConfirmationModal
          notificationDetails={notificationDetails}
          toggleModelPopUp={toggleModelPopUp}
          modalPopUp={modalPopUp}
        /> */}
      </div>
    </>
  );
};

export default NotificationCard;

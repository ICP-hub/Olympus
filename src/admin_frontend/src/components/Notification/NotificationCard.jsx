import React, { useState } from "react";
import ConfirmationModal from "../models/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { BioSvg, DateSvg, place } from "../Utils/AdminData/SvgData";

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

  // console.log(
  //   "notificationDetails.project_description =>",
  //   notificationDetails
  // );
  return (
    <>
      <div className="px-[2%]  py-[1.5%] w-full flex flex-col mb-6 bg-white rounded-lg shadow border border-gray-200">
        <div className="w-full mb-2 justify-between items-center  flex flex-row flex-wrap">
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

          <div className=" hidden md:flex md:flex-row">
            <span className="text-gray-500 mr-2">
              {" "}
              <DateSvg />{" "}
            </span>
            <p className="md:text-sm text-xs md:text-md text-[#3505B2]">
              {notificationDetails.requestedTime}
            </p>
          </div>
        </div>

        <div className="flex md:flex-row flex-col w-full">
          <div className="flex flex-col md:w-3/4 w-full mb-3 md:mb-0">
            <div className="md:hidden block">
              {notificationDetails.requestedTime && (
                <div className="flex flex-row items-center text-sm mb-1 font-medium text-gray-600">
                  <span className="text-gray-500 min-w-[40px] ml-3">
                    <DateSvg />
                  </span>
                  <span className="truncate md:text-sm text-xs">
                    {notificationDetails.requestedTime}
                  </span>
                </div>
              )}
            </div>

            {notificationDetails.user_data.country && (
              <div className="flex flex-row items-center text-sm mb-1 font-medium text-gray-600">
                <span className="text-gray-500 min-w-[40px] ml-3">{place}</span>
                <span className="truncate">
                  {notificationDetails.user_data.country}
                </span>
              </div>
            )}
            {notificationDetails.project_description ? (
              <div className="flex flex-row items-center text-sm font-medium text-gray-600 break-words">
                <span className="text-gray-500 min-w-[40px] ml-3">
                  <BioSvg />
                </span>
                <span className="truncate md:text-sm text-xs">
                  {notificationDetails.project_description}
                </span>
              </div>
            ) : (
              notificationDetails.user_data.bio && (
                <div className="flex flex-row items-center text-sm font-medium text-gray-600 break-words">
                  <span className="text-gray-500 min-w-[40px] ml-3">
                    <BioSvg />
                  </span>
                  <span className="truncate md:text-sm text-xs">
                    {notificationDetails.user_data.bio}
                  </span>
                </div>
              )
            )}
            {/* {notificationDetails.rejectedTime && (
              <div className="flex flex-row items-center text-sm font-medium text-gray-600">
                <span className="text-gray-500 min-w-[100px]">
                  Rejected Time:
                </span>
                <span className="truncate">
                  {notificationDetails.rejectedTime}
                </span>
              </div>
            )} */}
          </div>
          <div className="md:w-1/4 w-full flex justify-end items-end space-x-2 md:h-10">
            <button
              // onClick={toggleModelPopUp}
              onClick={dataSendToProfileHandler}
              className="capitalize border-2 font-semibold bg-[#3505B2] border-[#3505B2] md:text-xs text-[9px]  text-white md:px-1 px-2 rounded-md md:h-8 h-7 hover:text-[#3505B2] hover:bg-white"
            >
              View User Profile
            </button>
          </div>
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

import React, { useState } from "react";
import ConfirmationModal from "../models/ConfirmationModal";

function NotificationCard({notificationDetails}) {

  const [modalPopUp, setModalPopUp] = useState(false);

  const toggleModelPopUp = () => {
    setModalPopUp((prev) => !prev);
  };

  return (
    <>
      <div className="p-4 w-full flex flex-col md:flex-row justify-between bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Display mentor information */}
        <div className="flex items-start space-x-4">
          <img src={notificationDetails.user_data.profile_picture} alt="profile" className="w-16 h-16 rounded-full object-cover"/>
          <div className="flex flex-col space-y-1">
            <h4 className="text-lg font-semibold">{notificationDetails.user_data.full_name}</h4>
            <p>state : {notificationDetails.state.selectedStatus}</p>
            <p>category :{notificationDetails.category.activeCategory}</p>
            <p>Country: {notificationDetails.user_data.country}</p>
            {notificationDetails.area_of_expertise && <p>Area of Interest: {notificationDetails.area_of_expertise}</p>}
            {/* <p>Telegram ID: {telegram_id}</p> */}
            <p>Email: {notificationDetails.user_data.email}</p>
            {/* <p>Openchat Username: {openchat_username}</p> */}
            {/* <p>Twitter ID: {twitter_id}</p> */}            {/* <p>Bio: {bio}</p> */}

          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2">
          <button onClick={toggleModelPopUp} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 border border-red-700 rounded-md hover:bg-red-100">
            View
          </button>
        </div> 

        <ConfirmationModal 
        notificationDetails ={notificationDetails}
        toggleModelPopUp={toggleModelPopUp} modalPopUp={modalPopUp} />
      </div>
    </>
  );
}

export default NotificationCard;


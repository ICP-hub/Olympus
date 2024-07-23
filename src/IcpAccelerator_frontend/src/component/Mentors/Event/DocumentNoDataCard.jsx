import React from "react";
import NoData from "../../../../assets/images/file_not_found.png";

function NoDataCard({ allowAccess }) {
  return (
    <div className="flex flex-col justify-center items-center w-full font-fontUse py-5">
      <div className="flex justify-center items-center">
        <img src={NoData} className="w-2/6" alt="" />
      </div>
      {allowAccess === false ? (
        <p className="text-red-400 font-bold text-center">You do not have access to view the private documents for this project<br></br><span className="text-center">Please , Request Project Owner For View Document </span></p>
      ) : (
        <p className="text-gray-400">No documents available</p>
      )}
    </div>
  );
}

export default NoDataCard;

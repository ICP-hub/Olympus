import React from "react";

function NoDataCard({image,desc,allowAccess}) {
  return (
    <div className="flex flex-col justify-center items-center w-full font-fontUse py-5">
      <div className="flex justify-center items-center">
        <img src={image} className="w-2/6" alt="" />
      </div>
      {allowAccess === false ? (
        <p className="text-red-400 font-bold text-center">You do not have access to view the Money Raised for this project<br></br><span className="text-center">Please , Request Project Owner For View Document </span></p>
      ) :
      <p className="text-gray-400 text-center">{desc}</p>
    }
    </div>
  );
}

export default NoDataCard;

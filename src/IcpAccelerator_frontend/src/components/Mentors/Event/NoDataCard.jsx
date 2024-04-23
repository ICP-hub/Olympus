import React from "react";
import NoData from "../../../../assets/images/NoData.png";

function NoDataCard({image,desc}) {
  return (
    <div className="flex flex-col justify-center items-center w-full font-fontUse py-5">
      <div className="flex justify-center items-center">
        <img src={image} className="w-2/6" alt="" />
      </div>
      <p className="text-gray-400 text-center">{desc}</p>
    </div>
  );
}

export default NoDataCard;

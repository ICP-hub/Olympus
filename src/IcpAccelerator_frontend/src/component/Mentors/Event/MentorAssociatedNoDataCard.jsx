import React from "react";

function NoDataCard() {
  return (
    <div className="flex flex-col justify-center items-center w-full font-fontUse py-5">
      <div className="flex justify-center items-center">
        <img src='' className="w-2/6" alt="" />
      </div>
      <p className="text-gray-400">Data Not Found</p>
    </div>
  );
}

export default NoDataCard;

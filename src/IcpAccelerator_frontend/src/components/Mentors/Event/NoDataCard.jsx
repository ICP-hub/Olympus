import React from "react";
import NoData from "../../../../assets/images/NoData.png";

function NoDataCard() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div>
        <img src={NoData} alt="No data Found" />
      </div>
      <h2>No Data</h2>
    </div>
  );
}

export default NoDataCard;

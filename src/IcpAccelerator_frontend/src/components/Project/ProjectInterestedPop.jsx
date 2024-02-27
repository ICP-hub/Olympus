import React from "react";
import Profile from "../../../assets/images/Ellipse 1382.svg";

function ProjectInterestedPop() {
  return (
    <div className="drop-shadow-[#0000000D] rounded-[10px] px-6">
        <div className="flex justify-between items-center font-normal text-base text-[#737373]">
          <div className="flex mr-3 mt-2">
            <img className="w-7 h-7 rounded-full" src={Profile} alt="" />
            <p className="pl-2"><span className="font-black">Ms.Lucy</span> is interested in you project.</p>
          </div>
          <div className="flex items-center">
            <p className="font-[450]">Reach out her if you want a mentor.</p>
            <div className="px-4">
              <button className="font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap">
                Reach
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}

export default ProjectInterestedPop;

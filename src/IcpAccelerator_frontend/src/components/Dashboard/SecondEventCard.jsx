import React from "react";
import hover from "../../../assets/images/hover.png";
import { winner } from "../Utils/Data/SvgData";
import girl from "../../../assets/images/girl.jpeg";

const SecondEventCard = () => {
  return (
    <div className="block w-full drop-shadow-xl rounded-lg bg-gray-200 mb-8">
      <div className="w-full relative">
        <img
          className="w-full object-fill h-[280px] rounded-lg "
          src={hover}
          alt="not found"
        />
        <div className="absolute h-12 w-12 -bottom-1 right-[20px]">
          {winner}
        </div>
      </div>
      <div className="w-full">
        <div className="p-8">
          <div className="w-full mt-4">
            <div className="w-1/2 flex-col text-[#737373] flex  ">
              <h1 className="text-black font-bold text-xl text-nowrap">
                RWA Projects. Part 2
              </h1>
              <p className="text-xs font-light whitespace-nowrap">
                22 Apr 2024 17:30 -22 Apr 2024 19:30
              </p>
            </div>
            <p className="text-[#7283EA] font-semibold text-xl">
              This event includes
            </p>
            <ul className="text-sm font-extralight list-disc list-outside pl-4">
              <li>Direct interaction with the instructor</li>
              <li>Session recording after the workshop</li>
              <li>Access on mobile and web</li>
              <li>1 hour live session</li>
            </ul>

            <div className="flex flex-row flex-wrap space-x-8 mt-2">
              <div className="flex gap-4 ">
                <div className="flex flex-col font-bold">
                  <p className="text-[#7283EA]">Date</p>
                  <p className="text-black whitespace-nowrap">25 Oct 2021</p>
                </div>
                <div className="flex flex-col font-bold">
                  <p className="text-[#7283EA]">Time</p>
                  <p className="text-black">7:30 pm</p>
                </div>
                <div className="flex flex-col font-bold">
                  <p className="text-[#7283EA]">Duration</p>
                  <p className="text-black">60 min</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center ">
              <button className="mb-2 uppercase w-full bg-[#3505B2] mr-2 text-white  px-4 py-2 rounded-md  items-center font-extrabold text-sm mt-2 ">
                Register now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondEventCard;

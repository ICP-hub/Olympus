import React, { useState, useEffect, useRef } from "react";
import { projectFilterSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
// import ment from "../../../../IcpAccelerator_frontend/assets/images/ment.jpg";
import img1 from "../../../../IcpAccelerator_frontend/assets/images/img1.png";
// import { Line } from "rc-progress";
// import Profile from "../../../../IcpAccelerator_frontend/assets/images/Ellipse 1382.svg";
// import ReactSlider from "react-slider";
// import Astro from "../../../../IcpAccelerator_frontend/assets/images/AstroLeft.png";

const Adminoption = () => {
  // const [sliderValuesProgress, setSliderValuesProgress] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Pending");
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const tm = useRef(null); // Adjusted to initialize with null to better represent the absence of a value

  const gradientStops = isHovered
    ? { stop1: "#4087BF", stop2: "#3C04BA" } // Hover gradient colors
    : { stop1: "#B5B5B5", stop2: "#5B5B5B" };
  // Increase function is used to update the percent state
  const increase = () => {
    setPercent((prevPercent) => {
      if (prevPercent >= 100) {
        clearTimeout(tm.current);
        return 100; // Ensure we don't exceed 100%
      }
      return prevPercent + 1;
    });
  };

  // Automatically start the increase function when the component mounts or percent changes, but not exceed 100%
  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 10);
    }

    // Cleanup function to clear the timeout when the component unmounts or before re-running the effect
    return () => clearTimeout(tm.current);
  }, [percent]);

  return (
    <div className="px-[4%] py-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
      <div className="flex items-center justify-between">
        {selectedOption && (
          <div className=" left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl  font-extrabold">
            {selectedOption}
          </div>
        )}
        <div
          className="cursor-pointer"
          onClick={() => setIsPopupOpen(!isPopupOpen)}
        >
          {projectFilterSvg}
        </div>
        {isPopupOpen && (
          <div className="absolute w-[250px] top-52 right-16 bg-white shadow-md rounded-lg border border-gray-200  p-3 z-10">
            <ul className="flex flex-col">
              <li>
                <button
                  onClick={() => handleOptionClick("Accepted")}
                  className="border-[#9C9C9C] py-[18px] border-b-2 w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start"
                >
                  Accepted
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOptionClick("Declined")}
                  className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start"
                >
                  Declined
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOptionClick("Pending")}
                  className="px-4 font-bold py-[18px] focus:outline-none text-xl flex justify-start"
                >
                  Pending
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex w-auto items-center flex-wrap justify-between bg-gray-200 rounded-lg mt-8 text-lg p-4  hover:bg-blue-300">
        <div className="flex items-center">
          <img
            src={img1}
            alt="Mentor"
            className="w-16 h-16 lg:w-12 lg:h-12 object-cover rounded-md mb-4 lg:mb-0 hover:border-black hover:border-2 p-1"
          />
          <p className="font-extrabold ml-2">Name</p>
        </div>
       
       

        <div className="flex space-x-4 flex-wrap md:flex-nowrap">
          {/* <button className="border text-[#737373] p-[5px] px-3 rounded-md border-[#C7C7C7] flex items-center">
            <svg
              width="15"
              height="15"
              viewBox="0 0 8 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform transform hover:scale-150"
            >
              <path
                d="M3.04007 0.934606C3.44005 0.449652 4.18299 0.449652 4.58298 0.934606L6.79207 3.61298C7.33002 4.26522 6.86608 5.24927 6.02061 5.24927H1.60244C0.756969 5.24927 0.293022 4.26522 0.830981 3.61298L3.04007 0.934606Z"
                fill="#737373"
              />
            </svg>
            <span className="ml-1"> 50</span>
          </button> */}

          {selectedOption === "Accepted" && (
            <button className="px-2 bg-[#3505B2] text-white font-bold rounded-lg">
              View
            </button>
          )}
          {selectedOption === "Pending" && (
            <>
              <button className="px-2 bg-white text-blue-800 font-bold rounded-lg border-2 border-blue-800">
                Reject
              </button>
              <button className="px-2 bg-[#3505B2] text-white font-bold rounded-lg">
                Accept
              </button>
            </>
          )}
          {selectedOption === "Declined" && <button></button>}
        </div>
        {/* </div> */}
      </div>
      <div className="flex w-auto items-center flex-wrap justify-between bg-gray-200 rounded-lg mt-8 text-lg p-4  hover:bg-blue-300">
        <div className="flex items-center rounded-full">
          <img
            src={img1}
            alt="Mentor"
            className="w-16 h-16 lg:w-12 lg:h-12 object-cover rounded-md mb-4 lg:mb-0 hover:border-black hover:border-2 p-1"
          />
          <p className="font-extrabold ml-2">Name</p>
        </div>
       
       

        <div className="flex space-x-4 flex-wrap md:flex-nowrap">
          {/* <button className="border text-[#737373] p-[5px] px-3 rounded-md border-[#C7C7C7] flex items-center">
            <svg
              width="15"
              height="15"
              viewBox="0 0 8 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform transform hover:scale-150"
            >
              <path
                d="M3.04007 0.934606C3.44005 0.449652 4.18299 0.449652 4.58298 0.934606L6.79207 3.61298C7.33002 4.26522 6.86608 5.24927 6.02061 5.24927H1.60244C0.756969 5.24927 0.293022 4.26522 0.830981 3.61298L3.04007 0.934606Z"
                fill="#737373"
              />
            </svg>
            <span className="ml-1"> 50</span>
          </button> */}

          {selectedOption === "Accepted" && (
            <button className="px-2 bg-[#3505B2] text-white font-bold rounded-lg">
              View
            </button>
          )}
          {selectedOption === "Pending" && (
            <>
              <button className="px-2 bg-white text-blue-800 font-bold rounded-lg border-2 border-blue-800">
                Reject
              </button>
              <button className="px-2 bg-[#3505B2] text-white font-bold rounded-lg">
                Accept
              </button>
            </>
          )}
          {selectedOption === "Declined" && <button></button>}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Adminoption;

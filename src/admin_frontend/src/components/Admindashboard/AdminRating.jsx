import React, { useState, useEffect, useRef } from 'react';
import ment from "../../../assets/images/ment.jpg";
import project from "../../../assets/images/project.jpg";

const AdminRating = () => {
  const [selectedOption, setSelectedOption] = useState('Project Ratings')
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const tm = useRef(null);

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

 
  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 10);
    }
    return () => clearTimeout(tm.current);
  }, [percent]);
  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 10);
    }
    return () => clearTimeout(tm.current);
  }, [percent]);
 

  return (
    <div>

      <div className="p-3 flex items-center bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px] ml-12">

        <div className="md:p-4">
          <img
            src={ment}
            alt="ment"
            className="w-12 aspect-square object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="px-2">
            <div className="flex items-center">
              <div className="flex items-center">
                <p className="font-[950] text-2xl pr-2">builder.fi</p>
                <svg
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.4735 1.54094C9.02098 0.64994 7.75319 1.009 6.99159 1.58095C6.67932 1.81546 6.52318 1.93272 6.43132 1.93272C6.33945 1.93272 6.18331 1.81546 5.87104 1.58095C5.10944 1.009 3.84165 0.64994 2.38909 1.54094C0.482769 2.71028 0.0514138 6.56799 4.44856 9.82259C5.28608 10.4425 5.70484 10.7524 6.43132 10.7524C7.15779 10.7524 7.57655 10.4425 8.41407 9.82259C12.8112 6.56799 12.3799 2.71028 10.4735 1.54094Z"
                    stroke="#7283EA"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="w-full block text-xs xxs1:hidden text-right pr-4">
                <button className="font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap">
                  Visit
                </button>
              </div>
            </div>
            <div className="md:flex block text-xs md:text-sm text-[#737373]">
              <p className="flex font-[450] pr-4">
                Proposer: <span className="font-normal pl-2">fine_web3</span>
              </p>
              <p className="flex items-center">
                Categories:{" "}
                <span className="bg-[#B5B5B54D] mx-1 px-2 rounded-full">
                  Infrastructure
                </span>
                <span className="bg-[#B5B5B54D] mx-1 px-2 rounded-full">
                  Tooling
                </span>
              </p>
            </div>
            <div className="flex items-center text-xs md:text-sm text-[#737373]">
              <p className="flex items-center">Chains:</p>
              <p className="text-[10px] font-[450] pl-1">+6 more</p>
            </div>
          </div>

        </div>
      </div>
      <div className='flex justify-center p-8  '>
        <div className="relative w-full md:w-[750px] h-[542.8px] border-4 border-[#E9E9E9] ">
          <div className="absolute bottom-0 left-0 top-0 w-[389.31px] h-[390px] bg-blue-100 ellipse-quarter-left rounded-md rotate-90 z-0"></div>
          <div className="absolute top-0 right-0 bg-blue-100 w-[209.63px] h-[210px] ellipse-quarter-right rounded-md"></div>
          <div className="absolute top-[327px] right-0 bg-blue-100 w-[209.63px] h-[210px] ellipse-quarter-right rounded-md rotate-90"></div>
          <div className="flex flex-col w-full relative ">
            <div className="w-fit  p-4 text-2xl font-bold md:ml-4 mt-4 absolute top-0 left-0 right-0 text-center text-black">
              Ratings
            </div>



            <div className=' overflow-y-auto '>

              <div className='w-full flex flex-row mt-8 absolute top-0 left-0 right-0 text-center  '>
<div className='flex flex-col '>
                <div className="flex flex-row    mt-8 lg:gap-14 md:gap-8 gap-2 items-center p-4 ">
                  <p className='text-[#737373] font-bold md:ml-4'>Team</p>
                  <div className="flex items-center lg:w-[600px] md:w-[500px] w-[210px]">
                    <svg
                      width="100%"
                      height="7"
                      className="rounded-lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop
                            offset="0%"
                            style={{ stopColor: isHovered ? gradientStops.stop1 : '#7283EA', stopOpacity: 1 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: isHovered ? gradientStops.stop2 : '#7283EA', stopOpacity: 1 }}
                          />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0"
                        y="0"
                        width={`${percent}%`}
                        height="10"
                        fill="url(#gradient1)"
                      />
                    </svg>
                    <div className="text-gray-600 text-sm ml-2 font-fontUse text-nowrap">
                      7
                    </div>
                  </div>
                </div>
                <div className="flex flex-row     lg:gap-14 md:gap-8 gap-2 items-center p-4 ">
                  <p className='text-[#737373] font-bold md:ml-4 '>Value </p>
                  <div className="flex items-center lg:w-[600px] md:w-[500px] w-[210px]">
                    <svg
                      width="100%"
                      height="7"
                      className="rounded-lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop
                            offset="0%"
                            style={{ stopColor: isHovered ? gradientStops.stop1 : '#7283EA', stopOpacity: 1 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: isHovered ? gradientStops.stop2 : '#7283EA', stopOpacity: 1 }}
                          />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0"
                        y="0"
                        width={`${percent}%`}
                        height="10"
                        fill="url(#gradient1)"
                      />
                    </svg>
                    <div className="text-gray-600 text-sm ml-2 font-fontUse text-nowrap">
                      7
                    </div>
                  </div>
                </div>
                <div className="flex flex-row    lg:gap-14 md:gap-8 gap-2 items-center p-4 ">
                  <p className='text-[#737373] font-bold md:ml-4'>product</p>
                  <div className="flex items-center lg:w-[600px] md:w-[500px] w-[210px]">
                    <svg
                      width="100%"
                      height="7"
                      className="rounded-lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop
                            offset="0%"
                            style={{ stopColor: isHovered ? gradientStops.stop1 : '#7283EA', stopOpacity: 1 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: isHovered ? gradientStops.stop2 : '#7283EA', stopOpacity: 1 }}
                          />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0"
                        y="0"
                        width={`${percent}%`}
                        height="10"
                        fill="url(#gradient1)"
                      />
                    </svg>
                    <div className="text-gray-600 text-sm ml-2 font-fontUse text-nowrap">
                      7
                    </div>
                  </div>
                </div>
                </div>
              </div>


            
            </div>















          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminRating;
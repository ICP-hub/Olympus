import React, { useState, useEffect, useRef } from "react";
import { Line } from "rc-progress";
import NoDataCard from "../Mentors/Event/MoneyNoDataCard";

const ProjectMoneyRaising = ({ data }) => {
  const [percent, setPercent] = useState(0);
  const tm = useRef(null);
  const gradient = "linear-gradient(90deg, #B9C0F2 0%, #7283EA 100%)";
  const gradientStops = { stop1: "#7283EA", stop2: "#B9C0F2" };
  const circlePosition = (percent) => {
    return `calc(${percent}% - 10px)`;
  };

  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 30);
    }
    return () => clearTimeout(tm.current);
  }, [percent]);

  const increase = () => {
    setPercent((prevPercent) => {
      if (prevPercent >= 50) {
        clearTimeout(tm.current);
        return 50;
      }
      return prevPercent + 1;
    });
  };


  console.log('money', data)

  return (
    <>
      {!data?.params?.money_raised_till_now[0] && 
        <NoDataCard/>
      }
      {data?.params?.money_raised_till_now[0] &&

        <div>
          <div className="bg-[#D9DBF3] border my-4 mr-[4%] pt-4 px-10 rounded-3xl w-[80%] mb-12">
            <div className="flex justify-between">
              <h1 className="font-extrabold text-xl mb-2">Targeted Funds</h1>
              <h1 className="font-extrabold text-xl mb-2">${data?.params?.money_raised[0]?.target_amount[0]}</h1>
            </div>
            <div className="flex items-center mb-4 mt-2">
              <div className="flex-1 bg-white rounded-full h-2 relative">
                <div className="relative mb-4">
                  <svg width="100%" height="8" className="rounded-lg absolute">
                    <defs>
                      <linearGradient
                        id={`gradient-`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor={gradientStops.stop1}
                          stopOpacity="1"
                        />
                        <stop
                          offset="100%"
                          stopColor={gradientStops.stop2}
                          stopOpacity="1"
                        />
                      </linearGradient>
                    </defs>
                    <rect
                      x="0"
                      y="0"
                      width={`${percent}%`}
                      height="10"
                      fill={`url(#gradient-)`}
                    />
                  </svg>
                </div>
                <div
                  className="absolute w-5 h-5 rounded-full border-2 border-white -top-[6px]"
                  style={{
                    left: circlePosition(percent),
                    backgroundImage: gradient,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 ml-2">{percent}%</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-between mr-[4%] gap-12">
            <div className="bg-white rounded-3xl p-6 mb-4 flex-auto">
              <div className="flex justify-between mb-2 items-center">
                <h6 className="text-base font-bold">Grants</h6>
                <h1 className="text-4xl font-extrabold">${data?.params?.money_raised[0]?.icp_grants[0] ? data?.params?.money_raised[0]?.icp_grants[0]  : 0 }</h1>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 mb-4 flex-auto">
              <div className="flex justify-between mb-2 items-center">
                <h6 className="text-base font-bold">Investors</h6>
                <h1 className="text-4xl font-extrabold">${data?.params?.money_raised[0]?.investors[0] ? data?.params?.money_raised[0]?.investors[0]  : 0 }</h1>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 mb-4 flex-auto">
              <div className="flex justify-between mb-2 items-center">
                <h6 className="text-base font-bold">Tokens</h6>
                <h1 className="text-4xl font-extrabold">${data?.params?.money_raised[0]?.sns[0] ? data?.params?.money_raised[0]?.sns[0]  : 0 }</h1>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 mb-4 flex-auto">
              <div className="flex justify-between mb-2 items-center">
                <h6 className="text-base font-bold">Others</h6>
                <h1 className="text-4xl font-extrabold">${data?.params?.money_raised[0]?.raised_from_other_ecosystem[0] ? data?.params?.money_raised[0]?.raised_from_other_ecosystem[0]  : 0 }</h1>
              </div>
            </div>
          </div>
        </div>}

    </>
  );
};

export default ProjectMoneyRaising;

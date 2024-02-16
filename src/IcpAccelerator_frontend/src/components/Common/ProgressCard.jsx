import React, { useState, useRef, useEffect } from "react";
import { Line } from "rc-progress";
import Astro from "../../../assets/images/AstroLeft.png";

const ProgressCard = () => {
  const [percent, setPercent] = useState(0);
  const [ismobileView, setIsmobileView] = useState(window.innerWidth < 768);

  const tm = useRef();

  useEffect(() => {
    const resizeHandler = () => {
      setIsmobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    const increase = () => {
      const newPercent = percent + 1;

      if (newPercent >= 94 && ismobileView) {
        clearTimeout(tm.current);
        return;
      } else if (newPercent >= 100 && !ismobileView) {
        clearTimeout(tm.current);
        return;
      }
      setPercent(newPercent);
    };

    tm.current = setTimeout(increase, 70);
    return () => clearTimeout(tm.current);
  }, [percent]);

  const restart = () => {
    clearTimeout(tm.current);
    setPercent(0);
  };

  return (
    <div className="w-full px-[4%] lg1:px-[5%]">
      <div className="w-full h-fit bg-violet-900 rounded-2xl border border-white p-7 md:p-8 mb-8">
        <div className="text-white text-2xl md:text-4xl font-bold mb-4">
          Let’s track your journey on the accelerator
        </div>

        <div className="hidden md:block">
          <div>
            <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
              <div className="text-center text-white text-sm md:text-base font-normal">
                Idea
                <br />
                Clarity
              </div>
              <div className="text-center text-white text-sm md:text-base font-normal">
                MVP
                <br />
                Build
              </div>
              <div className="text-center text-white text-sm md:text-base font-normal">
                Product
                <br />
                Market Fit
              </div>
              <div className="text-center text-white text-sm md:text-base font-normal">
                Company
                <br />
                Restructuring
              </div>
              <div className="text-center text-white text-sm md:text-base font-normal">
                Team &<br />
                Management
              </div>
              <div className="text-center text-white text-sm md:text-base font-normal">
                Networking
                <br />
                with Partners
              </div>
              <div className="text-center text-white text-sm md:text-base font-normal">
                VC
                <br />
                Networks
              </div>
              <div className="text-center text-white text-sm md:text-base font-normal">
                Marketing &<br />
                KOL Connects
              </div>
            </div>
          </div>
          <div className="mt-16 mb-3 relative w-full">
            <Line
              strokeWidth={0.2}
              percent={percent}
              strokeColor="transparent"
              className="line-vertical md:line-horizontal"
            />
            <img
              src={Astro}
              alt="Progress Icon"
              className="absolute w-[50px] top-[-60px] -translate-x-1/2 "
              style={{ left: `${percent}%` }}
            />
          </div>
        </div>

        <div className="md:hidden">
          <ol className="relative border-s border-gray-2 border-gray-300 ml-2">
            <div className="mb-6 relative w-full">
              <img
                src={Astro}
                alt="Progress Icon"
                className="z-10 absolute w-[37px] -translate-x-1/2 ml-[-16px]"
                style={{ top: `${percent}%` }}
              />
              <li className="mb-4 ms-4">
                <div className="absolute w-2 h-2 bg-gray-200 rounded-full mt-2.5 -start-1 border border-gray-400"></div>
                <h3 className="text-lg font-normal text-white pl-3">
                  Idea Clarity
                </h3>
              </li>
              <li className="mb-4 ms-4">
                <div className="absolute w-2 h-2 bg-gray-200 rounded-full mt-1.5 -start-1 border border-gray-400"></div>
                <h3 className="text-lg font-normal text-white pl-3">
                  MVP Build
                </h3>
              </li>
              <li className="mb-4 ms-4">
                <div className="absolute w-2 h-2 bg-gray-200 rounded-full mt-1.5 -start-1 border border-gray-400"></div>
                <h3 className="text-lg font-normal text-white pl-3">
                  Product Market Fit
                </h3>
              </li>
              <li className="mb-4 ms-4">
                <div className="absolute w-2 h-2 bg-gray-200 rounded-full mt-1.5 -start-1 border border-gray-400"></div>
                <h3 className="text-lg font-normal text-white pl-3">
                  Company Restructuring
                </h3>
              </li>
              <li className="mb-4 ms-4">
                <div className="absolute w-2 h-2 bg-gray-200 rounded-full mt-1.5 -start-1 border border-gray-400"></div>
                <h3 className="text-lg font-normal text-white pl-3">
                  Team & Management
                </h3>
              </li>
              <li className="mb-4 ms-4">
                <div className="absolute w-2 h-2 bg-gray-200 rounded-full mt-1.5 -start-1 border border-gray-400"></div>
                <h3 className="text-lg font-normal text-white pl-3">
                  Networking with Partners
                </h3>
              </li>
              <li className="mb-4 ms-4">
                <div className="absolute w-2 h-2 bg-gray-200 rounded-full mt-1.5 -start-1 border border-gray-400"></div>
                <h3 className="text-lg font-normal text-white pl-3">
                  {" "}
                  VC Networks
                </h3>
              </li>
              <li className="ms-4">
                <div className="absolute w-2 h-2 bg-gray-200 rounded-full mt-1.5 -start-1 border border-gray-400"></div>
                <h3 className="text-lg font-normal text-white pl-3">
                  Marketing & KOL Connects
                </h3>
              </li>
            </div>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;

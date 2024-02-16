import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import FounderInfo from "../Registration/FounderRegistration/FounderInfo";
import CompanyInfo from "../Registration/FounderRegistration/CompanyInfo";
import CompanyMetrics from "../Registration/FounderRegistration/CompanyMetrics";
import AdditionalInfo from "../Registration/FounderRegistration/AdditionalInfo";
import TeamDetails from "../Registration/FounderRegistration/TeamDetails";
import Header from "../Layout/Header/Header";
import { headerData } from "../Utils/Data/AllDetailFormData";
import Footer from "../Footer/Footer";
import p5 from "../../../assets/Founders/p5.png";
import astro1 from "../../../assets/images/astro1.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState(headerData[0].id);
  const [percentage, setPercentage] = useState(80);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabClassName = (tab) => {
    return `inline-block p-4 ${
      activeTab === tab
        ? "text-white border-b-2 "
        : "text-gray-400  border-transparent hover:text-white"
    } rounded-t-lg`;
  };

  const calculateProgressOffset = (progress) => {
    const radius = 47;
    const circumference = 2 * Math.PI * radius;
    return circumference - (progress / 100) * circumference;
  };

  return (
    <div className="font-fontUse">
      <Header gradient={"bg-violet-800"} />
      <div className="  bg-violet-800  text-white pt-4 md:px-[4%] px-[6%]">
        <div className="flex flex-row items-end">
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="ml-2 mr-1  text-xs pb-1 ">Complete your profile!</p>
          <svg
            width="18"
            height="18"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pb-1"
          >
            <g id="Alert 01">
              <circle
                id="Ellipse 1112"
                cx="11"
                cy="11"
                r="10"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                id="Vector"
                d="M10.992 14H11.001"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                id="Vector 2610"
                d="M11 11L11 7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        <div className="w-full flex flex-row items-center justify-between py-4 md:py-0">
          <div className="md:w-2/12 w-1/2 relative">
            <img
              className="w-full h-full justify-center rounded-full my-4"
              src={p5}
              alt="description"
            />

            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <svg className="absolute invisible">
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                    className="rounded"
                  >
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <CircularProgressbar
                value={percentage}
                strokeWidth={4}
                styles={buildStyles({
                  strokeLinecap: "round",
                  pathTransitionDuration: 0.5,
                  pathColor: `url(#progressGradient)`,
                  trailColor: "#303030",
                })}
              />

              <div
                className="absolute sm3:bottom-1 bottom-2 bg-gradient-to-r from-slate-300 to-blue-600 rounded-full z-10 lgx:w-[40px] lgx:h-[40px] md:w-[35px] md:h-[35px]  sm3:w-[30px] sm3:h-[30px] w-[20px] h-[20px] flex items-center justify-center"
                style={{boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.6)'}}
              >
                <div
                  className="p-3 md:text-[10px] sm3:text-[8px] text-[6px] font-bold"
                  style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}
                >
                  {`${percentage}%`}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-col ml-4 mt-2 md:mt-0 md:w-7/12 w-auto">
            <h1 className="md:text-3xl text-xl md:font-extrabold font-bold pb-2">
              Selena Gomez
            </h1>
            <p className="font-extralight text-sm">
              PANONY was established in March 2018 with operations in Greater
              China, South Korea.
            </p>
          </div>

          <div className="w-3/12">
            <img className="hidden md:block" src={astro1} alt="astro1" />
          </div>
        </div>
      </div>
      <section className="relative overflow-hidden">
        <div className="w-full h-fit px-[6%] lg1:px-[4%] py-[4%] lg1:py-[4%]">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[1850px] h-[2140px] rotate-180 flex-shrink-0 rounded-[2140px]  bg-gradient-to-r from-blue-900 from-0% to-fuchsia-700 to-100% blur-[200px]"></div>

          <div className="w-full h-full bg-gradient-to-r from-shadeBlue from-0% to-shadeSkyBlue to-100% shadow-custom rounded-md z-10 relative">
            <div className="text-sm font-medium text-center text-gray-200 ">
              <ul className="flex flex-wrap -mb-px text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer justify-around">
                {headerData.map((header) => (
                  <li key={header.id} className="me-2 relative group">
                    <button
                      className={getTabClassName(header.id)}
                      onClick={() => handleTabClick(header.id)}
                    >
                      <div className="hidden md:block">{header.label}</div>

                      <div className="flex md:hidden items-center">
                        {header.icon}
                      </div>
                    </button>
                    <div className="md:hidden">
                      <ReactTooltip
                        id={header.id}
                        place="bottom"
                        content={header.label}
                        className="z-10 "
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {activeTab === "founder" && <FounderInfo />}
            {activeTab === "company" && <CompanyInfo />}
            {activeTab === "metrics" && <CompanyMetrics />}
            {activeTab === "team" && <TeamDetails/>}
            {activeTab === "additional" && <AdditionalInfo />}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default UserProfile;

import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import FounderInfo from "../Registration/FounderRegistration/FounderInfo";
import CompanyInfo from "../Registration/FounderRegistration/CompanyInfo";
import CompanyMetrics from "../Registration/FounderRegistration/CompanyMetrics";
import AdditionalInfo from "../Registration/FounderRegistration/AdditionalInfo";
import TeamDetails from "../Registration/FounderRegistration/TeamDetails";
import { headerData } from "../Utils/Data/AllDetailFormData";
// import Footer from "../Footer/Footer";
import p5 from "../../../assets/Founders/p5.png";
import astro1 from "../../../assets/images/astro1.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import g1 from "../../../assets/ProfIleEdit/g1.png";
import g2 from "../../../assets/ProfIleEdit/g2.png";
import g3 from "../../../assets/ProfIleEdit/g3.png";
import g4 from "../../../assets/ProfIleEdit/g4.png";
import { useSelector } from "react-redux";
import MentorRegistration from "../Registration/MentorRegistration/MentorRegistration";
import MentorRegForm from "../RegForms.jsx/MentorRegForm";
import InvestorRegForm from "../RegForms.jsx/InvestorRegForm";
import CreateProjectRegistration from "../Project/CreateProject/CreateProjectRegistration";
import ProjectRegForm from "../RegForms.jsx/ProjectRegForm";

const UserProfile = () => {
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const [activeTab, setActiveTab] = useState(headerData[0].id);
  const [percentage, setPercentage] = useState(80);
  console.log("userFullData in profile page ===>", userFullData);
  console.log(
    "userCurrentRoleStatusActiveRole in userprofile !!!!!!!  ",
    userCurrentRoleStatusActiveRole
  );

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
    <div className="font-fontUse bg-gray-100 w-full mt-16">
      <div className="  bg-white  shadow-md shadow-gray-300 pb-6 text-black pt-4 rounded-lg md:mx-[6%] mx-[6%]">
        <div className="flex flex-row items-end px-10 space-y-4">
          <h1 className="md:text-4xl text-[20px] font-bold bg-gradient-to-r from-violet-900 to-sky-500 text-transparent bg-clip-text">
            My Profile
          </h1>
        </div>

        <div className="w-full px-10 flex md:flex-row flex-col items-center  justify-start py-4">
          <div
            className={`${userFullData?.bio?.[0] ? "md:w-44 w-36" : "w-36"}`}
          >
            <img
              className="w-full h-full justify-center rounded-full"
              src={userFullData?.profile_picture?.[0]}
              alt="description"
            />

            {/* <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
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
                style={{ boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.6)" }}
              >
                <div
                  className="p-3 md:text-[10px] sm3:text-[8px] text-[6px] font-bold"
                  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  {`${percentage}%`}
                </div>
              </div>
            </div> */}
          </div>
          <div className="flex flex-col ml-4 flex-wrap mt-2 w-auto">
            <h1 className="md:text-3xl text-xl md:font-extrabold font-bold pb-2 bg-gradient-to-r from-blue-900 to-sky-400 text-transparent bg-clip-text">
              {userFullData?.full_name}
            </h1>
            <p className="font-extralight text-xs md:w-3/6 text-black md:z-40 ">
              {userFullData?.bio?.[0]}
            </p>
            <p className="font-extralight text-xs md:w-3/6 text-black md:z-40 ">
              {userFullData?.country}
            </p>
          </div>

          <div className="hidden md:block z-10 absolute right-40 top-44">
            <div className="relative flex justify-center items-center">
              <div className="z-50 top-[40%] left-[45%]">
                <img src={g1} alt="g1" className="z-20 w-[500px] md:w-[270px] sm:w-[250px] sxs:w-[160px] md:h-56 relative  sxs:-right-3 right-16 md:right-0 sm:right-0 top-10 object-contain" />
              </div>
              <div className="absolute top-[43px] -left-[10%] sm:-left-[18%] md:left-[9%] sxs:left-[6%] w-[320px] h-[320px] md:w-[220px] md:h-[220px] sm:w-[230px] sm:h-[230px] sxs:w-[200px] sxs:h-[200px] rounded-full bg-gradient-to-r from-purple-300/40 to-purple-600"></div>
              <div className="absolute top-[200px]  sxs:top-[130px] left-[65%] sxs:left-[65%] w-[164px] h-[164px] md:w-[124px] md:h-[124px] sm:w-[94px] sm:h-[94px] sxs:w-[120px] sxs:h-[120px] rounded-full bg-gradient-to-r from-purple-900 to-blue-500 opacity-30"></div>
              <div className="absolute top-[120px] left-[45%] sxs:left-[53%] w-[190px] h-[200px] md:w-[140px] md:h-[150px] sm:w-[100px] sm:h-[110px] sxs:w-[120px] sxs:h-[120px] bg-gradient-to-b from-white/30 to-transparent rounded-lg backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden mt-6 md:mx-[6%] mx-[6%]">
        <div className="w-full h-fit">
          <div className="w-full h-full  rounded-md z-10 relative">
            {/* <div className="text-sm font-medium text-center text-gray-200 ">
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
            </div> */}
            {userCurrentRoleStatusActiveRole === "mentor" && <MentorRegForm />}
            {userCurrentRoleStatusActiveRole === "project" && (
              <ProjectRegForm />
            )}
            {userCurrentRoleStatusActiveRole === "vc" && <InvestorRegForm />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;

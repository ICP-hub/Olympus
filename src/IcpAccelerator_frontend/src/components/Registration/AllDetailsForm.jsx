import React, { useState } from "react";
// import Header from "../Layout/Header/Header";
import DetailHeroSection from "../Common/DetailHeroSection";
import DetailsCard from "../Common/DetailsCard";
import FooterWithSubmitSection from "../Footer/FooterWithSubmitSection";
import { mentorRegistration } from "../Utils/Data/AllDetailFormData";
import FounderRegistration from "./FounderRegistration/FounderRegistration";
import { useSelector } from "react-redux";

const AllDetailsForm = () => {

  const actor =useSelector((currState)=> currState.actors.actor)

  const [activeTab, setActiveTab] = useState(mentorRegistration[0].id);

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
 
  const checkActorWorking = async () => {
    if (!actor) {
      console.log("Actor is not initialized yet.");
      return;
    }
    const fetchAllHubs = await actor.get_icp_hubs_candid();
    console.log("dusra component mai data aaya hub ka=>", fetchAllHubs);
  };
  


  return (
    <>
      {/* <Header  gradient={'bg-violet-800'}/> */}
      <DetailHeroSection />
      <button onClick={checkActorWorking} className="bg-red-400 justify-center flex w-full z-1000">hub</button>

      <section className="relative overflow-hidden">
        <div className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%]">
          <div className="w-full h-[2200px] flex-shrink-0 bg-gradient-to-b from-[#F1EEF5] via-[#F1EEF5] to-transparent absolute"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[1850px] h-[2140px] rotate-180 flex-shrink-0 rounded-[2140px] bg-gradient-to-r from-[#FFD682] via-[#D377A6] to-[#9B67A8] blur-[200px]"></div>
          <div
            className="absolute bottom-[-1100px] left-1/2 transform -translate-x-1/2 w-[2105.733px] h-[2105.733px] flex-shrink-0 rounded-[2105.733px] opacity-70 bg-[linear-gradient(138deg,_#FFD682_40.24%,_#D377A6_49.28%,_#9B67A8_84.31%)] blur-[357.3500061035156px]"
            style={{ transform: "translateX(-50%) rotate(0.034deg)" }}
          ></div>
          <div
            className="w-[425px] h-[425px] flex-shrink-0 rounded-full opacity-60 bg-gradient-to-r from-purple-700 to-indigo-900 blur-[163px] absolute bottom-[-75px] left-[-180px] z-10"
            style={{ transform: "rotate(0.034deg)" }}
          ></div>
          <FounderRegistration/>
          {/* <MentorRegistration /> */}
          <div className="flex justify-center my-8">
            <div className="text-violet-900  text-sxxs:text-[11.5px] sxs:text-[12px] sxs1:text-[12.5px sxs2:text-[13px] sxs3:text-[13.5px] ss:text-[14px] ss1:text-[14.5px] ss2:text-[15px] ss3:text-[15.5px] ss4:text-[16px] dxs:text-[16.5px] xxs:text-[17px] xxs1:text-[17.5px] sm1:text-[18px] sm4:text-[18.5px] sm2:text-[19px] sm3:text-[19.5px] sm:text-[20px] md:text-[20.8px] md1:text-[21.5px] md2:text-[22px] md3:text-[22.5px] lg:text-[23px] dlg:text-[23.5px] lg1:text-[24px] lgx:text-[24.5px] dxl:text-[28px] xl:text-[25.5px] xl2:text-[26px] font-normal font-fontUse dxl:justify-center dxl:items-center dxl:flex   ss3:left-0 left-[14px] relative">
              Understand the Accelerate program
            </div>
          </div>
          <div className="top-[-350px] relative w-full mb-40">
            <DetailsCard width={"w-full"} top={"top-[370px]"} />
          </div>
        </div>
      </section>

      <FooterWithSubmitSection />
    </>
  );
};

export default AllDetailsForm;

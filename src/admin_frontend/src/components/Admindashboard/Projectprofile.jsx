import React, { useState } from "react";


import { headerData } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/AllDetailFormData";


import girl from "../../../../IcpAccelerator_frontend/assets/images/girl.jpeg"


import "react-circular-progressbar/dist/styles.css";
import { place, tick, star, Profile2 } from "../Utils/AdminData/SvgData";

import { useSelector } from "react-redux";



const Projectprofile = () => {
  const specificRole = useSelector(
    (currState) => currState.current.specificRole
  );

  const [activeTab, setActiveTab] = useState(headerData[0].id);

  const [showMore, setShowMore] = useState(false);

  // console.log('specificRole in userprofile !!!!!!!  ', specificRole)

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabClassName = (tab) => {
    return `inline-block p-4 ${activeTab === tab
      ? "text-white border-b-2 "
      : "text-gray-400  border-transparent hover:text-white"
      } rounded-t-lg`;
  };

  const calculateProgressOffset = (progress) => {
    const radius = 47;
    const circumference = 2 * Math.PI * radius;
    return circumference - (progress / 100) * circumference;
  };
  const handleReadMoreClick = () => {
    setShowMore(!showMore);
  };
  return (
    <>

      <h1 className="md:text-4xl text-[16px] font-bold bg-black text-transparent bg-clip-text">
        My Profile
      </h1>
      <div className="font-fontUse bg-gray-100 w-full mt-8 h-auto">
        <div className="  bg-white  shadow-md shadow-gray-300 pb-6 text-black pt-4 rounded-lg md:mx-[6%] mx-[6%]">
          <div className="flex flex-row items-end px-10">

            {/* <p className="ml-2 mr-1  text-gray-400 md:text-xs text-[10px] pb-1 ">
            Complete your profile!
          </p> */}

          </div>

          <div class="w-full px-10 flex flex-wrap flex-row md:items-center items-start  py-4">
            <div className="relative">
              <img
                className="w-32 h-32 justify-center rounded-full"
                src={girl}
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



              </div>
            </div>
            <div className="flex flex-col ml-4 flex-wrap mt-2 w-auto mr-80">
              <div className="flex flex-row flex-wrap gap-4">
                <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                  Name
                </h1>
                <div className="">
                  <p className="bg-[#2A353D] rounded-full text-white px-2">Project</p>
                </div>
              </div>
              <p className="font-extralight text-black  md:z-40 underline ">
                Senior SRE/Chaos Engineer/Speaker
              </p>
              <p>Site Reliability Engineer and DevOps Mentor</p>
              <div className="flex flex-row gap-2">
                {place}
                <p className="underline ">France</p>
              </div>
              <div className="flex flex-row gap-2">
                {star}
                <p>Active yesterday</p>
              </div>
              <div className="flex flex-row gap-2">
                {tick}
                <p>Usually responds in a few hours</p>
              </div>
              <p className="mt-8 text-black">Skills</p>
              <div className="flex flex-row gap-2 flex-wrap">
                <p className="bg-[#737373] underline rounded-full px-2">SRE</p>
                <p className="bg-[#737373] underline rounded-full px-2">Observability</p>
                <p className="bg-[#737373] underline rounded-full px-2">Kubernetes</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-center items-center">
                <button className="flex items-center md:w-[270px] xl:lg:w-[310px] h-[100px]
   bg-[#F28F1E] rounded-md">
                  <div className=" xl:lg:ml-4">{Profile2}</div>
                  <p className="flex justify-center items-center text-white p-2">This User also Project Profile Approved on 10 Feb, 2023</p>
                </button>
              </div>
              <div className="flex justify-center items-center">
                <button className="flex items-center md:w-[270px] xl:lg:w-[310px] h-[100px]
   bg-[#0071FF] rounded-md">
                  <div className="xl:lg:ml-4">{Profile2}</div>
                  <p className="flex justify-center items-center text-white p-2 text-sm">This User also Project Profile Approved on 10 Feb, 2023</p>
                </button>
              </div>

              <div className="flex justify-center items-center">
                <button className="flex items-center md:w-[270px] xl:lg:w-[310px] h-[100px]
   bg-[#FF3A41] rounded-md">
                  <div className="xl:lg:ml-4">{Profile2}</div>
                  <p className="flex justify-center items-center text-white p-2">Investor Profile request User on 10 April, 2023</p>
                </button>
              </div>
            </div>

          </div>
        </div>


      </div>
      <div className=" xl:w-7/12 w-full p-8 xl:md:ml-14 lg:ml-14 lg:w-7/12">
        <div className="flex  font-bold text-black text-xl ">
          <h1>About user</h1>
        </div>
        <div>
          <p>Akram RIAHI is an Site Reliability Engineer (SRE) with an interest in all things Cloud Native. He is passionate about kubernetes resilience and chaos engineering at scale and is Litmus Chaos leader. A curator of quality tech content, he is the author of several blog posts and organizer of the "Chaos Week" a week-long chaos engineering fest with great speakers aimed at cloud-native community in France.he is also a speaker in many global events such as conf42, chaosCarnival, Devoxx france.  {showMore && (
            <>
              Akram RIAHI is an Site Reliability Engineer (SRE) with an interest in all things Cloud Native. He is passionate about kubernetes resilience and chaos engineering at scale and is Litmus
            </>
          )}</p>
          <button className="underline text-black" onClick={handleReadMoreClick}>
            {showMore ? 'Read less' : 'Read more'}
          </button>
        </div>


      </div>
      <div className="p-8">
        <div className="w-full border-2 border-[#DCDCDC] xl:ml-12 lg:ml-12 "></div>
        <div className="text-black text-3xl font-bold">
          <h1 className="xl:md:ml-14 lg:ml-14">Skills</h1>
        </div>
        <div className="flex flex-col gap-2 xl:md:ml-14 lg:ml-14" >
          <div className="flex flex-row gap-2 flex-wrap mt-2 ">
            <p className="bg-gray-300 underline rounded-full px-2">SRE</p>
            <p className="bg-gray-300 underline rounded-full px-2">Observability</p>
            <p className="bg-gray-300 underline rounded-full px-2">Kubernetes</p>
          </div>
          <div className="flex flex-row gap-2 flex-wrap">
            <p className="bg-gray-300 underline rounded-full px-2">SRE</p>
            <p className="bg-gray-300 underline rounded-full px-2">Observability</p>
            <p className="bg-gray-300 underline rounded-full px-2">Kubernetes</p>
            <p className="underline rounded-full px-2">Observability</p>

          </div>
        </div>
        <div className="flex flex-row justify-end gap-2 space-x-2 mt-2">
          <button className="bg-red-900 rounded-md px-2 py-2 text-white font-bold">Reject Project</button>
          <button className="bg-[#3505B2] rounded-md px-2 py-2 text-white font-bold">Approved Project</button>
        </div>
      </div>
    </>
  );
};

export default Projectprofile;
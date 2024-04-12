import React, { useState } from "react";
import adminGif from "../../../../IcpAccelerator_frontend/assets/images/adminGif.gif";

import admin from "../../../../IcpAccelerator_frontend/assets/images/admin.gif";
import adminPI from "../../../../IcpAccelerator_frontend/assets/images/adminPerformanceIndicator.png";
import SubmitSection from "../../../../IcpAccelerator_frontend/src/components/Footer/SubmitSection";
import { useSelector } from "react-redux";
import ImpactTool from "../../../../IcpAccelerator_frontend/src/components/Dashboard/ImpactTool";

function AdminDashboard({ setModalOpen }) {
  const principal = useSelector((currState) => currState.internet.principal);

  const headerData = [
    {
      id: "description",
      label: "Project Details",
    },
    {
      id: "teamMember",
      label: "Team Members",
    },
    {
      id: "resources",
      label: "Resources",
    },
  ];
  const [activeTab, setActiveTab] = useState(headerData[0].id);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabClassName = (tab) => {
    return `inline-block p-1 ${
      activeTab === tab
        ? "border-b-2 border-[#3505B2]"
        : "text-[#737373]  border-transparent"
    } rounded-t-lg`;
  };

  const manageHandler = () => {
    !principal ? setModalOpen(true) : setModalOpen(false);
  };

  const responsiveText = ` text-gray-500 mb-6 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[15px] sm:text-[15.5px] md:text-[16px.3] md1:text-[17px] md2:text-[17.5px] md3:text-[18px] lg:text-[18.5px] dlg:text-[19px] lg1:text-[15.5px] lgx:text-[20px] md:text-[20.5px] xl:text-[21px] xl2:text-[21.5px]`;

  return (
    <section className="overflow-hidden relative bg-gray-100  w-full px-[4.5%]">
      <div className="font-fontUse flex flex-col w-full h-fit py-[2%]">
        <div>
          <div className="relative bg-white p-8 pt-16 rounded-lg">
            <h1 className="font-extrabold text-transparent lg:text-6xl text-3xl bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text mb-3">
              Effortless Administration Made Possible with Our Olympus
            </h1>
            <h6 className="text-xl font-[450] lg:w-[50%] w-[90%] mb-6">
              Take Control of Your Admin Operations with Olympus Dashboard and
              Optimize Your Workflow
            </h6>
            <button
              onClick={manageHandler}
              className="rounded-md my-2  bg-[#3505B2] text-white uppercase text-xs md:text-xs lg:text-xs xl:text-xs px-6 py-2 font-black p-3 text-wrap border-2 border-transparent z-20 hover:bg-transparent hover:text-[#3505B2] hover:border-[#3505B2] font-fontUse text-center"
            >
              Login as admin
            </button>
          </div>
          <div className="justify-end hidden lg:flex">
            <img src={adminGif} alt="gif" className="absolute top-[160px]" />
          </div>
        </div>

        <div className="flex flex-col flex-wrap justify-around lg:mt-80 mt-4 px-2">
          <div className="flex md:flex-row justify-evenly flex-col w-full">
            <div className="w-full md:w-[40%] mb-4 md:mb-8 ">
              <img src={adminPI} alt="progressImage" className="w-full" />
            </div>
            <div className="w-full md:w-[50%] md:pl-6 md:mb-0 mb-4">
              <p className="md:text-5xl text-2xl md:my-0 my-4 justify-start text-transparent bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text flex font-extrabold mx-auto pb-4">
                How we work
              </p>
              <div className="h-[200px] md:w-[450px] ">
                <p className="text-left md:text-xl  text-md font-normal flex flex-wrap">
                  Welcome to the Olympus Admin Dashboard on the Internet
                  Computer. This dashboard is designed to streamline your
                  administrative tasks, providing a robust interface for
                  managing data, users, and settings with efficiency and
                  security.
                </p>
              </div>
            </div>
          </div>
          <div className="mb-4 mt-3">
            <ImpactTool />
          </div>
        </div>

        <div className="mt-10 mb-10">
          <div className="w-full h-fit bg-indigo-300 rounded-md shadow-md p-4">
            <div className="relative flex flex-col md:flex-row items-center justify-start md:justify-center md:p-8">
              <div className="font-bold text-center flex flex-col md:mt-0 mt-2 justify-start mb-4 md:mb-0 md:w-full md:max-w-[450px] md:pr-4">
                <p className=" xl:lg:text-4xl flex justify-start  md:text-xl sm:text-lg text-transparent bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text font-extrabold">
                  Learn more about our Olympus program
                </p>
                <p className="text-white text-left mt-2 ml-2">
                  Web3 acceleration platform for founders, investors , mentors,
                  talent and users{" "}
                </p>
              </div>
              <div className="text-center md:text-right md:w-full md:max-w-[300px] md:pl-4">
                <img
                  className="h-auto w-full mx-auto md:mx-0"
                  src={admin}
                  alt="k"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-12">
          <SubmitSection />
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;

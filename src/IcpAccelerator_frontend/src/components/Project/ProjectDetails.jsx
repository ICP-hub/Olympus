import React,{useState} from "react";
import Header from "../Layout/Header/Header";
import Sidebar from "../Layout/SidePanel/Sidebar";
import Bottombar from "../Layout/BottomBar/Bottombar";
import ProjectGallery from "./ProjectGallery";
import ProjectLikedPeople from "./ProjectLikedPeople";
import { Tooltip as ReactTooltip } from "react-tooltip";

import ProjectDiscussion from "./ProjectDiscussion";
import ProjectRatings from "./ProjectRatings";
const ProjectDetails = () => {
  const headerData = [
    {
      id: "discussion",
      label: "Launch discussion",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="18"
          viewBox="0 0 576 512"
          fill="currentColor"
          data-tooltip-id="discussion"
        >
          <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
        </svg>
      ),
    },
    {
      id: "ratings",
      label: "Review & Ratings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="12"
          viewBox="0 0 384 512"
          fill="currentColor"
          data-tooltip-id="ratings"
        >
          <path d="M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z" />
        </svg>
      ),
    },]
  const [activeTab, setActiveTab] = useState(headerData[0].id);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabClassName = (tab) => {
    return `inline-block p-4 ${
      activeTab === tab
        ? "text-white border-b-2 "
        : "text-white  border-transparent hover:text-white"
    } rounded-t-lg`;
  };
  return (
    <section className="overflow-hidden relative">
      <Header gradient="bg-gradient-to-r from-purple-800 from-10% via-purple-700 via-60%   to-purple-600 to-90%" />
      <div className="w-[1279.64px] h-full opacity-70 bg-fuchsia-800 rounded-full blur-[169px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="font-fontUse w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gradient-to-br from-purple-800 from-10% via-purple-600 via-60%   to-violet-900 to-95%">
        <div className="w-full z-10 relative">
          <div className="flex ">
            <div className="w-2/8 relative hidden md:block">
              <Sidebar />
            </div>
            <div className="flex-col">
              <div className="w-full ml-8 text-white relative ">
                <ProjectGallery />
              </div>

              <div className="w-full ml-8 text-white relative ">
                <ProjectLikedPeople />
              </div>
              <div className="w-full h-full z-10 relative">
            <div className="text-sm font-extrabold text-center text-gray-200 ">
              <ul className="flex flex-wrap -mb-px text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer">
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
            {activeTab === "discussion" && <ProjectDiscussion />}
            {activeTab === "ratings" && <ProjectRatings />}

          
          </div>
            </div>
          </div>
        </div>
        <div className="w-[1805.43px] h-[1805.43px] bg-gradient-to-br from-amber-200 via-pink-400 to-zinc-400 rounded-full blur-[883.80px] absolute right-[670px] -bottom-[490px]"></div>
      </div>
      <div className="md:hidden">
        <Bottombar />
      </div>
    </section>
  );
};

export default ProjectDetails;

import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectDescription from "./ProjectDescription";
import ProjectInterestedPop from "./ProjectInterestedPop";
import Members from "../TeamMembers/Members";
import Details from "../Resources/Resources";
const ProjectDetails = () => {
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
  return (
    <section className="text-black bg-gray-100 pb-4">
      <div className="w-full px-[4%] lg1:px-[5%]">
        <div className="flex-col">
          <div className="py-4">
            <ProjectInterestedPop />
          </div>
          <div className="mb-4">
            <ProjectCard />
          </div>
          <div>
            <div className="text-sm font-extrabold text-center text-[#737373] ">
              <ul className="flex flex-wrap -mb-px text-[10px] ss2:text-[10.5px] ss3:text-[11px]  cursor-pointer">
                {headerData.map((header) => (
                  <li key={header.id} className="me-6 relative group">
                    <button
                      className={getTabClassName(header.id)}
                      onClick={() => handleTabClick(header.id)}
                    >
                      <div className="block">{header.label}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {activeTab === "description" && <ProjectDescription />}
            {activeTab === "teamMember" && <Members />}
            {activeTab === "resources" && <Details />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;

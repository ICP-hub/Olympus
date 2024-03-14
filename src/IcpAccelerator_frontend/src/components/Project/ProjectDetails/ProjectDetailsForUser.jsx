import React, { useState } from "react";
import ProjectCard from "../ProjectCard";
import ment from "../../../../assets/images/ment.jpg";
import MembersProfileCard from "../../TeamMembers/MembersProfileCard";
import ProjectRank from "../ProjectRank";
import ProjectReviewRatings from "../ProjectReviewRatings";
import ProjectRatings from "../ProjectRatings";
import Announcement from "./Announcement";
import ProjectJobCard from "./ProjectJobCard";

const ProjectDetailsForUser = () => {
  const headerData = [
    {
      id: "team-member",
      label: "team member",
    },
    {
      id: "mentor-partner-associated",
      label: "mentor / partner",
    },
    {
      id: "vc-associated",
      label: "vc",
    },
    {
      id: "review-ratings",
      label: "review & ratings",
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

  const renderComponent = () => {
    switch (activeTab) {
      case "team-member":
        return (
          <MembersProfileCard
            profile={true}
            type={true}
            name={true}
            role={true}
            socials={true}
            filter={"team"}
          />
        );
      case "mentor-partner-associated":
        return (
          <MembersProfileCard
            profile={true}
            type={true}
            name={true}
            role={true}
            socials={true}
            filter={"mentor"}
          />
        );
      case "vc-associated":
        return (
          <MembersProfileCard
            profile={true}
            type={true}
            name={true}
            role={true}
            socials={true}
            filter={"vc"}
          />
        );
      case "review-ratings":
        return <ProjectRatings />;
      default:
        return null;
    }
  };

  return (
    <section className="text-black bg-gray-100 pb-4">
      <div className="w-full px-[4%] lg1:px-[5%]">
        <div className="flex-col">
          <div className="mb-4">
            <ProjectCard
              image={ment}
              title={"builder.fi"}
              tags={["Defi", "NFT", "Game"]}
              doj={"28/May/2024"}
              country={"india"}
              website={"https://www.google.co.in/"}
              dapp={"https://6lqbm-ryaaa-aaaai-qibsa-cai.ic0.app/"}
            />
          </div>
          <div className="mb-4">
            <ProjectRank dayRank={true} weekRank={true} />
            <div className="text-sm font-extrabold text-center text-[#737373] mt-2">
              <ul className="flex flex-wrap -mb-px text-[10px] ss2:text-[10.5px] ss3:text-[11px]  cursor-pointer">
                {headerData.map((header) => (
                  <li key={header.id} className="me-6 relative group">
                    <button
                      className={getTabClassName(header?.id)}
                      onClick={() => handleTabClick(header?.id)}
                    >
                      <div className="uppercase">{header.label}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {renderComponent()}
          </div>
          <div>
            <Announcement />
          </div>
          <div className="mb-4 md1:w-1/2 w-full">
            <h1 className="font-[950] text-3xl text-[#000000] p-2">Jobs</h1>
            <ProjectJobCard
              image={ment}
              tags={["Imo", "Ludi", "Ndaru"]}
              country={"india"}
              website={"https://www.google.co.in/"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailsForUser;

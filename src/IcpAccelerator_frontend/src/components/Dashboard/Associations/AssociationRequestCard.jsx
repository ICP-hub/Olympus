import React, { useState, useMemo, useCallback } from "react";
import {
  MoreVert,
  Star,
  FavoriteBorder,
  PlaceOutlined as PlaceOutlinedIcon,
} from "@mui/icons-material";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import NeilProfileImages from "../../../../assets/Logo/NeilProfileImages.png";
import LeonProfileImage from "../../../../assets/Logo/LeonProfileImage.png";
import BlancheProfileImage from "../../../../assets/Logo/BlancheProfileImage.png";
import CypherpunkLabLogo from "../../../../assets/Logo/CypherpunkLabLogo.png";
import { FaFilter } from "react-icons/fa";
import ProjectAssociationFilter from "./ProjectAssociationFilter";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import AssociationDetailsProjectCard from "./AssociationDetailsProjectCard";
import AssociationDetailsCard from "./AssociationDetailsCard";
import AssociationDetailsInvestorCard from "./AssociationDetailsInvestorCard";

// Memoize AssociationDetailsCard and AssociationDetailsProjectCard
const MemoizedAssociationDetailsCard = React.memo(AssociationDetailsCard);
const MemoizedAssociationDetailsProjectCard = React.memo(AssociationDetailsProjectCard);
const MemoizedAssociationDetailsInvestorCard = React.memo(AssociationDetailsInvestorCard);



const AssociationRequestCard = () => {
  const [selectedTypeData, setSelectedTypeData] = useState("");
  const [activeTabData, setActiveTabTypeData] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [associateData, setAssociateData] = useState([]);
  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const userPrincipal = useSelector(
    (currState) => currState.internet.principal
  );
  const convertedPrincipal = Principal.fromText(userPrincipal);

  const projectId = projectFullData?.[0]?.[0]?.uid;

  const tagColors = useMemo(
    () => ({
      OLYMPIAN:
        "bg-[#F0F9FF] border-[#B9E6FE] border text-[#026AA2] rounded-md",
      FOUNDER: "bg-[#EEF4FF] border-[#C7D7FE] border text-[#3538CD] rounded-md",
      PROJECT: "bg-[#F8FAFC] text-[#364152] border border-[#E3E8EF] rounded-md",
      INVESTOR:
        "bg-[#FFFAEB] border-[#FEDF89] border text-[#B54708] rounded-md",
      TALENT: "bg-[#ECFDF3] border-[#ABEFC6] border text-[#067647] rounded-md",
    }),
    []
  );

  const toggleFilter = useCallback(() => {
    setFilterOpen((prev) => !prev);
  }, []);

  return (
    <div className="space-y-4 relative">
      <div className="flex gap-3 items-center p-6 w-[650px]">
        <div className="flex items-center border-2 border-gray-400 rounded-lg overflow-hidden w-full h-[50px]">
          <div className="flex items-center px-4">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search people, projects, jobs, events"
            className="w-full py-2 px-4 text-gray-700 focus:outline-none"
          />
          <div className="px-4">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 6h18M3 12h18m-7 6h7"
              ></path>
            </svg>
          </div>
        </div>
        <FaFilter
          onClick={toggleFilter}
          className="text-gray-400 text-2xl cursor-pointer"
        />
      </div>

      {associateData.map((user, index) => (
        <div key={user.username || index}>
          {userCurrentRoleStatusActiveRole === "project" ? (
            <MemoizedAssociationDetailsProjectCard
              user={user}
              index={index}
              selectedTypeData={selectedTypeData}
              activeTabData={activeTabData}
            />
          ) : userCurrentRoleStatusActiveRole === "mentor" ? (
            <MemoizedAssociationDetailsCard
              user={user}
              index={index}
              selectedTypeData={selectedTypeData}
              activeTabData={activeTabData}
            />
          ) : userCurrentRoleStatusActiveRole === "vc" ? (
            <MemoizedAssociationDetailsInvestorCard
            user={user}
            index={index}
            selectedTypeData={selectedTypeData}
            activeTabData={activeTabData}/>
          ) : (
            ""
          )}
        </div>
      ))}

      {filterOpen && (
        <ProjectAssociationFilter
          open={filterOpen}
          close={toggleFilter}
          projectId={projectId}
          userPrincipal={convertedPrincipal}
          associateData={associateData}
          setAssociateData={setAssociateData}
          setSelectedTypeData={setSelectedTypeData}
          selectedTypeData={selectedTypeData}
          setActiveTabTypeData={setActiveTabTypeData}
          activeTabData={activeTabData}
        />
      )}
    </div>
  );
};

export default AssociationRequestCard;

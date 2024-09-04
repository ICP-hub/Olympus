import React, { useState, useMemo, useCallback, useEffect } from "react";
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
import AssociationDetailsCard from "./AssociationDetailsMentorCard";
import AssociationDetailsInvestorCard from "./AssociationDetailsInvestorCard";
import NoData from "../../NoDataCard/NoData";
import DocumentRequestCard from "../../Request/DocumentRequestCard";
import MoneyRaiseRequestCard from "../../Request/MoneyRaiseRequestCard";
import CohortRequestCard from "../../Request/CohortRequestCard";

// Memoize AssociationDetailsCard and AssociationDetailsProjectCard
const MemoizedAssociationDetailsMentorCard = React.memo(AssociationDetailsCard);
const MemoizedAssociationDetailsProjectCard = React.memo(
  AssociationDetailsProjectCard
);
const MemoizedAssociationDetailsInvestorCard = React.memo(
  AssociationDetailsInvestorCard
);

const AssociationRequestCard = () => {
  const [selectedTypeData, setSelectedTypeData] = useState("");
  const [activeTabData, setActiveTabTypeData] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [associateData, setAssociateData] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("No Data Available");
  const [selectedType, setSelectedType] = useState("");

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

  console.log("selectedType", selectedType);
  useEffect(() => {
    // Set custom no data message based on role, active tab data, and selected type data
    if (associateData.length === 0) {
      if (userCurrentRoleStatusActiveRole === "project") {
        if (activeTabData === "pending") {
          if (selectedTypeData === "to-mentor") {
            setNoDataMessage("No pending requests sent to mentors.");
          } else if (selectedTypeData === "from-mentor") {
            setNoDataMessage("No pending requests received from mentors.");
          } else if (selectedTypeData === "to-investor") {
            setNoDataMessage("No pending requests sent to investors.");
          } else if (selectedTypeData === "from-investor") {
            setNoDataMessage("No pending requests received from investors.");
          } else {
            setNoDataMessage("No pending requests available.");
          }
        } else if (activeTabData === "approved") {
          if (selectedTypeData === "to-mentor") {
            setNoDataMessage("No approved requests sent to mentors.");
          } else if (selectedTypeData === "from-mentor") {
            setNoDataMessage("No approved requests received from mentors.");
          } else if (selectedTypeData === "to-investor") {
            setNoDataMessage("No approved requests sent to investors.");
          } else if (selectedTypeData === "from-investor") {
            setNoDataMessage("No approved requests received from investors.");
          } else {
            setNoDataMessage("No approved requests available.");
          }
        } else if (activeTabData === "declined") {
          if (selectedTypeData === "to-mentor") {
            setNoDataMessage("No declined requests sent to mentors.");
          } else if (selectedTypeData === "from-mentor") {
            setNoDataMessage("No declined requests received from mentors.");
          } else if (selectedTypeData === "to-investor") {
            setNoDataMessage("No declined requests sent to investors.");
          } else if (selectedTypeData === "from-investor") {
            setNoDataMessage("No declined requests received from investors.");
          } else {
            setNoDataMessage("No declined requests available.");
          }
        } else if (activeTabData === "self-reject") {
          if (selectedTypeData === "to-mentor") {
            setNoDataMessage("No self-rejected requests sent to mentors.");
          } else if (selectedTypeData === "from-mentor") {
            setNoDataMessage(
              "No self-rejected requests received from mentors."
            );
          } else if (selectedTypeData === "to-investor") {
            setNoDataMessage("No self-rejected requests sent to investors.");
          } else if (selectedTypeData === "from-investor") {
            setNoDataMessage(
              "No self-rejected requests received from investors."
            );
          } else {
            setNoDataMessage("No self-rejected requests available.");
          }
        } else {
          setNoDataMessage("No data available for projects.");
        }
      } else if (userCurrentRoleStatusActiveRole === "mentor") {
        if (activeTabData === "pending") {
          if (selectedTypeData === "to-project") {
            setNoDataMessage("No pending requests sent to projects.");
          } else if (selectedTypeData === "from-project") {
            setNoDataMessage("No pending requests received from projects.");
          } else {
            setNoDataMessage("No pending requests available.");
          }
        } else if (activeTabData === "approved") {
          if (selectedTypeData === "to-project") {
            setNoDataMessage("No approved requests sent to projects.");
          } else if (selectedTypeData === "from-project") {
            setNoDataMessage("No approved requests received from projects.");
          } else {
            setNoDataMessage("No approved requests available.");
          }
        } else if (activeTabData === "declined") {
          if (selectedTypeData === "to-project") {
            setNoDataMessage("No declined requests sent to projects.");
          } else if (selectedTypeData === "from-project") {
            setNoDataMessage("No declined requests received from projects.");
          } else {
            setNoDataMessage("No declined requests available.");
          }
        } else if (activeTabData === "self-reject") {
          if (selectedTypeData === "to-project") {
            setNoDataMessage("No self-rejected requests sent to projects.");
          } else if (selectedTypeData === "from-project") {
            setNoDataMessage(
              "No self-rejected requests received from projects."
            );
          } else {
            setNoDataMessage("No self-rejected requests available.");
          }
        } else {
          setNoDataMessage("No data available for mentors.");
        }
      } else if (userCurrentRoleStatusActiveRole === "vc") {
        if (activeTabData === "pending") {
          if (selectedTypeData === "to-project") {
            setNoDataMessage("No pending requests sent to projects.");
          } else if (selectedTypeData === "from-project") {
            setNoDataMessage("No pending requests received from projects.");
          } else {
            setNoDataMessage("No pending requests available.");
          }
        } else if (activeTabData === "approved") {
          if (selectedTypeData === "to-project") {
            setNoDataMessage("No approved requests sent to projects.");
          } else if (selectedTypeData === "from-project") {
            setNoDataMessage("No approved requests received from projects.");
          } else {
            setNoDataMessage("No approved requests available.");
          }
        } else if (activeTabData === "declined") {
          if (selectedTypeData === "to-project") {
            setNoDataMessage("No declined requests sent to projects.");
          } else if (selectedTypeData === "from-project") {
            setNoDataMessage("No declined requests received from projects.");
          } else {
            setNoDataMessage("No declined requests available.");
          }
        } else if (activeTabData === "self-reject") {
          if (selectedTypeData === "to-project") {
            setNoDataMessage("No self-rejected requests sent to projects.");
          } else if (selectedTypeData === "from-project") {
            setNoDataMessage(
              "No self-rejected requests received from projects."
            );
          } else {
            setNoDataMessage("No self-rejected requests available.");
          }
        } else {
          setNoDataMessage("No data available for VCs.");
        }
      } else {
        setNoDataMessage("No Data Available.");
      }
    }
  }, [
    associateData,
    activeTabData,
    selectedTypeData,
    userCurrentRoleStatusActiveRole,
  ]);

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

      {associateData.length === 0 ? (
        <NoData message={noDataMessage} />
      ) : (
        associateData.map(
          (user, index) => (
            console.log(user),
            (
              <div key={index}>
                {selectedType.value === "Associates" ? (
                  userCurrentRoleStatusActiveRole === "project" ? (
                    <MemoizedAssociationDetailsProjectCard
                      user={user}
                      index={index}
                      selectedTypeData={selectedTypeData}
                      activeTabData={activeTabData}
                    />
                  ) : userCurrentRoleStatusActiveRole === "mentor" ? (
                    <MemoizedAssociationDetailsMentorCard
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
                      activeTabData={activeTabData}
                    />
                  ) : (
                    ""
                  )
                ) : userCurrentRoleStatusActiveRole === "project" &&
                  selectedType.value === "Document" ? (
                  <DocumentRequestCard
                    user={user}
                    index={index}
                    activeTabData={activeTabData}
                  />
                ) : userCurrentRoleStatusActiveRole === "project" &&
                  selectedType.value === "FundRaised" ? (
                  <MoneyRaiseRequestCard
                    user={user}
                    index={index}
                    activeTabData={activeTabData}
                  />
                ) : userCurrentRoleStatusActiveRole === "mentor" || userCurrentRoleStatusActiveRole === "project" || userCurrentRoleStatusActiveRole === "vc" &&
                  selectedType.value === "CohortRequest" ? (
                  <CohortRequestCard
                    user={user}
                    index={index}
                    activeTabData={activeTabData}
                  />
                ) : (
                  ""
                )}
              </div>
            )
          )
        )
      )}

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
          setSelectedType={setSelectedType}
          selectedType={selectedType}
        />
      )}
    </div>
  );
};

export default AssociationRequestCard;

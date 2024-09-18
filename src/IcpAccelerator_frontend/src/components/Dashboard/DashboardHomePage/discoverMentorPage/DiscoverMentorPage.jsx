import React, { useState,useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DiscoverMentorDetail from "./DiscoverMentorDetail";
import DiscoverDocument from "./DiscoverDocument";
import DiscoverTeam from "./DiscoverTeam";
import DiscoverRatings from "../../../Discover/DiscoverRatings";
import MoneyRaising from "../../Project/NoMoneyRaisingCard";
import DiscoverMoneyRaising from "../../Project/DiscoverMoneyRais";
import DiscoverReview from "../../../Discover/DiscoverReview";

const DiscoverMentorPage = ({ openDetail, setOpenDetail, projectDetails ,projectId,userData,principal}) => {

    console.log('projectdetail in discovermentorpage',projectDetails)

    useEffect(() => {
        if (openDetail) {
            // Prevent background from scrolling when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Restore background scroll when modal is closed
            document.body.style.overflow = 'auto';
        }
        // Cleanup when the component is unmounted
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [openDetail]);

  const [activeTab, setActiveTab] = useState("document");

  const handleChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className={`w-full lg1:h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
        openDetail ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`mx-auto w-full sm:w-[70%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
          openDetail ? "translate-x-0" : "translate-x-full"
        } z-20`}
      >
        <div className="p-2 mb-2">
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setOpenDetail(false)}
          />
        </div>
        {/* <div className="container h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto">
          <div className="flex justify-evenly px-[1%]">
            <div className="border h-fit rounded-lg w-[30%]">
              <DiscoverMentorDetail projectDetails={projectDetails} userData={userData} />
            </div>

            <div className="p-3 w-[65%]">
              <div className="flex justify-start border-b">
                <button
                  className={`px-4 py-2 focus:outline-none font-medium  ${
                    activeTab === "document"
                      ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleChange("document")}
                >
                  Document
                </button>
                <button
                  className={`px-4 py-2 focus:outline-none font-medium  ${
                    activeTab === "team"
                      ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleChange("team")}
                >
                  Team
                </button>
                <button
                  className={`px-4 py-2 focus:outline-none font-medium  ${
                    activeTab === "ratings"
                      ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleChange("ratings")}
                >
                  Ratings
                </button>
                <button
                  className={`px-4 py-2 focus:outline-none font-medium  ${
                    activeTab === "moneyraised"
                      ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleChange("moneyraised")}
                >
                  Money Raised
                </button>
              </div>
              {activeTab === "document" && (
                <DiscoverDocument projectDetails={projectDetails} projectId={projectId} />
              )}
              {activeTab === "team" && (
                <DiscoverTeam projectDetails={projectDetails} />
              )}
              {activeTab === "ratings" && <DiscoverReview userData={userData} principalId={principal} />}
              {activeTab === "moneyraised" && <DiscoverMoneyRaising cardData={projectDetails} projectId={projectId}/>}
            </div>
          </div>
        </div> */}
         <div className="container mx-auto h-full pb-8 px-[4%] sm:px-[2%] overflow-y-scroll">
          <div className="flex flex-col gap-4 lg1:py-3 lg1:gap-0 lg1:flex-row w-full lg1:justify-evenly ">
            <div className="border rounded-lg w-full lg1:overflow-y-scroll lg1:w-[32%] ">
              <DiscoverMentorDetail projectDetails={projectDetails} userData={userData} />
            </div>

            <div className="px-1 lg1:px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll lg1:w-[63%] ">
              <div className="flex justify-start border-b">
                <button
                  className={`px-4 py-2 focus:outline-none font-medium  ${
                    activeTab === "document"
                      ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleChange("document")}
                >
                  Document
                </button>
                <button
                  className={`px-4 py-2 focus:outline-none font-medium  ${
                    activeTab === "team"
                      ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleChange("team")}
                >
                  Team
                </button>
                <button
                  className={`px-4 py-2 focus:outline-none font-medium  ${
                    activeTab === "ratings"
                      ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleChange("ratings")}
                >
                  Ratings
                </button>
                <button
                  className={`px-4 py-2 focus:outline-none font-medium  ${
                    activeTab === "moneyraised"
                      ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleChange("moneyraised")}
                >
                  Money Raised
                </button>
              </div>
              {activeTab === "document" && (
                <DiscoverDocument projectDetails={projectDetails} projectId={projectId} />
              )}
              {activeTab === "team" && (
                <DiscoverTeam projectDetails={projectDetails} />
              )}
              {activeTab === "ratings" && <DiscoverReview userData={userData} principalId={principal} />}
              {activeTab === "moneyraised" && <DiscoverMoneyRaising cardData={projectDetails} projectId={projectId}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverMentorPage;
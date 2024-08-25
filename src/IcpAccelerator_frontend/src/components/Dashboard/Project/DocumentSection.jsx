import React, { useState } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ProfileCard from './ProfileCard';
import TeamSection from './TeamSection';
import JobSection from './JobSection';
import FAQ from "./Faq";
import ProjectCard from './ProfileCard'; // Ensure this is correctly imported
import { shareSvgIcon, backSvg } from '../../Utils/Data/SvgData'; // Ensure this is correctly imported
import NotificationBanner from './Notification';
import { useLocation } from 'react-router-dom';
import { DocumentItem } from './DocumentUpload';

import NoMoneyRaising from './NoMoneyRaisingCard';
import NewDocument from './NewDocument';


function DocumentSection() {
  const [activeTab, setActiveTab] = useState("document");
  const [selectedOption, setSelectedOption] = useState("file");
  const handleChange = (tab) => {
    setActiveTab(tab);
  };
  const location = useLocation();

  const { projectId, cardData } = location.state || {};

  return (
    <div className="container mx-auto mb-5 bg-white">
      <div className="flex justify-between items-center mx-[3%] h-11 bg-opacity-95 -top-[.60rem] p-10 px-0 sticky bg-white z-20">
        
        
          <button className="flex items-center justify-center mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
           {backSvg} Back to profile
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            Share this<span>{shareSvgIcon}</span>
          </button>
       
      </div>
     <NotificationBanner message="Lorem ipsum dolor sit amet dolor."
          />
      <div className='flex justify-evenly'>
        <div className="w-[30%] ">
          <ProfileCard />
        </div>
        <div className='w-[60%]'>
          <div className="flex justify-start border-b">
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${
                activeTab === "document"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => handleChange("document")}
            >
              Documents
            </button>
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${
                activeTab === "team"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => handleChange("team")}
            >
              Team
            </button>
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${
                activeTab === "job"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => handleChange("job")}
            >
              Job
            </button>
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${
                activeTab === "rating"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => handleChange("rating")}
            >
              Rating
            </button>
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${
                activeTab === "rating"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => handleChange("raising")}
            >
              Money Rasing
            </button>
          </div>

          <div className="w-full">
            {activeTab === "document" && (
              <>
                <div className="p-6">
                  <DocumentItem 
                    title="Demo video"
                    description="Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla."
                    buttonText="Upload a file"
                    visibility="Visible to public"
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                  />
                  <NewDocument visibility="Visible to public"
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    cardData={cardData}
                    />
                </div>
                <FAQ />
              </>
            )}

            {activeTab === "team" && (
              <>
                <TeamSection 
                 data={projectId}
                 cardData={cardData}
                />
                <FAQ />
              </>
            )}

            {activeTab === "job" && (
              <>
                <JobSection />
                <FAQ />
              </>
            )}
            {activeTab === "raising" && (
              <>
               <NoMoneyRaising />
                
              </>
            )}

            {activeTab === "rating" && (
              <>
                <ProjectCard />
                <FAQ />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentSection;

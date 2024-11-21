// import React, { useState, useEffect } from "react";
// import CloseIcon from "@mui/icons-material/Close";
// import DiscoverMentorDetail from "./DiscoverMentorDetail";
// import DiscoverDocument from "./DiscoverDocument";
// import DiscoverTeam from "./DiscoverTeam";
// import DiscoverRatings from "../../../Discover/DiscoverRatings";
// import MoneyRaising from "../../Project/NoMoneyRaisingCard";
// import DiscoverMoneyRaising from "../../Project/DiscoverMoneyRais";
// import DiscoverReview from "../../../Discover/DiscoverReview";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// const DiscoverMentorPage = ({
//   openDetail,
//   setOpenDetail,
//   projectDetails,
//   projectId,
//   userData,
//   principal,
// }) => {
//   console.log("projectdetail in discovermentorpage", projectDetails);

//   useEffect(() => {
//     if (openDetail) {
//       // Prevent background from scrolling when modal is open
//       document.body.style.overflow = "hidden";
//     } else {
//       // Restore background scroll when modal is closed
//       document.body.style.overflow = "auto";
//     }
//     // Cleanup when the component is unmounted
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [openDetail]);

//   const [activeMobileTab, setActiveMobileTab] = useState(null);
//   const [activeTab, setActiveTab] = useState("document");
//   const uniqueActiveTabs = [...new Set(activeTab)];
//   const handleMobileTabToggle = (tab) => {
//     setActiveMobileTab((prevTab) => (prevTab === tab ? null : tab));
//   };

//   const handleChange = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <div
//       className={`w-full lg1:h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
//         openDetail ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       <div
//         className={`mx-auto w-full sm:w-[70%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
//           openDetail ? "translate-x-0" : "translate-x-full"
//         } z-20`}
//       >
//         <div className="p-2 mb-2">
//           <CloseIcon
//             sx={{ cursor: "pointer" }}
//             onClick={() => setOpenDetail(false)}
//           />
//         </div>
//         {/* <div className="container h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto">
//           <div className="flex justify-evenly px-[1%]">
//             <div className="border h-fit rounded-lg w-[30%]">
//               <DiscoverMentorDetail projectDetails={projectDetails} userData={userData} />
//             </div>

//             <div className="p-3 w-[65%]">
//               <div className="flex justify-start border-b">
//                 <button
//                   className={`px-4 py-2 focus:outline-none font-medium  ${
//                     activeTab === "document"
//                       ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//                       : "text-gray-400"
//                   }`}
//                   onClick={() => handleChange("document")}
//                 >
//                   Document
//                 </button>
//                 <button
//                   className={`px-4 py-2 focus:outline-none font-medium  ${
//                     activeTab === "team"
//                       ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//                       : "text-gray-400"
//                   }`}
//                   onClick={() => handleChange("team")}
//                 >
//                   Team
//                 </button>
//                 <button
//                   className={`px-4 py-2 focus:outline-none font-medium  ${
//                     activeTab === "ratings"
//                       ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//                       : "text-gray-400"
//                   }`}
//                   onClick={() => handleChange("ratings")}
//                 >
//                   Ratings
//                 </button>
//                 <button
//                   className={`px-4 py-2 focus:outline-none font-medium  ${
//                     activeTab === "moneyraised"
//                       ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//                       : "text-gray-400"
//                   }`}
//                   onClick={() => handleChange("moneyraised")}
//                 >
//                   Money Raised
//                 </button>
//               </div>
//               {activeTab === "document" && (
//                 <DiscoverDocument projectDetails={projectDetails} projectId={projectId} />
//               )}
//               {activeTab === "team" && (
//                 <DiscoverTeam projectDetails={projectDetails} />
//               )}
//               {activeTab === "ratings" && <DiscoverReview userData={userData} principalId={principal} />}
//               {activeTab === "moneyraised" && <DiscoverMoneyRaising cardData={projectDetails} projectId={projectId}/>}
//             </div>
//           </div>
//         </div> */}
//         <div className="container mx-auto h-full pb-8 px-[4%] sm:px-[2%] overflow-y-scroll">
//           <div className="flex flex-col gap-4 lg1:py-3 lg1:gap-0 lg1:flex-row w-full lg1:justify-evenly ">
//             <div className="border rounded-lg w-full lg1:overflow-y-scroll lg1:w-[32%] ">
//               <DiscoverMentorDetail
//                 projectDetails={projectDetails}
//                 userData={userData}
//               />
//             </div>

//             <div className="px-1 lg1:px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll lg1:w-[63%] ">
//               <div className="flex flex-col md1:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full mt-10 p-4 pt-2">
//                 {uniqueActiveTabs.includes("document") && (
//                   <div className="border-b">
//                     <button
//                       className="flex justify-between items-center w-full px-2 py-3 text-left text-gray-800"
//                       onClick={() => handleMobileTabToggle("document")}
//                     >
//                       Document
//                       {activeMobileTab === "document" ? (
//                         <FaChevronUp />
//                       ) : (
//                         <FaChevronDown />
//                       )}
//                     </button>
//                     {activeMobileTab === "document" && (
//                       <div className="px-2 py-2">
//                         <DiscoverDocument
//                           projectDetails={projectDetails}
//                           projectId={projectId}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {uniqueActiveTabs.includes("team") && (
//                   <div className="border-b">
//                     <button
//                       className="flex justify-between items-center w-full px-2 py-3 text-left text-gray-800"
//                       onClick={() => handleMobileTabToggle("team")}
//                     >
//                       Team
//                       {activeMobileTab === "team" ? (
//                         <FaChevronUp />
//                       ) : (
//                         <FaChevronDown />
//                       )}
//                     </button>
//                     {activeMobileTab === "team" && (
//                       <div className="px-2 py-2">
//                         <DiscoverTeam projectDetails={projectDetails} />
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {uniqueActiveTabs.includes("ratings") && (
//                   <div className="border-b">
//                     <button
//                       className="flex justify-between items-center w-full px-2 py-3 text-left text-gray-800"
//                       onClick={() => handleMobileTabToggle("ratings")}
//                     >
//                       {profilepage.ratingText}
//                       {activeMobileTab === "ratings" ? (
//                         <FaChevronUp />
//                       ) : (
//                         <FaChevronDown />
//                       )}
//                     </button>
//                     {activeMobileTab === "ratings" && (
//                       <div className="px-2 py-2">
//                         <DiscoverReview
//                           userData={userData}
//                           principalId={principal}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {uniqueActiveTabs.includes("moneyraised") && (
//                   <div className="border-b">
//                     <button
//                       className="flex justify-between items-center w-full px-2 py-3 text-left text-gray-800"
//                       onClick={() => handleMobileTabToggle("moneyraised")}
//                     >
//                       Money Raised
//                       {activeMobileTab === "moneyraised" ? (
//                         <FaChevronUp />
//                       ) : (
//                         <FaChevronDown />
//                       )}
//                     </button>
//                     {activeMobileTab === "moneyraised" && (
//                       <div className="px-2 py-2">
//                         <DiscoverMoneyRaising
//                           cardData={projectDetails}
//                           projectId={projectId}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="hidden md1:flex justify-start border-b">
//                 <button
//                   className={`px-4 py-2 focus:outline-none font-medium  ${
//                     activeTab === "document"
//                       ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//                       : "text-gray-400"
//                   }`}
//                   onClick={() => handleChange("document")}
//                 >
//                   Document
//                 </button>
//                 <button
//                   className={`px-4 py-2 focus:outline-none font-medium  ${
//                     activeTab === "team"
//                       ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//                       : "text-gray-400"
//                   }`}
//                   onClick={() => handleChange("team")}
//                 >
//                   Team
//                 </button>
//                 <button
//                   className={`px-4 py-2 focus:outline-none font-medium  ${
//                     activeTab === "ratings"
//                       ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//                       : "text-gray-400"
//                   }`}
//                   onClick={() => handleChange("ratings")}
//                 >
//                   Ratings
//                 </button>
//                 <button
//                   className={`px-4 py-2 focus:outline-none font-medium  ${
//                     activeTab === "moneyraised"
//                       ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//                       : "text-gray-400"
//                   }`}
//                   onClick={() => handleChange("moneyraised")}
//                 >
//                   Money Raised
//                 </button>
//               </div>
//               <div className="hidden md1:block">
//                 {activeTab === "document" && (
//                   <DiscoverDocument
//                     projectDetails={projectDetails}
//                     projectId={projectId}
//                   />
//                 )}
//                 {activeTab === "team" && (
//                   <DiscoverTeam projectDetails={projectDetails} />
//                 )}
//                 {activeTab === "ratings" && (
//                   <DiscoverReview userData={userData} principalId={principal} />
//                 )}
//                 {activeTab === "moneyraised" && (
//                   <DiscoverMoneyRaising
//                     cardData={projectDetails}
//                     projectId={projectId}
//                   />
//                 )}
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiscoverMentorPage;
import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DiscoverMentorDetail from './DiscoverMentorDetail';
import DiscoverDocument from './DiscoverDocument';
import DiscoverTeam from './DiscoverTeam';
import DiscoverRatings from '../../../Discover/DiscoverRatings';
import MoneyRaising from '../../Project/NoMoneyRaisingCard';
import DiscoverMoneyRaising from '../../Project/DiscoverMoneyRais';
import DiscoverReview from '../../../Discover/DiscoverReview';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import RatingComponent from '../../../../Rating/ProjectRating';

const DiscoverMentorPage = ({
  openDetail,
  setOpenDetails,
  setOpenDetail,
  projectDetails,
  projectId,
  userData,
  principal,
}) => {
  console.log('projectdetail in discovermentorpage', projectDetails);

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

  const [activeMobileTab, setActiveMobileTab] = useState(null);
  const [activeTab, setActiveTab] = useState('document');

  // Define available tabs
  const tabs = ['document', 'team', 'ratings', 'moneyraised', 'rubricrating'];

  const uniqueActiveTabs = [...new Set(tabs)];

  const handleMobileTabToggle = (tab) => {
    setActiveMobileTab((prevTab) => (prevTab === tab ? null : tab));
  };

  const handleChange = (tab) => {
    setActiveTab(tab);
  };
  const handleclose = () => {
    setOpenDetails(false);
    setOpenDetail(false);
  };

  return (
    <div
      className={`w-full lg1:h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
        openDetail ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div
        className={`mx-auto w-full sm:w-[70%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
          openDetail ? 'translate-x-0' : 'translate-x-full'
        } z-20`}
      >
        <div className='p-2 mb-2'>
          <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => handleclose()} />
        </div>

        <div className='container mx-auto h-full pb-8 px-[4%] sm:px-[2%] overflow-y-scroll'>
          <div className='flex flex-col gap-4 lg1:py-3 lg1:gap-0 lg1:flex-row w-full lg1:justify-evenly '>
            <div className='border rounded-lg w-full lg1:overflow-y-scroll lg1:w-[32%] '>
              <DiscoverMentorDetail
                projectDetails={projectDetails}
                userData={userData}
                projectId={projectId}
              />
            </div>

            <div className='px-1 lg1:px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll lg1:w-[63%] '>
              {/* Mobile Tabs */}
              <div className='flex flex-col md1:hidden bg-white rounded-lg shadow-sm border mb-4 border-gray-200 overflow-hidden w-full mt-10 p-4 pt-2'>
                {uniqueActiveTabs.includes('document') && (
                  <div className='border-b'>
                    <button
                      className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                      onClick={() => handleMobileTabToggle('document')}
                    >
                      Document
                      {activeMobileTab === 'document' ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                    {activeMobileTab === 'document' && (
                      <div className='px-2 py-2'>
                        <DiscoverDocument
                          projectDetails={projectDetails}
                          projectId={projectId}
                        />
                      </div>
                    )}
                  </div>
                )}

                {uniqueActiveTabs.includes('team') && (
                  <div className='border-b'>
                    <button
                      className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                      onClick={() => handleMobileTabToggle('team')}
                    >
                      Team
                      {activeMobileTab === 'team' ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                    {activeMobileTab === 'team' && (
                      <div className='px-2 py-2'>
                        <DiscoverTeam projectDetails={projectDetails} />
                      </div>
                    )}
                  </div>
                )}

                {uniqueActiveTabs.includes('ratings') && (
                  <div className='border-b'>
                    <button
                      className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                      onClick={() => handleMobileTabToggle('ratings')}
                    >
                      Ratings
                      {activeMobileTab === 'ratings' ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                    {activeMobileTab === 'ratings' && (
                      <div className='px-2 py-2'>
                        <DiscoverReview
                          userData={userData}
                          principalId={principal}
                        />
                      </div>
                    )}
                  </div>
                )}

                {uniqueActiveTabs.includes('moneyraised') && (
                  <div className='border-b'>
                    <button
                      className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                      onClick={() => handleMobileTabToggle('moneyraised')}
                    >
                      Money Raised
                      {activeMobileTab === 'moneyraised' ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                    {activeMobileTab === 'moneyraised' && (
                      <div className='px-2 py-2'>
                        <DiscoverMoneyRaising
                          cardData={projectDetails}
                          projectId={projectId}
                        />
                      </div>
                    )}
                  </div>
                )}

                {uniqueActiveTabs.includes('rubricrating') && (
                  <div className='border-b'>
                    <button
                      className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                      onClick={() => handleMobileTabToggle('rubricrating')}
                    >
                      Rubric Rating
                      {activeMobileTab === 'rubricrating' ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                    {activeMobileTab === 'rubricrating' && (
                      <div className='px-2 py-2'>
                        <RatingComponent projectId={projectId} value={false} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop Tabs */}
              <div className='hidden md1:flex justify-start border-b'>
                {uniqueActiveTabs.includes('document') && (
                  <button
                    className={`px-4 py-2 focus:outline-none font-medium ${
                      activeTab === 'document'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('document')}
                  >
                    Document
                  </button>
                )}

                {uniqueActiveTabs.includes('team') && (
                  <button
                    className={`px-4 py-2 focus:outline-none font-medium ${
                      activeTab === 'team'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('team')}
                  >
                    Team
                  </button>
                )}

                {uniqueActiveTabs.includes('ratings') && (
                  <button
                    className={`px-4 py-2 focus:outline-none font-medium ${
                      activeTab === 'ratings'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('ratings')}
                  >
                    Ratings
                  </button>
                )}

                {uniqueActiveTabs.includes('moneyraised') && (
                  <button
                    className={`px-4 py-2 focus:outline-none font-medium ${
                      activeTab === 'moneyraised'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('moneyraised')}
                  >
                    Money Raised
                  </button>
                )}
                {uniqueActiveTabs.includes('rubricrating') && (
                  <button
                    className={`px-4 py-2 focus:outline-none font-medium ${
                      activeTab === 'rubricrating'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('rubricrating')}
                  >
                    Rubric Rating
                  </button>
                )}
              </div>

              {/* Desktop Tab Content */}
              <div className='hidden md1:block mb-4'>
                {activeTab === 'document' && (
                  <DiscoverDocument
                    projectDetails={projectDetails}
                    projectId={projectId}
                  />
                )}
                {activeTab === 'team' && (
                  <DiscoverTeam projectDetails={projectDetails} />
                )}
                {activeTab === 'ratings' && (
                  <DiscoverReview userData={userData} principalId={principal} />
                )}
                {activeTab === 'moneyraised' && (
                  <DiscoverMoneyRaising
                    cardData={projectDetails}
                    projectId={projectId}
                  />
                )}
                {activeTab === 'rubricrating' && (
                  <RatingComponent projectId={projectId} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverMentorPage;

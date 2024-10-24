import React, { useState } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ProfileCard from './ProfileCard';
import TeamSection from './TeamSection';
import JobSection from './JobSection';
import FAQ from './Faq';
import ProjectCard from './ProfileCard'; // Ensure this is correctly imported
import { shareSvgIcon, backSvg } from '../../Utils/Data/SvgData'; // Ensure this is correctly imported
import NotificationBanner from './Notification';
import { useLocation } from 'react-router-dom';
import { DocumentItem } from './DocumentUpload';

import NoMoneyRaising from './NoMoneyRaisingCard';
import NewDocument from './NewDocument';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import RatingComponent from '../../../Rating/ProjectRating';
function DocumentSection() {
  const [activeTab, setActiveTab] = useState('document');
  const [selectedOption, setSelectedOption] = useState('file');
  const handleChange = (tab) => {
    setActiveTab(tab);
  };
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, cardData } = location.state || {};
  const [activeMobileTab, setActiveMobileTab] = useState(null);
  const handleMobileTabToggle = (activeTab) => {
    setActiveMobileTab((prevTab) => (prevTab === activeTab ? null : activeTab));
  };
  return (
    <div className='container mx-auto mb-5 bg-white'>
      <div className='flex justify-between items-center lg:mx-[3%] h-11 bg-opacity-95 -top-[1.60rem] md:-top-[.60rem] p-10 px-0 sticky bg-white z-20'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center justify-center mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200'
        >
          <span className='mr-1'>{backSvg}</span>

          <span className='hidden xxs1:block'> Back to profile</span>
        </button>
        <button className='flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200'>
          <span className='hidden xxs1:block'>Share this</span>
          <span className='ml-1'>{shareSvgIcon}</span>
        </button>
      </div>
      {/* <NotificationBanner message="Lorem ipsum dolor sit amet dolor."
          /> */}

      <div className='flex  flex-col dlg:flex-row justify-evenly'>
        <div className='dlg:w-[30%] w-full'>
          <ProfileCard cardData={cardData} />
        </div>

        <div className='dlg:w-[60%] hidden md:block w-full pt-12 dlg:pt-0'>
          <div className='flex justify-start border-b'>
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${
                activeTab === 'document'
                  ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                  : 'text-gray-400'
              }`}
              onClick={() => handleChange('document')}
            >
              Documents
            </button>
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
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${
                activeTab === 'job'
                  ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                  : 'text-gray-400'
              }`}
              onClick={() => handleChange('job')}
            >
              Job
            </button>
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${
                activeTab === 'raising'
                  ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                  : 'text-gray-400'
              }`}
              onClick={() => handleChange('raising')}
            >
              Money Rasing
            </button>
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${
                activeTab === 'rating'
                  ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                  : 'text-gray-400'
              }`}
              onClick={() => handleChange('rating')}
            >
              Rating
            </button>
          </div>

          <div className='w-full'>
            {activeTab === 'document' && (
              <>
                <div className='py-6'>
                  <NewDocument
                    visibility='Visible to public'
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    cardData={cardData}
                  />
                </div>
                <FAQ />
              </>
            )}

            {activeTab === 'team' && (
              <>
                <TeamSection data={projectId} cardData={cardData} />
                <FAQ />
              </>
            )}

            {activeTab === 'job' && (
              <>
                <JobSection />
                <FAQ />
              </>
            )}
            {activeTab === 'raising' && (
              <>
                <NoMoneyRaising cardData={cardData} data={projectId} />
              </>
            )}

            {activeTab === 'rating' && (
              <>
                <>
                  <RatingComponent />
                </>
                <FAQ />
              </>
            )}
          </div>
        </div>
      </div>

      <div className='block md:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full mt-10 p-8'>
        <div className=' border-b border-gray-300 '>
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
            <>
              <div className=''>
                <NewDocument
                  visibility='Visible to public'
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  cardData={cardData}
                />
              </div>
              <FAQ />
            </>
          )}
        </div>

        <div className=' border-b border-gray-300 '>
          <button
            className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
            onClick={() => handleMobileTabToggle('team')}
          >
            Team
            {activeMobileTab === 'team' ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {activeMobileTab === 'team' && (
            <>
              <TeamSection data={projectId} cardData={cardData} />
              <FAQ />
            </>
          )}
        </div>

        <div className=' border-b border-gray-300 '>
          <button
            className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
            onClick={() => handleMobileTabToggle('job')}
          >
            Job
            {activeMobileTab === 'job' ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {activeMobileTab === 'job' && (
            <>
              <JobSection />
              <FAQ />
            </>
          )}
        </div>

        <div className=' border-b border-gray-300 '>
          <button
            className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
            onClick={() => handleMobileTabToggle('raising')}
          >
            Money Rasing
            {activeMobileTab === 'raising' ? (
              <FaChevronUp />
            ) : (
              <FaChevronDown />
            )}
          </button>
          {activeMobileTab === 'raising' && (
            <>
              <NoMoneyRaising cardData={cardData} data={projectId} />
            </>
          )}
        </div>

        <div className=' border-b border-gray-300 '>
          <button
            className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
            onClick={() => handleMobileTabToggle('rating')}
          >
            Rating
            {activeMobileTab === 'rating' ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {activeMobileTab === 'rating' && (
            <>
              <>
                <RatingComponent />
              </>
              <FAQ />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentSection;

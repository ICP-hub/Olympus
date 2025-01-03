import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { profile } from '../Utils/jsondata/data/profileData';
import { shareSvgIcon } from '../Utils/Data/SvgData';
import ProjectCard from '../Dashboard/Project/ProjectCard';
import NewEvent from '../Dashboard/DashboardEvents/NewEvent';
import JobSection from '../Dashboard/Project/JobSection';
import FAQ from '../Dashboard/Project/Faq';
import AssociationRequestCard from '../Dashboard/Associations/AssociationRequestCard';
import ProfileDetail from '../ProfileEdit/ProfileDetail';
import Role from './Role';
import Announcement from './Announcement';
import RatingPage from './RatingPage';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ShareModal from '../Dashboard/DashboardEvents/EventshareModel';
import { ProfileSkeleton } from './skeletonProfile/ProfilePageSkeleton';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [activeMobileTab, setActiveMobileTab] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profilepage } = profile;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const userRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  // Function to get approved roles
  const getApprovedRoles = (rolesStatusArray) => {
    return rolesStatusArray
      .filter((role) => role.approval_status === 'active')
      .map((role) => role.name);
  };

  const approvedRoles = getApprovedRoles(userCurrentRoleStatus);

  // Define the tabs visibility based on approved roles
  const tabs = {
    user: ['roles', 'rating'],
    project: [
      'roles',
      'project',
      'rating',
      'association-req',
      'job',
      'announcement',
    ],
    mentor: [
      'roles',
      'rating',
      'cohort',
      'job',
      'association-req',
      'announcement',
    ],
    vc: ['roles', 'rating', 'job', 'announcement', 'association-req'],
  };

  const activeTabs = tabs[userRole] || ['roles', 'rating'];
  const uniqueActiveTabs = [...new Set(activeTabs)];
  const actor = useSelector((currState) => currState.actors.actor);

  const handleChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMobileTabToggle = (tab) => {
    setActiveMobileTab((prevTab) => (prevTab === tab ? null : tab));
  };

  const shareUrl = `${window.location.origin}/dashboard/profile`;

  const [loadingView, setIsLoadingView] = useState(true);
  const [reviews, setReviews] = useState([]);
  const isMounted = useRef(false);

  const addProfileView = async (caller, isSelfView) => {
    try {
      console.log('Attempting to add profile view...');
      await caller.add_view(isSelfView).then((result) => {
        console.log('API call successful, processing response...');

        if (isMounted.current) {
          console.log('Response from API:', result);
          if (result?.Ok) {
            console.log('Profile view recorded:', result.Ok);
            setReviews(result.Ok);
          } else {
            console.log('Warning from API:', result.Warning);
            setReviews([]);
          }
          setIsLoadingView(false);
        }
      });
    } catch (error) {
      if (isMounted.current) {
        console.error('Error adding profile view:', error);
        setReviews([]);
        setIsLoadingView(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;

    if (actor) {
      addProfileView(actor, true);
    }

    return () => {
      isMounted.current = false;
    };
  }, [actor]);

  return (
    <>
      <div className='container mx-auto mb-5 bg-white px-4 md:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row justify-between md:items-center mx-auto py-6 md:py-10 lgx:ml-[3.3%] -mt-[1.1rem] md:mt-0  md:h-11 bg-opacity-95 -top-[1.1rem] md:top-0 sticky bg-white z-20'>
          <div>
            <h2 className='text-2xl font-bold '>{profilepage.profileText}</h2>
          </div>
          {/* <div className="flex    md:gap-4 w-full justify-between my-2 md:my-0"> */}
          {/* <div className="flex gap-2 md:gap-4 w-full justify-between md:justify-end my-2 md:my-0">
          <button className="mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            {profilepage.viewPublicProfileText}
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200"  onClick={() => setIsModalOpen(true)}>
            {profilepage.shareText} <span>{shareSvgIcon}</span>
          </button>
        </div> */}
        </div>

        {/* Profile and Content Sections */}
        <div className='container flex flex-col lgx:flex-row justify-evenly'>
          {/* Profile Details */}
          {!isLoading ? (
            <div className='w-full lgx:w-[30%] mb-6 md:mb-0'>
              <ProfileDetail />
            </div>
          ) : (
            <div className='w-full lgx:w-[30%] mb-6 md:mb-0'>
              <ProfileSkeleton />
            </div>
          )}

          {/* Main Content with Tabs */}
          <div className='w-full lgx:w-[60%] flex flex-col md:pt-12 lgx:pt-0'>
            {/* Tabs for Mobile */}
            <div className='block md:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full mt-4 p-4 pt-2'>
              {uniqueActiveTabs.includes('roles') && (
                <div className='border-b'>
                  <button
                    className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                    onClick={() => handleMobileTabToggle('roles')}
                  >
                    {profilepage.roleText}
                    {activeMobileTab === 'roles' ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {activeMobileTab === 'roles' && (
                    <div className='px-2 py-2'>
                      <Role />
                    </div>
                  )}
                </div>
              )}

              {uniqueActiveTabs.includes('project') && (
                <div className='border-b'>
                  <button
                    className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                    onClick={() => handleMobileTabToggle('project')}
                  >
                    Project
                    {activeMobileTab === 'project' ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {activeMobileTab === 'project' && (
                    <div className='px-2 py-2'>
                      <ProjectCard />
                    </div>
                  )}
                </div>
              )}

              {uniqueActiveTabs.includes('cohort') && (
                <div className='border-b'>
                  <button
                    className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                    onClick={() => handleMobileTabToggle('cohort')}
                  >
                    Cohort
                    {activeMobileTab === 'cohort' ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {activeMobileTab === 'cohort' && (
                    <div className='px-2 py-2'>
                      <NewEvent />
                    </div>
                  )}
                </div>
              )}

              {uniqueActiveTabs.includes('job') && (
                <div className='border-b'>
                  <button
                    className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                    onClick={() => handleMobileTabToggle('job')}
                  >
                    Job
                    {activeMobileTab === 'job' ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {activeMobileTab === 'job' && (
                    <div className='px-2 py-2'>
                      <JobSection />
                      <FAQ />
                    </div>
                  )}
                </div>
              )}

              {uniqueActiveTabs.includes('announcement') && (
                <div className='border-b'>
                  <button
                    className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                    onClick={() => handleMobileTabToggle('announcement')}
                  >
                    Announcement
                    {activeMobileTab === 'announcement' ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {activeMobileTab === 'announcement' && (
                    <div className='px-2 py-2'>
                      <Announcement />
                    </div>
                  )}
                </div>
              )}

              {uniqueActiveTabs.includes('association-req') && (
                <div className='border-b'>
                  <button
                    className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                    onClick={() => handleMobileTabToggle('association-req')}
                  >
                    Request
                    {activeMobileTab === 'association-req' ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {activeMobileTab === 'association-req' && (
                    <div className='px-2 py-2'>
                      <AssociationRequestCard />
                    </div>
                  )}
                </div>
              )}

              {uniqueActiveTabs.includes('rating') && (
                <div className='border-b'>
                  <button
                    className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                    onClick={() => handleMobileTabToggle('rating')}
                  >
                    {profilepage.ratingText}
                    {activeMobileTab === 'rating' ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {activeMobileTab === 'rating' && (
                    <div className='px-2 py-2'>
                      <RatingPage />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tabs for Desktop and Tablets */}
            <div className='hidden md:block'>
              <div className='overflow-x-auto text-nowrap flex flex-col md:flex-row justify-start border-b'>
                {uniqueActiveTabs.includes('roles') && (
                  <button
                    className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base focus:outline-none font-medium ${
                      activeTab === 'roles'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('roles')}
                  >
                    {profilepage.roleText}
                  </button>
                )}
                {uniqueActiveTabs.includes('project') && (
                  <button
                    className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base focus:outline-none font-medium ${
                      activeTab === 'project'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('project')}
                  >
                    Project
                  </button>
                )}
                {uniqueActiveTabs.includes('cohort') && (
                  <button
                    className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base focus:outline-none font-medium ${
                      activeTab === 'cohort'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('cohort')}
                  >
                    Cohort
                  </button>
                )}
                {uniqueActiveTabs.includes('job') && (
                  <button
                    className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base focus:outline-none font-medium ${
                      activeTab === 'job'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('job')}
                  >
                    Job
                  </button>
                )}
                {uniqueActiveTabs.includes('announcement') && (
                  <button
                    className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base focus:outline-none font-medium ${
                      activeTab === 'announcement'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('announcement')}
                  >
                    Announcement
                  </button>
                )}
                {uniqueActiveTabs.includes('association-req') && (
                  <button
                    className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base focus:outline-none font-medium ${
                      activeTab === 'association-req'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('association-req')}
                  >
                    Request
                  </button>
                )}
                {uniqueActiveTabs.includes('rating') && (
                  <button
                    className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base focus:outline-none font-medium ${
                      activeTab === 'rating'
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleChange('rating')}
                  >
                    {profilepage.ratingText}
                  </button>
                )}
              </div>

              {/* Tab Content for Desktop */}
              <div className='w-full'>{activeTab === 'roles' && <Role />}</div>
              <div className='w-full'>
                {activeTab === 'project' && <ProjectCard />}
              </div>
              <div className='w-full'>
                {activeTab === 'association-req' && <AssociationRequestCard />}
              </div>
              <div className='w-full'>
                {activeTab === 'cohort' && <NewEvent />}
              </div>
              <div className='w-full'>
                {activeTab === 'job' && (
                  <>
                    <JobSection />
                    <FAQ />
                  </>
                )}
              </div>
              <div className='w-full'>
                {activeTab === 'announcement' && <Announcement />}
              </div>
              <div className='w-full'>
                {activeTab === 'rating' && <RatingPage />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ShareModal onClose={() => setIsModalOpen(false)} shareUrl={shareUrl} />
      )}
    </>
  );
};

export default ProfilePage;

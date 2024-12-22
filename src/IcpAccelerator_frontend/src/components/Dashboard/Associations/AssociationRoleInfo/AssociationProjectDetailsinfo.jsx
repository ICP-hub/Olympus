import React, { useState } from 'react';
import DiscoverDocument from '../../DashboardHomePage/discoverMentorPage/DiscoverDocument';
import DiscoverTeam from '../../DashboardHomePage/discoverMentorPage/DiscoverTeam';
import DiscoverRatingforAssociation from '../../../Discover/DiscoverRatingsforAssociation';
import DiscoverMoneyRaising from '../../Project/DiscoverFundingCard';
import uint8ArrayToBase64 from '../../../Utils/uint8ArrayToBase64';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import NoData from '../../../NoDataCard/NoData';
import AssociationCohortData from '../AssociationCohortData';
const AssociationProjectDetailsinfo = ({ key, user }) => {
  const [activeMobileTab, setActiveMobileTab] = useState(null);
  const [activeTab, setActiveTab] = useState('document');

  const tabs = ['document', 'team', 'ratings', 'moneyraised', 'review'];
  const uniqueActiveTabs = [...new Set(tabs)];

  const handleMobileTabToggle = (tab) => {
    setActiveMobileTab((prevTab) => (prevTab === tab ? null : tab));
  };
  const handleChange = (tab) => {
    setActiveTab(tab);
  };

  // Offer details
  let offer = user?.offer ?? 'offer';
  let offerId = user?.offer_id ?? 'offerId';
  let acceptedAt = user?.accepted_at ?? 0n;
  let declinedAt = user?.declined_at ?? 0n;
  let selfDeclinedAt = user?.self_declined_at ?? 0n;

  // Receiver details
  let receiverPrincipal =
    user?.receiever_principal ?? 'Principal not available';

  let cohortData = user?.cohort_data ?? 'Cohort not available';

  // Receiver Data
  let recieverDataProject =
    Array.isArray(user?.reciever_data) &&
    Array.isArray(user?.reciever_data[0]) &&
    user?.reciever_data[0][0]
      ? user.reciever_data[0][0]
      : {}; // Default to an empty object

  let recieverDataUser =
    Array.isArray(user?.reciever_data) && user?.reciever_data[0]?.[1]
      ? user.reciever_data[0][1]
      : {}; // Default to an empty object

  console.log('mentor detail on page ', recieverDataProject);
  let recieverYearsOfMentoring =
    recieverDataProject?.profile?.years_of_mentoring ?? 'No Experience';
  let recieverIcpHubOrSpoke =
    recieverDataProject?.profile?.icp_hub_or_spoke ?? false;
  let recieverHubOwner =
    recieverDataProject?.profile?.hub_owner?.[0] ?? 'Hub not available';
  let recieverWebsite =
    recieverDataProject?.profile?.website?.[0] ?? 'https://defaultwebsite.com';
  let recieverExistingIcpMentor =
    recieverDataProject?.profile?.existing_icp_mentor ?? false;
  let recieverCategoryOfMentoringService =
    recieverDataProject?.profile?.category_of_mentoring_service ??
    'Category not available';

  // User Details (Index 1)
  let userFullName =
    recieverDataUser?.params?.full_name ?? 'User Name not available';
  let userProfilePicture = recieverDataUser?.params?.profile_picture?.[0]
    ? uint8ArrayToBase64(recieverDataUser?.params?.profile_picture?.[0])
    : '../../../assets/Logo/CypherpunkLabLogo.png';
  let userUserName =
    recieverDataUser?.params?.openchat_username?.[0] ??
    'Username not available';
  let userEmail = recieverDataUser?.params?.email?.[0] ?? 'email@example.com';
  let userCountry =
    recieverDataUser?.params?.country ?? 'Country not available';
  let userBio = recieverDataUser?.params?.bio?.[0] ?? 'Bio not available';
  let userAreaOfInterest =
    recieverDataUser?.params?.area_of_interest ??
    'Area of Interest not available';
  let userReasonToJoin =
    recieverDataUser?.params?.reason_to_join?.[0] ??
    'Reason to join not available';
  let userTypeOfProfile =
    recieverDataUser?.params?.type_of_profile?.[0] ?? 'individual';
  let userSocialLinks =
    recieverDataUser?.params?.social_links ?? 'No social links available';

  // Sender Data
  let senderDataProject =
    Array.isArray(user?.sender_data) &&
    Array.isArray(user?.sender_data[0]) &&
    user?.sender_data[0][0]
      ? user.sender_data[0][0]
      : {}; // Default to an empty object

  let senderDataUser =
    Array.isArray(user?.sender_data) && user?.sender_data[0]?.[1]
      ? user.sender_data[0][1]
      : {}; // Default to an empty object
  console.log('sender user data 478 ', senderDataUser);
  console.log('project data', senderDataProject);

  let projectid = senderDataProject.uid;
  console.log(projectid);
  console.log(
    'ye vala hai hai data jo bhej rha hu money ka ',
    senderDataProject?.params
  );

  // Project Details (Index 0)
  let projectSocialLinks = senderDataProject?.params?.social_links?.[0];
  ('No social links available');
  console.log('project social links', projectSocialLinks);
  let projectName =
    senderDataProject?.params?.project_name ?? 'Project Name not available';

  let projectDescription =
    senderDataProject?.params?.project_description?.[0] ??
    'Project description not available';
  let projectWebsite =
    senderDataProject?.params?.project_website?.[0] ??
    'https://defaultwebsite.com';
  let projectElevatorPitch =
    senderDataProject?.params?.project_elevator_pitch?.[0] ??
    'No project elevator pitch available';
  let dappLink =
    senderDataProject?.params?.dapp_link?.[0] ?? 'No dapp link available';
  let preferredIcpHub =
    senderDataProject?.params?.preferred_icp_hub?.[0] ?? 'Hub not available';
  let longTermGoals =
    senderDataProject?.params?.long_term_goals?.[0] ??
    'Long term goals not available';
  let revenue = senderDataProject?.params?.revenue?.[0] ?? 0n;
  let weeklyActiveUsers =
    senderDataProject?.params?.weekly_active_users?.[0] ?? 0n;
  let supportsMultichain =
    senderDataProject?.params?.supports_multichain?.[0] ??
    'Chain not available';
  let technicalDocs =
    senderDataProject?.params?.technical_docs?.[0] ??
    'No technical docs available';
  let tokenEconomics =
    senderDataProject?.params?.token_economics?.[0] ??
    'No token economics available';
  let targetMarket =
    senderDataProject?.params?.target_market?.[0] ??
    'Target market not available';
  let moneyRaisedTillNow =
    senderDataProject?.params?.money_raised_till_now?.[0] ?? false;
  let isYourProjectRegistered =
    senderDataProject?.params?.is_your_project_registered?.[0] ?? false;
  let liveOnIcpMainnet =
    senderDataProject?.params?.live_on_icp_mainnet?.[0] ?? false;
  let uploadPrivateDocuments =
    senderDataProject?.params?.upload_private_documents?.[0] ?? false;
  let typeOfRegistration =
    senderDataProject?.params?.type_of_registration?.[0] ?? 'N/A';
  let projectAreaOfFocus =
    senderDataProject?.params?.project_area_of_focus ?? ' Not Available';
  let reasontojoinincubator =
    senderDataProject?.params?.reason_to_join_incubator ?? 'Not Available';

  let projectCover = senderDataProject?.params?.project_cover?.[0]
    ? uint8ArrayToBase64(senderDataProject?.params?.project_cover?.[0])
    : '../../../assets/Logo/CypherpunkLabLogo.png';
  let projectLogo = senderDataProject?.params?.project_logo?.[0]
    ? uint8ArrayToBase64(senderDataProject?.params?.project_logo?.[0])
    : '../../../assets/Logo/CypherpunkLabLogo.png';
  let countryofregistration =
    senderDataProject?.params?.country_of_registration?.[0] ?? 'Not Available';
  // User Details within Sender Data (Index 1)
  let senderFullName = senderDataUser?.params?.full_name ?? 'Not Available';
  let senderProfilePicture = senderDataUser?.params?.profile_picture?.[0]
    ? uint8ArrayToBase64(senderDataUser?.params?.profile_picture?.[0])
    : '../../../assets/Logo/CypherpunkLabLogo.png';
  let senderUserName =
    senderDataUser?.params?.openchat_username?.[0] ?? 'Not Available';
  let senderEmail = senderDataUser?.params?.email?.[0] ?? 'sender@example.com';
  let senderCountry = senderDataUser?.params?.country ?? 'Not Available';
  let senderBio = senderDataUser?.params?.bio?.[0] ?? 'Not Available';
  let senderAreaOfInterest =
    senderDataUser?.params?.area_of_interest ?? 'Not Available';
  let senderReasonToJoin =
    senderDataUser?.params?.reason_to_join?.[0] ?? 'Not Available';
  let senderTypeOfProfile =
    senderDataUser?.params?.type_of_profile?.[0] ?? 'individual';
  let senderSocialLinks = senderDataUser?.params?.social_links?.[0];
  ('No social links available');
  console.log('sender social links', senderSocialLinks);

  //Sender Mentor Details at index[0]
  let senderYearsOfMentoring =
    senderDataProject?.profile?.years_of_mentoring ?? '0';
  let senderAreaOfExpertise =
    senderDataProject?.profile?.area_of_expertise ?? [];
  let senderCategoryOfMentoringService =
    senderDataProject?.profile?.category_of_mentoring_service ?? '';
  let senderExistingIcpMentor =
    senderDataProject?.profile?.existing_icp_mentor ?? false;
  let senderExistingIcpProjectPortfolio =
    senderDataProject?.profile?.existing_icp_project_porfolio ?? [];
  let senderHubOwner = senderDataProject?.profile?.hub_owner ?? [];
  let senderIcpHubOrSpoke =
    senderDataProject?.profile?.icp_hub_or_spoke ?? false;
  let senderLinks = senderDataProject?.profile?.links ?? [];
  let senderMultichain = senderDataProject?.profile?.multichain[0] ?? [];
  let senderPreferredIcpHub =
    senderDataProject?.profile?.preferred_icp_hub ?? [];
  let senderReasonForJoining =
    senderDataProject?.profile?.reason_for_joining ?? [];
  let senderWebsite =
    senderDataProject?.profile?.website?.[0] ?? 'https://defaultwebsite.com';
  let mentorSocialLinks = senderDataProject?.profile?.social_links?.[0];
  ('No social links available');
  console.log('mentor social links', mentorSocialLinks);

  //Investor  Details at index[0]
  let fundName = senderDataProject?.name_of_fund ?? 'N/A';
  let categoryOfInvestment = senderDataProject?.category_of_investment ?? 'N/A';

  let fundSize = senderDataProject?.fund_size ?? 'N/A';
  let moneyInvested = senderDataProject?.money_invested ?? 'N/A';
  let investorType = senderDataProject?.investor_type ?? [];
  let portfolioLink = senderDataProject?.portfolio_link ?? 'N/A';
  let stage = senderDataProject?.stage ?? [];
  let preferredIcpHubforInvestor =
    senderDataProject?.preferred_icp_hub ?? 'N/A';
  let projectOnMultichain = senderDataProject?.project_on_multichain ?? [];
  let averageCheckSize = senderDataProject?.average_check_size ?? 'N/A';
  // let rangeOfCheckSize = senderDataProject?.range_of_check_size[0] ?? "N/A";
  let numberOfPortfolioCompanies =
    senderDataProject?.number_of_portfolio_companies ?? 'N/A';
  let registered = senderDataProject?.registered ?? false;
  let registeredCountry = senderDataProject?.registered_country ?? 'N/A';
  let typeOfInvestment = senderDataProject?.type_of_investment ?? 'N/A';
  let websiteLink = senderDataProject?.website_link ?? 'N/A';
  let investorSocialLinks = senderDataProject?.links?.[0];
  ('No social links available');
  console.log('investor social links', investorSocialLinks);

  // Other sender-specific details
  let isSenderActive = senderDataUser?.active ?? false;
  let isSenderApproved = senderDataUser?.approve ?? false;
  let isSenderDeclined = senderDataUser?.decline ?? false;

  let senderPrincipal =
    user?.sender_principal ?? 'Sender Principal not available';
  let sentAt = user?.sent_at ?? 0n;
  console.log('sender Principle aaa raha hai kya', senderPrincipal);
  // Response Data
  let requestStatus = user?.request_status ?? 'pending';
  let response = user?.response ?? '';
  return (
    <>
      <div
        className='px-1 lg1:px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll'
        key={key}
      >
        <>
          {/* project content start  */}
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
                      projectDetails={senderDataProject?.params}
                      projectId={projectid}
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
                    <DiscoverTeam projectDetails={senderDataProject?.params} />
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
                    <DiscoverRatingforAssociation
                      userData={senderDataUser}
                      senderPrincipal={senderPrincipal}
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
                      data={senderDataProject?.params}
                      projectId={projectid}
                    />
                  </div>
                )}
              </div>
            )}

            {uniqueActiveTabs.includes('review') && (
              <div className='border-b'>
                <button
                  className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                  onClick={() => handleMobileTabToggle('review')}
                >
                  Review
                  {activeMobileTab === 'review' ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>
                {activeMobileTab === 'review' && (
                  <div className='px-2 py-2'>
                    {/* <DiscoverReview
                  userData={senderDataUser}
                  principalId={senderPrincipal}
                /> */}
                    <NoData message={'No Review Available'} />
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

            {uniqueActiveTabs.includes('review') && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium ${
                  activeTab === 'review'
                    ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                    : 'text-gray-400'
                }`}
                onClick={() => handleChange('review')}
              >
                Review
              </button>
            )}
          </div>
          {/* Desktop Tab Content */}
          <div className='hidden md1:block mb-4'>
            {activeTab === 'document' && (
              <DiscoverDocument
                projectDetails={senderDataProject?.params}
                projectId={projectid}
              />
            )}
            {activeTab === 'team' && (
              <DiscoverTeam projectDetails={senderDataProject?.params} />
            )}
            {activeTab === 'ratings' && (
              <DiscoverRatingforAssociation
                userData={senderDataUser}
                senderprincipal={senderPrincipal}
              />
            )}
            {activeTab === 'moneyraised' && (
              <DiscoverMoneyRaising
                data={senderDataProject?.params}
                projectId={projectid}
              />
            )}
            {activeTab === 'review' && (
              // <DiscoverReview
              //   userData={senderDataUser}
              //   principalId={senderPrincipal}
              // />
              <NoData message={'No Review Available'} />
            )}
          </div>
          {/* project content end  */}
        </>
      </div>
      {cohortData && (
        <div className='px-1 lg1:px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll  '>
          <AssociationCohortData cohortData={cohortData} />
        </div>
      )}
    </>
  );
};

export default AssociationProjectDetailsinfo;

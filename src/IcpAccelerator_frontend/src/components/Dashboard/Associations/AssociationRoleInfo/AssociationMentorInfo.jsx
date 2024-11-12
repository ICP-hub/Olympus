import React from 'react';
import uint8ArrayToBase64 from '../../../Utils/uint8ArrayToBase64';
import getSocialLogo from '../../../Utils/navigationHelper/getSocialLogo';

const AssociationMentorInfo = ({ key, user }) => {
  // Offer details
  let offer = user?.offer ?? 'offer';
  let offerId = user?.offer_id ?? 'offerId';
  let acceptedAt = user?.accepted_at ?? 0n;
  let declinedAt = user?.declined_at ?? 0n;
  let selfDeclinedAt = user?.self_declined_at ?? 0n;

  // Receiver details
  let receiverPrincipal =
    user?.receiever_principal ?? 'Principal not available';

  // Receiver Data
  let recieverDataProject = user?.reciever_data?.[0][0] ?? {}; // Project data at index 0
  let recieverDataUser = user?.reciever_data?.[0][1] ?? {}; // User data at index 1
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
  let senderDataProject = user?.sender_data?.[0][0] ?? {}; // Project data at index 0
  let senderDataUser = user?.sender_data?.[0][1] ?? {}; // User data at index 1
  console.log('sender user data 478 ', senderDataUser);
  console.log('project data', senderDataProject);

  let projectid = senderDataProject.uid;
  console.log(projectid);

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
    <div className='p-4'>
      <div
        className='group relative hover:bg-gray-100 rounded-lg p-1 mt-4'
        key={key}
      >
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          Years of Mentoring
        </h3>
        <span className='text-[14px] line-clamp-1'>
          {Number(senderYearsOfMentoring)}
        </span>
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-4'>
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          Area of Expertise
        </h3>
        {senderAreaOfExpertise.map((expertise, index) => (
          <span
            key={index}
            className='border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1'
          >
            {expertise}
          </span>
        ))}
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-2'>
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          Category of Mentoring Service
        </h3>
        <span className='text-[14px] line-clamp-1'>
          {senderCategoryOfMentoringService}
        </span>
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-4'>
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          Existing ICP Mentor
        </h3>
        <span className='text-[14px] line-clamp-1'>
          {senderExistingIcpMentor ? 'Yes' : 'No'}
        </span>
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-4'>
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          Existing ICP Project Portfolio
        </h3>
        {senderExistingIcpProjectPortfolio.length > 0 ? (
          senderExistingIcpProjectPortfolio.map((portfolio, index) => (
            <span
              key={index}
              className='border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1'
            >
              {portfolio}
            </span>
          ))
        ) : (
          <span className='text-[14px] line-clamp-1'>No Project Portfolio</span>
        )}
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-2'>
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          Hub Owner
        </h3>
        {senderHubOwner.length > 0 ? (
          senderHubOwner.map((hub, index) => (
            <span key={index} className='mr-2 text-[14px] line-clamp-1'>
              {hub}
            </span>
          ))
        ) : (
          <span className='text-[14px] line-clamp-1'>No Hub Ownership</span>
        )}
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-2'>
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          ICP Hub or Spoke
        </h3>
        <span className='text-[14px] line-clamp-1'>
          {senderIcpHubOrSpoke ? 'Yes' : 'No'}
        </span>
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-4'>
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          Preferred ICP Hub
        </h3>
        {senderPreferredIcpHub.length > 0 ? (
          senderPreferredIcpHub.map((hub, index) => (
            <span key={index} className='mr-2 text-[14px] line-clamp-1'>
              {hub}
            </span>
          ))
        ) : (
          <span className='text-[14px] line-clamp-1'>No Preferred Hub</span>
        )}
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-2'>
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          Multichain
        </h3>
        {senderMultichain.length > 0 ? (
          senderMultichain.map((chain, index) => (
            <span
              key={index}
              className='border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1'
            >
              {chain}
            </span>
          ))
        ) : (
          <span className='text-[14px] line-clamp-1'>
            No Multichain Support
          </span>
        )}
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-2'>
        <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
          Website
        </h3>
        <a
          href={senderWebsite}
          target='_blank'
          rel='noopener noreferrer'
          className='text-[14px] line-clamp-1'
        >
          {senderWebsite}
        </a>
      </div>

      <div className='group relative hover:bg-gray-100 rounded-lg p-1 mt-4'>
        {senderSocialLinks && (
          <h3 className='block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start'>
            LINKS
          </h3>
        )}

        <div className='flex items-center '>
          <div className='flex gap-3'>
            {senderSocialLinks &&
              senderSocialLinks.map((link, i) => {
                const icon = getSocialLogo(link);
                return (
                  <div key={i} className='flex items-center space-x-2'>
                    {icon && (
                      <a href={link} target='_blank' rel='noopener noreferrer'>
                        {icon}
                      </a>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociationMentorInfo;

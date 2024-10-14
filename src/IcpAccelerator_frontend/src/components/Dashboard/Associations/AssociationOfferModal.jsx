// import React, { useEffect } from "react";
// import VerifiedIcon from "@mui/icons-material/Verified";
// import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
// import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
// import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
// import CloseIcon from "@mui/icons-material/Close";
// import getSocialLogo from "../../Utils/navigationHelper/getSocialLogo";

// const AssociationOfferModal = ({ openDetail, setOpenDetail, user }) => {
//   console.log("user data =>", user);

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

//   // Offer details
//   let offer = user?.offer ?? "offer";
//   let offerId = user?.offer_id ?? "offerId";
//   let acceptedAt = user?.accepted_at ?? 0n;
//   let declinedAt = user?.declined_at ?? 0n;
//   let selfDeclinedAt = user?.self_declined_at ?? 0n;

//   // Receiver details
//   let receiverPrincipal =
//     user?.receiever_principal ?? "Principal not available";

//   // Receiver Data
//   let recieverDataProject = user?.reciever_data?.[0][0] ?? {}; // Project data at index 0
//   let recieverDataUser = user?.reciever_data?.[0][1] ?? {}; // User data at index 1

//   let recieverYearsOfMentoring =
//     recieverDataProject?.profile?.years_of_mentoring ?? "0";
//   let recieverIcpHubOrSpoke =
//     recieverDataProject?.profile?.icp_hub_or_spoke ?? false;
//   let recieverHubOwner =
//     recieverDataProject?.profile?.hub_owner?.[0] ?? "Hub not available";
//   let recieverWebsite =
//     recieverDataProject?.profile?.website?.[0] ?? "https://defaultwebsite.com";
//   let recieverExistingIcpMentor =
//     recieverDataProject?.profile?.existing_icp_mentor ?? false;
//   let recieverCategoryOfMentoringService =
//     recieverDataProject?.profile?.category_of_mentoring_service ??
//     "Category not available";

//   // User Details (Index 1)
//   let userFullName =
//     recieverDataUser?.params?.full_name ?? "User Name not available";
//   let userProfilePicture = recieverDataUser?.params?.profile_picture?.[0]
//     ? uint8ArrayToBase64(recieverDataUser?.params?.profile_picture?.[0])
//     : "../../../assets/Logo/CypherpunkLabLogo.png";
//   let userUserName =
//     recieverDataUser?.params?.openchat_username?.[0] ??
//     "Username not available";
//   let userEmail = recieverDataUser?.params?.email?.[0] ?? "email@example.com";
//   let userCountry =
//     recieverDataUser?.params?.country ?? "Country not available";
//   let userBio = recieverDataUser?.params?.bio?.[0] ?? "Bio not available";
//   let userAreaOfInterest =
//     recieverDataUser?.params?.area_of_interest ??
//     "Area of Interest not available";
//   let userReasonToJoin =
//     recieverDataUser?.params?.reason_to_join?.[0] ??
//     "Reason to join not available";
//   let userTypeOfProfile =
//     recieverDataUser?.params?.type_of_profile?.[0] ?? "individual";
//   let userSocialLinks =
//     recieverDataUser?.params?.social_links ??
//     "No social links available";

//   // Sender Data
//   let senderDataProject = user?.sender_data?.[0][0] ?? {}; // Project data at index 0
//   let senderDataUser = user?.sender_data?.[0][1] ?? {}; // User data at index 1
//   console.log("sender user data ",senderDataUser);
//   console.log("project data",senderDataProject)

//   // Project Details (Index 0)
//   let projectName =
//     senderDataProject?.profile?.project_name ?? "Project Name not available";
//   let projectDescription =
//     senderDataProject?.profile?.project_description?.[0] ??
//     "Project description not available";
//   let projectWebsite =
//     senderDataProject?.profile?.project_website?.[0] ??
//     "https://defaultwebsite.com";
//   let projectElevatorPitch =
//     senderDataProject?.profile?.project_elevator_pitch?.[0] ??
//     "No project elevator pitch available";
//   let dappLink =
//     senderDataProject?.profile?.dapp_link?.[0] ?? "No dapp link available";
//   let preferredIcpHub =
//     senderDataProject?.profile?.preferred_icp_hub?.[0] ?? "Hub not available";
//   let longTermGoals =
//     senderDataProject?.profile?.long_term_goals?.[0] ??
//     "Long term goals not available";
//   let revenue = senderDataProject?.profile?.revenue?.[0] ?? 0n;
//   let weeklyActiveUsers =
//     senderDataProject?.profile?.weekly_active_users?.[0] ?? 0n;
//   let supportsMultichain =
//     senderDataProject?.profile?.supports_multichain?.[0] ??
//     "Chain not available";
//   let technicalDocs =
//     senderDataProject?.profile?.technical_docs?.[0] ??
//     "No technical docs available";
//   let tokenEconomics =
//     senderDataProject?.profile?.token_economics?.[0] ??
//     "No token economics available";
//   let targetMarket =
//     senderDataProject?.profile?.target_market?.[0] ??
//     "Target market not available";
//   let moneyRaisedTillNow =
//     senderDataProject?.profile?.money_raised_till_now?.[0] ?? false;
//   let isYourProjectRegistered =
//     senderDataProject?.profile?.is_your_project_registered?.[0] ?? false;
//   let liveOnIcpMainnet =
//     senderDataProject?.profile?.live_on_icp_mainnet?.[0] ?? false;
//   let uploadPrivateDocuments =
//     senderDataProject?.profile?.upload_private_documents?.[0] ?? false;
//   let typeOfRegistration =
//     senderDataProject?.profile?.type_of_registration?.[0] ?? "Company";
//   let projectAreaOfFocus =
//     senderDataProject?.profile?.project_area_of_focus ??
//     "Area of Focus not available";
//   let projectCover = senderDataProject?.profile?.project_cover?.[0]
//     ? uint8ArrayToBase64(senderDataProject?.profile?.project_cover?.[0])
//     : "../../../assets/Logo/CypherpunkLabLogo.png";
//   let projectLogo = senderDataProject?.profile?.project_logo?.[0]
//     ? uint8ArrayToBase64(senderDataProject?.profile?.project_logo?.[0])
//     : "../../../assets/Logo/CypherpunkLabLogo.png";

//   // User Details within Sender Data (Index 1)
//   let senderFullName =
//     senderDataUser?.params?.full_name ?? "Sender Name not available";
//   let senderProfilePicture = senderDataUser?.params?.profile_picture?.[0]
//     ? uint8ArrayToBase64(senderDataUser?.params?.profile_picture?.[0])
//     : "../../../assets/Logo/CypherpunkLabLogo.png";
//   let senderUserName =
//     senderDataUser?.params?.openchat_username?.[0] ?? "Username not available";
//   let senderEmail = senderDataUser?.params?.email?.[0] ?? "sender@example.com";
//   let senderCountry =
//     senderDataUser?.params?.country ?? "Country not available";
//   let senderBio = senderDataUser?.params?.bio?.[0] ?? "Bio not available";
//   let senderAreaOfInterest =
//     senderDataUser?.params?.area_of_interest ??
//     "Area of Interest not available";
//   let senderReasonToJoin =
//     senderDataUser?.params?.reason_to_join?.[0] ??
//     "Reason to join not available";
//   let senderTypeOfProfile =
//     senderDataUser?.params?.type_of_profile?.[0] ?? "individual";
//   let senderSocialLinks =
//     senderDataUser?.params?.social_links?.[0];
//     "No social links available";
//   console.log("sender social links",senderSocialLinks)
//   // Other sender-specific details
//   let isSenderActive = senderDataUser?.active ?? false;
//   let isSenderApproved = senderDataUser?.approve ?? false;
//   let isSenderDeclined = senderDataUser?.decline ?? false;

//   let senderPrincipal =
//     user?.sender_principal ?? "Sender Principal not available";
//   let sentAt = user?.sent_at ?? 0n;

//   // Response Data
//   let requestStatus = user?.request_status ?? "pending";
//   let response = user?.response ?? "";

//   return (
//     <div
//       className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
//         openDetail ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {openDetail && user && (
//         <div
//           className={`mx-auto w-[80%] sm:w-[50%] md:w-[45%] lg:w-[40%] lgx:w-[30%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
//             openDetail ? "translate-x-0" : "translate-x-full"
//           } z-20`}
//         >
//           <div className="p-2 mb-2">
//             <CloseIcon
//               sx={{ cursor: "pointer" }}
//               onClick={() => setOpenDetail(false)}
//             />
//           </div>
//           <div className="container  h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto">
//             <div className="flex justify-center p-6">
//               <div className="container  bg-white rounded-lg shadow-sm y overflow-hidden w-full max-w-[400px]">
//                 <div className="p-6 bg-gray-100">
//                   <div className="relative w-24 h-24 mx-auto mb-4">
//                     <img
//                       src={projectLogo}
//                       alt="Matt Bowers"
//                       className="absolute w-24 h-24 rounded-full backface-hidden transition-transform duration-500 transform hover:rotate-y-180"
//                       loading="lazy"
//                       draggable={false}
//                     />
//                     <img
//                       src={senderProfilePicture}
//                       alt="Matt Bowers"
//                       className="absolute w-24 h-24 rounded-full backface-hidden transition-transform duration-500 transform rotate-y-180 hover:rotate-y-0"
//                       loading="lazy"
//                       draggable={false}
//                     />
//                   </div>

//                   <div className="flex items-center justify-center mb-1">
//                     <VerifiedIcon
//                       className="text-blue-500 mr-1"
//                       fontSize="small"
//                     />
//                     <h2 className="text-xl font-semibold">{senderFullName}</h2>
//                   </div>
//                   <p className="text-gray-600 text-center mb-4">
//                     {senderUserName}{" "}
//                   </p>
//                   <a
//                     href={`mailto:${senderEmail}`}
//                     className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
//                   >
//                     Get in touch
//                     <ArrowOutwardOutlinedIcon
//                       className="ml-1"
//                       fontSize="small"
//                     />
//                   </a>
//                 </div>

//                 <div className="p-6 bg-white">
//                   <div className="mb-4">
//                     <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
//                       Roles
//                     </h3>
//                     <div className="flex space-x-2">
//                       <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-[14px] font-normal">
//                         {/* {projectId ? "Project" : "User"} */}
//                       </span>
//                     </div>
//                   </div>
//                   <hr />

//                   <div className=" ">
//                     <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 ">
//                       <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
//                         Email
//                       </h3>

//                       <div className="flex items-center flex-wrap">
//                         <p className="mr-2 text-[14px]">{senderEmail}</p>
//                         <VerifiedIcon
//                           className="text-blue-500 mr-2 w-2 h-2"
//                           fontSize="small"
//                         />
//                         <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-[14px]">
//                           HIDDEN
//                         </span>
//                       </div>
//                     </div>

//                     {/* About Section */}
//                     <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
//                       <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
//                         About
//                       </h3>
//                       <div>
//                         <p className="text-[14px] overflow-hidden line-clamp-2 text-ellipsis max-h-[1.75rem]">{senderBio}</p>
//                       </div>
//                     </div>

//                     <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
//                       <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
//                         Reason to Join Platform
//                       </h3>
//                       <div>
//                         <div className="flex flex-wrap gap-2">
//                           {senderReasonToJoin.map((reason) => (
//                             <span
//                               key={reason}
//                               className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 "
//                             >
//                               {reason}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Location Section */}
//                     <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
//                       <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
//                         Location
//                       </h3>
//                       <div className="flex gap-4">
//                         <PlaceOutlinedIcon
//                           sx={{ fontSize: "medium", marginTop: "3px" }}
//                         />
//                         <p className="text-[14px]">{senderCountry}</p>
//                       </div>
//                     </div>

//                     <div>
//                       {senderSocialLinks && (
//                         <h3 className="mb-2 text-[14px] text-gray-500 font-medium ">
//                           LINKS
//                         </h3>
//                       )}

//                       <div className="flex items-center ">
//                         <div className="flex gap-3">
//                           {senderSocialLinks
//                             ? senderSocialLinks?.map((link, i) => {
//                                 const icon = getSocialLogo(link);
//                                 return (
//                                   <div
//                                     key={i}
//                                     className="flex items-center space-x-2"
//                                   >
//                                      {icon ? <a href={`${link}`}>{icon}</a> : ""}
//                                   </div>
//                                 );
//                               })
//                             : ""}
//                             {/* {senderSocialLinks?.link.map((alllink, i) => {
//                 const icon = getSocialLogo(alllink);
//                 return (
//                   <div key={i} className="flex items-center space-x-2">
//                     {icon ? <a href={`${alllink}`}>{icon}</a> : ""}
//                   </div>
//                 );
//               })} */}
//                         </div>
//                       </div>
//                       <div className="my-2 group relative hover:bg-gray-100 rounded-lg p-1 ">
//                       <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
//                         Proposed By {senderFullName}
//                       </h3>
//                       <div>
//                         <p className="text-[14px] overflow-hidden line-clamp-2 text-ellipsis ">{offer}</p>
//                       </div>
//                     </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssociationOfferModal;
import React, { useEffect, useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import CloseIcon from '@mui/icons-material/Close';
import getSocialLogo from '../../Utils/navigationHelper/getSocialLogo';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import DiscoverDocument from '../DashboardHomePage/discoverMentorPage/DiscoverDocument';
import DiscoverTeam from '../DashboardHomePage/discoverMentorPage/DiscoverTeam';
import DiscoverRatings from '../../Discover/DiscoverRatings';
import DiscoverReview from '../../Discover/DiscoverReview';
import DiscoverMoneyRaising from '../Project/DiscoverMoneyRais';
import DiscoverMentorEvent from '../DashboardHomePage/discoverMentor/DiscoverMentorEvent';
import Nodata from '../Project/Nodata';
import NoData from '../../NoDataCard/NoData';

const AssociationOfferModal = ({ openDetail, setOpenDetail, user }) => {
  console.log('user data.................... =>', user);

  useEffect(() => {
    if (openDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openDetail]);

  const [activeMobileTab, setActiveMobileTab] = useState(null);
  const [activeTab, setActiveTab] = useState('document');
  const [activeSideTab, setActiveSideTab] = useState('general');

  const tabs = ['document', 'team', 'ratings', 'moneyraised', 'review'];
  const uniqueActiveTabs = [...new Set(tabs)];

  const handleMobileTabToggle = (tab) => {
    setActiveMobileTab((prevTab) => (prevTab === tab ? null : tab));
  };

  const handleChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (openDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openDetail]);

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
    recieverDataProject?.profile?.years_of_mentoring ?? "No Experience";
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
  console.log('sender user data ', senderDataUser);
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
    senderDataProject?.params?.type_of_registration?.[0] ?? "N/A";
  let projectAreaOfFocus =
    senderDataProject?.params?.project_area_of_focus ??
    'Area of Focus not available';
  let reasontojoinincubator =
    senderDataProject?.params?.reason_to_join_incubator ?? 'not available';

  let projectCover = senderDataProject?.params?.project_cover?.[0]
    ? uint8ArrayToBase64(senderDataProject?.params?.project_cover?.[0])
    : '../../../assets/Logo/CypherpunkLabLogo.png';
  let projectLogo = senderDataProject?.params?.project_logo?.[0]
    ? uint8ArrayToBase64(senderDataProject?.params?.project_logo?.[0])
    : '../../../assets/Logo/CypherpunkLabLogo.png';
  let countryofregistration =
    senderDataProject?.params?.country_of_registration?.[0] ?? 'not available';
  // User Details within Sender Data (Index 1)
  let senderFullName =
    senderDataUser?.params?.full_name ?? 'Sender Name not available';
  let senderProfilePicture = senderDataUser?.params?.profile_picture?.[0]
    ? uint8ArrayToBase64(senderDataUser?.params?.profile_picture?.[0])
    : '../../../assets/Logo/CypherpunkLabLogo.png';
  let senderUserName =
    senderDataUser?.params?.openchat_username?.[0] ?? 'Username not available';
  let senderEmail = senderDataUser?.params?.email?.[0] ?? 'sender@example.com';
  let senderCountry =
    senderDataUser?.params?.country ?? 'Country not available';
  let senderBio = senderDataUser?.params?.bio?.[0] ?? 'Bio not available';
  let senderAreaOfInterest =
    senderDataUser?.params?.area_of_interest ??
    'Area of Interest not available';
  let senderReasonToJoin =
    senderDataUser?.params?.reason_to_join?.[0] ??
    'Reason to join not available';
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
  let senderMultichain = senderDataProject?.profile?.multichain ?? [];
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
    <div
      className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
        openDetail ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div
        className={`mx-auto w-full sm:w-[70%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
          openDetail ? 'translate-x-0' : 'translate-x-full'
        } z-20`}
      >
        <div className='p-2 mb-2'>
          <CloseIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => setOpenDetail(false)}
          />
        </div>

        <div className='container mx-auto h-full pb-8 px-[4%] sm:px-[2%] overflow-y-scroll'>
          <div className='flex flex-col gap-4 lg1:py-3 lg1:gap-0 lg1:flex-row w-full lg1:justify-evenly '>
            <div className='border rounded-lg w-full lg1:overflow-y-scroll lg1:w-[32%] '>
              <div className='p-6 bg-gray-100'>
                <div className='relative w-24 h-24 mx-auto mb-4'>
                  <img
                    src={senderProfilePicture}
                    alt={senderFullName}
                    className='absolute w-24 h-24 rounded-full backface-hidden transition-transform duration-500 transform hover:rotate-y-180'
                    loading='lazy'
                    draggable={false}
                  />
                </div>

                <div className='flex items-center justify-center mb-1'>
                  <VerifiedIcon
                    className='text-blue-500 mr-1'
                    fontSize='small'
                  />
                  <h2 className='text-xl font-semibold'>{senderFullName}</h2>
                </div>
                <p className='text-gray-600 text-center mb-4'>
                  {senderUserName}{' '}
                </p>
                <a
                  href={`mailto:${senderEmail}`}
                  className='w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center'
                >
                  Get in touch
                  <ArrowOutwardOutlinedIcon className='ml-1' fontSize='small' />
                </a>
              </div>
              <div className='p-6 bg-white'>
                <div className='mb-4'>
                  {/* TAB  */}
                  <div className='flex justify-start border-b overflow-x-auto'>
                    <button
                      className={`px-4 py-2 focus:outline-none font-medium ${
                        activeSideTab === 'general'
                          ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                          : 'text-gray-400'
                      }`}
                      onClick={() => setActiveSideTab('general')}
                    >
                      General
                    </button>
                    <button
                      className={`px-4 py-2 focus:outline-none font-medium ${
                        activeSideTab === 'project'
                          ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                          : 'text-gray-400'
                      }`}
                      onClick={() => setActiveSideTab('project')}
                    >
                      Project
                    </button>
                    <button
                      className={`px-4 py-2 focus:outline-none font-medium ${
                        activeSideTab === 'mentor'
                          ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                          : 'text-gray-400'
                      }`}
                      onClick={() => setActiveSideTab('mentor')}
                    >
                      Mentor
                    </button>
                    <button
                      className={`px-4 py-2 focus:outline-none font-medium ${
                        activeSideTab === 'investor'
                          ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                          : 'text-gray-400'
                      }`}
                      onClick={() => setActiveSideTab('investor')}
                    >
                      Investor
                    </button>
                  </div>

                  {/* General Tab Content */}
                  {activeSideTab === "general" && (
                    <div className="p-4">
                      <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
                        <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
                          Email
                        </h3>

                        <div className="flex items-center flex-wrap line-clamp-1 break-all truncate">
                          <p className="mr-2 text-[14px] line-clamp-1 break-all truncate">{senderEmail}</p>
                          <VerifiedIcon
                            className='text-blue-500 mr-2 w-2 h-2'
                            fontSize='small'
                          />
                          {/* <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-[14px]">
                            HIDDEN
                          </span> */}
                        </div>
                      </div>

                      <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1  ">
                        <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
                          About
                        </h3>
                        <div>
                          <p className="text-[14px] overflow-hidden line-clamp-2 text-ellipsis max-h-[1.75rem]">
                            {senderBio}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
                        <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
                          Reason to Join Platform
                        </h3>
                        <div>
                          <div className='flex flex-wrap gap-2'>
                            {senderReasonToJoin.map((reason) => (
                              <span
                                key={reason}
                                className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 "
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 mt-2">
                        <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase">
                          Location
                        </h3>
                        <div className="flex gap-2">
                          <PlaceOutlinedIcon
                            sx={{ fontSize: 'medium', marginTop: '3px' }}
                          />
                          <p className="text-[14px]">{senderCountry}</p>
                        </div>
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1">
                        {senderSocialLinks && (
                          <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all ">
                            Links
                          </h3>
                        )}

                        <div className='flex items-center '>
                          <div className='flex gap-3'>
                            {senderSocialLinks
                              ? senderSocialLinks?.map((link, i) => {
                                  const icon = getSocialLogo(link);
                                  return (
                                    <div
                                      key={i}
                                      className='flex items-center space-x-2'
                                    >
                                      {icon ? (
                                        <a href={`${link}`}>{icon}</a>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  );
                                })
                              : ''}
                          </div>
                        </div>
                       
                      </div>
                       <div className="my-2 group relative hover:bg-gray-100 rounded-lg p-1 ">
                          <h3 className="font-semibold mb-2 text-[14px] text-gray-500 uppercase line-clamp-1 break-all truncate">
                            Proposed By {senderFullName}
                          </h3>
                          <div>
                            <p className="text-[14px] overflow-hidden line-clamp-2 text-ellipsis break-all ">
                              {offer}
                            </p>
                          </div>
                        </div>
                    </div>
                  )}

                  {/* Project Tab Content */}
                  {activeSideTab === "project" && (
                    <div className="p-4">
                      <div className="mt-4 group relative hover:bg-gray-100 rounded-lg p-1">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Project Name
                        </h3>
                        <p className="text-[14px] line-clamp-3">{projectName} </p>
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          Project Description
                        </h3>
                        <p className="text-[14px] line-clamp-3 break-all">
                          {projectDescription}{" "}
                        </p>
                      </div>
                      <div className="mt-6">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          Prefered Icp Hub
                        </h3>
                        <p className="text-[14px]">{preferredIcpHub}</p>
                      </div>
                      <div className="mt-6">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          Project Elevator Pitch
                        </h3>
                        <p className="text-[14px] line-clamp-1 break-all truncate">
                          {projectElevatorPitch}
                        </p>
                      </div>
                      <div className="mt-6">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          Project Website
                        </h3>
                        <p className="text-[14px] line-clamp-1 break-all truncate">
                          {projectWebsite}
                        </p>
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          PROJECT FOCUS AREA
                        </h3>
                        {projectAreaOfFocus?.split(', ').map((focus, index) => (
                          <span
                            key={index}
                            className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                          >
                            {focus}
                          </span>
                        ))}
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2 ">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          MULTI-CHAIN NAMES
                        </h3>
                        {supportsMultichain?.split(', ').map((chain, index) => (
                          <span
                            key={index}
                            className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                          >
                            {chain}
                          </span>
                        ))}
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2 ">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          REASON TO JOIN
                        </h3>
                        {reasontojoinincubator
                          ?.split(', ')
                          .map((goal, index) => (
                            <span
                              key={index}
                              className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                            >
                              {goal}
                            </span>
                          ))}
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          TYPE OF REGISTRATION
                        </h3>
                        <span className=" border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1">
                          {typeOfRegistration}{" "}
                        </span>
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          COUNTRY OF REGISTRATION
                        </h3>
                        <span className=" text-[14px]">
                          {countryofregistration}{" "}
                        </span>
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          DAPP LINK
                        </h3>
                        <span className=" text-[14px] line-clamp-1 break-all truncate">
                          {dappLink}{" "}
                        </span>
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          WEEKLY ACTIVE USERS
                        </h3>
                        <span className=" text-[14px] line-clamp-1 break-all truncate">
                          {Number(weeklyActiveUsers)}
                        </span>
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          REVENUE
                        </h3>
                        <span className=" text-[14px] line-clamp-1 break-all truncate">
                          {Number(revenue)}{" "}
                        </span>
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start">
                          TOKEN ECONOMICS
                        </h3>
                        <span className=" text-[14px] line-clamp-1 break-all truncate">
                          {tokenEconomics}{" "}
                        </span>
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        {senderSocialLinks && (
                          <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all ">
                            LINKS
                          </h3>
                        )}

                        <div className='flex items-center '>
                          <div className='flex gap-3'>
                            {senderSocialLinks
                              ? senderSocialLinks?.map((link, i) => {
                                  const icon = getSocialLogo(link);
                                  return (
                                    <div
                                      key={i}
                                      className='flex items-center space-x-2'
                                    >
                                      {icon ? (
                                        <a href={`${link}`}>{icon}</a>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  );
                                })
                              : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mentor Tab Content  */}
                  {activeSideTab === "mentor" && (
                    <div className="p-4">
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Years of Mentoring
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">{Number(senderYearsOfMentoring)}</span>
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Area of Expertise
                        </h3>
                        {senderAreaOfExpertise.map((expertise, index) => (
                          <span
                            key={index}
                            className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                          >
                            {expertise}
                          </span>
                        ))}
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2 ">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Category of Mentoring Service
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">{senderCategoryOfMentoringService}</span>
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Existing ICP Mentor
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">{senderExistingIcpMentor ? "Yes" : "No"}</span>
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Existing ICP Project Portfolio
                        </h3>
                        {senderExistingIcpProjectPortfolio.length > 0 ? (
                          senderExistingIcpProjectPortfolio.map(
                            (portfolio, index) => (
                              <span
                                key={index}
                                className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                              >
                                {portfolio}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-[14px] line-clamp-1 break-all truncate">No Project Portfolio</span>
                        )}
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2 ">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Hub Owner
                        </h3>
                        {senderHubOwner.length > 0 ? (
                          senderHubOwner.map((hub, index) => (
                            <span
                              key={index}
                              className="mr-2 text-[14px] line-clamp-1 break-all truncate"
                            >
                              {hub}
                            </span>
                          ))
                        ) : (
                          <span className="text-[14px] line-clamp-1 break-all truncate">No Hub Ownership</span>
                        )}
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          ICP Hub or Spoke
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">{senderIcpHubOrSpoke ? "Yes" : "No"}</span>
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Preferred ICP Hub
                        </h3>
                        {senderPreferredIcpHub.length > 0 ? (
                          senderPreferredIcpHub.map((hub, index) => (
                            <span
                              key={index}
                              className="mr-2 text-[14px] line-clamp-1 break-all truncate"
                            >
                              {hub}
                            </span>
                          ))
                        ) : (
                          <span className="text-[14px] line-clamp-1 break-all truncate">No Preferred Hub</span>
                        )}
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2 ">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Multichain
                        </h3>
                        {senderMultichain.length > 0 ? (
                          senderMultichain.map((chain, index) => (
                            <span
                              key={index}
                              className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                            >
                              {chain}
                            </span>
                          ))
                        ) : (
                          <span className="text-[14px] line-clamp-1 break-all truncate">No Multichain Support</span>
                        )}
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2 ">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Website
                        </h3>
                        <a
                          href={senderWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] line-clamp-1 break-all truncate"
                        >
                          {senderWebsite}
                        </a>
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        {senderSocialLinks && (
                          <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                            LINKS
                          </h3>
                        )}

                        <div className='flex items-center '>
                          <div className='flex gap-3'>
                            {senderSocialLinks
                              ? senderSocialLinks?.map((link, i) => {
                                  const icon = getSocialLogo(link);
                                  return (
                                    <div
                                      key={i}
                                      className='flex items-center space-x-2'
                                    >
                                      {icon ? (
                                        <a href={`${link}`}>{icon}</a>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  );
                                })
                              : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Investor Tab Content */}
                  {activeSideTab === "investor" && (
                    <div className="p-4">
                      
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Name of Fund
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">
                          {fundName}
                        </span>
                      </div>

                      
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Category of Investment
                        </h3>

                        {categoryOfInvestment.length > 0 &&
                          categoryOfInvestment
                            .split(',')
                            .map((category, index) => (
                              <div
                                key={index}
                                className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                              >
                                {category.trim()}
                              </div>
                            ))}
                      </div>

                     
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2 ">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Fund Size
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">
                          {Number(fundSize)}
                        </span>
                      </div>

                  
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Money Invested
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">
                          {Number(moneyInvested)}
                        </span>
                      </div>

                     
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Investor Type
                        </h3>

                        {investorType.length > 0 &&
                          investorType[0].split(',').map((type, index) => (
                            <div
                              key={index}
                              className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                            >
                              {type.trim()}
                            </div>
                          ))}
                      </div>

                     
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Portfolio Link
                        </h3>
                        <a
                          href={portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] line-clamp-1 break-all truncate"
                        >
                          {portfolioLink}
                        </a>
                      </div>

                     
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Stage
                        </h3>

                        {stage.length > 0 &&
                          stage[0].split(',').map((stagel, index) => (
                            <div
                              key={index}
                              className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                            >
                              {stagel.trim()}
                            </div>
                          ))}
                      </div>

                   
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Preferred ICP Hub
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">
                          {preferredIcpHubforInvestor}
                        </span>
                      </div>

                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Projects on Multichain
                        </h3>

                        <div className='flex flex-wrap gap-1'>
                          {projectOnMultichain.length > 0 &&
                            projectOnMultichain[0]
                              .split(',')
                              .map((chain, index) => (
                                <div
                                  key={index}
                                  className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                                >
                                  {chain.trim()}
                                </div>
                              ))}
                        </div>
                      </div>

                      
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-2">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Average Check Size
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">
                          {Number(averageCheckSize)}
                        </span>
                      </div>

                     
                      {/* <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Range of Check Size
                        </h3>
                       
                        {rangeOfCheckSize.length > 0 &&
                          rangeOfCheckSize.split(",").map((size, index) => (
                            <div
                              key={index}
                              className="border-2 border-gray-500 rounded-full text-gray-700 text-[13px] px-2 py-1 inline-block mr-2 mb-2 mt-1"
                            >
                              {size.trim()}
                            </div>
                          ))}
                      </div> */}

                    
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Number of Portfolio Companies
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">
                          {Number(numberOfPortfolioCompanies)}
                        </span>
                      </div>

                     
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Registered
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">
                          {registered ? "Yes" : "No"}
                        </span>
                      </div>

                     
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Registered Country
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">
                          {registeredCountry}
                        </span>
                      </div>

                     
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Type of Investment
                        </h3>
                        <span className="text-[14px] line-clamp-1 break-all truncate">
                          {typeOfInvestment}
                        </span>
                      </div>

                      
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all">
                          Website Link
                        </h3>
                        <a
                          href={websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] line-clamp-1 break-all truncate"
                        >
                          {websiteLink}
                        </a>
                      </div>
                      <div className="group relative hover:bg-gray-100 rounded-lg p-1 mt-4">
                        {senderSocialLinks && (
                          <h3 className="block font-semibold text-[14px] text-gray-500 uppercase truncate overflow-hidden text-start line-clamp-1 break-all ">
                            LINKS
                          </h3>
                        )}

                        <div className='flex items-center '>
                          <div className='flex gap-3'>
                            {senderSocialLinks
                              ? senderSocialLinks?.map((link, i) => {
                                  const icon = getSocialLogo(link);
                                  return (
                                    <div
                                      key={i}
                                      className='flex items-center space-x-2'
                                    >
                                      {icon ? (
                                        <a href={`${link}`}>{icon}</a>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  );
                                })
                              : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='px-1 lg1:px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll lg1:w-[63%] '>
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
                            projectDetails={senderDataProject}
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
                          <DiscoverTeam projectDetails={senderDataProject} />
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
                          <DiscoverRatings
                            userData={senderDataUser}
                            principalId={senderPrincipal}
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
                            cardData={senderDataProject?.params}
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
                          <DiscoverReview
                            userData={senderDataUser}
                            principalId={senderPrincipal}
                          />
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
                      projectDetails={senderDataProject}
                      projectId={projectid}
                    />
                  )}
                  {activeTab === 'team' && (
                    <DiscoverTeam projectDetails={senderDataProject} />
                  )}
                  {activeTab === 'ratings' && (
                    <DiscoverRatings
                      userData={senderDataUser}
                      principalId={senderPrincipal}
                    />
                  )}
                  {activeTab === 'moneyraised' && (
                    <DiscoverMoneyRaising
                      cardData={senderDataProject?.params}
                      projectId={projectid}
                    />
                  )}
                  {activeTab === 'review' && (
                    <DiscoverReview
                      userData={senderDataUser}
                      principalId={senderPrincipal}
                    />
                  )}
                </div>
                {/* project content end  */}
              </>
              {/* Sender Event Data  */}
              <DiscoverMentorEvent principal={senderPrincipal} />

              <div className=' bg-white shadow-md border rounded-lg'>
                <NoData message=' Investor data not available' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociationOfferModal;

import React from "react";
import {
  MoreVert,
  Star,
  PlaceOutlined as PlaceOutlinedIcon,
} from "@mui/icons-material";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import Avatar from "@mui/material/Avatar";
import parse from "html-react-parser";
import AssociationOfferModal from "./AssociationOfferModal";
import AcceptOfferModal from "../../../models/AcceptOfferModal";
import DeclineOfferModal from "../../../models/DeclineOfferModal";
import { useSelector } from "react-redux";
import timestampAgo from "../../Utils/navigationHelper/timeStampAgo";

const AssociationRecieverDataToProject = ({
  user,
  activeTabData,
  selectedTypeData,
  handleSelfReject,
  handleAcceptModalOpenHandler,
  handleDeclineModalOpenHandler,
  setOpenDetail
}) => {
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  // Offer details
  let offer = user?.offer ?? "offer";
  let offerId = user?.offer_id ?? "offerId";
  let acceptedAt = user?.accepted_at ?? 0n;
  let declinedAt = user?.declined_at ?? 0n;
  let selfDeclinedAt = user?.self_declined_at ?? 0n;

  // Receiver details
  let receiverPrincipal =
    user?.receiever_principal ?? "Principal not available";

  // Receiver Data
  let recieverDataProject = user?.reciever_data?.[0][0] ?? {}; // Project data at index 0
  let recieverDataUser = user?.reciever_data?.[0][1] ?? {}; // User data at index 1
  // Project Details (Index 0)
  let projectName =
    recieverDataProject?.params?.project_name ?? "Project Name not available";
  let projectDescription =
    recieverDataProject?.params?.project_description?.[0] ??
    "Project description not available";
  let projectWebsite =
    recieverDataProject?.params?.project_website?.[0] ??
    "https://defaultwebsite.com";
  let projectElevatorPitch =
    recieverDataProject?.params?.project_elevator_pitch?.[0] ??
    "No project elevator pitch available";
  let dappLink =
    recieverDataProject?.params?.dapp_link?.[0] ?? "No dapp link available";
  let preferredIcpHub =
    recieverDataProject?.params?.preferred_icp_hub?.[0] ?? "Hub not available";
  let longTermGoals =
    recieverDataProject?.params?.long_term_goals?.[0] ??
    "Long term goals not available";
  let revenue = recieverDataProject?.params?.revenue?.[0] ?? 0n;
  let weeklyActiveUsers =
    recieverDataProject?.params?.weekly_active_users?.[0] ?? 0n;
  let supportsMultichain =
    recieverDataProject?.params?.supports_multichain?.[0] ??
    "Chain not available";
  let technicalDocs =
    recieverDataProject?.params?.technical_docs?.[0] ??
    "No technical docs available";
  let tokenEconomics =
    recieverDataProject?.params?.token_economics?.[0] ??
    "No token economics available";
  let targetMarket =
    recieverDataProject?.params?.target_market?.[0] ??
    "Target market not available";
  let moneyRaisedTillNow =
    recieverDataProject?.params?.money_raised_till_now?.[0] ?? false;
  let isYourProjectRegistered =
    recieverDataProject?.params?.is_your_project_registered?.[0] ?? false;
  let liveOnIcpMainnet =
    recieverDataProject?.params?.live_on_icp_mainnet?.[0] ?? false;
  let uploadPrivateDocuments =
    recieverDataProject?.params?.upload_private_documents?.[0] ?? false;
  let typeOfRegistration =
    recieverDataProject?.params?.type_of_registration?.[0] ?? "Company";
  let projectAreaOfFocus =
    recieverDataProject?.params?.project_area_of_focus ??
    "Area of Focus not available";
  let projectCover = recieverDataProject?.params?.project_cover?.[0]
    ? uint8ArrayToBase64(recieverDataProject?.params?.project_cover?.[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";
  let projectLogo = recieverDataProject?.params?.project_logo?.[0]
    ? uint8ArrayToBase64(recieverDataProject?.params?.project_logo?.[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  // User Details (Index 1)
  let userFullName =
    recieverDataUser?.params?.full_name ?? "User Name not available";
  let userProfilePicture = recieverDataUser?.params?.profile_picture?.[0]
    ? uint8ArrayToBase64(recieverDataUser?.params?.profile_picture?.[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";
  let userUserName =
    recieverDataUser?.params?.openchat_username?.[0] ??
    "Username not available";
  let userEmail = recieverDataUser?.params?.email?.[0] ?? "email@example.com";
  let userCountry =
    recieverDataUser?.params?.country ?? "Country not available";
  let userBio = recieverDataUser?.params?.bio?.[0] ?? "Bio not available";
  let userAreaOfInterest =
    recieverDataUser?.params?.area_of_interest ??
    "Area of Interest not available";
  let userReasonToJoin =
    recieverDataUser?.params?.reason_to_join?.[0] ??
    "Reason to join not available";
  let userTypeOfProfile =
    recieverDataUser?.params?.type_of_profile?.[0] ?? "individual";
  let userSocialLinks =
    recieverDataUser?.params?.social_links?.[0]?.link?.[0] ??
    "No social links available";

  // Sender Data
  let senderDataProject = user?.sender_data?.[0][0] ?? {}; // Project data at index 0
  let senderDataUser = user?.sender_data?.[0][1] ?? {}; // User data at index 1

  // Project Details within Sender Data (Index 0)
  let senderProjectName =
    senderDataProject?.params?.project_name ??
    "Sender Project Name not available";
  let senderProjectDescription =
    senderDataProject?.params?.project_description?.[0] ??
    "Sender Project description not available";
  // Other project-related details within senderDataProject...

  // User Details within Sender Data (Index 1)
  let senderFullName =
    senderDataUser?.params?.full_name ?? "Sender Name not available";
  let senderProfilePicture = senderDataUser?.params?.profile_picture?.[0]
    ? uint8ArrayToBase64(senderDataUser?.params?.profile_picture?.[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";
  let senderUserName =
    senderDataUser?.params?.openchat_username?.[0] ?? "Username not available";
  let senderEmail = senderDataUser?.params?.email?.[0] ?? "sender@example.com";
  let senderCountry =
    senderDataUser?.params?.country ?? "Country not available";
  let senderBio = senderDataUser?.params?.bio?.[0] ?? "Bio not available";
  let senderAreaOfInterest =
    senderDataUser?.params?.area_of_interest ??
    "Area of Interest not available";
  let senderReasonToJoin =
    senderDataUser?.params?.reason_to_join?.[0] ??
    "Reason to join not available";
  let senderTypeOfProfile =
    senderDataUser?.params?.type_of_profile?.[0] ?? "individual";
  let senderSocialLinks =
    senderDataUser?.params?.social_links?.[0]?.link?.[0] ??
    "No social links available";

  // Other sender-specific details
  let isSenderActive = senderDataUser?.active ?? false;
  let isSenderApproved = senderDataUser?.approve ?? false;
  let isSenderDeclined = senderDataUser?.decline ?? false;

  let senderPrincipal =
    user?.sender_principal ?? "Sender Principal not available";
  let sentAt = user?.sent_at ?? 0n;

  let senderYearsOfMentoring =
    senderDataUser?.params?.years_of_mentoring ?? "0";
  let senderIcpHubOrSpoke = senderDataUser?.params?.icp_hub_or_spoke ?? false;
  let senderHubOwner =
    senderDataUser?.params?.hub_owner?.[0] ?? "Hub not available";
  let senderWebsite =
    senderDataUser?.params?.website?.[0] ?? "https://defaultwebsite.com";
  let senderExistingIcpMentor =
    senderDataUser?.params?.existing_icp_mentor ?? false;
  let senderCategoryOfMentoringService =
    senderDataUser?.params?.category_of_mentoring_service ??
    "Category not available";

  // Response Data
  let requestStatus = user?.request_status ?? "pending";
  let response = user?.response ?? "";

  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE MENTOR APPROCHES PROJECT
  return (
    <div className="p-6 w-full flex flex-wrap md:flex-nowrap rounded-lg shadow-sm">
      <div className="w-full flex justify-center md:w-[272px]">
        <div className="min-w-[236px] w-full md:max-w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between h-60 relative overflow-hidden cursor-pointer">
          <div
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => setOpenDetail(true)}
          >
            <img
              src={projectLogo}
              alt="projectLogo"
              className="w-24 h-24 rounded-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>

          {/* <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
            <Star className="text-yellow-400 w-4 h-4" />
            <span className="text-sm font-medium">9</span>
          </div> */}
        </div>
      </div>

      <div className="flex-grow mt-4 md:mt-0 ml-0 md:ml-[25px]  w-full">
        <div className="flex w-full mt-2 flex-wrap md:flex-nowrap md:mt-0 lg:flex-wrap xl:flex-nowrap xl:mt-0 sm2:justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold">{projectName}</h3>

            <span className="flex py-2">
              <Avatar
                alt="Mentor"
                src={userProfilePicture}
                className=" mr-2"
                sx={{ width: 24, height: 24 }}
              />
              <span className="text-gray-500">{userUserName}</span>
            </span>
            <span className="text-gray-500">@{userEmail}</span>
          </div>
          <span className="mr-2 mb-2 text-[#016AA2] px-3 py-1 rounded-full bg-gray-100 text-sm">
            {activeTabData === "pending" ? (
              <span className="font-semibold">{timestampAgo(sentAt)}</span>
            ) : activeTabData === "approved" ? (
              <span className="font-semibold">{timestampAgo(acceptedAt)}</span>
            ) : activeTabData === "declined" ? (
              <span className="font-semibold">{timestampAgo(declinedAt)}</span>
            ) : activeTabData === "self-reject" ? (
              <span className="font-semibold">
                {timestampAgo(selfDeclinedAt)}
              </span>
            ) : null}
          </span>
        </div>

        <div className="border-t border-gray-200 mt-3"></div>

        <p className="text-gray-600 my-2 overflow-hidden line-clamp-2 text-ellipsis max-h-[2rem]">
          {parse(projectDescription)}
        </p>
        <div className="flex items-center text-sm text-gray-500 flex-wrap py-2">
          {userAreaOfInterest &&
            userAreaOfInterest
              .split(",")
              .slice(0, 2)
              .map((tag, index) => (
                <span
                  key={index}
                  className="mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}

          <span className="mr-2 mb-2 flex text-[#121926] items-center">
            <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" />{" "}
            {userCountry}
          </span>
        </div>
        {activeTabData === "pending" ? (
          <div className="">
            {selectedTypeData === "to-project" ? (
              <button
                className="mr-2 mb-2 border border-[#FEDF89] bg-[#FFFAEB] text-[#B54707]  px-3 py-1 rounded-full"
                onClick={() => handleSelfReject(offerId)}
              >
                Self Decline
              </button>
            ) : (
              <div>
                <button
                  className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full"
                  onClick={() => handleAcceptModalOpenHandler(offerId)}
                >
                  Accept
                </button>
                <button
                  className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full"
                  onClick={() => handleDeclineModalOpenHandler(offerId)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ) : activeTabData === "approved" ? (
          <div className="py-2 flex justify-end">
            <span className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full capitalize">
              {requestStatus}
            </span>
          </div>
        ) : activeTabData === "declined" ? (
          <div className="py-2 flex justify-end">
            <span className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full capitalize">
              {requestStatus}
            </span>
          </div>
        ) : activeTabData === "self-reject" ? (
          <div className="py-2 flex justify-end">
            <span className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full capitalize ">
              {requestStatus}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AssociationRecieverDataToProject;

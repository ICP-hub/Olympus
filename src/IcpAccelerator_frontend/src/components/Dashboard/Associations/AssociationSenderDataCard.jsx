import React from 'react'
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';

const AssociationSenderDataCard = ({user,activeTabData,}) => {
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
let receiverPrincipal = user?.receiever_principal ?? "Principal not available";

// Reciever Data
let recieverData = user?.reciever_data[0]?? {};

// Project and User Details
let projectImage = recieverData[0]?.params?.project_cover[0]
    ? uint8ArrayToBase64(recieverData[0]?.params?.project_cover[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

let projectName = recieverData[0]?.params?.project_name ?? "projectName";
let projectDescription = recieverData[0]?.params?.project_description?.[0] ?? "Project description not available";
let projectWebsite = recieverData[0]?.params?.project_website?.[0] ?? "https://defaultwebsite.com";
let projectElevatorPitch = recieverData[0]?.params?.project_elevator_pitch?.[0] ?? "No project elevator pitch available";
let projectLogo = recieverData[0]?.params?.project_logo[0]
    ? uint8ArrayToBase64(recieverData[0]?.params?.project_logo[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";
let dappLink = recieverData[0]?.params?.dapp_link?.[0] ?? "No dapp link available";
let preferredIcpHub = recieverData[0]?.params?.preferred_icp_hub?.[0] ?? "Hub not available";
let longTermGoals = recieverData[0]?.params?.long_term_goals?.[0] ?? "Long term goals not available";
let revenue = recieverData[0]?.params?.revenue?.[0] ?? 0n;
let weeklyActiveUsers = recieverData[0]?.params?.weekly_active_users?.[0] ?? 0n;
let supportsMultichain = recieverData[0]?.params?.supports_multichain?.[0] ?? "Chain not available";
let technicalDocs = recieverData[0]?.params?.technical_docs?.[0] ?? "No technical docs available";
let tokenEconomics = recieverData[0]?.params?.token_economics?.[0] ?? "No token economics available";
let targetMarket = recieverData[0]?.params?.target_market?.[0] ?? "Target market not available";
let moneyRaisedTillNow = recieverData[0]?.params?.money_raised_till_now?.[0] ?? false;
let isYourProjectRegistered = recieverData[0]?.params?.is_your_project_registered?.[0] ?? false;
let liveOnIcpMainnet = recieverData[0]?.params?.live_on_icp_mainnet?.[0] ?? false;
let uploadPrivateDocuments = recieverData[0]?.params?.upload_private_documents?.[0] ?? false;
let typeOfRegistration = recieverData[0]?.params?.type_of_registration?.[0] ?? "Company";
let projectAreaOfFocus = recieverData[0]?.params?.project_area_of_focus ?? "Area of Focus not available";

// User details within the receiver data
let userFullName = recieverData[1]?.params?.full_name ?? "User Name";
let userProfilePicture = recieverData[1]?.params?.profile_picture[0]
    ? uint8ArrayToBase64(recieverData[1]?.params?.profile_picture[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";
let userUserName=recieverData[1]?.params?.email?.[0] ?? "email@example.com";
let userEmail = recieverData[1]?.params?.email?.[0] ?? "email@example.com";
let userCountry = recieverData[1]?.params?.country ?? "Country not available";
let userBio = recieverData[1]?.params?.bio?.[0] ?? "Bio not available";
let userAreaOfInterest = recieverData[1]?.params?.area_of_interest ?? "Area of Interest not available";
let userReasonToJoin = recieverData[1]?.params?.reason_to_join?.[0] ?? "Reason to join not available";
let userTypeOfProfile = recieverData[1]?.params?.type_of_profile?.[0] ?? "individual";
let socialLinks = recieverData[1]?.params?.social_links?.[0] ?? "No social links available";

// Sender Data
let senderData = user?.sender_data?.[0]?.profile ?? {};

let senderFullName = senderData?.full_name ?? "Sender Name";
let senderProfilePicture = senderData?.profile_picture?.[0]
    ? uint8ArrayToBase64(senderData?.profile_picture[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

let senderEmail = senderData?.email?.[0] ?? "sender@example.com";
let senderCountry = senderData?.country ?? "Country not available";
let senderBio = senderData?.bio?.[0] ?? "Bio not available";
let senderAreaOfInterest = senderData?.area_of_interest ?? "Area of Interest not available";
let senderReasonToJoin = senderData?.reason_to_join?.[0] ?? "Reason to join not available";
let senderTypeOfProfile = senderData?.type_of_profile?.[0] ?? "individual";
let senderSocialLinks = senderData?.social_links?.[0] ?? "No social links available";

let isSenderActive = senderData?.active ?? false;
let isSenderApproved = senderData?.approve ?? false;
let isSenderDeclined = senderData?.decline ?? false;

let senderPrincipal = user?.sender_principal ?? "Sender Principal not available";
let sentAt = user?.sent_at ?? 0n;

let senderYearsOfMentoring = senderData?.years_of_mentoring ?? "0";
let senderIcpHubOrSpoke = senderData?.icp_hub_or_spoke ?? false;
let senderHubOwner = senderData?.hub_owner?.[0] ?? "Hub not available";
let senderWebsite = senderData?.website?.[0] ?? "https://defaultwebsite.com";
let senderExistingIcpMentor = senderData?.existing_icp_mentor ?? false;
let senderCategoryOfMentoringService = senderData?.category_of_mentoring_service ?? "Category not available";
  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE MENTOR APPROCHES PROJECT
  return (
    <div className="p-6 w-[650px] rounded-lg shadow-sm flex">
        <div className="w-[272px]">
          <div className="max-w-[250px] w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden cursor-pointer">
            <div
              className="absolute inset-0 flex items-center justify-center"
              onClick={() => setOpenDetail(true)}
            >
              <img
                src={userCurrentRoleStatusActiveRole === 'project' ?projectLogo:senderProfilePicture}
                alt="projectLogo"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
              <Star className="text-yellow-400 w-4 h-4" />
              <span className="text-sm font-medium">9</span>
            </div>
          </div>
        </div>

        <div className="flex-grow ml-[25px] w-[544px]">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold">{userCurrentRoleStatusActiveRole === 'project' ?projectName:senderFullName}</h3>
              {userCurrentRoleStatusActiveRole === 'project'?
              
              <span className="flex py-2">
                <Avatar
                  alt="Mentor"
                  src={senderProfilePicture}
                  className=" mr-2"
                  sx={{ width: 24, height: 24 }}
                />
                <span className="text-gray-500">{sender}</span>
              </span>:''}
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
    <span className="font-semibold">{timestampAgo(selfDeclinedAt)}</span>
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
              {/* <button
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
              </button> */}
              {selectedTypeData === "to-project" ? (
                <button
                  className="mr-2 mb-2 border border-[#FEDF89] bg-[#FFFAEB] text-[#B54707]  px-3 py-1 rounded-full"
                  onClick={() => handleSelfReject(offerId)}
                >
                  Self Decline
                </button>
              ) : (
                ""
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
  )
}

export default AssociationSenderDataCard
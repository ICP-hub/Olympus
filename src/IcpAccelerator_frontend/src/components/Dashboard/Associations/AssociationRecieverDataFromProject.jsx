import React from "react";
import { Star, PlaceOutlined as PlaceOutlinedIcon } from "@mui/icons-material";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import timestampAgo from "../../Utils/navigationHelper/timeStampAgo";

const AssociationRecieverDataFromProject = ({
  user,
  activeTabData,
  selectedTypeData,
  handleSelfReject,
  handleAcceptModalOpenHandler,
  handleDeclineModalOpenHandler,
  setOpenDetail,
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

  let recieverYearsOfMentoring =
    recieverDataProject?.profile?.years_of_mentoring ?? "0";
  let recieverIcpHubOrSpoke =
    recieverDataProject?.profile?.icp_hub_or_spoke ?? false;
  let recieverHubOwner =
    recieverDataProject?.profile?.hub_owner?.[0] ?? "Hub not available";
  let recieverWebsite =
    recieverDataProject?.profile?.website?.[0] ?? "https://defaultwebsite.com";
  let recieverExistingIcpMentor =
    recieverDataProject?.profile?.existing_icp_mentor ?? false;
  let recieverCategoryOfMentoringService =
    recieverDataProject?.profile?.category_of_mentoring_service ??
    "Category not available";

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

  // Project Details (Index 0)
  let projectName =
    senderDataProject?.profile?.project_name ?? "Project Name not available";
  let projectDescription =
    senderDataProject?.profile?.project_description?.[0] ??
    "Project description not available";
  let projectWebsite =
    senderDataProject?.profile?.project_website?.[0] ??
    "https://defaultwebsite.com";
  let projectElevatorPitch =
    senderDataProject?.profile?.project_elevator_pitch?.[0] ??
    "No project elevator pitch available";
  let dappLink =
    senderDataProject?.profile?.dapp_link?.[0] ?? "No dapp link available";
  let preferredIcpHub =
    senderDataProject?.profile?.preferred_icp_hub?.[0] ?? "Hub not available";
  let longTermGoals =
    senderDataProject?.profile?.long_term_goals?.[0] ??
    "Long term goals not available";
  let revenue = senderDataProject?.profile?.revenue?.[0] ?? 0n;
  let weeklyActiveUsers =
    senderDataProject?.profile?.weekly_active_users?.[0] ?? 0n;
  let supportsMultichain =
    senderDataProject?.profile?.supports_multichain?.[0] ??
    "Chain not available";
  let technicalDocs =
    senderDataProject?.profile?.technical_docs?.[0] ??
    "No technical docs available";
  let tokenEconomics =
    senderDataProject?.profile?.token_economics?.[0] ??
    "No token economics available";
  let targetMarket =
    senderDataProject?.profile?.target_market?.[0] ??
    "Target market not available";
  let moneyRaisedTillNow =
    senderDataProject?.profile?.money_raised_till_now?.[0] ?? false;
  let isYourProjectRegistered =
    senderDataProject?.profile?.is_your_project_registered?.[0] ?? false;
  let liveOnIcpMainnet =
    senderDataProject?.profile?.live_on_icp_mainnet?.[0] ?? false;
  let uploadPrivateDocuments =
    senderDataProject?.profile?.upload_private_documents?.[0] ?? false;
  let typeOfRegistration =
    senderDataProject?.profile?.type_of_registration?.[0] ?? "Company";
  let projectAreaOfFocus =
    senderDataProject?.profile?.project_area_of_focus ??
    "Area of Focus not available";
  let projectCover = senderDataProject?.profile?.project_cover?.[0]
    ? uint8ArrayToBase64(senderDataProject?.profile?.project_cover?.[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";
  let projectLogo = senderDataProject?.profile?.project_logo?.[0]
    ? uint8ArrayToBase64(senderDataProject?.profile?.project_logo?.[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

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

  // Response Data
  let requestStatus = user?.request_status ?? "pending";
  let response = user?.response ?? "";

  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE MENTOR APPROCHES PROJECT
  return (
    // <div className="p-6 w-[40vw] flex flex-wrap rounded-lg shadow-sm md:flex">
    //   <div className="w-[40vw]">
    //     <div className="md:max-w-[250px] md:w-[250px] w-[35vw] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden cursor-pointer">
    //       <div
    //         className="absolute inset-0 flex items-center justify-center"
    //         onClick={() => setOpenDetail(true)}
    //       >
    //         <img
    //           src={userProfilePicture}
    //           alt="projectLogo"
    //           className="w-24 h-24 rounded-full object-cover"
    //         />
    //       </div>

    //       <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
    //         <Star className="text-yellow-400 w-4 h-4" />
    //         <span className="text-sm font-medium">9</span>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="flex-grow ml-[25px] w-[55vw]">
    //     <div className="flex justify-between items-start mb-2">
    //       <div>
    //         <h3 className="text-xl font-bold">{userUserName}</h3>

    //         {/* <span className="flex py-2">
    //             <Avatar
    //               alt="Mentor"
    //               src={userProfilePicture}
    //               className=" mr-2"
    //               sx={{ width: 24, height: 24 }}
    //             />
    //             <span className="text-gray-500">{userUserName}</span>
    //           </span> */}
    //         <span className="text-gray-500">@{userEmail}</span>
    //       </div>
    //       <span className="mr-2 mb-2 text-[#016AA2] px-3 py-1 rounded-full bg-gray-100 text-sm">
    //         {activeTabData === "pending" ? (
    //           <span className="font-semibold">{timestampAgo(sentAt)}</span>
    //         ) : activeTabData === "approved" ? (
    //           <span className="font-semibold">{timestampAgo(acceptedAt)}</span>
    //         ) : activeTabData === "declined" ? (
    //           <span className="font-semibold">{timestampAgo(declinedAt)}</span>
    //         ) : activeTabData === "self-reject" ? (
    //           <span className="font-semibold">
    //             {timestampAgo(selfDeclinedAt)}
    //           </span>
    //         ) : null}
    //       </span>
    //     </div>

    //     <div className="border-t border-gray-200 mt-3"></div>

    //     <p className="text-gray-600 my-2 overflow-hidden line-clamp-2 text-ellipsis max-h-[2rem]">
    //       {parse(userBio)}
    //     </p>
    //     <div className="flex items-center text-sm text-gray-500 flex-wrap py-2">
    //       {userAreaOfInterest &&
    //         userAreaOfInterest
    //           .split(",")
    //           .slice(0, 2)
    //           .map((tag, index) => (
    //             <span
    //               key={index}
    //               className="mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full"
    //             >
    //               {tag.trim()}
    //             </span>
    //           ))}

    //       <span className="mr-2 mb-2 flex text-[#121926] items-center">
    //         <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" />{" "}
    //         {userCountry}
    //       </span>
    //     </div>
    //     {activeTabData === "pending" ? (
    //       <div className="">
    //         {selectedTypeData === "to-project" ? (
    //           <button
    //             className="mr-2 mb-2 border border-[#FEDF89] bg-[#FFFAEB] text-[#B54707]  px-3 py-1 rounded-full"
    //             onClick={() => handleSelfReject(offerId)}
    //           >
    //             Self Decline
    //           </button>
    //         ) : (
    //           <div>
    //             <button
    //               className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full"
    //               onClick={() => handleAcceptModalOpenHandler(offerId)}
    //             >
    //               Accept
    //             </button>
    //             <button
    //               className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full"
    //               onClick={() => handleDeclineModalOpenHandler(offerId)}
    //             >
    //               Reject
    //             </button>
    //           </div>
    //         )}
    //       </div>
    //     ) : activeTabData === "approved" ? (
    //       <div className="py-2 flex justify-end">
    //         <span className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full capitalize">
    //           {requestStatus}
    //         </span>
    //       </div>
    //     ) : activeTabData === "declined" ? (
    //       <div className="py-2 flex justify-end">
    //         <span className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full capitalize">
    //           {requestStatus}
    //         </span>
    //       </div>
    //     ) : activeTabData === "self-reject" ? (
    //       <div className="py-2 flex justify-end">
    //         <span className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full capitalize ">
    //           {requestStatus}
    //         </span>
    //       </div>
    //     ) : (
    //       ""
    //     )}
    //   </div>
    // </div>

    <div className="md:p-6 w-full flex flex-wrap md:flex-nowrap rounded-lg shadow-sm">
      <div className="w-full flex justify-center md:w-[272px]">
        <div className="min-w-[200px] h-40 dxs:min-w-[236px]  w-full md:max-w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between dxs:h-60 relative overflow-hidden cursor-pointer">
          <div
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => setOpenDetail(true)}
          >
            <img
              src={senderProfilePicture}
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

      <div className="flex-grow mt-4 md:mt-0 ml-0 md:ml-[25px]  w-full ">
        <div>
          <div className="flex flex-col md:flex-row justify-between w-full ">
            <div>
              <h3 className="text-xl font-bold line-clamp-1 break-all">
                {senderFullName}
              </h3>
            </div>
            <div>
              <span className="mr-2 mb-2 text-[#016AA2] px-3 py-1 rounded-full bg-gray-100 text-sm md:line-clamp-1 break-all">
                {activeTabData === "pending" ? (
                  <span className="font-semibold">{timestampAgo(sentAt)}</span>
                ) : activeTabData === "approved" ? (
                  <span className="font-semibold">
                    {timestampAgo(acceptedAt)}
                  </span>
                ) : activeTabData === "declined" ? (
                  <span className="font-semibold">
                    {timestampAgo(declinedAt)}
                  </span>
                ) : activeTabData === "self-reject" ? (
                  <span className="font-semibold">
                    {timestampAgo(selfDeclinedAt)}
                  </span>
                ) : null}
              </span>
            </div>
          </div>
          <span className="text-gray-500 line-clamp-1 break-all">
            @{senderEmail}
          </span>
        </div>

        <div className="border-t border-gray-200 mt-3"></div>

        <p className="text-gray-600 my-2 break-all line-clamp-1 ">
          {parse(senderBio)}
        </p>
        <div className="flex items-center text-sm text-gray-500 flex-wrap py-2">
          {senderAreaOfInterest &&
            senderAreaOfInterest
              .split(",")
              .slice(0, 2)
              .map((tag, index) => (
                <span
                  key={index}
                  className="mr-2 mb-2 border border-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}

          <span className="mr-2 mb-2 flex text-[#121926] items-center">
            <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" />
            {senderCountry}
          </span>
        </div>

        {activeTabData === "pending" ? (
          <div className="flex ">
            {selectedTypeData === "to-project" ? (
              <button
                className="mr-2 mb-2 border border-[#FEDF89] bg-[#FFFAEB] text-[#B54707]  px-3 py-1 rounded-full"
                onClick={() => handleSelfReject(offerId)}
              >
                Self Decline
              </button>
            ) : (
              <div className="flex flex-wrap sm:flex-nowrap">
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
            <span className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full capitalize">
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

export default AssociationRecieverDataFromProject;

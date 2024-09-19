import React, { useEffect } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import CloseIcon from "@mui/icons-material/Close";
import getSocialLogo from "../../Utils/navigationHelper/getSocialLogo";

const AssociationOfferModal = ({ openDetail, setOpenDetail, user }) => {
  console.log("user data =>", user);

 

  useEffect(() => {
    if (openDetail) {
      // Prevent background from scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore background scroll when modal is closed
      document.body.style.overflow = "auto";
    }
    // Cleanup when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openDetail]);

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
    recieverDataUser?.params?.social_links ??
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


  return (
    <div
      className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
        openDetail ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {openDetail && user && (
        <div
          className={`mx-auto w-[80%] sm:w-[50%] md:w-[45%] lg:w-[40%] lgx:w-[30%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
            openDetail ? "translate-x-0" : "translate-x-full"
          } z-20`}
        >
          <div className="p-2 mb-2">
            <CloseIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setOpenDetail(false)}
            />
          </div>
          <div className="container  h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto">
            <div className="flex justify-center p-6">
              <div className="container  bg-white rounded-lg shadow-sm y overflow-hidden w-full max-w-[400px]">
                <div className="p-6 bg-gray-100">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src={projectLogo}
                      alt="Matt Bowers"
                      className="absolute w-24 h-24 rounded-full backface-hidden transition-transform duration-500 transform hover:rotate-y-180"
                      loading="lazy"
                      draggable={false}
                    />
                    <img
                      src={userProfilePicture}
                      alt="Matt Bowers"
                      className="absolute w-24 h-24 rounded-full backface-hidden transition-transform duration-500 transform rotate-y-180 hover:rotate-y-0"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  <div className="flex items-center justify-center mb-1">
                    <VerifiedIcon
                      className="text-blue-500 mr-1"
                      fontSize="small"
                    />
                    <h2 className="text-xl font-semibold">{userFullName}</h2>
                  </div>
                  <p className="text-gray-600 text-center mb-4">
                    {userUserName}{" "}
                  </p>
                  <a
                    href={`mailto:${userEmail}`}
                    className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
                  >
                    Get in touch
                    <ArrowOutwardOutlinedIcon
                      className="ml-1"
                      fontSize="small"
                    />
                  </a>
                </div>

                <div className="p-6 bg-white">
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                      Roles
                    </h3>
                    <div className="flex space-x-2">
                      <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal">
                        {/* {projectId ? "Project" : "User"} */}
                      </span>
                    </div>
                  </div>
                  <hr />

                  <div className=" ">
                    <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Email
                      </h3>

                      <div className="flex items-center flex-wrap">
                        <p className="mr-2 text-sm">{userEmail}</p>
                        <VerifiedIcon
                          className="text-blue-500 mr-2 w-2 h-2"
                          fontSize="small"
                        />
                        <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-xs">
                          HIDDEN
                        </span>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        About
                      </h3>
                      <div>
                        <p className="text-sm overflow-hidden line-clamp-2 text-ellipsis max-h-[1.75rem]">{userBio}</p>
                      </div>
                    </div>

                    <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Reason to Join Platform
                      </h3>
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {userReasonToJoin.map((reason) => (
                            <span
                              key={reason}
                              className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 "
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Location
                      </h3>
                      <div className="flex gap-4">
                        <PlaceOutlinedIcon
                          sx={{ fontSize: "medium", marginTop: "3px" }}
                        />
                        <p className="text-sm">{userCountry}</p>
                      </div>
                    </div>

                    <div>
                      {userSocialLinks && (
                        <h3 className="mb-2 text-xs text-gray-500 font-medium ">
                          LINKS
                        </h3>
                      )}

                      <div className="flex items-center ">
                        <div className="flex gap-3">
                          {userSocialLinks
                            ? userSocialLinks?.map((link, i) => {
                                const icon = getSocialLogo(link);
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center space-x-2"
                                  >
                                    {icon ? icon : ""}
                                  </div>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                      <div className="my-2 group relative hover:bg-gray-100 rounded-lg p-1 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Proposed By {userFullName}
                      </h3>
                      <div>
                        <p className="text-sm overflow-hidden line-clamp-2 text-ellipsis max-h-[1.75rem]">{offer}</p>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociationOfferModal;

import React, { useState } from "react";
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

const AssociationDetailsInvestorCard = ({
  user,
  index,
  selectedTypeData,
  activeTabData,
}) => {
  console.log("selectedTypeData", selectedTypeData);
  const actor = useSelector((currState) => currState.actors.actor);
  const [openDetail, setOpenDetail] = useState(false);
  const [offerDataId, setOfferDataId] = useState(null);
  const [isAcceptOfferModal, setIsAcceptOfferModal] = useState(null);
  const [isDeclineOfferModal, setIsDeclineOfferModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);

  console.log("user", user);
  let projectImage = user?.project_info?.project_logo[0]
    ? uint8ArrayToBase64(user?.project_info?.project_logo[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  let projectName = user?.project_info?.project_name ?? "projectName";

  let profile = user?.project_info?.user_data?.profile_picture[0]
    ? uint8ArrayToBase64(user?.project_info?.user_data?.profile_picture[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  let userName = user?.project_info?.user_data?.full_name ?? "userName";

  let openchat_name =
    user?.project_info?.user_data?.openchat_username[0] ?? "openchatName";

  let userEmail =
    user?.project_info?.user_data?.email[0] ?? "email@example.com";

  let userCountry = user?.project_info?.user_data?.country ?? "Country";

  let userBio = user?.project_info?.user_data?.bio[0] ?? "Bio not available";

  let userAreaOfInterest =
    user?.project_info?.user_data?.area_of_interest ?? "Area of Interest";

  let userReasonToJoin =
    user?.project_info?.user_data?.reason_to_join[0] ??
    "Reason to join not available";

  let userTypeOfProfile =
    user?.project_info?.user_data?.type_of_profile[0] ?? "individual";

  let socialLinks =
    user?.project_info?.user_data?.social_links[0] ??
    "No social links available";

  let projectDescription =
    user?.project_info?.project_description[0] ??
    "Project description not available";

  let projectId = user?.project_info?.project_id ?? "projectId";

  let offer = user?.offer ?? "offer";

  let offerId = user?.offer_id ?? "offerId";

  let requestStatus = user?.request_status ?? "pending";

  let response = user?.response ?? "No response";

  let acceptedAt = user?.accepted_at ?? 0n;

  let declinedAt = user?.declined_at ?? 0n;

  let selfDeclinedAt = user?.self_declined_at ?? 0n;
 
  let senderPrincipal = user?.sender_principal ?? "Principal not available";

  let sentAt = user?.sent_at ?? 0n;

 // POST API HANDLER TO SELF-REJECT A REQUEST WHERE INVESTOR APPROCHES PROJECT
 const handleSelfReject = async (offerDataId) => {
    try {
      const result = await actor.self_decline_request_from_investor_to_project(offerDataId);
      console.log(`result-in-self_decline_request_from_investor_to_project`, result);
    //   fetchPendingRequestFromInvestorToProject();
    } catch (error) {
      console.log(`error-in-self_decline_request_from_investor_to_project`, error);
    }
  };
  const handleAcceptModalOpenHandler = (val) => {
    setOfferDataId(val);
    setIsAcceptOfferModal(true);
  };
  const handleAcceptModalCloseHandler = () => {
    setOfferDataId(null);
    setIsAcceptOfferModal(false);
  };
  const handleDeclineModalCloseHandler = () => {
    setOfferDataId(null);
    setIsDeclineOfferModal(false);
  };
  const handleDeclineModalOpenHandler = (val) => {
    setOfferDataId(val);
    setIsDeclineOfferModal(true);
  };

   // POST API HANDLER TO APPROVE THE PENDING REQUEST BY INVESTOR WHERE PROJECT APPROCHES INVESTOR
  const handleAcceptOffer = async ({ message }) => {
    setIsSubmitting(true);
    try {
      const result = await actor.accept_offer_from_project_to_investor(
        offerDataId,
        message
      );
      console.log(`result-in-accept_offer_from_project_to_investor`, result);
      handleAcceptModalCloseHandler();
    //   fetchPendingRequestFromProjectToInvestor();
      setIsSubmitting(false);
    } catch (error) {
      console.log(`error-in-accept_offer_from_project_to_investor`, error);
      handleAcceptModalCloseHandler();
      setIsSubmitting(false);
    }
  };

  // POST API HANDLER TO DECLINE THE PENDING REQUEST BY INVESTOR WHERE PROJECT APPROCHES INVESTOR
  const handleDeclineOffer = async ({ message }) => {
    setIsSubmitting(true);   
    try {
      const result = await actor.decline_offer_from_project_to_investor(
        offerDataId,
        message
      );
      console.log(`result-in-decline_offer_from_project_to_investor`, result);
      handleDeclineModalCloseHandler();
    //   fetchPendingRequestFromProjectToInvestor();
    setIsSubmitting(false);
    } catch (error) {
      console.log(`error-in-decline_offer_from_project_to_investor`, error);
      handleDeclineModalCloseHandler();
    setIsSubmitting(false);
    }
  };
  return (
    <>
      <div key={index} className="p-6 w-[650px] rounded-lg shadow-sm flex">
        <div className="w-[272px]">
          <div className="max-w-[250px] w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden cursor-pointer">
            <div
              className="absolute inset-0 flex items-center justify-center"
              onClick={() => setOpenDetail(true)}
            >
              <img
                src={projectImage}
                alt="projectImage"
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
              <h3 className="text-xl font-bold">{projectName}</h3>
              <span className="flex py-2">
                <Avatar
                  alt="Mentor"
                  src={profile}
                  className=" mr-2"
                  sx={{ width: 24, height: 24 }}
                />
                <span className="text-gray-500">{userName}</span>
              </span>
              <span className="text-gray-500">@{openchat_name}</span>
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
      {openDetail && (
        <AssociationOfferModal
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          user={user}
        />
      )}
      {isAcceptOfferModal && (
        <AcceptOfferModal
          title={"Accept Offer"}
          onClose={handleAcceptModalCloseHandler}
          onSubmitHandler={handleAcceptOffer}
          isSubmitting={isSubmitting}
        />
      )}
      {isDeclineOfferModal && (
        <DeclineOfferModal
          title={"Decline Offer"}
          onClose={handleDeclineModalCloseHandler}
          onSubmitHandler={handleDeclineOffer}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default AssociationDetailsInvestorCard;

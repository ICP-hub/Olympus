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

const AssociationDetailsProjectCard = ({
  user,
  index,
  selectedTypeData,
  activeTabData,
}) => {
  console.log("selectedTypeData", selectedTypeData);
  const actor = useSelector((currState) => currState.actors.actor);
  const [openDetail, setOpenDetail] = useState(false);
  const [offerDataId, setOfferDataId] = useState(null);
  const [isAcceptMentorOfferModal, setIsAcceptMentorOfferModal] =
    useState(null);
  const [isDeclineMentorOfferModal, setIsDeclineMentorOfferModal] =
    useState(null);
  const [isAcceptInvestorOfferModal, setIsAcceptInvestorOfferModal] =
    useState(null);
  const [isDeclineInvestorOfferModal, setIsDeclineInvestorOfferModal] =
    useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const projectId = projectFullData?.[0]?.[0]?.uid;
  console.log("user", user);
  let mentorImage = user?.mentor_info?.mentor_image
    ? uint8ArrayToBase64(user?.mentor_info?.mentor_image)
    : "../../../assets/Logo/DefaultMentorImage.png";

  let mentorName = user?.mentor_info?.mentor_name ?? "Mentor Name";

  let mentorDescription =
    user?.mentor_info?.mentor_description ?? "Description not available";

  let mentorId = user?.mentor_info?.mentor_id ?? "Mentor ID not available";

  let userAreaOfInterest =
    user?.user_data?.area_of_interest ?? "Area of Interest not available";

  let userBio = user?.user_data?.bio[0] ?? "Bio not available";

  let userCountry = user?.user_data?.country ?? "Country not available";

  let userEmail = user?.user_data?.email[0] ?? "email@example.com";

  let openchatUsername =
    user?.user_data?.openchat_username[0] ?? "OpenChat Username not available";

  let profilePicture = user?.user_data?.profile_picture[0]
    ? uint8ArrayToBase64(user?.user_data?.profile_picture[0])
    : "../../../assets/Logo/DefaultProfilePicture.png";

  let reasonToJoin =
    user?.user_data?.reason_to_join[0] ?? "Reason to join not available";

  let userTypeOfProfile = user?.user_data?.type_of_profile[0] ?? "individual";

  let socialLinks =
    user?.user_data?.social_links[0]?.link ?? "No social links available";

  let offer = user?.offer ?? "Offer not available";

  let offerId = user?.offer_id ?? "Offer ID not available";

  let requestStatus = user?.request_status ?? "Pending";

  let response = user?.response ?? "No response";

  let acceptedAt = user?.accepted_at ?? 0n;

  let declinedAt = user?.declined_at ?? 0n;

  let selfDeclinedAt = user?.self_declined_at ?? 0n;

  let senderPrincipal = user?.sender_principal ?? "Principal not available";

  let sentAt = user?.sent_at ?? 0n;

// POST API HANDLER TO SELF-REJECT A REQUEST WHERE PROJECT APPROCHES MENTOR
const handleMentorSelfReject = async (offer_id) => {
    try {
      const result = await actor.self_decline_request_from_project_to_mentor(offer_id);
      console.log(`result-in-self_decline_request`, result);
    //   fetchPendingRequestFromProjectToMentor();
    } catch (error) {
      console.log(`error-in-self_decline_request`, error);
    }
  }


  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE PROJECT APPROCHES INVESTOR
  const handleInvestorSelfReject = async (offer_id) => {
    try {
      const result = await actor.self_decline_request_from_project_to_investor(
        offer_id,
        projectId
      );
      console.log(`result-in-self_decline_request_for_project`, result);
    //   fetchPendingRequestFromProjectToInvestor();
    } catch (error) {
      console.log(`error-in-self_decline_request_for_project`, error);
    }
  };
  // // // MENTOR SIDE REQUEST MODAL HANDLER // // //
  const handleMentorAcceptModalCloseHandler = () => {
    setOfferDataId(null);
    setIsAcceptMentorOfferModal(false);
  };
  const handleMentorAcceptModalOpenHandler = (val) => {
    setOfferDataId(val);
    setIsAcceptMentorOfferModal(true);
  };

  const handleMentorDeclineModalCloseHandler = () => {
    setOfferDataId(null);
    setIsDeclineMentorOfferModal(false);
  };
  const handleMentorDeclineModalOpenHandler = (val) => {
    setOfferDataId(val);
    setIsDeclineMentorOfferModal(true);
  };

  // // // INVESTOR SIDE REQUEST MODAL HANDLER // // //

  const handleInvestorAcceptModalCloseHandler = () => {
    setOfferDataId(null);
    setIsAcceptInvestorOfferModal(false);
  };
  const handleInvestorAcceptModalOpenHandler = (val) => {
    setOfferDataId(val);
    setIsAcceptInvestorOfferModal(true);
  };

  const handleInvestorDeclineModalCloseHandler = () => {
    setOfferDataId(null);
    setIsDeclineInvestorOfferModal(false);
  };
  const handleInvestorDeclineModalOpenHandler = (val) => {
    setOfferDataId(val);
    setIsDeclineInvestorOfferModal(true);
  };

    // POST API HANDLER TO APPROVE THE PENDING REQUEST BY PROJECT WHERE MENTOR APPROCHES PROJECT
    const handleAcceptMentorOffer = async ({ message }) => {
        setIsSubmitting(true);
        try {
          const result = await actor.accept_offer_from_mentor_to_project(
            offerId,
            message,
            projectId
          );
          console.log(`result-in-accept_offer_from_mentor_to_project`, result);
          handleMentorAcceptModalCloseHandler();
        //   fetchPendingRequestFromMentorToProject();
          setIsSubmitting(false);
        } catch (error) {
          console.log(`error-in-accept_offer_from_mentor_to_project`, error);
          handleMentorAcceptModalCloseHandler();
          setIsSubmitting(false);
        }
      };
    
      // POST API HANDLER TO DECLINE THE PENDING REQUEST BY PROJECT WHERE MENTOR APPROCHES PROJECT
      const handleDeclineMentorOffer = async ({ message }) => {
        setIsSubmitting(true);
        try {
          const result = await actor.decline_offer_from_mentor_to_project(
            offerId,
            message,
            projectId
          );
          console.log(`result-in-decline_offer_from_mentor_to_project`, result);
          handleMentorDeclineModalCloseHandler();
        //   fetchPendingRequestFromMentorToProject();
          setIsSubmitting(false);
        } catch (error) {
          console.log(`error-in-decline_offer_from_mentor_to_project`, error);
          handleMentorDeclineModalCloseHandler();
          setIsSubmitting(false);
        }
      };
        // POST API HANDLER TO APPROVE THE PENDING REQUEST BY PROJECT WHERE INVESTOR APPROCHES PROJECT
  const handleAcceptInvestorOffer = async ({ message }) => {
    setIsSubmitting(true);
    try {
      const result = await actor.accept_offer_from_investor_to_project(
        offerId,
        message,
        projectId
      );
      console.log(`result-in-accept_offer_of_investor`, result);
      handleInvestorAcceptModalCloseHandler();
    //   fetchPendingRequestFromInvestorToProject();
      setIsSubmitting(false);
    } catch (error) {
      console.log(`error-in-accept_offer_of_investor`, error);
      handleInvestorAcceptModalCloseHandler();
      setIsSubmitting(false);
    }
  };

  // POST API HANDLER TO DECLINE THE PENDING REQUEST BY PROJECT WHERE INVESTOR APPROCHES PROJECT
  const handleDeclineInvestorOffer = async ({ message }) => {
    setIsSubmitting(true);
    try {
      const result = await actor.decline_offer_from_investor_to_project(
        offerId,
        message,
        projectId
      );
      console.log(`result-in-decline_offer_from_investor_to_project`, result);
      handleInvestorDeclineModalCloseHandler();
    //   fetchPendingRequestFromInvestorToProject();
      setIsSubmitting(true);
    } catch (error) {
      console.log(`error-in-decline_offer_from_investor_to_project`, error);
      handleInvestorDeclineModalCloseHandler();
      setIsSubmitting(true);
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
                src={mentorImage}
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
              <h3 className="text-xl font-bold">{mentorName}</h3>
              <span className="flex py-2">
                <Avatar
                  alt="Mentor"
                  src={profilePicture}
                  className=" mr-2"
                  sx={{ width: 24, height: 24 }}
                />
                <span className="text-gray-500">{mentorName}</span>
              </span>
              <span className="text-gray-500">@{openchatUsername}</span>
            </div>
            <span className="mr-2 mb-2 text-[#016AA2] px-3 py-1 rounded-full bg-gray-100 text-sm">
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

          <div className="border-t border-gray-200 mt-3"></div>

          <p className="text-gray-600 my-2 overflow-hidden line-clamp-2 text-ellipsis max-h-[2rem]">
            {mentorDescription}
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
              {/* Handle Self Decline for Mentor or Investor */}
              {selectedTypeData === "to-mentor" ||
              selectedTypeData === "to-investor" ? (
                <button
                  className="mr-2 mb-2 border border-[#FEDF89] bg-[#FFFAEB] text-[#B54707] px-3 py-1 rounded-full"
                  onClick={() => {
                    selectedTypeData === "to-mentor"
                      ? handleMentorSelfReject(offerId)
                      : handleInvestorSelfReject(offerId);
                  }}
                >
                  Self Decline
                </button>
              ) : selectedTypeData === "to-mentor" ? (
                <>
                  {/* Handle Mentor Reject */}
                  <button
                    className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574] px-3 py-1 rounded-full"
                    onClick={() => handleMentorDeclineModalOpenHandler(offerId)}
                  >
                    Reject
                  </button>
                  {/* Handle Mentor Approve */}
                  <button
                    className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647] px-3 py-1 rounded-full"
                    onClick={() => handleMentorAcceptModalOpenHandler(offerId)}
                  >
                    Approve
                  </button>
                </>
              ) : (
                <>
                  {/* Handle Investor Reject */}
                  <button
                    className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574] px-3 py-1 rounded-full"
                    onClick={() =>
                      handleInvestorDeclineModalOpenHandler(offerId)
                    }
                  >
                    Reject
                  </button>
                  {/* Handle Investor Approve */}
                  <button
                    className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647] px-3 py-1 rounded-full"
                    onClick={() =>
                      handleInvestorAcceptModalOpenHandler(offerId)
                    }
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          ) : activeTabData === "approved" ? (
            <div className="py-2 flex justify-end">
              <span className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647] px-3 py-1 rounded-full capitalize">
                {requestStatus}
              </span>
            </div>
          ) : activeTabData === "declined" ? (
            <div className="py-2 flex justify-end">
              <span className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574] px-3 py-1 rounded-full capitalize">
                {requestStatus}
              </span>
            </div>
          ) : activeTabData === "self-reject" ? (
            <div className="py-2 flex justify-end">
              <span className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574] px-3 py-1 rounded-full capitalize ">
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
      {isAcceptMentorOfferModal && (
        <AcceptOfferModal
          title={"Accept Offer"}
          onClose={handleMentorAcceptModalCloseHandler}
          onSubmitHandler={handleAcceptMentorOffer}
          isSubmitting={isSubmitting}
        />
      )}
      {isDeclineMentorOfferModal && (
        <DeclineOfferModal
          title={"Decline Offer"}
          onClose={handleMentorDeclineModalCloseHandler}
          onSubmitHandler={handleDeclineMentorOffer}
          isSubmitting={isSubmitting}
        />
      )}

      {isAcceptInvestorOfferModal && (
        <AcceptOfferModal
          title={"Accept Offer"}
          onClose={handleInvestorAcceptModalCloseHandler}
          onSubmitHandler={handleAcceptInvestorOffer}
          isSubmitting={isSubmitting}
        />
      )}
      {isDeclineInvestorOfferModal && (
        <DeclineOfferModal
          title={"Decline Offer"}
          onClose={handleInvestorDeclineModalCloseHandler}
          onSubmitHandler={handleDeclineInvestorOffer}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default AssociationDetailsProjectCard;

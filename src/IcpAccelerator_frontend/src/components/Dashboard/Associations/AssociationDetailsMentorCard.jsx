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
import AssociationRecieverDataToProject from "./AssociationRecieverDataToProject ";
import AssociationRecieverDataFromProject from "./AssociationRecieverDataFromProject";
import fetchRequestAssociation from "../../Utils/apiNames/getAssociationApiName";
import { Principal } from "@dfinity/principal";

const AssociationDetailsMentorCard = ({
  user,
  index,
  selectedTypeData,
  activeTabData,
  associateData,
  setAssociateData,
}) => {
  console.log("selectedTypeData", selectedTypeData);
  const actor = useSelector((currState) => currState.actors.actor);
  const [openDetail, setOpenDetail] = useState(false);
  const [offerDataId, setOfferDataId] = useState(null);
  const [isAcceptOfferModal, setIsAcceptOfferModal] = useState(null);
  const [isDeclineOfferModal, setIsDeclineOfferModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const principal = useSelector((currState) => currState.internet.principal);
  console.log("user", user);

  // Offer details
  let offer = user?.offer ?? "offer";
  let offerId = user?.offer_id ?? "offerId";
  let acceptedAt = user?.accepted_at ?? 0n;
  let declinedAt = user?.declined_at ?? 0n;
  let selfDeclinedAt = user?.self_declined_at ?? 0n;

  // Receiver details
  let receiverPrincipal =
    user?.receiever_principal ?? "Principal not available";

  // Reciever Data
  let recieverData = user?.reciever_data[0] ?? {};

  // Project and User Details
  let projectImage = recieverData[0]?.params?.project_cover[0]
    ? uint8ArrayToBase64(recieverData[0]?.params?.project_cover[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  let projectName = recieverData[0]?.params?.project_name ?? "projectName";
  let projectDescription =
    recieverData[0]?.params?.project_description?.[0] ??
    "Project description not available";
  let projectWebsite =
    recieverData[0]?.params?.project_website?.[0] ??
    "https://defaultwebsite.com";
  let projectElevatorPitch =
    recieverData[0]?.params?.project_elevator_pitch?.[0] ??
    "No project elevator pitch available";
  let projectLogo = recieverData[0]?.params?.project_logo[0]
    ? uint8ArrayToBase64(recieverData[0]?.params?.project_logo[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";
  let dappLink =
    recieverData[0]?.params?.dapp_link?.[0] ?? "No dapp link available";
  let preferredIcpHub =
    recieverData[0]?.params?.preferred_icp_hub?.[0] ?? "Hub not available";
  let longTermGoals =
    recieverData[0]?.params?.long_term_goals?.[0] ??
    "Long term goals not available";
  let revenue = recieverData[0]?.params?.revenue?.[0] ?? 0n;
  let weeklyActiveUsers =
    recieverData[0]?.params?.weekly_active_users?.[0] ?? 0n;
  let supportsMultichain =
    recieverData[0]?.params?.supports_multichain?.[0] ?? "Chain not available";
  let technicalDocs =
    recieverData[0]?.params?.technical_docs?.[0] ??
    "No technical docs available";
  let tokenEconomics =
    recieverData[0]?.params?.token_economics?.[0] ??
    "No token economics available";
  let targetMarket =
    recieverData[0]?.params?.target_market?.[0] ??
    "Target market not available";
  let moneyRaisedTillNow =
    recieverData[0]?.params?.money_raised_till_now?.[0] ?? false;
  let isYourProjectRegistered =
    recieverData[0]?.params?.is_your_project_registered?.[0] ?? false;
  let liveOnIcpMainnet =
    recieverData[0]?.params?.live_on_icp_mainnet?.[0] ?? false;
  let uploadPrivateDocuments =
    recieverData[0]?.params?.upload_private_documents?.[0] ?? false;
  let typeOfRegistration =
    recieverData[0]?.params?.type_of_registration?.[0] ?? "Company";
  let projectAreaOfFocus =
    recieverData[0]?.params?.project_area_of_focus ??
    "Area of Focus not available";

  // User details within the receiver data
  let userFullName = recieverData[1]?.params?.full_name ?? "User Name";
  let userProfilePicture = recieverData[1]?.params?.profile_picture[0]
    ? uint8ArrayToBase64(recieverData[1]?.params?.profile_picture[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  let userEmail = recieverData[1]?.params?.email?.[0] ?? "email@example.com";
  let userCountry = recieverData[1]?.params?.country ?? "Country not available";
  let userBio = recieverData[1]?.params?.bio?.[0] ?? "Bio not available";
  let userAreaOfInterest =
    recieverData[1]?.params?.area_of_interest ??
    "Area of Interest not available";
  let userReasonToJoin =
    recieverData[1]?.params?.reason_to_join?.[0] ??
    "Reason to join not available";
  let userTypeOfProfile =
    recieverData[1]?.params?.type_of_profile?.[0] ?? "individual";
  let socialLinks =
    recieverData[1]?.params?.social_links?.[0] ?? "No social links available";

  // Sender Data
  let senderData = user?.sender_data?.[0]?.profile ?? {};

  let senderFullName = senderData?.full_name ?? "Sender Name";
  let senderProfilePicture = senderData?.profile_picture?.[0]
    ? uint8ArrayToBase64(senderData?.profile_picture[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  let senderEmail = senderData?.email?.[0] ?? "sender@example.com";
  let senderCountry = senderData?.country ?? "Country not available";
  let senderBio = senderData?.bio?.[0] ?? "Bio not available";
  let senderAreaOfInterest =
    senderData?.area_of_interest ?? "Area of Interest not available";
  let senderReasonToJoin =
    senderData?.reason_to_join?.[0] ?? "Reason to join not available";
  let senderTypeOfProfile = senderData?.type_of_profile?.[0] ?? "individual";
  let senderSocialLinks =
    senderData?.social_links?.[0] ?? "No social links available";

  let isSenderActive = senderData?.active ?? false;
  let isSenderApproved = senderData?.approve ?? false;
  let isSenderDeclined = senderData?.decline ?? false;

  let senderPrincipal =
    user?.sender_principal ?? "Sender Principal not available";
  let sentAt = user?.sent_at ?? 0n;

  let senderYearsOfMentoring = senderData?.years_of_mentoring ?? "0";
  let senderIcpHubOrSpoke = senderData?.icp_hub_or_spoke ?? false;
  let senderHubOwner = senderData?.hub_owner?.[0] ?? "Hub not available";
  let senderWebsite = senderData?.website?.[0] ?? "https://defaultwebsite.com";
  let senderExistingIcpMentor = senderData?.existing_icp_mentor ?? false;
  let senderCategoryOfMentoringService =
    senderData?.category_of_mentoring_service ?? "Category not available";
  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE MENTOR APPROCHES PROJECT
  const handleSelfReject = async (offer_id) => {
    setIsSubmitting(true);
    const covertedPrincipal = await Principal.fromText(principal);

    try {
      const result = await actor.self_decline_request_from_mentor_project(
        offer_id
      );
      if (result) {
        console.log(`result-in-self_decline_request_for_mentor`, result);
      const response=  fetchRequestAssociation(
          "self-reject",
          "to-project",
          "mentor",
          null,
          null,
          actor
        );
       const resultData = await response.api_data;
        setAssociateData(resultData);
        setIsSubmitting(false);
      }      
    } catch (error) {
      setIsSubmitting(false);
      console.log(`error-in-self_decline_request_for_mentor`, error);
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
  // POST API HANDLER TO APPROVE THE PENDING REQUEST BY MENTOR WHERE PROJECT APPROCHES MENTOR
  const handleAcceptOffer = async ({ message }) => {
    setIsSubmitting(true);
    const covertedPrincipal = await Principal.fromText(principal);
    try {
      const result = await actor.accept_offer_from_project_to_mentor(
        offerDataId,
        message
      );
      console.log(`result-in-accept_offer_of_project`, result);
      handleAcceptModalCloseHandler();
      const response = fetchRequestAssociation(
        "approved",
        "from-project",
        "mentor",
        null,
        covertedPrincipal,
        actor
      );
    const resultData = await response.api_data;
      setAssociateData(resultData);
      setIsSubmitting(false);
    } catch (error) {
      console.log(`error-in-accept_offer_of_project`, error);
      handleAcceptModalCloseHandler();
      setIsSubmitting(false);
    }
  };

  // POST API HANDLER TO DECLINE THE PENDING REQUEST BY MENTOR WHERE PROJECT APPROCHES MENTOR
  const handleDeclineOffer = async ({ message }) => {
    const covertedPrincipal = await Principal.fromText(principal);
    setIsSubmitting(true);
    try {
      const result = await actor.decline_offer_from_project_to_mentor(
        offerDataId,
        message
      );
      console.log(`result-in-decline_offer_of_project`, result);
      handleDeclineModalCloseHandler();
      const response = fetchRequestAssociation(
        "declined",
        "from-project",
        "mentor",
        null,
        covertedPrincipal,
        actor
      );
     const resultData = await response.api_data;
      setAssociateData(resultData);
        setIsSubmitting(false);
    } catch (error) {
      console.log(`error-in-decline_offer_of_project`, error);
      handleDeclineModalCloseHandler();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {selectedTypeData === "to-project" ? (
        <AssociationRecieverDataToProject
          user={user}
          activeTabData={activeTabData}
          selectedTypeData={selectedTypeData}
          handleSelfReject={handleSelfReject}
          handleAcceptModalOpenHandler={handleAcceptModalOpenHandler}
          handleDeclineModalOpenHandler={handleDeclineModalOpenHandler}
          setOpenDetail={setOpenDetail}
        />
      ) : selectedTypeData === "from-project" ? (
        <AssociationRecieverDataFromProject
          user={user}
          activeTabData={activeTabData}
          selectedTypeData={selectedTypeData}
          handleSelfReject={handleSelfReject}
          handleAcceptModalOpenHandler={handleAcceptModalOpenHandler}
          handleDeclineModalOpenHandler={handleDeclineModalOpenHandler}
          setOpenDetail={setOpenDetail}
        />
      ) : (
        ""
      )}
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

export default AssociationDetailsMentorCard;

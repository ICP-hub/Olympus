import React, { useState } from 'react';
import {
  MoreVert,
  Star,
  PlaceOutlined as PlaceOutlinedIcon,
} from '@mui/icons-material';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import Avatar from '@mui/material/Avatar';
import parse from 'html-react-parser';
import AssociationOfferModal from './AssociationOfferModal';
import AcceptOfferModal from '../../../models/AcceptOfferModal';
import DeclineOfferModal from '../../../models/DeclineOfferModal';
import { useSelector } from 'react-redux';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';
import AssociationRecieverProjectSideDataToMentor from './AssociationRecieverProjectSideDataToMentor';
import AssociationRecieverDataFromProject from './AssociationRecieverDataFromProject';
import AssociationRecieverProjectSideDataFromMentor from './AssociationRecieverProjectSideDataFromMentor';
import { toast } from 'react-hot-toast';
import fetchRequestAssociation from '../../Utils/apiNames/getAssociationApiName';
const AssociationDetailsProjectCard = ({
  user,
  index,
  selectedTypeData,
  activeTabData,
}) => {
  console.log('user', user);
  console.log('selectedTypeData', selectedTypeData);
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
  const [associationProfileData, setAssociationProfileData] = useState(user);

  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const projectId = projectFullData?.[0]?.[0]?.uid;
  console.log('user', user);
  let mentorImage = user?.mentor_info?.mentor_image
    ? uint8ArrayToBase64(user?.mentor_info?.mentor_image)
    : '../../../assets/Logo/DefaultMentorImage.png';

  let mentorName = user?.mentor_info?.mentor_name ?? 'Mentor Name';

  let mentorDescription =
    user?.mentor_info?.mentor_description ?? 'Description not available';

  let mentorId = user?.mentor_info?.mentor_id ?? 'Mentor ID not available';

  let userAreaOfInterest =
    user?.mentor_info?.user_data?.area_of_interest ??
    'Area of Interest not available';

  let userBio = user?.mentor_info?.user_data?.bio[0] ?? 'Bio not available';

  let userCountry =
    user?.mentor_info?.user_data?.country ?? 'Country not available';

  let userEmail = user?.mentor_info?.user_data?.email[0] ?? 'email@example.com';

  let openchatUsername =
    user?.mentor_info?.user_data?.openchat_username[0] ??
    'OpenChat Username not available';

  let profilePicture = user?.mentor_info?.user_data?.profile_picture[0]
    ? uint8ArrayToBase64(user?.mentor_info?.user_data?.profile_picture[0])
    : '../../../assets/Logo/DefaultProfilePicture.png';

  let reasonToJoin =
    user?.mentor_info?.user_data?.reason_to_join[0] ??
    'Reason to join not available';

  let userTypeOfProfile =
    user?.mentor_info?.user_data?.type_of_profile[0] ?? 'individual';

  let socialLinks =
    user?.mentor_info?.user_data?.social_links[0]?.link ??
    'No social links available';

  let offer = user?.offer ?? 'Offer not available';

  let offerId = user?.offer_id ?? 'Offer ID not available';

  let requestStatus = user?.request_status ?? 'Pending';

  let response = user?.response ?? 'No response';

  let acceptedAt = user?.accepted_at ?? 0n;

  let declinedAt = user?.declined_at ?? 0n;

  let selfDeclinedAt = user?.self_declined_at ?? 0n;

  let senderPrincipal = user?.sender_principal ?? 'Principal not available';

  let sentAt = user?.sent_at ?? 0n;

  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE PROJECT APPROCHES MENTOR
  const handleMentorSelfReject = async (offer_id) => {
    setIsSubmitting(true);
    try {
      const result =
        await actor.self_decline_request_from_project_to_mentor(offer_id);
      if (result) {
        console.log(`result-in-self_decline_request`, result);
        toast.success('Request successfully declined.');
        const response = fetchRequestAssociation(
          'self-reject',
          'to-mentor',
          'project',
          null,
          null,
          actor
        );
        const resultData = await response.api_data;
        setAssociationProfileData(resultData[0]);
        setIsSubmitting(false);
      } else {
        console.log(`error-in-self_decline_request`, result);
        toast.error(
          'An error occurred while declining the request. Please try again.'
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(`error-in-self_decline_request`, error);
      toast.error(
        'An error occurred while declining the request. Please try again.'
      );
    }
  };
  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE PROJECT APPROCHES INVESTOR
  const handleInvestorSelfReject = async (offer_id) => {
    setIsSubmitting(true);
    try {
      const result = await actor.self_decline_request_from_project_to_investor(
        offer_id,
        projectId
      );
      if (result) {
        console.log(`result-in-self_decline_request_for_project`, result);
        toast.success('Request successfully declined.');
        setIsSubmitting(false);
        const response = fetchRequestAssociation(
          'self-reject',
          'to-mentor',
          'project',
          null,
          null,
          actor
        );
        const resultData = await response.api_data;
        setAssociationProfileData(resultData[0]);
      } else {
        console.log(`result-in-self_decline_request_for_project`, result);
        toast.error(
          'An error occurred while declining the request. Please try again.'
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
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
      if (result) {
        console.log(`result-in-accept_offer_from_mentor_to_project`, result);
        handleMentorAcceptModalCloseHandler();
        setIsSubmitting(false);
        const response = fetchRequestAssociation(
          'approved',
          'from-mentor',
          'project',
          null,
          projectId,
          actor
        );
        const resultData = await response.api_data;
        console.log('resultData', resultData);
        setAssociationProfileData(resultData[0]);
      } else {
        console.log(`error-in-accept_offer_from_mentor_to_project`, result);
        handleMentorAcceptModalCloseHandler();
        setIsSubmitting(false);
      }
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
      if (result) {
        console.log(`result-in-decline_offer_from_mentor_to_project`, result);
        handleMentorDeclineModalCloseHandler();
        setIsSubmitting(false);
        const response = fetchRequestAssociation(
          'declined',
          'from-mentor',
          'project',
          null,
          projectId,
          actor
        );
        const resultData = await response.api_data;
        setAssociationProfileData(resultData[0]);
      } else {
        console.log(`error-in-decline_offer_from_mentor_to_project`, result);
        handleMentorDeclineModalCloseHandler();
        setIsSubmitting(false);
      }
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
      if (result) {
        console.log(`result-in-accept_offer_of_investor`, result);
        handleInvestorAcceptModalCloseHandler();
        setIsSubmitting(false);
        const response = fetchRequestAssociation(
          'approved',
          'from-investor',
          'project',
          null,
          projectId,
          actor
        );
        const resultData = await response.api_data;
        console.log('resultData', resultData);
        setAssociationProfileData(resultData[0]);
      } else {
        console.log(`error-in-accept_offer_of_investor`, result);
        handleInvestorAcceptModalCloseHandler();
        setIsSubmitting(false);
      }
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
      if (result) {
        console.log(`result-in-decline_offer_from_investor_to_project`, result);
        handleInvestorDeclineModalCloseHandler();
        setIsSubmitting(false);
        const response = fetchRequestAssociation(
          'declined',
          'from-investor',
          'project',
          null,
          projectId,
          actor
        );
        const resultData = await response.api_data;
        setAssociationProfileData(resultData[0]);
      } else {
        console.log(`error-in-decline_offer_from_investor_to_project`, result);
        handleInvestorDeclineModalCloseHandler();
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(`error-in-decline_offer_from_investor_to_project`, error);
      handleInvestorDeclineModalCloseHandler();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {selectedTypeData === 'to-mentor' ? (
        <AssociationRecieverProjectSideDataToMentor
          user={associationProfileData}
          activeTabData={activeTabData}
          selectedTypeData={selectedTypeData}
          handleMentorSelfReject={handleMentorSelfReject}
          handleInvestorSelfReject={handleInvestorSelfReject}
          handleMentorDeclineModalOpenHandler={
            handleMentorDeclineModalOpenHandler
          }
          handleMentorAcceptModalOpenHandler={
            handleMentorAcceptModalOpenHandler
          }
          handleInvestorDeclineModalOpenHandler={
            handleInvestorDeclineModalOpenHandler
          }
          handleInvestorAcceptModalOpenHandler={
            handleInvestorAcceptModalOpenHandler
          }
          isSubmitting={isSubmitting}
          setOpenDetail={setOpenDetail}
        />
      ) : selectedTypeData === 'from-mentor' ? (
        <AssociationRecieverProjectSideDataFromMentor
          user={associationProfileData}
          activeTabData={activeTabData}
          selectedTypeData={selectedTypeData}
          handleMentorSelfReject={handleMentorSelfReject}
          handleInvestorSelfReject={handleInvestorSelfReject}
          handleMentorDeclineModalOpenHandler={
            handleMentorDeclineModalOpenHandler
          }
          handleMentorAcceptModalOpenHandler={
            handleMentorAcceptModalOpenHandler
          }
          handleInvestorDeclineModalOpenHandler={
            handleInvestorDeclineModalOpenHandler
          }
          handleInvestorAcceptModalOpenHandler={
            handleInvestorAcceptModalOpenHandler
          }
          isSubmitting={isSubmitting}
          setOpenDetail={setOpenDetail}
        />
      ) : selectedTypeData === 'to-investor' ? (
        <AssociationRecieverProjectSideDataToMentor
          user={associationProfileData}
          activeTabData={activeTabData}
          selectedTypeData={selectedTypeData}
          handleMentorSelfReject={handleMentorSelfReject}
          handleInvestorSelfReject={handleInvestorSelfReject}
          handleMentorDeclineModalOpenHandler={
            handleMentorDeclineModalOpenHandler
          }
          handleMentorAcceptModalOpenHandler={
            handleMentorAcceptModalOpenHandler
          }
          handleInvestorDeclineModalOpenHandler={
            handleInvestorDeclineModalOpenHandler
          }
          handleInvestorAcceptModalOpenHandler={
            handleInvestorAcceptModalOpenHandler
          }
          setOpenDetail={setOpenDetail}
        />
      ) : selectedTypeData === 'from-investor' ? (
        <AssociationRecieverProjectSideDataFromMentor
          user={associationProfileData}
          activeTabData={activeTabData}
          selectedTypeData={selectedTypeData}
          handleMentorSelfReject={handleMentorSelfReject}
          handleInvestorSelfReject={handleInvestorSelfReject}
          handleMentorDeclineModalOpenHandler={
            handleMentorDeclineModalOpenHandler
          }
          handleMentorAcceptModalOpenHandler={
            handleMentorAcceptModalOpenHandler
          }
          handleInvestorDeclineModalOpenHandler={
            handleInvestorDeclineModalOpenHandler
          }
          handleInvestorAcceptModalOpenHandler={
            handleInvestorAcceptModalOpenHandler
          }
          setOpenDetail={setOpenDetail}
        />
      ) : (
        ''
      )}
      {openDetail && (
        <AssociationOfferModal
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          user={user}
          selectedTypeData={selectedTypeData}
          activeTabData={activeTabData}
        />
      )}
      {isAcceptMentorOfferModal && (
        <AcceptOfferModal
          title={'Accept Offer'}
          onClose={handleMentorAcceptModalCloseHandler}
          onSubmitHandler={handleAcceptMentorOffer}
          isSubmitting={isSubmitting}
        />
      )}
      {isDeclineMentorOfferModal && (
        <DeclineOfferModal
          title={'Decline Offer'}
          onClose={handleMentorDeclineModalCloseHandler}
          onSubmitHandler={handleDeclineMentorOffer}
          isSubmitting={isSubmitting}
        />
      )}

      {isAcceptInvestorOfferModal && (
        <AcceptOfferModal
          title={'Accept Offer'}
          onClose={handleInvestorAcceptModalCloseHandler}
          onSubmitHandler={handleAcceptInvestorOffer}
          isSubmitting={isSubmitting}
        />
      )}
      {isDeclineInvestorOfferModal && (
        <DeclineOfferModal
          title={'Decline Offer'}
          onClose={handleInvestorDeclineModalCloseHandler}
          onSubmitHandler={handleDeclineInvestorOffer}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default AssociationDetailsProjectCard;

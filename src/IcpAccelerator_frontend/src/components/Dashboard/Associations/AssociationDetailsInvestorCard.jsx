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
import AssociationRecieverMentorDataToProject from './AssociationRecieverDataToProject ';
import AssociationRecieverDataToProject from './AssociationRecieverDataToProject ';
import AssociationRecieverDataFromProject from './AssociationRecieverDataFromProject';
import fetchRequestAssociation from '../../Utils/apiNames/getAssociationApiName';

const AssociationDetailsInvestorCard = ({
  user,
  index,
  selectedTypeData,
  activeTabData,
  associateData,
  setAssociateData,
}) => {
  console.log('selectedTypeData', selectedTypeData);
  const actor = useSelector((currState) => currState.actors.actor);
  const [openDetail, setOpenDetail] = useState(false);
  const [offerDataId, setOfferDataId] = useState(null);
  const [isAcceptOfferModal, setIsAcceptOfferModal] = useState(null);
  const [isDeclineOfferModal, setIsDeclineOfferModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);

  console.log('user', user);
  let projectImage = user?.project_info?.project_logo[0]
    ? uint8ArrayToBase64(user?.project_info?.project_logo[0])
    : '../../../assets/Logo/CypherpunkLabLogo.png';

  let projectName = user?.project_info?.project_name ?? 'projectName';

  let profile = user?.project_info?.user_data?.profile_picture[0]
    ? uint8ArrayToBase64(user?.project_info?.user_data?.profile_picture[0])
    : '../../../assets/Logo/CypherpunkLabLogo.png';

  let userName = user?.project_info?.user_data?.full_name ?? 'userName';

  let openchat_name =
    user?.project_info?.user_data?.openchat_username[0] ?? 'openchatName';

  let userEmail =
    user?.project_info?.user_data?.email[0] ?? 'email@example.com';

  let userCountry = user?.project_info?.user_data?.country ?? 'Country';

  let userBio = user?.project_info?.user_data?.bio[0] ?? 'Bio not available';

  let userAreaOfInterest =
    user?.project_info?.user_data?.area_of_interest ?? 'Area of Interest';

  let userReasonToJoin =
    user?.project_info?.user_data?.reason_to_join[0] ??
    'Reason to join not available';

  let userTypeOfProfile =
    user?.project_info?.user_data?.type_of_profile[0] ?? 'individual';

  let socialLinks =
    user?.project_info?.user_data?.social_links[0] ??
    'No social links available';

  let projectDescription =
    user?.project_info?.project_description[0] ??
    'Project description not available';

  let projectId = user?.project_info?.project_id ?? 'projectId';

  let offer = user?.offer ?? 'offer';

  let offerId = user?.offer_id ?? 'offerId';

  let requestStatus = user?.request_status ?? 'pending';

  let response = user?.response ?? 'No response';

  let acceptedAt = user?.accepted_at ?? 0n;

  let declinedAt = user?.declined_at ?? 0n;

  let selfDeclinedAt = user?.self_declined_at ?? 0n;

  let senderPrincipal = user?.sender_principal ?? 'Principal not available';

  let sentAt = user?.sent_at ?? 0n;

  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE INVESTOR APPROCHES PROJECT
  const handleSelfReject = async (offerDataId) => {
    try {
      const result =
        await actor.self_decline_request_from_investor_to_project(offerDataId);
      console.log(
        `result-in-self_decline_request_from_investor_to_project`,
        result
      );
      if (result) {
        if (result) {
          // handleAcceptModalCloseHandler();
          const response = fetchRequestAssociation(
            'self-reject',
            'from-project',
            'vc',
            null,
            covertedPrincipal,
            actor
          );
          const resultData = await response.api_data;
          setAssociateData(resultData);
          setIsSubmitting(false);
        } else {
          // handleAcceptModalCloseHandler();
          setAssociateData([]);
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.log(
        `error-in-self_decline_request_from_investor_to_project`,
        error
      );
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
      if (result) {
        handleAcceptModalCloseHandler();
        const response = fetchRequestAssociation(
          'approved',
          'from-project',
          'vc',
          null,
          covertedPrincipal,
          actor
        );
        const resultData = await response.api_data;
        setAssociateData(resultData);
        setIsSubmitting(false);
      } else {
        handleAcceptModalCloseHandler();
        setAssociateData([]);
        setIsSubmitting(false);
      }
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
      if (result) {
        handleDeclineModalCloseHandler();
        const response = fetchRequestAssociation(
          'declined',
          'from-project',
          'vc',
          null,
          covertedPrincipal,
          actor
        );
        const resultData = await response.api_data;
        setAssociateData(resultData);
        setIsSubmitting(false);
      } else {
        handleDeclineModalCloseHandler();
        setAssociateData([]);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(`error-in-decline_offer_from_project_to_investor`, error);
      handleDeclineModalCloseHandler();
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {selectedTypeData === 'to-project' ? (
        <AssociationRecieverDataToProject
          user={user}
          activeTabData={activeTabData}
          selectedTypeData={selectedTypeData}
          handleSelfReject={handleSelfReject}
          handleAcceptModalOpenHandler={handleAcceptModalOpenHandler}
          handleDeclineModalOpenHandler={handleDeclineModalOpenHandler}
          setOpenDetail={setOpenDetail}
        />
      ) : selectedTypeData === 'from-project' ? (
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
        ''
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
          title={'Accept Offer'}
          onClose={handleAcceptModalCloseHandler}
          onSubmitHandler={handleAcceptOffer}
          isSubmitting={isSubmitting}
        />
      )}
      {isDeclineOfferModal && (
        <DeclineOfferModal
          title={'Decline Offer'}
          onClose={handleDeclineModalCloseHandler}
          onSubmitHandler={handleDeclineOffer}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default AssociationDetailsInvestorCard;

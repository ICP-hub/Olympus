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
import AssociationRecieverDataToProject from './AssociationRecieverDataToProject ';
import AssociationRecieverDataFromProject from './AssociationRecieverDataFromProject';
import fetchRequestAssociation from '../../Utils/apiNames/getAssociationApiName';
import { Principal } from '@dfinity/principal';

const AssociationDetailsMentorCard = ({
  user,
  index,
  selectedTypeData,
  activeTabData,
  associateData,
  setAssociateData,
}) => {
  console.log('selectedTypeData', selectedTypeData);
  const actor = useSelector((currState) => currState.actors.actor);
  const [associationProfileData, setAssociationProfileData] = useState(user);
  const [openDetail, setOpenDetail] = useState(false);
  const [offerDataId, setOfferDataId] = useState(null);
  const [isAcceptOfferModal, setIsAcceptOfferModal] = useState(null);
  const [isDeclineOfferModal, setIsDeclineOfferModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const principal = useSelector((currState) => currState.internet.principal);
  console.log('user', user);

  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE MENTOR APPROCHES PROJECT
  const handleSelfReject = async (offer_id) => {
    setIsSubmitting(true);
    const covertedPrincipal = await Principal.fromText(principal);

    try {
      const result =
        await actor.self_decline_request_from_mentor_project(offer_id);
      if (result) {
        console.log(`result-in-self_decline_request_for_mentor`, result);
        const response = fetchRequestAssociation(
          'self-reject',
          'to-project',
          'mentor',
          null,
          null,
          actor
        );
        const resultData = await response.api_data;
        setAssociationProfileData(resultData[0]);
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
      if (result) {
        console.log(`result-in-accept_offer_of_project`, result);
        handleAcceptModalCloseHandler();
        const response = fetchRequestAssociation(
          'approved',
          'from-project',
          'mentor',
          null,
          covertedPrincipal,
          actor
        );
        const resultData = await response.api_data;
        console.log('resultData', resultData);
        setAssociationProfileData(resultData[0]);
        setIsSubmitting(false);
      } else {
        console.log(`error-in-accept_offer_of_project`, error);
        handleAcceptModalCloseHandler();
        setIsSubmitting(false);
      }
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
      if (result) {
        console.log(`result-in-decline_offer_of_project`, result);
        handleDeclineModalCloseHandler();
        const response = fetchRequestAssociation(
          'declined',
          'from-project',
          'mentor',
          null,
          covertedPrincipal,
          actor
        );
        const resultData = await response.api_data;
        setAssociationProfileData(resultData[0]);
        setIsSubmitting(false);
      } else {
        console.log(`error-in-decline_offer_of_project`, error);
        handleDeclineModalCloseHandler();
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(`error-in-decline_offer_of_project`, error);
      handleDeclineModalCloseHandler();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {selectedTypeData === 'to-project' ? (
        <AssociationRecieverDataToProject
          user={associationProfileData}
          activeTabData={activeTabData}
          selectedTypeData={selectedTypeData}
          handleSelfReject={handleSelfReject}
          handleAcceptModalOpenHandler={handleAcceptModalOpenHandler}
          handleDeclineModalOpenHandler={handleDeclineModalOpenHandler}
          isSubmitting={isSubmitting}
          setOpenDetail={setOpenDetail}
        />
      ) : selectedTypeData === 'from-project' ? (
        <AssociationRecieverDataFromProject
          user={associationProfileData}
          activeTabData={activeTabData}
          selectedTypeData={selectedTypeData}
          handleSelfReject={handleSelfReject}
          handleAcceptModalOpenHandler={handleAcceptModalOpenHandler}
          handleDeclineModalOpenHandler={handleDeclineModalOpenHandler}
          isSubmitting={isSubmitting}
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

export default AssociationDetailsMentorCard;

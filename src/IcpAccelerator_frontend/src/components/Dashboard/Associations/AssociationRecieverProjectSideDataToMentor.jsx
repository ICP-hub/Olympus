import React, { useState } from 'react';
import { Star, PlaceOutlined as PlaceOutlinedIcon } from '@mui/icons-material';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';
import Avatar from '@mui/material/Avatar';
import ConfirmationModal from '../../../models/ConfirmationModal';

const AssociationRecieverProjectSideDataToMentor = ({
  user,
  activeTabData,
  selectedTypeData,
  handleMentorSelfReject,
  handleInvestorSelfReject,
  handleMentorDeclineModalOpenHandler,
  handleMentorAcceptModalOpenHandler,
  handleInvestorDeclineModalOpenHandler,
  handleInvestorAcceptModalOpenHandler,
  isSubmitting,
  setOpenDetail,
}) => {
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const openModal = ({ title, message, onConfirm }) => {
    setModalData({ title, message, onConfirm });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);
  const offerDetails = {
    offer: user?.offer ?? 'offer',
    offerId: user?.offer_id ?? 'offerId',
    acceptedAt: user?.accepted_at ?? 0n,
    declinedAt: user?.declined_at ?? 0n,
    selfDeclinedAt: user?.self_declined_at ?? 0n,
    receiverPrincipal: user?.receiever_principal ?? 'Principal not available',
    senderPrincipal: user?.sender_principal ?? 'Sender Principal not available',
    sentAt: user?.sent_at ?? 0n,
    requestStatus: user?.request_status ?? 'pending',
    response: user?.response ?? '',
  };

  // Receiver Data
  const receiverData = {
    profile: {
      yearsOfMentoring:
        user?.reciever_data?.[0]?.[0]?.profile?.years_of_mentoring ?? '0',
      icpHubOrSpoke:
        user?.reciever_data?.[0]?.[0]?.profile?.icp_hub_or_spoke ?? false,
      hubOwner:
        user?.reciever_data?.[0]?.[0]?.profile?.hub_owner?.[0] ??
        'Hub not available',
      website:
        user?.reciever_data?.[0]?.[0]?.profile?.website?.[0] ??
        'https://defaultwebsite.com',
      existingIcpMentor:
        user?.reciever_data?.[0]?.[0]?.profile?.existing_icp_mentor ?? false,
      categoryOfMentoringService:
        user?.reciever_data?.[0]?.[0]?.profile?.category_of_mentoring_service ??
        'Category not available',
    },
    user: {
      fullName:
        user?.reciever_data?.[0]?.[1]?.params?.full_name ??
        'User Name not available',
      profilePicture: user?.reciever_data?.[0]?.[1]?.params
        ?.profile_picture?.[0]
        ? uint8ArrayToBase64(
            user?.reciever_data?.[0]?.[1]?.params?.profile_picture?.[0]
          )
        : '../../../assets/Logo/CypherpunkLabLogo.png',
      username:
        user?.reciever_data?.[0]?.[1]?.params?.openchat_username?.[0] ??
        'Username not available',
      email:
        user?.reciever_data?.[0]?.[1]?.params?.email?.[0] ??
        'email@example.com',
      country:
        user?.reciever_data?.[0]?.[1]?.params?.country ??
        'Country not available',
      bio:
        user?.reciever_data?.[0]?.[1]?.params?.bio?.[0] ?? 'Bio not available',
      areaOfInterest:
        user?.reciever_data?.[0]?.[1]?.params?.area_of_interest ??
        'Area of Interest not available',
      reasonToJoin:
        user?.reciever_data?.[0]?.[1]?.params?.reason_to_join?.[0] ??
        'Reason to join not available',
      typeOfProfile:
        user?.reciever_data?.[0]?.[1]?.params?.type_of_profile?.[0] ??
        'individual',
      socialLinks:
        user?.reciever_data?.[0]?.[1]?.params?.social_links?.[0]?.link?.[0] ??
        'No social links available',
    },
  };

  // Sender Data
  const senderData = {
    profile: {
      name:
        user?.sender_data?.[0]?.[0]?.params?.project_name ??
        'Project Name not available',
      description:
        user?.sender_data?.[0]?.[0]?.params?.project_description?.[0] ??
        'Project description not available',
      website:
        user?.sender_data?.[0]?.[0]?.params?.project_website?.[0] ??
        'https://defaultwebsite.com',
      elevatorPitch:
        user?.sender_data?.[0]?.[0]?.params?.project_elevator_pitch?.[0] ??
        'No project elevator pitch available',
      dappLink:
        user?.sender_data?.[0]?.[0]?.params?.dapp_link?.[0] ??
        'No dapp link available',
      preferredIcpHub:
        user?.sender_data?.[0]?.[0]?.params?.preferred_icp_hub?.[0] ??
        'Hub not available',
      longTermGoals:
        user?.sender_data?.[0]?.[0]?.params?.long_term_goals?.[0] ??
        'Long term goals not available',
      revenue: user?.sender_data?.[0]?.[0]?.params?.revenue?.[0] ?? 0n,
      weeklyActiveUsers:
        user?.sender_data?.[0]?.[0]?.params?.weekly_active_users?.[0] ?? 0n,
      supportsMultichain:
        user?.sender_data?.[0]?.[0]?.params?.supports_multichain?.[0] ??
        'Chain not available',
      technicalDocs:
        user?.sender_data?.[0]?.[0]?.params?.technical_docs?.[0] ??
        'No technical docs available',
      tokenEconomics:
        user?.sender_data?.[0]?.[0]?.params?.token_economics?.[0] ??
        'No token economics available',
      targetMarket:
        user?.sender_data?.[0]?.[0]?.params?.target_market?.[0] ??
        'Target market not available',
      moneyRaised:
        user?.sender_data?.[0]?.[0]?.params?.money_raised_till_now?.[0] ??
        false,
      isRegistered:
        user?.sender_data?.[0]?.[0]?.params?.is_your_project_registered?.[0] ??
        false,
      isLiveOnIcp:
        user?.sender_data?.[0]?.[0]?.params?.live_on_icp_mainnet?.[0] ?? false,
      privateDocumentsUploaded:
        user?.sender_data?.[0]?.[0]?.params?.upload_private_documents?.[0] ??
        false,
      typeOfRegistration:
        user?.sender_data?.[0]?.[0]?.params?.type_of_registration?.[0] ??
        'Company',
      areaOfFocus:
        user?.sender_data?.[0]?.[0]?.params?.project_area_of_focus ??
        'Area of Focus not available',
      projectCover: user?.sender_data?.[0]?.[0]?.params?.project_cover?.[0]
        ? uint8ArrayToBase64(
            user?.sender_data?.[0]?.[0]?.params?.project_cover?.[0]
          )
        : '../../../assets/Logo/CypherpunkLabLogo.png',
      projectLogo: user?.sender_data?.[0]?.[0]?.params?.project_logo?.[0]
        ? uint8ArrayToBase64(
            user?.sender_data?.[0]?.[0]?.params?.project_logo?.[0]
          )
        : '../../../assets/Logo/CypherpunkLabLogo.png',
    },
    user: {
      fullName:
        user?.sender_data?.[0]?.[1]?.params?.full_name ??
        'Sender Name not available',
      profilePicture: user?.sender_data?.[0]?.[1]?.params?.profile_picture?.[0]
        ? uint8ArrayToBase64(
            user?.sender_data?.[0]?.[1]?.params?.profile_picture?.[0]
          )
        : '../../../assets/Logo/CypherpunkLabLogo.png',
      username:
        user?.sender_data?.[0]?.[1]?.params?.openchat_username?.[0] ??
        'Username not available',
      email:
        user?.sender_data?.[0]?.[1]?.params?.email?.[0] ?? 'sender@example.com',
      country:
        user?.sender_data?.[0]?.[1]?.params?.country ?? 'Country not available',
      bio: user?.sender_data?.[0]?.[1]?.params?.bio?.[0] ?? 'Bio not available',
      areaOfInterest:
        user?.sender_data?.[0]?.[1]?.params?.area_of_interest ??
        'Area of Interest not available',
      reasonToJoin:
        user?.sender_data?.[0]?.[1]?.params?.reason_to_join?.[0] ??
        'Reason to join not available',
      typeOfProfile:
        user?.sender_data?.[0]?.[1]?.params?.type_of_profile?.[0] ??
        'individual',
      socialLinks:
        user?.sender_data?.[0]?.[1]?.params?.social_links?.[0]?.link?.[0] ??
        'No social links available',
    },
    status: {
      isActive: user?.sender_data?.[0]?.[1]?.active ?? false,
      isApproved: user?.sender_data?.[0]?.[1]?.approve ?? false,
      isDeclined: user?.sender_data?.[0]?.[1]?.decline ?? false,
    },
  };

  console.log('senderData', user.sender_data);
  // POST API HANDLER TO SELF-REJECT A REQUEST WHERE MENTOR APPROCHES PROJECT
  return (
    <>
      <div className='md:py-6 w-full flex flex-wrap md:flex-nowrap rounded-lg shadow-sm'>
        <div className='w-full flex justify-center md:w-[272px]'>
          <div className='min-w-[200px] h-40 dxs:min-w-[236px] w-full md:max-w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between dxs:h-60 relative overflow-hidden cursor-pointer'>
            <div
              className='absolute inset-0 flex items-center justify-center'
              onClick={() => setOpenDetail(true)}
            >
              <img
                src={senderData?.profile?.projectLogo}
                alt='projectLogo'
                className='w-24 h-24 rounded-full object-cover'
                loading='lazy'
                draggable={false}
              />
            </div>

            {/* <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
            <Star className="text-yellow-400 w-4 h-4" />
            <span className="text-sm font-medium">9</span>
          </div> */}
          </div>
        </div>

        <div className='flex-grow mt-4 md:mt-0 ml-0 md:ml-[25px]  w-full '>
          <div className='flex w-full mt-2 flex-wrap md:flex-nowrap md:mt-0 lg:flex-wrap xl:flex-nowrap xl:mt-0 sm2:justify-between items-start '>
            <div>
              <h3 className='text-xl line-clamp-1 break-all font-bold'>
                {senderData?.profile?.name}
              </h3>

              <span className='flex py-2'>
                <Avatar
                  alt='Mentor'
                  src={senderData?.user?.profilePicture}
                  className=' mr-2'
                  sx={{ width: 24, height: 24 }}
                />
                <span className='text-gray-500'>
                  {senderData?.user?.fullName}
                </span>
              </span>
            </div>
            <span className='mr-2 mb-2 text-[#016AA2] px-3 py-1 rounded-full bg-gray-100 text-sm'>
              {activeTabData === 'pending' ? (
                <span className='font-semibold'>
                  {timestampAgo(offerDetails?.sentAt)}
                </span>
              ) : activeTabData === 'approved' ? (
                <span className='font-semibold'>
                  {timestampAgo(offerDetails?.acceptedAt)}
                </span>
              ) : activeTabData === 'declined' ? (
                <span className='font-semibold'>
                  {timestampAgo(offerDetails?.declinedAt)}
                </span>
              ) : activeTabData === 'self-reject' ? (
                <span className='font-semibold'>
                  {timestampAgo(offerDetails?.selfDeclinedAt)}
                </span>
              ) : null}
            </span>
          </div>
          <span className='text-gray-500 line-clamp-1 break-all'>
            @ {senderData?.user?.email}
          </span>

          <div className='border-t border-gray-200 '></div>

          <p className='text-gray-600 break-all line-clamp-2 min-h-16'>
            {parse(senderData?.user?.bio)}
          </p>
          <div className='flex items-center text-sm text-gray-500 flex-wrap py-1'>
            {senderData?.user?.areaOfInterest &&
              senderData?.user?.areaOfInterest
                .split(',')
                .slice(0, 2)
                .map((tag, index) => (
                  <span
                    key={index}
                    className='mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full'
                  >
                    {tag?.trim()}
                  </span>
                ))}

            <span className='mr-2 mb-1 flex text-[#121926] items-center'>
              <PlaceOutlinedIcon className='text-[#364152] mr-1 w-4 h-4' />{' '}
              {senderData?.user?.country}
            </span>
          </div>
          {activeTabData === 'pending' ? (
            <div className='flex flex-wrap sm:flex-nowrap'>
              {/* Handle Self Decline for Mentor or Investor */}
              {selectedTypeData === 'to-mentor' ||
              selectedTypeData === 'to-investor' ? (
                <button
                  className='mr-2 mb-1 border border-[#FEDF89] bg-[#FFFAEB] text-[#B54707] px-3 py-1 rounded-full'
                  onClick={() =>
                    openModal({
                      title: 'Self Decline',
                      message:
                        'Are you sure you want to self-decline this offer?',
                      onConfirm: () => {
                        selectedTypeData === 'to-mentor'
                          ? handleMentorSelfReject(offerDetails?.offerId)
                          : handleInvestorSelfReject(offerDetails?.offerId);
                        closeModal();
                      },
                    })
                  }
                >
                  Self Decline
                </button>
              ) : selectedTypeData === 'from-mentor' ? (
                <div className='flex flex-wrap sm:flex-nowrap'>
                  {/* Handle Mentor Reject */}
                  <button
                    className='mr-2 mb-1 border border-[#C11574] bg-[#FDF2FA] text-[#C11574] px-3 py-1 rounded-full'
                    onClick={() =>
                      handleMentorDeclineModalOpenHandler(offerDetails?.offerId)
                    }
                  >
                    Reject
                  </button>
                  {/* Handle Mentor Approve */}
                  <button
                    className='mr-2 mb-1 border border-[#097647] bg-[#EBFDF3] text-[#097647] px-3 py-1 rounded-full'
                    onClick={() =>
                      handleMentorAcceptModalOpenHandler(offerDetails?.offerId)
                    }
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <>
                  {/* Handle Investor Reject */}
                  <button
                    className='mr-2 mb-1 border border-[#C11574] bg-[#FDF2FA] text-[#C11574] px-3 py-1 rounded-full'
                    onClick={() =>
                      handleInvestorDeclineModalOpenHandler(
                        offerDetails?.offerId
                      )
                    }
                  >
                    Reject
                  </button>
                  {/* Handle Investor Approve */}
                  <button
                    className='mr-2 mb-1 border border-[#097647] bg-[#EBFDF3] text-[#097647] px-3 py-1 rounded-full'
                    onClick={() =>
                      handleInvestorAcceptModalOpenHandler(
                        offerDetails?.offerId
                      )
                    }
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          ) : activeTabData === 'approved' ? (
            <div className='flex'>
              <span className='mr-2 mb-1 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full capitalize'>
                {offerDetails?.requestStatus}
              </span>
            </div>
          ) : activeTabData === 'declined' ? (
            <div className='flex'>
              <span className='mr-2 mb-1 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full capitalize'>
                {offerDetails?.requestStatus}
              </span>
            </div>
          ) : activeTabData === 'self-reject' ? (
            <div className='flex'>
              <span className='mr-2 mb-1 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full capitalize '>
                {offerDetails?.requestStatus === 'self_declined'
                  ? 'Self Declined'
                  : offerDetails?.requestStatus}
              </span>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        title={modalData.title}
        message={modalData.message}
        onConfirm={modalData.onConfirm}
        onCancel={closeModal}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AssociationRecieverProjectSideDataToMentor;

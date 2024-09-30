import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import { formatFullDateFromBigInt } from '../Utils/formatter/formatDateFromBigInt';
import AnnouncementModal from '../Modals/AnnouncementModal';
import NoCardData from './NoCardData';
import DeleteModel from '../../models/DeleteModel';
import editp from '../../../assets/Logo/edit.png';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Principal } from '@dfinity/principal';
import CampaignIcon from '@mui/icons-material/Campaign';
import AnnouncementCardSkeleton from './skeletonProfile/AnnouncementCardSkeleton';

const AnnouncementCard = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [noData, setNoData] = useState(null);
  const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnnouncementData, setCurrentAnnouncementData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numSkeletons, setNumSkeletons] = useState(1);


  const handleOpenModal = (card = null) => {
    setCurrentAnnouncementData(card);
    setAnnouncementModalOpen(true);
  };

  const handleCloseModal = () => {
    setAnnouncementModalOpen(false);
    setCurrentAnnouncementData(null);
  };

  // Submit handler passed
  const handleAddOrUpdateAnnouncement = async (formData) => {
    setIsSubmitting(true);

    if (actor) {
      const argument = {
        announcement_title: formData.announcementTitle,
        announcement_description: formData.announcementDescription,
      };

      try {
        if (currentAnnouncementData) {
          // Update existing announcement
          const result = await actor.update_announcement_by_id(
            currentAnnouncementData.announcement_id,
            argument
          );
          console.log('update function call hua h');

          if (result && result.includes('Announcement updated successfully')) {
            toast.success('Announcement updated successfully');
            handleCloseModal();
            setTimeout(() => {
              fetchLatestAnnouncement();
            }, 1000);
          } else {
            toast.error('Something went wrong');

            handleCloseModal();
            setTimeout(() => {
              fetchLatestAnnouncement();
            }, 1000);
          }
        } else {
          // Add new announcement
          const result = await actor.add_announcement(argument);

          if (result && Object.keys(result).length > 0) {
            toast.success('Announcement updated successfully');
            handleCloseModal();
            setTimeout(() => {
              fetchLatestAnnouncement();
            }, 1000);
          } else {
            toast.error('Something went wrong');
            handleCloseModal();
            setTimeout(() => {
              fetchLatestAnnouncement();
            }, 1000);
          }
        }
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (announcementId) => {
    setIsSubmitting(true);
    try {
      const result = await actor.delete_announcement_by_id(announcementId);

      if (result && result.length > 0) {
        toast.success('Announcement deleted successfully');

        fetchLatestAnnouncement();
        handleCloseDeleteModal();
      } else {
        toast.success('Something went wrong');
        fetchLatestAnnouncement();
        handleCloseDeleteModal();
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open the delete confirmation modal
  const handleOpenDeleteModal = (card) => {
    setCurrentAnnouncementData(card);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentAnnouncementData(null);
  };

  // Fetch the latest announcements
  const fetchLatestAnnouncement = async () => {
    setIsLoading(true);
    let convertedId = Principal.fromText(principal);
    await actor
      .get_announcements_by_principal(convertedId)
      .then((result) => {
        console.log('RESULT FROM ANN API', result);
        if (!result || result.length === 0) {
          setNoData(true);
          setLatestAnnouncementData([]);
          setIsLoading(false);
        } else {
          setLatestAnnouncementData(result);
          setNoData(false);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setNoData(true);
        setLatestAnnouncementData([]);

        console.log('error-in-get_announcements_by_project_id', error);

        setIsLoading(false);
        console.log('error-in-get_announcements_by_project_id', error);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchLatestAnnouncement();
    }
  }, [actor]);

  console.log('latestAnnouncementData =>', latestAnnouncementData);

  const updateNumSkeletons = () => {
    if (window.innerWidth >= 1100) {
      setNumSkeletons(3);
    } else if (window.innerWidth >= 768) {
      setNumSkeletons(2);
    } else {
      setNumSkeletons(1);
    }
  };

  useEffect(() => {
    updateNumSkeletons();
    window.addEventListener("resize", updateNumSkeletons);
    return () => {
      window.removeEventListener("resize", updateNumSkeletons);
    };
  }, []);

  return (
    <div className='bg-white w-full'>
      {latestAnnouncementData.length > 0 && (
        <div className='sm:flex sm:justify-end items-center sticky top-16 bg-white '>
          {/* <h1 className="text-xl font-bold p-3">Announcements</h1> */}
          <button
            className='hidden md:block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 mt-4'
            onClick={() => handleOpenModal(null)}
          >
            + Add new Announcement
          </button>
        </div>
      )}
      {latestAnnouncementData.length === 0 ? (
        <div className='md:py-4 py-12'>
          {/* {noData===true ? <NoCardData />: 
            <AnnouncementCardSkeleton />
          }
          {noData && <button
            className="bg-[#155EEF] text-white px-2 md:px-4 py-2 rounded-md flex items-center justify-center mx-auto text-sm sm0:text-[16px] "
            onClick={() => handleOpenModal(null)}
          >
            <CampaignIcon className=" mr-2" />
            <span className="line-clamp-1 break-all">Add new Announcement</span>
          </button>} */}
          {noData === true ? (
            <>
              <NoCardData />
              <button
                className='bg-[#155EEF] text-white px-2 md:px-4 py-2 rounded-md flex items-center justify-center mx-auto text-sm sm0:text-[16px] '
                onClick={() => handleOpenModal(null)}
              >
                <CampaignIcon className=' mr-2' />
                <span className='line-clamp-1 break-all'>
                  Add new Announcement
                </span>
              </button>
            </>
          ) : (
            Array(numSkeletons)
              .fill(0)
              .map((_, index) => (
                <AnnouncementCardSkeleton key={index} />
              ))
          )}
        </div>
      ) : (
        latestAnnouncementData.map((card, index) => {
          let ann_name = card?.announcement_data?.announcement_title ?? '';
          let ann_time = card?.timestamp
            ? formatFullDateFromBigInt(card?.timestamp)
            : '';
          let ann_desc =
            card?.announcement_data?.announcement_description ?? '';
          let ann_project_logo = card?.user_data[0]?.params?.profile_picture[0]
            ? uint8ArrayToBase64(card?.user_data[0]?.params?.profile_picture[0])
            : '';
          let ann_project_name = card?.project_name ?? '';
          let ann_project_desc = card?.project_desc ?? '';
          return !isLoading ? (
            <div key={index} className='container mx-auto md:my-6  bg-white'>
              <div className='flex justify-between items-center px-3 pb-1 mb-2'>
                <div className='text-gray-500 truncate break-all'>
                  {ann_time}
                </div>

                <div className='flex  gap-4 items-center'>
                  <img
                    src={editp}
                    className=' text-gray-500 hover:underline text-xs h-[1.3rem]  sm:h-5 sm:w-5 cursor-pointer'
                    alt='edit'
                    onClick={() => handleOpenModal(card)}
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='text-[16px] text-gray-500 cursor-pointer hover:text-red-700'>
                    <DeleteOutlinedIcon
                      className='cursor-pointer hover:text-red-500'
                      onClick={() => handleOpenDeleteModal(card)}
                    />
                  </span>
                </div>
              </div>
              {/* <h2 className="text-gray-900 text-xl font-bold mb-3">

              {ann_name}
            </h2> */}
              <div className='flex flex-col sm0:flex-row w-full items-start px-3 py-5 shadow rounded-md mb-4 sm0:space-x-4'>
                <div className='flex-shrink-0 self-center'>
                  <img
                    src={ann_project_logo}
                    alt='pic'
                    className='w-16 h-16 rounded-full border border-gray-300'
                    loading='lazy'
                    draggable={false}
                  />
                </div>
                <div className='flex flex-col gap-1 overflow-hidden'>
                  <h2 className='text-lg mt-4 sm0:mt-0 font-semibold break-all line-clamp-1 '>
                    {ann_name}
                  </h2>
                  <h3 className='text-gray-600 text-sm font-normal break-all line-clamp-2 '>
                    {ann_desc}
                  </h3>
                </div>
              </div>
              {/* <div className="text-gray-500 leading-relaxed">
              <p>{ann_desc}</p>
            </div> */}
              {/* <hr className="mt-4" /> */}
            </div>
          ) : (
            
            <AnnouncementCardSkeleton />
          );
        })
      )}
      {latestAnnouncementData.length > 0 && (
        <div className='flex justify-center mt-2'>
          <button
            className=' md:hidden w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 mb-8 truncate'
            onClick={() => handleOpenModal(null)}
          >
            + Add new Announcement
          </button>
        </div>
      )}

      {isAnnouncementModalOpen && (
        <AnnouncementModal
          isOpen={isAnnouncementModalOpen}
          onClose={handleCloseModal}
          onSubmitHandler={handleAddOrUpdateAnnouncement}
          isSubmitting={isSubmitting}
          isUpdate={!!currentAnnouncementData}
          data={currentAnnouncementData}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModel
          title='Delete Announcement'
          heading='Are you sure you want to delete this announcement?'
          onClose={handleCloseDeleteModal}
          onSubmitHandler={() =>
            handleDelete(currentAnnouncementData.announcement_id)
          }
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default AnnouncementCard;

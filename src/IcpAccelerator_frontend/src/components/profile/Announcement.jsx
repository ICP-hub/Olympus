import React, { useState, useEffect } from 'react';
import CampaignIcon from '@mui/icons-material/Campaign';
import AnnouncementModal from '../Modals/AnnouncementModal';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import AnnouncementCard from './AnnouncementCard';
//import NoCardData from './NoCardData';

// import AnnouncementModal from '../../models/AnnouncementModal';

const Announcement = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const handleCloseModal = () => setAnnouncementModalOpen(false);
  const handleOpenModal = () => setAnnouncementModalOpen(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [isProjectLive, setIsProjectLive] = useState(false);

  const fetchProjectData = async (isMounted) => {
    try {
      const result = await actor.get_my_project();
      console.log('result-in-get_my_project', result);
      if (isMounted) {
        if (result && Object.keys(result).length > 0) {
          setProjectData(result);
          setIsProjectLive(
            result?.params?.dapp_link[0] &&
              result?.params?.dapp_link[0].trim() !== ''
              ? result?.params?.dapp_link[0]
              : null
          );
        } else {
          setProjectData(null);
          setIsProjectLive(null);
        }
      }
    } catch (error) {
      if (isMounted) {
        console.log('error-in-get_my_project', error);
        setProjectData(null);
        setIsProjectLive(null);
      }
    }
  };
  console.log('setted data is', projectData);
  useEffect(() => {
    let isMounted = true;
    if (actor) {
      fetchProjectData(isMounted);
    } else {
      navigate('/');
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);

  const handleAddAnnouncement = async ({
    announcementTitle,
    announcementDescription,
  }) => {
    console.log('add announcement');
    setIsSubmitting(true);
    if (actor) {
      let argument = {
        project_id: projectData?.uid,
        announcement_title: announcementTitle,
        announcement_description: announcementDescription,
        timestamp: Date.now(),
      };
      console.log('argument', argument);
      await actor
        .add_project_announcement(argument)
        .then((result) => {
          // console.log("result-in-add_announcement", result);
          if (result && Object.keys(result).length > 0) {
            handleCloseModal();
            fetchProjectData();
            setIsSubmitting(false);
            toast.success('announcement added successfully');
            console.log('announcement added');
            //window.location.reload();
          } else {
            handleCloseModal();
            // setModalOpen(false)
            setIsSubmitting(false);
            toast.error('something got wrong');
          }
        })
        .catch((error) => {
          console.log('error-in-add_announcement', error);
          toast.error('something went wrong');
          setIsSubmitting(false);
          handleCloseModal();
          // setModalOpen(false)
        });
    }
  };

  return (
    <div className='w-full'>
      {/* <div className="flex justify-between items-center sticky top-16 bg-white ">
        <h1 className="text-xl font-bold p-3">Announcements </h1>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => setAnnouncementModalOpen(true)}
        >
          + Add new Announcement
        </button>
      </div> */}

      <AnnouncementCard data={projectData} />
    </div>
  );
};

export default Announcement;

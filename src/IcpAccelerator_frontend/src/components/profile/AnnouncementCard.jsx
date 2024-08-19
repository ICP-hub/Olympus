import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/autoplay";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { formatFullDateFromBigInt } from "../Utils/formatter/formatDateFromBigInt";
import ment from "../../../assets/images/ment.jpg";
import AnnouncementModal from "../Modals/AnnouncementModal";
import NoCardData from "./NoCardData";
import DeleteModel from "../../models/DeleteModel";
import editp from "../../../assets/Logo/edit.png";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ok from "../../../assets/images/ok.jpg";

const AnnouncementCard = ({data}) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [noData, setNoData] = useState(null);
  const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnnouncementData, setcurrentAnnouncementData] = useState(null);

  // if (!data) {
  //   return null;
  // }
  const handleOpenModal = (card) => {
    setcurrentAnnouncementData(card);
    setAnnouncementModalOpen(true);
  };

  const handleCloseModal = () => {
    setAnnouncementModalOpen(false);
    setcurrentAnnouncementData(null);
  };

  const handleOpenDeleteModal = (id) => {
    setcurrentAnnouncementData(id);
    setDeleteModalOpen(true);
  };

  const handleClose = () => {
    setDeleteModalOpen(false);
    setcurrentAnnouncementData(null);
  };

  // const fetchLatestAnnouncement = async (caller) => {
  //   await caller
  //     .get_announcements_by_project_id(data?.uid)
  //     .then((result) => {
  //       if (!result || result.length === 0) {
  //         setNoData(true);
  //         setLatestAnnouncementData([]);
  //       } else {
  //         setLatestAnnouncementData(result);
  //         setNoData(false);
  //       }
  //     })
  //     .catch((error) => {
  //       setNoData(true);
  //       setLatestAnnouncementData([]);
  //       console.log("error-in-get_announcements_by_project_id", error);
  //     });
  // };

  // <<<<<<----- Updating the announcement_data -------->>>>>>

  const handleUpdateAnnouncement = async ({
    announcementTitle,
    announcementDescription,
  }) => {
    // console.log("update announcement");
    setIsSubmitting(true);
    if (actor) {
      let new_details = {
        project_id: data?.uid,
        announcement_title: announcementTitle,
        announcement_description: announcementDescription,
        timestamp: Date.now(),
      };
      // console.log("new_details", new_details);
      await actor
        .update_project_announcement_by_id(
          currentAnnouncementData?.timestamp,
          new_details
        )
        .then((result) => {
          console.log("result-in-update_announcement", result);
          if (
            result &&
            result.includes(
              `Announcement updated successfully for ${currentAnnouncementData?.timestamp}`
            )
          ) {
            handleCloseModal();
            setIsSubmitting(false);
            toast.success("Announcement updated successfully");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            setIsSubmitting(false);
            toast.error("something got wrong");
          }
        })
        .catch((error) => {
          console.log("error-in-update_announcement", error);
          toast.error("something got wrong");
          setIsSubmitting(false);
          handleCloseModal();
        });
    }
  };

  // <<<<<<----- Deleting the announcement_data -------->>>>>>

  const handleDelete = async () => {
    // console.log("project_id===>>>>>>>>>", currentAnnouncementData);
    setIsSubmitting(true);
    await actor
      .delete_project_announcement_by_id(currentAnnouncementData?.timestamp)
      .then((result) => {
        // console.log("result-in-get_announcements_by_project_id", result);
        if (
          result &&
          result.includes(
            `Announcement deleted successfully for ${currentAnnouncementData?.timestamp}`
          )
        ) {
          setIsSubmitting(false);
          toast.success("Announcement deleted successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error(result);
          setIsSubmitting(false);
        }
      })
      .catch((error) => {
        console.log("error-in-get_announcements_by_project_id", error);
        setIsSubmitting(false);
      });
  };

  if (!data || noData) {
    return <NoCardData message="No active announcements found" />;
  }

  return (
    <div className=" bg-white">
      

      {latestAnnouncementData.length === 0 ? (
        <NoCardData message="No active announcements found" />
      ) : (
        latestAnnouncementData.map((card, index) => {
          let ann_name = card?.announcement_data?.announcement_title ?? "abc";
          let ann_time = card?.timestamp
            ? formatFullDateFromBigInt(card?.timestamp)
            : "def";
          let ann_desc =
            card?.announcement_data?.announcement_description ?? "ghi";
          let ann_project_logo = card?.project_logo
            ? uint8ArrayToBase64(card?.project_logo[0])
            : ment;
          let ann_project_name = card?.project_name ?? "jkl";
          let ann_project_desc = card?.project_desc ?? "mno";
          let announcement_id = card?.announcement_id ?? "pqr";
          return (
            <div className="container mx-auto my-6 p-4 bg-white">
              <div className="flex justify-between items-center pb-1 mb-2">
                <div className="text-gray-500 font-medium text-sm">
                  18/08/2024
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    onClick={() => handleOpenModal(card)}
                    className="rounded-full p-1"
                  >
                    <img
                      src={editp}
                      className="h-5 w-5 hover:text-green-400 cursor-pointer"
                      alt="edit"
                    />
                  </div>
                  <div
                    onClick={() => handleOpenDeleteModal(announcement_id)}
                    className="rounded-full p-1"
                  >
                    <DeleteOutlinedIcon className="cursor-pointer hover:text-red-500" />
                  </div>
                </div>
              </div>
              <h2 className="text-gray-900 text-xl font-bold mb-3">
                Announcement1
              </h2>
              <div className="flex items-center mb-4 space-x-4">
                <img
                  src={ok}
                  alt="pic"
                  className="h-12 w-12 rounded-full border border-gray-300"
                />
                <div>
                  <h2 className="text-lg font-semibold">Vijay</h2>
                  <h3 className="text-gray-600 font-normal">hello vijay</h3>
                </div>
              </div>
              <div className="text-gray-500 leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Molestias dicta voluptates dignissimos ex nobis vel nesciunt
                  quas a ducimus dolor, magni culpa necessitatibus facere sed!
                  Officiis iusto facere debitis ipsam id optio, 
                </p>
              </div>
              <hr className="mt-4" />
            </div>
           );
        })
       )}

      {isAnnouncementModalOpen && (
        <AnnouncementModal
          isModalOpen={isAnnouncementModalOpen}
          closeModal={handleCloseModal}
          data={currentAnnouncementData}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModel
          isSubmitting={isSubmitting}
          isDeleteModalOpen={isDeleteModalOpen}
          closeDeleteModal={handleClose}
          deleteFunction={() => {}}
        />
      )}
    </div>
  );
};

export default AnnouncementCard;

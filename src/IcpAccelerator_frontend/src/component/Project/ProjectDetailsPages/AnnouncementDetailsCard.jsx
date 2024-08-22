import React, { useState, useEffect } from "react";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import NoDataCard from "../../Mentors/Event/NoDataCard";
import ment from "../../../../assets/images/ment.jpg";
import NoData from "../../../../assets/images/file_not_found.png";
import AnnouncementModal from "../../../models/AnnouncementModal";
import DeleteModel from "../../../models/DeleteModel";
const AnnouncementDetailsCard = ({ data }) => {
  // console.log('data', data?.uid)
  if (!data) {
    return null;
  }
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [noData, setNoData] = useState(null);
  const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnnouncementData, setcurrentAnnouncementData] = useState(null);
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

  const fetchLatestAnnouncement = async (caller) => {
    await caller
      .get_announcements_by_project_id(data?.uid)
      .then((result) => {
        // console.log("result-in-get_announcements_by_project_id", result);
        if (!result || result.length == 0) {
          setNoData(true);
          setLatestAnnouncementData([]);
        } else {
          setLatestAnnouncementData(result);
          setNoData(false);
        }
      })
      .catch((error) => {
        setNoData(true);
        setLatestAnnouncementData([]);
        console.log("error-in-get_announcements_by_project_id", error);
      });
  };

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

  useEffect(() => {
    if (actor && data) {
      fetchLatestAnnouncement(actor);
    }
  }, [actor, data]);

  return (
    <div className="gap-2 overflow-x-auto">
      <Swiper
        // className="custom-swiper"
        modules={[Pagination]}
        // centeredSlides={true}
        loop={latestAnnouncementData.length <= 3}
        // autoplay={
        //   latestAnnouncementData.length <= 3
        //     ? {
        //         delay: 2500,
        //         disableOnInteraction: false,
        //       }
        //     : {}
        // }
        pagination={{
          clickable: true,
        }}
        spaceBetween={30}
        slidesPerView="auto"
        slidesOffsetAfter={100}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {
        latestAnnouncementData.length == 0 ? (
          <NoDataCard image={NoData} desc={"No active announcement found"} />
        ) : (
          latestAnnouncementData &&
          latestAnnouncementData.map((card, index) => {
            console.log("card", card);
            let ann_name = card?.announcement_data?.announcement_title ?? "";
            let project_id = card?.announcement_data?.project_id ?? "";
            let ann_time = card?.timestamp
              ? formatFullDateFromBigInt(card?.timestamp)
              : "";
            let ann_desc =
              card?.announcement_data?.announcement_description ?? "";
            let ann_project_logo = card?.project_logo
              ? uint8ArrayToBase64(card?.project_logo[0])
              : ment;
            // let ann_project_logo = ment;
            let ann_project_name = card?.project_name ?? "";
            let ann_project_desc = card?.project_desc ?? "";
            let announcement_id = card?.announcement_id ?? "";
            return (
              <SwiperSlide key={index}>
                <div className="border-2 mb-4 mx-1 overflow-hidden rounded-3xl shadow-md">
                  <div className="p-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex-row justify-between">
                        <div className="flex justify-between items-center">
                          {" "}
                          <p className="text-black font-bold">{ann_name}</p>
                          <div
                            onClick={() => handleOpenModal(card)}
                            className="flex items-center"
                          >
                            {" "}
                            {/* <div onClick={handleOpenModal}> */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="green"
                              className="size-4"
                            >
                              <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                              <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                            </svg>
                            {/* </div> */}
                            <div
                              onClick={() =>
                                handleOpenDeleteModal(announcement_id)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="red"
                                className="size-4 ml-2"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="text-black text-gray-500 text-right">
                          {ann_time}
                        </p>
                      </div>
                      <p className="h-32 overflow-y-scroll text-gray-500 text-sm">
                        {ann_desc}
                      </p>
                      <div className="flex flex-row gap-2 items-center">
                        <img
                          className="h-14 w-14 rounded-xl object-cover"
                          src={ann_project_logo}
                          alt="img"
                        />
                        <div className="flex flex-col justify-around gap-2">
                          <p className="font-bold text-md truncate w-28">
                            {ann_project_name}
                          </p>
                          <p className="font-semibold text-gray-500  text-xs line-clamp-2">
                            {ann_project_desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })
        )}
      </Swiper>
      {isAnnouncementModalOpen && (
        <AnnouncementModal
          onClose={handleCloseModal}
          onSubmitHandler={handleUpdateAnnouncement}
          isSubmitting={isSubmitting}
          isUpdate={true}
          data={currentAnnouncementData}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModel
          onClose={handleClose}
          title={"Delete announcement"}
          heading={"Are you sure to delete this announcement"}
          onSubmitHandler={handleDelete}
          isSubmitting={isSubmitting}
          data={currentAnnouncementData}
        />
      )}
    </div>
  );
};

export default AnnouncementDetailsCard;

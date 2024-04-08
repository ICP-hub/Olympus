import React, { useState, useEffect } from "react";
import ment from "../../../assets/images/ment.jpg";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import useFormatDateFromBigInt from "../hooks/useFormatDateFromBigInt";
import NoDataCard from "../Mentors/Event/AnnouncementsNoDataCard";
import { formatFullDateFromBigInt } from "../Utils/formatter/formatDateFromBigInt";

const AnnouncementCard = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);
  const [timeAgo] = useFormatDateFromBigInt();

  const fetchLatestAnnouncement = async (caller) => {
    await caller
      .get_latest_announcements()
      .then((result) => {
        if (result && result.length > 0) {
          setLatestAnnouncementData(result);
          setNoData(false)
        } else {
          setLatestAnnouncementData([]);
          setNoData(true)
        }
      })
      .catch((error) => {
        setNoData(true);
        setLatestAnnouncementData([]);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchLatestAnnouncement(actor);
    } else {
      fetchLatestAnnouncement(IcpAccelerator_backend);
    }
  }, [actor]);

  return (
    <div className="gap-2 overflow-x-auto">
    <Swiper
      modules={[Pagination, Autoplay]}
      centeredSlides={true}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
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
      {latestAnnouncementData.length == 0 ?
        <NoDataCard />
        : latestAnnouncementData[0][1].map((card, index) => {
          let ann_name = card?.announcement_data?.announcement_title ?? "";
          let ann_time = card?.timestamp ? formatFullDateFromBigInt(card?.timestamp) : "";
          let ann_desc = card?.announcement_data?.announcement_description ?? "";
          let ann_project_logo = card?.project_logo ? uint8ArrayToBase64(card?.project_logo) : ment;
          let ann_project_name = card?.project_name ?? "";
          let ann_project_desc = card?.project_desc ?? "";
          return (
            <SwiperSlide key={index}>
              <div className="border-2 mb-4 mx-1 overflow-hidden rounded-3xl shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex-row justify-between">
                      <p className="text-black font-bold">{ann_name}</p>
                      <p className="text-black text-right">{ann_time}</p>
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
                        <p className="font-bold text-md truncate w-28">{ann_project_name}</p>
                        <p className="font-semibold text-gray-500  text-xs line-clamp-2">
                          {ann_project_desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
    </Swiper>
  </div>
  );
};

export default AnnouncementCard;

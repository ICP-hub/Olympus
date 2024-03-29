import React, { useState, useEffect } from "react";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import NoDataCard from "../../Mentors/Event/NoDataCard";

const AnnouncementDetailsCard = ({ data }) => {
  // console.log('data', data?.uid)
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);

  const fetchLatestAnnouncement = async (caller) => {
    await caller
      .get_announcements_by_project_id(data?.uid)
      .then((result) => {
        console.log("result-in-get_announcements_by_project_id", result);
        if (!result || result.length == 0) {
          setNoData(true)
          setLatestAnnouncementData([]);
        } else {
          setLatestAnnouncementData(result);
          setNoData(false)
        }
      })
      .catch((error) => {
        setNoData(true)
        setLatestAnnouncementData([])
        console.log("error-in-get_announcements_by_project_id", error);
      });
  };

  useEffect(() => {
    if (actor && data) {
      fetchLatestAnnouncement(actor);
    }
  }, [actor, data]);



  return (
    // <div className="">
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
          : latestAnnouncementData.map((card, index) => {
            // console.log('card', card)
            let ann_name = card?.announcement_data?.announcement_title ?? "";
            let ann_time = card?.timestamp ? formatFullDateFromBigInt(card?.timestamp) : "";
            let ann_desc = card?.announcement_data?.announcement_description ?? "";
            let ann_project_logo = card?.project_logo ? uint8ArrayToBase64(card?.project_logo) : "";
            let ann_project_name = card?.project_name ?? "";
            let ann_project_desc = card?.project_desc ?? "";
            return (
              <SwiperSlide key={index}>
                <div className="shadow-md rounded-3xl overflow-hidden border-2 ">
                  <div className="p-6">
                    {/* <h1 className="text-[#7283EA] font-bold">Announcement</h1> */}
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row justify-between mt-3">
                        <p className="text-black font-bold">{ann_name}</p>
                        <p className="text-black font-bold">{ann_time}</p>
                      </div>
                      <p className="text-gray-500 text-sm mt-3">
                        {ann_desc}
                      </p>
                      <div className="flex flex-row gap-2 items-center">
                        <img
                          className="h-20 w-20 rounded-xl"
                          src={ann_project_logo}
                          alt="img"
                        />
                        <div className="flex flex-col justify-around gap-2">
                          <p className="text-md font-bold">{ann_project_name}</p>
                          <p className="font-semibold text-gray-500  text-xs">
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
    // </div>
  );
};

export default AnnouncementDetailsCard;

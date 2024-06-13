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
import NoDataCard from "../Mentors/Event/NoDataCard";
import { formatFullDateFromBigInt } from "../Utils/formatter/formatDateFromBigInt";
import NoData from "../../../assets/images/file_not_found.png";
import { AnnouncementSkeleton } from "./Skeleton/Announcementskeleton";

const AnnouncementCard = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);
  const [timeAgo] = useFormatDateFromBigInt();
  const [numSkeletons, setNumSkeletons] = useState(1);

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
  useEffect(() => {
    let isMounted = true;

    const fetchLatestAnnouncement = async (caller) => {
      setIsLoading(true);
      try {
        const result = await caller.get_latest_announcements();
        if (isMounted) {
          if (result && result.length > 0) {
            setLatestAnnouncementData(result);
            setNoData(false);
            setIsLoading(false);
          } else {
            setNoData(true);
            setIsLoading(false);
            setLatestAnnouncementData([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          setNoData(true);
          setIsLoading(false);
          setLatestAnnouncementData([]);
        }
      }
    };

    if (actor) {
      fetchLatestAnnouncement(actor);
    } else {
      fetchLatestAnnouncement(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);

  console.log("noData", noData);
  return (
    <>
      {isLoading ? (
        <div className="w-full grid gap-2 grid-cols-1 md:grid-cols-2 lg1:grid-cols-3 md:px-4 md:gap-4 sm:gap-4">
          {Array(numSkeletons)
            .fill(0)
            .map((_, index) => (
              <AnnouncementSkeleton key={index} />
            ))}
        </div>
      ) : noData ? (
        <NoDataCard image={NoData} desc={"No active announcement found"} />
      ) : (
        <div className="gap-2 overflow-x-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            // centeredSlides={true}
            loop={
              latestAnnouncementData[0] &&
              latestAnnouncementData[0][1].length > 3
            }
            // autoplay={{
            //   delay: 2500,
            //   disableOnInteraction: false,
            // }}
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
              1024: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {latestAnnouncementData &&
              latestAnnouncementData[0] &&
              Array.isArray(latestAnnouncementData[0][1]) &&
              latestAnnouncementData[0][1].map((card, index) => {
                let ann_name =
                  card?.announcement_data?.announcement_title ?? "";
                let ann_time = card?.timestamp
                  ? formatFullDateFromBigInt(card?.timestamp)
                  : "";
                let ann_desc =
                  card?.announcement_data?.announcement_description ?? "";
                let ann_project_logo = card?.project_logo
                  ? uint8ArrayToBase64(card?.project_logo[0])
                  : ment;
                let ann_project_name = card?.project_name ?? "";
                let ann_project_desc = card?.project_desc ?? "";
                return (
                  <SwiperSlide key={index}>
                    <div className="border-2 mb-4 mx-1 overflow-hidden rounded-3xl shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                      <div className="p-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex-row justify-between">
                            <p className="text-black font-bold">{ann_name}</p>
                            <p className="text-gray-500 flex justify-end text-sm my-2 items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                className="size-4 mr-2"
                                fill="currentColor"
                              >
                                <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
                              </svg>
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
                            <div className="flex flex-col justify-around w-fit">
                              <p className="font-bold text-md truncate">
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
              })}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default AnnouncementCard;

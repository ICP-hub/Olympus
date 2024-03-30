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

const AnnouncementCard = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);
  const [timeAgo] = useFormatDateFromBigInt();

  const fetchLatestAnnouncement = async (caller) => {
    await caller
      .get_latest_announcements()
      .then((result) => {
        console.log("result-in-latest-announcement", result);
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
        // setLatestAnnouncementData(defaultArray)
        console.log("error-in-latest-announcement", error);
      });
  };

  console.log("latestAnnouncementData", latestAnnouncementData);
  useEffect(() => {
    if (actor) {
      fetchLatestAnnouncement(actor);
    } else {
      fetchLatestAnnouncement(IcpAccelerator_backend);
    }
  }, [actor]);

  return (
    // <div className="">
    <div className="gap-2 overflow-x-auto">
      {noData ?
        <NoDataCard />
        :
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
          {latestAnnouncementData && latestAnnouncementData.length > 0 &&
            latestAnnouncementData[0][1].map((data, index) => {
              // result[1].map((data) => {
              console.log('data', data)
              let projectName = "";
              let projectImage = "";
              let projectDescription = "";
              let announcementDate = "";
              let announcementTitle = "";
              let announcementDescription = "";

              if (noData == false) {
                projectName = data?.project_name;
                projectImage = uint8ArrayToBase64(data?.project_logo);
                projectDescription = data?.project_desc;
                announcementDate = timeAgo(data?.timestamp);
                announcementTitle = data?.announcement_data?.announcement_title;
                announcementDescription =
                  data?.announcement_data?.announcement_description;
              } else {
                // projectName = data.projectName;
                // projectImage = data.projectImage;
                // projectDescription = data.projectDescription;
              }
              return (
                <SwiperSlide key={index}>
                  <div className="shadow-md rounded-3xl overflow-hidden border-2 ">
                    <div className="p-6">
                      {/* <h1 className="text-[#7283EA] font-bold">Announcement</h1> */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between mt-3">
                          <p className="text-black font-bold">
                            {announcementTitle}
                          </p>
                          <p className="text-black font-bold">
                            {announcementDate}
                          </p>
                        </div>

                        <p className="text-gray-500 text-sm mt-3">
                          {announcementDescription}
                        </p>
                        <div className="flex flex-row gap-2 items-center">
                          <img
                            className="h-20 w-20 rounded-xl"
                            src={projectImage}
                            alt="User Profile"
                          />
                          <div className="flex flex-col justify-around gap-2">
                            <p className="text-md font-bold">{projectName}</p>
                            <p className="font-semibold text-gray-500  text-xs">
                              {projectDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
              // })
            })}
        </Swiper>}
    </div>
    // </div>
  );
};

export default AnnouncementCard;

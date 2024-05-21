import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import ment from "../../../../assets/images/ment.jpg";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import useFormatDateFromBigInt from "../../hooks/useFormatDateFromBigInt";
import NoDataCard from "../../Mentors/Event/NoDataCard";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import NoData from "../../../../assets/images/file_not_found.png";

const ProjectJobCard = ({ image, website, tags, country }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [noData, setNoData] = useState(null);
  const [latestJobs, setLatestJobs] = useState([]);
  const [timeAgo] = useFormatDateFromBigInt();

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted
  
    const fetchLatestJobs = async (caller) => {
      await caller
        .get_all_jobs()
        .then((result) => {
          if (isMounted) { // Only update state if the component is still mounted
            if (!result || result.length === 0) {
              setNoData(true);
              setLatestJobs([]);
            } else {
              setLatestJobs(result);
              setNoData(false);
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            setNoData(true);
            setLatestJobs([]);
          }
        });
    };
  
    if (actor) {
      fetchLatestJobs(actor);
    } else {
      fetchLatestJobs(IcpAccelerator_backend);
    }
  
    return () => {
      isMounted = false; // Set the flag to false when the component unmounts
    };
  }, [actor]);
  if (noData) {
    return (
      <div className="w-full items-center md:py-4 py-2">
       <NoDataCard image={NoData} desc={'No jobs are posted yet'}/>
      </div>
    );
  }
  return (
    <div className="py-4 gap-2 overflow-x-auto">
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
            slidesPerView: 2,
          },
        }}
      >
        {latestJobs.length == 0 ?
          <NoDataCard />
          : latestJobs.map((card, index) => {
            let job_name = card?.job_data?.title ?? "";
            let job_category = card?.job_data?.category ?? "";
            let job_description = card?.job_data?.description ?? "";
            let job_location = card?.job_data?.location ?? "";
            let job_link = card?.job_data?.link ?? "";
            let job_project_logo = card?.project_logo
              ? uint8ArrayToBase64(card?.project_logo)
              : ment;
            let job_project_name = card?.project_name ?? "";
            let job_project_desc = card?.project_desc ?? "";
            let job_post_time = card?.timestamp
              ? formatFullDateFromBigInt(card?.timestamp)
              : "";
            return (
              <SwiperSlide key={index} >
                  <div className="border-2 mb-5 mx-1 rounded-2xl shadow-lg" key={index}>
                    <div className="md:p-4 p-2">
                      <h3 className="text-lg font-[950] truncate w-1/2">{job_name}</h3>
                      <div className="sm:flex">
                        <div className="sm:w-1/2">
                          <div className="pt-2 flex">
                            <img
                              src={job_project_logo}
                              alt="project"
                              className="w-16 aspect-square object-cover rounded-md"
                            />
                            <div className="mt-auto pl-2">
                              <p className="font-[950] text-base truncate w-28">
                                {job_project_name}
                              </p>
                              <p className="font-[450] line-clamp-2 text-xs w-48">
                                {job_project_desc}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 pr-4">
                            <p className="text-base font-[950] py-2">
                              Responsibilities
                            </p>
                            <ul className="text-xs md:pl-4 font-[450] list-disc list-outside">
                              <li className=" overflow-y-scroll">{job_description}</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between sm:w-1/2">
                          <div className="flex justify -center items-center">
                            <p className="text-base font-[950] pr-2">TAGS</p>
                            {tags && (
                              <p className="flex items-center flex-wrap py-2 gap-2">
                                <span
                                  className="bg-transparent text-xs font-semibold px-3 py-1 rounded-2xl border-2 border-black"
                                >
                                  {job_category}
                                </span>
                              </p>
                            )}
                          </div>
                          <div className="mt-2">
                            <p className="text-base font-[950] py-2">Post Date</p>
                            <ul className="text-xs md:pl-4 font-[450] list-disc list-inside">
                              <li>{job_post_time}</li>
                            </ul>
                          </div>

                          <div className="mt-2">
                            <p className="text-base font-[950] py-1">Location</p>
                            <span className="capitalize">{job_location}</span>
                          </div>
                          <div className="mt-2 flex md:block md3:flex items-end">
                            <div className="w-full">
                              <span className="text-sm">Register your interest here:</span>
                            </div>
                            <div className="w-full sm:w-1/2">
                              {" "}
                              {website && (
                                <a href={job_link} target="_blank">
                                  <button className="font-[450] border text-xs text-[#ffffff] py-[7px] px-[9px] rounded-md border-[#FFFFFF4D] drop-shadow-[#00000040]  bg-[#3505B2] text-nowrap">
                                    I'm interested!
                                  </button>
                                </a>
                              )}
                            </div>
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
  );
};

export default ProjectJobCard;

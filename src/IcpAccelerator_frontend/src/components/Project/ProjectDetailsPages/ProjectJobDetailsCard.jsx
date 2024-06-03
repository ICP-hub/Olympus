import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import NoDataCard from "../../Mentors/Event/NoDataCard";
import ment from "../../../../assets/images/ment.jpg";
import NoData from "../../../../assets/images/file_not_found.png";
import AddJobsModal from "../../../models/AddJobsModal";

const ProjectJobDetailsCard = ({ data, image, website, tags, country }) => {
  console.log("job", data);
  if (!data) {
    return null;
  }
  const actor = useSelector((currState) => currState.actors.actor);

  const [noData, setNoData] = useState(null);
  const [latestJobs, setLatestJobs] = useState([]);

  const [isJobsModalOpen, setJobsModalOpen] = useState(false);
  const handleJobsCloseModal = () => setJobsModalOpen(false);
  const handleJobsOpenModal = () => setJobsModalOpen(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("data?.uid", data?.uid);
  const fetchPostedJobs = async () => {
    let project_id = data?.uid;
    await actor
      .get_jobs_posted_by_project(project_id)
      .then((result) => {
        console.log("result-in-get_jobs_posted_by_project", result);
        if (!result || result.length < 0) {
          setNoData(true);
          setLatestJobs([]);
        } else {
          setLatestJobs(result);
          setNoData(false);
        }
      })
      .catch((error) => {
        setNoData(true);
        setLatestJobs([]);
        console.log("result-in-get_jobs_posted_by_project", error);
      });
  };
  const handleEdit = async (job_data) => {
    console.log("job_data===>>>>>>>>>", job_data);
    let project_id = data?.uid;
    setIsSubmitting(true);
    let new_details = {
      title: job_data?.jobTitle,
      description: job_data?.jobDescription,
      category: job_data?.jobCategory,
      location: job_data?.jobLocation,
      link: job_data?.jobLink,
      project_id: project_id,
    };
    console.log("argument", new_details);
    await actor.edit_job_details(job_id, new_details).then((result) => {
      if (result) {
        handleJobsCloseModal();
        setIsSubmitting(false);
        console.log("result-in-get_announcements_by_project_id", result);
      } else {
        handleJobsCloseModal();
        setIsSubmitting(false);
        toast.error(result);
      }
    });
  };
  useEffect(() => {
    if (actor && data) {
      fetchPostedJobs(actor);
    }
  }, [actor]);
  return (
    <div className="py-4 gap-2 overflow-x-auto">
      <Swiper
        modules={[Pagination, Autoplay]}
        // centeredSlides={true}
        loop={latestJobs.length <= 3}
        autoplay={
          latestJobs.length <= 3
            ? {
                delay: 2500,
                disableOnInteraction: false,
              }
            : {}
        }
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
        {noData ? (
          <NoDataCard image={NoData} desc={"No jobs are posted yet"} />
        ) : (
          latestJobs.map((card, index) => {
            console.log("card", card);
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
              <SwiperSlide>
                <div
                  className="border-2 mb-5 mx-1 rounded-2xl shadow-lg"
                  key={index}
                >
                  <div className="md:p-4 p-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-[950] truncate w-1/2">
                        {job_name}
                      </h3>
                      <div className="flex items-center">
                        {" "}
                        <div onClick={handleJobsOpenModal}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="green"
                            className="size-4"
                          >
                            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                            <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                          </svg>
                        </div>
                        <div>
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
                            <li className="h-40 overflow-y-scroll">
                              {job_description}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between sm:w-1/2">
                        <div className="flex justify-center items-center">
                          <p className="text-base font-[950] px-2">TAGS</p>
                          {tags && (
                            <p className="flex items-center flex-wrap py-2 gap-2">
                              <span className="bg-transparent text-xs font-semibold px-3 py-1 rounded-2xl border-2 border-black">
                                {job_category}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="mt-2">
                          <p className="text-base font-[950] py-2">Post Date</p>
                          <ul className="text-xs md:pl-4 font-[450] list-disc list-outside">
                            <li>{job_post_time}</li>
                          </ul>
                        </div>

                        <div className="mt-2">
                          <p className="text-base font-[950] py-1">Location</p>
                          <span className="capitalize">{job_location}</span>
                        </div>
                        <div className="mt-2 flex items-end">
                          <div className="w-full">
                            <span>Register your interest here:</span>
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
          })
        )}
      </Swiper>
      {isJobsModalOpen && (
        <AddJobsModal
          jobbutton={"Update"}
          jobtitle={"Update Job"}
          onJobsClose={handleJobsCloseModal}
          onSubmitHandler={handleEdit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ProjectJobDetailsCard;

import React, { useEffect, useState } from "react";
import eventbg from "../../../../assets/images/bg.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import parse from "html-react-parser";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import JobRegister1 from "../../Modals/JobModal/JobRegister1";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import JobUpdate from "../../Modals/JobModal/JobUpdate";
import EditIcon from "@mui/icons-material/Edit";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import LinkIcon from "@mui/icons-material/Link";
import { FaEye } from "react-icons/fa";
import { Principal } from "@dfinity/principal";
import { Folder } from '@mui/icons-material';
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import {
  clockSvgIcon,
  coinStackedSvgIcon,
  lenseSvgIcon,
  locationSvgIcon,
} from "../../Utils/Data/SvgData";
import { AiFillDelete } from "react-icons/ai";
import JobDetails from "../../jobs/JobDetails";
import editp from "../../../../assets/Logo/edit.png";
import DeleteModel from "./DeleteModel";
const NewJob = ({ latestJobs }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [currentJobData, setCurrentJobData] = useState(null);
  const [latestJob, setLatestJob] = useState([]);
  const [noData, setNoData] = useState(null);
  const [isJobsModalOpen, setJobsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openJobUid, setOpenJobUid] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const principal = useSelector((currState) => currState.internet.principal);
  const handleJobsOpenModal = (jobData) => {
    setCurrentJobData(jobData);
    setJobsModalOpen(true);
    console.log("/////id did id ", jobData);
  };

  const handleJobsCloseModal = () => {
    setJobsModalOpen(false);
    setCurrentJobData(null);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (data) => {
    setCurrentJobData(data);
    setDeleteModalOpen(true);
  };
  const handleClose = () => {
    setDeleteModalOpen(false);
    setCurrentJobData(null);
  };

  const fetchPostedJobs = async () => {
    // if (!latestJobs || !latestJobs.job_id) return;
    let principles = Principal.fromText(principal);
    try {
      const result = await actor.get_jobs_posted_by_principal(principles);
      console.log("result-in-get_jobs_posted_by_project", result);
      if (!result || result.length === 0 || result[0].length === 0) {
        setNoData(true);
        setLatestJob([]);
      } else {
        setLatestJob(result);
        setNoData(false);
      }
    } catch (error) {
      setNoData(true);
      setLatestJob([]);
      console.log("Error fetching jobs:", error);
    }
  };


  //Edit func
  const handleEdit = async (job_data) => {
    if (!currentJobData) return;

    console.log("currentJobData===>>>>>>>>>", currentJobData);
    setIsSubmitting(true);
    const new_details = {
        title: job_data.jobTitle,
        description: job_data.jobDescription,
        category: job_data.jobCategory,
        location: job_data.jobLocation, 
        link: job_data.jobLink,
        job_type: job_data.job_type,
    };
    console.log("argument", new_details);

    try {
      const result = await actor.update_job_post_by_id(
        currentJobData?.job_id,
        new_details
      );
    //   const isSuccess = result.includes(
    //     `job post updated successfully for ${currentJobData?.job_id}`
    //   );
    //   if (isSuccess) {
       
        toast.success("Job post updated successfully", {
            style: {
              backgroundColor: "#28a745", 
              color: "#fff", 
            },
            icon: "✅",
          });
          handleJobsCloseModal();
        setIsSubmitting(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        console.log("result-in-get_announcements_by_project_id", result);
    //   } else {
    //     handleJobsCloseModal();
    //     setIsSubmitting(false);
    //     toast.error(result);
    //   }
    } catch (error) {
      handleJobsCloseModal();
      setIsSubmitting(false);
      console.log("Error updating job post:", error);
    }
  };


    // <<<<<------- Job Delete ----->>>>>
    const handleDelete = async () => {
        console.log("currentJobData===>>>>>>>>>", currentJobData);
        setIsSubmitting(true);
        await actor
          .delete_job_post_by_id(currentJobData?.job_id)
          .then((result) => {
            // console.log("delete_job_post_by_id", result);
            // if (
            //   result &&
            //   result.includes(
            //     `job post deleted successfully for ${currentJobData?.job_id}`
            //   )
            // ) {
            
              toast.success("Job post deleted successfully", {
                style: {
                  backgroundColor: "#d9534f", 
                  color: "#fff", 
                },
                icon: "🗑️", 
              });
              setDeleteModalOpen();
              setIsSubmitting(false);
              setTimeout(() => {
                window.location.reload();
              }, 2000);
              console.log("result-in-get_announcements_by_project_id", result);
            // } else {
            //   setDeleteModalOpen();
            //   setIsSubmitting(false);
            //   toast.error(result);
            // }
          });
      };
  useEffect(() => {
    if (actor && latestJobs) {
      fetchPostedJobs();
    }
  }, [actor, latestJobs]);

  const openJobDetails = (job_id) => {
    console.log("Opening job details for UID:", job_id);
    setOpenJobUid(job_id);
  };

  const closeJobDetails = () => {
    setOpenJobUid(null);
  };
  return (
    <>
      {!noData && latestJobs && latestJobs.length > 0 && (
        <div className="hidden md:block">
          <div className="flex flex-col items-end mb-8 max-w-7xl pt-4 ">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={handleModalOpen}
            >
              + Add new Job
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto bg-white">
        {latestJob.length === 0 ? (
          <>
            <div className=" md:p-6">
              {/* Content */}
              <div className="text-center py-4 md:py-12">
                <div className="flex justify-center items-center">
                  <svg
                    width="154"
                    height="64"
                    viewBox="0 0 154 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask id="path-1-inside-1_1002_24444" fill="white">
                      <path
                        fillRule="evenodd"
                        clip-rule="evenodd"
                        d="M49 4C44.5817 4 41 7.58172 41 12V22.134V27.6206V47.2006C41 51.6811 41 53.9213 41.8719 55.6326C42.6389 57.1379 43.8628 58.3617 45.3681 59.1287C47.0794 60.0007 49.3196 60.0007 53.8 60.0007H90.6C95.6405 60.0007 98.1607 60.0007 100.086 59.0197C101.779 58.1569 103.156 56.78 104.019 55.0866C105 53.1614 105 50.6411 105 45.6006V22.134C105 17.6536 105 15.4134 104.128 13.7021C103.361 12.1968 102.137 10.9729 100.632 10.2059C98.9206 9.33398 96.6804 9.33398 92.2 9.33398H68.4316C68.0091 9.33398 67.6667 8.9915 67.6667 8.56903C67.6667 6.04563 65.621 4 63.0976 4H49Z"
                      />
                    </mask>
                    <path
                      fillRule="evenodd"
                      clip-rule="evenodd"
                      d="M49 4C44.5817 4 41 7.58172 41 12V22.134V27.6206V47.2006C41 51.6811 41 53.9213 41.8719 55.6326C42.6389 57.1379 43.8628 58.3617 45.3681 59.1287C47.0794 60.0007 49.3196 60.0007 53.8 60.0007H90.6C95.6405 60.0007 98.1607 60.0007 100.086 59.0197C101.779 58.1569 103.156 56.78 104.019 55.0866C105 53.1614 105 50.6411 105 45.6006V22.134C105 17.6536 105 15.4134 104.128 13.7021C103.361 12.1968 102.137 10.9729 100.632 10.2059C98.9206 9.33398 96.6804 9.33398 92.2 9.33398H68.4316C68.0091 9.33398 67.6667 8.9915 67.6667 8.56903C67.6667 6.04563 65.621 4 63.0976 4H49Z"
                      fill="#9AA4B2"
                    />
                    <path
                      d="M41.8719 55.6326L42.763 55.1786H42.763L41.8719 55.6326ZM45.3681 59.1287L45.8221 58.2377L45.3681 59.1287ZM100.086 59.0197L99.6319 58.1287L100.086 59.0197ZM104.019 55.0866L104.91 55.5406L104.019 55.0866ZM104.128 13.7021L105.019 13.2481V13.2481L104.128 13.7021ZM100.632 10.2059L101.086 9.31493V9.31493L100.632 10.2059ZM42 12C42 8.134 45.134 5 49 5V3C44.0294 3 40 7.02943 40 12H42ZM42 22.134V12H40V22.134H42ZM42 27.6206V22.134H40V27.6206H42ZM42 47.2006V27.6206H40V47.2006H42ZM42.763 55.1786C42.4108 54.4874 42.2096 53.6458 42.1057 52.3736C42.0008 51.0898 42 49.4574 42 47.2006H40C40 49.4244 39.9992 51.1523 40.1123 52.5365C40.2264 53.9323 40.4612 55.0665 40.9809 56.0866L42.763 55.1786ZM45.8221 58.2377C44.5049 57.5666 43.4341 56.4957 42.763 55.1786L40.9809 56.0866C41.8438 57.78 43.2206 59.1568 44.9141 60.0197L45.8221 58.2377ZM53.8 59.0007C51.5433 59.0007 49.9109 58.9999 48.627 58.895C47.3549 58.791 46.5132 58.5899 45.8221 58.2377L44.9141 60.0197C45.9342 60.5395 47.0683 60.7743 48.4642 60.8883C49.8484 61.0014 51.5763 61.0007 53.8 61.0007V59.0007ZM90.6 59.0007H53.8V61.0007H90.6V59.0007ZM99.6319 58.1287C98.8338 58.5354 97.8687 58.7638 96.4298 58.8814C94.9791 58.9999 93.1367 59.0007 90.6 59.0007V61.0007C93.1037 61.0007 95.0417 61.0014 96.5926 60.8747C98.1552 60.747 99.4128 60.485 100.54 59.9107L99.6319 58.1287ZM103.128 54.6326C102.361 56.1379 101.137 57.3617 99.6319 58.1287L100.54 59.9107C102.422 58.952 103.951 57.4222 104.91 55.5406L103.128 54.6326ZM104 45.6006C104 48.1374 103.999 49.9798 103.881 51.4304C103.763 52.8693 103.535 53.8344 103.128 54.6326L104.91 55.5406C105.484 54.4135 105.746 53.1559 105.874 51.5933C106.001 50.0423 106 48.1044 106 45.6006H104ZM104 22.134V45.6006H106V22.134H104ZM103.237 14.156C103.589 14.8472 103.79 15.6889 103.894 16.961C103.999 18.2449 104 19.8773 104 22.134H106C106 19.9103 106.001 18.1824 105.888 16.7982C105.774 15.4023 105.539 14.2682 105.019 13.2481L103.237 14.156ZM100.178 11.0969C101.495 11.7681 102.566 12.8389 103.237 14.1561L105.019 13.2481C104.156 11.5546 102.779 10.1778 101.086 9.31493L100.178 11.0969ZM92.2 10.334C94.4567 10.334 96.0891 10.3348 97.373 10.4397C98.6451 10.5436 99.4868 10.7448 100.178 11.0969L101.086 9.31493C100.066 8.79515 98.9317 8.56035 97.5358 8.4463C96.1516 8.33321 94.4237 8.33398 92.2 8.33398V10.334ZM68.4316 10.334H92.2V8.33398H68.4316V10.334ZM63.0976 5C65.0688 5 66.6667 6.59791 66.6667 8.56903H68.6667C68.6667 5.49334 66.1733 3 63.0976 3V5ZM49 5H63.0976V3H49V5ZM68.4316 8.33398C68.5614 8.33398 68.6667 8.43922 68.6667 8.56903H66.6667C66.6667 9.54379 67.4569 10.334 68.4316 10.334V8.33398Z"
                      fill="url(#paint0_linear_1002_24444)"
                      mask="url(#path-1-inside-1_1002_24444)"
                    />
                    <path
                      d="M50.9253 25.7523C52.0729 22.7423 52.6069 21.3633 53.5036 20.3537C54.3087 19.4472 55.3216 18.7493 56.4555 18.32C57.7183 17.8418 59.1971 17.834 62.4184 17.834H100.088C103.216 17.834 105.528 17.8345 107.31 17.9958C109.089 18.1569 110.271 18.4743 111.168 19.0626C112.807 20.1373 113.959 21.8107 114.38 23.7246C114.61 24.7722 114.486 25.9895 114.002 27.7098C113.518 29.4317 112.695 31.5926 111.581 34.5157L105.074 51.5824C103.926 54.5923 103.392 55.9713 102.496 56.9809C101.691 57.8875 100.678 58.5853 99.5438 59.0147C98.281 59.4928 96.8022 59.5006 93.581 59.5006H55.9117C52.7833 59.5006 50.471 59.5002 48.6896 59.3389C46.91 59.1777 45.7283 58.8603 44.8313 58.272C43.1928 57.1973 42.0399 55.524 41.6194 53.6101C41.3892 52.5624 41.5136 51.3451 41.997 49.6248C42.4809 47.9029 43.3042 45.7421 44.4186 42.8189L50.9253 25.7523Z"
                      fill="#CDD5DF"
                      stroke="url(#paint1_linear_1002_24444)"
                    />
                    <path
                      opacity="0.2"
                      d="M54.4581 25.5741C55.5912 22.6022 56.1577 21.1162 57.1298 20.0217C57.9886 19.0547 59.069 18.3103 60.2784 17.8524C61.6475 17.334 63.2378 17.334 66.4184 17.334H104.088C110.325 17.334 113.444 17.334 115.442 18.6445C117.19 19.7909 118.42 21.5758 118.868 23.6173C119.381 25.9511 118.27 28.8654 116.048 34.6938L109.541 51.7605C108.408 54.7324 107.842 56.2184 106.87 57.313C106.011 58.2799 104.93 59.0243 103.721 59.4823C102.352 60.0006 100.762 60.0006 97.581 60.0006H59.9117C53.674 60.0006 50.5552 60.0006 48.5571 58.6901C46.8093 57.5437 45.5796 55.7589 45.1311 53.7174C44.6183 51.3835 45.7293 48.4693 47.9515 42.6408L54.4581 25.5741Z"
                      fill="url(#paint2_linear_1002_24444)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_1002_24444"
                        x1="73"
                        y1="4"
                        x2="73"
                        y2="60.0007"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" stopOpacity="0.12" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_1002_24444"
                        x1="77.9997"
                        y1="17.334"
                        x2="77.9997"
                        y2="60.0006"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" stopOpacity="0.12" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient
                        id="paint2_linear_1002_24444"
                        x1="41.333"
                        y1="17.334"
                        x2="85.387"
                        y2="59.2906"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  You haven't posted any jobs yet
                </h2>
                <p className="text-gray-600 mb-2">
                  Any assets used in projects will live here.
                </p>
                <p className="text-gray-600 mb-6">
                  Start creating by uploading your files.
                </p>
                <button
                  className="bg-[#155EEF] text-white px-4 py-2 rounded-md flex items-center justify-center mx-auto"
                  onClick={handleModalOpen}
                >
                  <WorkOutlineOutlinedIcon className="mr-2" />
                  Post a job
                </button>
              </div>
            </div>
          </>
        ) : (
          latestJob.map((card, index) => {
            const fullname = card?.job_poster[0]?.full_name ?? "";
            const job_name = card?.job_data?.title ?? "";
            const job_category = card?.job_data?.category ?? "";
            const job_description = card?.job_data?.description ?? "";
            const job_location = card?.job_data?.location ?? "";
            const job_link = card?.job_data?.link ?? "";
            const job_project_logo = card?.job_poster[0]?.profile_picture[0]
              ? uint8ArrayToBase64(card?.job_poster[0]?.profile_picture[0])
              : null;
            const job_type = card?.job_data?.job_type ?? "";
            const job_project_name = card?.project_name ?? "";
            const job_project_desc = card?.project_desc ?? "";
            const job_post_time = card?.timestamp
              ? formatFullDateFromBigInt(card?.timestamp)
              : "";

            return (
              <>
                <div
                  key={card.job_id || index}
                  className="flex flex-col gap-3 my-4 bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-3 w-full ">
                      <p className="text-gray-400">{job_post_time} </p>
                      <div className="flex justify-between">
                        <h3 className="text-xl font-bold break-all truncate">
                          {job_name}{" "}
                        </h3>
                        <div className="flex  gap-4 items-center">
                          <img
                            src={editp}
                            className=" text-gray-500 hover:underline text-xs h-[1.3rem]  sm:h-5 sm:w-5 cursor-pointer"
                            alt="edit"
                            onClick={() => handleJobsOpenModal(card)}
                            loading="lazy"
                            draggable={false}
                          />
                          <span className="text-[16px] text-gray-500 cursor-pointer hover:text-red-700">
                            <DeleteOutlinedIcon
                              className="cursor-pointer hover:text-red-500"
                              onClick={() => handleOpenDeleteModal(card)}
                            />
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 ">
                        <div
                          className="flex w-14"
                          onClick={() => openJobDetails(card.job_id)}
                        >
                          <img
                            src={job_project_logo}
                            className="w-12 h-12 rounded-full"
                            alt="icon"
                            loading="lazy"
                            draggable={false}
                          />
                        </div>
                        <div className="w-full text-lg font-medium break-all truncate">
                          {fullname}{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-gray-600  overflow-hidden text-ellipsis max-h-12 line-clamp-2">
                      {parse(job_description)}{" "}
                    </p>
                    <div className="flex gap-5 items-center flex-wrap">
                      <div className="flex items-center gap-2 ">
                        {" "}
                        {lenseSvgIcon} <span className="">{job_category}</span>{" "}
                      </div>
                      <div className="flex items-center gap-2">
                        {locationSvgIcon}{" "}
                        <span className="">{job_location}</span>{" "}
                      </div>
                      <div className="flex items-center gap-2">
                        {clockSvgIcon} <span className="ml-2">{job_type}</span>{" "}
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={job_link} target="_blank">
                          <span className="flex">
                            <LinkIcon />
                          </span>{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <hr /> */}
              </>
            );
          })
        )}

        {!noData && latestJobs && latestJobs.length > 0 && (
          <button
            className="bg-blue-500 text-white  px-4 py-2 w-full md:hidden rounded-md mb-4 truncate"
            onClick={handleModalOpen}
          >
            + Add new Job
          </button>
        )}
      </div>
      {isJobsModalOpen && (
        <JobUpdate
          jobbutton={"Update"}
          jobtitle={"Update Job"}
          onJobsClose={handleJobsCloseModal}
          onSubmitHandler={handleEdit}
          isSubmitting={isSubmitting}
          data={currentJobData}
          isJobsModalOpen={isJobsModalOpen}
        />
      )}
      {modalOpen && (
        <JobRegister1 modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
      {openJobUid && <JobDetails setOpen={closeJobDetails} uid={openJobUid} />}
      {isDeleteModalOpen && (
        <DeleteModel
          onClose={handleClose}
          title={"Delete job"}
          heading={"Are you sure to delete this job"}
          onSubmitHandler={handleDelete}
          isSubmitting={isSubmitting}
          data={currentJobData}
        />
      )}
      {modalOpen && (
        <JobRegister1 modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
      <Toaster />
    </>
  );
};

export default NewJob;

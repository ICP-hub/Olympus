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
      <div className="flex flex-col items-end mb-8 max-w-7xl pt-4">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={handleModalOpen}
        >
          + Add new Job
        </button>
      </div>
      <div className="max-w-7xl mx-auto bg-white">
        {latestJob.length === 0 ? (
          <h1>No Data Found</h1>
        ) : (
            latestJob.map((card, index) => {
            console.log("card?.job_poster.profile_picture", card?.job_id);
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
                <div key={card.job_id || index} className="flex flex-col gap-3 my-8">
                  <div className="flex justify-between">
                    <div
                      className="flex flex-col gap-3  "
                    >
                      <p className="text-gray-400">{job_post_time} </p>
                      <h3 className="text-xl font-bold">{job_name} </h3>
                      <p className="flex items-center">
                        <span
                          className="mr-3"
                          onClick={() => openJobDetails(card.job_id)}
                        >
                          <img
                            src={job_project_logo}
                            className="w-8 h-8 rounded-full"
                            alt="icon"
                          />
                        </span>
                        <span>{job_name} </span>
                      </p>
                    </div>
                    <div className="flex  gap-4 items-center">
                    
                      <img
                        src={editp}
                        className=" text-gray-500 hover:underline text-xs h-4 w-4 cursor-pointer"
                        alt="edit"
                        onClick={() => handleJobsOpenModal(card)}
                      />
                      <AiFillDelete
                        onClick={() => handleOpenDeleteModal(card)}
                        className="text-gray-500 cursor-pointer hover:text-red-700"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-gray-600  overflow-hidden text-ellipsis max-h-12 line-clamp-2">{parse(job_description)} </p>
                    <div className="flex gap-5 items-center">
                      <div className="flex items-center gap-2">
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

                <hr />
              </>
            );
          })
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
      <Toaster />
    </>
  );
};

export default NewJob;

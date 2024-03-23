import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import ment from "../../../../assets/images/ment.jpg";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import useFormatDateFromBigInt from "../../hooks/useFormatDateFromBigInt"
import NoDataCard from "../../Mentors/Event/NoDataCard";

const ProjectJobCard = ({ image, website, tags, country }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [noData, setNoData] = useState(null);
  const [latestJobs, setLatestJobs] = useState([]);

  const [timeAgo] = useFormatDateFromBigInt();

  const projectJobData = [
    {
      image: ment,
      tags: ["Imo", "Ludi", "Ndaru"],
      country: "india",
      website: "https://www.google.co.in/",

    },
    {
      image: ment,
      tags: ["Imo", "Ludi", "Ndaru"],
      country: "india",
      website: "https://www.google.co.in/",
    },
  ];

  const fetchLatestJobs = async (caller) => {
    await caller
      .get_all_jobs()
      .then((result) => {
        console.log("result-in-latest-Jobs", result);
        if (!result || result.length == 0) {
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
        console.log("result-in-latest-Jobs", error);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchLatestJobs(actor);
    } else {
      fetchLatestJobs(IcpAccelerator_backend);
    }
  }, [actor]);
  if (noData) {
    return <div className="w-full items-center md:py-4 py-2">
      <NoDataCard />
    </div>
  }
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-4 mb-8">
      {latestJobs &&
        latestJobs.map((data, index) => {
          console.log("data", data);
          let projectName = "";
          let projectImage = "";
          let projectDescription = "";
          let jobName = "";
          let jobDescription = "";
          let jobCategory = "";
          let jobLink = "";
          let jobLocation = "";
          let JobPosted = ""
          if (noData == false) {
            projectName = data?.project_name;
            projectImage = uint8ArrayToBase64(data?.project_logo);
            projectDescription = data?.project_desc;
            jobName = data?.job_data?.title;
            jobDescription = data?.job_data?.description;
            jobCategory = data?.job_data?.category;
            jobLink = data?.job_data?.link;
            jobLocation = data?.job_data?.location;
            JobPosted = timeAgo(data?.timestamp)
          } else {
            projectName = data.projectName;
            projectImage = data.projectImage;
            projectDescription = data.projectDescription;
            jobName = "";
            jobDescription = "";
            jobCategory = "";
            jobLink = "";
            jobLocation = "";
          }
          return (
            <div className="border-2 shadow-lg rounded-2xl">
              <div className="md:p-4 p-2">
                <h3 className="text-lg font-[950]">{jobName}</h3>
                <div className="sm:flex">
                  <div className="sm:w-1/2">
                    <div className="pt-2 flex">
                      <img
                        src={projectImage}
                        alt="project"
                        className="w-16 aspect-square object-cover rounded-md"
                      />
                      <div className="mt-auto pl-2">
                        <p className="text-base font-[950]">
                          {projectName}
                        </p>
                        <p className="text-xs font-[450]">
                          {JobPosted}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 pr-4">
                      <p className="text-base font-[950] py-2">
                        {projectDescription}
                      </p>

                    </div>
                  </div>
                  <div className="sm:w-1/2">
                    <div className="flex justify-center items-center">
                      <p className="text-base font-[950] px-2">TAGS</p>

                      <p className="flex items-center flex-wrap py-2 gap-2">

                        <span
                          className="bg-transparent text-xs font-semibold px-3 py-1 rounded-2xl border-2 border-black"

                        >
                          {jobCategory}
                        </span>

                      </p>

                    </div>
                    <div className="mt-2">
                      <p className="text-base font-[950] py-2 line-clamp-3">
                        {jobDescription}
                      </p>

                    </div>

                    <div className="mt-2">
                      <p className="text-base font-[950] py-1">Location</p>
                      <span className="capitalize">{jobLocation}</span>
                    </div>
                    <div className="mt-2 sm:flex">
                      <div className="w-full">
                        <span>Register your interest here:</span>
                      </div>
                      <div className="w-full sm:w-1/2">

                        <a href={jobLink} target="_blank">
                          <button className="font-[450] border text-xs text-[#ffffff] py-[7px] px-[9px] rounded-md border-[#FFFFFF4D] drop-shadow-[#00000040]  bg-[#3505B2] text-nowrap">
                            I'm interested!
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ProjectJobCard;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import ment from "../../../../assets/images/ment.jpg";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import useFormatDateFromBigInt from "../../hooks/useFormatDateFromBigInt";
import NoDataCard from "../../Mentors/Event/NoDataCard";

const ProjectJobCard = ({ image, website, tags, country }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [noData, setNoData] = useState(null);
  const [latestJobs, setLatestJobs] = useState([]);
  const [timeAgo] = useFormatDateFromBigInt();

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
    return (
      <div className="w-full items-center md:py-4 py-2">
        <NoDataCard />
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row  gap-4 mb-8">
      {latestJobs &&
        latestJobs.slice(0, 2).map((data, index) => {
          const {
            project_name: projectName,
            project_logo: projectLogo,
            project_desc: projectDescription,
            job_data: {
              title: jobName,
              description: jobDescription,
              category: jobCategory,
              link: jobLink,
              location: jobLocation,
            },
            timestamp,
          } = data;
          const projectImage = uint8ArrayToBase64(projectLogo);
          const JobPosted = timeAgo(timestamp);

          return (
            <div
              className="border-2 shadow-lg rounded-2xl w-full md:flex"
              key={index}
            >
              <div className="p-4 flex flex-col">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <div className="flex">
                      <img
                        src={projectImage}
                        alt="project logo"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-2">
                        <p className="text-base font-bold">{projectName}</p>
                        <p className="text-xs font-medium">{JobPosted}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:hidden flex justify-center items-center">
                      <span className="bg-transparent text-xs font-semibold px-3 py-1 rounded-2xl border-2 border-black">
                        {jobCategory}
                      </span>
                    </div>
                    <p className="text-base font-medium py-2">
                      {projectDescription}
                    </p>
                  </div>
                  <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                    <div className="hidden sm:flex justify-center items-center">
                      <span className="bg-transparent text-xs font-semibold px-3 py-1 rounded-2xl border-2 border-black">
                        {jobCategory}
                      </span>
                    </div>
                    <p className="text-base font-medium py-2">
                      {jobDescription}
                    </p>
                    <p className="text-base font-bold py-1">Location</p>
                    <span className="capitalize">{jobLocation}</span>
                    <div className="mt-2 flex flex-col sm:flex-row items-center justify-center text-center">
                      <span>Register your interest here:</span>
                      <a
                        href={jobLink}
                        target="_blank"
                        className="mt-2 sm:mt-0 sm:ml-4"
                      >
                        <button className="font-medium border text-sm py-2 px-4 rounded-md border-transparent bg-blue-800 text-white">
                          I'm interested!
                        </button>
                      </a>
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

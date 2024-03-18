import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatDateFromBigInt } from "../../Utils/uint8ArrayToBase64";

function ProjectJobCard({ image, website, tags, country }) {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const [job, setJobs] = useState([]);

  // useEffect(() => {
  //   const getJobHandler = async () => {
  //     if (actor) {
  //       try {
  //         const getJobs = await actor.get_jobs_for_project(
  //           "6f7759e80ef1f1929a30f837b94f85d95268d274c4e25f4a8a71b6bef92a072f"
  //         );
  //         console.log("job data from project job card:", getJobs[0].title);
  //         setJobs(getJobs[0]);
  //       } catch (error) {
  //         console.error("Error fetching jobs:", error);
  //       }
  //     } else {
  //       console.error("Actor is null or undefined");
  //     }
  //   };

  //   getJobHandler();
  // }, [actor, isAuthenticated]);

  useEffect(() => {
    const getJobsHandler = async () => {
      if (actor && isAuthenticated) {
        try {
          const Ids = JSON.parse(localStorage.getItem("idArr")) || [];
          const firstFiveIds = Ids.slice(0, 5);
          const jobPromises = firstFiveIds.map(async (id) => {
            return actor.get_jobs_posted_by_project(id);
          });
          const jobsData = await Promise.all(jobPromises);
          const allJobs = jobsData.flatMap((jobs) => jobs);
          setJobs(allJobs);
        } catch (error) {
          console.error("Error fetching jobs:", error);
        }
      } else {
        console.error("Actor is null or undefined");
      }
    };

    getJobsHandler();
  }, [actor, isAuthenticated]);

  console.log("job aaya ", job);
  return (
    <div className="">
      <div className="border-2 shadow-lg rounded-2xl md:w-[45vw] w-full">
        <div className="md:p-4 p-2">
          <h3 className="text-lg font-[950]">General Inquiry</h3>
          <div className="sm:flex">
            <div className="sm:w-1/2">
              <div className="pt-2 flex">
                <img
                  src={image}
                  alt="project"
                  className="w-16 aspect-square object-cover rounded-md"
                />
                <div className="mt-auto pl-2">
                  {job.title ? (
                    <p className="text-base font-[950]">{job.title}</p>
                  ) : (
                    <p className="text-base font-[950]">Company Name</p>
                  )}
                  <p className="text-xs font-[450]">
                    We work with many partners!
                  </p>
                </div>
              </div>
              <div className="mt-2 pr-4">
                <p className="text-base font-[950] py-2">Description</p>
                <ul className="text-xs md:pl-4 font-[450] list-disc list-outside">
                  {job.description ? (
                    <li>{job.description}</li>
                  ) : (
                    <li>
                      We might have something in the works that could suit you.
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="sm:w-1/2">
              <div className="flex justify-center items-center">
                <p className="text-base font-[950] px-2">TAGS</p>
                {job.opportunity ? (
                  <p className="flex items-center flex-wrap py-2 gap-2">
                    <span className="bg-transparent text-xs font-semibold px-3 py-1 rounded-2xl border-2 border-black">
                      {job.opportunity}
                    </span>
                  </p>
                ) : (
                  tags.map((val, index) => (
                    <span
                      key={index}
                      className="bg-transparent text-xs font-semibold px-3 py-1 rounded-2xl border-2 border-black"
                    >
                      {val}
                    </span>
                  ))
                )}
              </div>
              <div className="mt-2">
                <p className="text-base font-[950] py-2">Responsibilities</p>
                <ul className="text-xs md:pl-4 font-[450] list-disc list-outside">
                  <li>
                    Fill out the form with your CV and LinkedIn, and we'll get
                    back to you!
                  </li>
                </ul>
              </div>

              {job.timestamp ? (
                <div className="mt-2">
                  <p className="text-base font-[950] py-1">Time</p>
                  <span className="capitalize">
                    {formatDateFromBigInt(job.timestamp)}
                  </span>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-base font-[950] py-1">Country</p>
                  <span className="capitalize">{country}</span>
                </div>
              )}
              <div className="mt-2 sm:flex">
                <div className="w-full">
                  <span>Register your interest here:</span>
                </div>
                <div className="w-full sm:w-1/2">
                  {" "}
                  {job.link ? (
                    <a href={job.link} target="_blank">
                      <button className="font-[450] border text-xs text-[#ffffff] py-[7px] px-[9px] rounded-md border-[#FFFFFF4D] drop-shadow-[#00000040]  bg-[#3505B2] text-nowrap">
                        I'm interested!
                      </button>
                    </a>
                  ) : (
                    <a href={website} target="_blank">
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
    </div>
  );
}

export default ProjectJobCard;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import CenterFocusStrongOutlinedIcon from "@mui/icons-material/CenterFocusStrongOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import JobDetails from "./JobDetails";
import awtar from "../../../assets/images/icons/_Avatar.png";
import Select from 'react-select';
import {
  clockSvgIcon,
  coinStackedSvgIcon,
  lenseSvgIcon,
  locationSvgIcon,
} from "../Utils/Data/SvgData";
import useFormatDateFromBigInt from "../../component/hooks/useFormatDateFromBigInt";
import NoDataCard from "../../component/Mentors/Event/MentorAssociatedNoDataCard";
import { formatFullDateFromBigInt } from "../Utils/formatter/formatDateFromBigInt";
import LinkIcon from "@mui/icons-material/Link";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import parse from "html-react-parser";
const Jobs = () => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [noData, setNoData] = useState(null);
  const [latestJobs, setLatestJobs] = useState([]);
  const [timeAgo] = useFormatDateFromBigInt();
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [openJobUid, setOpenJobUid] = useState(null);
  console.log("latestJobs", openJobUid);
  useEffect(() => {
    console.log("useEffect triggered, fetching latest jobs..."); // Check if useEffect is running
    let isMounted = true;
 
    const fetchLatestJobs = async (caller) => {
       setIsLoading(true);
 
       try {
          const result = await caller.get_all_jobs(currentPage, itemsPerPage);
          console.log("latestJobs aa raha This should print the result", result); // This should print the result
          if (isMounted) {
             if (result && result.length > 0) {
                setLatestJobs(result);
                setNoData(false);
             } else {
                setNoData(true);
                setLatestJobs([]);
             }
          }
       } catch (error) {
          console.error("Error fetching jobs:", error); // Log the error if it fails
          if (isMounted) {
             setNoData(true);
             setLatestJobs([]);
          }
       } finally {
          if (isMounted) {
             setIsLoading(false);
          }
       }
    };
 
    if (actor) {
       fetchLatestJobs(actor);
    } else {
       fetchLatestJobs(IcpAccelerator_backend);
    }
 
    return () => {
       isMounted = false;
    };
 }, [actor, currentPage]);
 
  const [filter, setFilter] = useState({
    role: "",
    fullTime: false,
    partTime: true,
    contract: true,
    internship: true,
    location: "",
    remote: true,
    minSalary: "",
    maxSalary: "",
  });
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };
  const handlecheckbox = (e) => {
    const { name, checked } = e.target;
    setFilter({ ...filter, [name]: checked });
  };

  const openJobDetails = (job_id) => {
    console.log("Opening job details for UID:", job_id);
    setOpenJobUid(job_id);
  };

  const closeJobDetails = () => {
    setOpenJobUid(null);
  };


  const roleOptions = [
        { value: 'developer', label: 'Developer' },
        { value: 'designer', label: 'Designer' },
        { value: 'manager', label: 'Manager' },
        { value: 'analyst', label: 'Analyst' },
        // Add more options here
    ];

    const handleRoleChange = selectedOption => {
        setFilter({ ...filter, role: selectedOption.value });
    };
  return (
    <>
      <div className="container mx-auto bg-white">
        <div className="flex mx-auto -top-10  sticky ">
          <h2 className="text-3xl font-bold p-5 bg-white w-full  bg-opacity-95 ">
            Jobs
          </h2>
        </div>
        <div className="flex mx-auto justify-evenly">
          <div className="mb-5 w-[65%] ">
            {latestJobs.length == 0 ? (
              <h1>No Data Found</h1>
            ) : (
              latestJobs.map((card, index) => {
                // console.log( " card?.job_poster.profile_picture",card?.job_poster?.profile_picture)
                let job_name = card?.job_data?.title ?? "";
                let job_category = card?.job_data?.category ?? "";
                let job_description = card?.job_data?.description ?? "";
                let job_location = card?.job_data?.location ?? "";
                let job_link = card?.job_data?.link ?? "";
                let job_project_logo = card?.job_poster[0]?.profile_picture[0]
                  ? uint8ArrayToBase64(card?.job_poster[0]?.profile_picture[0])
                  : null;
                let job_type = card?.job_data?.job_type ?? "";
                let job_project_name = card?.project_name ?? "";
                let job_project_desc = card?.project_desc ?? "";
                let job_post_time = card?.timestamp
                  ? formatFullDateFromBigInt(card?.timestamp)
                  : "";
                console.log("cardids", card.job_id);
                return (
                  <>
                    <div className="flex flex-col gap-3 my-8">
                      <div className="flex justify-between">
                        <div
                          onClick={() => openJobDetails(card.job_id)}
                          className="flex flex-col gap-3  "
                        >
                          <p className="text-gray-400">{job_post_time} </p>
                          <h3 className="text-xl font-bold">{job_name} </h3>
                          <p className="flex items-center">
                            <span className="mr-3">
                              <img
                                src={job_project_logo}
                                className="w-8 h-8 rounded-full"
                                alt="icon"
                              />
                            </span>
                            <span>{job_name} </span>
                          </p>
                        </div>
                        <div className="flex flex-col gap-4 items-center">
                          <a
                            href={job_link}
                            target="_blank"
                            className="border rounded-md bg-[#155EEF] py-2 px-4 text-white text-center"
                          >
                            Apply <span className="pl-1 text-white"></span>
                            <ArrowOutwardIcon
                              sx={{ marginTop: "-2px", fontSize: "medium" }}
                            />
                          </a>
                          <button
                            onClick={() => openJobDetails(card.job_id)}
                            className="hover:bg-slate-300 py-2 px-3 text-[#155EEF] font-medium "
                          >
                            view details
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <p className="">{parse(job_description)} </p>
                        <div className="flex gap-5 items-center">
                          <div className="flex items-center gap-2">
                            {" "}
                            {lenseSvgIcon}{" "}
                            <span className="">{job_category}</span>{" "}
                          </div>
                          <div className="flex items-center gap-2">
                            {locationSvgIcon}{" "}
                            <span className="">{job_location}</span>{" "}
                          </div>
                          <div className="flex items-center gap-2">
                            {clockSvgIcon}{" "}
                            <span className="ml-2">{job_type}</span>{" "}
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

          <div className="w-[30%]">
            <div className="p-4 bg-white sticky top-0  max-w-sm">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <div className="mb-4">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                {/* <select value={filter.role} onChange={handleChange} id="department" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option>Select role</option>
                                
                            </select> */}
                <Select
                  value={roleOptions.find(
                    (option) => option.value === filter.role
                  )}
                  onChange={handleRoleChange}
                  options={roleOptions}
                  placeholder="Select role"
                  className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>

              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700">
                  Occupation
                </span>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="full-time"
                      checked={filter.fullTime}
                      onChange={handlecheckbox}
                      name="fullTime"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-2 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="full-time"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Full-time
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="part-time"
                      checked={filter.partTime}
                      onChange={handlecheckbox}
                      name="partTime"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 border-2  rounded"
                    />
                    <label
                      htmlFor="part-time"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Part-time
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="contract"
                      checked={filter.contract}
                      onChange={handlecheckbox}
                      name="contract"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded"
                    />
                    <label
                      htmlFor="contract"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Contract
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="internship"
                      checked={filter.internship}
                      onChange={handlecheckbox}
                      name="internship"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded"
                    />
                    <label
                      htmlFor="internship"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Internship
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={filter.location}
                  onChange={handleChange}
                  id="location"
                  className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Start typing"
                />
                <div className="flex items-center mt-2">
                  <input
                    id="remote"
                    checked={filter.remote}
                    onChange={handlecheckbox}
                    name="remote"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded"
                  />
                  <label
                    htmlFor="remote"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remote
                  </label>
                </div>
              </div>

              {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Salary</label>
                            <div className="flex mt-1 w-full">
                                <input type="text" name='minSalary' value={filter.minSalary} onChange={handleChange} className="w-[40%]  px-1 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="$ From" />
                                <div className='px-2 text-center'>-</div>
                                <input type="text" name='maxSalary' value={filter.maxSalary} onChange={handleChange} className="w-[40%] px-1 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="$ To" />
                            </div>
                        </div> */}
            </div>
          </div>
        </div>
      </div>
      {openJobUid && <JobDetails setOpen={closeJobDetails} uid={openJobUid} />}
    </>
  );
};

export default Jobs;

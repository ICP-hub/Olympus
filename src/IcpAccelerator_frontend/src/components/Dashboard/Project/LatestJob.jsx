import React, { useEffect, useState } from 'react';
import eventbg from "../../../../assets/images/bg.png"
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux';
import { title } from 'process';
import parse from 'html-react-parser';
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import JobRegister1 from '../../Modals/JobModal/JobRegister1';
import { formatFullDateFromBigInt } from '../../Utils/formatter/formatDateFromBigInt';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';

const NewJob = ({ latestJobs }) => {

    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
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
            {latestJobs.length == 0 ? (
             <h1>No Data Found</h1>
            ) : (
              latestJobs.map((card, index) => {
                console.log( " card?.job_poster.profile_picture",card?.job_poster[0]?.profile_picture[0])
                let job_name = card?.job_data?.title ?? "";
                let job_category = card?.job_data?.category ?? "";
                let job_description = card?.job_data?.description ?? "";
                let job_location = card?.job_data?.location ?? "";
                let job_link = card?.job_data?.link ?? "";
                let job_project_logo = card?.job_poster[0]?.profile_picture[0]
                  ? uint8ArrayToBase64(card?.job_poster[0]?.profile_picture[0])
                  : null;
                  let job_type=card?.job_data?.job_type??"";
                let job_project_name = card?.project_name ?? "";
                let job_project_desc = card?.project_desc ?? "";
                let job_post_time = card?.timestamp
                  ? formatFullDateFromBigInt(card?.timestamp)
                  : "";
                        return (
                            <>
                     <div key={index} className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 relative">
                                <div className="max-w-[160px] absolute top-1 left-1 bg-white p-2 rounded-[8px]">
                                    {/* <p className="text-base font-bold">{job_post_time}</p> */}
                                    <p className="text-sm font-normal">{job_post_time}</p>
                                </div>
                                <img
                                    src={job_project_logo}
                                    alt="Event Background"
                                    className="w-[240px] h-[172px] rounded-lg mr-4 object-cover"
                                />
                                <div>
                                    <p className="bg-white font-medium border-2 border-[#CDD5DF] text-[#364152] w-[86px] px-2 py-1 rounded-full text-sm">
                                        {job_category}
                                    </p>
                                    <h3 className="text-lg font-semibold">{job_name}</h3>
                                    <h3 className="text-lg font-semibold">{job_type}</h3>
                                    <p className="text-sm text-gray-500">{parse(job_description)}</p>
                                    <div className="flex gap-3 items-center mt-4">
                                        <span className="text-sm text-[#121926]">
                                            <PlaceOutlinedIcon
                                                className="text-[#364152]"
                                                fontSize="small"
                                            />
                                            {job_post_time}
                                        </span>
                                        <span className="text-sm text-gray-500">{job_location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                       );
                    })
                  )}
            </div>

            {modalOpen && (
        <JobRegister1 modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
        </>
    );
};

export default NewJob;

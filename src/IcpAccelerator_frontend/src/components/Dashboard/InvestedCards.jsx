import React from 'react';
import ment from "../../../assets/images/ment.jpg";
import inv from "../../../assets/images/inv.jpeg";
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import { useNavigate } from 'react-router-dom';


const InvestedProjects = ({ data }) => {
    const navigate = useNavigate();

    let projectName = data?.params?.project_name ?? "";
    let projectId = data?.uid ?? "";
    let projectImage = data?.params?.project_logo ? uint8ArrayToBase64(data?.params?.project_logo) : ment;
    let projectCover = data?.params?.project_cover ? uint8ArrayToBase64(data?.params?.project_cover) : inv;
    // let userImage = data?.params?.user_data?.profile_picture[0] ? uint8ArrayToBase64(data?.params?.user_data?.profile_picture[0]) : girl;
    // let userName = data?.params?.user_data?.full_name ?? "";
    let projectDescription = data?.params?.project_description ?? "";
    let projectAreaOfFocus = data?.params?.project_area_of_focus ?? "";

    return (
        <div className="flex gap-4 flex-wrap">
            <div className="shadow-md rounded-lg overflow-hidden w-full border-2 bg-white p-4 mb-4">
                {/* <img className='h-56 w-full mx-auto rounded-3xl object-cover' src={projectCover} alt='cover' /> */}
                <div className='pt-6'>
                    <div className='flex flex-row items-baseline space-x-2 text-black text-lg'>
                        <img className="w-14 h-14 rounded-lg object-cover" src={projectImage} alt="logo" />
                        <p className='font-bold text-black flex-wrap'>{projectName}</p>
                    </div>
                    <div className="flex w-full pb-4 pr-4 overflow-x-auto">
                        {projectAreaOfFocus ? (
                            <div className="flex gap-2 mt-2 text-xs items-center">
                                {projectAreaOfFocus
                                    .split(",")
                                    .slice(0, 3)
                                    .map((tag, index) => (
                                        <div
                                            key={index}
                                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100"
                                        >
                                            {tag.trim()}
                                        </div>
                                    ))}
                            </div>) : ""}
                    </div>
                    <div className='pt-4 overflow-x-auto'>
                        <p className="text-[#6B7280] line-clamp-2">{projectDescription}</p>
                    </div>
                    <div className='flex mt-4 text-sm bg-[#3505B2] rounded-md justify-center'>
                        <button
                            onClick={() => navigate(`/individual-project-details-project-investor/${projectId}`)}
                            className="flex justify-center items-center text-white px-4 py-2 font-bold">View Project</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvestedProjects;

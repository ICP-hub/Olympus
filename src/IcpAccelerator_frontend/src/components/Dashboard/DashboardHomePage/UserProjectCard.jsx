import React, { useState } from 'react'
import org from "../../../../assets/images/Org.png"
import DiscoverMentorPage from './discoverMentorPage/DiscoverMentorPage'
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";

const UserProjectCard = (projectData) => {
    const [openDetail,setOpenDetail]=useState(false)
    const handleClick =()=>{
        setOpenDetail(true)
    }
    const projectDetails= projectData?.projectData?.[0]?.[0]?.params
    const userDetails= projectData?.projectData?.[0]?.[1]?.params

    console.log("Project Data in CHILD COMPONENT at 0 ", projectData?.projectData?.[0]?.[0]?.params)
    console.log("Project Data in CHILD COMPONENT at 1 ", projectData?.projectData?.[0]?.[1]?.params)

    const projectlogo =
    projectDetails?.project_logo && projectDetails?.project_logo[0]
      ? uint8ArrayToBase64(projectDetails?.project_logo[0])
      : "default-profile.png";

      const projectcover =
      projectDetails?.project_cover && projectDetails?.project_cover[0]
      ? uint8ArrayToBase64(projectDetails?.project_cover[0])
      : "default-profile.png";

    return (
        <div className="bg-white shadow-md border rounded-lg p-4 ">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects</h2>
            <div onClick={()=>handleClick()} className="flex items-center cursor-pointer pl-3 gap-6">
                <div className="w-[260px] h-[120px] bg-gray-100 rounded-md flex items-center justify-center">
                    <img
                        src={projectlogo}
                        alt="Cypherpunk Labs Logo"
                        className="w-[90px] h-[90px] "
                    />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{projectDetails?.project_name}</h3>
                    {/* <p className="text-gray-500">@cypherpunklabs</p> */}
                    <p className="text-gray-600 text-sm mt-2">
                        {projectDetails?.project_description}
                    </p>
                </div>
            </div>
            {openDetail && <DiscoverMentorPage openDetail={openDetail} setOpenDetail={setOpenDetail} projectDetails={projectDetails} />}
            <div className="flex pl-3 space-x-2 mt-4">
                <span className=" text-gray-700 text-xs font-medium px-2.5 py-0.5 border rounded-xl">MVP</span>
                <span className=" text-gray-700 text-xs font-medium px-2.5 py-0.5 border rounded-xl">Infrastructure</span>
            </div>
        </div>
    )
}

export default UserProjectCard
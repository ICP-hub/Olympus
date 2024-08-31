import React, { useState } from "react";
import org from "../../../../assets/images/Org.png";
import DiscoverMentorPage from "./discoverMentorPage/DiscoverMentorPage";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import parse from "html-react-parser";

const UserProjectCard = (projectData) => {
  const [openDetail, setOpenDetail] = useState(false);
  const handleClick = () => {
    setOpenDetail(true);
  };
  const projectDetails = projectData?.projectData?.[0]?.[0]?.params;

  const description =
    projectData?.projectData?.[0]?.[0]?.params.project_description?.[0];

  console.log("desc", description);
  const projectId = projectData?.projectData?.[0]?.[0]?.uid;
  const userDetails = projectData?.projectData?.[0]?.[1]?.params;
  const fullname = projectData?.projectData?.[0]?.[1]?.params.full_name;

  // const areaoffocus = projectData?.projectData?.[0]?.[0]?.params.project_area_of_focus
  const areaoffocus =
    projectData?.projectData?.[0]?.[0]?.params.project_area_of_focus?.split(
      ", "
    );
  console.log("areaoffocus", areaoffocus);

  console.log(
    "Project Data in CHILD COMPONENT at 0 ",
    projectData?.projectData?.[0]?.[0]?.params
  );
  console.log(
    "Project Data in CHILD COMPONENT at 1 ",
    projectData?.projectData?.[0]?.[1]?.params
  );

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
      <div
        onClick={() => handleClick()}
        className="flex items-center cursor-pointer pl-3 gap-6"
      >
        <div className="w-[400px] h-[140px] bg-gray-100 rounded-md flex items-center justify-center px-10 py-2">
          <img
            src={projectlogo}
            alt="Cypherpunk Labs Logo"
            className="w-[80px] h-[80px] object-fill rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {projectDetails?.project_name}
          </h3>
          <p className="text-gray-500 text-sm">@{fullname}</p>
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            {description ? parse(description) : "No description available."}
          </p>
          <div className="flex space-x-2 mt-2 overflow-x-auto w-full max-w-full">
    {areaoffocus?.map((focus, index) => (
        <span
            key={index}
            className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
        >
            {focus}
        </span>
    ))}
   
</div>
        </div>
      </div>
      {openDetail && (
        <DiscoverMentorPage
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          projectDetails={projectDetails}
          projectId={projectId}
        />
      )}

     
    </div>
  );
};

export default UserProjectCard;

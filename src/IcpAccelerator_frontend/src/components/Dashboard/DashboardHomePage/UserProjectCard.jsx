import React, { useState } from "react";
import org from "../../../../assets/images/Org.png";
import DiscoverMentorPage from "./discoverMentorPage/DiscoverMentorPage";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import parse from "html-react-parser";

const UserProjectCard = ({setOpenDetails, projectData, userData, principal }) => {
  console.log("PRINCIPAL IN PROJECT PAGE", principal);
  console.log("USER DATA IN PROJECT PAGE", userData);
  console.log("PROJECT DATA IN LINE 10", projectData);
  const [openDetail, setOpenDetail] = useState(false);
  const handleClick = () => {
    setOpenDetail(true);
  };
  const projectDetails = projectData?.[0]?.[0]?.params;
  console.log("PROJECT DATA IN LINE 16", projectDetails);

  const description = projectData?.[0]?.[0]?.params.project_description?.[0];

  console.log("desc", description);
  const projectId = projectData?.[0]?.[0]?.uid;
  const userDetails = projectData?.[0]?.[1]?.params;
  const fullname = projectData?.[0]?.[1]?.params.full_name;

  // const areaoffocus = projectData?.projectData?.[0]?.[0]?.params.project_area_of_focus
  const areaoffocus =
    projectData?.[0]?.[0]?.params.project_area_of_focus?.split(", ");
  const projectlogo =
    projectDetails?.project_logo && projectDetails?.project_logo[0]
      ? uint8ArrayToBase64(projectDetails?.project_logo[0])
      : "default-profile.png";

  const projectcover =
    projectDetails?.project_cover && projectDetails?.project_cover[0]
      ? uint8ArrayToBase64(projectDetails?.project_cover[0])
      : "default-profile.png";

  return (
    //     <div className="bg-white shadow-md border rounded-lg p-4 ">
    //       <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects</h2>
    //       <div
    //         onClick={() => handleClick()}
    //         className="flex w-full items-center cursor-pointer pl-3 gap-6"
    //       >
    //         <div className="h-[140px] bg-gray-100 rounded-md flex items-center justify-center px-10 py-2">
    //           <img
    //             src={projectlogo}
    //             alt="Cypherpunk Labs Logo"
    //             className="w-[80px] h-[80px]  object-cover object-center rounded-lg"
    //           />
    //         </div>
    //         <div className="w-3/4">
    //           <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
    //             {projectDetails?.project_name}
    //           </h3>
    //           <p className="text-gray-500 text-sm">@{fullname}</p>
    //           <div className="text-gray-600 text-sm mt-2 overflow-hidden text-ellipsis max-h-14 line-clamp-3 break-all">
    //             {description ? parse(description) : "No description available."}
    //           </div>
    //           <div className="flex space-x-2 mt-2 overflow-x-auto w-full max-w-full">
    //     {areaoffocus?.map((focus, index) => (
    //         <span
    //             key={index}
    //             className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
    //         >
    //             {focus}
    //         </span>
    //     ))}

    // </div>
    //         </div>
    //       </div>
    //       {openDetail && (
    //         <DiscoverMentorPage
    //           openDetail={openDetail}
    //           setOpenDetail={setOpenDetail}
    //           projectDetails={projectDetails}
    //           projectId={projectId}
    //           userData={userData}
    //           principal={principal}
    //         />
    //       )}

    //     </div>
    <div className="w-full mb-4 lg1:pb-2 pb-12 bg-white ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects</h2>
      <div
        onClick={() => handleClick()}
        className="flex flex-col sm0:flex-row w-full sm0:items-center cursor-pointer shadow-md py-2 border rounded-lg sm0:pl-3 gap-3 sm0:gap-6"
      >
        <div className="lg1:h-[140px] sm0:px-0 bg-gray-100 rounded-md flex items-center justify-center lg1:px-10 p-2">
          <img
            src={projectlogo}
            alt="Cypherpunk Labs Logo"
            className="w-full sm0:w-[100px] sm0:h-[100px]  object-cover object-center rounded-lg"
            loading="lazy"
            draggable={false}
          />
        </div>
        <div className="w-full pl-4 px-2 sm0:pl-0 sm0:w-3/4">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {projectDetails?.project_name}
          </h3>
          <p className="text-gray-500 text-sm">@{fullname}</p>
          <div className="text-gray-600 text-sm mt-2 overflow-hidden text-ellipsis max-h-14 line-clamp-3 break-all">
            {description ? parse(description) : "No description available."}
          </div>
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
          setOpenDetails={setOpenDetails}
          setOpenDetail={setOpenDetail}
          projectDetails={projectDetails}
          projectId={projectId}
          userData={userData}
          principal={principal}
        />
      )}
    </div>
  );
};

export default UserProjectCard;

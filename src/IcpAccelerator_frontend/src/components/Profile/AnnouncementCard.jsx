// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { Pagination, Autoplay } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
// import { formatFullDateFromBigInt } from "../Utils/formatter/formatDateFromBigInt";
// import ment from "../../../assets/images/ment.jpg";
// import AnnouncementModal from "../Modals/AnnouncementModal";
// import NoCardData from "./NoCardData";
// import DeleteModel from "../../models/DeleteModel";
// import editp from "../../../assets/Logo/edit.png";
// import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

// const AnnouncementCard = ({ data }) => {
//   const actor = useSelector((currState) => currState.actors.actor);
//   const principal = useSelector((currState) => currState.internet.principal);
//   const [noData, setNoData] = useState(null);
//   const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);
//   const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
//   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentAnnouncementData, setcurrentAnnouncementData] = useState(null);
//   const userCurrentRoleStatusActiveRole = useSelector(
//     (currState) => currState.currentRoleStatus.activeRole
//   );

//   const handleOpenModal = (card) => {
//     setcurrentAnnouncementData(card);
//     setAnnouncementModalOpen(true);
//   };

//   console.log("data =>", data);

//   const handleAddAnnouncement = async ({
//     announcementTitle,
//     announcementDescription,
//   }) => {
//     console.log("add announcement");
//     setIsSubmitting(true);
//     if (actor) {
//       let projectargument = {
//         project_id: data[0]?.uid,
//         announcement_title: announcementTitle,
//         announcement_description: announcementDescription,
//         timestamp: Date.now(),
//       };
//       let mentorargument = {
//         announcement_name: announcementTitle,
//         announcement_description: announcementDescription,
//         timestamp: Date.now(),
//       };
//       let vcargument = {
//         announcement_title: announcementTitle,
//         announcement_description: announcementDescription,
//         timestamp: Date.now(),
//       };
//       // console.log("argument", projectargument);

//       {
//         activeRole === "project" &&
//           (await actor
//             .add_project_announcement(projectargument)
//             .then((result) => {
//               if (result && Object.keys(result).length > 0) {
//                 handleCloseModal();
//                 fetchProjectData();
//                 setIsSubmitting(false);
//                 toast.success("Announcement added successfully");
//                 console.log("Announcement added");
//               } else {
//                 handleCloseModal();
//                 setIsSubmitting(false);
//                 toast.error("Something went wrong");
//               }
//             })
//             .catch((error) => {
//               console.log("error-in-add_announcement", error);
//               toast.error("Something went wrong");
//               setIsSubmitting(false);
//               handleCloseModal();
//             }));
//       }
//       {
//         activeRole === "mentor" &&
//           (await actor
//             .add_project_announcement(mentorargument)
//             .then((result) => {
//               if (result && Object.keys(result).length > 0) {
//                 handleCloseModal();
//                 fetchProjectData();
//                 setIsSubmitting(false);
//                 toast.success("Announcement added successfully");
//                 console.log("Announcement added");
//               } else {
//                 handleCloseModal();
//                 setIsSubmitting(false);
//                 toast.error("Something went wrong");
//               }
//             })
//             .catch((error) => {
//               console.log("error-in-add_announcement", error);
//               toast.error("Something went wrong");
//               setIsSubmitting(false);
//               handleCloseModal();
//             }));
//       }
//       {
//         activeRole === "vc" &&
//           (await actor
//             .add_project_announcement(vcargument)
//             .then((result) => {
//               if (result && Object.keys(result).length > 0) {
//                 handleCloseModal();
//                 fetchProjectData();
//                 setIsSubmitting(false);
//                 toast.success("Announcement added successfully");
//                 console.log("Announcement added");
//               } else {
//                 handleCloseModal();
//                 setIsSubmitting(false);
//                 toast.error("Something went wrong");
//               }
//             })
//             .catch((error) => {
//               console.log("error-in-add_announcement", error);
//               toast.error("Something went wrong");
//               setIsSubmitting(false);
//               handleCloseModal();
//             }));
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setAnnouncementModalOpen(false);
//     setcurrentAnnouncementData(null);
//   };

//   const handleOpenDeleteModal = (id) => {
//     setcurrentAnnouncementData(id);
//     setDeleteModalOpen(true);
//   };

//   const handleClose = () => {
//     setDeleteModalOpen(false);
//     setcurrentAnnouncementData(null);
//   };

//   const fetchLatestAnnouncement = async (caller) => {
//     await actor
//       .get_announcements_by_project_id(data[0]?.uid)
//       .then((result) => {
//         if (!result || result.length === 0) {
//           setNoData(true);
//           setLatestAnnouncementData([]);
//         } else {
//           setLatestAnnouncementData(result);
//           setNoData(false);
//         }
//       })
//       .catch((error) => {
//         setNoData(true);
//         setLatestAnnouncementData([]);
//         console.log("error-in-get_announcements_by_project_id", error);
//       });
//   };

//   // <<<<<<----- Updating the announcement_data -------->>>>>>

//   const handleUpdateAnnouncement = async ({
//     announcementTitle,
//     announcementDescription,
//   }) => {
//     // console.log("update announcement");
//     setIsSubmitting(true);
//     if (actor) {
//       let new_details = {
//         project_id: data?.uid,
//         announcement_title: announcementTitle,
//         announcement_description: announcementDescription,
//         timestamp: Date.now(),
//       };
//       // console.log("new_details", new_details);
//       await actor
//         .update_project_announcement_by_id(
//           currentAnnouncementData?.timestamp,
//           new_details
//         )
//         .then((result) => {
//           if (
//             result &&
//             result.includes(
//               `Announcement updated successfully for ${currentAnnouncementData?.timestamp}`
//             )
//           ) {
//             handleCloseModal();
//             setIsSubmitting(false);
//             toast.success("Announcement updated successfully");
//             setTimeout(() => {
//               window.location.reload();
//             }, 2000);
//           } else {
//             setIsSubmitting(false);
//             toast.error("something got wrong");
//           }
//         })
//         .catch((error) => {
//           console.log("error-in-update_announcement", error);
//           toast.error("something got wrong");
//           setIsSubmitting(false);
//           handleCloseModal();
//         });
//     }
//   };

//   // <<<<<<----- Deleting the announcement_data -------->>>>>>

//   const handleDelete = async () => {
//     // console.log("project_id===>>>>>>>>>", currentAnnouncementData);
//     setIsSubmitting(true);
//     await actor
//       .delete_project_announcement_by_id(currentAnnouncementData?.timestamp)
//       .then((result) => {
//         // console.log("result-in-get_announcements_by_project_id", result);
//         if (
//           result &&
//           result.includes(
//             `Announcement deleted successfully for ${currentAnnouncementData?.timestamp}`
//           )
//         ) {
//           setIsSubmitting(false);
//           toast.success("Announcement deleted successfully");
//           setTimeout(() => {
//             window.location.reload();
//           }, 2000);
//         } else {
//           toast.error(result);
//           setIsSubmitting(false);
//         }
//       })
//       .catch((error) => {
//         console.log("error-in-get_announcements_by_project_id", error);
//         setIsSubmitting(false);
//       });
//   };

//   useEffect(() => {
//     if (actor && data) {
//       fetchLatestAnnouncement(actor);
//     }
//   }, [actor, data]);

//   if (!data || noData) {
//     return <NoCardData data={data} />;
//   }

//   return (
//     <div className=" bg-white">
//       {latestAnnouncementData.length > 0 && (
//         <div className="flex justify-between items-center sticky top-16 bg-white ">
//           <h1 className="text-xl font-bold p-3">Announcements </h1>
//           <button
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//             onClick={() => setAnnouncementModalOpen(true)}
//           >
//             + Add new Announcement
//           </button>
//         </div>
//       )}
//       {latestAnnouncementData.length === 0 ? (
//         <NoCardData data={data} />
//       ) : (
//         latestAnnouncementData.map((card, index) => {
//           let ann_name = card?.announcement_data?.announcement_title ?? "abc";
//           let ann_time = card?.timestamp
//             ? formatFullDateFromBigInt(card?.timestamp)
//             : "def";
//           let ann_desc =
//             card?.announcement_data?.announcement_description ?? "ghi";
//           let ann_project_logo = card?.project_logo
//             ? uint8ArrayToBase64(card?.project_logo[0])
//             : ment;
//           let ann_project_name = card?.project_name ?? "jkl";
//           let ann_project_desc = card?.project_desc ?? "mno";
//           let announcement_id = card?.announcement_id ?? "pqr";
//           return (
//             <div className="container mx-auto my-6 p-4 bg-white">
//               <div className="flex justify-between items-center pb-1 mb-2">
//                 <div className="text-gray-500 font-medium text-sm">
//                   {ann_time}
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div
//                     onClick={() => handleOpenModal(card)}
//                     className="rounded-full p-1"
//                   >
//                     <img
//                       src={editp}
//                       className="h-5 w-5 hover:text-green-400 cursor-pointer"
//                       alt="edit"
//                     />
//                   </div>
//                   <div
//                     onClick={() => handleOpenDeleteModal(announcement_id)}
//                     className="rounded-full p-1"
//                   >
//                     <DeleteOutlinedIcon className="cursor-pointer hover:text-red-500" />
//                   </div>
//                 </div>
//               </div>
//               <h2 className="text-gray-900 text-xl font-bold mb-3">
//                 {ann_name}
//               </h2>
//               <div className="flex items-center mb-4 space-x-4">
//                 <img
//                   src={ann_project_logo}
//                   alt="pic"
//                   className="h-12 w-12 rounded-full border border-gray-300"
//                 />
//                 <div>
//                   <h2 className="text-lg font-semibold">{ann_project_name}</h2>
//                   <h3 className="text-gray-600 font-normal">
//                     {ann_project_desc}{" "}
//                   </h3>
//                 </div>
//               </div>
//               <div className="text-gray-500 leading-relaxed">
//                 <p>{ann_desc}</p>
//               </div>
//               <hr className="mt-4" />
//             </div>
//           );
//         })
//       )}

//       {isAnnouncementModalOpen && (
//         <AnnouncementModal
//           onClose={handleCloseModal}
//           onSubmitHandler={handleAddAnnouncement}
//           isSubmitting={isSubmitting}
//           isUpdate={true}
//           data={currentAnnouncementData}
//         />
//       )}
//       {isDeleteModalOpen && (
//         <DeleteModel
//           data={currentAnnouncementData}
//           onClose={handleClose}
//           title={"Delete announcement"}
//           heading={"Are you sure to delete this announcement"}
//           onSubmitHandler={handleDelete}
//           isSubmitting={isSubmitting}
//         />
//       )}
//     </div>
//   );
// };

// export default AnnouncementCard;



import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { formatFullDateFromBigInt } from "../Utils/formatter/formatDateFromBigInt";
import ment from "../../../assets/images/ment.jpg";
import AnnouncementModal from "../Modals/AnnouncementModal";
import NoCardData from "./NoCardData";
import DeleteModel from "../../models/DeleteModel";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import editp from "../../../assets/Logo/edit.png";

const AnnouncementCard = ({ data }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnnouncementData, setcurrentAnnouncementData] = useState(null);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  // Function to open the modal for editing
  const handleOpenModal = (card) => {
    setcurrentAnnouncementData(card);
    setAnnouncementModalOpen(true);
  };

  // Function to close the Announcement Modal
  const handleCloseModal = () => {
    setAnnouncementModalOpen(false);
    setcurrentAnnouncementData(null);
  };

  // Function to handle adding or updating announcements
  const handleAddAnnouncement = async ({
    announcementTitle,
    announcementDescription,
  }) => {
    setIsSubmitting(true);
    if (actor) {
      let argument = {
        announcement_title: announcementTitle,
        announcement_description: announcementDescription,
        timestamp: Date.now(),
      };

      // Adjust arguments based on role
      if (userCurrentRoleStatusActiveRole === "project") {
        argument.project_id = data[0]?.uid;
      }

      try {
        let result;
        if (currentAnnouncementData) {
          // Update announcement
          result = await actor.update_project_announcement_by_id(
            currentAnnouncementData.timestamp,
            argument
          );
        } else {
          // Add new announcement
          if (userCurrentRoleStatusActiveRole === "project") {
            result = await actor.add_project_announcement(argument);
          } else if (userCurrentRoleStatusActiveRole === "mentor") {
            result = await actor.add_mentor_announcement(argument);
          } else if (userCurrentRoleStatusActiveRole === "vc") {
            result = await actor.add_vc_announcement(argument);
          }
        }

        if (result && Object.keys(result).length > 0) {
          handleCloseModal();
          fetchLatestAnnouncement();
          setIsSubmitting(false);
          toast.success("Announcement saved successfully");
        } else {
          handleCloseModal();
          setIsSubmitting(false);
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.log("error-in-add_or_update_announcement", error);
        toast.error("Something went wrong");
        setIsSubmitting(false);
        handleCloseModal();
      }
    }
  };

  // Function to open the Delete Modal
  const handleOpenDeleteModal = (card) => {
    setcurrentAnnouncementData(card);
    setDeleteModalOpen(true);
  };

  // Function to close the Delete Modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setcurrentAnnouncementData(null);
  };

  // Function to delete the announcement
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const result = await actor.delete_project_announcement_by_id(
        currentAnnouncementData?.timestamp
      );
      if (
        result &&
        result.includes(
          `Announcement deleted successfully for ${currentAnnouncementData?.timestamp}`
        )
      ) {
        setIsSubmitting(false);
        toast.success("Announcement deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Something went wrong");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log("error-in-delete_announcement", error);
      toast.error("Something went wrong");
      setIsSubmitting(false);
    } finally {
      handleCloseDeleteModal();
    }
  };

  const fetchLatestAnnouncement = async () => {
    if (actor) {
      try {
        const result = await actor.get_announcements_by_project_id(
          data[0]?.uid
        );
        if (!result || result.length === 0) {
          setNoData(true);
          setLatestAnnouncementData([]);
        } else {
          setLatestAnnouncementData(result);
          setNoData(false);
        }
      } catch (error) {
        setNoData(true);
        setLatestAnnouncementData([]);
        console.log("error-in-get_announcements_by_project_id", error);
      }
    }
  };

  useEffect(() => {
    if (actor && data) {
      fetchLatestAnnouncement();
    }
  }, [actor, data]);

  if (!data || noData) {
    return <NoCardData data={data} />;
  }

  return (
    <div className="bg-white">
      {latestAnnouncementData.length > 0 && (
        <div className="flex justify-between items-center sticky top-16 bg-white ">
          <h1 className="text-xl font-bold p-3">Announcements </h1>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => setAnnouncementModalOpen(true)}
          >
            + Add new Announcement
          </button>
        </div>
      )}
      {latestAnnouncementData.length === 0 ? (
        <NoCardData data={data} />
      ) : (
        latestAnnouncementData.map((card, index) => {
          let ann_name = card?.announcement_data?.announcement_title ?? "abc";
          let ann_time = card?.timestamp
            ? formatFullDateFromBigInt(card?.timestamp)
            : "def";
          let ann_desc =
            card?.announcement_data?.announcement_description ?? "ghi";
          let ann_project_logo = card?.project_logo
            ? uint8ArrayToBase64(card?.project_logo[0])
            : ment;
          let ann_project_name = card?.project_name ?? "jkl";
          let ann_project_desc = card?.project_desc ?? "mno";
          let announcement_id = card?.announcement_id ?? "pqr";
          return (
            <div
              key={index}
              className="container mx-auto my-6 p-4 bg-white"
            >
              <div className="flex justify-between items-center pb-1 mb-2">
                <div className="text-gray-500 font-medium text-sm">
                  {ann_time}
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    onClick={() => handleOpenModal(card)}
                    className="rounded-full p-1"
                  >
                    <img
                      src={editp}
                      className="h-5 w-5 hover:text-green-400 cursor-pointer"
                      alt="edit"
                    />
                  </div>
                  <div
                    onClick={() => handleOpenDeleteModal(card)}
                    className="rounded-full p-1"
                  >
                    <DeleteOutlinedIcon className="cursor-pointer hover:text-red-500" />
                  </div>
                </div>
              </div>
              <h2 className="text-gray-900 text-xl font-bold mb-3">
                {ann_name}
              </h2>
              <div className="flex items-center mb-4 space-x-4">
                <img
                  src={ann_project_logo}
                  alt="pic"
                  className="h-12 w-12 rounded-full border border-gray-300"
                />
                <div>
                  <h2 className="text-lg font-semibold">{ann_project_name}</h2>
                  <h3 className="text-gray-600 font-normal">
                    {ann_project_desc}{" "}
                  </h3>
                </div>
              </div>
              <div className="text-gray-500 leading-relaxed">
                <p>{ann_desc}</p>
              </div>
              <hr className="mt-4" />
            </div>
          );
        })
      )}

      {isAnnouncementModalOpen && (
        <AnnouncementModal
          isOpen={isAnnouncementModalOpen}
          onClose={handleCloseModal}
          onSubmitHandler={handleAddAnnouncement}
          isSubmitting={isSubmitting}
          isUpdate={Boolean(currentAnnouncementData)}
          data={currentAnnouncementData}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModel
          data={currentAnnouncementData}
          onClose={handleCloseDeleteModal}
          title={"Delete announcement"}
          heading={"Are you sure to delete this announcement"}
          onSubmitHandler={handleDelete}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default AnnouncementCard;

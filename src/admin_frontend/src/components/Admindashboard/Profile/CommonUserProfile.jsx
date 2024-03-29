// import React, { useState, useEffect } from "react";
// import "react-circular-progressbar/dist/styles.css";
// import { place, tick, star, Profile2 } from "../../Utils/AdminData/SvgData";
// import { useLocation } from "react-router-dom";
// import { numberToDate } from "../../Utils/AdminData/saga_function/blobImageToUrl";
// import { useSelector } from "react-redux";
// import { Principal } from "@dfinity/principal";
// import { ThreeDots } from "react-loader-spinner";


// const CommonUserProfile = () => {

//     const actor = useSelector((currState) => currState.actors.actor);

//   const [current, setCurrent] = useState("user");
//   const [isAccepting, setIsAccepting] = useState(false);
//   const [isDeclining, setIsDeclining] = useState(false);

//   const location = useLocation();
//   const notificationDetails = location.state;

//   console.log("notificationDetails in project profile", notificationDetails);

//   useEffect(() => {
//     const requestedRole = notificationDetails.role?.find(role => role.status === "requested");
//     if (requestedRole) {
//       setCurrent(requestedRole.name.toLowerCase());
//     } else {
//       setCurrent("user"); 
//     }
//   }, [notificationDetails.role]);

  
//   const isRoleDisabled = (roleName) => {
//     const mappedRoleName = roleName === "investor" ? "vc" : roleName;
//     const role = notificationDetails.role.find(r => r.name === mappedRoleName);
//     return role && role.status === "default"; 
//   };

  
//   const getLinkStyle = (path, role) => {
//     const roleLowerCase = role?.toLowerCase();
//     const isActive = location.pathname === path || current === roleLowerCase;
//     if (isActive) {
//       return "pb-1 border-b-2 border-white font-bold text-blue-800 text-xs cursor-pointer";
//     } else {
//       return "text-white text-xs cursor-pointer"; 
//     }
//   };


//   const getButtonClass = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-[#F28F1E]"; 
//       case "requested":
//         return "bg-[#0071FF]";
//       default:
//         return "bg-[#FF3A41]";
//     }
//   };

//   function constructMessage(role) {
//     let baseMessage = `This User's ${role.name.charAt(0).toUpperCase() + role.name.slice(1)} Profile `;
  
//     if (role.status === "active" && role.approved_on && role.approved_on.length > 0) {
//       baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
//     } else if (role.status === "approved" && role.approved_on && role.approved_on.length > 0) {
//       baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
//     } 
//     else if (role.status === "requested" && role.requested_on && role.requested_on.length > 0) {
//       baseMessage += `request was made on ${numberToDate(role.requested_on[0])}`;
//     } 
//     else if (role.status === "rejected" && role.rejected_on && role.rejected_on.length > 0) {
//       baseMessage += `was rejected on ${numberToDate(role.rejected_on[0])}`;
//     } else {
//       baseMessage += `is currently in the '${role.status}' status without a specific date.`;
//     }
  
//     return baseMessage;
//   }
  
  
//   const declineUserRoleHandler = async (
//     principal,
//     boolean,
//     state,
//     category
//   ) => {
//     setIsDeclining(true);
//     try {
//       const covertedPrincipal = await Principal.fromText(principal);
//       // console.log("Converted Principal ", covertedPrincipal);

//       switch (category) {
//         case "Mentor":
//           if (state === "Pending") {
//             await actor.decline_mentor_creation_request_candid(
//               covertedPrincipal,
//               boolean
//             );
//             await dispatch(mentorDeclinedRequest());
//           }
//           break;
//         case "Investor":
//           if (state === "Pending") {
//             await actor.decline_vc_creation_request(covertedPrincipal, boolean);
//             await dispatch(investorDeclinedRequest());
//           }
//           break;
//         case "Project":
//           if (state === "Pending") {
//             await actor.decline_project_creation_request(covertedPrincipal);
//             await dispatch(projectDeclinedRequest());
//           }
//           break;
//         default:
//           console.warn("Unhandled category:", category);
//       }
//     } catch (error) {
//       console.error("Error processing request:", error);
//     } finally {
//       setIsDeclining(false);
//       window.location.reload();
//     }
//   };

//   const allowUserRoleHandler = async (principal, boolean, state, category) => {
//     setIsAccepting(true);

//     try {
//       const covertedPrincipal = await Principal.fromText(principal);

//       switch (category) {
//         case "Mentor":
//           if (state === "Pending") {
//             await actor.approve_mentor_creation_request_candid(
//               covertedPrincipal,
//               boolean
//             );
//             await dispatch(mentorApprovedRequest());
//           }
//           break;
//         case "Investor":
//           if (state === "Pending") {
//             await actor.approve_vc_creation_request(covertedPrincipal, boolean);
//             await dispatch(investorApprovedRequest());
//           }
//           break;
//         case "Project":
//           if (state === "Pending") {
//             await actor.approve_project_creation_request(covertedPrincipal);
//             await dispatch(projectApprovedRequest());
//           }
//           break;
//         default:
//           console.warn("Unhandled category:", category);
//       }
//     } catch (error) {
//       console.error("Error processing request:", error);
//     } finally {
//       setIsAccepting(false);
//       window.location.reload();
//     }
//   };


// console.log("notificationDetails.role =>", notificationDetails.role[0].status);

//   return (
//     <div className="w-full px-[4%]">
//       <div className="flex flex-row justify-between mb-3">
//       <h1 className="md:text-3xl text-[20px] font-bold bg-black text-transparent bg-clip-text">
//         {current.charAt(0).toUpperCase() + current.slice(1)} Profile
//       </h1>
//         <div className="flex text-white flex-row font-bold h-auto md:w-[24rem] w-[9.5rem] mr-2 items-center bg-blue-300 rounded-lg py-2 px-3 justify-between">
//         <div className="md:block hidden">{Profile2}</div>
//         <p className="md:text-md text-xs font-bold md:block hidden">Change Profile</p>
        
//         {["user", "mentor", "project", "investor"].map((role) => {
//             const roleDisabled = isRoleDisabled(role); // Check if the role is disabled
//             const additionalClasses = roleDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

//             return (
//               <div 
//                 key={role} 
//                 className={`${getLinkStyle("", role)} md:block hidden ${additionalClasses}`} 
//                 onClick={() => {
//                   if (!roleDisabled) {
//                     setCurrent(role);
//                   }
//                 }}
//               >
//                 {role.charAt(0).toUpperCase() + role.slice(1)}
//               </div>
//             );
//           })}

//       </div>
//       </div>

//       {/* <div className="font-fontUse bg-gray-100 w-full mt-8 h-auto"> */}
//       <div className="  bg-white  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full">
//         {/* <div className="flex flex-row items-end px-10"> */}

//         {/* <p className="ml-2 mr-1  text-gray-400 md:text-xs text-[10px] pb-1 ">
//             Complete your profile!
//           </p> */}

//         {/* </div> */}

//         <div className="w-full pl-4 pr-2 flex flex-wrap flex-row items-start justify-start py-4">
//           <div className="relative">
//             <div className="object-fill">
//               <img
//                 className="md:w-36 md:h-36 w-28 h-28  mx-4 justify-start rounded-full"
//                 src={notificationDetails.user_data.profile_picture}
//                 alt="description"
//               />
//             </div>

//             <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
//               <svg className="absolute invisible">
//                 <defs>
//                   <linearGradient
//                     id="progressGradient"
//                     x1="0%"
//                     y1="0%"
//                     x2="100%"
//                     y2="0%"
//                     className="rounded"
//                   >
//                     <stop offset="0%" stopColor="#e2e8f0" />
//                     <stop offset="100%" stopColor="#3b82f6" />
//                   </linearGradient>
//                 </defs>
//               </svg>
//             </div>
//           </div>
//           <div className="flex flex-col ml-4  mt-2 w-auto md:mr-80">
//             <div className="flex flex-row  gap-4 items-center">
//               <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
//                 {notificationDetails.user_data.full_name}
//               </h1>
//               <div>
//                 <p className="bg-[#2A353D] text-xs rounded-full text-white py-1 px-2">
//                   {notificationDetails.category.activeCategory}
//                 </p>
//               </div>
//             </div>
//             <p className="font-normal text-black  md:text-md text-sm mt-2  mb-1 underline ">
//               {notificationDetails.category_of_mentoring_service}
//             </p>
//             <p className="text-gray-500 md:text-md text-sm font-normal mb-4">
//               {notificationDetails.user_data.email}
//             </p>

//             <div className="flex flex-col items-start gap-3 text-sm">
//               <div className="flex flex-row  text-gray-600 space-x-2">
//                 {place}
//                 <p className="underline ">
//                   {notificationDetails.user_data.country}
//                 </p>
//               </div>
//               <div className=" flex flex-row space-x-2 text-gray-600">
//                 {star}
//                 <p>{notificationDetails.requestedTime}</p>
//               </div>
//               <div className="pl-1 flex flex-row space-x-2 text-gray-600">
//                 {tick}
//                 <p>{notificationDetails.user_data.area_of_intrest}</p>
//               </div>
//             </div>

//             {notificationDetails.area_of_expertise && <p className="mt-8 text-black mb-2">Skills</p>}
//             <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
//               <p className="bg-[#c9c5c5] underline rounded-full px-3">
//                 {notificationDetails.area_of_expertise}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col gap-2 mt-2 px-2 overflow-y-auto py-2">
//           {notificationDetails.role?.filter(role => role.approved_on[0] || role.rejected_on[0] || role.requested_on[0]).map((role, index) => (
//     <div key={index} className="flex justify-around items-center">
//       <button
//         className={`flex items-center md:w-[310px] w-full h-[90px] ${getButtonClass(role.status)} rounded-md px-4`}
//       >
//         <div className="xl:lg:ml-4">{Profile2}</div>
//         <p className="flex justify-center items-center text-white p-2 text-sm">
//           {constructMessage(role)}
//         </p>
//       </button>
//     </div>
//   ))}
// </div>

//         </div>
//       </div>

//       {/* </div> */}

//       <div className="w-full mt-12">
//         <div className="flex  font-bold text-black text-3xl ">
//           <h1 className="mb-2">About {current.charAt(0).toUpperCase() + current.slice(1)}</h1>
//         </div>
//         <div>
//           <p>{notificationDetails.user_data.bio}</p>
//           {/* <button className="underline text-black" onClick={handleReadMoreClick}>
//             {showMore ? 'Read less' : 'Read more'}
//           </button> */}
//         </div>
//       </div>

































//       <div className="mt-12 pb-8">
//         <p className="w-full mb-4 border border-[#DCDCDC]"></p>
//         <div className="text-black text-3xl font-bold">
//           {notificationDetails.area_of_expertise && <h1 className="">Skills</h1>}
//         </div>
//         <div className="flex flex-col gap-2 ">
//           <div className="flex flex-row gap-2 flex-wrap mt-2 ">
//             <p className="bg-gray-300 underline rounded-full px-2">
//               {notificationDetails.area_of_expertise}
//             </p>
//           </div>
//         </div>













//         {notificationDetails.role?.map((role, index) => {
//       if (role.status === "requested") {
//     return (
//       <div key={index} className="flex justify-end gap-2 mt-6">
//         <button
//           onClick={() => allowUserRoleHandler(
//             notificationDetails.principal,
//             true,
//             "Pending",
//             notificationDetails.category.activeCategory
//           )}
//           disabled={isAccepting}
//           className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
//         >
//           {isAccepting ? <ThreeDots color="#FFF" height={13} width={51} /> : "Accept"}
//         </button>
//         <button
//           onClick={() => declineUserRoleHandler(
//             notificationDetails.principal,
//             false, 
//             "Pending",
//             notificationDetails.category.activeCategory
//           )}
//           disabled={isDeclining}
//           className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 border border-white rounded-lg hover:bg-red-800 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-gray-100"
//         >
//           {isDeclining ? <ThreeDots color="#000" height={13} width={51} /> : "Decline"}
//         </button>
//       </div>
//     );
//   }
//   return null; 
// })}



//       </div>
//     </div>
//   );
// };

// export default CommonUserProfile;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { headerData } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/AllDetailFormData";
// import girl from "../../../../../IcpAccelerator_frontend/assets/images/girl.jpeg";
// import "react-circular-progressbar/dist/styles.css";
// import { place, tick, star, Profile2 } from "../../Utils/AdminData/SvgData";
// import founder from "../../../../../IcpAccelerator_frontend/assets/images/founder.png";
// import proj from "../../../../../IcpAccelerator_frontend/assets/images/hub.png";
// import vc from "../../../../../IcpAccelerator_frontend/assets/images/vc.png";
// import mentor from "../../../../../IcpAccelerator_frontend/assets/images/mentor.png";

// import { useSelector } from "react-redux";

// const InvestorProfile = () => {
//   const [activeTab, setActiveTab] = useState(headerData[0].id);
//   const [showMore, setShowMore] = useState(false);

//   // console.log('specificRole in userprofile !!!!!!!  ', specificRole)
//   const navigate = useNavigate();

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   const getTabClassName = (tab) => {
//     return `inline-block p-4 ${
//       activeTab === tab
//         ? "text-white border-b-2 "
//         : "text-gray-400  border-transparent hover:text-white"
//     } rounded-t-lg`;
//   };

//   const calculateProgressOffset = (progress) => {
//     const radius = 47;
//     const circumference = 2 * Math.PI * radius;
//     return circumference - (progress / 100) * circumference;
//   };
//   const handleReadMoreClick = () => {
//     setShowMore(!showMore);
//   };

//   const getLinkStyle = (path) => {
//     return location.pathname === path
//       ? "pb-1 border-b-2 border-white font-bold text-blue-800"
//       : "text-white";
//   };

//   return (
//     <div className="w-full px-[4%]">
//       <div className="flex flex-row justify-between mb-3">
//         <h1 className="md:text-3xl text-[20px] font-bold bg-black text-transparent bg-clip-text ">
//           Project Profile
//         </h1>
//         <div className="flex text-white flex-row font-bold h-auto md:w-[24rem] w-[9.5rem] mr-2 items-center bg-blue-300 rounded-lg py-2 px-3 justify-between">
//           <div className="md:block hidden">{Profile2}</div>
//           <p className="text-md font-bold md:block hidden">Change Profile</p>
//           <a
//             onClick={() => navigate("/dashboard")}
//             className={`${getLinkStyle("/dashboard")} text-xs cursor-pointer`}
//           >
//             <div className="md:hidden w-6 h-6">
//               <img src={proj} alt="proj" />
//             </div>
//             <p className="md:block hidden">User</p>
//           </a>
//           <a
//             onClick={() => navigate("/users")}
//             className={`${getLinkStyle("/users")} text-xs cursor-pointer`}
//           >
//             <div className="md:hidden w-6 h-6">
//               <img src={founder} alt="founder" />
//             </div>
//             <p className="md:block hidden">Project</p>
//           </a>
//           <a
//             onClick={() => navigate("/request")}
//             className={`${getLinkStyle("/request")} text-xs cursor-pointer`}
//           >
//             <div className="md:hidden w-6 h-6">
//               <img src={mentor} alt="mentor" />
//             </div>
//             <p className="md:block hidden">Mentor</p>
//           </a>
//           <a
//             onClick={() => navigate("/request")}
//             className={`${getLinkStyle("/request")} text-xs cursor-pointer`}
//           >
//             <div className="md:hidden w-6 h-6">
//               <img src={vc} alt="vc" />
//             </div>
//             <p className="md:block hidden">Investor</p>
//           </a>
//         </div>
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
//                 src={girl}
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
//                 Name
//               </h1>
//               <div>
//                 <p className="bg-[#2A353D] text-xs rounded-full text-white py-1 px-2">
//                   Project
//                 </p>
//               </div>
//             </div>
//             <p className="font-normal text-black  md:text-md text-sm mt-2  mb-1 underline ">
//               Senior SRE/Chaos Engineer/Speaker
//             </p>
//             <p className="text-gray-500 md:text-md text-sm font-normal mb-4">
//               Site Reliability Engineer and DevOps Mentor
//             </p>

//             <div className="flex flex-col items-start gap-3 text-sm">
//               <div className="flex flex-row  text-gray-600 space-x-2">
//                 {place}
//                 <p className="underline ">France</p>
//               </div>
//               <div className=" flex flex-row space-x-2 text-gray-600">
//                 {star}
//                 <p>Active yesterday</p>
//               </div>
//               <div className="pl-1 flex flex-row space-x-2 text-gray-600">
//                 {tick}
//                 <p>Usually responds in a few hours</p>
//               </div>
//             </div>

//             <p className="mt-8 text-black mb-2">Skills</p>
//             <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
//               <p className="bg-[#c9c5c5] underline rounded-full px-3">SRE</p>
//               <p className="bg-[#c9c5c5] underline rounded-full  px-3">
//                 Observability
//               </p>
//               <p className="bg-[#c9c5c5] underline rounded-full  px-3">
//                 Kubernetes
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col gap-2 mt-2 px-2">
//             <div className="flex justify-around items-center">
//               <button
//                 className="flex items-center md:w-[310px] w-full h-[90px]
//    bg-[#F28F1E] rounded-md px-4"
//               >
//                 <div className=" xl:lg:ml-4">{Profile2}</div>
//                 <p className="flex justify-center items-center text-white p-2">
//                   This User also Project Profile Approved on 10 Feb, 2023
//                 </p>
//               </button>
//             </div>
//             <div className="flex justify-around items-center">
//               <button
//                 className="flex items-center md:w-[310px] w-full h-[90px]
//    bg-[#0071FF] rounded-md px-4"
//               >
//                 <div className="xl:lg:ml-4">{Profile2}</div>
//                 <p className="flex justify-center items-center text-white p-2 text-sm">
//                   This User also Project Profile Approved on 10 Feb, 2023
//                 </p>
//               </button>
//             </div>

//             <div className="flex justify-around items-center">
//               <button
//                 className="flex items-center md:w-[310px] w-full h-[90px]
//    bg-[#FF3A41] rounded-md px-4"
//               >
//                 <div className="xl:lg:ml-4">{Profile2}</div>
//                 <p className="flex justify-center items-center text-white p-2">
//                   Investor Profile request User on 10 April, 2023
//                 </p>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* </div> */}

//       <div className="w-full mt-12">
//         <div className="flex  font-bold text-black text-xl ">
//           <h1 className="mb-2">About user</h1>
//         </div>
//         <div>
//           <p>
//             Akram RIAHI is an Site Reliability Engineer (SRE) with an interest
//             in all things Cloud Native. He is passionate about kubernetes
//             resilience and chaos engineering at scale and is Litmus Chaos
//             leader. A curator of quality tech content, he is the author of
//             several blog posts and organizer of the "Chaos Week" a week-long
//             chaos engineering fest with great speakers aimed at cloud-native
//             community in France.he is also a speaker in many global events such
//             as conf42, chaosCarnival, Devoxx france.{" "}
//             {showMore && (
//               <>
//                 Akram RIAHI is an Site Reliability Engineer (SRE) with an
//                 interest in all things Cloud Native. He is passionate about
//                 kubernetes resilience and chaos engineering at scale and is
//                 Litmus
//               </>
//             )}
//           </p>
//           <button
//             className="underline text-black"
//             onClick={handleReadMoreClick}
//           >
//             {showMore ? "Read less" : "Read more"}
//           </button>
//         </div>
//       </div>

//       <div className="mt-12 pb-8">
//         <p className="w-full mb-4 border border-[#DCDCDC]"></p>
//         <div className="text-black text-3xl font-bold">
//           <h1 className="">Skills</h1>
//         </div>
//         <div className="flex flex-col gap-2 ">
//           <div className="flex flex-row gap-2 flex-wrap mt-2 ">
//             <p className="bg-gray-300 underline rounded-full px-2">SRE</p>
//             <p className="bg-gray-300 underline rounded-full px-2">
//               Observability
//             </p>
//             <p className="bg-gray-300 underline rounded-full px-2">
//               Kubernetes
//             </p>
//           </div>
//         </div>
//         <div className="flex flex-row justify-end gap-2 space-x-2 mt-6">
//           <button className="bg-red-900 rounded-md md:text-sm text-xs px-2 py-2 text-white font-bold">
//             Reject Project
//           </button>
//           <button className="bg-[#3505B2] rounded-md md:text-sm text-xs px-2 py-2 text-white font-bold">
//             Approved Project
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvestorProfile;

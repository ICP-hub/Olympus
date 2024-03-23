// import React, { useState, useEffect, useRef } from "react";
// import { projectFilterSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
// import project from "../../../../IcpAccelerator_frontend/assets/images/project.png";
// import ment from "../../../../IcpAccelerator_frontend/assets/images/ment.jpg";


// const AdminProjectdetails = () => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("Project Details");
//   const [showDetails, setShowDetails] = useState(true);
// const [ShowRating,setShowRating]= useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [show, setShow] = useState(false);
//   const [percent, setPercent] = useState(0);
//   const tm = useRef(null);

//   const gradientStops = isHovered
//     ? { stop1: "#4087BF", stop2: "#3C04BA" }
//     : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

//   const increase = () => {
//     setPercent((prevPercent) => {
//       if (prevPercent >= 100) {
//         clearTimeout(tm.current);
//         return 100;
//       }
//       return prevPercent + 1;
//     });
//   };

//   const dummyData = [
//     {
//       id: 1,
//       logo: project,
//       name: "Builder.fi",
//       description: "Q&A marketplace built on...",
//       code: "0x2085...016B",
//     },
//     {
//       id: 2,
//       logo: project,
//       name: "Project 2",
//       description: "Description for project 2",
//       code: "0x2085...016C",
//     },
//     {
//       id: 3,
//       logo: project,
//       name: "Project 3",
//       description: "Description for project 33333333333333333333333",
//       code: "0x2085...016Cbbbbbbbbbbbbbbbbbbbb",
//     },
//     {
//       id: 4,
//       logo: project,
//       name: "Project 4",
//       description: "Description for project 4",
//       code: "0x2085...016C",
//     },
//     {
//       id: 5,
//       logo: project,
//       name: "Project 5",
//       description: "Description for project 5",
//       code: "0x2085...016C",
//     },
//     {
//       id: 6,
//       logo: project,
//       name: "Project 6",
//       description: "Description for project 6",
//       code: "0x2085...016C",
//     },
//   ];
//   useEffect(() => {
//     if (percent < 100) {
//       tm.current = setTimeout(increase, 10);
//     }
//     return () => clearTimeout(tm.current);
//   }, [percent]);
//   function truncateWithEllipsis(str, startLen = 3, endLen = 3) {
//     if (str.length <= startLen + endLen) {
//       return str;
//     }
//     const start = str.substring(0, startLen);
//     const end = str.substring(str.length - endLen);
//     return `${start}...${end}`;
//   }
  
//   const handleOptionClick = (option) => {
//     console.log("options", option);
//     setSelectedOption(option); 
//     setIsPopupOpen(false); 
//     if (option === "Project Details") {
//       setShowDetails(true); 
//     } else{
//       console.log("projects Ratings")
//       setShowDetails(false); 
//     }
//   };
  
//   return (
//     <div className="px-[4%]  w-full bg-gray-100 h-screen overflow-y-scroll">
//       <div className="flex items-center justify-between">
//         {selectedOption && (
//           <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold">
//             {selectedOption}
//           </div>
//         )}
//         <div
//           className="cursor-pointer"
//           onClick={() => setIsPopupOpen(!isPopupOpen)}
//         >
//           {projectFilterSvg}
//         </div>
//         {isPopupOpen && (
//           <div className="absolute w-[250px] top-40 right-16 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
//             <ul className="flex flex-col">
//               <li>
//                 <button
//                   onClick={() => handleOptionClick("Project Details")}
//                   className="border-[#9C9C9C] py-[18px] border-b-2 w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start"
//                 >
//                   Projects Details
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => handleOptionClick(" Projects Ratings")}
//                   className="border-[#9C9C9C] py-[18px] w-[230px]  px-4 font-bold focus:outline-none text-xl flex justify-start"
//                 >
//                   Projects Ratings
//                 </button>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//       <div className="w-full flex flex-row md:flex-nowrap flex-wrap rounded-md text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[13.5px] md:text-[14px.3] md1:text-[14px] md2:text-[14px] md3:text-[14px] lg:text-[16.5px] dlg:text-[17px] lg1:text-[15.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px]  my-2 box-shadow-blur bg-gradient-black-transparent">
//       <div className="flex flex-wrap -mx-4 gap-3 px-4">
//       {showDetails  ? dummyData.map((item) => (
//           <div key={item.id} className="md:w-[300px] w-full mb-8 flex flex-col">
//             <div className="flex flex-col justify-between border border-gray-200 rounded-xl pt-3">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                   <img
//                     className="object-fill rounded-md h-16 w-16 ml-4"
//                     src={ment}
//                     alt="Project logo"
//                   />
//                   <div className="ml-2">
//                     <p className="text-[13px] font-bold text-black">
//                       {item.name}
//                     </p>
//                     <p
//                       className="truncate overflow-hidden whitespace-nowrap text-[10px] text-gray-400"
//                       style={{ maxHeight: "4.5rem" }}
//                     >
//                       {truncateWithEllipsis(item.description)}
//                     </p>

//                     <div className="flex flex-row gap-1">
//                       <img
//                         className="object-fill h-4 w-4 rounded-full"
//                         src={item.logo}
//                         alt="Project logo"
//                       />
//                       <p className="text-[12px] text-gray-500 hover:text-clip">
//                         {truncateWithEllipsis(item.code)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <button className="rounded-md h-16 w-16 mr-4 border border-gray-300 flex justify-center items-center">
//                   <div className="flex flex-col justify-center items-center">
//                     <svg
//                       width="15"
//                       height="15"
//                       viewBox="0 0 8 6"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="transition-transform transform hover:scale-150"
//                     >
//                       <path
//                         d="M3.04007 0.934606C3.44005 0.449652 4.18299 0.449652 4.58298 0.934606L6.79207 3.61298C7.33002 4.26522 6.86608 5.24927 6.02061 5.24927H1.60244C0.756969 5.24927 0.293022 4.26522 0.830981 3.61298L3.04007 0.934606Z"
//                         fill="#737373"
//                       />
//                     </svg>
//                     <span className="text-black text-[10px] font-semibold">
//                       {" "}
//                       10
//                     </span>
//                   </div>
//                 </button>
//               </div>

//               {show && (
//                 <div className="flex items-center w-full mt-4 px-2">
//                   <div className="relative flex-grow  h-2  rounded-lg bg-gradient-to-r from-gray-100 to-black"></div>
//                   <p className="text-xs ml-2">level 9</p>
//                 </div>
//               )}
//               <div className="flex rounded-b-xl flex-row justify-between items-center mt-2 px-4 py-1 bg-gray-200">
//                 <div className="flex flex-row space-x-2 text-[10px] text-black">
//                   <p>. DAO</p>
//                   <p>. Infrastructure</p>
                 
//                 </div>
//              <p className="text-[#320099] text-sm font-bold">See Details</p>
//               </div>
//             </div>
//           </div>
//         )) : <>{dummyData.map((item) => (
//           <div key={item.id} className="md:w-[300px] w-full mb-8 flex flex-col">
//             <div className="flex flex-col justify-between border border-gray-200 rounded-xl pt-3">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                   <img
//                     className="object-fill rounded-md h-16 w-16 ml-4"
//                     src={ment}
//                     alt="Project logo"
//                   />
//                   <div className="ml-2">
//                     <p className="text-[13px] font-bold text-black">
//                       {item.name}
//                     </p>
//                     <p
//                       className="truncate overflow-hidden whitespace-nowrap text-[10px] text-gray-400"
//                       style={{ maxHeight: "4.5rem" }}
//                     >
//                       {truncateWithEllipsis(item.description)}
//                     </p>

//                     <div className="flex flex-row gap-1">
//                       <img
//                         className="object-fill h-4 w-4 rounded-full"
//                         src={item.logo}
//                         alt="Project logo"
//                       />
//                       <p className="text-[12px] text-gray-500 hover:text-clip">
//                         {truncateWithEllipsis(item.code)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <button className="rounded-md h-16 w-16 mr-4 border border-gray-300 flex justify-center items-center">
//                   <div className="flex flex-col justify-center items-center">
//                     <svg
//                       width="15"
//                       height="15"
//                       viewBox="0 0 8 6"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="transition-transform transform hover:scale-150"
//                     >
//                       <path
//                         d="M3.04007 0.934606C3.44005 0.449652 4.18299 0.449652 4.58298 0.934606L6.79207 3.61298C7.33002 4.26522 6.86608 5.24927 6.02061 5.24927H1.60244C0.756969 5.24927 0.293022 4.26522 0.830981 3.61298L3.04007 0.934606Z"
//                         fill="#737373"
//                       />
//                     </svg>
//                     <span className="text-black text-[10px] font-semibold">
//                       {" "}
//                       10
//                     </span>
//                   </div>
//                 </button>
//               </div>

//               {show && (
//                 <div className="flex items-center w-full mt-4 px-2">
//                   <div className="relative flex-grow  h-2  rounded-lg bg-gradient-to-r from-gray-100 to-black"></div>
//                   <p className="text-xs ml-2">level 9</p>
//                 </div>
//               )}

             

//               <div className="flex rounded-b-xl flex-row justify-between items-center mt-2 px-4 py-1 bg-gray-200">
//                 <div className="flex flex-row space-x-2 text-[10px] text-black">
//                   <p>. DAO</p>
//                   <p>. Infrastructure</p>
                 
//                 </div>
//              <p className="text-[#320099] text-sm font-bold">See Rating</p>
//               </div>
//             </div>
//           </div>
//         ))}</>}
//       </div>
//     </div>
//     <div className="w-full flex flex-row md:flex-nowrap flex-wrap rounded-md text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[13.5px] md:text-[14px.3] md1:text-[14px] md2:text-[14px] md3:text-[14px] lg:text-[16.5px] dlg:text-[17px] lg1:text-[15.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px]  my-2 box-shadow-blur bg-gradient-black-transparent">
//       <div className="flex flex-wrap -mx-4 gap-3 px-4">
//       {/* {ShowRating && 
//       dummyData.map((item) => (
//           <div key={item.id} className="md:w-[300px] w-full mb-8 flex flex-col">
//             <div className="flex flex-col justify-between border border-gray-200 rounded-xl pt-3">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                   <img
//                     className="object-fill rounded-md h-16 w-16 ml-4"
//                     src={ment}
//                     alt="Project logo"
//                   />
//                   <div className="ml-2">
//                     <p className="text-[13px] font-bold text-black">
//                       {item.name}
//                     </p>
//                     <p
//                       className="truncate overflow-hidden whitespace-nowrap text-[10px] text-gray-400"
//                       style={{ maxHeight: "4.5rem" }}
//                     >
//                       {truncateWithEllipsis(item.description)}
//                     </p>

//                     <div className="flex flex-row gap-1">
//                       <img
//                         className="object-fill h-4 w-4 rounded-full"
//                         src={item.logo}
//                         alt="Project logo"
//                       />
//                       <p className="text-[12px] text-gray-500 hover:text-clip">
//                         {truncateWithEllipsis(item.code)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <button className="rounded-md h-16 w-16 mr-4 border border-gray-300 flex justify-center items-center">
//                   <div className="flex flex-col justify-center items-center">
//                     <svg
//                       width="15"
//                       height="15"
//                       viewBox="0 0 8 6"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="transition-transform transform hover:scale-150"
//                     >
//                       <path
//                         d="M3.04007 0.934606C3.44005 0.449652 4.18299 0.449652 4.58298 0.934606L6.79207 3.61298C7.33002 4.26522 6.86608 5.24927 6.02061 5.24927H1.60244C0.756969 5.24927 0.293022 4.26522 0.830981 3.61298L3.04007 0.934606Z"
//                         fill="#737373"
//                       />
//                     </svg>
//                     <span className="text-black text-[10px] font-semibold">
//                       {" "}
//                       10
//                     </span>
//                   </div>
//                 </button>
//               </div>

//               {show && (
//                 <div className="flex items-center w-full mt-4 px-2">
//                   <div className="relative flex-grow  h-2  rounded-lg bg-gradient-to-r from-gray-100 to-black"></div>
//                   <p className="text-xs ml-2">level 9</p>
//                 </div>
//               )}

             

//               <div className="flex rounded-b-xl flex-row justify-between items-center mt-2 px-4 py-1 bg-gray-200">
//                 <div className="flex flex-row space-x-2 text-[10px] text-black">
//                   <p>. DAO</p>
//                   <p>. Infrastructure</p>
                 
//                 </div>
//              <p className="text-[#320099] text-sm font-bold">See Rating</p>
//               </div>
//             </div>
//           </div>
//         ))} */}
//       </div>
//     </div>
//     </div>
//   );
// };

// export default AdminProjectdetails;

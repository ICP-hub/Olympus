// import React from "react";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// export const InvestorAssociatedtSkeleton = () => {
//   return (
//     <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
                   
//         <div className="shadow-md rounded-lg overflow-hidden w-full border-2 bg-white p-4 mb-4">
//                     <div className='pt-6'>
//                         <div className='flex flex-row items-baseline space-x-2 text-black text-lg'>
//                             <img className="w-14 h-14 rounded-lg object-cover" src='' alt="logo" />
//                             <p className='font-bold text-black flex-wrap'> <Skeleton height={20} width={100}></Skeleton>regvbjnkbvgftxfcgv</p>
//                         </div>
//                         <div className="flex w-full pb-4 pr-4 overflow-x-auto">
//                             {/* {projectAreaOfFocus ? (
//                                 <div className="flex gap-2 mt-2 text-xs items-center">
//                                     {projectAreaOfFocus
//                                         .split(",")
//                                         .slice(0, 3)
//                                         .map((tag, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100"
//                                             >
//                                                 {tag.trim()}
//                                             </div>
//                                         ))}
//                                 </div>) : ""} */}
//                         </div>
//                         <div className='pt-4 overflow-x-auto'>
//                             <p className="text-[#6B7280] line-clamp-2">wertyufuighjk zrtfcygvhbjn erdtyfguh xfcgvh</p>
//                         </div>
//                         <div className='flex mt-4 text-sm bg-[#3505B2] rounded-md justify-center'>
//                             <button
//                                 // onClick={() => navigate(`/individual-project-details-project-investor/${projectId}`)}
//                                 className="flex justify-center items-center text-white px-4 py-2 font-bold">View Project</button>
//                         </div>
//                     </div>
//                 </div>
//     </SkeletonTheme>
//   )}
// InvestorAssociatedtSkeleton.jsx
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const InvestorAssociatedtSkeleton = () => {
    return (
        <SkeletonTheme color="#e0e0e0" highlightColor="#f5f5f5">
            <div className="shadow-md rounded-lg overflow-hidden w-full border-2 bg-white p-4 pt-2 mb-4">
                <div className='pt-6'>
                    <div className='flex flex-row  space-x-2  '>
                        <Skeleton  height={55} width={55} className='rounded-md' />
                        <Skeleton height={20} width={200}  className='mt-[40px]'/>
                    </div>
                    <div className="flex w-full pb-4 pr-4 overflow-x-auto">
                        
                    </div>
                    <div className='pt-4 overflow-x-auto'>
                        <Skeleton  height='15' count={3} />
                    </div>
                    {/* <div className='flex mt-4 text-sm bg-[#3505B2] rounded-md justify-center'> */}
                        <Skeleton height={42} width='100%'/>
                    {/* </div> */}
                </div>
            </div>
        </SkeletonTheme>
    );
};

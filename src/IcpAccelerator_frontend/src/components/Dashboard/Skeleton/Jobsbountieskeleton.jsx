// import React from "react";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// export const JobBountieSkeleton = () => {
//     return(
//         <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">

//                 <div
//                   className="border-2 mb-5 mx-1 rounded-2xl shadow-lg bg-white"
//                 //   key={index}
//                 >
//                   <div className="md:p-4 p-2">
//                     <h3 className="text-lg font-[950] truncate w-1/2">
//                         <Skeleton height={25} width={250} />
//                       {/* {job_name} */}
//                     </h3>
//                     <div className="sm:flex">
//                       <div className="sm:w-1/2">
//                         <div className="pt-2 flex">
//                         <Skeleton height={55} className='rounded-xl' width ={55} />
//                           {/* <img
//                             src={job_project_logo}
//                             alt="project"
//                             className="w-16 aspect-square object-cover rounded-md"
//                           /> */}
//                           <div className="mt-auto pl-2">
//                             <p className="font-[950] text-base truncate w-28">
//                               {/* {job_project_name} */} <Skeleton height={20} width={100} />
//                             </p>
//                             <p className="font-[450] line-clamp-2 text-xs w-48">
//                               {/* {job_project_desc} */}
//                               <Skeleton height={15} width={180} count={2} />
//                             </p>
//                           </div>
//                         </div>
//                         <div className="mt-2 pr-4">
//                           <p className="text-base font-[950] py-2">
//                           <Skeleton height={20} width={130} />

//                           </p>
//                           <ul className="text-xs md:pl-4 font-[450] list-disc list-outside">
//                             <li className="h-40 overflow-y-scroll">
//                               {/* {job_description} */}
//                               <Skeleton height={15} width="100%" count={7} />
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                       <div className="flex flex-col justify-between sm:w-1/2">
//                         <div className="flex justify -center items-center">
//                           <p className="text-base font-[950] pr-2">
//                             <div className="flex gap-2">
//                             <Skeleton height={20} width={80} />
//                             <Skeleton height={20} width={30}  className='rounded-xl' />
//                             <Skeleton height={20} width={30}   className='rounded-xl'/>
//                             <Skeleton height={20} width={30}   className='rounded-xl'/>
//                                 </div> </p>
//                           {/* {tags && (
//                             <p className="flex items-center flex-wrap py-2 gap-2">
//                               <span className="bg-transparent text-xs font-semibold px-3 py-1 rounded-2xl border-2 border-black">
//                                 {job_category}
//                               </span>
//                             </p>
//                           )} */}
//                         </div>
//                         <div className="mt-2">
//                           <p className="text-base font-[950] py-2">  <Skeleton height={20} width={80} /></p>
//                           <ul className="text-xs md:pl-4 font-[450] list-disc list-inside">

//                             <Skeleton height={15} width={80} />

//                           </ul>
//                         </div>

//                         <div className="mt-2">
//                           <p className="text-base font-[950] py-1">  <Skeleton height={20} width={80} /></p>
//                           <span className="capitalize"> <Skeleton height={15} width={80} /></span>
//                         </div>
//                         <div className="mt-2 flex md:block md3:flex items-end">
//                           <div className="w-full">
//                             <span className="text-sm">
//                             <Skeleton height={20} width={150} />
//                               {/* Register your interest here: */}
//                             </span>
//                             <span><Skeleton height={20} width={50} /></span>
//                           </div>
//                           <div className="w-full sm:w-1/2">
//                             {" "}
//                             {

//                                 // <button className="font-[450] border text-xs text-[#ffffff] py-[7px] px-[9px] rounded-md border-[#FFFFFF4D] drop-shadow-[#00000040]  bg-[#3505B2] text-nowrap">
//                                     <Skeleton height={25} width={100} />
//                                 //   I'm interested!
//                                 // </button>
//                             }
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 </SkeletonTheme>
//     )}

import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const JobBountieSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#e3e3e3' highlightColor='#c8c8c873'>
      <div className='border-2 mb-5 mx-1 rounded-2xl shadow-lg bg-white'>
        <div className='p-4 md:p-2'>
          <h3 className='text-lg font-[950] truncate w-full sm:w-1/2'>
            <Skeleton height={25} width={250} />
          </h3>
          <div className='flex flex-col sm:flex-row'>
            <div className='w-full sm:w-1/2'>
              <div className='pt-2 flex'>
                <Skeleton height={55} className='rounded-xl' width={55} />
                <div className='mt-auto pl-2'>
                  <p className='font-[950] text-base truncate w-28'>
                    <Skeleton height={20} width={100} />
                  </p>
                  <p className='font-[450] line-clamp-2 text-xs w-48'>
                    <Skeleton height={15} width={180} count={2} />
                  </p>
                </div>
              </div>
              <div className='mt-2 pr-4'>
                <p className='text-base font-[950] py-2'>
                  <Skeleton height={20} width={130} />
                </p>
                <ul className='text-xs font-[450] list-disc list-outside'>
                  <li className='h-40 overflow-y-scroll'>
                    <Skeleton height={15} width='100%' count={7} />
                  </li>
                </ul>
              </div>
            </div>
            <div className='flex flex-col justify-between w-full sm:w-1/2 mt-4 sm:mt-0'>
              <div className='flex items-center'>
                <p className='text-base font-[950] pr-2 w-full'>
                  <Skeleton height={20} width={80} />
                </p>
                <div className='flex gap-2 w-full'>
                  <Skeleton height={20} width={30} className='rounded-xl' />
                  <Skeleton height={20} width={30} className='rounded-xl' />
                  <Skeleton height={20} width={30} className='rounded-xl' />
                </div>
              </div>
              <div className='mt-2'>
                <p className='text-base font-[950] py-2'>
                  <Skeleton height={20} width={80} />
                </p>
                <ul className='text-xs font-[450] list-disc list-inside'>
                  <Skeleton height={15} width={80} />
                </ul>
              </div>
              <div className='mt-2'>
                <p className='text-base font-[950] py-1'>
                  <Skeleton height={20} width={80} />
                </p>
                <span className='capitalize'>
                  <Skeleton height={15} width={80} />
                </span>
              </div>
              <div className='mt-2 flex flex-col md:flex-row md:items-end'>
                <div className='w-full'>
                  <span className='text-sm'>
                    <Skeleton height={20} width={150} />
                  </span>
                </div>
                <div className='w-full sm:w-1/2 mt-2 md:mt-0'>
                  <Skeleton height={25} width={100} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export const MentorlistSkeleton =() => {
    return(
        <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
       <div
            //   key={index}
              className="bg-white  hover:scale-105 w-full rounded-lg mb-5 md:mb-0 p-6 drop-shadow-xl lg:ml-2"
            >
              <div className="justify-center flex items-center">
              <div className="size-48  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay "
              //  style={{
              //   backgroundImage: `url(${img}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
              //   backdropFilter: "blur(20px)",
              // }}
              > <Skeleton circle={true} height={175} width={175}  />
                {/* <img
                  className="object-cover size-48 max-h-44 rounded-full"
                  src=''
                  alt=""
                /> */}
              </div>
              </div>
              <div className="text-black text-start">
                <div className="text-start my-3">
                  <span className="font-semibold text-lg truncate">
                    {name}
                  </span>
                  <span className="block text-gray-500 truncate">
                    <Skeleton height={18} width={150}/>
                    </span>
                </div>
                <div className="flex overflow-x-auto gap-2 pb-4 justify-start">
                   {
                        <>
                          <span
                            // key={index}
                            className="rounded-full  text-xs font-bold   leading-none flex items-center"
                          >
                            <Skeleton height={13} width={75} />
                            {/* {item.trim()} */}
                          </span>
                          
                          </>
                    }
                </div>
               <div className="flex  gap-1">
                <Skeleton height={12} width={25} rounded-lg className='rounded-xl'/>
                <Skeleton height={12} width={25} rounded-lg className='rounded-xl'/>
                <Skeleton height={12} width={25} rounded-lg className='rounded-xl'/>
                </div>
                
                  {/* className="text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out" */}
                
                    <Skeleton height={33} width="100%" />
                  
                
              </div>
            </div>
        </SkeletonTheme>
    )
}
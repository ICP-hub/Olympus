import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export const AnnouncementSkeleton =() => {
    return(
        <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
                   

                    <div className="border-2 mb-4 overflow-hidden rounded-3xl shadow-md hover:scale-105 transition-transform duration-300 ease-in-out bg-white">
                      <div className="p-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex-row justify-between">
                            <p className="text-black font-bold"> 
                            <Skeleton height={25} width={160} /></p>
                            <p className="text-gray-500 flex justify-end text-sm my-2 items-center"> 
                            <div className="flex gap-4 "></div>
                            <Skeleton height={20} width={20} />
                            <Skeleton height={20} width={70} className='ml-2' />
                            
                            </p>
                          </div>
                          <p className="h-32 overflow-y-scroll text-gray-500 text-sm">
                             <Skeleton height={20} count={3} width ={315} />
                          </p>
                          <div className="flex flex-row gap-2 items-center">
                          <Skeleton height={65} className='rounded-xl' width ={65} />
                            {/* <img
                              className="h-14 w-14 rounded-xl object-cover"
                              src=""
                              alt="img"
                            /> */}
                            <div className="flex flex-col justify-around w-fit">
                              <p className="font-bold text-md truncate">
                              <Skeleton height={25} width={120} />
                                {/* {ann_project_name} */}
                              </p>
                              <p className="font-semibold text-gray-500  text-xs line-clamp-2">
                                {/* {ann_project_desc} */}
                                <Skeleton height={15} count={2} width ={200} />
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  
        </SkeletonTheme>

    )
}
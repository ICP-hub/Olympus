import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const CurrentlyRaisingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
        <div
                    className="w-full sm:w-1/2 md:w-1/4 mb-2 hover:scale-105 transition-transform duration-300 ease-in-out lg:ml-3"
                    // key={index}
                  >
                    <div className="w-fit flex justify-between items-baseline mb-4 flex-wrap bg-white m-2 overflow-hidden rounded-lg shadow-lg min-w-1/2">
                      <div className="p-4">
                        <div className="flex justify-between items-baseline mb-2 flex-col flex-wrap w-[265px]">
                          <div className="flex items-baseline w-1/2 ">
                          <Skeleton circle={true} width={50}height={50} className="rounded-3xl" />
                         
                               <Skeleton height={25} width={100} className='ml-2  top-[17px]'  />
                           
                          </div>
                          <div className="flex items-baseline w-1/2 ">
                          <Skeleton height={20} width={20} circle={true} className='ml-2'/>
                            
                            <Skeleton height={20} width={90} className='ml-2'/>
                          </div>
                        </div>
                        <Skeleton height={10} width='100%'  />
                        
                       
                        {/* </div>)} */}
                        <p className="text-gray-700 text-sm p-2 h-36 overflow-hidden line-clamp-8 mb-4">
                        <Skeleton height={15} width="100%" count={4} />
                          {/* {projectDescription} */}
                        </p>
                        
                        <Skeleton height={35} width="100%" />
                        
                      </div>
                    </div>
                  </div>
    </SkeletonTheme>
  )}
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ProjectOwnerAnnouncementSkeleton = () => {
    return(
        <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
                   
                   <div className="border-2 mb-4 mx-1 overflow-hidden rounded-3xl shadow-md lg:w-[40%] bg-white ">
                  <div className="p-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex-row justify-between">
                        <p className="text-black font-bold"><Skeleton height ={25} width ={160} /></p>
                        <p className="text-black text-gray-500 text-right">
                        <Skeleton height ={20} width ={100} />
                        </p>
                      </div>
                      <p className="h-32 overflow-y-scroll text-gray-500 text-sm">
                        {/* {ann_desc} */}
                        <Skeleton height ={15} width ="100" count={3} />
                      </p>
                      <div className="flex flex-row gap-2 items-center">
                      <Skeleton height ={65} width ={65} className='rounded-lg' />
                        {/* <img
                          className="h-14 w-14 rounded-xl object-cover"
                          src={ann_project_logo}
                          alt="img"
                        /> */}
                        <div className="flex flex-col justify-around ">
                          <p className="font-bold text-md truncate ">
                            {/* {ann_project_name} */}
                            <Skeleton height ={25} width ={120} className='-mt-2' />
                          </p>
                          <p className="font-semibold text-gray-500  text-xs ">
                            {/* {ann_project_desc} */}
                            <Skeleton height ={15} width ={200} count={2} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                    
        </SkeletonTheme>
    )
};

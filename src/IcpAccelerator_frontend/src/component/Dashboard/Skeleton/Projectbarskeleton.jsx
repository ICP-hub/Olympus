import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ProjectBarSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
      <div>
        <div className="sm0:flex flex-row space-x-1 justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton height={65} width={65} className="rounded-xl" />

            <div className="ml-0">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold"></h3>
                <Skeleton height={25} width={120} />
              </div>
            </div>
          </div>
          <div className="flex flex-row sm0:flex-wrap gap-2 text-xs md:text-sm text-right pr-4 ">
            <Skeleton height={20} width={20} circle={true} />
            <Skeleton height={25} width={95} />
            <Skeleton height={25} width={85} />
          </div>
        </div>

        
        <div className="flex justify-between">
          <div className="flex flex-col">
            <Skeleton height={30} width={125} />
            <Skeleton height={35} width={35} circle={true} />
          </div>
          <Skeleton  height={30} width={115}  className='mt-9'/>
        </div>
      </div>
    </SkeletonTheme>
  );
};

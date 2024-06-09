import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const AssociatedProjectSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
      <div className="relative shadow-md rounded-lg overflow-hidden w-full gap-2 bg-white p-4">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Uncomment if you want to show the cover image */}
          {/* <div className="w-full max-w-xs min-h-40 md:min-h-56">
            <img
              className="w-full h-full rounded-md sm:rounded-l-none sm:rounded-r-none md:rounded-r-none lg:rounded-r-none object-cover"
              src={projectCover}
              alt="cover"
            />
          </div> */}
          <div className="flex flex-col justify-between w-full p-4 overflow-x-auto">
            <div className="flex flex-col">
              <div className="flex flex-col lg:flex-row gap-3">
                <Skeleton height={65} width={65} className="rounded-lg" />
                <p className="font-bold truncate">
                  <Skeleton height={25} width={200} className="mt-6" />
                </p>
              </div>
              <div className="flex flex-col sm:flex-row py-1 justify-between">
                <div className="flex items-center ml-3">
                  <Skeleton height={35} width={35} circle={true} />
                  <p className="text-xs">
                    <Skeleton height={25} width={120} className="mx-2" />
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="flex w-full pb-4 pr-4 overflow-x-auto"> */}
              {/* <div className="flex gap-2 mt-2 text-xs items-center"> */}
                {/* Skeleton tags */}
                {/* <Skeleton height={24} width={60} className="rounded-2xl" />
                <Skeleton height={24} width={60} className="rounded-2xl" />
                <Skeleton height={24} width={60} className="rounded-2xl" /> */}
              {/* </div> */}
            {/* </div> */}
            <div className="flex flex-col pb-4">
              <p className="text-[#737373] line-clamp-2">
                <Skeleton height={15} width="100%" count={2} />
              </p>
            </div>
            
              <Skeleton height={35} width="100%" />
            
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default AssociatedProjectSkeleton;

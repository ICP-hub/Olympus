
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ProjectOwnerTeammemberSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
      <div className="flex flex-col p-6 m-4 lg:w-[35%] sm:w-[100%]  bg-white rounded-lg shadow-lg">
        <div className="relative flex justify-between w-full">
          <div>
            <Skeleton height={80} width={80} circle={true} />
          </div>
          <div>
            <Skeleton height={20} width={20} circle={true} />
          </div>
        </div>

        <div className="mt-6 w-full">
          <Skeleton height={25} width="50%" />
          <div className="mt-2">
            <Skeleton height={20} width="25%" />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

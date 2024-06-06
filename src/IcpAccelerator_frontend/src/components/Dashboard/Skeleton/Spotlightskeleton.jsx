

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SpotlightSkeleton = () => {
  return (
    <div className="flex  justify-start items-center py-4 ml-2">
      <div className="shadow-md rounded-xl h-[200px] w-full max-w-[370px] bg-white p-4">
        <div className="flex flex-row gap-2">
          <Skeleton height={50} width={50} className="rounded-lg" />
          <div className="flex flex-col justify-center">
            <Skeleton height={20} width={100}  />
            <div className="flex items-center gap-2">
              <Skeleton height={20} width={20} circle={true} />
              <Skeleton height={15} width={150} className="mt-2"/>
            </div>
          </div>
        </div>
        <div className="my-2">
          <Skeleton height={10} width="90%" count={3} className="mb-1" />
        </div>
      </div>
    </div>
  );
};

export default SpotlightSkeleton;

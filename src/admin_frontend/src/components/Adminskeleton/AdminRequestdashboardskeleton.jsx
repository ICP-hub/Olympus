import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const AdminRequestSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="px-[2%] py-[1.5%] w-full flex flex-col mb-6 bg-white rounded-lg shadow border border-gray-200"
        >
          <div className="w-full mb-2 justify-between items-center flex flex-row flex-wrap">
            <div className="space-x-3 flex flex-row items-center">
              <Skeleton height={40} width={40} circle={true} />
              <h4>
                <Skeleton height={25} width={120} />
              </h4>
              <div>
                <p className="items-center rounded-full text-white py-0.5 px-2">
                  <Skeleton height={20} width={40} className="rounded-xl" />
                </p>
              </div>
            </div>
            <div className="hidden md:flex md:flex-row">
              <span className="text-gray-500 mr-2"></span>
              <p className="md:text-sm text-xs md:text-md text-[#3505B2]">
                <Skeleton height={30} width={30} />
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full">
            <div className="flex flex-col md:w-3/4 w-full mb-3 md:mb-0">
              <div className="md:hidden mt-2 block">
                <div className="flex flex-row mt-2 items-center text-sm mb-1 font-medium text-gray-600">
                  <span className="text-gray-500 min-w-[40px] ml-3">
                    <Skeleton height={25} width={25} />
                  </span>
                  <span className="truncate md:text-sm text-xs">
                    <Skeleton height={25} width={70} />
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center text-sm mb-1 md:mt-2 font-medium text-gray-600">
                <span className="text-gray-500 min-w-[40px] ml-3">
                  <Skeleton height={25} width={25} />
                </span>
                <span className="truncate">
                  <Skeleton height={20} width={100} />
                </span>
              </div>
              <div className="flex flex-row items-center text-sm font-medium text-gray-600 break-words">
                <span className="text-gray-500 min-w-[40px] ml-3">
                  <Skeleton height={25} width={25} />
                </span>
                <span className="truncate md:text-sm text-xs">
                  <Skeleton height={20} width={200} />
                </span>
              </div>
              <div className="flex flex-row items-center text-sm font-medium text-gray-600 break-words">
                <span className="text-gray-500 min-w-[40px] ml-3"></span>
                <span className="truncate md:text-sm text-xs"></span>
              </div>
              <div className="flex flex-row items-center text-sm font-medium text-gray-600 break-words">
                <span className="text-gray-500 min-w-[40px] ml-3.5"></span>
              </div>
            </div>
            <div className="md:w-1/4 w-full flex justify-end items-end space-x-2 md:h-10">
              <Skeleton height={25} width={100} />
            </div>
          </div>
        </div>
      ))}
    </SkeletonTheme>
  );
};



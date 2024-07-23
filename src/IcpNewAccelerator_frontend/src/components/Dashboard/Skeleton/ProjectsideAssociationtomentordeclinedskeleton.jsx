import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ProjectAssociationDeclinedSkeleton = () => {
  return (
    <div className="p-4 border-2 bg-white rounded-lg mb-4">
      <div className="flex flex-col md:flex-row">
        <div className="flex items-start ">
          <div className="align-top">
            <Skeleton height={60} width={60} circle={true}></Skeleton>
          </div>
        </div>
        <div className="w-full md:pl-4">
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <p className="text-gray-500 font-bold">
                <Skeleton height={30} width={150}></Skeleton>
              </p>
              <p className="text-gray-400 font-thin">
                <Skeleton height={25} width={150}></Skeleton>
              </p>
            </div>
            <div className="min-h-4 line-clamp-3 text-gray-400">
              <p>
                <Skeleton height={25} width="20%"></Skeleton>
              </p>
            </div>
            <div className="flex justify-between mt-2">
              <Skeleton height={25} width={150}></Skeleton>
              <Skeleton height={25} width={150}></Skeleton>
            </div>
            <Skeleton height={25} width={100}></Skeleton>
            <div className="flex justify-end pt-4">
              <div className="flex gap-4">
                <div className="px-2 py-1 rounded-md">
                  <Skeleton height={30} width={100}></Skeleton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
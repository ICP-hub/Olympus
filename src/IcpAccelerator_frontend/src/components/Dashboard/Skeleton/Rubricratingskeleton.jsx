import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Line } from "rc-progress";

export const RubricRatingSkeleton = () => {
  return (
    <section className="bg-gray-100 w-full h-full lg1:px-[4%] py-[2%] px-[5%]">
      <div className="container">
        <div className="flex justify-between  flex-row m-auto mb-[50px]">
          <Skeleton circle={true} height={30} width={30} />

          <Skeleton circle={true} height={30} width={30} />

          <Skeleton circle={true} height={30} width={30} />

          <Skeleton circle={true} height={30} width={30} />

          <Skeleton circle={true} height={30} width={30} />

          <Skeleton circle={true} height={30} width={30} />

          <Skeleton circle={true} height={30} width={30} />

          <Skeleton circle={true} height={30} width={30} />

          <Skeleton circle={true} height={30} width={30} />
        </div>
        <div className="mix-blend-darken bg-[#B9C0F3] text-gray-800 my-4 rounded shadow-md w-full mx-auto p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between cursor-pointer mb-4">
            <h2 className=" flex  text-nowrap mb-4 sm:mb-0 ">
              <Skeleton height={20} width={50} />
              {/* <div className="mx-4 flex items-center w-full">
                {console.log("onSelectLevel 139line ===> ", percentage)}
                <Line
                  strokeWidth={0.5}
                  percent={Number(percentage)}
                  strokeColor="white"
                  className="line-horizontal"
                />
              </div> */}
              <div className="flex-1  rounded-full h-2 relative">
            <Skeleton width="100%" height={10} />
            {/* <Skeleton circle={true} width={20} height={20} className="absolute -top-[6px]" /> */}
          </div>
              {/* <Skeleton height={5} width={850} className='ml-3' /> */}
            </h2>
            <div className="flex items-start w-full sm:w-auto">
              
              <div className=" mx-2">
                <Skeleton height={20} width={50} />
              </div>
              <Skeleton height={20} width={20} />
            </div>
          </div>
          <div>
            <ul className="mb-4 space-y-1 cursor-pointer">
              {[...Array(9)].map((_, index) => (
                <li className="flex py-4 items-center" key={index}>
                  <div className="w-11/12">
                    <div className="flex justify-between items-center py-2 w-full text-white">
                      <div className="flex">
                        <Skeleton height={20} width={20} className="mr-2" />
                        <Skeleton height={20} width={150} />
                      </div>
                      <div className="text-end">
                        <Skeleton
                          height={20}
                          width={20}
                          circle={true}
                          className="ml-2"
                        />
                      </div>
                    </div>
                    <Skeleton height={15} width="80%" className="ml-7" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 pt-0">
            <div className="flex justify-end gap-2">
              <Skeleton height={35} width={100} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

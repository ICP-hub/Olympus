import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export const AdminDashboardCohortSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
      <div className="flex w-auto items-center flex-wrap justify-between bg-white rounded-lg  text-lg p-4 my-4">
        <div className="block lgx:flex w-full rounded-lg lgx:h-96 ">
          <div className="lgx:w-[70%] w-full relative">
            <Skeleton height={375} width="100%" />

            <div className="absolute h-12 w-12 -bottom-1 lgx:top-0 lgx:right-[-8px] right-[20px]"></div>
          </div>
          <div className="lgx:w-[30%] w-full">
            <div className="px-8">
              <div className="w-full mt-2">
                <div className=" flex-col text-[#737373] flex  ">
                  <h1 className="font-bold text-black text-xl truncate capitalize">
                    <div>
                      {" "}
                      <Skeleton height={35} width="100%">
                        {" "}
                      </Skeleton>
                    </div>
                  </h1>
                  <p className="text-sm whitespace-nowrap pt-1  ">
                    <div className="flex space-x-1">
                      <div>
                        <Skeleton height={15} width={65}></Skeleton>
                      </div>

                      <div>
                        {" "}
                        <Skeleton height={15} width={85}></Skeleton>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div>
                        <Skeleton height={15} width={65}></Skeleton>
                      </div>

                      <div>
                        {" "}
                        <Skeleton height={15} width={85}></Skeleton>
                      </div>
                    </div>
                  </p>
                  <p className="text-sm whitespace-nowrap pt-1">
                    <span className="text-black font-bold text-sm">
                      <Skeleton height={25} width="100%"></Skeleton>
                    </span>
                  </p>
                </div>
                <p className="text-[#7283EA] font-semibold">
                  <Skeleton height={15} width="40%"></Skeleton>
                </p>
                <div className="flex w-full py-1">
                  <p className="h-auto truncate text-sm">
                    <Skeleton height={25} width={120}></Skeleton>
                  </p>
                </div>

                <div>
                  <Skeleton height={15} width="60%"></Skeleton>
                  <p className="text-[#7283EA] font-semibold"></p>
                  <div className="flex w-full py-1">
                    <p className="h-auto truncate text-sm">
                      {/* <Skeleton height={20} width="30%"></Skeleton> */}
                      {/* {eligibility} */}
                    </p>
                  </div>
                </div>
                {/* ) : ( */}
                {/* "" */}
                {/* )} */}

                {/* <div className="flex flex-col font-bold">
                <p className="text-[#7283EA]">Eligibility</p>
                <p className="flex text-black w-20">{eligibility}</p>
              </div> */}
                <p className="text-[#7283EA] font-semibold">
                  <Skeleton height={25} width="30%"></Skeleton>
                  {/* Tags */}
                </p>
                <div className="flex gap-2 mt-2 text-xs items-center pb-2">
                  {/* {tags
                  .split(",")
                  .slice(0, 3)
                  .map((tag, index) => (
                    <div
                      key={index}
                      className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100"
                    >
                      {tag.trim()}
                    </div>
                  ))} */}
                  <Skeleton
                    height={15}
                    width={35}
                    className="rounded-xl"
                  ></Skeleton>
                  <Skeleton
                    height={15}
                    width={35}
                    className="rounded-xl"
                  ></Skeleton>
                </div>
                <div className="flex flex-row flex-wrap lg:justify-between md:justify-center space-x-8 mt-2">
                  <div className="flex lg:justify-start gap-4 ">
                    <div className="flex flex-col font-bold">
                      <p className="text-[#7283EA]">
                        <Skeleton height={25} width={100}></Skeleton>
                        {/* Seats */}
                      </p>
                      <p className="text-black whitespace-nowrap text-sm">
                        <Skeleton height={15} width={25}></Skeleton>
                        {/* {no_of_seats} */}
                      </p>
                    </div>
                    <div className="flex flex-col font-bold">
                      <p className="text-[#7283EA]">
                        <Skeleton height={25} width={150}></Skeleton>
                        {/* Application's deadline */}
                      </p>
                      <p className="text-black whitespace-nowrap text-sm">
                        <Skeleton height={15} width={100}></Skeleton>
                        {/* {deadline} */}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-1 mt-2">
                  <div>
                    {" "}
                    <Skeleton height={35} width={100} />
                  </div>

                  <div>
                    {" "}
                    <Skeleton height={35} width={100}></Skeleton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
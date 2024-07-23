import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export const ProjectDocumentSkeleton = () => {
  return (
      <>
      <SkeletonTheme baseColor="#CFD5F3" highlightColor="#c8c8c873">
      <div
              className="group w-[100%] md1:w-[calc(100%/2-10px)] dlg:w-[calc(100%/3-10px)]"
           
            >
              
                <div className="md:m-1 p-4 mb-4 overflow-hidden bg-gradient-to-b from-[#B9C0F2] to-[#B9C0F23B] border-2 border-blue-400 rounded-2xl shadow">
                  <div className="relative">
                    <div className="relative z-10 p-2">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                         <Skeleton height={25} width={100}> </Skeleton>
                         <Skeleton height={25} width={60}> </Skeleton>
                      
                        
                       <br></br>
                      </h5>
                      <p className="font-[450] text-xs text-[#4E5999] py-3 ">
                      <Skeleton height={15} width="90%" count ={4}> </Skeleton>
                      
                      </p>
                      <div>
                        {/* <a
                          href={doc?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        > */}
                          {/* {task} */}
                        {/* </a> */}
                      </div>
                    </div>
                    <div className="absolute opacity-25 w-40 h-40 -left-[85px] -top-[28px] rounded-full bg-gradient-to-b from-[#3C04BA] to-[#4087BF]"></div>
                    <div className="absolute opacity-25 w-40 h-40 -right-[50px] -bottom-[52px] rounded-full bg-gradient-to-r from-[#3C04BA] to-[#4087BF]"></div>
                  </div>
                </div>
               {/* : ( */}
                {/* <div className="md:m-1 p-4 mb-4 bg-gradient-to-b overflow-hidden from-[#B9C0F2] to-[#B9C0F23B] border-2 border-blue-400 rounded-2xl shadow">
                  <div className="relative">
                    <div className="relative z-10 p-2">
                      <div className="-m-4 p-6 inset-0 bg-[#BDC4F3]/30 backdrop-blur-sm flex-col text-center items-center transition-opacity duration-300 ease-in-out opacity-100">
                        <h5 className="mb-2 text-2xl font-bold text-black">
                          Request to see Private Document
                        </h5>
                        <p className="text-base text-white py-4">
                          Request to view Private Data
                        </p>
                      </div>
                    </div>
                    <div className="absolute opacity-25 w-40 h-40 -left-[85px] -top-[28px] rounded-full bg-gradient-to-b from-[#3C04BA] to-[#4087BF]"></div>
                    <div className="absolute opacity-25 w-40 h-40 -right-[50px] -bottom-[52px] rounded-full bg-gradient-to-r from-[#3C04BA] to-[#4087BF]"></div>
                  </div> */}
                </div>
              
            {/* </div> */}
            </SkeletonTheme>
      </>

      
  )}
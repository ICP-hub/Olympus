import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export const MentorCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#D3CFCD" highlightColor="#c8c8c873">
        <div
                // key={index}
                className="flex flex-wrap sm:w-full md:w-full lg:w-1/3 xl:w-1/3 justify-between p-4"
              >
                <div className="w-full p-4">
                  <div className=" relative shadow-md rounded-lg overflow-hidden  drop-shadow-xl gap-2 bg-white h-32 ">
                    <div className=" shadow-md rounded-lg overflow-hidden  drop-shadow-2xl gap-2 bg-blue-200 h-16 ">
                      {/* {socials && ( */}
                        <div className="flex gap-3 justify-end p-4">
                          {/* {linked_in_link && ( */}
                            <div className="w-4 h-4">
                            <Skeleton height={20} width={20} circle={true}/>
                              {/* <a href={linked_in_link} target="_blank"> */}
                                {/* {linkedInSvg} */}
                              {/* </a> */}
                            </div>
                          {/* )} */}
                          {/* {twitter_link && ( */}
                            <div className="w-4 h-4">
                            <Skeleton height={20} width={20} circle={true}/>
                              {/* <a href={linked_in_link} target="_blank"> */}
                                {/* {twitterSvg} */}
                              {/* </a> */}
                            </div>
                          {/* )} */}
                        </div>
                      {/* )} */}
                    </div>
                    <div className=" absolute top-1/2 left-1/5 transform -translate-y-1/2 flex flex-row gap-4 ml-5" >
                      <Skeleton height={65} width={65} circle={true}/>
                      {/* <img
                        className="h-20 w-20 rounded-full border-2 object-cover border-white mt-[-2rem]"
                        src=""
                        alt="Img"
                      /> */}
                     <div class="flex-col flex mt-2 mx-auto">
                        <p className="text-black font-bold tex-lg md:text-xl">
                        <Skeleton height={25} width={130} />
                        </p>
                        <p><Skeleton height={20} width={70} className='mt-2'/></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
    </SkeletonTheme>
  )
}
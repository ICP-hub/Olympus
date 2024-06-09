import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const CommunityRatingSkeleton = () => {
  return (
    <div className="md1:flex sm:flex flex-wrap ">
      <div className="flex w-full sm:w/1/2 md:w-1/3 justify-between">
        <div className="w-full sm:w-full md:w-full p-4">
          <div className="shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-blue-200 p-4 h-full">
            <div className="flex flex-row justify-between flex-wrap">
              <p className="text-lg text-black font-bold">
                <Skeleton height={25} width={200}>
                  {" "}
                </Skeleton>
              </p>
            </div>
            <div className="flex flex-row gap-6 flex-wrap items-center">
              <div>
                <svg style={{ position: "absolute", width: 0, height: 0 }}>
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#FF6347" />
                      <stop offset="100%" stopColor="#32CD32" />
                    </linearGradient>
                  </defs>
                </svg>
                <Skeleton height={55} width={55} circle={true}>
                  {" "}
                </Skeleton>
              </div>
              <div className="flex flex-row justify-center items-center gap-2">
                <div className="flex items-center  w-16 h-16 gap-3">
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return <Skeleton height={25} width={25}></Skeleton>;
                  })}
                </div>
              </div>
            </div>
            <p className="my-2 overflow-y-scroll text-[#737373]">
              <Skeleton height={20} width="90%">
                {" "}
              </Skeleton>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
// import React from "react";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// export const CommunityRatingSkeleton = () => {
//   return (
//     <div className="p-4 border-2 bg-white rounded-lg mb-4">
//       <div className="flex">
//         <div className="flex flex-col">
//           <div className="w-12 h-12">
//             <Skeleton height={55} width={55} circle={true}></Skeleton>
//           </div>
//         </div>
//         <div className="w-full">
//           <div className="flex flex-col w-full pl-4 ">
//             <div className="flex justify-between">
//               <p className="text-gray-500 font-bold">
//                 <Skeleton height={30} width={150}></Skeleton>
//               </p>
//               <p className="text-gray-400 font-thin">
//                 <Skeleton height={25} width={150}></Skeleton>
//               </p>
//             </div>
//             <div className="min-h-4 line-clamp-3 text-gray-400">
//               <p>
//                 <Skeleton height={25} width="20%"></Skeleton>
//               </p>
//             </div>

//             <div className="flex justify-end pt-4">
//               <div className="flex gap-4">
//                 <div className=" px-2 py-1 rounded-md  ">
//                   <Skeleton height={30} width={100}></Skeleton>
//                 </div>

//                 <div className=" px-2 py-1 rounded-md  ">
//                   <Skeleton height={30} width={100}></Skeleton>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

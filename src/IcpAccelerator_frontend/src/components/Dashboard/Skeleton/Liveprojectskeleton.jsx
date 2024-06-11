import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


export const MentorCategorySkeleton = () => {
    return(
        <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
        <div className="p-4 bg-white rounded-lg shadow-lg w-full animate-pulse h-[340px]  ">
          <Skeleton height={140} width="100%" className="rounded-lg" />
          <div className="mt-4">
            <Skeleton height={24} width="60%" />
            <Skeleton height={16} width="80%" className="mt-2" />
            <Skeleton height={16} width="80%" className="mt-2" />
            <Skeleton height={40} width="100%" className="mt-4" />
          </div>
        </div>
      </SkeletonTheme>
    );
};
export const InvestoryCategorySkeleton = () =>{
    return (
        <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
        <div className="p-4 bg-white rounded-lg shadow-lg w-full animate-pulse h-[340px]">
          <Skeleton height={140} width="100%" className="rounded-lg" />
          <div className="mt-4">
            <Skeleton height={24} width="60%" />
            <Skeleton height={16} width="80%" className="mt-2" />
            <Skeleton height={16} width="80%" className="mt-2" />
            <Skeleton height={40} width="100%" className="mt-4 " />
          </div>
        </div>
      </SkeletonTheme>
    );
};

export const CategorySkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
    <div className="p-4 bg-white rounded-lg shadow-lg w-full animate-pulse ">
      <Skeleton height={140} width="100%" className="rounded-lg" />
      <div className="mt-4">
        <Skeleton height={24} width="60%" />
        <Skeleton height={16} width="80%" className="mt-2" />
        <Skeleton height={16} width="80%" className="mt-2" />
        <Skeleton height={40} width="100%" className="mt-4" />
      </div>
    </div>
  </SkeletonTheme>
  );
};

// export const LiveProjectSkeleton = () => {
//   return (
//     <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
//       <div className="justify-between items-baseline flex-wrap bg-white overflow-hidden rounded-lg shadow-lg mb-5 md:mb-0 ">
//         <div className="p-4">
//           <div className="flex justify-between items-baseline flex-wrap w-fit">
//             <div className="flex items-center w-full ml-2 ">
//               <Skeleton circle={true} height={45} width={45} />
//               {/* className="rounded-full w-12 h-12 object-cover border-black border-2 p-1"
//                 src=""
//                 alt="profile" */}

//               <h1 className="ms-2 font-bold text-nowrap truncate w-[220px]">
//                 <Skeleton height={12} width={150} />
//               </h1>
//             </div>
//             <div className="flex items-center ml-5 w-full">
//               <Skeleton circle={true} height={15} width={15} />
//               {/* <img
//                 className="h-7 w-7 rounded-full mr-2 object-cover"
//                 src=""
//                 alt="not found"
//               /> */}
//               <p className="text-base truncate w-1/2 ml-2">
//                 <Skeleton height={12} width={120} />
//               </p>
//             </div>
//           </div>
          
//           <p className="text-gray-700 text-sm p-2  min-h-48 break-all min-w-16 line-clamp-6 sxxs:w-11/12">
//             <Skeleton count={4} height={12} width={220} />
          
//           </p>

          
//           <>
//             <Skeleton height={33} width={246} />
//           </>
//         </div>
//       </div>
//     </SkeletonTheme>
//   );
// };


export const LiveProjectSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
      <div className="justify-between items-baseline flex-wrap bg-white overflow-hidden rounded-lg shadow-lg mb-5 md:mb-0 p-4 py-7 lg:ml-2">
        <div className="flex justify-between items-center flex-wrap w-full">
          <div className="flex items-center w-full mb-4 sm:mb-0">
            <Skeleton circle={true} height={45} width={45} />
            <h1 className="ms-2 font-bold truncate w-[220px] sm:w-[250px] lg:w-[300px]">
              <Skeleton height={12} width="100%" />
            </h1>
          </div>
          <div className="flex items-center w-full mt-2 ml-3 sm:mt-0">
            <Skeleton circle={true} height={15} width={15} />
            <p className="text-base truncate ml-2 w-[150px] sm:w-[180px] lg:w-[200px]">
              <Skeleton height={12} width="90%" />
            </p>
          </div>
        </div>
        <div className="text-gray-700 text-sm min-h-48 break-all line-clamp-6 w-full sm:w-11/12 lg:w-full">
          <Skeleton count={4} height={12} width="100%" />
        </div>
        <div className="mt-4">
          <Skeleton height={33} width="100%" />
        </div>
      </div>
    </SkeletonTheme>
  );
};

// export default LiveProjectSkeleton;




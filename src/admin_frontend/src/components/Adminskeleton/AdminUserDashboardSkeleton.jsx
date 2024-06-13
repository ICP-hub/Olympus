import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


export const AdminUserDashboardSkeleton = ({itemsPerPage}) => {
  return (
    <div className="flex flex-col bg-white rounded-lg p-8 text-lg overflow-auto mb-8">
    <div className="min-w-[600px]">
      <table className="w-full table-fixed">
        <thead className="border-b-2 border-gray-300">
          <tr className="text-left text-xl font-fontUse uppercase">
            <th className="w-24 pb-2">S.No</th>
            <th className="w-1/4 pb-2">NAME</th>

            <th className="w-1/4 pb-2">ROLE</th>
            <th className="w-1/4 pb-2">COUNTRY</th>

            <th className="w-1/4 pb-2">TELEGRAM</th>
            <th className="w-1/4 pb-2">ACTION</th>
          </tr>
        </thead>
        <tbody className="text-base text-gray-700 font-fontUse">
          {[...Array(itemsPerPage)].map((_, index) => (
            <tr key={index} className="hover:bg-gray-100 cursor-pointer mt-1">
              <td>
                <Skeleton height={30} width={30} />
                {/* {(currentPage - 1) * itemsPerPage + index + 1} */}
              </td>
              <td className="py-2 ">
                <div className="flex items-center">
                  <Skeleton height={40} width={40} circle={true} />
                  
                  <div className="ml-2">
                    <Skeleton height={30} width={120} />
                    {/* {user.fullName} */}
                  </div>
                </div>
              </td>
              <td>
                {/* {filterOption === "Users"
              ? user.approvedType
              : user.hub} */}
              <Skeleton height={30} width="40%" />
              </td>
              <td>
                <Skeleton height={30} width="40%" />
                {/* {user.country} */}
              </td>
              <td className="truncate max-w-xs">
                <Skeleton height={30} width="60%" />
              </td>
              <td>
               
                
              
              <div className="flex ">
                <Skeleton height={30} width={30}  />
              <div className="ml-2"><Skeleton height={30}  width={30}  />
              </div>
              </div>
              </td>
              <td>
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>


  )}
import React from 'react'

const EventRequset = ({index,img,name,role,request,description,cohort_name,accepted_at,request_status,rejected_at,activeTab,handleOpenModal}) => {
  return (
    <div
    className="p-4 border-2 bg-white rounded-lg mb-4"
    key={index}
  >
  {/* {console.log('img',img)} */}
    <div className="flex">
      <div className="flex flex-col">
        <div className="w-12 h-12">
          <img
            src={img}
            alt="img"
            className="object-cover rounded-full h-full w-full"
          />
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col w-full pl-4 ">
          <div className="flex justify-between">
            <p className="flex">
            <p className="text-gray-500 font-bold">{name}</p>
          <div className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5] w-fit ml-2">{role}</div>
          </p>
            <p className="text-gray-400 font-thin">
              {request}
            </p>
          
          </div>
          <div className="min-h-4 line-clamp-3 text-gray-400">
            <p>{description}</p>
          </div>
          <div className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5] w-fit mt-3">{cohort_name}</div>

           {activeTab === "approved" &&
          accepted_at &&
          accepted_at.trim() !== "" ? (
            <>
              <div className="flex justify-between pt-2">
                <p className="text-green-700 capitalize">
                  {request_status || ""}
                </p>
                <p className="text-gray-400 font-thin">
                  {accepted_at}
                </p>
              </div>
            </>
          ) : (
            ""
          )}
          {activeTab === "declined" &&
          rejected_at &&
          rejected_at.trim() !== "" ? (
            <>
              <div className="flex justify-between pt-2">
                <p className="text-red-700 capitalize">
                  {request_status || ""}
                </p>
                <p className="text-gray-400 font-thin">
                  {rejected_at}
                </p>
              </div>
            </>
          ) : (
            ""
          )} 
          <div className="flex justify-end pt-4">
            <div className="flex gap-4">
              {activeTab !== "pending" ? (
                ""
              ) : (
                <>
                  <div>
                    <button
                      onClick={() =>
                        handleOpenModal(
                          "Are you sure you want to reject request?",
                          "Reject",
                          index
                        )
                      }
                      className="capitalize border-2 font-semibold bg-red-700 border-red-700 text-white px-2 py-1 rounded-md  hover:text-red-900 hover:bg-white"
                    >
                      Reject
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        handleOpenModal(
                          "Are you sure you want to approve request?",
                          "Approve",
                          index
                        )
                      }
                      className="capitalize border-2 font-semibold bg-blue-900 border-blue-900 text-white px-2 py-1 rounded-md  hover:text-blue-900 hover:bg-white"
                    >
                      Approve
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default EventRequset
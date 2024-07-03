import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const AdminDashboardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873">
      <>
        <div className="px-[4%] py-[4%] w-full h-auto flex lg:flex-row flex-col justify-between lg:space-x-6">
          <div className="flex flex-col lg:w-9/12 w-full">
            <div className="w-full flex lg:flex-row flex-col justify-between">
              <div className="w-full  flex lg:flex-row flex-col  gap-4">
                <div className="rounded-[2rem] flex justify-center flex-col h-[200px] w-full bg-[#B9C0F2] drop-shadow-xl border-2">
                  <div className="absolute bottom-0 left-0 w-36 h-40 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-800 ellipse-quarter-left rounded-[2rem]"></div>
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-100 to-purple-700 w-28 h-28 ellipse-quarter-right rounded-[2rem]"></div>

                  <div className="flex flex-col items-center justify-start font-bold text-lg text-white z-10">
                    <p className="flex justify-start">
                      {" "}
                      <Skeleton baseColor="#ADB1E6" height={30} width={100} />
                      {/* Cycles Pending */}
                    </p>
                    <p className="font-extrabold -[59px] h-[62px] text-white flex justify-center xl:lg:text-5xl text-2xl">
                      <Skeleton baseColor="#ADB1E6" height={25} width={200} />
                      {/* {cycles.toLocaleString()} */}
                    </p>
                  </div>
                </div>
                <div
                  // onClick={() => navigate("/live")}
                  className="rounded-[2rem] cursor-pointer flex justify-center  flex-col h-[200px] w-full bg-[#B9C0F2] drop-shadow-xl border-2"
                >
                  <div className="absolute bottom-0 left-0 w-36 h-40 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-800 ellipse-quarter-left rounded-[2rem]"></div>
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-100 to-purple-700 w-28 h-28 ellipse-quarter-right rounded-[2rem]"></div>

                  <div className="flex flex-col items-center justify-start font-bold text-lg text-white z-10">
                    <p className="flex justify-start">
                      {" "}
                      <Skeleton baseColor="#ADB1E6" height={30} width={100} />
                      {/* Live Projects */}
                    </p>
                    <p className="font-extrabold -[59px] h-[62px] text-white flex justify-center xl:lg:text-5xl text-2xl">
                      <Skeleton baseColor="#ADB1E6" height={25} width={30} />
                      {/* {totalLive} */}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex lg:flex-row flex-col  w-full lg:mt-6  mt-2 justify-between gap-2 lg:gap-0 lg:space-x-4">
              <div
                className="rounded-[1rem] space-x-2 cursor-pointer flex px-4   justify-center  flex-col  w-full  bg-white  drop-shadow-xl border-2 "
                // onClick={() => navigate("/request")}
              >
                <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
                  <div className="gap-2 flex-row flex items-center w-2/3">
                    {/* <img src={pending} alt="pending" className="h-10 w-10" /> */}
                    <Skeleton height={30} width={30} circle={true} />

                    <p className="flex font-semibold justify-between text-sm">
                      <Skeleton height={25} width={180} />
                      {/* Registration Requests */}
                    </p>
                  </div>
                  <p className="font-extrabold  w-1/3 text-2xl h-[62px] flex  justify-center items-center">
                    <Skeleton height={25} width={25} />
                    {/* {totalPending} */}
                  </p>
                </div>
              </div>

              <div
                className="rounded-[1rem] space-x-2 flex px-4   justify-center cursor-pointer  flex-col  w-full  bg-white  drop-shadow-xl border-2 "
                // onClick={() => navigate("/allUpdateRequest")}
              >
                <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
                  <div className="gap-2 flex-row flex items-center w-2/3">
                    <Skeleton height={30} width={30} circle={true} />
                    {/* {bellSvg} */}
                    <p className="flex font-semibold justify-between text-sm">
                      <Skeleton height={25} width={180} />
                      {/* Updation Requests */}
                    </p>
                  </div>
                  <p className="font-extrabold  w-1/3 text-2xl h-[62px] flex  justify-center items-center">
                    <Skeleton height={25} width={25} />
                    {/* {totalUpdate} */}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex lg:flex-row flex-col  w-full mt-2 justify-between gap-2 lg:gap-0 lg:space-x-4">
              <div className="rounded-[1rem] px-4 space-x-2 flex  justify-center cursor-pointer  flex-col  w-full  bg-white drop-shadow-xl border-2">
                <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
                  <div
                    // onClick={() => navigate("/alluser")}
                    className="gap-2 flex flex-row items-center w-2/3"
                  >
                    {" "}
                    <Skeleton height={30} width={30} circle={true} />
                    {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#007BFF"
                  className="w-10 h-10"
                >
                  <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
                </svg> */}
                    <p className="flex font-semibold justify-start text-sm">
                      <Skeleton height={25} width={100} />
                      {/* All Users */}
                    </p>
                  </div>
                  <p className="font-extrabold -[59px] w-1/3 h-[62px] flex  text-2xl justify-center items-center">
                    {/* {totalUser} */}
                    <Skeleton height={25} width={25} />
                  </p>
                </div>
              </div>

              <div
                className="rounded-[1rem] px-4 space-x-2 flex justify-center  flex-col  w-full  bg-white drop-shadow-xl border-2"
                // onClick={() => navigate("/request")}
              >
                <div className="flex  flex-row  flex-wrap justify-around  font-bold text-lg text-black items-center ">
                  <div className="gap-2 flex flex-row items-center w-2/3">
                    <Skeleton height={30} width={30} circle={true} />
                    {/* {userSvg} */}
                    <p className="flex justify-start text-sm">
                      {" "}
                      <Skeleton height={25} width={100} />
                      {/* Users */}
                    </p>
                  </div>
                  <p className="w-1/3 font-extrabold -[59px] h-[62px] flex  text-2xl justify-center items-center">
                    {/* {onlyUser} */}
                    <Skeleton height={25} width={25} />
                  </p>
                </div>
              </div>

              <div
                // onClick={() => navigate("/live")}
                className="rounded-[1rem] space-x-2 flex px-4   justify-center cursor-pointer flex-col  w-full  bg-white drop-shadow-xl border-2 "
              >
                <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
                  <div className="gap-2 flex-row flex items-center w-2/3">
                    <Skeleton height={30} width={30} circle={true} />
                    {/* <img src={founder} alt="founder" className="h-10 w-10" /> */}
                    <p className="flex font-semibold justify-start text-sm">
                      <Skeleton height={25} width={100} />
                      {/* Projects */}
                    </p>
                  </div>
                  <p className="font-extrabold -[59px] h-[62px] flex  text-2xl justify-center w-1/3 items-center">
                    {/* {projectCount} */}
                    <Skeleton height={25} width={25} />
                  </p>
                </div>
              </div>
            </div>

            <div className="flex lg:flex-row flex-col  w-full lg:mb-6 mb-2  mt-2 justify-between gap-2 lg:gap-0 lg:space-x-4 ">
              <div className="rounded-[1rem]  space-x-2 flex px-4  justify-center  flex-col  w-full  bg-white drop-shadow-xl border-2">
                <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
                  <div className="gap-2 flex flex-row items-center w-2/3">
                    <Skeleton height={30} width={30} circle={true} />
                    {/* <img src={mentor} alt="mentors" className="h-10 w-10" /> */}
                    <p className="flex font-semibold justify-start text-sm">
                      {/* Mentors */}
                      <Skeleton height={25} width={100} />
                    </p>
                  </div>
                  <p className="w-1/3 font-extrabold h-[62px] flex  text-2xl justify-center items-center">
                    {/* {mentorCount} */}
                    <Skeleton height={25} width={25} />
                  </p>
                </div>
              </div>

              <div className="rounded-[1rem] space-x-2 flex  px-4    justify-center  flex-col  w-full  bg-white drop-shadow-xl border-2 ">
                <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
                  <div className="gap-2 flex-row flex items-center w-2/3">
                    <Skeleton height={30} width={30} circle={true} />
                    {/* <img src={vc} alt="founder" className="h-10 w-10" /> */}
                    <p className="flex font-semibold justify-start text-sm">
                      <Skeleton height={25} width={100} />
                      {/* Investors */}
                    </p>
                  </div>
                  <p className="font-extrabold w-1/3 h-[62px] flex  text-2xl justify-center items-center">
                    <Skeleton height={25} width={25} />
                    {/* {vcCount} */}
                  </p>
                </div>
              </div>

              <div
                // onClick={() => navigate("/cohortRequest")}
                className="rounded-[1rem] space-x-2 flex px-4 cursor-pointer justify-center  flex-col  w-full  bg-white  drop-shadow-xl border-2 "
              >
                <div className="flex  flex-row  flex-wrap justify-around font-bold text-lg text-black items-center ">
                  <div className="gap-2 flex-row flex items-center w-2/3">
                    {/* <img src={proj} alt="proj" className="h-10 w-10" /> */}
                    <Skeleton height={30} width={30} circle={true} />
                    <p className="flex font-semibold cursor-pointer justify-between text-sm">
                      <Skeleton height={25} width={100} />
                      {/* Cohorts */}
                    </p>
                  </div>
                  <p className="font-extrabold  w-1/3 text-2xl h-[62px] flex  justify-center items-center">
                    <Skeleton height={25} width={25} />{" "}
                    {/* {cohortData ? cohortData.length : 0} */}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex bg-white shadow-md w-full mt-2 rounded-[1rem] px-[4%] lg:h-[478px] h-auto">
              <div className="flex flex-col w-full">
                <div className="flex flex-row items-center justify-between w-full my-3">
                  <h2 className="text-lg font-extrabold text-transparent bg-gradient-to-r from-purple-900 to-blue-500 bg-clip-text">
                    <Skeleton height={30} width={180} />
                    {/* Pending Requests */}
                  </h2>
                  {/* <button */}
                  {/* // onClick={() => navigate("/request")} */}
                  {/* className="bg-[#7283EA] hover:bg-transparent hover:text-[#7283EA] border-2 hover:border-[#293162] px-4 text-white text-xs font-bold rounded-md flex-shrink-0 py-2" */}
                  {/* > */}
                  <Skeleton height={30} width={120} />
                  {/* View More */}
                  {/* </button> */}
                </div>

                <div className="overflow-y-auto">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="overflow-y-auto">
                      <div className="flex flex-row flex-wrap w-full items-center justify-between mb-2 text-sm border p-2 rounded-lg border-gray-200">
                        <div className="lg:space-x-4 lg:flex-nowrap flex-wrap flex flex-row items-center lg:justify-around justify-start w-full">
                          <Skeleton height={50} width={50} circle={true}>
                            {" "}
                          </Skeleton>
                          <div className="flex flex-col lg:ml-0 ml-4 justify-around items-start">
                            <p className="font-extrabold truncate text-sm">
                              <Skeleton height={25} width={80}>
                                {" "}
                              </Skeleton>
                              {/* {item.name} */}
                            </p>
                            <p className="lg:text-[9px] text-[8px] items-center rounded-xl text-white px-2">
                              <Skeleton height={25} width={80}>
                                {" "}
                              </Skeleton>
                              {/* {item.requestedFor} */}
                            </p>
                          </div>
                          <p className="truncate lg:mt-0 lg:mb-4 mt-2 text-xs overflow-hidden text-ellipsis group-hover:text-left">
                            <Skeleton height={25} width={80}>
                              {" "}
                            </Skeleton>
                            {/* {item.sender} */}
                          </p>
                          <p className="text-blue-600 text-xs flex flex-row lg:mb-4">
                            <span className="text-gray-500 size-4 mr-2">
                              <Skeleton height={25} width={80}>
                                {" "}
                              </Skeleton>
                              {/* <DateSvg /> */}
                            </span>
                            <span className="font-bold">
                              {/* {item.timestamp} */}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* main side vala yha se h  */}
          <div className="flex flex-col lg:w-3/12 w-full space-y-6">
            <div className="flex flex-col justify-between shadow-md rounded-3xl bg-white mt-4 lg:mt-0  w-full h-[300px] px-[2%] overflow-y-auto">
              <div className="p-4">
                <h1 className="font-bold mb-2">
                  <Skeleton height={20} width="50%">
                    {" "}
                  </Skeleton>
                  {/* Top Projects */}
                </h1>

                <div className="w-full cursor-pointer mb-4 flex flex-col ">
                  <div className="flex flex-col justify-between border border-gray-200 rounded-xl pt-3 px-[2%]">
                    <div className="flex justify-between items-start ">
                      <div className="flex items-center">
                        <Skeleton
                          height={55}
                          width={55}
                          className="rounded-xl"
                        ></Skeleton>

                        <div className="pl-2">
                          <p
                            className="text-[13px] font-bold text-black flex justify-between "
                            // title={item.full_name}
                          >
                            {/* {truncateEllipsis(item.full_name)} */}
                            <Skeleton height={20} width={100}>
                              {" "}
                            </Skeleton>
                            <Skeleton
                              height={20}
                              width={20}
                              circle={true}
                              className="ml-[5px] "
                            >
                              {" "}
                            </Skeleton>
                          </p>
                          <p className="truncate overflow-hidden lg:w-32 w-24 whitespace-nowrap text-[10px] text-gray-400">
                            {/* {item.country} */}{" "}
                            <Skeleton height={12} width="30%">
                              {" "}
                            </Skeleton>
                          </p>

                          <div className="flex flex-row gap-1">
                            <Skeleton height={20} width={20} circle={true}>
                              {" "}
                            </Skeleton>

                            <p className="text-[12px] text-gray-500 hover:text-clip mt-1">
                              {/* {truncateWithEllipsis(item.code)} */}
                              <Skeleton height={15} width={40}>
                                {" "}
                              </Skeleton>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex rounded-b-xl flex-row justify-between items-center mt-2 px-2 py-1 mb-[2px]">
                      <div className="flex flex-row space-x-2 text-[10px] text-black overflow-x-auto">
                        <div className="flex rounded-2xl flex-row justify-between items-center space-x-2 mb-[16px]">
                          {/* {item.area_of_interest.split(",").map((area, i) => ( */}
                          <p>
                            <Skeleton
                              height={15}
                              width={25}
                              className="rounded-xl"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="flex flex-col md:w-3/12 w-full space-y-6"> */}
            <div className="flex flex-col justify-between shadow-md rounded-3xl bg-white mt-4 lg:mt-0  w-full h-[300px] px-[2%] overflow-y-auto">
              <div className="p-4">
                <h1 className="font-bold mb-2">
                  <Skeleton height={20} width="50%">
                    {" "}
                  </Skeleton>
                  {/* Top Projects */}
                </h1>

                <div className="w-full cursor-pointer mb-4 flex flex-col ">
                  <div className="flex flex-col justify-between border border-gray-200 rounded-xl pt-3 px-[2%]">
                    <div className="flex justify-between items-start ">
                      <div className="flex items-center">
                        <Skeleton height={55} width={55} className="rounded-xl">
                          {" "}
                        </Skeleton>

                        <div className="pl-2">
                          <p
                            className="text-[13px] font-bold text-black flex justify-between "
                            // title={item.full_name}
                          >
                            {/* {truncateEllipsis(item.full_name)} */}
                            <Skeleton height={20} width={100}>
                              {" "}
                            </Skeleton>
                            <Skeleton
                              height={20}
                              width={20}
                              circle={true}
                              className="ml-[5px] "
                            >
                              {" "}
                            </Skeleton>
                          </p>
                          <p className="truncate overflow-hidden lg:w-32 w-24 whitespace-nowrap text-[10px] text-gray-400">
                            {/* {item.country} */}{" "}
                            <Skeleton height={12} width="30%">
                              {" "}
                            </Skeleton>
                          </p>

                          <div className="flex flex-row gap-1">
                            <Skeleton height={20} width={20} circle={true}>
                              {" "}
                            </Skeleton>

                            <p className="text-[12px] text-gray-500 hover:text-clip mt-1">
                              {/* {truncateWithEllipsis(item.code)} */}
                              <Skeleton height={15} width={40}>
                                {" "}
                              </Skeleton>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex rounded-b-xl flex-row justify-between items-center mt-2 px-2 py-1 mb-[2px]">
                      <div className="flex flex-row space-x-2 text-[10px] text-black overflow-x-auto">
                        <div className="flex rounded-2xl flex-row justify-between items-center space-x-2 mb-[16px]">
                          {/* {item.area_of_interest.split(",").map((area, i) => ( */}
                          <p>
                            <Skeleton
                              height={15}
                              width={25}
                              className="rounded-xl"
                            />
                          </p>

                          {/* {area.trim()} */}
                          {/* </p> */}
                          {/* ))} */}
                        </div>
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* )) */}
                {/* : ( */}
                <div className="flex justify-center items-center h-full w-full"></div>
              </div>
            </div>

            {/* <div className="flex flex-col lg:w-3/12 w-full space-y-6"> */}
            <div className="flex flex-col justify-between shadow-md rounded-3xl bg-white mt-4 lg:mt-0  w-full h-[300px] px-[2%] overflow-y-auto">
              <div className="p-4">
                <h1 className="font-bold mb-2">
                  <Skeleton height={20} width="50%">
                    {" "}
                  </Skeleton>
                  {/* Top Projects */}
                </h1>

                <div className="w-full cursor-pointer mb-4 flex flex-col ">
                  <div className="flex flex-col justify-between border border-gray-200 rounded-xl pt-3 px-[2%]">
                    <div className="flex justify-between items-start ">
                      <div className="flex items-center">
                        <Skeleton height={55} width={55} className="rounded-xl">
                          {" "}
                        </Skeleton>

                        <div className="pl-2">
                          <p
                            className="text-[13px] font-bold text-black flex justify-between "
                            // title={item.full_name}
                          >
                            {/* {truncateEllipsis(item.full_name)} */}
                            <Skeleton height={20} width={100}>
                              {" "}
                            </Skeleton>
                            <Skeleton
                              height={20}
                              width={20}
                              circle={true}
                              className="ml-[5px] "
                            >
                              {" "}
                            </Skeleton>
                          </p>
                          <p className="truncate overflow-hidden lg:w-32 w-24 whitespace-nowrap text-[10px] text-gray-400">
                            {/* {item.country} */}{" "}
                            <Skeleton height={12} width="30%">
                              {" "}
                            </Skeleton>
                          </p>

                          <div className="flex flex-row gap-1">
                            <Skeleton height={20} width={20} circle={true}>
                              {" "}
                            </Skeleton>

                            <p className="text-[12px] text-gray-500 hover:text-clip mt-1">
                              {/* {truncateWithEllipsis(item.code)} */}
                              <Skeleton height={15} width={40}>
                                {" "}
                              </Skeleton>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex rounded-b-xl flex-row justify-between items-center mt-2 px-2 py-1 mb-[2px]">
                      <div className="flex flex-row space-x-2 text-[10px] text-black overflow-x-auto">
                        <div className="flex rounded-2xl flex-row justify-between items-center space-x-2 mb-[16px]">
                          {/* {item.area_of_interest.split(",").map((area, i) => ( */}
                          <p>
                            <Skeleton
                              height={15}
                              width={25}
                              className="rounded-xl"
                            />
                          </p>

                          {/* {area.trim()} */}
                          {/* </p> */}
                          {/* ))} */}
                        </div>
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* )) */}
                {/* : ( */}
                <div className="flex justify-center items-center h-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    </SkeletonTheme>
  );
};

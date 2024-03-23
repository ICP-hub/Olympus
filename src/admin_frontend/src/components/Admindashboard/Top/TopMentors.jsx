import React from "react";
import ment from "../../../../../IcpAccelerator_frontend/assets/images/ment.jpg";
import project from "../../../../../IcpAccelerator_frontend/assets/images/project.png";
import p2 from "../../../../../IcpAccelerator_frontend/assets/Founders/p2.png";

const dummyData = [
  {
    id: 1,
    logo: p2,
    name: "Builder.fi",
    description: "Q&A marketplace built on...",
    code: "0x2085...016B",
  },
  {
    id: 2,
    logo: p2,
    name: "Project 2",
    description: "Description for project 2",
    code: "0x2085...016C",
  },
  {
    id: 3,
    logo: p2,
    name: "Project 3",
    description: "Description for project 33333333333333333333333",
    code: "0x2085...016Cbbbbbbbbbbbbbbbbbbbb",
  },
  {
    id: 4,
    logo: p2,
    name: "Project 4",
    description: "Description for project 4",
    code: "0x2085...016C",
  },
];
const TopMentors = () => {
  function truncateWithEllipsis(str, startLen = 3, endLen = 3) {
    if (str.length <= startLen + endLen) {
      return str;
    }
    const start = str.substring(0, startLen);
    const end = str.substring(str.length - endLen);
    return `${start}...${end}`;
  }
  return (
    // <div className="">
    <div className="flex flex-col justify-between shadow-md rounded-3xl bg-white mt-4 md:mt-0  w-full h-[300px] px-[2%] overflow-y-auto">
      <div className="">
        <div className="p-4">
          <h1 className="font-bold mb-2">Top Mentors</h1>
          {dummyData?.map((item) => (
            <div key={item.id} className="w-full mb-2 flex flex-col">
              <div className="flex flex-col justify-between border border-gray-200 rounded-xl pt-3 px-[2%]">
                <div className="flex justify-between items-start ">
                  <div className="flex items-center">
                    <img
                      className="object-fill rounded-md h-16 w-16"
                      src={p2}
                      alt="p2 logo"
                    />
                    <div className="ml-2">
                      <p className="text-[13px] font-bold text-black">
                        {item.name}
                      </p>
                      <p
                        className="truncate overflow-hidden whitespace-nowrap text-[10px] text-gray-400"
                        style={{ maxHeight: "4.5rem" }}
                      >
                        {truncateWithEllipsis(item.description)}
                      </p>

                      <div className="flex flex-row gap-1">
                        <img
                          className="object-fill h-4 w-4 rounded-full"
                          src={item.logo}
                          alt="p2 logo"
                        />
                        <p className="text-[12px] text-gray-500 hover:text-clip">
                          {truncateWithEllipsis(item.code)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#5B21B6"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="flex rounded-b-xl flex-row justify-between items-center mt-2 px-2 py-1 bg-gray-200">
                  <div className="flex flex-row space-x-2 text-[10px] text-black">
                    <p>. DAO</p>
                    <p>. Infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ))} */}
    </div>
    // </div>
  );
};

export default TopMentors;

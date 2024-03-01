import React, { useState, useEffect } from "react";
import project from "../../../assets/images/project.png";
// import ment from "../../../assets/images/ment.jpg";
// import btn from "../../../assets/Comprehensive/upote.png";
import { useSelector } from "react-redux";
import { Line } from "rc-progress";

const dummyData = [
  {
    id: 1,
    logo: project,
    name: "Builder.fi",
    description: "Q&A marketplace built on...",
    code: "0x2085...016B",
  },
  {
    id: 2,
    logo: project,
    name: "Project 2",
    description: "Description for project 2",
    code: "0x2085...016C",
  },
  {
    id: 3,
    logo: project,
    name: "Project 3",
    description:
      "Description for project3333333333333333333333 3ssssssssssssssssssssss ssssssssssssssssssssssssssss ssssssssssssssssssssssssss",
    code: "0x2085...016Cbbbbbbbbbbbbbbbbbbbb",
  },
  {
    id: 4,
    logo: project,
    name: "Project 4",
    description: "Description for project 4",
    code: "0x2085...016C",
  },
  {
    id: 5,
    logo: project,
    name: "Project 5",
    description: "Description for project 5",
    code: "0x2085...016C",
  },
  {
    id: 6,
    logo: project,
    name: "Project 6",
    description: "Description for project 6",
    code: "0x2085...016C",
  },
];

const ListedProjects = () => {
  const role = useSelector((currState) => currState.current.specificRole);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (role) {
      console.log(role);
      if (
        role === "Mentor" ||
        role === "VC" ||
        role === "ICPHubOrganizer" ||
        role === "Founder"
      ) {
        console.log("role", role);
        setShow(true);
      } else {
        setShow(false);
      }
    }
  }, [role]);

  function truncateWithEllipsis(str, startLen = 3, endLen = 3) {
    if (str.length <= startLen + endLen) {
      return str;
    }
    const start = str.substring(0, startLen);
    const end = str.substring(str.length - endLen);
    return `${start}...${end}`;
  }

  return (
    <div className="w-full flex flex-row md:flex-nowrap flex-wrap rounded-md text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[13.5px] md:text-[14px.3] md1:text-[14px] md2:text-[14px] md3:text-[14px] lg:text-[16.5px] dlg:text-[17px] lg1:text-[15.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px]  my-10 box-shadow-blur  bg-gradient-black-transparent">
      <div className="flex flex-wrap -mx-4 gap-3 px-4">
        {dummyData?.map((item) => (
          <div key={item.id} className="md:w-[300px] w-full mb-8 flex flex-col">
            <div className="flex flex-col justify-between border border-gray-300 rounded-xl pt-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    className="object-fill rounded-full h-12 w-12 ml-4"
                    src={project}
                    alt="Project logo"
                  />
                  <div className="ml-2">
                    <p className="text-[16px] font-extrabold text-black">
                      {item.name}
                    </p>
                    <p
                      className="truncate overflow-hidden whitespace-nowrap text-[10px] text-gray-400"
                      style={{ maxHeight: "4.5rem" }}
                    >
                      {truncateWithEllipsis(item.description)}
                    </p>
                  </div>
                </div>
              </div>
              <p
                className="text-[10px] px-4 pt-3 text-gray-400 overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.description}
              </p>

              {show && (
                <div className="flex items-center w-full mt-4 px-2">
                  <div className="relative flex-grow  h-2  rounded-lg bg-gradient-to-r from-gray-100 to-black"></div>
                  <p className="text-xs ml-2">level 9</p>
                </div>
              )}

              {/* <Line
              strokeWidth={0.2}
              percent={percent}
              strokeColor="transparent"
              className="line-vertical md:line-horizontal"
            /> */}

              <div className="w-full px-8 my-5 border-t-2 border-gray-300"></div>

              <div className="flex flex-row justify-between items-center px-4 pb-4 ">
                <img
                  className="object-fill h-5 w-5 rounded-full"
                  src={item.logo}
                  alt="Project logo"
                />
                <button className="rounded-sm h-8 w-16 mr-4 border border-gray-300 flex justify-center items-center">
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform transform hover:scale-150"
                    >
                      <path
                        d="M3.04007 0.934606C3.44005 0.449652 4.18299 0.449652 4.58298 0.934606L6.79207 3.61298C7.33002 4.26522 6.86608 5.24927 6.02061 5.24927H1.60244C0.756969 5.24927 0.293022 4.26522 0.830981 3.61298L3.04007 0.934606Z"
                        fill="#737373"
                      />
                    </svg>
                    <span className="text-black text-[10px] font-semibold">
                      {" "}
                      10
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListedProjects;

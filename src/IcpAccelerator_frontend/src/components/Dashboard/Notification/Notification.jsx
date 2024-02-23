import React from "react";
import Sidebar from "../../Layout/SidePanel/Sidebar";
import project from "../../../../assets/images/project.png";
import Bottombar from "../../Layout/BottomBar/Bottombar";
import Footer from "../../Footer/Footer";
import p5 from "../../../../assets/Founders/p5.png";
const Notification = () => {
  return (
    <section className="overflow-hidden relative">
      <div className="w-[1279.64px] h-[1279.64px] opacity-70 bg-fuchsia-800 rounded-full blur-[169px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="font-fontUse flex flex-row w-full h-fit px-[5%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gradient-to-br from-purple-800 from-10% via-purple-600 via-60%   to-violet-900 to-95%">
        <div className="w-2/8 hidden md:block z-1 relative">
          <Sidebar />
        </div>
        <div className="flex flex-grow ml-8 text-white z-1 relative">
          <div className=" flex flex-col w-full ">
            <div className="w-full pr-6 ">
              <div className="flex flex-row justify-between">
                <h1 className="font-bold text-3xl">Notification</h1>
                <button className="font-bold">
                  <svg
                    width="18"
                    height="24"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Delete">
                      <path
                        id="Rectangle 980"
                        d="M9.71484 2.98047L9.37916 8.41073C9.29339 9.79813 9.25051 10.4918 8.90275 10.9906C8.73082 11.2371 8.50945 11.4453 8.25272 11.6016C7.73349 11.918 7.03846 11.918 5.64841 11.918C4.25653 11.918 3.56059 11.918 3.041 11.6011C2.78411 11.4444 2.56267 11.2359 2.3908 10.9889C2.04315 10.4894 2.00121 9.7947 1.91734 8.40534L1.58984 2.98047"
                        stroke="white"
                        stroke-linecap="round"
                      />
                      <path
                        id="Vector"
                        d="M10.5273 2.98047H0.777344"
                        stroke="white"
                        stroke-linecap="round"
                      />
                      <path
                        id="Vector_2"
                        d="M7.84852 2.98079L7.47874 2.21798C7.23311 1.71127 7.11029 1.45791 6.89843 1.2999C6.85144 1.26485 6.80168 1.23367 6.74964 1.20667C6.51504 1.08496 6.23349 1.08496 5.67037 1.08496C5.09312 1.08496 4.80449 1.08496 4.566 1.21178C4.51314 1.23988 4.4627 1.27232 4.41521 1.30876C4.20089 1.47317 4.08118 1.7358 3.84175 2.26106L3.51367 2.98079"
                        stroke="white"
                        stroke-linecap="round"
                      />
                      <path
                        id="Line 5"
                        d="M4.29883 8.93945L4.29883 5.68945"
                        stroke="white"
                        stroke-linecap="round"
                      />
                      <path
                        id="Line 6"
                        d="M7.00586 8.93945L7.00586 5.68945"
                        stroke="white"
                        stroke-linecap="round"
                      />
                    </g>
                  </svg>
                </button>
              </div>

              <div className="flex flex-row gap-4 mt-3">
                <p className="font-bold">New</p>
                <p className="md:ml-8 ml-6">Important</p>
              </div>

              <div className="flex flex-row items-center gap-4 mt-4">
                <div className="md:w-3.5 w-10 h-3.5 rounded-sm border border-white"></div>
                <img
                  className="md:w-10 md:h-10 h-8 w-8  rounded-full object-cover"
                  src={p5}
                  alt="p5"
                />
                <div className="justify-between flex-col flex">
                  <p className="font-bold">Mona Lisa</p>
                  <p className="text-xs ">
                    PANONY was established in March 2018 with operations in
                    Greater China, South Korea and the U.S. Both founders are
                    Forbes Asia 30 under 30 honorees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <Footer />
      </div>

      <div className="md:hidden">
        <Bottombar />
      </div>
    </section>
  );
};

export default Notification;

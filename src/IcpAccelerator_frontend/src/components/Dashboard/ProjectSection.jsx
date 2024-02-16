import * as React from "react";
import project from "../../../assets/images/project.png";

export const ProjectSection = () => (
 
  <div className="w-full flex flex-row md:flex-nowrap flex-wrap rounded-md text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[13.5px] md:text-[14px.3] md1:text-[14px] md2:text-[14px] md3:text-[14px] lg:text-[16.5px] dlg:text-[17px] lg1:text-[15.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] border md:border-none border-gray-200 my-2 px-2 box-shadow-blur bg-gradient-white-transparent">
    <div className="flex flex-wrap">
      <img
        className="mt-5 object-contain"
        src={project}
        alt="Project visualization"
      />
      <div className="ml-4 mt-5 md:w-3/6  w-6/6 flex flex-col flex-wrap justify-between ">
        <p className="hidden md:block">
          PANONY was established in March 2018 with operations in Greater China,
          South Korea.
        </p>
        <div className="flex flex-row">
          <p className="font-bold">Samy Karim</p>
          <p className="ml-3 text-gray-300">
            Toshi, Managing Partner. Ex-Binance
          </p>
        </div>
      </div>
      <div className="flex items-start py-4 md:py-5">
        <button
          type="button"
          className="focus:outline-none text-white border border-white bg-transparent focus:ring-4 focus:ring-white font-medium rounded-lg text-[14px] px-4 py-2 me-2 mb-2 flex items-center"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="grid"
            role="img"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="svg-inline--fa fa-grid fa-lg"
          >
            <path
              fill="currentColor"
              d="M0 72C0 49.9 17.9 32 40 32H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V72zM0 232c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V232zM128 392v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40zM160 72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V72zM288 232v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM160 392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V392zM448 72v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM320 232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V232zM448 392v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40z"
            ></path>
          </svg>
          <span className="ml-2 text-nowrap">View more</span>
        </button>
        <button
          type="button"
          className="focus:outline-none text-white border border-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-[14px] px-4 py-2 me-2 mb-2 flex items-center"
        >
          <svg
            aria-hidden="true"
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7572 0.614048C10.0992 -0.404325 8.65133 0.00479463 7.78132 0.657341C7.42459 0.924899 7.24623 1.05868 7.14134 1.05862C7.03644 1.05855 6.85824 0.924559 6.50184 0.656571C5.63261 0.00297944 4.18525 -0.407882 2.52605 0.608497C0.34854 1.94238 -0.146646 6.34695 4.87194 10.0662C5.82782 10.7746 6.30576 11.1288 7.13528 11.1293C7.9648 11.1298 8.44316 10.7762 9.3999 10.0689C14.423 6.35571 13.9331 1.95055 11.7572 0.614048Z"
              fill="white"
            />
          </svg>
          <span className="ml-2">Upvote</span>
        </button>
      </div>
    </div>
  </div>
);

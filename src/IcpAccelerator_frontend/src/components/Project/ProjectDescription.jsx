import React from "react";
import ProjectLikedPeople from "./ProjectLikedPeople";
import project from "../../../assets/images/project.jpg";

function ProjectDescription() {
  return (
    <div>
      <div className="w-full flex justify-between items-center mb-10">
        <div className="my-8 w-[50%]">
          <p>
            An experience on #ICP The first digital vending machine for random
            art distribution. Art Donation Wallet: Id
          </p>
          <div className="w-full text-white relative ">
            <ProjectLikedPeople />
          </div>
        </div>
        <div className="w-[50%]">
          <div className="relative w-[50%] float-right">
            <img
              src={project}
              alt="project"
              className="w-full h-auto z-10 rounded-lg relative"
            />
            <div className="absolute rounded-full -bottom-2 -left-2">
              <svg
                width="146"
                height="143"
                viewBox="0 0 146 143"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M-0.492264 10.1665C-0.492264 4.64367 3.98991 0.131747 9.50047 0.500001C25.3275 1.55768 40.8968 5.12276 55.594 11.0758C73.3755 18.278 89.5323 28.8346 103.142 42.1427C116.751 55.4507 127.547 71.2497 134.912 88.6376C140.971 102.941 144.611 118.09 145.712 133.49C146.105 138.999 141.591 143.482 136.068 143.482L9.50772 143.482C3.98488 143.482 -0.492264 139.005 -0.492264 133.482V10.1665Z"
                  fill="url(#paint0_linear_68_8049)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_68_8049"
                    x1="-147.053"
                    y1="143.482"
                    x2="146.068"
                    y2="143.482"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7283EA" stop-opacity="0.4" />
                    <stop offset="1" stop-color="#BD78EA" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute rounded-full -top-2 -right-2">
              <svg
                width="79"
                height="77"
                viewBox="0 0 79 77"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M78.8205 67.1699C78.8205 72.6927 74.3261 77.234 68.8456 76.5513C51.5943 74.4021 35.4465 66.7211 23.0176 54.5673C10.6421 42.4658 2.80127 26.7589 0.564579 9.97129C-0.164811 4.49683 4.38047 -1.52588e-05 9.90332 -1.52588e-05L68.8205 -2.28882e-05C74.3434 -2.28882e-05 78.8205 4.47713 78.8205 9.99998V67.1699Z"
                  fill="url(#paint0_linear_68_8048)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_68_8048"
                    x1="-0.0966797"
                    y1="-4.02915e-05"
                    x2="157.738"
                    y2="-4.03093e-05"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7283EA" stop-opacity="0.4" />
                    <stop offset="1" stop-color="#BD78EA" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="text-[#737373] text-[15px] leading-4">
        <div className="mb-10">
          <div className="w-full flex justify-between items-center my-6">
            <p className="font-bold">About this launch</p>
            <button className="bg-[#3505B2] text-white py-[7px] px-[9px] rounded-md text-xs">
              Follow for updates
            </button>
          </div>
          <div>
            <p className="font-[950] mb-2">Beep! - New Era for Collaboration</p>
            <p className="font-[450] mb-6">
              Point out Anything on the Web & Share Feedback in Seconds
            </p>
            <p className="mb-4">
              Beep! 2.0 by Beep! - New Era for Collaboration⚡️ was hunted by{" "}
              <span className="underline">Roberto Pérez</span> in{" "}
              <span className="underline">Chrome Extensions</span>, Design
              Tools, Productivity. Made by{" "}
              <span className="underline">Maryna Filatenko</span>,{" "}
              <span className="underline">Roberto Pérez</span>,{" "}
              <span className="underline">Farid Sukurov</span> and{" "}
              <span className="underline">Abbas</span>. Featured on December
              22nd, 2023.{" "}
              <span className="underline">
                Beep! - New Era for Collaboration⚡️
              </span>{" "}
              is rated <span className="underline">4.9/5 ★</span> by 13 users.
              It first launched on January 23rd, 2023.
            </p>
          </div>
        </div>
        <hr />
        <div className="flex flex-col">
          <div className="mt-2">
            <table className="text-center">
              <tr>
                <th className="p-2">Upvotes</th>
                <th className="p-2">Comments</th>
                <th className="p-2">Day rank</th>
                <th className="p-2">Week rank</th>
              </tr>
              <tr>
                <td className="p-2">712</td>
                <td className="p-2">437</td>
                <td className="p-2">#1</td>
                <td className="p-2">#6</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDescription;

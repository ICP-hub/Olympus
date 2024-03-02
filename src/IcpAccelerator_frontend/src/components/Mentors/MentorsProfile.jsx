import React from "react";
import { checktab, location, star, star2 } from "../Utils/Data/SvgData";
import MentorCard from "./MentorCard";

function MentorsProfile() {
  return (
    <div className="px-[4%] w-full bg-gray-100 overflow-y-scroll">
      <div className="border-b border-[#DCDCDC] pb-4">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div
              className="relative p-1 bg-blend-overlay w-[85px] rounded-full bg-no-repeat bg-center bg-cover"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                backdropFilter: "blur(20px)",
              }}
            >
              {" "}
              <img
                className="rounded-full object-cover w-20 h-20"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                alt="img"
              />
            </div>
            <div className="text-[15px] leading-4 flex items-center bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 ml-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.87358 1.72209L7.75349 3.49644C7.87347 3.74343 8.19344 3.98035 8.46341 4.02572L10.0582 4.29288C11.0781 4.46426 11.3181 5.2103 10.5832 5.94625L9.34331 7.19636C9.13333 7.40807 9.01835 7.81637 9.08334 8.10873L9.4383 9.65625C9.71827 10.8812 9.07334 11.355 7.99846 10.7148L6.50362 9.82259C6.23365 9.66129 5.7887 9.66129 5.51373 9.82259L4.0189 10.7148C2.94902 11.355 2.29909 10.8761 2.57906 9.65625L2.93402 8.10873C2.99901 7.81637 2.88402 7.40807 2.67405 7.19636L1.43418 5.94625C0.704266 5.2103 0.93924 4.46426 1.95913 4.29288L3.55395 4.02572C3.81892 3.98035 4.13889 3.74343 4.25887 3.49644L5.13878 1.72209C5.61872 0.759304 6.39864 0.759304 6.87358 1.72209Z"
                  stroke="#7283EA"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <spna>Top mentor</spna>
            </div>
          </div>
          <div>
            <button className="bg-transparent border border-[#3505B2] text-[#3505B2] text-xs font-[950] px-2 py-1 rounded-md">
              Get in touch
            </button>
          </div>
        </div>
        <div className="md:flex block w-full md:w-[60%]">
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-[950]">Mentor name</h3>
            <div>
              <p className="text-[15px] leading-4 flex-wrap">
                <span className="underline">
                  Senior SRE/Chaos Engineer/Speaker @ 
                </span>
                Talend
              </p>
              <p className="text-[#737373]">
                Site Reliability Engineer and DevOps Mentor
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h6 className="text-[15px] font-[450]">Skills</h6>
            <div className="text-[15px] leading-4 flex items-center ">
              <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline ">
                SRE
              </spna>
              <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline ml-2">
                Observability
              </spna>
              <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline ml-2">
                Kubernetes
              </spna>
            </div>
            <p>+ 14 more</p>
          </div>
        </div>
        <div className="text-[#737373] text-xs my-4">
          <div className="flex items-center m-2">
            {location}
            <h6 className="undeline ml-2">France</h6>
          </div>
          <div className="flex items-center m-2">
            {star2}
            <h6 className="ml-2">Active yesterday</h6>
          </div>
          <div className="flex items-center m-2">
            {checktab}
            <h6 className="ml-2">Usually responds in a few hours</h6>
          </div>
        </div>
      </div>
      <div>
        <div className="border-b border-[#DCDCDC] pb-4">
          <h4 className="text-xl font-[950]">About</h4>
          <div className="text-[#737373] text-[15px] leading-4">
            <p className="line-clamp-2 sm:line-clamp-none">
              Akram RIAHI is an Site Reliability Engineer (SRE) with an interest
              in all things Cloud Native. He is passionate about kubernetes
              resilience and chaos engineering at scale and is Litmus Chaos
              leader. A curator of quality tech content, he is the author of
              several blog posts and organizer of the "Chaos Week" a week-long
              chaos engineering fest with great speakers aimed at cloud-native
              community in France.
            </p>
            <p>
              he is also a speaker in many global events such as conf42,
              chaosCarnival, Devoxx france ...
            </p>
            <p className="text-[#000] underline">Read more</p>
          </div>
        </div>
        <div className="border-b border-[#DCDCDC] pb-4">
          <h4 className="text-xl font-[950]">What mentees say</h4>
          <div className="space-y-4">
            <div className="flex relative -left-5 -top-2">
              <div className="flex-1 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                <div className="space-y-4 ">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <img
                        className="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                        src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 px-1 py-2 sm:px-2 sm:py-4 leading-relaxed text-[#737373] text-base">
                      <span className="font-bold underline">
                        Farid Sukurov <span className="font-normal">@farid_sukurov</span>
                      </span>
                      <div className="text-sm sm:text-base text-black">
                      <p>Hey guys, I am one of the makers!</p>
                      <p className="line-clamp-2 sm:line-clamp-none">We have been working hard on Beep and actually have done testing to make sure 4x faster is a real number and not a lie. We have analyzed people doing reviews with Beep and without Beep and it is actually 3-4x faster on average. Would be happy to hear your feedback! :)</p>
                      <p>Upvote(21) Share <span className="underline">Dec 22</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex relative -left-5 -top-2">
              <div className="flex-1 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                <div className="space-y-4 ">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <img
                        className="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                        src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 px-1 py-2 sm:px-2 sm:py-4 leading-relaxed text-[#737373] text-base">
                      <span className="font-bold underline">
                        Farid Sukurov <span className="font-normal">@farid_sukurov</span>
                      </span>
                      <div className="text-sm sm:text-base text-black">
                      <p>Hey guys, I am one of the makers!</p>
                      <p className="line-clamp-2 sm:line-clamp-none">We have been working hard on Beep and actually have done testing to make sure 4x faster is a real number and not a lie. We have analyzed people doing reviews with Beep and without Beep and it is actually 3-4x faster on average. Would be happy to hear your feedback! :)</p>
                      <p>Upvote(21) Share Dec 22</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="border-[#3505B2] border text-[#3505B2] py-[7px] rounded-md px-[9px] text-xs font-[950]">
            Load more
          </button>
        </div>
        <div className="border-b border-[#DCDCDC] pb-4">
          <h4 className="text-xl font-[950]">Skills</h4>
          <div className="text-[15px] leading-4 flex items-center flex-wrap">
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              SRE
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Observability
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Kubernetes
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              SRE
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Observability
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Kubernetes
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              SRE
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Observability
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Kubernetes
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              SRE
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Observability
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Kubernetes
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              SRE
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Observability
            </spna>
            <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              Kubernetes
            </spna>
          </div>
        </div>
        <div className="my-8">
          <h4 className="text-xl font-[950]">Similar mentors</h4>
          <MentorCard />
          <MentorCard />
        </div>
      </div>
    </div>
  );
}

export default MentorsProfile;

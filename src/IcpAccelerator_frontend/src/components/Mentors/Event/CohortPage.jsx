import React from "react";
import hover from "../../../../assets/images/1.png";

function CohortPage() {
  return (
    <section className="bg-gray-100 w-full h-full lg1:px-[4%] py-[2%] px-[5%]">
      <div className="container">
        <p className="text-lg font-semibold text-indigo-900 inline-block ">
          Events
        </p>

        <div className="container">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="flex justify-between p-8">
              <div className="w-1/2">
                <p className="font-extrabold text-xl">
                  Incrypted Pitch Session I
                </p>
                <div className="pt-2">
                  <h4 className="font-extrabold py-2">EVENT PROGRAM</h4>
                  <ul className="list-disc px-6 list-outside text-[#737373]">
                    <li>
                      Groundbreaking Seed-Stage Start-Ups have the chance to
                      showcase the core functionality of their initiative and
                      the value they bring to the industry
                    </li>
                    <li>
                      Each showcase lasts 5 min and is presented in real-time
                      through a pitch format combined with video material of a
                      Demo
                    </li>
                    <li>5 min Showcase + 5 min AMA</li>
                    <li>
                      To participate, apply
                      here: https://forms.gle/HWK9fvT4rvnLgGrz5
                    </li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h4 className="font-extrabold py-2">SHOWCASING REWARDS</h4>
                  <ul className="list-disc px-6 list-outside text-[#737373]">
                    <li>
                      The event fosters applications and synergies through:
                    </li>
                    <li>Media outreach</li>
                    <li>Community growth</li>
                    <li>Strategic one-on-one meetings with foundations</li>
                    <li>VCs and Angels Optional grants</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h4 className="font-extrabold py-2">JUDGE PROCEDURE</h4>
                  <ul className="list-disc px-6 list-outside text-[#737373]">
                    <li>
                      Esteemed VCs and Angels critically judge showcases at the
                      event and distribute votes to all participants for the
                      DemoDay Leaderboard
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-1/2 right-text">
                <div className="w-4/5">
                  <div>
                    <img
                      className="h-full object-cover rounded-2xl w-full"
                      src={hover}
                      alt="not found"
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center mt-2">
                    <div className="flex flex-row flex-wrap lg:justify-between md:justify-center space-x-8">
                      <div className="flex lg:justify-start text-left gap-4 ">
                        <div className="flex flex-col font-bold">
                          <p className="text-[#7283EA]">Date</p>
                          <p className="text-black whitespace-nowrap">
                            25 Apr 2024
                          </p>
                        </div>
                        <div class="text-2xl">•</div>
                        <div className="flex flex-col font-bold">
                          <p className="text-[#7283EA]">Time</p>
                          <p className="text-black">7:30 pm</p>
                        </div>
                        <div class="text-2xl">•</div>
                        <div className="flex flex-col font-bold">
                          <p className="text-[#7283EA]">Duration</p>
                          <p className="text-black">60 min</p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex justify-center items-center">
                      <div className="flex justify-center items-center">
                        <button className="uppercase w-full bg-[#3505B2] text-white  px-4 py-2 rounded-md  items-center font-extrabold text-sm">
                          Register now Accept
                        </button>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CohortPage;

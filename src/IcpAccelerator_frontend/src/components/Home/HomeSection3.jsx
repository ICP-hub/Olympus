import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import Rocket from "../../../assets/images/Rocket1.png";
import RocketSmall from "../../../assets/images/RocketSmall.png";
import ProgressCard from "../Common/ProgressCard";
import b1 from "../../../assets/Comprehensive/b1.png";
import b2 from "../../../assets/Comprehensive/b2.png";
import b3 from "../../../assets/Comprehensive/b3.png";
import b4 from "../../../assets/Comprehensive/b4.png";
import SubmitSection from "../Footer/SubmitSection";

const HomeSection3 = () => {
  return (
    <section className="text-gray-700 body-font relative bg-gray-100 ">
      <div className="w-full h-full px-[4%] lg1:px-[5%] pt-12">
        {/* <div className="w-[1051.41px] h-[1051.41px] left-[-396.97px] top-[706px] absolute opacity-60 bg-fuchsia-800 rounded-full blur-[411.40px]"></div> */}
        {/* <div className="absolute -mt-[526px] -ml-[526px] w-[1051px] h-[1051px] rotate-[0.034deg] flex-shrink-0 rounded-full opacity-60 bg-gradient-to-r from-[#8D3494] to-[#4B0FAC] blur-[205.7px] z-10"></div> */}
        {/* <div className="w-[424.57px] h-[424.57px] left-[-211.74px] top-0 absolute opacity-60 bg-fuchsia-800 rounded-full blur-[326px]"></div> */}
        {/* <div
          className="absolute bottom-[-1100px] left-1/2 transform -translate-x-1/2 w-[2105.733px] h-[2105.733px] flex-shrink-0 rounded-[2105.733px] opacity-70 bg-[linear-gradient(138deg,_#FFD682_40.24%,_#D377A6_49.28%,_#9B67A8_84.31%)] blur-[357.3500061035156px]"
          style={{ transform: "translateX(-50%) rotate(0.034deg)" }}
        ></div> */}
        {/* <div
          className="w-[425px] h-[425px] flex-shrink-0 rounded-full opacity-60 bg-gradient-to-r from-purple-700 to-indigo-900 blur-[163px] absolute bottom-[-75px] left-[-180px] z-10"
          style={{ transform: "rotate(0.034deg)" }}
        ></div> */}

        {/* <div className="w-full sxxs:h-[4495px] sxs:h-[4505px] sxs1:h-[4734px] sxs2:h-[4525px] sxs3:h-[4535px] ss:h-[4543px] ss1:h-[4480px] ss2:h-[4458px] ss3:h-[4392px] ss4:h-[4130px] dxs:h-[4030px] xxs:h-[3889px] xxs1:h-[3837px] sm1:h-[3753px] sm4:h-[3721px] sm2:h-[3712px] sm3:h-[3550px] sm:h-[2799px] md:h-[2811px] md1:h-[2774p] md2:h-[2805px] md3:h-[2763px] lg:h-[2821px] dlg:h-[2779px] lg1:h-[2666px] lgx:h-[2344px] dxl:h-[2214px] xl:h-[2344px] xl2:h-[2344px] bg-gradient-to-t from-gray-100 via-gray-100 to-gray-100 opacity-0 mix-blend-soft-light"></div> */}

        {/* <div className="w-[820.11px] h-[820.11px] opacity-60 bg-fuchsia-800 rounded-full blur-[412.90px] absolute bottom-[-500.08px] right-[-200.08px]"></div> */}

        {/* <div className="text-white text-[64px] font-black font-fontUse leading-[81.28px] mb-8 z-20">
                Ready to take the plunge?
              </div>
              <div className="w-[296px] h-[66px] mb-16 p-4 bg-white rounded-[5px] justify-center items-center gap-2.5 inline-flex">
                <div className="text-center text-violet-800 text-[28px] font-fontUse uppercase font-extrabold">
                  Get Accelerated
                </div>
              </div>
              <ProgressCard /> */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[34px] md1:text-[45px] md2:text-[50px] font-black font-fontUse dxl:text-[64px] text-center">
            Our comprehensive offerings
          </div>
          <div className="flex justify-center mt-8 w-full">
            <img className="absolute h-[1300px] w-fit" src={Rocket} />
            <div className="w-full">
              <div className="w-full float-left">
                <div className="w-fit h-fit top-[1102px] left-[310px] rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-4xl px] font-extrabold uppercase w-[255px] mb-3 truncate text-wrap font-fontUse text-start">
                    Token Economy
                  </div>
                  <div className="w-[251px] lg:w-[325px] text-gray-600 text-xl font-bold truncate text-wrap text-start">
                    It decides the future of the project. We help you with logic
                    and modelling.
                  </div>
                </div>
              </div>
              <div className="w-full float-right right-text relative -left-[80px] -top-[100px]">
                <div className="w-fit h-fit rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className=" bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-4xl px] font-extrabold uppercase w-[455px] mb-3 truncate text-wrap font-fontUse text-start">
                    Smart Contract and Security
                  </div>
                  <div className="w-[450px] lg:w-[425px] text-gray-600 text-xl font-bold truncate text-wrap text-start">
                    We provide guidance in building a safe product quickly. A
                    single hack can destroy your venture.
                  </div>
                </div>
              </div>
              <div className="w-full float-left -top-[130px] relative">
                <div className="w-fit h-fit left-[180px] rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-4xl px] font-extrabold uppercase w-[355px] mb-3 truncate text-wrap font-fontUse text-start">
                    Incorporation and Legal
                  </div>
                  <div className=" w-[251px] lg:w-[450px] text-gray-600 text-xl font-bold  truncate text-wrap text-start">
                    Your legal structure is an essential component of your
                    strategy. In this unpredictable international law system,
                    you need clarity.
                  </div>
                </div>
              </div>
              <div className="w-full float-right right-text relative -left-[80px] -top-[200px]">
                <div className="w-fit h-fit rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className=" bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-4xl px] font-extrabold uppercase w-[455px] mb-3 truncate text-wrap font-fontUse text-start">
                    Fundraising
                  </div>
                  <div className=" w-[251px] lg:w-[450px] text-gray-600 text-xl font-bold  truncate text-wrap text-start">
                    We cover all the fundraising <br></br>aspects, from pitch
                    <br></br>polishing to demo day.
                  </div>
                </div>
              </div>
              <div className="w-full float-left -top-[250px] relative">
                <div className="w-fit h-fit  left-[185px] rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-4xl px] font-extrabold uppercase w-[255px] mb-3 truncate text-wrap font-fontUse text-start">
                    Marketing and Community
                  </div>
                  <div className=" w-[251px] lg:w-[450px] text-gray-600 text-xl font-bold  truncate text-wrap text-start">
                    We help you to build and engage your community. No
                    community, no party.
                  </div>
                </div>
              </div>
              <div className="w-full float-right right-text relative -left-[100px] -top-[350px]">
                <div className="w-fit h-fit rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className=" bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-4xl px] font-extrabold uppercase w-[455px] mb-3 truncate text-wrap font-fontUse text-start">
                    Launching Your Token
                  </div>
                  <div className=" w-[251px] lg:w-[450px] text-gray-600 text-xl font-bold  truncate text-wrap text-start">
                    The price market action depends on many factors, from your
                    token launch (on cex or dex) to your market maker. Let our
                    experts guide you.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden p-4 text-white">
          <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[34px] md1:text-[45px] md2:text-[50px] font-black font-fontUse dxl:text-[64px]">
            Our comprehensive offerings
          </div>
          <div className="md:flex flex-row justify-between items-start p-8">
            <div className="md:w-1/2 space-y-12 z-10 w-full">
              <div className="flex flex-col space-y-8">
                <div className="w-full h-fit rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold uppercase w-fit mb-3 truncate text-wrap font-fontUse text-start">
                    Token Economy
                  </div>
                  <div className="text-gray-600 text-sm font-bold truncate text-wrap text-start">
                    It decides the future of the project. We help you with logic
                    and modelling.
                  </div>
                </div>
                <div className="w-full h-fit rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className=" bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold uppercase w-fit  mb-3 truncate text-wrap font-fontUse text-start">
                    Smart Contract and Security
                  </div>
                  <div className="text-gray-600 text-sm font-bold truncate text-wrap text-start">
                    We provide guidance in building a safe product quickly. A
                    single hack can destroy your venture.
                  </div>
                </div>
                <div className="w-full h-fit rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold uppercase w-fit  mb-3 truncate text-wrap font-fontUse text-start">
                    Incorporation and Legal
                  </div>
                  <div className="text-gray-600 text-sm font-bold truncate text-wrap text-start">
                    Your legal structure is an essential component of your
                    strategy. In this unpredictable international law system,
                    you need clarity.
                  </div>
                </div>
                <div className="w-full h-fit rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className=" bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-2xl  font-extrabold uppercase w-fit  mb-3 truncate text-wrap font-fontUse text-start">
                    Fundraising
                  </div>
                  <div className=" text-gray-600 text-sm font-bold truncate text-wrap text-start">
                    We cover all the fundraising aspects, from pitch polishing
                    to demo day.
                  </div>
                </div>
                <div className="w-full h-fit rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold uppercase w-fit  mb-3 truncate text-wrap font-fontUse text-start">
                    Marketing and Community
                  </div>
                  <div className="text-gray-600 text-sm font-bold truncate text-wrap text-start">
                    We help you to build and engage your community. No
                    community, no party.
                  </div>
                </div>
                <div className="w-full h-fit rounded-lg shadow-custom p-8 bg-transparent  drop-shadow-2xl sticky z-10 backdrop-blur-sm">
                  <div className=" bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold uppercase w-fit  mb-3 truncate text-wrap font-fontUse text-start">
                    Launching Your Token
                  </div>
                  <div className="text-gray-600 text-sm font-bold truncate text-wrap text-start">
                    The price market action depends on many factors, from your
                    token launch (on cex or dex) to your market maker. Let our
                    experts guide you.
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2">
              <img
                src={RocketSmall}
                alt="Rocket"
                className="h-[900px] w-[850px] md:object-contain"
              />
            </div>
            <div className="flex justify-center">
              <div
                className="md:hidden bg-no-repeat bg-contain w-full h-full absolute -top-[200px] ss4:-top-[1100px] dxs:-top-[1000px] xxs:-top-[950px] xxs1:-top-[800px] sm1:-top-[200px] sm4:-top-[650px] sm2:-top-[600px] sm3:-top-[215px] sm:-top-[25px] -z-10 blur-0"
                style={{
                  backgroundImage: `url(${Rocket})`,
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="w-fit mb-9 bg-clip-text text-transparent bg-gradient-to-r from-violet-900 to-sky-600  text-[42px] font-fontUse font-extrabold ">
            Ready To Get Accelerated ?<br /> Join Our Ecosystem Today !
          </div>
          <div className="text-gray-600 text-[36px] font-fontUse font-normal mb-6 w-fit">
            Support | Be a part of the Symbiote Ecosystem
          </div>

          <div className="flex flex-wrap justify-between items-center w-full sm:space-y-8 z-20">
            <div className="relative">
              <div className="flex flex-col justify-between w-60 h-fit bg-white rounded-2xl shadow overflow-hidden md:w-60 md:h-fit">
                <div className="flex justify-center flex-grow">
                  <img className="p-8 mb-2" src={b1} alt="Rocket Image" />
                </div>
                <div className=" text-center  w-auto text-2xl font-bold text-white bg-indigo-300 p-4">
                  Take your project ahead
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-60 h-fit flex-col justify-between md:w-60 md:h-fit bg-white rounded-2xl shadow overflow-hidden  flex">
                <div className="flex justify-center flex-grow">
                  <img className="p-8 mb-2" src={b2} />
                </div>
                <div className="w-auto text-center text-white bg-indigo-300 p-4 text-2xl font-fontUse font-bold">
                  Become a Partner
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex flex-col justify-between w-60 h-fit bg-white rounded-2xl shadow overflow-hidden md:w-60 md:h-fit">
                <div className="flex justify-center flex-grow">
                  <img className="p-8 mb-2" src={b3} alt="Rocket Image" />
                </div>
                <div className=" text-center  w-auto text-2xl font-bold text-white bg-indigo-300 p-4">
                  Invest <br></br>with us
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex flex-col justify-between w-60 h-fit bg-white rounded-2xl shadow overflow-hidden md:w-60 md:h-fit">
                <div className="flex justify-center flex-grow">
                  <img className="p-8 mb-2" src={b4} alt="Rocket Image" />
                </div>
                <div className=" text-center  w-auto text-2xl font-bold text-white bg-indigo-300 p-4">
                  Mentor our Projects
                </div>
              </div>
            </div>
          </div>
        </div>
        <SubmitSection />
      </div>
    </section>
  );
};

export default HomeSection3;

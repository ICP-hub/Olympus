import React, { useEffect } from "react";
import Header from "../Layout/Header/Header";
import Sidebar from "../Layout/SidePanel/Sidebar";
import { ProjectSection } from "./ProjectSection";
import SearchForm from "./SearchForm";
import VideoScroller from "./VideoScroller";
import Founder from "./Founder";
import Partners from "./Partners";
import Footer from "../Footer/Footer";
import Bottombar from "../Layout/BottomBar/Bottombar";
import { useSelector } from "react-redux";

const DashBoard = () => {
  const actor = useSelector((currState) => currState.actors.actor);


  console.log('actor in dashboard =>', actor)
  
  useEffect(() => {
    const founderDataFetchHandler = async () => {
      const founderDataFetch = await actor.get_founder_info_caller();

      console.log("dekho dekho founder data aaya => ", founderDataFetch)
    };

    founderDataFetchHandler()
  }, [actor]);



  return (
    <section className="overflow-hidden relative">
      {/* <Header gradient="bg-gradient-to-r from-purple-800 from-10% via-purple-700 via-60%   to-purple-600 to-90%" /> */}
      <div className="w-[1279.64px] h-[1279.64px] opacity-70 bg-fuchsia-800 rounded-full blur-[169px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="font-fontUse flex flex-row w-full h-fit px-[5%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gradient-to-br from-purple-800 from-10% via-purple-600 via-60%   to-violet-900 to-95%">
        <div className="w-full z-1">
          <SearchForm />
          <div className="flex">
            <div className="w-2/8 relative hidden md:block">
              <Sidebar />
            </div>
            <div className="w-full ml-8 text-white relative">
              <h1 className="font-bold text-3xl">All Projects</h1>
              <div className="relative">
                <ProjectSection />
                <ProjectSection />
                <ProjectSection />
                <ProjectSection />
              </div>
              <div className="mt-6 flex justify-center relative">
                <button className="ocus:outline-none text-white border border-white bg-transparent focus:ring-4 focus:ring-white font-medium rounded-lg text-[14px] px-4 py-2 me-2 mb-2">
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[1805.43px] h-[1805.43px] bg-gradient-to-br from-amber-200 via-pink-400 to-zinc-400 rounded-full blur-[883.80px] absolute right-[670px] -bottom-[490px]"></div>
      </div>
      <div className="bg-gradient-to-t from-violet-900  to-gray-100 h-full relative">
        <div className="md:ml-32 ml-8 pt-4 font-extrabold  bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-sky-400 ">
          <h1 className="text-3xl">25 hours of lectures</h1>
          <h1 className="text-3xl">40 hours of 1:1 work</h1>
        </div>
        <p className="md:ml-32 mx-8 md:mt-3 mt-4 text-violet-900">
          During the program, we will equip you with the tools and techniques
          you need to succeed.
        </p>
        <VideoScroller />
        <Founder />
        <h1 className="flex text-center justify-center pt-2 px-4 pb-8 text-white">
          We believe in your potential and are ready to deploy capital through
          the Accelerator program
        </h1>
      </div>

      <div className="md:hidden">
        <Bottombar />
        <div className="relative">
          <Footer />
        </div>
      </div>
    </section>
  );
};

export default DashBoard;

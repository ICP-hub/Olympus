import React from "react";
import Header from "../../Layout/Header/Header";
import Sidebar from "../../Layout/SidePanel/Sidebar";
import project from "../../../../assets/images/project.png";
import Bottombar from "../../Layout/BottomBar/Bottombar";
import Footer from "../../Footer/Footer";

const ProfileEdit = () => {
  return (
    <section className="overflow-hidden relative">
      {/* <Header gradient="bg-gradient-to-r from-purple-800 from-10% via-purple-700 via-60%   to-purple-600 to-90%" /> */}
      <div className="w-[1279.64px] h-[1279.64px] opacity-70 bg-fuchsia-800 rounded-full blur-[169px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="font-fontUse flex flex-row w-full h-fit px-[5%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gradient-to-br from-purple-800 from-10% via-purple-600 via-60%   to-violet-900 to-95%">
        <div className="w-2/8 hidden md:block z-1 relative">
          <Sidebar />
        </div>
        <div className="flex flex-grow ml-8 text-white z-1 relative">
          <div className=" flex md:flex-row flex-col w-full ">
            <div className="md:w-4/6 pr-6 w-6/6  ">
              <h1 className="font-bold text-3xl">Edit Project</h1>
              <form className="mt-4">
                <label htmlFor="name" className="text-md">
                  Name of your project
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block mb-2 py-1 font-semibold px-2 w-full rounded-sm text-white bg-[rgba(200,200,202,0.5)] caret-black focus:outline-none focus:border-white"
                  placeholder="Enter Name"
                  required
                />
                <label htmlFor="Tagline" className="text-md ">
                  Tagline
                </label>
                <input
                  type="text"
                  name="Tagline"
                  id="Tagline"
                  className="block mb-2 py-1 font-semibold px-2 w-full rounded-sm text-white bg-[rgba(200,200,202,0.5)] caret-black focus:outline-none focus:border-white"
                  placeholder="Enter tagline"
                  required
                />
                <label htmlFor="name" className="text-md ">
                  Name of your project
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block mb-2 py-1 font-semibold px-2 w-full rounded-sm text-white bg-[rgba(200,200,202,0.5)] caret-black focus:outline-none focus:border-white"
                  placeholder="Enter Name"
                  required
                />
                <label htmlFor="url" className="text-md ">
                  Project URL
                </label>
                <input
                  type="url"
                  name="url"
                  id="url"
                  className="block mb-2 py-1 font-semibold px-2 w-full rounded-sm text-white bg-[rgba(200,200,202,0.5)] caret-black focus:outline-none focus:border-white"
                  placeholder="https://"
                  required
                />
                <label htmlFor="description" className="text-md ">
                  Description
                </label>
                <textarea
                  type="text"
                  name="description"
                  id="description"
                  className="block mb-2 py-1 h-48 font-semibold px-2 w-full rounded-sm text-white bg-[rgba(200,200,202,0.5)] caret-black focus:outline-none focus:border-white"
                  placeholder="About your launch"
                  required
                />
                <label htmlFor="telegram" className="text-md ">
                  Telegram
                </label>
                <input
                  type="url"
                  name="telegram"
                  id="telegram"
                  className="block mb-2 py-1 font-semibold px-2 w-full rounded-sm text-white bg-[rgba(200,200,202,0.5)] caret-black focus:outline-none focus:border-white"
                  placeholder="Enter link"
                  required
                />
              </form>
            </div>
            <div className="md:w-2/6 w-6/6  mt-12 flex flex-col h-auto">
              <p className="mb-2 md:mb-1">Add images/videos</p>

              <div className="border rounded-sm h-full ">
                <div className="py-2 px-2">
                  <img src={project} alt="Project" />
                </div>
              </div>
              <div className="flex flex-row-reverse mt-6">
                <button
                  type="button"
                  className="text-gray-900 border focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-2.5 text-center me-2 mb-2 bg-white"
                >
                  Submit
                </button>
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

export default ProfileEdit;

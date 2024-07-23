import React from "react";
import Profile from "../../../assets/images/Ellipse 1382.svg";

const ProjectDiscussion = () => {
  return (
    <section className="bg-gray-100 px-8">
    <div className="w-full h-[190px]  bg-[#B9C0F3] rounded-md border border-white my-8 relative z-10 px-8">
        <div className="p-8 z-10 relative">
          <div className="flex items-center">
            <img className="w-10 h-10 rounded-full" src={Profile} />
            <label className="text-white text-sm font-extrabold font-fontUse ml-4">
              What do you think?
            </label>
          </div>
          <input
            type="text"
            name="name"
            id="name"
            className="block py-2.5 font-bold px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
            placeholder=" "
            required
          />
          <button className="w-fit h-fit px-[15px] py-2 bg-white rounded-sm justify-center items-center gap-[3px] inline-flex float-right my-4">
            <div className="text-black text-base font-bold font-fontUse uppercase text-wrap line-clamp-1">
              Login in to comment
            </div>
          </button>
        </div>
      </div>
      <div className="antialiased mx-auto border-s border-black">
        <div className="space-y-4">
          <div className="flex relative -left-5 -top-2">
            <div className="flex-shrink-0 mr-3">
              <img
                className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
                src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                alt=""
              />
            </div>
            <div className="flex-1 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
              <span className="text-black font-extrabold text-lg">Sarah</span>
              <span className="text-xs text-black ml-4">3:34 PM</span>
              <p className="text-sm text-black">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua.
              </p>
              <div className="mt-4 flex items-center">
                <div className="flex -space-x-2 mr-2">
                  <img
                    className="rounded-full w-6 h-6 border border-black"
                    src="https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
                    alt=""
                  />
                  <img
                    className="rounded-full w-6 h-6 border border-black"
                    src="https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
                    alt=""
                  />
                </div>
                <div className="text-sm text-black font-semibold">
                  5 Replies
                </div>
              </div>
            </div>
          </div>

          <div className="flex relative -left-5 -top-2">
            <div className="flex-shrink-0 mr-3">
              <img
                className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
                src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                alt=""
              />
            </div>
            <div className="flex-1 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
              <span className="text-black font-extrabold text-lg">Sarah</span>
              <span className="text-xs text-black ml-4">3:34 PM</span>
              <p className="text-sm text-black">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua.
              </p>
              <h4 className="my-5 uppercase tracking-wide text-black  font-bold text-xs">
                Replies
              </h4>
              <div className="space-y-4 ">
                <div className="flex relative -left-4">
                  <div className="flex-shrink-0 mr-3">
                    <img
                      className="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                      src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                    <span className="text-black font-extrabold text-lg">
                      Sarah
                    </span>
                    <span className="text-xs text-black ml-4">3:34 PM</span>
                    <p className="text-xs sm:text-sm text-black">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      sed diam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat, sed diam voluptua.
                    </p>
                  </div>
                </div>
                <div className="flex relative -left-4">
                  <div className="flex-shrink-0 mr-3">
                    <img
                      className="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                      src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                    <span className="text-black font-extrabold text-lg">
                      Sarah
                    </span>
                    <span className="text-xs text-black ml-4">3:34 PM</span>
                    <p className="text-xs sm:text-sm text-black">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      sed diam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat, sed diam voluptua.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </section>
  );
};

export default ProjectDiscussion;

import React from "react";

function ProjectJobCard({ image, website, tags, country }) {
  return (
    <div className="text-[#FFFFFF]">
      <div className="bg-[#B9C0F2] border border-[#7283EA] rounded-2xl">
        <div className="md:p-4 p-2">
          <h3 className="text-lg font-[950]">General Inquiry</h3>
          <div className="sm:flex">
            <div className="sm:w-1/2">
              <div className="pt-2 flex">
                <img
                  src={image}
                  alt="project"
                  className="w-16 aspect-square object-cover rounded-md"
                />
                <div className="mt-auto pl-2">
                  <p className="text-base font-[950]">About the Company</p>
                  <p className="text-xs font-[450]">
                    We work with many partners!
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-base font-[950] py-2">Responsibilities</p>
                <ul className="text-xs md:pl-4 font-[450] list-disc list-outside">
                  <li>Submit a general inquiry for our recruitment support!</li>
                  <li>
                    We might have something in the works that could suit you.
                  </li>
                </ul>
              </div>
            </div>
            <div className="sm:w-1/2">
              <div className="flex justify-center items-center">
                <p className="text-base font-[950] px-2">TAGS</p>
                {tags && (
                  <p className="flex items-center flex-wrap py-2 gap-2">
                    {tags.map((val, index) => (
                      <span
                        className="bg-transparent text-xs font-semibold px-3 py-1 rounded-2xl border-2 border-[#FFFFFF]"
                        key={index}
                      >
                        {val}
                      </span>
                    ))}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <p className="text-base font-[950] py-2">Responsibilities</p>
                <ul className="text-xs md:pl-4 font-[450] list-disc list-outside">
                  <li>
                    Fill out the form with your CV and LinkedIn, and we'll get
                    back to you!
                  </li>
                </ul>
              </div>

              <div className="mt-2">
                <p className="text-base font-[950] py-1">Location</p>
                <span className="capitalize">{country}</span>
              </div>
              <div className="mt-2 sm:flex">
                <div className="w-full">
                  <span>Register your interest here:</span>
                </div>
                <div className="w-full sm:w-1/2">
                  {" "}
                  {website && (
                    <a href={website} target="_blank">
                      <button className="font-[450] border text-xs text-[#ffffff] py-[7px] px-[9px] rounded-md border-[#FFFFFF4D] drop-shadow-[#00000040]  bg-[#3505B2] text-nowrap">
                      I'm interested!
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectJobCard;

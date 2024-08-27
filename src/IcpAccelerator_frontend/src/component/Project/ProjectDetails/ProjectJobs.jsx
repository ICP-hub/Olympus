import React, { useState, useEffect } from "react";

const ProjectJobs = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [issecpopup, setIssecpopup] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isPopupOpen || issecpopup) {
        if (!event.target.closest(".popup")) {
          setIsPopupOpen(false);
          setIssecpopup(false);
        }
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isPopupOpen, issecpopup]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const second = () => {
    setIssecpopup(!issecpopup);
  };
  return (
    <div className="">
      <div className="font-extrabold text-black text-2xl">
        <p>jobs</p>
      </div>

      <div className="flex flex-wrap md:p-8 p-2 space-x-4">
        <div className="w-full md:w-1/2 dlg:w-1/2">
          <a
            href="#"
            className="block md:m-1 p-4 mb-4 bg-[#7283EA] to-[#B9C0F23B] border-2 border-blue-400 rounded-2xl shadow"
          >
            <div className="p-2">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                General Inquiry
              </h5>
              <div className="flex flex-col md:flex-row md:items-start gap-2 w-full">
                {" "}
                {/* Adjusted alignment */}
                <img
                  className="h-14 w-14 rounded-md lg:mb-48"
                  src={''}
                  alt="build.io"
                />{" "}
                {/* Adjusted image size */}
                <div className="md:w-1/2">
                  <p className="text-white font-bold">About the Company</p>
                  <p className="text-white">We work with many partners!</p>
                  <div className="gap-4 flex flex-col justify-start items-start">
                    <p className="font-bold text-white mt-4">
                      Responsibilities
                    </p>
                    <p className="text-white">
                      <span className="h-4 w-4">.</span>Submit a general inquiry
                      for our recruitment support!
                    </p>
                    <p className="text-white">
                      Submit a general inquiry for our recruitment support! We
                      might have something in the works that could suit you.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="flex flex-col gap-4 text-white">
                    <div className="flex flex-row gap-2 font-bold w-full">
                      <p>TAGS</p>
                      <p>Imo</p>
                      <p className="border-white">Ludi</p>
                      <p>Ndaru</p>
                    </div>
                    <p className="text-white">Requirements</p>
                    <p>
                      Fill out the form with your CV and LinkedIn, and we'll get
                      back to you!
                    </p>
                    <div className="flex flex-col gap-2">
                      <h1 className="font-bold text-white">Location</h1>
                      <p>India</p> {/* Corrected spelling */}
                    </div>
                    <div className="flex flex-row gap-2">
                      <h2 className="text-2xl text-white">
                        Register your interest here:
                      </h2>
                      <button className=" text-white font-bold px-2 underline rounded-md text-md">
                        Interested!
                      </button>{" "}
                      {/* Adjusted button styling */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectJobs;

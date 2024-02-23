import React, { useState, useEffect, useRef } from "react";
import project from "../../../assets/images/project.png";

const ProjectGallery = () => {
  const carouselRef = useRef(null);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);

  const scrollContent = (direction) => {
    const content = carouselRef.current;
    if (!content) return;

    const scrollAmount = content.clientWidth / 2;
    const newScrollPosition =
      direction === "next"
        ? content.scrollLeft + scrollAmount
        : content.scrollLeft - scrollAmount;

    content.scroll({
      left: newScrollPosition,
      behavior: "smooth",
    });

    checkScrollPosition();
  };

  const checkScrollPosition = () => {
    const content = carouselRef.current;
    if (!content) return;

    const maxScrollLeft = content.scrollWidth - content.clientWidth;
    setIsAtStart(content.scrollLeft <= 0);
    setIsAtEnd(content.scrollLeft >= maxScrollLeft);
  };

  useEffect(() => {
    const content = carouselRef.current;
    if (content) {
      content.addEventListener("scroll", checkScrollPosition);
    }

    return () => {
      if (content) {
        content.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []);
  return (
    <>
      <div className="w-full flex flex-row md:flex-nowrap flex-wrap rounded-md text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[13.5px] md:text-[14px.3] md1:text-[14px] md2:text-[14px] md3:text-[14px] lg:text-[16.5px] dlg:text-[17px] lg1:text-[15.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] border md:border-none border-gray-200 my-2 px-2 box-shadow-blur bg-gradient-white-transparent">
        <div className="flex flex-wrap">
          <img
            className="mt-5 object-contain"
            src={project}
            alt="Project visualization"
          />
          <div className="ml-4 mt-14 md:w-3/6  w-6/6 flex flex-col flex-wrap ">
            <h1 className="font-bold text-3xl">All Projects</h1>
            <p className=" text-white text-xl font-normal font-fontUse">
              PANONY was established in March 2018 with operations in Greater
              China, South Korea and the U.S. Both founders are Forbes
            </p>
          </div>
          <div className="flex items-start py-4 md:py-5">
            <button
              type="button"
              className="focus:outline-none text-white border border-white bg-transparent focus:ring-4 focus:ring-white font-medium rounded-lg text-[14px] px-4 py-2 me-2 mb-2 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
              </svg>
              <span className="ml-2 text-nowrap">Visit Us</span>
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
          <div className="md:w-4/6  w-6/6 flex flex-col flex-wrap text-justify text-white text-xl font-normal font-fontUse">
            Asia 30 under 30 honorees. PANY was established PANONY was
            established in March 2018 with operations in Greater China, South
            Korea and the U.S. Both founders are Forbes Asia 30 under 30
            honorees. PANY was establishedPANONY was established in March 2018
            with operations in Greater China, South Korea and the U.S. Both
            founders are Forbes Asia 30 under 30 honorees. PANY was established
          </div>
        </div>
      </div>
      <div className="relative  pb-4 pt-6">
        <div className="relative mb-4">
          <div className="flex items-center space-x-4 absolute inset-y-0 right-10  pr-2">
            <button
              className={`disabled:opacity-50 ${
                isAtStart ? "opacity-50 cursor-not-allowed" : ""
              } arrow-prev`}
              onClick={() => scrollContent("prev")}
              disabled={isAtStart}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 21 21"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Play">
                  <path
                    id="Vector 3642"
                    d="M1.06855 9.41299C1.55792 7.55803 3.86628 6.24844 8.483 3.62926C12.946 1.09729 15.1775 -0.168694 16.9749 0.341805C17.718 0.552865 18.3949 0.953272 18.9407 1.5046C20.2609 2.83814 20.2593 5.42314 20.2562 10.5932C20.2531 15.7632 20.2516 18.3482 18.9298 19.6801C18.3834 20.2308 17.7059 20.6304 16.9626 20.8405C15.1646 21.3489 12.9346 20.0802 8.47463 17.5429C3.86107 14.9182 1.55428 13.6058 1.06715 11.7502C0.866077 10.9843 0.866561 10.1787 1.06855 9.41299Z"
                    fill="#fff"
                  />
                </g>
              </svg>
            </button>
            <button
              className={`disabled:opacity-50 ${
                isAtEnd ? "opacity-50 cursor-not-allowed" : ""
              } arrow-next`}
              onClick={() => scrollContent("next")}
              disabled={isAtEnd}
            >
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Play">
                  <path
                    id="Vector 3642"
                    d="M19.3592 11.7852C18.8698 13.6402 16.5615 14.9498 11.9447 17.569C7.48173 20.1009 5.25023 21.3669 3.45283 20.8564C2.70972 20.6454 2.03279 20.245 1.48699 19.6936C0.166841 18.3601 0.168396 15.7751 0.171505 10.6051C0.174613 5.43508 0.176168 2.85008 1.49792 1.51813C2.04438 0.967456 2.72179 0.567864 3.46516 0.357698C5.26317 -0.15064 7.49315 1.11803 11.9531 3.65537C16.5667 6.28009 18.8735 7.59245 19.3606 9.44801C19.5617 10.2139 19.5612 11.0196 19.3592 11.7852Z"
                    fill="#fff"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>
        <ul
          ref={carouselRef}
          className="flex space-x-2 overflow-x-auto"
          onScroll={checkScrollPosition}
        >
          <li className="mr-4">
            <div className="relative flex justify-center items-center h-[300px] w-[500px]">
              <iframe
                className="absolute top-0 left-0 h-full w-full transition-all duration-300 rounded-lg hover:blur-none z-0"
                src="https://www.youtube.com/embed/Nfh4hpjJReE"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                title="YouTube Video"
              ></iframe>
              <div className="absolute z-10 flex justify-center items-center h-full w-full">
                <svg
                  width="71"
                  height="71"
                  viewBox="0 0 71 71"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Group">
                    <g id="Group_2">
                      <path
                        id="Vector"
                        d="M35.5338 0.981702C16.4624 0.970234 0.992657 16.4214 0.981189 35.4928C0.969721 54.5641 16.4209 70.0339 35.4923 70.0454C54.5636 70.0569 70.0334 54.6057 70.0449 35.5343C70.0563 16.463 54.6052 0.99317 35.5338 0.981702ZM47.6685 37.0482L30.845 48.4861C30.2789 48.871 29.5462 48.9113 28.9413 48.5909C28.3363 48.2704 27.9581 47.6417 27.9585 46.957L27.9723 24.061C27.9727 23.3764 28.3516 22.7481 28.957 22.4283C29.5624 22.1086 30.295 22.1497 30.8606 22.5353L47.6704 33.9935C48.1756 34.3379 48.4778 34.9099 48.4774 35.5213C48.4771 36.1328 48.1743 36.7044 47.6685 37.0482Z"
                        fill="white"
                      />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </li>
          {Array.from({ length: 20 }, (_, n) => (
            <li
              className="w-fit h-full flex-shrink-0 rounded-lg overflow-hidden "
              key={n}
            >
              <a
                href="#"
                className="flex flex-col items-center justify-start relative select-none mr-4"
              >
                <div className="w-full h-full rounded-lg">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={`https://picsum.photos/id/${n}/300/300`}
                    alt=""
                    style={{ aspectRatio: "1 / 1", userDrag: "none" }}
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProjectGallery;

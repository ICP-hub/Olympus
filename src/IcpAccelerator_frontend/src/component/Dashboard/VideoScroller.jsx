import React, { useState, useRef, useEffect } from "react";

const VideoScroller = () => {
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
    <div className="mx-auto max-w-[1440px] w-full pl-[6%] lg1:pl-[4%]">
      <div className="relative  pb-4 pt-6 md:ml-16">
        <div className="relative mb-4">
          <div className="flex items-center space-x-4 absolute inset-y-0 right-0  pr-2">
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
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Play">
                  <path
                    id="Vector 3642"
                    d="M1.06855 9.41299C1.55792 7.55803 3.86628 6.24844 8.483 3.62926C12.946 1.09729 15.1775 -0.168694 16.9749 0.341805C17.718 0.552865 18.3949 0.953272 18.9407 1.5046C20.2609 2.83814 20.2593 5.42314 20.2562 10.5932C20.2531 15.7632 20.2516 18.3482 18.9298 19.6801C18.3834 20.2308 17.7059 20.6304 16.9626 20.8405C15.1646 21.3489 12.9346 20.0802 8.47463 17.5429C3.86107 14.9182 1.55428 13.6058 1.06715 11.7502C0.866077 10.9843 0.866561 10.1787 1.06855 9.41299Z"
                    fill="#4B0FAC"
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
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Play">
                  <path
                    id="Vector 3642"
                    d="M19.3592 11.7852C18.8698 13.6402 16.5615 14.9498 11.9447 17.569C7.48173 20.1009 5.25023 21.3669 3.45283 20.8564C2.70972 20.6454 2.03279 20.245 1.48699 19.6936C0.166841 18.3601 0.168396 15.7751 0.171505 10.6051C0.174613 5.43508 0.176168 2.85008 1.49792 1.51813C2.04438 0.967456 2.72179 0.567864 3.46516 0.357698C5.26317 -0.15064 7.49315 1.11803 11.9531 3.65537C16.5667 6.28009 18.8735 7.59245 19.3606 9.44801C19.5617 10.2139 19.5612 11.0196 19.3592 11.7852Z"
                    fill="#4B0FAC"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>
        <ul
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto"
          onScroll={checkScrollPosition}
        >
          {Array.from({ length: 20 }, (_, n) => (
            <li
              className="w-52 h-auto flex-shrink-0 rounded-lg overflow-hidden"
              key={n}
            >
              <a
                href="#"
                className="flex flex-col items-center justify-start relative select-none"
              >
                <div className="bg-gradient-to-r from-violet-900 to-blue-500 w-full h-auto">
                  <img
                    className="w-full h-half object-cover"
                    src={`https://picsum.photos/id/${n}/300/300`}
                    alt=""
                    style={{ aspectRatio: "1 / 1", userDrag: "none" }}
                  />
                  <div className="p-2 w-full">
                    <h3 className="text-sm font-semibold text-white">
                      Leverage communities in Web3
                    </h3>
                    <span className="text-sm text-gray-300">
                      02 Oct, 5:00 PM EST
                    </span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoScroller;

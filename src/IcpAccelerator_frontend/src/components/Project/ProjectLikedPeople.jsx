import React from "react";
import Profile from '../../../assets/images/Ellipse 1382.svg'

const ProjectLikedPeople = () => {
  const likedPeople = Array(18).fill(null);
  return (
    <section className="">
      <div className="w-full md:h-[50px] h-[40px] relative origin-top-left flex items-center flex-wrap truncate md:overflow-visible px-3 my-4" style={{ left: 0 }}>
                {likedPeople.map((_, index) => (
                  <div className="relative mr-3 mt-2" key={index}>
                    <img
                      className="w-7 h-7 rounded-full" 
                      src={Profile}
                      alt=""
                    />
                    <span className="bottom-0 left-5 absolute">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          id="Vector"
                          d="M19.2661 1.85624C16.3874 0.0880237 13.8734 0.798386 12.3628 1.93141C11.7434 2.39598 11.4337 2.62826 11.2516 2.62815C11.0695 2.62804 10.76 2.39539 10.1412 1.93008C8.63196 0.795234 6.11888 0.0818492 3.23799 1.84661C-0.542863 4.16265 -1.40266 11.8104 7.31119 18.2682C8.97091 19.4982 9.80077 20.1132 11.2411 20.114C12.6814 20.1149 13.512 19.5009 15.1732 18.2729C23.8948 11.8256 23.0442 4.17684 19.2661 1.85624Z"
                          fill="#7283EA"
                        />
                      </svg>
                    </span>
                  </div>
                ))}
      </div>
    </section>
  );
};

export default ProjectLikedPeople;




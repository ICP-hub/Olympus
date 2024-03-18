import React from "react";
const data = [
  { count: "200", label: "No of Projects", position: "left-0 top-[50px]" },
  {
    count: "50",
    label: "Investments Secured",
    position: "-left-[20px] top-[50px]",
  },
  { count: "45", label: "No of Investors", position: "-left-[5px] top-[50px]" },
  { count: "50", label: "No of Mentors", position: " top-[50px]" },
  { count: "100M", label: "Investment Committed", position: " top-[50px]" },
  { count: "100", label: "No of Jobs Given", position: "top-[50px]" },
  { count: "100", label: "Number of Users", position: " top-[50px]" },
];
const ImpactTool = () => {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-full md:h-[11.5rem] bg-white rounded-[20px] z-10 mt-4 drop-shadow-2xl">
        <div className="flex justify-center">
          <div className="w-5/6 px-4 md:justify-between md:items-center md:flex md:left-[-60px] md:top-[45px] md:relative">
            {data.map(({ count, label, position }) => (
              <div className="relative mb-4 mt-4 md:mt-0" key={label}>
                <div className={`top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse`}>
                  {count}
                </div>
                <div
                  className={`${position} md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse line-clamp-2`}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactTool;

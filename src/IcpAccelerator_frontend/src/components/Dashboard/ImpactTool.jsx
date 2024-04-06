import React from "react";
const data = [
  { count: "10K+", label: "USERS" },
  { count: "100+", label: "PROJECTS INCUBATED"},
  { count: "10+", label: "TOKENS LAUNCHED" },
  { count: "25+", label: "INVESTORS" },
  { count: "50+", label: "MENTORS"},
  { count: "$10M+", label: "INVESTMENT RAISED"},
  { count: "40+", label: "COUNTRIES" },
];
const ImpactTool = () => {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-full md:h-[11.5rem] bg-white rounded-[20px] z-10 mt-4 drop-shadow-2xl">
        <div className="flex justify-center h-full">
          <div className="w-full md:justify-between md:items-center md:flex mb-4 mt-4 p-8">
            {data.map(({ count, label, position }) => (
              <div className="flex justify-center align-center mt-4 md:mt-0" key={label}>
                <div className="flex flex-col items-center justify-between">
                  <div className={`text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse`}>
                    <div className="animate-translate-y" style={{ animationDuration: "2s" }}>{count}</div>
                  </div>
                  <div
                    className={`text-center text-neutral-500 md:text-lg font-normal font-fontUse line-clamp-2 text-wrap`}>
                    {label}
                  </div>
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

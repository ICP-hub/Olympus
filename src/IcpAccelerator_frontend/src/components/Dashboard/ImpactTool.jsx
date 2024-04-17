import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const data = [
  { initial: 0, count: "10K+", label: "USERS" },
  { initial: 0, count: "100+", label: "PROJECTS INCUBATED" },
  { initial: 0, count: "10+", label: "TOKENS LAUNCHED" },
  { initial: 0, count: "25+", label: "INVESTORS" },
  { initial: 0, count: "50+", label: "MENTORS" },
  { initial: 0, count: "$10M+", label: "INVESTMENT RAISED" },
  { initial: 0, count: "40+", label: "COUNTRIES" },
];

const ImpactTool = () => {
  const [values, setValues] = useState(data.map((d) => `${d.initial}+`));
  const refs = useRef(data.map(() => React.createRef()));

  useEffect(() => {
    refs.current.forEach((ref, index) => {
      const element = ref.current;
      if (!element) {
        console.error(`Ref not attached to a DOM element at index ${index}`);
        return;
      }

      const item = data[index];
      const targetNumericValue = parseFloat(item.count.replace(/[^0-9.]+/g, ""));
      const nonNumeric = item.count.replace(/[0-9.]+/g, "");

      let currentNumericValue = 0;

      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: "top+=160 center",
          end: "bottom+=280 center",
          toggleActions: "restart none none reverse",
          markers: false, 
          scrub: true, 
          onEnter: () => {
            gsap.to(element, {
              roundProps: "innerHTML",
              ease: "power3.out",
              duration: 2,
              onUpdate: function () {
                currentNumericValue +=
                  (targetNumericValue - currentNumericValue) * this.progress();
                setValues((v) => {
                  const newValues = [...v];
                  newValues[index] = `${Math.ceil(currentNumericValue)}${nonNumeric}`;
                  return newValues;
                });
              },
              onComplete: function () {
                setValues((v) => {
                  const newValues = [...v];
                  newValues[index] = item.count;
                  return newValues;
                });
              },
            });
          },
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [data]);

  return (
    <div className="flex justify-center mb-8">
      <div className="w-full md:h-[11.5rem] bg-white rounded-[20px] z-10 mt-4 drop-shadow-2xl">
        <div className="flex justify-center h-full">
          <div className="w-full md:justify-between md:items-center md:flex mb-4 mt-4 p-8">
            {data.map((item, index) => (
              <div
                className="flex justify-center align-center mt-4 md:mt-0"
                key={item.label}
              >
                <div className="flex flex-col items-center justify-between">
                  <div className="text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold">
                    <span ref={refs.current[index]}>{values[index]}</span>
                  </div>
                  <div className="text-center text-neutral-500 md:text-lg font-normal line-clamp-2 text-wrap">
                    {item.label}
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

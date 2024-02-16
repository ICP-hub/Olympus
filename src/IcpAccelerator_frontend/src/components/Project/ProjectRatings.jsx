import React, { Children, useState } from "react";
import Profile from "../../../assets/images/Ellipse 1382.svg";
import ReactSlider from "react-slider";
import Astro from "../../../assets/images/AstroLeft.png";
import { Line } from "rc-progress";

const ProjectRatings = () => {
  const [rating, setRating] = useState([
    {
      title: "Team",
      description:
        "Asia 30 under 30 honorees. PANY was established PANONY was established in March 2018 with operations in Greater China, South Korea and the U.S. Both founders are Forbes Asia 30 under 30 honorees. PANY was establishedPANONY was established in March 2018 with operations in Greater China, South Korea and the U.S. Both founders are Forbes Asia 30 under 30 honorees. PANY was established",
      isOpen: false,
    },
    {
      title: "Problem and Vision",
      description: "Description for value B",
      isOpen: false,
    },
    {
      title: "Value Prop",
      description: "Description for value A",
      isOpen: false,
    },
    { title: "Product", description: "Description for value B", isOpen: false },
    { title: "Market", description: "Description for value A", isOpen: false },
    {
      title: "Business Model",
      description: "Description for value B",
      isOpen: false,
    },
    { title: "Scale", description: "Description for value A", isOpen: false },
    { title: "Exit", description: "Description for value B", isOpen: false },
  ]);

  const [sliderValues, setSliderValues] = useState({
    Team: 0,
    ProblemAndVision: 0,
    ValueProp: 0,
    Product: 0,
    Market: 0,
    BusinessModel: 0,
    Scale: 0,
    Exit: 0,
  });
  const [sliderValuesProgress, setSliderValuesProgress] = useState({
    Team: 0,
    ProblemAndVision: 0,
    ValueProp: 0,
    Product: 0,
    Market: 0,
    BusinessModel: 0,
    Scale: 0,
    Exit: 0,
  });

  const sliderKeys = [
    "Team",
    "ProblemAndVision",
    "ValueProp",
    "Product",
    "Market",
    "BusinessModel",
    "Scale",
    "Exit",
  ];
  console.log(sliderValues)

  const handleSliderChange = (index, value) => {
    const key = sliderKeys[index];
    const newSliderValues = { ...sliderValues, [key]: value };
    setSliderValues(newSliderValues);
    const newSliderValuesProgress = { ...sliderValuesProgress, [key]: value === 9 ? 100 : Math.floor(value * 11) };
    setSliderValuesProgress(newSliderValuesProgress)
  };
  // console.log(sliderValues)
  const toggleOpen = (index) => {
    setRating(
      rating.map((value, i) => {
        if (i === index) {
          return { ...value, isOpen: !value.isOpen };
        }
        return value;
      })
    );
  };

  const customStyles = `
  .slider-mark::after {
    content: attr(data-label);
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    white-space: nowrap;
    font-size: 0.75rem;
    color: #fff;
    padding: 0.2rem 0.4rem; 
    border-radius: 0.25rem;
  }
`;
  return (
    <section className="mt-8">
      {/* <div class="w-full h-[194.75px] mix-blend-darken bg-violet-900 rounded-[20px]"> */}
      <div className="p-4">
        {rating.map((value, index) => (
          <div
            className="mix-blend-darken bg-violet-900 text-gray-800 my-4 rounded shadow-md w-full mx-auto"
            key={index}
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleOpen(index)}
            >
              <h2 className="text-lg font-semibold text-white text-nowrap">
                {value.title}
              </h2>
              <div className="mx-4 flex items-center w-full">
                <Line
                  strokeWidth={0.2}
                   percent={sliderValuesProgress[sliderKeys[index]]}
                  strokeColor="bg-black"
                  className="line-horizontal"
                />
                <div class="text-white text-[15px] font-normal font-fontUse ml-2">
                {sliderValuesProgress[sliderKeys[index]]}%
                </div>
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path
                    id="Star 1"
                    d="M7.04894 0.92705C7.3483 0.00573921 8.6517 0.00573969 8.95106 0.92705L10.0206 4.21885C10.1545 4.63087 10.5385 4.90983 10.9717 4.90983H14.4329C15.4016 4.90983 15.8044 6.14945 15.0207 6.71885L12.2205 8.75329C11.87 9.00793 11.7234 9.4593 11.8572 9.87132L12.9268 13.1631C13.2261 14.0844 12.1717 14.8506 11.388 14.2812L8.58778 12.2467C8.2373 11.9921 7.7627 11.9921 7.41221 12.2467L4.61204 14.2812C3.82833 14.8506 2.77385 14.0844 3.0732 13.1631L4.14277 9.87132C4.27665 9.4593 4.12999 9.00793 3.7795 8.75329L0.979333 6.71885C0.195619 6.14945 0.598395 4.90983 1.56712 4.90983H5.02832C5.46154 4.90983 5.8455 4.63087 5.97937 4.21885L7.04894 0.92705Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span className="text-2xl">
                {value.isOpen ? (
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id="Vector 3642"
                      d="M7.54123 15.875C6.01913 15.471 4.94357 13.5619 2.79245 9.74371C0.712951 6.05263 -0.326798 4.20709 0.0911425 2.71981C0.263935 2.10491 0.592106 1.54467 1.04416 1.09285C2.13758 -6.49695e-07 4.25839 -5.56986e-07 8.5 -3.71568e-07C12.7416 -1.86151e-07 14.8624 -9.3442e-08 15.9558 1.09285C16.4079 1.54467 16.7361 2.10491 16.9089 2.71981C17.3268 4.20709 16.287 6.05263 14.2075 9.74371C12.0564 13.5619 10.9809 15.471 9.45877 15.875C8.8305 16.0417 8.1695 16.0417 7.54123 15.875Z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg
                    width="17"
                    height="18"
                    viewBox="0 0 17 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id="Vector 3642"
                      d="M16.375 9.95877C15.971 11.4809 14.0619 12.5564 10.2437 14.7075C6.55263 16.787 4.70709 17.8268 3.21981 17.4089C2.60491 17.2361 2.04467 16.9079 1.59285 16.4558C0.5 15.3624 0.5 13.2416 0.5 9C0.5 4.75839 0.5 2.63758 1.59285 1.54416C2.04467 1.09211 2.60491 0.763936 3.21981 0.591143C4.70709 0.173202 6.55263 1.21295 10.2437 3.29245C14.0619 5.44357 15.971 6.51913 16.375 8.04123C16.5417 8.6695 16.5417 9.33049 16.375 9.95877Z"
                      fill="white"
                    />
                  </svg>
                )}
              </span>
            </div>
            <div
              className={`transition-all duration-200 ${
                value.isOpen ? "max-h-screen" : "max-h-0"
              } overflow-hidden`}
            >
              <div className="p-4 border-t border-gray-200 ">
                <div className="text-white text-sm font-normal font-fontUse">
                  {value.description}
                </div>
                <div className="p-4">
                  <div className="w-full h-fit bg-violet-900 rounded-[20px] border-4 border-white">
                    <div className="px-8 py-4">
                      <div className="w-[271.58px] text-white text-lg font-bold font-fontUse">
                        Rate team on sacle of 9
                      </div>
                      <div className="relative my-8">
                        <style
                          dangerouslySetInnerHTML={{ __html: customStyles }}
                        />
                        <ReactSlider
                          className="bg-gradient-to-r from-white to-blue-500 h-1 rounded-md"
                          marks
                          markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                          min={0}
                          max={9}
                          thumbClassName="absolute bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-md -top-2"
                          trackClassName="h-1 rounded"
                          value={sliderValues[sliderKeys[index]]}
                          onChange={(value) => handleSliderChange(index, value)}
                          renderThumb={(props, state) => (
                            // console.log(state.valueNow),
                            <div {...props} className="w-8 -top-4 ">
                              <img
                                src={Astro}
                                alt="Progress Icon"
                                className="w-[90px] h-[50px]"
                              />
                            </div>
                          )}
                          renderMark={({ key, style }) => (
                            <div
                              key={key}
                              className="slider-mark bg-transparent rounded-md h-1 w-1"
                              style={{ ...style, top: "0px" }}
                              data-label={`Level ${key}`}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* </div> */}
      <div className="w-full h-[190px] mix-blend-color-dodge bg-gradient-to-r from-violet-800 to-blue-500 rounded-md border border-white my-8 relative z-10">
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
      <div className="antialiased mx-auto border-s border-gray-200">
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
              <span className="text-white font-extrabold text-lg">Sarah</span>
              <span className="text-xs text-white ml-4">3:34 PM</span>
              <p className="text-sm text-white">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua.
              </p>
              <div className="mt-4 flex items-center">
                <div className="flex -space-x-2 mr-2">
                  <img
                    className="rounded-full w-6 h-6 border border-white"
                    src="https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
                    alt=""
                  />
                  <img
                    className="rounded-full w-6 h-6 border border-white"
                    src="https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
                    alt=""
                  />
                </div>
                <div className="text-sm text-white font-semibold">
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
              <span className="text-white font-extrabold text-lg">Sarah</span>
              <span className="text-xs text-white ml-4">3:34 PM</span>
              <p className="text-sm text-white">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua.
              </p>
              <h4 className="my-5 uppercase tracking-wide text-white  font-bold text-xs">
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
                    <span className="text-white font-extrabold text-lg">
                      Sarah
                    </span>
                    <span className="text-xs text-white ml-4">3:34 PM</span>
                    <p className="text-xs sm:text-sm text-white">
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
                    <span className="text-white font-extrabold text-lg">
                      Sarah
                    </span>
                    <span className="text-xs text-white ml-4">3:34 PM</span>
                    <p className="text-xs sm:text-sm text-white">
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

export default ProjectRatings;

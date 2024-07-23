import React from "react";

const RubricRatingExt = ({}) => {
    return(
        <>
         <div className="flex justify-center  mt-[48px]">
        <div className="relative w-full h-[542.8px] border-4 border-[#E9E9E9] ">
          <div className="absolute bottom-0 left-0 top-0 w-[389.31px] h-[390px] bg-blue-100 ellipse-quarter-left rounded-md rotate-90 z-0"></div>
          <div className="absolute top-0 right-0 bg-blue-100 w-[209.63px] h-[210px] ellipse-quarter-right rounded-md"></div>
          <div className="absolute top-[327px] right-0 bg-blue-100 w-[209.63px] h-[210px] ellipse-quarter-right rounded-md rotate-90"></div>
          <div className="flex flex-col w-full relative mt-4">
            <div className="w-fit  p-4 text-2xl font-bold md:ml-4 mt-4 absolute top-0 left-0 right-0 text-center text-black">
              Ratings
            </div>

            <div className=" overflow-y-auto  w-full">
              <div className="flex flex-col w-full ">
                <div className="flex flex-row    mt-8 items-center justify-between p-4 ">
                  <div className="w-full  p-4">
                    <div className=" relative rounded-lg overflow-hidden   gap-2 w-full  ">
                      <div className="flex flex-col ">
                        <div className="relative my-8 ml-24 flex flex-row  items-center  gap-2 sm:flex-wrap ">
                          <p>Team</p>
                          <style
                            dangerouslySetInnerHTML={{ __html: customStyles }}
                          />
                          <ReactSlider
                            className="bg-gradient-to-r from-blue-200 to-blue-600 h-3 rounded-md flex-grow" // Increased height to 3
                            marks
                            markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                            min={2}
                            max={10}
                            thumbClassName="absolute bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-md -top-7" // Increased width and height
                            trackClassName="h-3 rounded" // Adjusted height to match the slider height
                            value={sliderValues[sliderKeys[currentStep]]}
                            onChange={(value) =>
                              handleSliderChange(currentStep, value)
                            }
                            renderThumb={(props, state) => (
                              <div {...props} className="w-12 h-12 -top-6">
                                {" "}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 "></div>{" "}
                              </div>
                            )}
                            renderMark={({ key, style }) => (
                              <div
                                key={key > 0 ? key : ""}
                                className="slider-mark bg-transparent rounded-md h-1 w-1"
                                style={{ ...style, top: "0px" }}
                              >
                                {key > 0 ? (
                                  <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                                    <span></span>
                                    <div className="relative group">
                                      <span className="cursor-pointer"></span>
                                      <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2">
                                        <div className="relative z-10 p-2"></div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          />
                          <div className="text-gray-600 ml-4">
                            {(
                              ((sliderValues[sliderKeys[currentStep]]) /
                                100) *
                              100
                            ).toFixed(0)}{" "}
                            Level
                          </div>
                        </div>
                        <div className="relative my-8 ml-14 flex flex-row  items-center  gap-2">
                          <p>Value Prop </p>
                          <style
                            dangerouslySetInnerHTML={{ __html: customStyles }}
                          />
                          <ReactSlider
                            className="bg-gradient-to-r from-blue-200 to-blue-600 h-3 rounded-md flex-grow" // Increased height to 3
                            marks
                            markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                            min={2}
                            max={10}
                            thumbClassName="absolute bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-md -top-7" // Increased width and height
                            trackClassName="h-3 rounded" // Adjusted height to match the slider height
                            value={sliderValues[sliderKeys[currentStep]]}
                            onChange={(value) =>
                              handleSliderChange(currentStep, value)
                            }
                            renderThumb={(props, state) => (
                              <div {...props} className="w-12 h-12 -top-6">
                                {" "}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 "></div>{" "}
                              </div>
                            )}
                            renderMark={({ key, style }) => (
                              <div
                                key={key > 0 ? key : ""}
                                className="slider-mark bg-transparent rounded-md h-1 w-1"
                                style={{ ...style, top: "0px" }}
                              >
                                {key > 0 ? (
                                  <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                                    <span></span>
                                    <div className="relative group">
                                      <span className="cursor-pointer"></span>
                                      <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2">
                                        <div className="relative z-10 p-2"></div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          />
                          <div className="text-gray-600 ml-4">
                            {(
                              ((sliderValues[sliderKeys[currentStep]]) /
                              100) *
                              100
                            ).toFixed(0)}{" "}
                            Level
                          </div>
                        </div>
                        <div className="relative my-8 flex flex-row  items-center  gap-2">
                          <p>Problem and Vision</p>
                          <style
                            dangerouslySetInnerHTML={{ __html: customStyles }}
                          />
                          <ReactSlider
                            className="bg-gradient-to-r from-blue-200 to-blue-600 h-3 rounded-md flex-grow" // Increased height to 3
                            marks
                            markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                            min={2}
                            max={10}
                            thumbClassName="absolute bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-md -top-7" // Increased width and height
                            trackClassName="h-3 rounded" // Adjusted height to match the slider height
                            value={sliderValues[sliderKeys[currentStep]]}
                            onChange={(value) =>
                              handleSliderChange(currentStep, value)
                            }
                            renderThumb={(props, state) => (
                              <div {...props} className="w-12 h-12 -top-6">
                                {" "}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 "></div>{" "}
                              </div>
                            )}
                            renderMark={({ key, style }) => (
                              <div
                                key={key > 0 ? key : ""}
                                className="slider-mark bg-transparent rounded-md h-1 w-1"
                                style={{ ...style, top: "0px" }}
                              >
                                {key > 0 ? (
                                  <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                                    <span></span>
                                    <div className="relative group">
                                      <span className="cursor-pointer"></span>
                                      <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2">
                                        <div className="relative z-10 p-2"></div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          />
                          <div className="text-gray-600 ml-4">
                            {(
                              ((sliderValues[sliderKeys[currentStep]]) /
                              100) *
                              100
                            ).toFixed(0)}{" "}
                            Level
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></>
    )
};

export default RubricRatingExt
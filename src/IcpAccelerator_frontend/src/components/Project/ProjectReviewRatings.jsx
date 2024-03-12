import React, { useState } from "react";
import ReactSlider from "react-slider";
import Astro from "../../../assets/images/AstroLeft.png";
import { alertCircle } from "../Utils/Data/SvgData";
import { Line } from "rc-progress";
import { star } from "../Utils/Data/SvgData";

const ProjectReviewRatings = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 8;

    const [rating, setRating] = useState([
        {
            title: "Team",
            description:
                "Asia 30 under 30 honorees. PANY was established PANONY was established in March 2018 with operations in Greater China, South Korea and the U.S. Both founders are Forbes Asia 30 under 30 honorees. PANY was establishedPANONY was established in March 2018 with operations in Greater China, South Korea and the U.S. Both founders are Forbes Asia 30 under 30 honorees. PANY was established",
        },
        {
            title: "Problem and Vision",
            description: "Description for value B",
        },
        {
            title: "Value Prop",
            description: "Description for value A",
        },
        { title: "Product", description: "Description for value B" },
        { title: "Market", description: "Description for value A" },
        {
            title: "Business Model",
            description: "Description for value B",
        },
        { title: "Scale", description: "Description for value A" },
        { title: "Exit", description: "Description for value B" },
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

    const handleSliderChange = (index, value) => {
        const key = sliderKeys[index];
        const newSliderValues = { ...sliderValues, [key]: value };
        setSliderValues(newSliderValues);
        const newSliderValuesProgress = {
            ...sliderValuesProgress,
            [key]: value === 9 ? 100 : Math.floor((value / 9) * 100),
        };
        setSliderValuesProgress(newSliderValuesProgress);
    };

    const handleSubmit = () => {
        console.log("Form submitted:", rating);
        setCurrentStep(0);
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

    const handleNext = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    return (
        <section className="bg-gray-100 w-full h-full lg1:px-[4%] py-[2%] px-[5%]">
            <div className="container">
                {/* Render only the current step */}
                {currentStep < totalSteps && (
                    <div className="mix-blend-darken bg-[#B9C0F3] text-gray-800 my-4 rounded shadow-md w-full mx-auto p-8">
                        <div className="flex items-center justify-between p-4 cursor-pointer">
                            <h2 className="text-lg font-semibold text-white text-nowrap">
                                {rating[currentStep].title}
                            </h2>
                            <div className="mx-4 flex items-center w-full">
                                <Line
                                    strokeWidth={0.5}
                                    percent={30}
                                    strokeColor="white"
                                    className="line-horizontal"
                                />
                                <div className="text-white text-[15px] font-normal font-fontUse ml-2">
                                    {sliderValuesProgress[sliderKeys[currentStep]]}%
                                </div>
                                {star}
                            </div>
                        </div>
                        <div className="transition-all duration-200 max-h-screen overflow-hidden">
                            <div className="p-4">
                                <div className="text-white text-sm font-normal font-fontUse">
                                    {rating[currentStep].description}
                                </div>
                                {/* Your slider and other content here */}
                                <div className="w-[271.58px] text-white text-lg font-bold font-fontUse">
                                    Rate {rating[currentStep].title.toLowerCase()} on scale of 9
                                </div>
                                <div className="relative my-8">
                                    <style dangerouslySetInnerHTML={{ __html: customStyles }} />
                                    <ReactSlider
                                        className="bg-gradient-to-r from-white to-blue-500 h-1 rounded-md w-full"
                                        marks
                                        markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                                        min={1}
                                        max={10}
                                        thumbClassName="absolute bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-md -top-2"
                                        trackClassName="h-1 rounded"
                                        value={sliderValues[sliderKeys[currentStep]]}
                                        onChange={(value) => handleSliderChange(currentStep, value)}
                                        renderThumb={(props, state) => (
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
                                                key={key > 0 ? key : ''}
                                                className="slider-mark bg-transparent rounded-md h-1 w-1"
                                                style={{ ...style, top: "0px" }}
                                            >
                                                {key > 0 ?
                                                    <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                                                        <span>Level</span>
                                                        <span>{key}</span>
                                                        <div className="relative group">
                                                            <span className="cursor-pointer">
                                                                {alertCircle}
                                                            </span>
                                                            <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2">
                                                                <div className="relative z-10 p-2">
                                                                    <div className="font-bold text-black">
                                                                        Level {key}
                                                                    </div>
                                                                    <div className="line-clamp-3">
                                                                        Lorem ipsum dolor sit amet consectetur,
                                                                        adipisicing elit. Dolore, tempora quibusdam
                                                                        omnis asperiores esse veritatis iure eos? Ipsa
                                                                        molestiae, expedita possimus quaerat,
                                                                        aspernatur hic pariatur dicta sit voluptas
                                                                        illo quidem. Lorem ipsum dolor sit amet
                                                                        consectetur adipisicing elit. Quas dolorem
                                                                        mollitia optio quis doloremque numquam
                                                                        provident, doloribus aspernatur deleniti
                                                                        necessitatibus expedita minima unde velit
                                                                        facere debitis! Asperiores tenetur veniam a.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ''}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex justify-end mt-4">
                    {currentStep > 0 && (
                        <button onClick={handlePrevious}
                            type="button"
                            className="font-bold text-white bg-blue-500 hover:bg-blue-600  focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4">
                            Back
                        </button>
                    )}
                    {currentStep < totalSteps - 1 && (
                        <button onClick={handleNext}
                            type="button"
                            className="ml-3 font-bold text-white bg-blue-500 hover:bg-blue-600  focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4">
                            Next
                        </button>
                    )}
                    {currentStep === totalSteps - 1 && (
                        <button onClick={handleSubmit}
                            type="button"
                            className="ml-3  font-bold text-white bg-blue-500 hover:bg-blue-600  focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4">
                            Submit
                        </button>
                    )}
                </div>

            </div>
        </section>
    );
};

export default ProjectReviewRatings;

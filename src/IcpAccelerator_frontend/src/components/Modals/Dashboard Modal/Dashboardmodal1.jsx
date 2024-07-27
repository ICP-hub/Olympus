import React, { useState } from 'react';
import allfounder from "../../../../assets/Logo/allfounder.png"

const DashboardModal1 = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const steps = [
        {
            title: "Welcome to your dashboard",
            description: "We're glad to have you onboard. Here are some quick tips to get you up and running.",
            image: "path/to/your/image.png", // Replace with the path to your image
        },
        // Add more steps if needed
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    const handleSkip = () => {
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
                <img src={allfounder} alt="Step visual" className="w-full mb-4" />
                <h2 className="text-xl font-bold mb-2 justify-center text-center">{steps[step].title}</h2>
                <p className="text-gray-700 mb-4 justify-center text-center">{steps[step].description}</p>
                <div className="flex justify-center mb-4">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 rounded-full mx-1 ${index === step ? 'bg-blue-500' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={handleSkip}
                        className=" text-gray-700 px-10 py-2 rounded-md border-2 border-[#CDD5DF] hover:bg-[#F8FAFC]"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-blue-500 hover:bg-blue-800 text-white px-10 border-2 border-[#CDD5DF] py-2 rounded-md"
                    >

                        {step === steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardModal1;

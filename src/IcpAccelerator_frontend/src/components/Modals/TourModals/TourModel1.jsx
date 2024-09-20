// import React, { useState } from 'react';
// import allfounder from "../../../../assets/Logo/allfounder.png"

// const TourModal = ({ isOpen, onClose }) => {
//     const [step, setStep] = useState(0);
//     const steps = [
//       {
//         title: "Welcome to your dashboard",
//         description:
//           "We're glad to have you onboard. Here are some quick tips to get you up and running.",
//         image: allfounder,
//       },
//     ];

//     const handleNext = () => {
//         if (step < steps.length - 1) {
//             setStep(step + 1);
//         } else {
//             onClose();
//         }
//     };

//     const handleSkip = () => {
//         onClose();
//     };


//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
//                 <img src={allfounder} alt="Step visual" className="w-full mb-4" />
//                 <h2 className="text-xl font-bold mb-2 justify-center text-center">{steps[step].title}</h2>
//                 <p className="text-gray-700 mb-4 justify-center text-center">{steps[step].description}</p>
//                 <div className="flex justify-center mb-4">
//                     {steps.map((_, index) => (
//                         <div
//                             key={index}
//                             className={`h-2 w-2 rounded-full mx-1 ${index === step ? 'bg-blue-500' : 'bg-gray-300'}`}
//                         />
//                     ))}
//                 </div>
//                 <div className="flex justify-between">
//                     <button
//                         onClick={handleSkip}
//                         className=" text-gray-700 px-10 py-2 rounded-md border-2 border-[#CDD5DF] hover:bg-[#F8FAFC]"
//                     >
//                         Skip
//                     </button>
//                     <button
//                         onClick={handleNext}
//                         className="bg-blue-500 hover:bg-blue-800 text-white px-10 border-2 border-[#CDD5DF] py-2 rounded-md"
//                     >

//                         {step === steps.length - 1 ? 'Finish' : 'Next'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TourModal;





// import React, { useState } from 'react';
// import allfounder from "../../../../assets/Logo/allfounder.png"

// const DashboardModal1 = ({ isOpen, onClose }) => {
//     const [step, setStep] = useState(0);
//     const steps = [
//         {
//             title: "Welcome to your dashboard",
//             description: "We're glad to have you onboard. Here are some quick tips to get you up and running.",
//             image: "path/to/your/image.png", // Replace with the path to your image
//         },
//         // Add more steps if needed
//     ];

//     const handleNext = () => {
//         if (step < steps.length - 1) {
//             setStep(step + 1);
//         } else {
//             onClose();
//         }
//     };

//     const handleSkip = () => {
//         onClose();
//     };


//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
//                 <img src={allfounder} alt="Step visual" className="w-full mb-4" />
//                 <h2 className="text-xl font-bold mb-2 justify-center text-center">{steps[step].title}</h2>
//                 <p className="text-gray-700 mb-4 justify-center text-center">{steps[step].description}</p>
//                 <div className="flex justify-center mb-4">
//                     {steps.map((_, index) => (
//                         <div
//                             key={index}
//                             className={`h-2 w-2 rounded-full mx-1 ${index === step ? 'bg-blue-500' : 'bg-gray-300'}`}
//                         />
//                     ))}
//                 </div>
//                 <div className="flex justify-between">
//                     <button
//                         onClick={handleSkip}
//                         className=" text-gray-700 px-10 py-2 rounded-md border-2 border-[#CDD5DF] hover:bg-[#F8FAFC]"
//                     >
//                         Skip
//                     </button>
//                     <button
//                         onClick={handleNext}
//                         className="bg-blue-500 hover:bg-blue-800 text-white px-10 border-2 border-[#CDD5DF] py-2 rounded-md"
//                     >

//                         {step === steps.length - 1 ? 'Finish' : 'Next'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardModal1;

import React, { useState, useEffect, useRef } from "react";
import { driver } from "driver.js"; 
import allfounder from "../../../../assets/Logo/allfounder.png";

const CustomTour = () => {
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const driverRef = useRef(null); 

  const steps = [
    {
      element: "#component1",
      title: "Component 1",
      description: "This is the first component description.",
    },
    {
      element: "#component2",
      title: "Component 2",
      description: "This is the second component description.",
    },
    {
      element: "#component3",
      title: "Component 3",
      description: "This is the third component description.",
    },
    {
      element: "#component4",
      title: "Component 4",
      description: "This is the fourth component description.",
    },
    {
      element: "#component5",
      title: "Component 5",
      description: "This is the fifth component description.",
    },
  ];

  useEffect(() => {
   
    driverRef.current = driver({
      allowClose: false,
      opacity: 0.5,
      animate: true,
    });

    driverRef.current.highlight(steps[step].element);
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      driverRef.current.highlight(steps[step + 1].element);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    setShowModal(false);
    driverRef.current.reset();
  };

  const handleFinish = () => {
    setShowModal(false);
    driverRef.current.reset();
  };

  return (
    <>
      {showModal && (
        <div className="  flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
            <img src={allfounder} alt="Step visual" className="w-full mb-4" />
            <h2 className="text-xl font-bold mb-2 justify-center text-center">
              {steps[step].title}
            </h2>
            <p className="text-gray-700 mb-4 justify-center text-center">
              {steps[step].description}
            </p>
            <div className="flex justify-center mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === step ? "bg-blue-500" : "bg-gray-300"
                  }`}
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
                {step === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomTour;

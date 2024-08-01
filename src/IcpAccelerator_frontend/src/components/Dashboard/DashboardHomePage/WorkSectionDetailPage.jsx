import React from "react";
import WorkSectionImage from "../../../../assets/Logo/WorkSectionImage.png";
import WorkSectionImage2 from "../../../../assets/Logo/WorkSectionImage2.png";
import WorkSectionImage3 from "../../../../assets/Logo/WorkSectionImage3.png";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import ServiceDetailPageImage from "../../../../assets/Logo/ServiceDetailPageImage.png";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useState } from 'react';

const ServiceDetailPage = () => {

    const showcaseItems = [
    {
      img: WorkSectionImage,
    },
    {
      img: WorkSectionImage2,
    },
    {
      img: WorkSectionImage3,
    }
  ];

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-b border-gray-200">
        <button
          className="flex justify-between items-center w-full text-left py-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-lg font-semibold">{question}</span>
          {isOpen ? (
            <RemoveCircleOutlineOutlinedIcon className="text-gray-500" />
          ) : (
            <AddCircleOutlineOutlinedIcon className="text-gray-500" />
          )}
        </button>
        {isOpen && (
          <p className="mt-2 text-gray-600 pb-4">{answer}</p>
        )}
      </div>
    );
  };

  const FAQ = () => {
    const faqData = [
      {
        question: "Est quis ornare proin quisque lacinia ac tincidunt massa?",
        answer: "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla. Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla."
      },
      {
        question: "Gravida quis pellentesque mauris in fringilla?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        question: "Lacus iaculis vitae pretium integer?",
        answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }
    ];

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
        <div className="border-t border-gray-200">
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        <div className="sticky top-0 flex justify-between mb-6 bg-white p-4">
          <Link
            to="/dashboard/project"
            className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200"
          >
            <ArrowBackIcon className="mr-2" fontSize="small" />
            Back to profile
          </Link>
          <button className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            <ShareIcon className="mr-2" fontSize="small" />
            Share this
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto p-6">
            {/* Profile Card */}
            <div className="flex flex-col md:flex-row gap-8 ">
              <div className="rounded-lg shadow-sm border border-gray-200 w-full max-w-md sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="bg-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={ProfileImage}
                      alt="Matt Bowers"
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-bold">Matt Bowers</h2>
                      <span className="bg-[#ECFDF3] border border-[#ABEFC6] text-[#067647] text-xs font-medium px-2.5 py-0.5 rounded">
                        TALENT
                      </span>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold mb-4">
                    Landing page design for Startup Business
                  </h1>

                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                    Get it touch
                    <ArrowOutwardIcon
                      className="ml-1 transform"
                      fontSize="small"
                    />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-sm font-normal text-gray-500 mb-2">
                      ABOUT
                    </h3>
                    <p className="text-sm text-gray-600">
                      A tortor laoreet ac magna nibh. Bibendum augue neque
                      malesuada aliquam venenatis. Orci sed tortor vitae dolor.
                      Cum blandit non odio vestibulum pretium id scelerisque.
                      Lorem montes ornare vulputate egestas.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Feugiat nulla pellentesque arcu dignissim. Massa
                      ullamcorper at diam dui et dictum. Auctor eu interdum dis
                      ut. Enim amet gravida mattis ornare viverra velit. Nisi
                      lobortis diam massa in. Maecenas morbi volutpat vitae
                      euismod.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-normal text-gray-500 mb-2">
                      LINK
                    </h3>
                    <a
                      href="https://projectlink.com"
                      className="text-blue-600 hover:underline"
                    >
                      https://projectlink.com
                    </a>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-normal text-gray-500 mb-2">
                      SKILLS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white border border-[#CDD5DF] rounded-full text-gray-800 text-xs font-medium px-2.5 py-1.5">
                        UI/UX
                      </span>
                      <span className="bg-white border border-[#CDD5DF] rounded-full text-gray-800 text-xs font-medium px-2.5 py-1.5">
                        Web Design
                      </span>
                      <span className="bg-white border border-[#CDD5DF] rounded-full text-gray-800 text-xs font-medium px-2.5 py-1.5">
                        Frontend
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-normal text-gray-500 mb-2">
                      TOOLS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white border border-[#CDD5DF] rounded-full text-gray-800 text-xs font-medium px-2.5 py-1.5">
                        Figma
                      </span>
                      <span className="bg-white border border-[#CDD5DF] rounded-full text-gray-800 text-xs font-medium px-2.5 py-1.5">
                        React
                      </span>
                      <span className="bg-white border border-[#CDD5DF] rounded-full text-gray-800 text-xs font-medium px-2.5 py-1.5">
                        Photoshop
                      </span>
                      <span className="bg-white border border-[#CDD5DF] rounded-full text-gray-800 text-xs font-medium px-2.5 py-1.5">
                        Adobe CC
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-normal text-gray-500 mb-2">
                      RELEVANT SKILLS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white border border-[#CDD5DF] rounded-full text-gray-800 text-xs font-medium px-2.5 py-1.5">
                        Funding
                      </span>
                      <span className="bg-white border border-[#CDD5DF] rounded-full text-gray-800 text-xs font-medium px-2.5 py-1.5">
                        Tokenomics
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Landing page desing detailed card  */}
              <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">
                  Landing page design for Startup Business
                </h1>

                <div className="flex space-x-4 mb-6 border-b">
                  <button className="text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[2px]">
                    Summary
                  </button>
                  <button className="text-gray-500 pb-2">Reviews</button>
                </div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Deliverables</h2>
                  <p className="font-semibold mb-2">
                    Est quis ornare proin quisque lacinia ac tincidunt massa
                  </p>
                  <p className="text-gray-600 mb-4">
                    Est malesuada ac elit gravida vel aliquam nec. Arcu pelle
                    ntesque convallis quam feugiat non viverra massa fringilla.
                    Est malesuada ac elit gravida vel aliquam nec. Arcu pelle
                    ntesque convallis quam feugiat non viverra massa fringilla.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Showcase</h2>
                  {showcaseItems.map((item, index) => (
                    <div key={index} className="mb-8">
                      <div
                        className={`rounded-lg overflow-hidden shadow-lg ${item.bgColor}`}
                      >
                        <div className="p-4">
                          <img
                            src={item.img}
                            alt={`Landing page design ${index + 1}`}
                            className="w-full rounded-lg"
                          />
                        </div>
                      </div>
                      <p className="text-gray-600 mt-4">
                        Est malesuada ac elit gravida vel aliquam nec. Arcu
                        pelle ntesque convallis quam feugiat non viverra massa
                        fringilla. Est malesuada ac elit gravida vel aliquam
                        nec. Arcu pelle ntesque convallis quam feugiat non
                        viverra massa fringilla.
                      </p>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ServiceDetailPage;

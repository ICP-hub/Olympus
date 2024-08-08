import React, { useState } from 'react'
import eventbg from "../../../../assets/images/bg.png"
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import GuestProfile1 from "../../../../assets/Logo/GuestProfile1.png";
import CapacityGroupIcon from "../../../../assets/Logo/CapacityGroupIcon.png";
import StartDateCalender from "../../../../assets/Logo/StartDateCalender.png";
import StartTimeClock from "../../../../assets/Logo/StartTimeClock.png";
import PriceIcon from "../../../../assets/Logo/PriceIcon.png";
import { Close } from '@mui/icons-material';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import HomeSection6 from '../../Home/Homesection6';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

import ProfileImage from "../../../../assets/Logo/ProfileImage.png"
const EventDetails = () => {
  const [activeTab, setActiveTab] = useState('summary');

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-b border-gray-200">
        <button
          className="flex justify-between items-center w-full text-left py-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-base font-medium">{question}</span>
          {isOpen ? (
            <RemoveCircleOutlineOutlinedIcon className="text-[#9AA4B2]" />
          ) : (
            <AddCircleOutlineOutlinedIcon className="text-[#9AA4B2]" />
          )}
        </button>
        {isOpen && (
          <p className="mt-2 text-[#4B5565] font-normal text-sm pb-4">{answer}</p>
        )}
      </div>
    );
  };

  const FAQ = () => {
    const faqData = [
      {
        question: "What is a role, actually?",
        answer: "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla. Est malesuada ue convallis quam feugiat non viverra massa fringilla uada ue convallis quam feugiat non viverra massa fEst malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla. Est malesuada uequam feugiat non viverra massa. ",
      },
      {
        question: "How do roles work?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        question: "Can I change roles?",
        answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ];

    return (
      <div>
        <div className="text-[#121926] text-[18px] font-medium border-gray-200 ">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    );
  };

  const TabButton = ({ name, label }) => (
    <button
      className={`py-2 px-4 ${
        activeTab === name
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600"
      }`}
      onClick={() => setActiveTab(name)}
    >
      {label}
    </button>
  );

  const TabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-2">About</h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                A tortor laoreet at magna nibh. Bibendum augue neque
                malesuada aliquam venenatis.
              </li>
              <li>Feugiat nulla pellentesque eu augue dignissim.</li>
              <li>
                Diam gravida turpis fermentum ut est. Vulputate platea non
                ac elit massa.
              </li>
            </ul>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-2">Topics covered</h2>
              <p className="text-gray-700">
                Est quis ornare proin quisque lacinia ac tincidunt massa
              </p>
              <p className="text-gray-700 mt-2">
                Est malesuada ac elit gravida vel aliquam nec. Arcu velit
                netusque convallis quam feugiat non viverra massa fringilla.
              </p>
            </div>
            <hr className="border-gray-300 mt-4 mb-4" />
            <h2 className="text-2xl font-semibold mt-2">FAQ</h2>
            <FAQ className="-mt-4" />
          </div>
        );
      case 'announcements':
        return <div>Announcements content will be added here.</div>;
      case 'attendees':
        return <div>Attendees content will be added here.</div>;
      case 'reviews':
        return <div>Reviews content will be added here.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-start p-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Close />
        </button>
      </div>

      <div className="flex flex-col gap-10 md:flex-row">
        <div className="w-[400px] bg-white rounded-lg shadow-md">
          <div className="bg-gray-100 p-4">
            <div className="flex items-start mb-4">
              <img
                src={ProfileImage}
                alt="Matt Bowers"
                className="w-14 h-14 rounded-full mr-3"
              />
              <div>
                <h2 className="text-lg font-medium">Matt Bowers</h2>
                <span className="inline-block border border-[#FEDF89] bg-[#FFFAEB] text-[#B54708] text-xs px-2 py-0.5 rounded-md uppercase font-medium tracking-wide">
                  ORGANISER
                </span>
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-base font-medium mb-2 text-left">
                Event starts in
              </h3>
              <div className="flex items-center justify-between">
                {[
                  { value: "01", label: "Days" },
                  { value: "23", label: "Hours" },
                  { value: "44", label: "Minutes" },
                  { value: "45", label: "Seconds" },
                ].map((item, index) => (
                  <React.Fragment key={item.label}>
                    <div className="text-center">
                      <div className="text-xl font-bold bg-white rounded-lg p-2 min-w-[48px]">
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.label}
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="text-2xl font-bold mx-1">:</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-2 text-sm">
              Register{" "}
              <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
            </button>
            <button className="w-full border border-[#CDD5DF] bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-300 mb-2 text-sm">
              Contact organiser
            </button>

            <div className="text-center text-orange-500 font-medium text-sm">
              10 spots left
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-[12px] font-medium text-[#697586] mb-2">
                GUEST
              </h3>
              <div className="flex flex-wrap justify-start">
                {[...Array(11)].map((_, i) => (
                  <img
                    key={i}
                    src={GuestProfile1}
                    alt={`Guest ${i + 1}`}
                    className="w-8 h-8 rounded-full mr-1 mb-1"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-[#697586] text-[12px] block mb-2">
                  EVENT CATEGORY
                </span>
                <span className="bg-white font-medium border borer-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
                  Masterclass
                </span>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  CAPACITY
                </span>
                <div className="flex items-center">
                  <img
                    src={CapacityGroupIcon}
                    className="size-4 text-gray-400 mr-2 text-base"
                  />
                  <span className="text-gray-700">25-50</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  STATE DATE
                </span>
                <div className="flex items-center">
                  <img
                    src={StartDateCalender}
                    className="size-4 text-gray-400 mr-2 text-base"
                  />
                  <span className="text-gray-700">July 15, 2024</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  END DATE
                </span>
                <div className="flex items-center">
                  <img
                    src={StartDateCalender}
                    className="size-4 text-gray-400 mr-2 text-base"
                  />
                  <span className="text-gray-700">July 17, 2024</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  START TIME
                </span>
                <div className="flex items-center">
                  <img
                    src={StartTimeClock}
                    className="size-4 text-gray-400 mr-2 text-base"
                  />
                  <span className="text-gray-700">15:00 GMT+4</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  PRICE
                </span>
                <div className="flex items-center">
                  <img
                    src={PriceIcon}
                    className="size-4 text-gray-400 mr-2 text-base"
                  />
                  <span className="text-gray-700">$100</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  ACCEPTED CURRENCIES
                </span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  <span className="bg-white border borer-[#CDD5DF] font-medium text-[#364152] px-2 py-1 rounded-full text-sm">
                    ICP
                  </span>
                  <span className="bg-white border borer-[#CDD5DF] font-medium text-[#364152] px-2 py-1 rounded-full text-sm">
                    USD
                  </span>
                  <span className="bg-white border borer-[#CDD5DF] font-medium text-[#364152] px-2 py-1 rounded-full text-sm">
                    ETH
                  </span>
                  <span className="bg-white border borer-[#CDD5DF] font-medium text-[#364152] px-2 py-1 rounded-full text-sm">
                    BTC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 ml-auto overflow-auto w-[652px]">
          <div className="p-4">
            <img
              src={eventbg}
              alt="Event"
              className="w-full rounded-lg h-[310px] object-cover"
            />
            <h1 className="text-3xl font-bold mt-4">
              Masterclass: How to build a robust community
            </h1>
            <div className="flex items-center mt-2 text-gray-600">
              <span className="mr-2">2 days</span>
              <span className="mr-2">
                <img src={PriceIcon} className="size-5 font-bold" alt="Price icon" />
              </span>
              <span>$100</span>
            </div>
            <div className="mt-4">
              <div className="border-b border-gray-300 mb-4">
                <TabButton name="summary" label="Summary" />
                <TabButton name="announcements" label="Announcements" />
                <TabButton name="attendees" label="Attendees" />
                <TabButton name="reviews" label="Reviews" />
              </div>
              <TabContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
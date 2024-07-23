import React from "react";
import Sidebar from "../../Layout/SidePanel/Sidebar";
import project from "../../../../assets/images/project.png";
import Bottombar from "../../Layout/BottomBar/Bottombar";
import Footer from "../../Footer/Footer";
import p5 from "../../../../assets/Founders/p5.png";
import { deleteBtn } from "../../Utils/Data/SvgData";
const Notification = () => {

  const data = [
    {
      name: 'Mona Lisa',
      description: 'PANONY was established in March 2018 with operations in Greater China, South Korea and the U.S. Both founders are Forbes Asia 30 under 30 honorees.',
      image: p5
    },
    {
      name: 'Mona Lisa',
      description: 'PANONY was established in March 2018 with operations in Greater China, South Korea and the U.S. Both founders are Forbes Asia 30 under 30 honorees.',
      image: p5
    },
    {
      name: 'Mona Lisa',
      description: 'PANONY was established in March 2018 with operations in Greater China, South Korea and the U.S. Both founders are Forbes Asia 30 under 30 honorees.',
      image: p5
    },
  ];

  const renderedItems = data.map((item, index) => (
    <div key={index} className="flex flex-row items-center gap-4 mt-4">
      <div className="md:w-3.5 w-10 h-3.5 rounded-sm border-indigo-400 border-2"></div>
      <img
        className="md:w-10 md:h-10 h-10 w-10 rounded-full object-cover"
        src={item.image}
        alt={item.name}
      />
      <div className="justify-between flex-col flex">
        <p className="font-bold text-black text-lg">{item.name}</p>
        <p className="text-sm text-black line-clamp-3">{item.description}</p>
      </div>
    </div>
  ));
  return (
    <section className="bg-gray-100 w-full h-full lg1:px-[2%] py-[2%] px-[5%]">
      <div className="flex flex-grow ml-8 z-1 ">
        <div className=" flex flex-col w-full ">
          <div className="w-full pr-6 ">
            <div className="flex flex-row justify-between">
              <h1 className="font-bold text-3xl font-fontUse text-indigo-800">Notification</h1>
              <button className="font-bold">
               {deleteBtn}
              </button>
            </div>
            {renderedItems}
          </div>
        </div>
      </div>
      {/* </div> */}
    </section>
  );
};

export default Notification;

import React, { useState, useEffect } from "react";
import {
  Memberssvg,
  linkedInSvg,
  twitter,
  twitterSvg,
} from "../Utils/Data/SvgData";

const Members = () => {
  const cardData = [
    {
      id: 1,
      type: 'vc',
      name: "SamyKarim",
      role: "Toshi, Managing Partner. Ex-Binance",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
    {
      id: 2,
      type: 'mentor',
      name: "SamyKarim",
      role: "Toshi, Managing Partner. Ex-Binance",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
    {
      id: 3,
      type: 'mentor',
      name: "SamyKarim",
      role: "Toshi, Managing Partner. Ex-Binance",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
    {
      id: 4,
      type: 'user',
      name: "SamyKarim",
      role: "Toshi, Managing Partner. Ex-Binance",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
  ];
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isfourpopup, setIsfourpopup] = useState(false);
  const [data, setData] = useState({
    name: "",
    userName: "",
    role: "",
  });
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  // console.log('isPopupOpen =>', isPopupOpen)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isPopupOpen || isfourpopup) {
        setIsPopupOpen(false);
        setIsfourpopup(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isPopupOpen, isfourpopup]);

  const handleUpdateButtonClick = (e) => {
    e.preventDefault();
    // console.log('1')
    setIsPopupOpen(false);
    // console.log('2')

    console.log(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // console.log('re-run')
  return (
    <div className="md1:flex flex-wrap">
      {cardData.map((data) => (
        <div className="w-[100%] md1:w-[calc(100%/2-10px)] dxl:w-[calc(100%/3-10px)] xl2:w-[calc(25%-10px)] rounded-[10px] shadow-lg md:m-1 p-4">
          <div className="flex w-full justify-between">
            <div className="p-[3px] rounded-full flex bg-blend-overlay "
              style={{
                boxSizing: "border-box",
                background: `url(${data.imageUrl}) center / cover, linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                backdropFilter: "blur(20px)",
              }}
            >
              {" "}
              <img
                className="rounded-full object-cover w-20 h-20"
                src={data.imageUrl}
                alt={data.name}
              />
            </div>
            <div className="flex gap-3">
              <div className="w-4 h-4">
                {linkedInSvg}
              </div>
              <div className="w-4 h-4">
                {twitterSvg}
              </div>
            </div>
            {/* <div onClick={togglePopup}>
              {Memberssvg}
            </div> */}
          </div>
          <span className="text-sm font-bold text-gray-500 mb-2 px-4 uppercase">{data?.type}</span>

          <div className="px-6 pt-4 pb-4 sm:pb-2 md:pb-0">
            <div className="font-bold text-xl mb-2">{data.name}</div>
            <p className="text-gray-700 text-base">{data.role}</p>
          </div>
          {/* <div className="flex justify-end ">
            <div className="flex gap-4">
              <div className="w-4 h-4">
                {linkedInSvg}
              </div>
              <div className="w-4 h-4">
                {twitterSvg}
              </div>
            </div>
          </div> */}
          {/* <div className="flex justify-between">
            <div className="flex justify-between flex-col">
              <div>
                <div
                  className="absolute p-[3px] rounded-full  bg-blend-overlay"
                  style={{
                    boxSizing: "border-box",
                    background: `url(${data.imageUrl}) center / cover, linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {" "}
                  <img
                    className="rounded-full object-cover w-20 h-20"
                    src={data.imageUrl}
                    alt={data.name}
                  />
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{data.name}</div>
                <p className="text-gray-700 text-base">{data.role}</p>
              </div>
            </div>
            <div className="flex flex-col pr-3 justify-between">
              <div className="mb-20" onClick={togglePopup}>
                {Memberssvg}
              </div>
              <div>{twitter}</div>
            </div>
          </div> */}
        </div>
      ))}
      {/* {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center  w-full">
          <div className=" bg-gray-200 shadow-md rounded-lg overflow-hidden">
            <form onSubmit={handleUpdateButtonClick} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <button className="px-2 py-2 text-black font-bold lg:text-2xl md:text-xl text-lg">
                  Edit Profile
                </button>
              </div>
              <div className="mt-4 ">
                <img
                  className="rounded-full mx-auto lg:md:h-28 lg:md:w-28 w-32 h-32 sm:w-20 sm:h-20 "
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                  alt="User Avatar"
                />
               
                <input
                  className="w-full border-2 mt-4 border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500"
                  type="text"
                  placeholder="Name"
                  name="name"
                  onChange={handleChange}
                  value={data.name}
                />
              
                <input
                  className="w-full px-4 py-2 mt-4 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  type="text"
                  placeholder="Username"
                  name="userName"
                  onChange={handleChange}
                  value={data.userName}
                />
               
                <input
                  className="w-full px-4 py-2 mt-4 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  type="text"
                  placeholder="Role in project"
                  name="role"
                  onChange={handleChange}
                  value={data.role}
                />
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  className="px-4 mt-4 py-2 bg-blue-900 text-white rounded-lg focus:outline-none focus:bg-blue-800"
                >
                  Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Members;

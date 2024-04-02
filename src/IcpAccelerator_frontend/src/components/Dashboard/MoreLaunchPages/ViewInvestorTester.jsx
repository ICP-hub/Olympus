import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";

// Importing images
import image from "../../../../assets/images/samya.jpg";
import girl from "../../../../assets/images/girl.jpeg";
const investors = [
  {
    id: 1,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: ["SRE", "Observability ", "Kubernetes"],
  },
  {
    id: 2,
    image: image,
    name: "QuadB",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Reliability Engineer and DevOps",
  },
  {
    id: 2,
    image: image,
    name: "pcte",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Reliability Engineer and DevOps",
  },
  {
    id: 2,
    image: image,
    name: "sahil",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Tech Growth Fund",
  },
  {
    id: 2,
    image: image,
    name: "djjhi",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Innovate Ventures",
  },
];

const ViewInvestor = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);
  const actor = useSelector((currState) => currState.actors.actor);

  const getAllInvestors = async (caller) => {
    await caller
      .list_all_vcs()
      .then((result) => {
        console.log("result-in-get-all-investors", result);
        if (!result || result.length === 0) {
          setNoData(true);
          setData([]);
        } else {
          setNoData(false);
          setData(result);
        }
      })
      .catch((error) => {
        setNoData(true);
        setData([]);
        console.log("error-in-get-all-investors", error);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllInvestors(actor);
    } else {
      getAllInvestors(IcpAccelerator_backend);
    }
  }, [actor]);

  return (
    <div className="px-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
      <div className="flex flex-col text-center items-center justify-center">
        <div className="py-8">
          <h2 className="text-[40px] font-black leading-10 bg-gradient-to-r from-[#7283EA] to-[#4087BF] bg-clip-text text-transparent transform">
            Our{" "}
            <span className=" bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text text-transparent transform">
              Investors
            </span>
          </h2>
        </div>
        <div className="flex items-center relative md1:w-1/2 sm1:w-3/4 w-full p-2 mb-8 border border-[#737373] rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search by company, skills or role"
            className="flex-grow bg-transparent rounded focus:outline-none"
          />
          <button className="md1:block absolute hidden right-0 bg-[#3505B2] font-black text-xs text-white px-4 py-2 mr-1 rounded-md focus:outline-none">
            Search Investor
          </button>
          <button className="block absolute md1:hidden right-0 bg-transparent font-black text-xs text-[#3505B2] px-4 py-2 mr-1 rounded-md focus:outline-none">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {investors.map((investor) => (
          <div className="w-full p-4" key={investor.id}>
            <div className="shadow-md rounded-lg overflow-hidden border-2 drop-shadow-2xl gap-4 bg-white">
              <img
                className="h-26 w-[20px] mx-auto rounded-3xl p-4"
                src={investor.image}
                alt="not found"
              />
              <div className="flex justify-end mr-2">
                <p className="text-gray-300 font-bold text-md">
                  {investor.company}
                </p>
              </div>

              <div className="ml-2">
                <div className="text-2xl text-black flex flex-row space-x-2">
                  <div></div>
                  <img
                    className="w-14 h-14 rounded-md"
                    src={investor.image}
                    alt="No img"
                  />
                  <div className="flex flex-col text-[15px]">
                    <h3 className="font-bold">{investor.name}</h3>
                    <p className="mt-[-2px]">{investor.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[#6B7280] mt-2 ">
                    Description of the investor...
                  </p>
                </div>
                <div className="flex justify-center mb-2">
                  <p className="font-extrabold text-black text-xl">
                    Amount Invested
                  </p>
                </div>
                <div className="bg-[#B8B8B8] rounded-md flex justify-center mr-2">
                  <button className="text-extrabold flex justify-center px-2 py-2 text-[#4E5999] font-bold ">
                    $ 10000 USD
                  </button>
                </div>
                <div className="flex mt-4 text-sm bg-[#3505B2] rounded-md justify-center mr-2 ">
                  {/* <button className=" flex justify-center items-center text-white px-4 py-2 font-bold ">See projects</button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewInvestor;

import React, { useEffect, useState } from "react";
import image from "../../../../assets/images/samya.jpg";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
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
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Reliability Engineer and DevOps",
  },
  {
    id: 2,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Reliability Engineer and DevOps",
  },
  {
    id: 2,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Tech Growth Fund",
  },
  {
    id: 2,
    image: image,
    name: "SamyKarim",
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
        if (!result || result.length == 0) {
          setNoData(true);
          setData(investors);
        } else {
          setNoData(false);
          setData(result);
        }
      })
      .catch((error) => {
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
      {data.map((investor, index) => {
        let id = "";
        let img = "";
        let name = "";
        let company = "";
        let role = "";
        if(noData){
            id = investor.id;
            img = investor.image;
            name = investor.name;
            // company = investor.company;
            company = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt cumque saepe laborum, quis error harum ad quo, nobis alias explicabo tempora. Error voluptates laudantium assumenda eum ipsum non ullam veritatis.";
            role = investor.role;
        }else{
            id = investor[1]?.vc_profile?.uid;
            img = uint8ArrayToBase64(
              investor[1]?.vc_profile?.params?.user_data?.profile_picture[0]
            );
            name = investor[1]?.vc_profile?.params?.user_data?.full_name;
            // company = investor[1]?.vc_profile?.params?.name_of_fund;
            company = investor[1]?.vc_profile?.params?.user_data?.bio[0];
            role = "Investor";
        }

        return (
            <div className="" key={index}>
            <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full p-4">
                <div className="shadow-md rounded-lg overflow-hidden  drop-shadow-2xl gap-2 bg-[#C1CAFF]">
                    <div className='flex flex-col sm:flex-row gap-6 p-2'>
                        <img className='w-full sm:w-[300.53px] rounded-md h-auto sm:h-[200.45px] flex lg:items-center lg:justify-center  ' src={img} alt="alt" />
                        <div className='flex flex-col w-full'>
                            <h1 className="text-black text-2xl font-extrabold">{name}</h1>
                            <p className="text-[#737373]">{role}</p>
                            <div className='flex flex-wrap rounded-full mt-6 text-[#737373] justify-center'>
                                <p className=''>{company}</p>
                            </div>

                            <div className='w-100px border-2 text-gray-900 mt-2'></div>
                            <div className='flex justify-end mt-6 xl:mr-8'>
                                <button className=' font-bold py-2 px-4 bg-white text-[#7283EA] rounded-md'>
                                    Reach Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
      })}
    </div>
    </div>
  );
};

export default ViewInvestor;

import React from "react";
import heroImage from "../../../assets/images/banner_1.png";
import df_logo from "../../../assets/Logo/df_logo.png";
import Backgroundpattern from "../../../assets/images/Backgroundpattern.png";

import HalfAstro from "../../../assets/images/astroRegular.png";
import FullAstro from "../../../assets/images/astro1.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate,Link } from "react-router-dom";
const HeroSection = () => {
  return (
    <section className="bg-[#FEF5EE] pt-12">
      <div className="container mx-auto" style={{
        backgroundImage: `url(${Backgroundpattern})`,
        backgroundPosition: 'center', 
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat' 
      }}>
        <div className="max-w-6xl w-full py-8 px-4 sm:px-6 lg:px-8  mx-auto "   >
          <div className="flex flex-col md:flex-row  justify-evenly">
            <div className="">
              <div className=" max-w-[704px]">
                <div className="flex gap-2 mb-4">
                  <span className="text-[#121926] text-xl font-normal">
                    Backed by
                  </span>
                  <img
                    src={df_logo}
                    alt="Backed by Dfinity"
                    className=" mb-4"
                  />
                </div>
                <h1 className="text-7xl  font-bold text-[#121926] ">
                  Peak of{" "}
                  <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Web3
                  </span>{" "}
                  Acceleration
                </h1>
                <p className="mt-4 text-xl font-medium text-[#364152] max-w-[640px] ">
                  OLYMPUS is the first on-chain Web3 acceleration platform
                  connecting founders, investors, mentors and talents across
                  different ecosystems.
                </p>
                <Link
                  to={"/sign-up"}
                  className="inline-block px-5 py-3 mt-6 text-white bg-blue-600 rounded-[4px]  hover:bg-blue-700"
                >
                  Get started <ArrowForwardIcon />
                </Link>
              </div>
            </div>
            <div className="w-1/2 flex justify-center items-center">
              {/* <img
                src={Backgroundpattern}
                alt="Astronaut"
                className={` w-[500px] md:w-[400px] sm:w-[300px] sxs:w-[295px] object-cover object-center`}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

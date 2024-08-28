import React from "react";

import { useNavigate } from "react-router-dom";
import { closeSwitchBlackModalSvg } from "../Utils/Data/SvgData";
import { useAuth } from "../../components/StateManagement/useContext/useAuth";
import { useDispatch } from "react-redux";
import { removeActor } from "../../components/StateManagement/Redux/Reducers/actorBindReducer";

const DetailHeroSection = () => {
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const routeSettings = {
    "/create-project": {
      src: '',
      alt: "Astronaut",
      className:
        "z-10 w-[500px] md:w-[275px] sm:w-[200px] sxs:w-[200px] sxs:h-[180px] md:h-64 relative  sxs:-right-3 right-16 md:right-8 sm:right-4 top-10 object-contain",
      text: "Signup as a project",
    },
    "/create-mentor": {
      src: '',
      alt: "Astronaut",
      className:
        "z-10 w-[500px] md:w-[270px] sm:w-[250px] sxs:w-[160px] md:h-56 relative  sxs:-right-3 right-16 md:right-0 sm:right-0 top-10 object-contain",
      text: "Sign Up As Mentor",
    },
    "/create-investor": {
      src: '',
      alt: "Astronaut",
      className:
        "z-10 w-[500px] md:w-[250px] sm:w-[250px] sxs:w-[160px] md:h-56 relative  sxs:-right-3 right-16 md:right-0 sm:right-0 top-10 object-contain",
      text: "Sign Up As INVESTOR",
    },
    "/create-user": {
      src: '',
      alt: "Astronaut",
      className:
        "z-10 w-[500px] md:w-[250px] md:h-[210px] sm:w-[250px] sxs:w-[170px] md:h-56 relative sxs:-right-3 right-16 md:right-0 sm:right-0 top-10",
      text: "Sign Up As User",
    },
    "/cohort-form": {
      src: Event,
      alt: "Astronaut",
      className:
        "z-10 w-[500px] md:w-[250px] md:h-[210px] mt-16 sm:w-[250px] sxs:w-[170px] md:h-56 relative sxs:-right-3 right-16 md:right-0 sm:right-0 top-10",
      text: "Start a Cohort",
    },
  };
  const currentRouteSettings = routeSettings[location.pathname];

  if (!currentRouteSettings) {
    return null; // or any default content
  }

  const navigate = useNavigate();
  const { src, alt, className, text } = currentRouteSettings;

  const handleNavigate = () => {
    if (window.location.pathname.includes("/create-user")) {
      logout();
      dispatch(removeActor());
    }
    navigate(-1);
  };
  return (
    <>
      <section className="text-black bg-gray-100">
        <div className="w-full px-[4%] lg1:px-[5%]">
          <div className="flex flex-col space-y-4">
            <span
              className="p-2 cursor-pointer"
              onClick={() => handleNavigate()}
            >
              {closeSwitchBlackModalSvg}
            </span>
            <div className="flex justify-center  lg:flex-row lg:justify-between items-center md:flex-col-reverse sxs:flex-col-reverse ">
              <div className="relative lg:static sxs:top-20 md:-left-24 md:top-20 lg:top-24 lg:-left-32 sm:-left-12">
                {/* <div className="w-[500px] xl2:w-[900px] xl:w-[700px] dxl:w-[630px] lgx:w-[600px] lg1:w-[550px] dlg:w-[525px] lg:w-[500px] md3:w-[470px] md2:w-[460px] md1:w-[450px]  md:w-[440px] sm:w-[430px] sm3:w-[400px] sm2:w-[390px] sm4:w-[380px] sm1:w-[360px] xxs1:w-[340px] xxs:w-[310px] dxs:w-[290px] ss4:w-[280px] ss3:w-[270px] ss2:w-[260px] ss1:w-[250px] ss:w-[240px] sxs3:w-[230px] sxs2:w-[220px] sxs1:w-[210px] sxs:w-[200px] sxxs:w-[190px]  h-[380px] left-[400px] top-[100px] absolute bg-fuchsia-800 rounded-full blur-[169px] xl2:left-[260px] xl:left-[280px] dxl:left-[230px] lgx:left-[200px] lg1:left-[180px] dlg:left-[170px] lg:left-[160px] md3:left-[150px] md2:left-[140px] md1:left-[130px] md:left-[120px] sm:left-[110px] sm3:left-[70px] sm2:left-[60px] sm4:left-[50px] sm1:left-[50px] xxs1:left-[45px] xxs:left-[40px] dxs:left-[35px] ss4:left-[30px] ss3:left-[25px] ss2:left-[20px] ss1:left-[15px] ss:left-[15px] sxs3:left-[15px] sxs2:left-[10px] sxs1:left-[10px] sxs:left-[5px] sxxs:left-[5px]"></div> */}
                <h1 className="left-[19px] pb-2 bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-2xl sm:text-3xl md:text-3xl lg:text-5xl xl:text-7xl 2xl:text-8xl font-fontUse font-bold">
                  {text}
                </h1>

                <div className="line-clamp-2 text-black text-[14.5px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[19px] 2xl:text-[20px] top-[95px] sm:top-[140px] md:top-[160px] lg:top-[163px] xl:top-[168px] 2xl:top-[170px] left-[20px] font-extrabold font-circular">
                  Supercharging Web3 startups
                  <br></br> for breakthrough success
                </div>

                {/* <button className="rounded-md my-2 bg-indigo-600 absolute w-[210px] left-[19px] top-[210px] xl2:top-[209.5px] xl:top-[225px] dxl:top-[225px] lgx:top-[220px] lg1:top-[215px] dlg:top-[215px] lg:top-[210px] md3:top-[210px] md2:top-[205px] md1:top-[205px] md:top-[204.5px] sm:top-[204px] sm3:top-[195px] sm2:top-[190px] sm4:top-[185px] sm1:top-[185px] xxs1:top-[191px] xxs:top-[191px] dxs:top-[191px] ss4:top-[151px] ss3:top-[150px] ss2:top-[145px] ss1:top-[160px] ss:top-[155px] sxs3:top-[140px] sxs2:top-[140px] sxs1:top-[190px] sxs:top-[135px] sxxs:top-[135px]">
                <div className=" text-[13px] xl2:text-[12.8px] xl:text-[12.5px] dxl:text-[12.3px] lgx:text-[12px] lg1:text-[11.8px] dlg:text-[11.5px] lg:text-[11.3px] md3:text-[11px] md2:text-[10.8.5px] md1:text-[10.5px] md:text-[10.3px] sm:text-[10px] sm3:text-[9.8px] sm2:text-[9.5px] sm4:text-[9.5px] sm1:text-[9.5px] xxs1:text-[9.5px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] text-center text-white border-b font-fontUse uppercase px-4 font-bold py-2 break-normal">
                  apply for the program
                </div>
              </button> */}
              </div>
              <div className="flex">
                <div className="relative flex justify-center items-center">
                  <img src={src} alt={alt} className={className} />
                  <div className="absolute top-[20px] -left-[10%] sm:-left-[18%] md:-left-[14%] sxs:left-[6%] w-[320px] h-[320px] md:w-[280px] md:h-[280px] sm:w-[230px] sm:h-[230px] sxs:w-[200px] sxs:h-[200px] rounded-full bg-gradient-to-r from-purple-300/40 to-purple-600"></div>
                  <div className="absolute top-[200px]  sxs:top-[130px] left-[65%] sxs:left-[65%] w-[164px] h-[164px] md:w-[124px] md:h-[124px] sm:w-[94px] sm:h-[94px] sxs:w-[110px] sxs:h-[110px] rounded-full bg-gradient-to-r from-purple-900 to-blue-500 opacity-30"></div>
                  <div className="absolute top-[120px] left-[45%] sxs:left-[53%] w-[190px] h-[200px] md:w-[140px] md:h-[150px] sm:w-[100px] sm:h-[110px] sxs:w-[120px] sxs:h-[120px] bg-gradient-to-b from-white/30 to-transparent rounded-lg backdrop-blur-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailHeroSection;

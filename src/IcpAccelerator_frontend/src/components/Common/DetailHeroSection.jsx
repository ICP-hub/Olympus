import React from 'react'
import DetailStatisticCard from './DetailStatisticCard'
import astro1 from "../../../assets/images/astro1.png"
import HalfAstro from "../../../assets/images/astroRegular.png";
import { useEffect, useState } from 'react'

const DetailHeroSection = () => {

    const [translate, setTranslate] = useState('translate-y-0');

    useEffect(() => {
        const intervalId = setInterval(() => {
          setTranslate(prevTranslate => 
            prevTranslate === 'translate-y-2' ? 'translate-y-5' : 'translate-y-2'
          );
        }, 1000);
        return () => clearInterval(intervalId);
      }, []);


  return (
    <section className="text-black body-font bg-violet-800 ">
        <div className="w-full px-[4%] lg1:px-[5%]">
          <div className="w-full h-[600px] dxl:h-[500px] relative">
          <div className="w-[500px] xl2:w-[900px] xl:w-[700px] dxl:w-[630px] lgx:w-[600px] lg1:w-[550px] dlg:w-[525px] lg:w-[500px] md3:w-[470px] md2:w-[460px] md1:w-[450px]  md:w-[440px] sm:w-[430px] sm3:w-[400px] sm2:w-[390px] sm4:w-[380px] sm1:w-[360px] xxs1:w-[340px] xxs:w-[310px] dxs:w-[290px] ss4:w-[280px] ss3:w-[270px] ss2:w-[260px] ss1:w-[250px] ss:w-[240px] sxs3:w-[230px] sxs2:w-[220px] sxs1:w-[210px] sxs:w-[200px] sxxs:w-[190px]  h-[380px] left-[400px] top-[100px] absolute bg-fuchsia-800 rounded-full blur-[169px] xl2:left-[260px] xl:left-[280px] dxl:left-[230px] lgx:left-[200px] lg1:left-[180px] dlg:left-[170px] lg:left-[160px] md3:left-[150px] md2:left-[140px] md1:left-[130px] md:left-[120px] sm:left-[110px] sm3:left-[70px] sm2:left-[60px] sm4:left-[50px] sm1:left-[50px] xxs1:left-[45px] xxs:left-[40px] dxs:left-[35px] ss4:left-[30px] ss3:left-[25px] ss2:left-[20px] ss1:left-[15px] ss:left-[15px] sxs3:left-[15px] sxs2:left-[10px] sxs1:left-[10px] sxs:left-[5px] sxxs:left-[5px]"></div>
            <h1 className="left-[19px] top-[60px] absolute text-white text-[90px] xl2:text-[88px] xl:text-[85px] dxl:text-[82px] lgx:text-[80px] lg1:text-[78px] dlg:text-[75px] lg:text-[72px] md3:text-[70px] md2:text-[68px] md1:text-[65px] md:text-[63px] sm:text-[60px] sm3:text-[58px] sm2:text-[55px] sm4:text-[53px] sm1:text-[50px] xxs1:text-[48px] xxs:text-[45px] dxs:text-[43px] ss4:text-[40px] ss3:text-[37px] ss2:text-[35px] ss1:text-[33px] ss:text-[30px] sxs3:text-[25px] sxs2:text-[25px] sxs1:text-[25px] sxs:text-[25px] sxxs:text-[25px] font-fontUse font-bold">
              ACCELERATE
            </h1>
            <div className="text-white text-[20px] xl2:text-[19.5px] xl:text-[19px] dxl:text-[18.5px] lgx:text-[18px] lg1:text-[17.5px] dlg:text-[17px] lg:text-[16.5px] md3:text-[16px] md2:text-[15.5px] md1:text-[15px] md:text-[14.5px] sm:text-[15px] sm3:text-[15px] sm2:text-[14px] sm4:text-[13.5px] sm1:text-[13px] xxs1:text-[12.5px] xxs:text-[12px] dxs:text-[12px] ss4:text-[12px] ss3:text-[12px] ss2:text-[12px] ss1:text-[12px] ss:text-[12px] sxs3:text-[12px] sxs2:text-[12px] sxs1:text-[12px] sxs:text-[12px] sxxs:text-[12px] top-[170px] xl2:top-[169px] xl:top-[168px] dxl:top-[167px] lgx:top-[166px] lg1:top-[165px] dlg:top-[164px] lg:top-[163px] md3:top-[162px] md2:top-[161px] md1:top-[160px] md:top-[159px] sm:top-[158px] sm3:top-[145px] sm2:top-[140px] sm4:top-[140px] sm1:top-[136px] xxs1:top-[132px] xxs:top-[130px] dxs:top-[130px] ss4:top-[120px] ss3:top-[120px] ss2:top-[110px] ss1:top-[110px] ss:top-[110px] sxs3:top-[100px] sxs2:top-[100px] sxs1:top-[95px] sxs:top-[95px] sxxs:top-[95px] left-[20px] font-normal font-circular absolute">
              Supercharging Web3 startups for breakthrough success
            </div>
            
            <div className='right-[149px] md:right-[110px] md:top-[-35px] top-[32px] absolute'>
                <img src={HalfAstro} alt='HalfAstro'className={` bottom-[8px] md:bottom-0  h-[260px] hidden md:block transition-transform duration-1000 ease-in-out transform ${translate}`}/>
                <img src={astro1} alt="astro" className={` md:hidden right-[-165px] md:right-0 transition-transform duration-1000 ease-in-out transform z-20 w-[500px] relative  object-contain  md:top-[200px] top-[110px] ${translate} `}/>
            </div>
            <div className='top-[250px]'>
                <DetailStatisticCard/>
            </div>
            
          </div>
        </div>
      </section>
  )
}

export default DetailHeroSection
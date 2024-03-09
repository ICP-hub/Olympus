import React from "react";
// import Header from '../Layout/Header/Header'
import HomeHeroSection from "../../../../IcpAccelerator_frontend/src/components/Common/HomeHeroSection";
import HomeSection2 from "./HomeSection2";
import HomeSection3 from "./HomeSection3";
// import FooterWithSubmitSection from "../Footer/SubmitSection";
// import ConnectWallet from '../../models/ConnectWallet'
// import { useSelector } from 'react-redux'

const Home = () => {
  return (
    <>
      <HomeHeroSection />
      <HomeSection2 />
      <HomeSection3 />
      {/* < ConnectWallet isModalOpen={isModalOpen} onClose={() => setModalOpen(false)}/> */}
    </>
  );
};

export default Home;

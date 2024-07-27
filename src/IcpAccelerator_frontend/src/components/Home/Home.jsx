import React, { useState } from 'react'
import HeroSection from "./Hero"
import Section2 from "./Section2"
import HomeSection3 from './HomeSection3'
import HomeSection4 from './HomeSection4'
import HomeSection5 from './HomeSection5'
import HomeSection6 from './Homesection6'
import TestimonialSection from './HomeTestiomonialSection'
import Modal1 from '../Modals/Project Modal/modal1'
import CreateProjectModal from '../Modals/Project Modal/modal2'
import CreateProjectModal2 from '../Modals/Project Modal/modal3'
import DashboardModal1 from "../Modals/Dashboard Modal/Dashboardmodal1"
import ExpertiseModal from "../Modals/Founder Modal/Foundermodal1"
import Foundermodal2 from '../Modals/Founder Modal/Foundermodal2'
import Foundermodal3 from '../Modals/Founder Modal/Foundermodal3'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      {/* <ExpertiseModal isOpen={isModalOpen} onClose={handleClose} /> */}
      {/* <Foundermodal2 /> */}
      <Foundermodal3 />

      {/* <DashboardModal1 isOpen={isModalOpen} onClose={handleClose} /> */}
      {/* <Modal1 /> */}
      {/* <CreateProjectModal /> */}
      {/* <CreateProjectModal2 /> */}
      <HeroSection />
      <Section2 />
      <HomeSection3 />
      <HomeSection4 />
      <HomeSection5 />
      <TestimonialSection />
      <HomeSection6 />
    </>
  )
}

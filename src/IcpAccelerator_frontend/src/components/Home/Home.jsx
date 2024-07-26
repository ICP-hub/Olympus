import React from 'react'
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

export default function Home() {
  return (
    <>
      <Modal1 />
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

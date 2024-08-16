import React, { useState } from 'react'
import HeroSection from "./Hero"
import Section2 from "./HomeSection2"
import HomeSection3 from './HomeSection3'
import HomeSection4 from './HomeSection4'
import HomeSection5 from './HomeSection5'
import HomeSection6 from './Homesection6'
import TestimonialSection from './HomeTestiomonialSection'


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>






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

import React, { useState } from "react";
import DetailHeroSection from "../Common/DetailHeroSection";
import FounderRegistration from "./FounderRegistration/FounderRegistration";
import { useSelector } from "react-redux";
import MentorRegistration from "./MentorRegistration/MentorRegistration";
import InvestorRegistration from "./InvestorRegistration/InvestorRegistration";
import HubRegistration from "./IcpHubRegistration/HubRegistration";
import { useLocation } from "react-router-dom";
import Founder from "../../../assets/images/founderRegistration.png";
import Mentor from "../../../assets/images/mentorRegistration.png";
const AllDetailsForm = () => {
  const actor = useSelector((currState) => currState.actors.actor);

  const location = useLocation();
  const { roleId, roleName } = location.state;

  // console.log('rolename and roleid in alldetailform =============>', roleId,roleName)

  const renderComponent = (roleName) => {
    // console.log(roleName , "<== roleName inside renderComponent")
    switch (roleName) {
      case "Project":
        return <FounderRegistration />;
      case "Mentor":
        return <MentorRegistration />;
      case "ICPHubOrganizer":
        return <HubRegistration />;
      case "VC":
        return <InvestorRegistration />;
      default:
        return null;
    }
  };

  const renderImage = (roleName) => {
    switch (roleName) {
      case "Project":
        return (
          <img
            src={Founder}
            alt="Astronaut"
            className={`z-20 w-[500px] md:w-[350px] sm:w-[300px] sxs:w-[295px] md:h-64 relative  sxs:-right-3 right-16 md:right-8 sm:right-4 top-10`}
          />
        );
      case "Mentor":
        return (
          <img
            src={Mentor}
            alt="Astronaut"
            className={`z-20 w-[500px] md:w-[300px] sm:w-[250px] sxs:w-[260px] md:h-56 relative  sxs:-right-3 right-16 md:right-0 sm:right-0 top-10`}
          />
        );
      case "ICPHubOrganizer":
        return (
          <img
            src={Founder}
            alt="Astronaut"
            className={`z-20 w-[500px] md:w-[350px] sm:w-[300px] sxs:w-[295px] md:h-64 relative  sxs:-right-3 right-16 md:right-8 sm:right-4 top-10`}
          />
        );
      case "VC":
        return (
          <img
            src={Mentor}
            alt="Astronaut"
            className={`z-20 w-[500px] md:w-[300px] sm:w-[250px] sxs:w-[260px] md:h-56 relative  sxs:-right-3 right-16 md:right-0 sm:right-0 top-10`}
          />
        );
      default:
        return null;
    }
  };

  const currentForm = renderComponent(roleName);

  const HeroImage = renderImage(roleName);

  return (
    <>
      <DetailHeroSection HeroImage={HeroImage} />
      <section className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gray-100">
        {currentForm}
      </section>
    </>
  );
};

export default AllDetailsForm;

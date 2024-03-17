import React from "react";
import CreateProjectHero from "./CreateProjectHero";
import CreateProjectRegistration from "./CreateProjectRegistration";
import DetailHeroSection from "../../Common/DetailHeroSection";

const CreateProject = () => {
  return (
    <>
      <DetailHeroSection/>
      <CreateProjectRegistration/>
    </>
  );
};

export default CreateProject;

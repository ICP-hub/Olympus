import React from "react";
import Header from "../../Layout/Header/Header";
import { useState } from "react";
import CreateProjectHero from "./CreateProjectHero";

const CreateProject = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      )}
      <Header setModalOpen={setModalOpen} gradient={"bg-violet-800"} />
      <CreateProjectHero />
    </>
  );
};

export default CreateProject;

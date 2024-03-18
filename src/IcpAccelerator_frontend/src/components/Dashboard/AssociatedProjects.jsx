import React from "react";
import coding1 from "../../../assets/images/coding1.jpeg"
import ment from "../../../assets/images/ment.jpg"

const AssociatedProjects = () => {
  return (
    <div className="flex flex-wrap justify-start">
      <div className="w-full flex flex-col gap-4">
        <div className="relative shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-white">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-full sm:w-2/3">
              <img
                className="w-full h-full rounded-md rounded-r-none"
                src={coding1}
                alt="hh"
              />
            </div>
            <div className="flex flex-col p-2">
              <img className="w-12 h-12 rounded-lg" src={ment} alt="popup" />
              <p>Dirac Finance</p>
              <p>
                Dirac Finance is an institutional-grade decentralized Options
                Vault (DOV) that...
              </p>
              <div className="flex justify-start mb-2 mt-2">
                <button className="w-full bg-[#3505B2] text-white font-bold rounded-md py-2">
                  Mentorship
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociatedProjects;

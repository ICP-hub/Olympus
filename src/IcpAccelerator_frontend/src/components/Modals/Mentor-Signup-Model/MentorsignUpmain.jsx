import React, { useState, useEffect } from "react";
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Dropdown from "../../../../assets/Logo/Dropdown.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import Select from "react-select";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const MentorSignup2 = () => {

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        modalOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
        <div className="flex justify-end mr-4">
          <button
            className="text-2xl text-[#121926]"
            onClick={() => setModalOpen(false)}
          >
            &times;
          </button>
        </div>
        <h2 className="text-xs text-[#364152] mb-3">Step 2 of 3</h2>
        <form onSubmit={handleSubmit}>
         

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              <ArrowBackIcon fontSize="medium" className="ml-2" /> Back
            </button>
            <button
              onClick={onClose}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Continue
              <ArrowForwardIcon fontSize="small" className="mr-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorSignup2;

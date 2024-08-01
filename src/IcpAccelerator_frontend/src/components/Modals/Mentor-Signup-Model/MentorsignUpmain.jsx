import React, { useState, useEffect } from "react";
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Dropdown from "../../../../assets/Logo/Dropdown.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import Select from "react-select";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MentorSignup1 from "./MentoSignup1";
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
        <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
                {index === 0 && <MentorSignup1 />}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    className="py-2 px-4 text-gray-600 rounded hover:text-black"
                    onClick={handleBack}
                    disabled={index === 0}
                  >
                    Back
                  </button>
                  {index === 3 ? (
                    <button
                      type="submit"
                      className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF]"
                    >
                      {isSubmitting ? (
                        <ThreeDots
                          visible={true}
                          height="35"
                          width="35"
                          color="#FFFEFF"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                        />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF] flex items-center"
                      onClick={handleNext}
                    >
                      Continue
                      <ArrowForwardIcon fontSize="medium" className="ml-2" />
                    </button>
                  )}
                </div>
              </form>
            </FormProvider>
      </div>
    </div>
  );
};

export default MentorSignup2;

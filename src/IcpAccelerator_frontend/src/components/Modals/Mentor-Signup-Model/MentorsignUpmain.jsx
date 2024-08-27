import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import MentorSignup3 from "./MentorSignUp1";
import MentorSignup4 from "./MentorSignup2";
import { validationSchema } from "./mentorValidation";

// MAIN COMPONENT FOR MENTOR SIGNUP PROCESS
const MentorSignupMain = ({ }) => {
  const dispatch = useDispatch(); // INITIALIZING DISPATCH FUNCTION TO TRIGGER ACTIONS
  const actor = useSelector((state) => state.actors.actor); // SELECTING ACTOR FROM REDUX STORE

  // SETTING UP LOCAL STATE
  const [modalOpen, setModalOpen] = useState(true); // STATE TO CONTROL MODAL VISIBILITY
  const [index, setIndex] = useState(0); // STATE TO TRACK CURRENT STEP OF THE FORM
  const [formData, setFormData] = useState({}); // STATE TO STORE FORM DATA

  // INITIALIZE REACT HOOK FORM WITH YUP VALIDATION
  const methods = useForm({
    resolver: yupResolver(validationSchema), // USING YUP FOR FORM VALIDATION
    mode: "all",  // VALIDATION MODE SET TO VALIDATE ON ALL INPUTS CHANGE
  });
  
  const { handleSubmit, trigger, formState: { isSubmitting }, getValues } = methods; // DESTRUCTURING USEFORM METHODS

  // OBJECT TO STORE FIELDS BASED ON CURRENT FORM STEP
  const formFields = {
    0: ["preferred_icp_hub", "category_of_mentoring_service", "multi_chain", "multi_chain_names"], // FIELDS FOR STEP 1
    1: ["icp_hub_or_spoke", "hub_owner", "mentor_website_url", "years_of_mentoring", "links","area_of_expertise","reason_for_joining"], // FIELDS FOR STEP 2
  };

  // FUNCTION TO HANDLE NAVIGATING TO NEXT STEP
  const handleNext = async () => {
    const isValid = await trigger(formFields[index]); // TRIGGER VALIDATION FOR CURRENT STEP

    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        ...getValues(), // MERGE CURRENT FORM DATA WITH PREVIOUS DATA
      }));
      setIndex((prevIndex) => prevIndex + 1); // MOVE TO NEXT STEP
    }
  };

  // FUNCTION TO HANDLE NAVIGATING TO PREVIOUS STEP
  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1); // MOVE TO PREVIOUS STEP
    }
  };

  // FUNCTION TO RENDER COMPONENT BASED ON CURRENT STEP
  const renderComponent = () => {
    switch (index) {
      case 0:
        return <MentorSignup3 formData={formData} setFormData={setFormData} />; // RENDER STEP 1 COMPONENT
      case 1:
        return <MentorSignup4 formData={formData} setFormData={setFormData} />; // RENDER STEP 2 COMPONENT
      default:
        return <MentorSignup3 />; // DEFAULT TO STEP 1 COMPONENT
    }
  };

  // DISPATCH ACTION TO FETCH HUB DATA ON COMPONENT MOUNT
  useEffect(() => {
    dispatch(allHubHandlerRequest()); // FETCH ALL ICP HUB DATA
  }, [actor, dispatch]);

  // FUNCTION TO HANDLE FORM SUBMISSION ERRORS
  const onErrorHandler = (errors) => {
    toast.error("Empty fields or invalid values, please recheck the form", errors); // SHOW ERROR TOAST
    console.log("Empty fields or invalid values, please recheck the form", errors); // LOG ERRORS
  };

  // FUNCTION TO HANDLE FORM SUBMISSION SUCCESS
  const onSubmitHandler = async (data) => {
    console.log("Form data on submit:", data); // LOG SUBMITTED FORM DATA
    if (actor) {
      // PREPARE MENTOR DATA FOR BACKEND SUBMISSION
      const mentorData = {
        preferred_icp_hub: [data.preferred_icp_hub || ""], // PREPARE PREFERRED HUB DATA
        icp_hub_or_spoke: data.icp_hub_or_spoke === "true", // PREPARE HUB OR SPOKE DATA
        hub_owner: [data.icp_hub_or_spoke === "true" && data.hub_owner ? data.hub_owner : ""], // PREPARE HUB OWNER DATA
        category_of_mentoring_service: data.category_of_mentoring_service, // PREPARE MENTORING CATEGORY
        years_of_mentoring: data.years_of_mentoring.toString(), // PREPARE YEARS OF MENTORING
        links: data?.links
          ? [data.links.map((val) => ({ link: val?.link ? [val.link] : [] }))] // PREPARE LINKS DATA
          : [],
        multichain: [data.multi_chain === "true" && data.multi_chain_names ? data.multi_chain_names : ""], // PREPARE MULTICHAIN DATA
        website: [data.mentor_website_url || ""], // PREPARE WEBSITE URL
        existing_icp_mentor: false, // SET EXISTING MENTOR FLAG
        existing_icp_project_porfolio: [data.existing_icp_project_porfolio || ""], // PREPARE PROJECT PORTFOLIO
        // area_of_expertise: "", // PLACEHOLDER FOR AREA OF EXPERTISE
        // reason_for_joining: [""], 
        area_of_expertise: data?.area_of_expertise ?? "",
        // area_of_expertise: [data.area_of_expertise], 
        reason_for_joining: data.reason_for_joining ? [data.reason_for_joining] : [], /// PLACEHOLDER FOR REASON FOR JOINING
      };//commit for main

      // TRY TO SUBMIT MENTOR DATA TO BACKEND
      try {
        await actor.register_mentor(mentorData).then((result) => {
          console.log('result', result) // LOG BACKEND RESPONSE
          if (
            result.startsWith("You are not allowed to get this role because you already have the Project role.") ||
            result.startsWith("You are not eligible for this role because you have 2 or more roles") ||
            result.startsWith("You had got your request declined earlier")||
            result.startsWith("You are a Mentor Already") ||
            result.startsWith("Profile image is already uploaded")
          ) {
            toast.error(result); // Show error toast with the returned message
            setModalOpen(false);
            window.location.reload();
          } else {
            toast.success("Mentor registered successfully!"); // Show success message
            setModalOpen(false)
            window.location.reload();

          }
        });
      } catch (error) {
        toast.error(error.message); // SHOW ERROR TOAST
        console.error("Error sending data to the backend:", error); // LOG ERROR
      }
    } else {
      toast.error("Please signup with internet identity first"); // SHOW ERROR IF USER IS NOT SIGNED IN
      window.location.href = "/"; // REDIRECT TO HOME
    }
  };

  // RENDER COMPONENT
  return (
    <>
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
          <div className="flex justify-end mr-4">
            <button className="text-2xl text-[#121926]" onClick={() => setModalOpen(!modalOpen)}>
              &times; {/* BUTTON TO CLOSE MODAL */}
            </button>
          </div>
          <h2 className="text-xs text-[#364152] mb-3">Step {index + 1} of 2</h2> {/* DISPLAY CURRENT STEP */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}> {/* FORM SUBMISSION HANDLER */}
              {renderComponent()} {/* RENDER CURRENT STEP COMPONENT */}
              <div className={`flex mt-4 ${index === 0 ? "justify-end" : "justify-between"}`}>
                {index > 0 && (
                  <button
                    type="button"
                    className="py-2 px-4 text-gray-600 rounded border border-[#CDD5DF] hover:text-black"
                    onClick={handleBack} // BUTTON TO GO BACK TO PREVIOUS STEP
                  >
                    <ArrowBackIcon fontSize="medium" /> Back
                  </button>
                )}
                {index === 1 ? (
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 text-white rounded  border-2 border-[#B2CCFF]"
                  >
                    {isSubmitting ? (
                      <ThreeDots
                        visible={true}
                        height="35"
                        width="35"
                        color="#FFFEFF"
                        radius="9"
                        ariaLabel="three-dots-loading"
                      /> // SHOW LOADER WHEN SUBMITTING
                    ) : (
                      "Submit" // SHOW SUBMIT BUTTON
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="py-2 px-4 bg-blue-600 text-white rounded  border-2 border-[#B2CCFF] flex items-center"
                    onClick={handleNext} // BUTTON TO CONTINUE TO NEXT STEP
                  >
                    Continue
                    <ArrowForwardIcon fontSize="15px" className="ml-1" />
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      <Toaster /> {/* TOASTER FOR NOTIFICATIONS */}
    </>
  );
};

export default MentorSignupMain;

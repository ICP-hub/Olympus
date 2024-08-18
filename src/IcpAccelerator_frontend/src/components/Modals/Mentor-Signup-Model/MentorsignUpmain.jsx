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
import MentorSignup3 from "./MentorSignUp3";
import MentorSignup4 from "./MentorSignup4";


const validationSchema = yup.object().shape({
  preferred_icp_hub: yup.string().required("ICP Hub selection is required"),
  multi_chain: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
  multi_chain_names: yup.string().when("multi_chain", (val, schema) =>
    val && val[0] === "true" ? schema.required("At least one chain name required") : schema
  ),
  category_of_mentoring_service: yup.string().required("Selecting a service is required"),
  icp_hub_or_spoke: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
  hub_owner: yup.string().when("icp_hub_or_spoke", (val, schema) =>
    val && val[0] === "true" ? schema.required("ICP Hub selection is required") : schema
  ),
  mentor_website_url: yup.string().nullable(true).optional().url("Invalid url"),
  years_of_mentoring: yup
    .number()
    .typeError("You must enter a number")
    .positive("Must be a positive number")
    .required("Years of experience mentoring startups is required"),
  // mentor_linkedin_url: yup.string().url("Invalid url").required("LinkedIn url is required"),
  links: yup.array().of(
    yup.object().shape({
      url: yup.string().url("Invalid URL").nullable(true).optional(),
    })
  ),
});
const MentorSignupMain = ({ }) => {
  const dispatch = useDispatch();
  const actor = useSelector((state) => state.actors.actor);

  const [modalOpen, setModalOpen] = useState(true);
  const [index, setIndex] = useState(0);
  const [formData, setFormData] = useState({});


const methods = useForm({
  resolver: yupResolver(validationSchema),
  mode: "all", 
});
  


  const { handleSubmit, trigger, formState: { isSubmitting }, getValues } = methods;

  const formFields = {
    0: ["preferred_icp_hub", "category_of_mentoring_service", "multi_chain", "multi_chain_names"],
    1: ["icp_hub_or_spoke", "hub_owner", "mentor_website_url", "years_of_mentoring", "links"],
  };

  const handleNext = async () => {
    const isValid = await trigger(formFields[index]);

    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        ...getValues(), // Merge new data with previous data
      }));
      setIndex((prevIndex) => prevIndex + 1);
    }
  };



  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  const renderComponent = () => {
    switch (index) {
      case 0:
        return <MentorSignup3 formData={formData} setFormData={setFormData} />;
      case 1:
        return <MentorSignup4 formData={formData} setFormData={setFormData} />;
      default:
        return <MentorSignup3 />;
    }
  };

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);



  const onErrorHandler = (errors) => {
    toast.error("Empty fields or invalid values, please recheck the form", errors);
    console.log("Empty fields or invalid values, please recheck the form", errors)
  };

  const onSubmitHandler = async (data) => {
    console.log("Form data on submit:", data);
    if (actor) {
      // Define user_data object separately
      const user_data = {
        full_name: "Chandan",
        email: "chandu@gmail.com",
        telegram_id: "https://abc.com",
        twitter_id: "https://abc.com",
        openchat_username: "Chandu_123",
        bio: "dfghjkl",
        country: "india",
        area_of_interest: "sports",
        type_of_profile: "Developer",
        reason_to_join: "just i want to waste my time ",
        profile_picture: [],
      };

  
      // Define mentorData object separately
      const mentorData = {
        preferred_icp_hub: [data.preferred_icp_hub || ""],
        icp_hub_or_spoke: data.icp_hub_or_spoke === "true",
        hub_owner: [data.icp_hub_or_spoke === "true" && data.hub_owner ? data.hub_owner : ""],
        category_of_mentoring_service: data.category_of_mentoring_service,
        years_of_mentoring: data.years_of_mentoring.toString(),
        // linkedin_link: data.mentor_linkedin_url,
        links: data?.links
          ? [data.links.map((val) => ({ link: val?.link ? [val.link] : [] }))]
          : [],
        multichain: [data.multi_chain === "true" && data.multi_chain_names ? data.multi_chain_names : ""],
        website: [data.mentor_website_url || ""],
        existing_icp_mentor: false,
        existing_icp_project_porfolio: [data.existing_icp_project_porfolio || ""],
        area_of_expertise: "",
        reason_for_joining: [""],

      };

      try {
        await actor.register_mentor_candid(mentorData).then((result) => {
          console.log('result', result)
          if (result) {
            toast.success("Created successfully");
            // window.location.href = "/";
          } else {
            toast.error(result);
          }
        });
      } catch (error) {
        toast.error(error.message);
        console.error("Error sending data to the backend:", error);
      }
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
  };


  return (
    <>
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
          <div className="flex justify-end mr-4">
            <button className="text-2xl text-[#121926]" onClick={() => setModalOpen(!modalOpen)}>
              &times;
            </button>
          </div>
          <h2 className="text-xs text-[#364152] mb-3">Step {index + 1} of 2</h2>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
              {renderComponent()}
              <div className={`flex mt-4 ${index === 0 ? "justify-end" : "justify-between"}`}>
                {index > 0 && (
                  <button
                    type="button"
                    className="py-2 px-4 text-gray-600 rounded border border-[#CDD5DF] hover:text-black"
                    onClick={handleBack}
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
                      />
                    ) : (
                      "Submit"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="py-2 px-4 bg-blue-600 text-white rounded  border-2 border-[#B2CCFF] flex items-center"
                    onClick={handleNext}
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
      <Toaster />
    </>
  );
};

export default MentorSignupMain;

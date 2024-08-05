import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCountries } from "react-countries";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import MentorSignup3 from "./MentorSignUp3";
import MentorSignup4 from "./MentorSignup4";

const MentorSignupMain = () => {
  const { countries } = useCountries();
  const dispatch = useDispatch();
  const actor = useSelector((state) => state.actors.actor);
  const areaOfExpertise = useSelector((state) => state.expertiseIn.expertise);
  const typeOfProfile = useSelector((state) => state.profileTypes.profiles);
  const userFullData = useSelector((state) => state.userData.data.Ok);
  const mentorFullData = useSelector((state) => state.mentorData.data[0]);
  const userCurrentRoleStatusActiveRole = useSelector(
    (state) => state.currentRoleStatus.activeRole
  );
  const [modalOpen, setModalOpen] = useState(true);
  const [index, setIndex] = useState(0);

  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [interestedDomainsSelectedOptions, setInterestedDomainsSelectedOptions] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] = useState([]);
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState([]);
  const [categoryOfMentoringServiceSelectedOptions, setCategoryOfMentoringServiceSelectedOptions] = useState([]);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const multiChainNames = useSelector((currState) => currState.chains.chains);

  const reasonOfJoiningOptions = [
    { value: "listing_and_promotion", label: "Project listing and promotion" },
    { value: "Funding", label: "Funding" },
    { value: "Mentoring", label: "Mentoring" },
    { value: "Incubation", label: "Incubation" },
    { value: "Engaging_and_building_community", label: "Engaging and building community" },
    { value: "Jobs", label: "Jobs" },
  ];

  const categoryOfMentoringServiceOptions = [
    { value: "Incubation", label: "Incubation" },
    { value: "Tokenomics", label: "Tokenomics" },
    { value: "Branding", label: "Branding" },
    { value: "Listing", label: "Listing" },
    { value: "Raise", label: "Raise" },
  ];

  const validationSchema = yup.object().shape({
    full_name: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").nullable(true).optional(),
    telegram_id: yup.string().nullable(true).optional().url("Invalid url"),
    twitter_url: yup.string().nullable(true).optional().url("Invalid url"),
    openchat_user_name: yup
      .string()
      .nullable(true)
      .test("is-valid-username", "Username must be between 5 and 20 characters, and cannot start or contain spaces", (value) => {
        if (!value) return true;
        const isValidLength = value.length >= 5 && value.length <= 20;
        const hasNoSpaces = !/\s/.test(value) && !value.startsWith(" ");
        return isValidLength && hasNoSpaces;
      }),
    bio: yup
      .string()
      .optional()
      .test("maxWords", "Bio must not exceed 50 words", (value) => !value || value.trim().split(/\s+/).filter(Boolean).length <= 50)
      .test("no-leading-spaces", "Bio should not have leading spaces", (value) => !value || value.trimStart() === value)
      .test("maxChars", "Bio must not exceed 500 characters", (value) => !value || value.length <= 500),
    country: yup.string().required("Country is required"),
    domains_interested_in: yup.string().required("Selecting an interest is required"),
    type_of_profile: yup.string().required("Type of profile is required"),
    reasons_to_join_platform: yup.string().required("Selecting a reason is required"),
    image: yup.mixed().nullable(true).test("fileSize", "File size max 10MB allowed", (value) => !value || (value && value.size <= 10 * 1024 * 1024)).test("fileType", "Only jpeg, jpg & png file format allowed", (value) => !value || (value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type))),
    preferred_icp_hub: yup.string().required("ICP Hub selection is required"),
    multi_chain: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
    multi_chain_names: yup.string().when("multi_chain", (val, schema) => (val && val[0] === "true" ? schema.required("At least one chain name required") : schema)),
    category_of_mentoring_service: yup.string().required("Selecting a service is required"),
    icp_hub_or_spoke: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
    hub_owner: yup.string().when("icp_hub_or_spoke", (val, schema) => (val && val[0] === "true" ? schema.required("ICP Hub selection is required") : schema)),
    mentor_website_url: yup.string().nullable(true).optional().url("Invalid url"),
    years_of_mentoring: yup.number().typeError("You must enter a number").positive("Must be a positive number").required("Years of experience mentoring startups is required"),
    mentor_linkedin_url: yup.string().url("Invalid url").required("LinkedIn url is required"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const { handleSubmit, trigger, setValue, clearErrors, setError, watch, formState: { isSubmitting } } = methods;

  const formFields = {
    0: ["preferred_icp_hub", "category_of_mentoring_service", "multi_chain", "multi_chain_names"],
    1: ["icp_hub_or_spoke", "hub_owner", "mentor_website_url", "years_of_mentoring", "mentor_linkedin_url"],
  };

  const handleNext = async () => {
    const isValid = await trigger(formFields[index]);
    console.log("Validation result for step", index, ":", isValid);
    if (isValid) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("Validation errors:", methods.formState.errors);
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
        return <MentorSignup3 />;
      case 1:
        return <MentorSignup4 />;
      default:
        return <MentorSignup3 />;
    }
  };

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  useEffect(() => {
    if (areaOfExpertise) {
      setInterestedDomainsOptions(areaOfExpertise.map((expert) => ({ value: expert.name, label: expert.name })));
    } else {
      setInterestedDomainsOptions([]);
    }
  }, [areaOfExpertise]);

  useEffect(() => {
    if (typeOfProfile) {
      setTypeOfProfileOptions(typeOfProfile.map((type) => ({ value: type.role_type.toLowerCase(), label: type.role_type })));
    } else {
      setTypeOfProfileOptions([]);
    }
  }, [typeOfProfile]);

  useEffect(() => {
    if (multiChainNames) {
      setMultiChainOptions(multiChainNames.map((chain) => ({ value: chain, label: chain })));
    } else {
      setMultiChainOptions([]);
    }
  }, [multiChainNames]);

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [dispatch]);



  const onErrorHandler = (errors) => {
    toast.error("Empty fields or invalid values, please recheck the form");
  };


  // form submit handler func
  const onSubmitHandler = async (data) => {
    if (actor) {
      const mentorData = {
        // mentor data
        preferred_icp_hub: [data?.preferred_icp_hub || ""],
        icp_hub_or_spoke: data?.icp_hub_or_spoke === "true" ? true : false,
        hub_owner: [
          data?.icp_hub_or_spoke === "true" && data?.hub_owner
            ? data?.hub_owner
            : "",
        ],
        hub_owner: [data?.hub_owner || ""],
        category_of_mentoring_service: data?.category_of_mentoring_service,
        years_of_mentoring: data.years_of_mentoring.toString(),
        linkedin_link: data?.mentor_linkedin_url,
        multichain: [
          data?.multi_chain === "true" && data?.multi_chain_names
            ? data?.multi_chain_names
            : "",
        ],
        website: [data?.mentor_website_url || ""],
        // mentor data not exiting on frontend or raw variables
        existing_icp_mentor: false,
        existing_icp_project_porfolio: [
          data?.existing_icp_project_porfolio || "",
        ],
        area_of_expertise: "",
        reason_for_joining: [""],
      };
      try {
        if (userCurrentRoleStatusActiveRole === "mentor") {
          await actor.update_mentor(mentorData).then((result) => {
            if (result && result.includes("approval request is sent")) {
              toast.success("Approval request is sent");
              window.location.href = "/";
            } else {
              toast.error(result);
            }
          });
        } else if (
          userCurrentRoleStatusActiveRole === null ||
          userCurrentRoleStatusActiveRole === "user" ||
          userCurrentRoleStatusActiveRole === "project" ||
          userCurrentRoleStatusActiveRole === "vc"
        ) {
          await actor.register_mentor_candid(mentorData).then((result) => {
            if (result && result.includes("approval request is sent")) {
              toast.success("Approval request is sent");
              window.location.href = "/";
            } else {
              toast.error(result);
            }
          });
        }
      } catch (error) {
        toast.error(error);
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
            <button
              className="text-2xl text-[#121926]"
              onClick={() => setModalOpen(!modalOpen)}
            >
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
                    disabled={index === 0}
                  >
                    <ArrowBackIcon fontSize="medium" />   Back
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

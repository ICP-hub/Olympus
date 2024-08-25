import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { ThreeDots } from "react-loader-spinner";
import { useCountries } from "react-countries";
import InvestorModal1 from "./InvestorModal1";
import InvestorModal2 from "./InvestorModal2";
import InvestorModal3 from "./InvestorModal3";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { validationSchema } from "./investorvalidation";

const InvestorForm = ({ isOpen }) => {
  // STATE TO CONTROL MODAL OPEN/CLOSE
  const [modalOpen, setModalOpen] = useState(isOpen || true);
  // FETCH COUNTRIES LIST
  const { countries } = useCountries();
  // DISPATCH FUNCTION FOR REDUX ACTIONS
  const dispatch = useDispatch();
  // SELECT ACTOR FROM REDUX STORE
  const actor = useSelector((state) => state.actors.actor);
  // STATE TO STORE ACCUMULATED FORM DATA ACROSS MULTIPLE STEPS
  const [formData, setFormData] = useState({});

  // INITIALIZE REACT HOOK FORM WITH VALIDATION SCHEMA
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    getValues,
    setError,
    watch,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  // FORM FIELDS DIVIDED INTO STEPS
  const formFields = {
    0: [
      "investor_registered",
      "registered_country",
      "existing_icp_investor",
      "investment_type",
      "invested_in_multi_chain",
      "invested_in_multi_chain_names",
    ],
    1: [
      "investment_categories",
      "investment_stage",
      "investment_stage_range",
      "investor_website_url",
      "links",
    ],
    2: [
      "preferred_icp_hub",
      "investor_portfolio_link",
      "investor_fund_name",
      "investor_fund_size",
    ],
  };

  // STATE TO TRACK CURRENT STEP INDEX
  const [index, setIndex] = useState(0);

  // FUNCTION TO HANDLE NEXT BUTTON CLICK
  const handleNext = async () => {
    const isValid = await trigger(formFields[index]); // VALIDATE CURRENT STEP
    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        ...getValues(), // MERGE CURRENT STEP DATA WITH PREVIOUS DATA
      }));
      setIndex((prevIndex) => prevIndex + 1); // GO TO NEXT STEP
    }
  };

  // FUNCTION TO HANDLE BACK BUTTON CLICK
  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1); // GO TO PREVIOUS STEP
    }
  };

  // FUNCTION TO HANDLE FORM SUBMISSION
  const onSubmitHandler = async () => {
    const data = { ...formData, ...getValues() }; // MERGE FINAL FORM DATA
  console.log('data',data)
    if (actor) {
      const investorData = {
        name_of_fund: data?.investor_fund_name,
        fund_size: [
          data?.investor_fund_size &&
          typeof data?.investor_fund_size === "number"
            ? data?.investor_fund_size
            : 0,
        ],
        existing_icp_investor:
          data?.existing_icp_investor === "true" ? true : false,
        investor_type: [
          data?.existing_icp_investor === "true" && data?.investment_type
            ? data?.investment_type
            : "",
        ],
        project_on_multichain: [
          data?.invested_in_multi_chain === "true" &&
          data?.invested_in_multi_chain_names
            ? data?.invested_in_multi_chain_names
            : "",
        ],
        category_of_investment: data?.investment_categories,
        preferred_icp_hub: data?.preferred_icp_hub,
        portfolio_link: data?.investor_portfolio_link ?? "asdas",
        website_link: [data?.investor_website_url || ""],
        registered: data?.investor_registered === "true" ? true : false,
        registered_country: [
          data?.investor_registered === "true" && data?.registered_country
            ? data?.registered_country
            : "",
        ],
        links: data?.links
          ? [data.links.map((val) => ({ link: val?.link ? [val.link] : [] }))] // PREPARE LINKS DATA
          : [],
        stage: [data?.investment_stage || ""],
        range_of_check_size: [
          data?.investment_stage !== "" &&
          data?.investment_stage !== "we do not currently invest" &&
          data?.investment_stage_range
            ? data?.investment_stage_range
            : "",
        ],
        // ADDITIONAL INVESTOR DATA (NOT FROM FORM)
        average_check_size: 1,
        assets_under_management: [""],
        registered_under_any_hub: [false],
        logo: [[]],
        money_invested: [0],
         existing_icp_portfolio: [""],
        reason_for_joining: [""],
        type_of_investment: "dwe",
        number_of_portfolio_companies: 1,
        announcement_details: [""],
      };
      console.log(investorData);
      try {
        await actor.register_venture_capitalist(investorData).then((result) => {
          console.log("result", result);
          if (
            result.startsWith(
              "You are not allowed to get this role because you already have the Project role."
            ) ||
            result.startsWith(
              "You are not eligible for this role because you have 2 or more roles"
            ) ||
            result.startsWith("You had got your request declined earlier") ||
            result.startsWith("This Principal is already registered") ||
            result.startsWith("Profile image is already uploaded")
          ) {
            toast.error(result); // SHOW ERROR TOAST WITH RETURNED MESSAGE
            setModalOpen(false);
          } else {
            toast.success("Investor registered successfully!"); // SHOW SUCCESS MESSAGE
            setModalOpen(false);
          }
        });
      } catch (error) {
        const errorMessage = error.message || "An unknown error occurred";
        toast.error(errorMessage);
        console.error("Error sending data to the backend:", error);
      }
    } else {
      toast.error("Please signup with internet identity first"); // PROMPT USER TO SIGN UP WITH INTERNET IDENTITY
      window.location.href = "/"; // REDIRECT TO HOMEPAGE
    }
  };

  // FUNCTION TO HANDLE FORM ERRORS
  const onErrorHandler = (val) => {
    console.log("val Error", val);
    toast.error("Empty fields or invalid values, please recheck the form"); // SHOW ERROR TOAST FOR INVALID FIELDS
  };

  // DISPATCH ACTION ON COMPONENT MOUNT TO FETCH HUB DATA
  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div className="container mx-auto">
          <div className="pb-12 flex items-center justify-center rounded-xl">
            <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-[30rem] relative">
              <div className="absolute top-2 right-4">
                <button
                  className="text-2xl text-gray-300"
                  onClick={() => setModalOpen(false)} // CLOSE MODAL
                >
                  &times;
                </button>
              </div>
              <div className="w-full p-6">
                <h2 className="text-[#364152] text-sm font-normal mb-2 text-start">
                  Step {index + 1} of 3
                </h2>
                <FormProvider
                  {...{
                    register,
                    handleSubmit,
                    reset,
                    clearErrors,
                    setValue,
                    countries,
                    getValues,
                    setError,
                    watch,
                    control,
                    trigger,
                    formState: { errors, isSubmitting },
                  }}
                >
                  <form
                    onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
                  >
                    {index === 0 && (
                      <InvestorModal1
                        formData={formData}
                        setFormData={setFormData} // PASS FORM DATA TO INVESTOR MODAL 1
                      />
                    )}
                    {index === 1 && (
                      <InvestorModal2
                        formData={formData}
                        setFormData={setFormData} // PASS FORM DATA TO INVESTOR MODAL 2
                      />
                    )}
                    {index === 2 && (
                      <InvestorModal3
                        formData={formData}
                        setFormData={setFormData} // PASS FORM DATA TO INVESTOR MODAL 3
                      />
                    )}

                    <div
                      className={`flex mt-4 ${
                        index === 0 ? "justify-end" : "justify-between"
                      }`}
                    >
                      {index > 0 && (
                        <button
                          type="button"
                          className="py-2 border-2 px-4 text-gray-600 rounded hover:text-black"
                          onClick={handleBack} // BACK BUTTON FUNCTIONALITY
                          disabled={index === 0}
                        >
                          <span className="">
                            <ArrowBackIcon sx={{ marginTop: "-3px " }} />{" "}
                          </span>
                          Back
                        </button>
                      )}
                      {index === 2 ? (
                        <button
                          type="button"
                          className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF]"
                          onClick={onSubmitHandler} // SUBMIT BUTTON FUNCTIONALITY
                          disabled={isSubmitting}
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
                          className="py-2 px-4 text-white rounded bg-blue-600 border-2 border-[#B2CCFF] flex items-center"
                          onClick={handleNext} // CONTINUE BUTTON FUNCTIONALITY
                        >
                          Continue
                          <ArrowForwardIcon
                            fontSize="medium"
                            className="ml-2"
                          />
                        </button>
                      )}
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster /> {/* TOAST NOTIFICATIONS */}
    </>
  );
};

export default InvestorForm;

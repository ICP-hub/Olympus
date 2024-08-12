import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast, { Toaster } from "react-hot-toast";
import EventReg1 from "./EventReg1";
import EventReg2 from "./EventReg2";
import EventReg3 from "./EventReg3";
import { format, startOfToday } from "date-fns";
import { useSelector } from "react-redux";
const validationSchema = yup.object({
  title: yup
    .string()
    .required("Required")
    .test(
      "is-non-empty",
      "Title cannot be empty",
      (value) => value && value.trim().length > 0
    ),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .matches(/^[^\s].*$/, "Cannot start with a space")
    .test(
      "no-leading-spaces",
      "Bio should not have leading spaces",
      (value) => !value || value.trimStart() === value
    ),
  cohort_launch_date: yup
    .date()
    .required()
    .typeError("Must be a date")
    .min(startOfToday(), "Cohort Launch date cannot be before today"),
  cohort_end_date: yup
    .date()
    .required()
    .typeError("Must be a date")
    .min(
      yup.ref("cohort_launch_date"),
      "Cohort End date cannot be before Cohort launch date"
    ),
  tags: yup
    .string()
    .test("is-non-empty", "Selecting an interest is required", (value) =>
      /\S/.test(value)
    )
    .required("Selecting an interest is required"),

  deadline: yup
    .date()
    .required("Must be a date")
    .typeError("Must be a valid date")
    .max(
      yup.ref("cohort_launch_date"),
      "Application Deadline must be before the Cohort Launch date"
    ),
  eligibility: yup
    .string()
    .typeError("You must enter a eligibility")
    .required(),
  rubric_eligibility: yup.string().required("Required"),
  no_of_seats: yup.number().typeError("You must enter a number").required(),
  funding_type: yup
    .string()
    .typeError("You must enter a funding type")
    .required("Required"),
  funding_amount: yup
    .string()
    .typeError("You must enter a funding amount")
    .required("Required"),
});

const EventRegMain = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [selectedArea, setSelectedArea] = useState("");
  const [modalOpen, setModalOpen] = useState(true);
  const [index, setIndex] = useState(0);
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const {
    handleSubmit,
    register,
    reset,
    clearErrors,
    setValue,
    setError,
    watch,
    control,
    trigger,
    formState: { isSubmitting },
    getValues,
  } = methods;

  const formFields = {
    0: [
      "preferred_icp_hub",
      "category_of_mentoring_service",
      "multi_chain",
      "multi_chain_names",
    ],
    1: [
      "icp_hub_or_spoke",
      "hub_owner",
      "mentor_website_url",
      "years_of_mentoring",
      "mentor_linkedin_url",
    ],
  };

  const onSubmitHandler = async (data) => {
    const areaValue = selectedArea === "global" ? "global" : selectedCountry;
    console.log("data aaya data aaya ", data);

    const eventData = {
      title: data.title,
      country: areaValue,
      funding_amount: data.funding_amount,
      funding_type: data.funding_type,
      description: data.description,
      cohort_launch_date: format(
        new Date(data.cohort_launch_date),
        "yyyy-MM-dd"
      ),
      start_date: format(new Date(data.cohort_launch_date), "yyyy-MM-dd"),
      cohort_end_date: format(new Date(data.cohort_end_date), "yyyy-MM-dd"),
      deadline: format(new Date(data.deadline), "yyyy-MM-dd"),
      tags: data.tags,
      criteria: {
        eligibility: [data.eligibility],
        level_on_rubric: parseFloat(data.rubric_eligibility),
      },
      no_of_seats: parseInt(data.no_of_seats),
      cohort_banner: imageData ? [imageData] : [],
      host_name: userFullData ? [userFullData.full_name] : [],
    };
    console.log("eventData ===>>>", eventData);
    try {
      await actor.create_cohort(eventData).then((result) => {
        if (result && result.Ok) {
          toast.success("Cohort creation request has been sent to admin");
          console.log("Event Created", result);
          navigate("/");
        } else {
          toast.error("Some went wrong");
          console.log("Event Created", result);
        }
      });
    } catch (error) {
      toast.error(error);
      console.error("Error sending data to the backend:", error);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger(formFields[index]);
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
        return <EventReg1 />;
      case 1:
        return <EventReg2 />;
      case 2:
        return <EventReg3 />;
      default:
        return <EventReg1 />;
    }
  };

  const onErrorHandler = (errors) => {
    toast.error(
      "Empty fields or invalid values, please recheck the form",
      errors
    );
    console.log(
      "Empty fields or invalid values, please recheck the form",
      errors
    );
  };
  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
          <div className="flex justify-end mr-4">
            <button
              className="text-2xl text-[#121926]"
              onClick={() => setModalOpen(!modalOpen)}
            >
              &times;
            </button>
          </div>
          <h2 className="text-xs text-[#364152] mb-3">Step {index + 1} of 3</h2>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
              {renderComponent()}
              <div
                className={`flex mt-4 ${
                  index === 0 ? "justify-end" : "justify-between"
                }`}
              >
                {index > 0 && (
                  <button
                    type="button"
                    className="py-2 px-4 text-gray-600 rounded border border-[#CDD5DF] hover:text-black"
                    onClick={handleBack}
                  >
                    <ArrowBackIcon fontSize="medium" /> Back
                  </button>
                )}
                {index === 2 ? (
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

export default EventRegMain;

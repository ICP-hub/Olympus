import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ThreeDots } from "react-loader-spinner";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast, { Toaster } from "react-hot-toast";
import EventReg1 from "./EventReg1";
import EventReg2 from "./EventReg2";
import EventReg3 from "./EventReg3";
import EventReg4 from "./EventReg4";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { validationSchema } from "./cohortValidation";

const EventRegMain = ({ modalOpen, setModalOpen, editMode, singleEventData, cohortId }) => {
  console.log("cohort id reg main me ", cohortId);

  // GETTING ACTOR FROM REDUX STORE
  const actor = useSelector((currState) => currState.actors.actor);

  // INDEX STATE TO TRACK THE CURRENT STEP OF THE FORM
  const [index, setIndex] = useState(0);

  // INITIALIZING THE FORM WITH VALIDATION SCHEMA
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
    defaultValues: singleEventData || {},
  });

  // STATE TO STORE THE IMAGE DATA
  const [imageData, setImageData] = useState(null);

  // DESTRUCTURING METHODS FROM useForm HOOK
  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
    getValues,
  } = methods;

  // FORM FIELD NAMES FOR EACH STEP OF THE FORM
  const formFields = {
    0: ["cohort_banner", "title", "cohort_launch_date", "cohort_end_date"],
    1: ["deadline", "eligibility", "no_of_seats", "start_date"],
    2: ["funding_type", "funding_amount", "tags", "country", "host_name", "contact_links"],
    3: ["description"],
  };

  // STATE TO STORE THE FORM DATA
  const [formData, setFormData] = useState({});

  // FUNCTION TO HANDLE NAVIGATING TO NEXT STEP
  const handleNext = async () => {
    const isValid = await trigger(formFields[index]);

    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        ...getValues(),
      }));
      if (index < 3) {
        setIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  // FUNCTION TO HANDLE NAVIGATING TO PREVIOUS STEP
  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  // SUBMIT HANDLER
  const onSubmitHandler = async (data) => {
    if (index === 3) {  // Ensure submission only on the last step
      console.log("Form data:", data);

      // FORMATTING THE SUBMITTED DATA
      const eventData = {
        title: data.title,
        country: data.area,
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
        contact_links: data?.contact_links
          ? [data.contact_links.map((val) => ({ link: val?.link ? [val.link] : [] }))]
          : [],
        no_of_seats: parseInt(data.no_of_seats),
        cohort_banner: imageData ? [imageData] : [],
        host_name: ['Mridul'], // Example placeholder for host name
      };

      try {
        let result;
        if (editMode && singleEventData) {
          console.log("Updating cohort with data:", eventData);
          result = await actor.update_cohort(cohortId, eventData);
        } else {
          // Call create_cohort API when in create mode
          console.log("Creating new cohort with data:", eventData);
          result = await actor.create_cohort(eventData);
        }

        console.log('API result', result);

        // Handle success or error response
        if (result && result.Ok) {
          if (
            result.startsWith("You are not privileged to create a cohort ,Please Register as Mentor ...") ||
            result.startsWith("Cohort Banner is already uploaded")
          ) {
            toast.error(result);
            setModalOpen(false);
          } else {
            toast.success(editMode ? "Cohort updated successfully!" : "Cohort registered successfully!");
            setModalOpen(false);
          }
        }
      } catch (error) {
        toast.error("Error submitting cohort");
        console.error("Error sending data to the backend:", error);
      }
    }
  };

  // FUNCTION TO HANDLE FORM ERRORS
  const onErrorHandler = (errors) => {
    toast.error("Please check the form for errors.");
    console.log("Form errors:", errors);
  };

  return (
    <>
      {/* MODAL OVERLAY */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? "block" : "hidden"}`}>
        <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 ">
          {/* CLOSE BUTTON */}
          <div className="flex justify-end mr-4">
            <button
              className="text-2xl text-[#121926]"
              onClick={() => setModalOpen(!modalOpen)}
            >
              &times;
            </button>
          </div>
          <h2 className="text-xs text-[#364152] mb-3">Step {index + 1} of 4</h2>
          <div className="max-h-[90vh] overflow-y-auto">

          {/* FORM PROVIDER TO PASS DOWN FORM METHODS */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
              {/* CONDITIONAL RENDERING OF FORMS BASED ON CURRENT STEP */}
              {index === 0 && <EventReg1 formData={formData} setFormData={setFormData} imageData={imageData} setImageData={setImageData} editMode={editMode} />}
              {index === 1 && <EventReg2 formData={formData} setFormData={setFormData} />}
              {index === 2 && <EventReg3 formData={formData} setFormData={setFormData} />}
              {index === 3 && <EventReg4 formData={formData} setFormData={setFormData} />}
              
              {/* NAVIGATION BUTTONS */}
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
                {index === 3 ? (
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
                    <ArrowForwardIcon fontSize="medium" className="ml-2" />
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
        </div>
      </div>
      {/* TOAST NOTIFICATIONS */}
      <Toaster />
    </>
  );
};

export default EventRegMain;


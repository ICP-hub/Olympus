import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import { jobCategoryHandlerRequest } from "../../../components/StateManagement/Redux/Reducers/getJobCategory";
import Select from "react-select";
import JoditEditor from "jodit-react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Controller } from "react-hook-form";
import parse from 'html-react-parser';
const schema = yup
  .object({
    jobTitle: yup
      .string()
      .required("Job Title is required")
      .min(5, "Title must be at least 5 characters")
      .test(
        "no-leading-spaces",
        "Job Title should not have leading spaces",
        (value) => !value || value.trimStart() === value
      ),
    jobLocation: yup
      .object()
      .shape({
        label: yup.string().required("Location is required"),
        value: yup.string().required("Location is required"),
      })
      .nullable()
      .required("Job Location is required"),
    job_type: yup
      .object()
      .shape({
        value: yup.string().required("Job Type is required"),
        label: yup.string().required("Job Type is required"),
      })
      .nullable()
      .required("Job Type is required"),
    jobLink: yup
      .string()
      .url("Invalid website URL")
      .test("is-non-empty", "website URL is required", (value) =>
        /\S/.test(value)
      ),
    jobCategory: yup
      .string()
      .test("is-non-empty", "Category are required", (value) =>
        /\S/.test(value)
      ),
    jobDescription: yup
      .string()
      .required("Job Description is required")
      .test(
        "maxWords",
        "Job description must not exceed 50 words",
        (value) =>
          !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
      )
      .test(
        "maxChars",
        "Job description must not exceed 500 characters",
        (value) => !value || value.length <= 500
      )
      .test(
        "no-leading-spaces",
        "Job description should not have leading spaces",
        (value) => !value || value.trimStart() === value
      ),
  })
  .required();
const JobRegister1 = ({ modalOpen, setModalOpen }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  // const { control } = useForm();
  const { cardData } = location.state || {};
  const actor = useSelector((currState) => currState.actors.actor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  const jobCategoryData = useSelector(
    (currState) => currState.jobsCategory.jobCategory
  );
  const editor = useRef(null);

  useEffect(() => {
    dispatch(jobCategoryHandlerRequest());
  }, [actor, dispatch]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  // const projectId = cardData.uid;


//   const onSubmit = async (data) => {
//     console.log("DATA ARGUMENTS", data);
//     const projectId = cardData[0]?.uid;

//     if (!projectId) {
//       toast.error("Project ID is missing!");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const parsedDescription = parse(jobDescription); 
//       const argument = {
//         title: data.jobTitle,
//         description: data.parsedDescription,
//         category: data.jobCategory,
//         location: data.jobLocation.value,
//         link: data.jobLink,
//         job_type: data.job_type.value,
//         project_id: projectId,
//       };

//       const result = await actor.post_job(argument);
// console.log("desc..............",result)
//       if (result) {
//         toast.success("Job created successfully!");
//         setModalOpen(false);
//       } else {
//         toast.error("Something went wrong.");
//         console.log("JOB CREATION WRONG  ");
//       }
//     } catch (error) {
//       console.error("Error creating job:", error);
//       toast.error("An error occurred while creating the job.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
const projectFullData = useSelector((currState) => currState.projectData.data);
const projectuid=projectFullData[0][0]?.uid
console.log("projectFullData", projectuid)
const onSubmit = async (data) => {

  setIsSubmitting(true);
  console.log("On Submit k andr aagya")
  try {
    console.log('TRY A ANDR AAGYA')
    const parsedDescription = parse(jobDescription); 
    const argument = {
      title: data.jobTitle,
      description: data.jobDescription,
      category: data.jobCategory,
      location: data.jobLocation.value,
      link: data.jobLink,
      job_type: data.job_type.value,
      // project_id: projectuid,
    };
    console.log('YE ARGUMENT FUNCTION KO DE RHA HU', argument)

    const result = await actor.post_job(argument);
    console.log("Job creation result:", result);

    if (result) {
      console.log("Job creation result",result)
      toast.success("Job created successfully!");
      setModalOpen(false);
    } else {
      toast.error("Something went wrong.");
    }
  } catch (error) {
    console.error("Error creating job:", error);
    toast.error("An error occurred while creating the job.");
  } finally {
    setIsSubmitting(false);
  }
};
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations().then((data) => {
      setLocations(data.map((loc) => ({ label: loc.name , value: loc.id })));
    });
  }, []);

  const fetchLocations = async () => {
    return [
      { id: "On-site", name: "On-site" },
      { id: "Hybrid", name: "Hybrid" },
      { id: "Remote", name: "Remote" },
    ];
  };

  //fet type of job
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobTypes = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await actor.type_of_job();
        setJobTypes(result.map((type) => ({ value: type, label: type })));
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchJobTypes();
  }, []);

  // custom jodit Editor func
  const options = [
    "bold",
    "italic",
    "|",
    "ul",
    "ol",
    "|",
    "font",
    "fontsize",
    "|",
    "outdent",
    "indent",
    "align",
    "|",
    "hr",
    "|",
    "fullsize",
    "link",
  ];

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter job description...",
      defaultActionOnPaste: "insert_as_html",
      defaultLineHeight: 1.5,
      enter: "div",
      // options that we defined in above step.
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbarAdaptive: false,
    }),
    []
  );
  return (
    <>
      <div
        className={`fixed inset-0  z-50 flex items-center justify-center bg-black bg-opacity-50 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 max-h-[100vh] overflow-y-auto">
          <div className="flex justify-between mr-4">
            <div>
              <h2 className="text-xs text-[#364152] mt-3">Step 1 of 1</h2>
            </div>

            <div>
              <button
                className="text-2xl text-[#121926]"
                onClick={() => setModalOpen(!modalOpen)}
              >
                &times;
              </button>
            </div>
          </div>

          <h1 className="text-3xl text-[#121926] font-bold mb-3">
            Create a Job
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="">
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Title
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>

                <input
                  type="text"
                  {...register("jobTitle")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobTitle ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Job Title"
                />
                {errors.jobTitle && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobTitle.message}
                  </span>
                )}
              </div>
              {/* job location  */}
              <div className="">
                <label
                  htmlFor="jobLocation"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Location
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>
                <Controller
                  name="jobLocation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={locations}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption)
                      }
                      value={field.value}
                      placeholder="Select Job Location"
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (provided) => ({
                          ...provided,
                          paddingBlock: "2px",
                          borderRadius: "8px",
                          border: errors.jobLocation
                            ? "1px solid #ef4444"
                            : "1px solid #CDD5DF",
                          backgroundColor: "white",
                          display: "flex",
                          overflowX: "auto",
                          maxHeight: "43px",
                          "&::-webkit-scrollbar": { display: "none" },
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          overflow: "scroll",
                          maxHeight: "40px",
                          scrollbarWidth: "none",
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: errors.jobLocation
                            ? "#ef4444"
                            : "rgb(107 114 128)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          display: "inline-flex",
                          alignItems: "center",
                          backgroundColor: "white",
                          border: "2px solid #CDD5DF",
                        }),
                      }}
                    />
                  )}
                />
                {errors.jobLocation && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobLocation.message}
                  </span>
                )}
              </div>
              {/* //job type  */}
              <div className="">
                <label
                  htmlFor="job_type"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Type
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="job_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={jobTypes.map((type) => ({
                        label: type.label.job_type, // Extract the job type string
                        value: type.value.job_type, // Extract the job type string
                      }))}
                      {...field}
                      className={`${
                        errors.job_type ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  )}
                />

                {errors.job_type && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.job_type.message}
                  </span>
                )}
              </div>
              {/* job link  */}
              <div className="">
                <label
                  htmlFor="jobLink"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Link
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>
                <input
                  type="text"
                  {...register("jobLink")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobLink ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Job Link"
                />
                {errors.jobLink && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobLink.message}
                  </span>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="jobCategory"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Jobs Category
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>
                <select
                  {...register("jobCategory")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobsCategory ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                  <option className="text-lg font-bold" value="">
                    Select any one Category
                    <span
                      className="text-red-500
                    "
                    >
                      *
                    </span>
                  </option>
                  {jobCategoryData?.map((job) => (
                    <option
                      key={job.id}
                      value={`${job.name}`}
                      className="text-lg font-bold"
                    >
                      {job.name}
                    </option>
                  ))}
                </select>
                {errors.jobCategory && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.jobCategory.message}
                  </p>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="jobDescription"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Description
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>
                {/* <textarea
                  {...register("jobDescription")}
                  rows="4"
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobDescription
                      ? "border-red-500 "
                      : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2`}
                  placeholder="Job Description here"
                ></textarea> */}
                <JoditEditor
                  value={jobDescription}
                  ref={editor}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => {
                    setJobDescription(newContent);
                    setValue("jobDescription", newContent);
                  }}
                  onChange={() => {}}
                />
                {errors.jobDescription && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobDescription.message}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#2C5FC3] w-full text-white mt-2 font-semibold py-2 rounded-md flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ThreeDots
                  height="30"
                  width="40"
                  radius="9"
                  color="#ffffff"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              ) : (
                <span>{"Submit" || "Create Job"}</span>
              )}
            </button>
          </form>
        </div>
      </div>
      <Toaster />
      {/* </div> */}
    </>
  );
};

export default JobRegister1;

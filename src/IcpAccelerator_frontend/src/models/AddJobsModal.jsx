import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import { jobCategoryHandlerRequest } from "../components/StateManagement/Redux/Reducers/getJobCategory";

const schema = yup
  .object({
    jobTitle: yup
      .string()
      .required("Job Title is required")
      .min(5, "Title must be at least 5 characters"),
    jobLocation: yup.string().required("Job Location is required"),
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
      ),
  })
  .required();
const AddJobsModal = ({ onJobsClose, onSubmitHandler, isSubmitting }) => {
  const dispatch = useDispatch();
  const actor = useSelector((currState) => currState.actors.actor);
  const jobCategoryData = useSelector(
    (currState) => currState.jobsCategory.jobCategory
  );

  useEffect(() => {
    dispatch(jobCategoryHandlerRequest());
  }, [actor, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = (data) => {
    console.log(data);
    onSubmitHandler(data);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              <h3 className="text-xl font-semibold text-gray-900 ">
                Add Annoucement
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                onClick={onJobsClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="jobTitle"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black  hover:whitespace-normal truncate overflow-hidden hover:text-left"
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    {...register("jobTitle")}
                    className={`bg-gray-50 border-2 ${
                      errors.jobTitle
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Job Title"
                  />
                  {errors.jobTitle && (
                    <span className="mt-1 text-sm text-red-500 font-bold">
                      {errors.jobTitle.message}
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="jobLocation"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black  hover:whitespace-normal truncate overflow-hidden hover:text-left"
                  >
                    Job Location
                  </label>
                  <input
                    type="text"
                    {...register("jobLocation")}
                    className={`bg-gray-50 border-2 ${
                      errors.jobLocation
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Job Location"
                  />
                  {errors.jobLocation && (
                    <span className="mt-1 text-sm text-red-500 font-bold">
                      {errors.jobLocation.message}
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="jobLink"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black  hover:whitespace-normal truncate overflow-hidden hover:text-left"
                  >
                    Job Link
                  </label>
                  <input
                    type="text"
                    {...register("jobLink")}
                    className={`bg-gray-50 border-2 ${
                      errors.jobLink
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Job Link"
                  />
                  {errors.jobLink && (
                    <span className="mt-1 text-sm text-red-500 font-bold">
                      {errors.jobLink.message}
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="jobCategory"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Jobs Category
                  </label>
                  <select
                    {...register("jobCategory")}
                    className={`bg-gray-50 border-2 ${
                      errors.jobCategory
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="">
                      Select any one Category
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
                <div className="col-span-2">
                  <label
                    htmlFor="jobDescription"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black  hover:whitespace-normal truncate overflow-hidden hover:text-left"
                  >
                    Job Description
                  </label>
                  <textarea
                    {...register("jobDescription")}
                    rows="4"
                    className={`bg-gray-50 border-2 ${
                      errors.jobDescription
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Job Description here"
                  ></textarea>
                  {errors.jobDescription && (
                    <span className="mt-1 text-sm text-red-500 font-bold">
                      {errors.jobDescription.message}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                    wrapperclassName=""
                  />
                ) : (
                  "Add Jobs"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddJobsModal;

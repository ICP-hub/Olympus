import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ThreeDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { founderRegisteredHandlerRequest } from "../../StateManagement/Redux/Reducers/founderRegisteredData";

// Updated validation schema
const validationSchema = yup.object({
  icp_grants: yup
    .number()
    .typeError("You must enter a number")
    .min(0, "Must be a non-negative number")
    .required("Grants amount is required when money has been raised."),
  investors: yup
    .number()
    .typeError("You must enter a number")
    .min(0, "Must be a non-negative number")
    .required("Investors' funding amount is required when money has been raised."),
  raised_from_other_ecosystem: yup
    .number()
    .typeError("You must enter a number")
    .min(0, "Must be a non-negative number")
    .required("Funding from the launchpad is required when money has been raised."),
  target_amount: yup
    .number()
    .typeError("You must enter a number")
    .min(0, "Must be a non-negative number")
    .required("Target Amount is required"),
  sns: yup
    .number()
    .typeError("You must enter a number")
    .min(0, "Must be a non-negative number")
    .required("Target Amount is required"),
});

const MoneyRaisingModal = ({ modalOpen, setModalOpen }) => {
  const dispatch = useDispatch();
  const actor = useSelector((state) => state.actors.actor);
  const isAuthenticated = useSelector((currState) => currState.internet.isAuthenticated);

  const projectFullData = useSelector((currState) => currState.projectData.data);
  const projectId = projectFullData?.[0]?.[0]?.uid;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(founderRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

 console.log("weahfsiuwkehdbsnf", projectId)
const onSubmit = async (data) => {
    try {
      const formData = {
        icp_grants: data.icp_grants ? data.icp_grants.toString() : null, // Convert to string or null
        investors: data.investors ? data.investors.toString() : null, // Convert to string or null
        raised_from_other_ecosystem: data.raised_from_other_ecosystem ? data.raised_from_other_ecosystem.toString() : null, // Convert to string or null
        target_amount: data.target_amount ? parseFloat(data.target_amount) : null, // Convert to float or null
        sns: data.sns ? data.sns.toString() : null, 
      };
  
      console.log("Form Data to Submit:", formData);
     
  
      try {
        const result = await actor.update_money_raised_data(projectId, formData);
        if (result.Ok) {
          toast.success(result.Ok);
        } else {
          throw new Error(result.Err);
        }
      } catch (error) {
        toast.error("There was an error updating the money raised data");
        console.error("API call error:", error);
      }
  
      setModalOpen(false);
    } catch (error) {
      toast.error("There was an error submitting the form");
      console.error("Form submission error:", error);
    }
  };

  return (
    <>
   
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? "block" : "hidden"}`}>
          <div className="bg-white rounded-lg shadow-lg w-[500px] p-5 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={() => setModalOpen(!modalOpen)}
            >
              &times;
            </button>

            <h2 className="text-3xl text-[#121926] font-bold mb-3">
              Money Raising Details
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  How much funding have you raised in grants (USD)?
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("icp_grants")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.icp_grants ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Enter your Grants"
                  onWheel={(e) => e.target.blur()}
                  min={0}
                />
                {errors.icp_grants && (
                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                    {errors.icp_grants.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  How much funding have you received from Investors (USD)?
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("investors")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.investors ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Enter Investors"
                  onWheel={(e) => e.target.blur()}
                  min={0}
                />
                {errors.investors && (
                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                    {errors.investors.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  How much funding has been provided through the launchpad
                  program (USD)?<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("raised_from_other_ecosystem")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.raised_from_other_ecosystem
                      ? "border-red-500 "
                      : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Enter Launchpad"
                  onWheel={(e) => e.target.blur()}
                  min={0}
                />
                {errors.raised_from_other_ecosystem && (
                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                    {errors.raised_from_other_ecosystem.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Amount (in Millions USD)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("target_amount")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.target_amount
                      ? "border-red-500 "
                      : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Enter your Target Amount"
                  onWheel={(e) => e.target.blur()}
                  min={0}
                />
                {errors.target_amount && (
                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                    {errors.target_amount.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Valuation (USD)
                </label>
                <input
                  type="number"
                  {...register("sns")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.sns ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Enter sns (In million)"
                  onWheel={(e) => e.target.blur()}
                  min={0}
                />
                {errors.sns && (
                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                    {errors.sns.message}
                  </span>
                )}
              </div>

              {/* Full-width Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full mt-4 flex justify-center items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ThreeDots color="#FFF" height={13} width={51} />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>

    </>
  );
};

export default MoneyRaisingModal;

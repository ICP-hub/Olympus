import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { companyMetricsFormFields } from "../../Utils/Data/founderFormField";


const schema = yup
  .object({
    userNumber: yup.number().required("User number is required"),
    monthlySpending: yup.number().required("Monthly spending is required"),
    monthlyRevenue: yup.number().required("Monthly revenue is required"),
    debt: yup.string().required("Debt information is required"),
    capital: yup.string().required("Capital information is required"),
    existingUser: yup
      .string()
      .required("Existing user information is required"),
  })
  .required();


const CompanyMetrics = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = (data) => {
    console.log('companyMatrics data => ', data );
  };



  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full px-4 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[13.5px] md:text-[14px.3] md1:text-[14px] md2:text-[14px] md3:text-[14px] lg:text-[16.5px] dlg:text-[17px] lg1:text-[15.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px]"
      >
        {companyMetricsFormFields?.map(({ id, type, name, label }) => (
          <div key={id} className="relative z-0 w-full mb-5 group">
            <input
              {...register(name)}
              type={type}
              id={id}
              className="block py-4 font-bold md:py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
              placeholder=" "
            />
            <label
              htmlFor={id}
              className="peer-focus:font-medium absolute text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-gray-300 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              {label}
            </label>
            {errors[name] && (
              <p className="text-red-500 text-xs italic">
                {errors[name]?.message || "This field is required"}
              </p>
            )}
          </div>
        ))}

        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="text-black font-bold hover:text-white bg-white hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyMetrics;

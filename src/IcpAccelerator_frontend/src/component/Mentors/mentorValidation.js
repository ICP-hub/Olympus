 // user reg form validation schema
 import * as yup from "yup";

 export const validationSchema = yup
 .object()
 .shape({
   full_name: yup
     .string()
     .test("is-non-empty", "Full name is required", (value) =>
       /\S/.test(value)
     )
     .required("Full name is required"),
   email: yup.string().email("Invalid email").nullable(true).optional(),
   telegram_id: yup
     .string()
     .nullable(true)
     .optional()
     // .test("is-valid-telegram", "Invalid Telegram link", (value) => {
     //   if (!value) return true;
     //   const hasValidChars = /^[a-zA-Z0-9_]{5,32}$/.test(value);
     //   return hasValidChars;
     // })
     .url("Invalid url"),
   twitter_url: yup
     .string()
     .nullable(true)
     .optional()
     // .test("is-valid-twitter", "Invalid Twitter ID", (value) => {
     //   if (!value) return true;
     //   const hasValidChars =
     //   /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}$/.test(
     //       value
     //     );
     //   return hasValidChars;
     // })
     .url("Invalid url"),
   openchat_user_name: yup
     .string()
     .nullable(true)
     .test(
       "is-valid-username",
       "Username must be between 5 and 20 characters, and cannot start or contain spaces",
       (value) => {
         if (!value) return true;
         const isValidLength = value.length >= 5 && value.length <= 20;
         const hasNoSpaces = !/\s/.test(value) && !value.startsWith(" ");
         return isValidLength && hasNoSpaces;
       }
     ),
   bio: yup
     .string()
     .optional()
     .test(
       "maxWords",
       "Bio must not exceed 50 words",
       (value) =>
         !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
     )
     .test(
       "no-leading-spaces",
       "Bio should not have leading spaces",
       (value) => !value || value.trimStart() === value
     )
     .test(
       "maxChars",
       "Bio must not exceed 500 characters",
       (value) => !value || value.length <= 500
     ),
   country: yup
     .string()
     .test("is-non-empty", "Country is required", (value) =>
       /\S/.test(value)
     )
     .required("Country is required"),
   domains_interested_in: yup
     .string()
     .test("is-non-empty", "Selecting an interest is required", (value) =>
       /\S/.test(value)
     )
     .required("Selecting an interest is required"),
   type_of_profile: yup
     .string()
     .test("is-non-empty", "Type of profile is required", (value) =>
       /\S/.test(value)
     )
     .required("Type of profile is required"),
   reasons_to_join_platform: yup
     .string()
     .test("is-non-empty", "Selecting a reason is required", (value) =>
       /\S/.test(value)
     )
     .required("Selecting a reason is required"),

   image: yup
     .mixed()
     .nullable(true)
     .test("fileSize", "File size max 10MB allowed", (value) => {
       return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
     })
     .test(
       "fileType",
       "Only jpeg, jpg & png file format allowed",
       (value) => {
         return (
           !value ||
           (value &&
             ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
         );
       }
     ),
   preferred_icp_hub: yup
     .string()
     .test("is-non-empty", "ICP Hub selection is required", (value) =>
       /\S/.test(value)
     )
     .required("ICP Hub selection is required"),
   multi_chain: yup
     .string()
     .required("Required")
     .oneOf(["true", "false"], "Invalid value"),
   multi_chain_names: yup
     .string()
     .when("multi_chain", (val, schema) =>
       val && val[0] === "true"
         ? schema

             .test(
               "is-non-empty",
               "Atleast one chain name required",
               (value) => /\S/.test(value)
             )
             .required("Atleast one chain name required")

         : schema
     ),
   category_of_mentoring_service: yup
     .string()
     .test("is-non-empty", "Selecting a service is required", (value) =>
       /\S/.test(value)
     )
     .required("Selecting a service is required"),
   icp_hub_or_spoke: yup
     .string()
     .required("Required")
     .oneOf(["true", "false"], "Invalid value"),
   hub_owner: yup
     .string()
     .when("icp_hub_or_spoke", (val, schema) =>
       val && val[0] === "true"
         ? schema

           .test(
             "is-non-empty",
             "ICP Hub selection is required",
             (value) => /\S/.test(value)
           )
           .required("ICP Hub selection is required")

         : schema
     ),
   mentor_website_url: yup
     .string()
     .nullable(true)
     .optional()
     .url("Invalid url"),
   years_of_mentoring: yup
     .number()
     .typeError("You must enter a number")
     .positive("Must be a positive number")
     .required("Years of experience mentoring startups is required"),
   mentor_linkedin_url: yup
     .string()
     // .test("is-non-empty", "LinkedIn url is required", (value) =>
     //   /\S/.test(value)
     // )
     // .matches(
     //   /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
     //   "Invalid LinkedIn URL"
     // )
     .url("Invalid url")
     .required("LinkedIn url is required"),
 })
 .required();

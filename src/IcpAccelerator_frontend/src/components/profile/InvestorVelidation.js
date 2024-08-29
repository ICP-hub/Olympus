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
    .url("Invalid url"),
  twitter_url: yup
    .string()
    .nullable(true)
    .optional()
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
  investor_registered: yup
    .string()
    .required("Required")
    .oneOf(["Yes", "No"], "Invalid value"),
  registered_country: yup
    .string()
    .when("investor_registered", (val, schema) =>
      val && val[0] === "Yes"
        ? schema
          .test(
            "is-non-empty",
            "Registered country name required",
            (value) => /\S/.test(value)
          )
          .required("Registered country name required")
        : schema
    ),
  preferred_icp_hub: yup
    .string()
    .test("is-non-empty", "ICP Hub selection is required", (value) =>
      /\S/.test(value)
    )
    .required("ICP Hub selection is required"),
  existing_icp_investor: yup
    .string()
    .oneOf(["Yes", "No"], "Invalid value"),
  investment_type: yup
    .string()
    .when("existing_icp_investor", (val, schema) =>
      val && val[0] === "Yes"
        ? schema
          .test(
            "is-non-empty",
            "At least one investment type required",
            (value) => /\S/.test(value)
          )
          .required("At least one investment type required")
        : schema
    ),
  investor_portfolio_link: yup
    .string()
    .test("is-non-empty", "Portfolio url is required", (value) =>
      /\S/.test(value)
    ).nullable(true)
    .url("Invalid url")
    .required("Portfolio url is required"),
  investor_fund_name: yup
    .string()
    .test("is-non-empty", "Fund name is required", (value) =>
      /\S/.test(value)
    )
    .required("Fund name is required"),
  investor_fund_size: yup
    .number()
    .optional()
    .nullable(true)
    .typeError("You must enter a number")
    .positive("Must be a positive number"),
  invested_in_multi_chain: yup
    .string()
    .required("Required")
    .oneOf(["Yes", "No"], "Invalid value"),
  invested_in_multi_chain_names: yup.string().required("Selecting a Multichain is required"),
  investment_categories: yup
    .string()
    .test("is-non-empty", "Selecting a category is required", (value) =>
      /\S/.test(value)
    )
    .required("Selecting an category is required"),
  investor_website_url: yup
    .string()
    .nullable(true)
    .optional()
    .url("Invalid url"),
  investor_linkedin_url: yup
    .string()
    .required("LinkedIn URL is required")
    .url("Invalid url")
    .required("LinkedIn url is required"),
  investment_stage: yup
    .string()
    .test("is-non-empty", "Investment stage is required", (value) =>
      /\S/.test(value)
    )
    .required("Investment stage is required"),
  investment_stage_range: yup
    .string()
    .when("investment_stage", (val, schema) =>
      val && val !== "we do not currently invest"
        ? schema
          .test("is-non-empty", "At least one range required", (value) =>
            /\S/.test(value)
          )
          .required("At least one range required")
        : schema
    ),
})
.required();
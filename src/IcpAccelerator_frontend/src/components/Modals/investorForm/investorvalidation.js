import * as yup from "yup";

export const validationSchema = yup
.object()
.shape({
  investor_registered: yup
    .string()
    .required("Required")
    .oneOf(["true", "false"], "Invalid value"),
  registered_country: yup
    .string()
    .when("investor_registered", (val, schema) =>
      val && val[0] === "true"
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
    .oneOf(["true", "false"], "Invalid value"),
  investment_type: yup
    .string()
    .when("existing_icp_investor", (val, schema) =>
      val && val[0] === "true"
        ? schema
          .test(
            "is-non-empty",
            "Atleast one investment type required",
            (value) => /\S/.test(value)
          )
          .required("Atleast one investment type required")
        : schema
    ),
  investor_portfolio_link: yup
    .string()
    .url("Invalid URL")
  .required("Portfolio URL is required"),


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
    .oneOf(["true", "false"], "Invalid value"),
  invested_in_multi_chain_names: yup
    .string()
    .when("invested_in_multi_chain", (val, schema) =>
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
          .test("is-non-empty", "Atleast one range required", (value) =>
            /\S/.test(value)
          )
          .required("Atleast one range required")
        : schema
    ),
})
.required();

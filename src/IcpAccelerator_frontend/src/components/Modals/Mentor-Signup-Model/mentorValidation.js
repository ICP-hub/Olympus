import * as yup from "yup";

export const validationSchema = yup.object().shape({
    preferred_icp_hub: yup.string().required("ICP Hub selection is required"),
    multi_chain: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
    multi_chain_names: yup.string().when("multi_chain", (val, schema) =>
      val && val[0] === "true" ? schema.required("At least one chain name required") : schema
    ),
    category_of_mentoring_service: yup.string().required("Selecting a service is required"),
    icp_hub_or_spoke: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
    hub_owner: yup.string().when("icp_hub_or_spoke", (val, schema) =>
      val && val[0] === "true" ? schema.required("ICP Hub selection is required") : schema
    ),
    mentor_website_url: yup.string().nullable(true).optional().url("Invalid url"),
    years_of_mentoring: yup
      .number()
      .typeError("You must enter a number")
      .positive("Must be a positive number")
      .required("Years of experience mentoring startups is required"),
    links: yup.array().of(
      yup.object().shape({
        url: yup.string().url("Invalid URL").nullable(true).optional(),
      })
    ),
  });

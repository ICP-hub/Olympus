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
    area_of_expertise: yup
    .string()
    .required("Selecting a category is required")
    .test(
      "at-least-one",
      "You must select at least one category",
      (value) => value && value.split(", ").length > 0
    ),
    reasons_to_join_platform: yup
    .string()
    .test("is-non-empty", "Selecting a reason is required", (value) =>
      /\S/.test(value)
    )
    .required("Selecting a reason is required"),
    mentor_website_url: yup
    .string()
      .nullable(true)
      .optional()
      .matches(/^[a-zA-Z0-9@.\/:\-]*$/, "Website Link should be valid")
      .test(
        "is-url-valid",
        "Invalid URL",
        (value) => !value || yup.string().url().isValidSync(value)
      ),

      years_of_mentoring: yup
      .number()
      .min(0, "Must be a non-negative number")
      .max(100, "Must be 100 or less") // Add this line to set the maximum limit
      .required("Fund is required")
      .typeError("You must enter a number")
      .test(
        "not-negative-zero",
        "Negative zero (-0) is not allowed",
        (value) => Object.is(value, -0) === false
      ),
    
      links: yup
      .array()
      .of(
        yup.object().shape({
          link: yup
            .string()
            .test(
              "no-leading-trailing-spaces",
              "URL should not have leading or trailing spaces",
              (value) => {
                return value === value?.trim();
              }
            )
            .test(
              "no-invalid-extensions",
              "URL should not end with .php, .js, or .txt",
              (value) => {
                const invalidExtensions = [".php", ".js", ".txt"];
                return value
                  ? !invalidExtensions.some((ext) => value.endsWith(ext))
                  : true;
              }
            )
            .test("is-website", "Only website links are allowed", (value) => {
              if (value) {
                try {
                  const url = new URL(value);
                  const hostname = url.hostname.toLowerCase();
                  const validExtensions = [
                    ".com",
                    ".org",
                    ".net",
                    ".in",
                    ".co",
                    ".io",
                    ".gov",
                  ];
                  const hasValidExtension = validExtensions.some((ext) =>
                    hostname.endsWith(ext)
                  );
                  return hasValidExtension;
                } catch (err) {
                  return false;
                }
              }
              return true;
            })
            .url("Invalid URL")
            .nullable(true)
            .optional(),
        })
      )
      .max(10, "You can only add up to 10 links") // Restrict the array to a maximum of 10 links
      .optional(),
  });

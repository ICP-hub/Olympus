import * as yup from 'yup';

export const validationSchema = yup
  .object()
  .shape({
    full_name: yup
      .string()
      .trim('Full name should not have leading or trailing spaces') // Ensures no leading/trailing spaces
      .strict(true) // Enforce strict trimming, so leading/trailing spaces cause validation errors
      .matches(/^[A-Za-z\s]+$/, 'Full name can only contain letters and spaces')
      .test(
        'no-leading-space',
        'Full name should not start with a space',
        (value) => value && value[0] !== ' ' // Ensure no leading space
      )
      .min(3, 'Full name must be at least 3 characters long')
      .max(50, 'Full name cannot be more than 50 characters long')
      .required('Full name is required'),

    email: yup
      .string()
      .trim('Email should not have leading or trailing spaces')
      .required('Email is required')
      .matches(
        /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/,
        'Invalid Email format'
      )
      .test(
        'local-part-length',
        'Email local part should be between 6 and 30 characters',
        (value) => {
          if (!value) return true; // Prevent running the logic if value is undefined
          const [localPart] = value.split('@');
          return localPart.length >= 6 && localPart.length <= 30;
        }
      )
      .test(
        'no-special-chars',
        'Email should not contain special characters in the local part',
        (value) => {
          if (!value) return true;
          const [localPart] = value.split('@');
          return /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/.test(localPart);
        }
      )
      .test('single-at', "Email should contain only one '@'", (value) => {
        if (!value) return true;
        return (value.match(/@/g) || []).length === 1;
      })
      .test(
        'dots-in-domain',
        'Email should contain 1 or 2 dots in the domain',
        (value) => {
          if (!value) return true;

          const parts = value.split('@');
          if (parts.length < 2) return false; // If no "@" present or invalid email

          const domain = parts[1];
          const dotCount = (domain.match(/\./g) || []).length;
          return dotCount >= 1 && dotCount <= 2;
        }
      ),

    links: yup
      .array()
      .of(
        yup.object().shape({
          link: yup
            .string()
            .test(
              'no-leading-trailing-spaces',
              'URL should not have leading or trailing spaces',
              (value) => {
                return value === value?.trim();
              }
            )
            .test(
              'no-invalid-extensions',
              'URL should not end with .php, .js, or .txt',
              (value) => {
                const invalidExtensions = ['.php', '.js', '.txt'];
                return value
                  ? !invalidExtensions.some((ext) => value.endsWith(ext))
                  : true;
              }
            )
            .test('is-website', 'Only website links are allowed', (value) => {
              if (value) {
                try {
                  const url = new URL(value);
                  const hostname = url.hostname.toLowerCase();
                  const validExtensions = [
                    '.com',
                    '.org',
                    '.net',
                    '.in',
                    '.co',
                    '.io',
                    '.gov',
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
            .url('Invalid URL')
            .nullable(true)
            .optional(),
        })
      )
      .max(10, 'You can only add up to 10 links') // Restrict the array to a maximum of 10 links
      .optional(),

    openchat_user_name: yup
      .string()
      .required('Username is required')
      .test(
        'is-valid-username',
        "Username must be between 5 and 20 characters, contain no spaces, and only include letters, numbers, underscores, or '@'.",
        (value) => {
          const isValidLength =
            value && value.length >= 5 && value.length <= 20;
          const isValidFormat = /^[a-zA-Z0-9_@-]+$/.test(value); // Allows letters, numbers, underscores, '@', and '-'
          const noSpaces = !/\s/.test(value);
          return isValidLength && isValidFormat && noSpaces;
        }
      ),
    bio: yup
      .string()
      .required('This field is required')
      .test(
        'maxWords',
        'Bio must not exceed 50 words',
        (value) =>
          !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
      )
      .test(
        'no-leading-spaces',
        'Bio should not have leading spaces',
        (value) => !value || value.trimStart() === value
      )
      .test(
        'maxChars',
        'Bio must not exceed 500 characters',
        (value) => !value || value.length <= 500
      ),

    country: yup.string().required('You must select at least one option'),
    domains_interested_in: yup
      .string()
      .required('Selecting an interest is required'),

    type_of_profile: yup
      .string()
      .required('You must select at least one option'),
    reasons_to_join_platform: yup
      .string()
      .test('is-non-empty', 'Selecting a reason is required', (value) =>
        /\S/.test(value)
      )
      .required('Selecting a reason is required'),

    image: yup
      .mixed()
      .nullable(true) // Allow null for optional file input
      .test('fileSize', 'File size max 10MB allowed', (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
      })
      .test('fileType', 'Only jpeg, jpg & png file format allowed', (value) => {
        return (
          !value ||
          (value &&
            ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type))
        );
      }),
  })
  .required();

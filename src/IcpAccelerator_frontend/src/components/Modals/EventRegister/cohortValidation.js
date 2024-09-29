import * as yup from 'yup';
import { startOfToday } from 'date-fns';

export const validationSchema = yup.object({
  title: yup
    .string()
    .trim('Cohort Title should not have leading or trailing spaces')
    .strict(true)
    .matches(
      /^[A-Za-z0-9\s]+$/,
      'Cohort Title can only contain letters, numbers, and spaces'
    )
    .test(
      'no-leading-space',
      'Cohort Title should not start with a space',
      (value) => value && value[0] !== ' '
    )
    .min(3, 'Cohort Title must be at least 3 characters long')
    .max(30, 'Cohort Title cannot be more than 30 characters long')
    .required('Cohort Title is required'),

  description: yup
    .string()
    .trim()
    .required('Description is required')
    .matches(/^[^\s].*$/, 'Cannot start with a space')
    .test(
      'no-leading-spaces',
      'Description should not have leading spaces',
      (value) => !value || value.trimStart() === value
    )
    .test(
      'maxWords',
      'Description must not exceed 1000 words',
      (value) =>
        !value || value.trim().split(/\s+/).filter(Boolean).length <= 1000
    )
    .test(
      'maxChars',
      'Description must not exceed 5000 characters',
      (value) => !value || value.length <= 5000
    ),

  cohort_launch_date: yup
    .date()
    .required('Cohort Launch date is required')
    .typeError('Must be a date')
    .min(startOfToday(), 'Cohort Launch date cannot be before today'),

  cohort_end_date: yup
    .date()
    .required('Cohort End date is required')
    .typeError('Must be a date')
    .min(
      yup.ref('cohort_launch_date'),
      'Cohort End date cannot be before Cohort launch date'
    ),

  tags: yup
    .string()
    .test('is-non-empty', 'Selecting an interest is required', (value) =>
      /\S/.test(value)
    )
    .required('Selecting an interest is required'),

  deadline: yup
    .date()
    .required('Application Deadline is required')
    .typeError('Must be a valid date')
    .max(
      yup.ref('cohort_launch_date'),
      'Application Deadline must be before the Cohort Launch date'
    ),

  eligibility: yup
    .string()
    .typeError('You must enter eligibility')
    .matches(
      /^[A-Za-z0-9\s]+$/,
      'Cohort Title can only contain letters, numbers, and spaces'
    )
    .test(
      'no-leading-space',
      'Cohort Title should not start with a space',
      (value) => value && value[0] !== ' '
    )
    .required('Eligibility is required'),

  no_of_seats: yup
    .number()
    .typeError('You must enter a number')
    .required('Number of seats is required')
    .min(0, 'The number of seats cannot be negative')
    .max(
      10000000,
      'The number of seats cannot be greater than 1 crore (10 million)'
    ),

  area: yup.string().typeError('You must enter an area'),

  country: yup.string().typeError('You must enter an country'),

  rubric_eligibility: yup.number().typeError('You must enter an number'),
  funding_type: yup
    .string()
    .typeError('You must enter a funding type')
    .required('Funding Type is required'),

  funding_amount: yup
    .string()
    .typeError('You must enter a funding amount')
    .required('Funding Amount is required'),

  cohort_banner: yup
    .mixed()
    .required('Cohort Banner is required')
    .test('fileSize', 'File size max 10MB allowed', (value) => {
      return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
    })
    .test('fileType', 'Only jpeg, jpg & png file format allowed', (value) => {
      return (
        !value ||
        (value && ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type))
      );
    }),
});

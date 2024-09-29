import * as yup from 'yup';
export const fileSchema = yup.object({
  logo: yup
    .mixed()
    .nullable(true)
    .test('fileSize', 'File size max 10MB allowed', (value) => {
      return !value || (value && value.size <= 10 * 1024 * 1024);
    })
    .test('fileType', 'Only jpeg, jpg & png file format allowed', (value) => {
      return (
        !value ||
        (value && ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type))
      );
    }),
  cover: yup
    .mixed()
    .nullable(true)
    .test('fileSize', 'File size max 10MB allowed', (value) => {
      return !value || (value && value.size <= 10 * 1024 * 1024);
    })
    .test('fileType', 'Only jpeg, jpg & png file format allowed', (value) => {
      return (
        !value ||
        (value && ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type))
      );
    }),
});

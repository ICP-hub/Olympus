// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { ThreeDots } from "react-loader-spinner";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// const schema = yup
//   .object({
//     announcementTitle: yup
//       .string()
//       .required("Announcement title is required")
//       .min(5, "Title must be at least 5 characters")
//       .test(
//         "no-leading-spaces",
//         "Announcement title should not have leading spaces",
//         (value) => !value || value.trimStart() === value
//       ),
//     announcementDescription: yup
//       .string()
//       .required("Description is required")
//       .test(
//         "maxWords",
//         "Announcement description must not exceed 50 words",
//         (value) =>
//           !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
//       )
//       .test(
//         "maxChars",
//         "Announcement description must not exceed 500 characters",
//         (value) => !value || value.length <= 500
//       )
//       .test(
//         "no-leading-spaces",
//         "Announcement description should not have leading spaces",
//         (value) => !value || value.trimStart() === value
//       ),
//   })
//   .required();

// const AnnouncementModal = ({
//     isOpen,  onClose, onSubmitHandler, isSubmitting ,isUpdate ,data
// }) => {
//   const [formData, setFormData] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "all",
//   });

//   //   const onSubmit = (data) => {
//   //     setFormData(data);
//   //     console.log(data);
//   //     setModalOpen(false);
//   //   };
//   useEffect(() => {
//     if (isUpdate && data) {
//       setValue(
//         "announcementTitle",
//         data?.announcement_data?.announcement_title ?? ""
//       );
//       setValue(
//         "announcementDescription",
//         data?.announcement_data?.announcement_description ?? ""
//       );
//     }
//   }, [isUpdate, data, setValue]);

//   const onSubmit = (data) => {
//     console.log(data);
//     onSubmitHandler(data);
//   };

//   return (
//     <div>
//       {isOpen && (
//         <div
//           className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
//             isOpen ? "block" : "hidden"
//           }`}
//         >
//           <div className="bg-white rounded-lg shadow-lg w-[500px] p-2">
//             <div className="flex justify-between items-center ml-6 mb-2">
//               <button
//                 className="text-[#364152] text-3xl"
//                 onClick={onClose}
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="p-3">
//               <h2 className="text-xl font-bold ml-4 mb-2">
//                 {isUpdate === true ? "Update Announcement" : "Add Announcement"}
//               </h2>

//               <form onSubmit={handleSubmit(onSubmit)} className="p-3 md:p-5">
//                 <div className="grid gap-4 mb-4 grid-cols-2">
//                   <div className="col-span-2">
//                     <label
//                       htmlFor="announcementTitle"
//                       className="block text-base font-medium mb-2"
//                     >
//                       Announcement Title
//                     </label>
//                     <input
//                       type="text"
//                       {...register("announcementTitle")}
//                       className={`bg-gray-50 border ${
//                         errors.announcementTitle
//                           ? "border-red-500 placeholder:text-red-500"
//                           : "border-[#737373]"
//                       } text-gray-700 placeholder-gray-500 placeholder:font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5`}
//                       placeholder="Announcement Title"
//                     />
//                     {errors.announcementTitle && (
//                       <span className="mt-1 text-sm text-red-500 font-semibold">
//                         {errors.announcementTitle.message}
//                       </span>
//                     )}
//                   </div>

//                   <div className="col-span-2">
//                     <label
//                       htmlFor="announcementDescription"
//                       className="block text-base font-medium mb-2"
//                     >
//                       Announcement Description
//                     </label>
//                     <textarea
//                       {...register("announcementDescription")}
//                       rows="4"
//                       className={`bg-gray-50 border ${
//                         errors.announcementDescription
//                           ? "border-red-500 placeholder:text-red-500"
//                           : "border-[#737373]"
//                       } text-gray-700 placeholder-gray-500 placeholder:font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5`}
//                       placeholder="Announcement Description here"
//                     ></textarea>
//                     {errors.announcementDescription && (
//                       <span className="mt-1 text-sm text-red-500 font-semibold">
//                         {errors.announcementDescription.message}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="py-2 px-4 text-white rounded-xl bg-blue-600 border border-[#B2CCFF] w-full justify-center flex items-center"
//                 >
//                   {isSubmitting ? (
//                     <ThreeDots
//                       visible={true}
//                       height="35"
//                       width="35"
//                       color="#FFFEFF"
//                       radius="9"
//                       ariaLabel="three-dots-loading"
//                       wrapperStyle={{}}
//                       wrapperclassName=""
//                     />
//                   ) : isUpdate ? (
//                     "Update Announcement"
//                   ) : (
//                     "Add new Announcement"
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnnouncementModal;

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ThreeDots } from 'react-loader-spinner';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object({
    announcementTitle: yup
      .string()
      .required('Announcement title is required')
      .min(5, 'Title must be at least 5 characters')
      .test(
        'no-leading-spaces',
        'Announcement title should not have leading spaces',
        (value) => !value || value.trimStart() === value
      ),
    announcementDescription: yup
      .string()
      .required('Description is required')
      .test(
        'maxWords',
        'Announcement description must not exceed 50 words',
        (value) =>
          !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
      )
      .test(
        'maxChars',
        'Announcement description must not exceed 500 characters',
        (value) => !value || value.length <= 500
      )
      .test(
        'no-leading-spaces',
        'Announcement description should not have leading spaces',
        (value) => !value || value.trimStart() === value
      ),
  })
  .required();

const AnnouncementModal = ({
  isOpen,
  onClose,
  onSubmitHandler,
  isSubmitting,
  isUpdate,
  data,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  useEffect(() => {
    if (isUpdate && data) {
      setValue(
        'announcementTitle',
        data?.announcement_data?.announcement_title ?? ''
      );
      setValue(
        'announcementDescription',
        data?.announcement_data?.announcement_description ?? ''
      );
    }
  }, [isUpdate, data, setValue]);

  const onSubmit = (formData) => {
    onSubmitHandler(formData);
  };

  return (
    <div>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white mx-4 rounded-lg shadow-lg w-[500px] p-2'>
            <div className='flex justify-between items-center ml-6 mb-2'>
              <button className='text-[#364152] text-3xl' onClick={onClose}>
                &times;
              </button>
            </div>
            <div className='p-3'>
              <h2 className='text-xl font-bold ml-4 mb-2'>
                {isUpdate ? 'Update Announcement' : 'Add Announcement'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className='p-3 md:p-5'>
                <div className='grid gap-4 mb-4 grid-cols-2'>
                  <div className='col-span-2'>
                    <label
                      htmlFor='announcementTitle'
                      className='block text-base font-medium mb-2'
                    >
                      Announcement Title
                    </label>
                    <input
                      type='text'
                      {...register('announcementTitle')}
                      className={`bg-gray-50 border ${
                        errors.announcementTitle
                          ? 'border-red-500 placeholder:text-red-500'
                          : 'border-[#737373]'
                      } text-gray-700 placeholder-gray-500 placeholder:font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5`}
                      placeholder='Announcement Title'
                    />
                    {errors.announcementTitle && (
                      <span className='mt-1 text-sm text-red-500 font-semibold'>
                        {errors.announcementTitle.message}
                      </span>
                    )}
                  </div>

                  <div className='col-span-2'>
                    <label
                      htmlFor='announcementDescription'
                      className='block text-base font-medium mb-2'
                    >
                      Announcement Description
                    </label>
                    <textarea
                      {...register('announcementDescription')}
                      rows='4'
                      className={`bg-gray-50 border ${
                        errors.announcementDescription
                          ? 'border-red-500 placeholder:text-red-500'
                          : 'border-[#737373]'
                      } text-gray-700 placeholder-gray-500 placeholder:font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5`}
                      placeholder='Announcement Description here'
                    ></textarea>
                    {errors.announcementDescription && (
                      <span className='mt-1 text-sm text-red-500 font-semibold'>
                        {errors.announcementDescription.message}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='py-2 px-4 text-white rounded-xl bg-blue-600 border border-[#B2CCFF] w-full justify-center flex items-center'
                >
                  {isSubmitting ? (
                    <ThreeDots
                      visible={true}
                      height='35'
                      width='35'
                      color='#FFFEFF'
                      radius='9'
                      ariaLabel='three-dots-loading'
                    />
                  ) : isUpdate ? (
                    'Update Announcement'
                  ) : (
                    'Add new Announcement'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementModal;

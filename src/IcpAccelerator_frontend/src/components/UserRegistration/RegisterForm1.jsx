
// import React, { useState, useEffect } from "react";

// import { useFormContext } from "react-hook-form";
// import { generateUsername } from 'unique-username-generator';


// const RegisterForm1 = React.memo(() => {

//   const { register, formState: { errors }, watch, setValue } = useFormContext({mode:'all'});
//   const [suggestions, setSuggestions] = useState([]);
//   const username = watch('openchat_user_name', '');

//   useEffect(() => {
//     if (username) {

//       const newSuggestions = [
//         generateUsername("-", 2, 10, username),
//         generateUsername("@", 1, 16, username),
//         generateUsername("_", 2, 20, username)
//       ];
//       setSuggestions(newSuggestions);
//     } else {
//       setSuggestions([]);
//     }
//   }, [username]);

//   const handleSuggestionClick = (suggestion) => {
//     setValue("openchat_user_name", suggestion);
//     setSuggestions([]);
//   };

//   return (
//     <>
//       <div className="overflow-y-auto ">
//         <div className="mb-6">

//           <h1 className="text-4xl font-bold  text-[#121926]">

//             What is your name?
//           </h1>
//         </div>
//         <div className="space-y-4">
//           <div className="flex flex-col justify-between gap-3">
//             <label
//               htmlFor="full_name"
//               className=" font-semibold block text-[#121926]"
//             >
//               Full Name <span className="text-[red] ml-1">*</span>
//             </label>
//             <input
//               type="text"
//               {...register("full_name")}

//               className={`bg-white border-2 ${errors?.full_name ? "border-red-500" : "border-[#737373]"
//                 } mt-1 p-2 border border-gray-300 rounded w-full `}

//               placeholder="Enter your full name"
//             />
//             {errors?.full_name && (
//               <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
//                 {errors?.full_name?.message}
//               </span>
//             )}
//           </div>
//           <div className="flex flex-col justify-between gap-3">
//             <label

//               htmlFor="openchat_user_name"
//               className="block font-semibold text-[#121926]">
//               Username  
//             </label>
//             <div className="flex items-center border-2 border-gray-300 mt-1 rounded-md">
//               <span className="p-2 bg-white text-gray-600 rounded-l-md border-r-2 border-gray-300">@</span>
//               <input
//                 type="text"
//                 {...register("openchat_user_name")}
//                 className={`bg-white  ${errors?.openchat_user_name
//                     ? "border-red-500 "
//                     : "border-[#737373]"
//                   } p-2 w-full rounded`}
//                 placeholder="Enter your username"
//               />
//             </div>
//             {errors?.openchat_user_name && (
//               <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
//                 {errors?.openchat_user_name?.message}
//               </span>
//             )}

//           </div>
//           {suggestions.map((suggestion, index) => (
//             <div
//               key={index}
//               className="text-[#155EEF] font-bold cursor-pointer"
//               onClick={() => handleSuggestionClick(suggestion)}
//             >
//               {suggestion}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
  
// });

// export default RegisterForm1;


import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { generateUsername } from 'unique-username-generator';

const RegisterForm1 = React.memo(() => {
  const { register, formState: { errors }, watch, setValue } = useFormContext({ mode: 'all' });
  const [suggestions, setSuggestions] = useState([]);
  const username = watch('openchat_user_name', '');

  useEffect(() => {
    if (username) {
      const newSuggestions = [
        generateUsername("-", 2, 10, username),
        generateUsername("@", 1, 16, username),
        generateUsername("_", 2, 20, username)
      ];
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [username]);

  const handleSuggestionClick = (suggestion) => {
    setValue("openchat_user_name", suggestion);
    setSuggestions([]);
  };

  return (
    <div className="overflow-y-auto px-4 ">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#121926]">What is your name?</h1>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3">
          <label htmlFor="full_name" className="font-semibold block text-[#121926]">
            Full Name <span className="text-[red] ml-1">*</span>
          </label>
          <input
            type="text"
            {...register("full_name")}
            className={`bg-white border-2 ${errors?.full_name ? "border-red-500" : "border-[#737373]"
              } mt-1 p-2 border-gray-300 rounded w-full `}
            placeholder="Enter your full name"
          />
          {errors?.full_name && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors?.full_name?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col justify-between gap-3">
          <label htmlFor="openchat_user_name" className="block font-semibold text-[#121926]">
            Username
          </label>
          <div className="flex items-center border-2 border-gray-300 mt-1 rounded-md">
            <span className="p-2 bg-white text-gray-600 rounded-l-md border-r-2 border-gray-300">@</span>
            <input
              type="text"
              {...register("openchat_user_name")}
              className={`bg-white ${errors?.openchat_user_name
                ? "border-red-500 "
                : "border-[#737373]"
                } p-2 w-full rounded`}
              placeholder="Enter your username"
            />
          </div>
          {errors?.openchat_user_name && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors?.openchat_user_name?.message}
            </span>
          )}
        </div>
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="text-[#155EEF] font-bold cursor-pointer"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
});

export default RegisterForm1;




import React from 'react'

const MentorDetails = ({ onSubmit, register, errors, fields, goToPrevious, goToNext }) => {
    return (
        <div>
          <form onSubmit={onSubmit} className="w-full px-4">
            {fields.map((field) => (
              <div key={field.id} className="relative z-0 w-full mb-5 group">
                <input
                  type={field.type}
                  name={field.name}
                  id={field.id}
                  {...register(field.name)}
                  className="block pb-2.5 pt-6 font-bold px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                  placeholder={field.placeholder}
                />
                <label
                  htmlFor={field.id}
                  className="peer-focus:font-medium absolute text-white duration-300 transform -translate-y-6 scale-80 top-6 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-gray-300 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  {field.label}
                </label>
                {errors[field.name] && (
                  <span className="text-red-500">{errors[field.name].message}</span>
                )}
              </div>
            ))}
    
            <div className="flex justify-end">
            <button
                type="button"
                className="text-black font-bold hover:text-white bg-white hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 fon rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4"
             
             onClick={goToPrevious}>
                Previous
              </button>
              <button
                type="button"
                className="text-black font-bold hover:text-white bg-white hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 fon rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4 ml-4"
             
             onClick={goToNext}>
                Next
              </button>
            </div>
          </form>
        </div>
      );
}

export default MentorDetails
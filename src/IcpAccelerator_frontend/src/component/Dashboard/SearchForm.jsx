import React, { useState } from "react";

const SearchForm = () => {
  const [isInputVisible, setInputVisibility] = useState(false);

  const handleSvgClick = () => {
    setInputVisibility(!isInputVisible);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="flex items-center " onSubmit={handleSubmit}>
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
        {isInputVisible && (
          <input
            type="text"
            id="simple-search"
            className="bg-transparent border border-violet-900 hover:border-violet-600 text-black font-semibold text-sm px-2 py-2 rounded-md block w-full ps-10 caret-white focus:outline-none focus:border-violet-800"
            placeholder="Search Project..."
            required
          />
        )}
      </div>
      <button
        type="button"
        className="p-2.5 ms-2 text-sm font-medium text-blue-900 bg-gray-200 rounded-lg border  "
        onClick={handleSvgClick}
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};

export default SearchForm;

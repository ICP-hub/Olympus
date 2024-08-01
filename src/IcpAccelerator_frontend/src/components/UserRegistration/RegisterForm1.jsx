import { setUncaughtExceptionCaptureCallback } from "process";
import React from "react";
import Layer1 from "../../../assets/Logo/Layer1.png";
import Aboutcard from "./Aboutcard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Link } from "react-router-dom";
import AboutcardSkeleton from "../LatestSkeleton/AbourcardSkeleton";
import { generateUsername } from "unique-username-generator";
const RegisterForm1 = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (inputValue) {
      const similarUsernames = Array.from({ length: 5 }, () =>
        generateUsername(inputValue)
      );
      setSuggestions(similarUsernames);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <>
      <div className="overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mx-12 text-[#121926]">
            What is your name?
          </h1>
        </div>
        <form className="space-y-4">
          <div className="flex justify-between space-x-2 gap-3">
            <div>
              <label className=" font-semibold block text-[#121926]">
                First name <span className="text-[#155EEF]">*</span>
              </label>
              <input
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded w-full "
                placeholder="First name"
              />
            </div>
            <div>
              <label className="font-semibold block text-[#121926]">
                Last name <span className="text-[#155EEF]">*</span>
              </label>
              <input
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                placeholder="Last name"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-[#121926]">
              Username <span className="text-[#155EEF]">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <span className="p-2 bg-gray-100 text-gray-600">@</span>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Username"
                className="p-2 w-full"
              />
            </div>
          </div>
          {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      )}
        </form>
      </div>
    </>
  );
};
export default RegisterForm1;

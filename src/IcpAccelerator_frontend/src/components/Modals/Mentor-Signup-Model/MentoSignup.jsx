import React, { useState, useEffect } from "react";
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Dropdown from "../../../../assets/Logo/Dropdown.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import Select from "react-select";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const MentorSignup1 = ({ isOpen, onClose, onBack }) => {
  const [formData, setFormData] = useState({
    tagline: "",
    about: "",
    category: "Infrastructure",
    stage: "MVP",
    links: [""],
    multiChain: "no",
    chains: [],
    liveOnICP: "no",
    dAppLink: "",
    weeklyActiveUsers: "",
    revenue: "",
  });

  const [modalOpen, setModalOpen] = useState(isOpen || true);
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#CDD5DF",
      borderRadius: "0.375rem",
    }),
    controlIsFocused: (provided) => ({
      ...provided,
      borderColor: "black",
      boxShadow: "none",
    }),
    multiValue: (provided) => ({
      ...provided,
      borderColor: "#CDD5DF",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#1f2937",
    }),
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const chainOptions = [
    { value: "Ethereum", label: "Ethereum" },
    { value: "Binance Smart Chain", label: "Binance Smart Chain" },
    { value: "Polygon", label: "Polygon" },
    { value: "Avalanche", label: "Avalanche" },
    // Add more options as needed
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption.value,
    }));
  };

  const handleMultiSelectChange = (selectedOptions, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOptions.map((option) => option.value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    onClose();
  };

  const handleBack = () => {
    onBack();
    setModalOpen(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        modalOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
        <div className="flex justify-end mr-4">
          <button
            className="text-2xl text-[#121926]"
            onClick={() => setModalOpen(false)}
          >
            &times;
          </button>
        </div>
        <h2 className="text-xs text-[#364152] mb-3">Step 1 of 2</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2">
              Upload a Cover Photo<span className="text-[#155EEF]">*</span>
            </label>
            <div className="flex gap-2">
              <img src={createprojectabc} alt="projectimg" />
              <div className="flex gap-1 items-center justify-center">
                <div className="flex gap-1">
                  <label
                    htmlFor="file-upload"
                    className="block font-medium text-gray-700 border border-gray-500 px-1 cursor-pointer rounded"
                  >
                    <ControlPointIcon
                      fontSize="small"
                      className="items-center -mt-1"
                    />{" "}
                    Upload
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    name="photo"
                    className="mt-2 hidden"
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="block font-medium text-gray-700 border border-gray-500 px-1 cursor-pointer rounded"
                  >
                    <AutoAwesomeIcon fontSize="small" className="mr-2" />
                    Generate Image
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    name="photo"
                    className="mt-2 hidden"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Telegram link</label>
            <input
              type="text"
              name="telegramLink"
              value={formData.telegramLink}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Twitter link</label>
            <input
              type="text"
              name="twitterLink"
              value={formData.twitterLink}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">OpenChat username</label>
            <input
              type="text"
              name="openChatUsername"
              value={formData.openChatUsername}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              <ArrowBackIcon fontSize="small" className="ml-2" /> Back
            </button>
            <button
              onClick={onClose}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Continue
              <ArrowForwardIcon fontSize="small" className="mr-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorSignup1;

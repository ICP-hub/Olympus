import React, { useState, useEffect } from "react";
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Dropdown from "../../../../assets/Logo/Dropdown.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import Select from "react-select";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const MentorSignup4 = ({ isOpen, onClose, onBack }) => {
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
   
    <>
       
          <div className="mb-2">
            <label className="block mb-1">Are you ICP Hub/Spoke *</label>
            <Select
              options={yesNoOptions}
              value={yesNoOptions.find(
                (option) => option.value === formData.liveOnICP
              )}
              onChange={(option) => handleSelectChange(option, "liveOnICP")}
              styles={selectStyles}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
          {formData.liveOnICP === "yes" && (
            <div className="mb-2">
              <label className="block mb-1">Hub Owner *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a country</option>
                <option value="Aruba">Aruba</option>
                <option value="United States">United States</option>
                <option value="India">India</option>
              </select>
            </div>
          )}
          {/* <div className="mb-2">
            <label className="block mb-1">
              Do you mentor multiple ecosystems *
            </label>
            <select
              name="multipleEcosystems"
              value={formData.multipleEcosystems}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div> */}
       
          <div className="mb-2">
            <label className="block mb-1">Website link</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your website url"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Years of mentoring *</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your mentoring experience years"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">LinkedIn link *</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your linkdin url"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          
       
        </>
  );
};

export default MentorSignup4;

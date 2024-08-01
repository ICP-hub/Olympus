import React, { useState, useEffect } from "react";
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Dropdown from "../../../../assets/Logo/Dropdown.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import Select from "react-select";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const MentorSignup2 = ({ isOpen, onClose, onBack }) => {
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
            <label className="block mb-1">Bio (50 words)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
          </div>

          <div className="mb-2">
            <label className="block mb-1">Country *</label>
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
          <div className="mb-2">
            <label className="block mb-1">
              Domains you are interested in *
            </label>
            <Select
              options={chainOptions}
              isMulti
              value={chainOptions.filter((option) =>
                formData.chains.includes(option.value)
              )}
              onChange={(selectedOptions) =>
                handleMultiSelectChange(selectedOptions, "chains")
              }
              styles={selectStyles}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Type of profile *</label>
            <select
              name="profileType"
              value={formData.profileType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Individual">Individual</option>
              <option value="Individual">Dao</option>
              <option value="Individual">Company</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">
              Why do you want to join this platform? *
            </label>
            <Select
              options={chainOptions}
              isMulti
              value={chainOptions.filter((option) =>
                formData.chains.includes(option.value)
              )}
              onChange={(selectedOptions) =>
                handleMultiSelectChange(selectedOptions, "chains")
              }
              styles={selectStyles}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

         
        </>
  );
};

export default MentorSignup2;

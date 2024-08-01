import React, { useState, useEffect } from "react";
import Select from "react-select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MentorSignup3 = ({ isOpen, onClose, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    telegramLink: "",
    twitterLink: "",
    openChatUsername: "",
    bio: "",
    country: "",
    profileType: "",
    icpHub: "",
    chains: "",
    mentoringServices: "",
    interestedDomains: [],
    joinReason: [],
    multipleEcosystems: "no",
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
            <label className="block mb-1">Preferred ICP Hub you would like to be associated with *</label>
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
              {/* Add more country options as needed */}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">
              Do you mentor multiple ecosystems *
            </label>
            <Select
              options={yesNoOptions}
              value={yesNoOptions.find(
                (option) => option.value === formData.multipleEcosystems
              )}
              onChange={(option) =>
                handleSelectChange(option, "multipleEcosystems")
              }
              styles={selectStyles}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
          {formData.multipleEcosystems === "yes" && (
            <div className="mb-2">
              <label className="block mb-1">Please select the chains *</label>
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
          )}
          <div className="mb-2">
            <label className="block mb-1">
              Categories of mentoring services *
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

export default MentorSignup3;

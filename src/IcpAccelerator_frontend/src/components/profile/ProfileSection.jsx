import React from "react";
import edit from "../../../assets/Logo/edit.png";
import Select from "react-select";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

const ProfileSection = ({
  label,
  field,
  isEditing,
  errors,
  register,
  handleEditToggle,
  handleInputChange,
  options = [],
  type = "text",
  value,
  countries = [],
}) => {
  const isMultiSelect = Array.isArray(options) && options.length > 0;

  // Function to map the string values to objects with value and label
  const mapValueToOptions = (value) => {
    if (Array.isArray(value)) {
      return value.map((val) => {
        const option = options.find((option) => option.value === val);
        return option ? option : { value: val, label: val };
      });
    }
    return [];
  };

  return (
    <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
      <div className="flex justify-between">
        <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
          {label}
        </h3>
        <div>
          <button
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            onClick={() => handleEditToggle(field)}
          >
            {isEditing ? "" : <img src={edit} alt="edit icon" />}
          </button>
        </div>
      </div>

      {isEditing ? (
        <>
          {isMultiSelect && type === "select" ? (
            <Select
              isMulti
              options={options}
              value={mapValueToOptions(value)}
              onChange={(selectedOptions) =>
                handleInputChange(
                  selectedOptions.map((option) => option.value),
                  field,
                  true
                )
              }
              className="basic-single"
              classNamePrefix="select"
            />
          ) : (
            <>
              {type === "textarea" ? (
                <textarea
                  {...register(field)}
                  value={value || ""}
                  onChange={(e) => handleInputChange(e.target.value, field)}
                  className={`bg-gray-50 border-2 ${
                    errors[field] ? "border-red-500" : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              ) : type === "select" && countries.length > 0 ? (
                <select
                  {...register(field)}
                  value={value || ""}
                  onChange={(e) => handleInputChange(e.target.value, field)}
                  className={`bg-gray-50 border-2 ${
                    errors[field] ? "border-red-500" : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w/full px-2 py-1`}
                  style={{
                    maxWidth: "100%", // Ensure it doesn't overflow the container
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <option value="" className="text-sm font-bold">
                    Select your country
                  </option>
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  {...register(field)}
                  value={value || ""}
                  onChange={(e) => handleInputChange(e.target.value, field)}
                  className={`bg-gray-50 border-1 ${
                    errors[field] ? "border-red-500" : "border-gray-500"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w/full px-2 py-1`}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              )}
            </>
          )}
        </>
      ) : (
        <div className="flex items-center">
          {field === "location" && (
            <PlaceOutlinedIcon className="text-gray-500 mr-1" fontSize="small" />
          )}
          <p className="text-sm">
            {Array.isArray(value)
              ? value.map((v) => v.label || v).join(", ")
              : value || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;

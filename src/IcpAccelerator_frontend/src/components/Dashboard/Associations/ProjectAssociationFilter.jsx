import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Select from "react-select";
import { useSelector } from "react-redux";
import fetchRequestAssociation from "../../Utils/apiNames/getAssociationApiName";
import fetchRequestDocument from "../../Utils/apiNames/getDocumentApiName";
import fetchRequestMoneyRaised from "../../Utils/apiNames/getMoneyRaisedApiName";
import fetchRequestCohort from "../../Utils/apiNames/getCohortApiName";

export default function ProjectAssociationFilter({
  open,
  close,
  projectId,
  userPrincipal,
  associateData,
  setAssociateData,
  setSelectedTypeData,
  selectedTypeData,
  setActiveTabTypeData,
  activeTabData,

}) {
  const [show, setShow] = useState(open);
  const [rendered, setRendered] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [association, setAssociation] = useState(null);
  const [status, setStatus] = useState(null);
  const actor = useSelector((currState) => currState.actors.actor);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(() => setRendered(true), 10);
    } else {
      setShow(false);
      setTimeout(() => setRendered(false), 300);
    }
  }, [open]);

  const handleClose = () => {
    setShow(false);
    setTimeout(close, 300);
  };

  const getTypeOptions = () => {
    if (userCurrentRoleStatusActiveRole === "project") {
      return [
        { value: "Associates", label: "Associates" },
        { value: "FundRaised", label: "Fund Raised" },
        { value: "Document", label: "Document" },
      ];
    } else if (userCurrentRoleStatusActiveRole === "mentor") {
      return [
        { value: "Associates", label: "Associates" },
        { value: "CohortRequest", label: "Cohort Request" },
      ];
    } else if (userCurrentRoleStatusActiveRole === "vc") {
      return [{ value: "Associates", label: "Associates" }];
    } else {
      return [];
    }
  };

  const typeOptions = getTypeOptions();

  const associationOptions = [];

  if (userCurrentRoleStatusActiveRole === "project") {
    associationOptions.push(
      { value: "to-mentor", label: "To Mentor" },
      { value: "from-mentor", label: "From Mentor" },
      { value: "to-investor", label: "To Investor" },
      { value: "from-investor", label: "From Investor" }
    );
  }

  if (
    userCurrentRoleStatusActiveRole === "mentor" ||
    userCurrentRoleStatusActiveRole === "vc"
  ) {
    associationOptions.push(
      { value: "to-project", label: "To Project" },
      { value: "from-project", label: "From Project" }
    );
  }

  const baseStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "declined", label: "Declined" },
    { value: "self-reject", label: "Self Declined" },
  ];

  const getStatusOptions = (selectedTypeValue) => {
    if (
      selectedTypeValue === "FundRaised" ||
      selectedTypeValue === "Document"
    ) {
      // Exclude 'Self Declined' for FundRaised and Document
      return baseStatusOptions.filter(
        (option) => option.value !== "self-reject"
      );
    } else if (selectedTypeValue === "CohortRequest") {
      // Include all statuses for Cohort Request
      return baseStatusOptions.filter((option) =>
        ["pending", "approved", "declined"].includes(option.value)
      );
    }
    return baseStatusOptions;
  };

  const renderStatusSelect = (associationValue, selectedTypeValue) => {
    const filteredStatusOptions = getStatusOptions(selectedTypeValue);
    if (
      associationValue === "to-mentor" ||
      associationValue === "from-mentor" ||
      associationValue === "to-investor" ||
      associationValue === "from-investor" ||
      associationValue === "to-project" ||
      associationValue === "from-project" ||
      selectedTypeValue === "FundRaised" ||
      selectedTypeValue === "Document" ||
      selectedTypeValue === "CohortRequest"
    ) {
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Status
          </label>
          <Select
            value={status}
            onChange={setStatus}
            options={filteredStatusOptions}
            className="w-full"
          />
        </div>
      );
    }
    return null;
  };

  const handleApply = async () => {
    try {
      let result = null; // Initialize result to null or another default value

      if (userCurrentRoleStatusActiveRole === "project") {
        if (selectedType.value === "Associates") {
          const response = fetchRequestAssociation(
            status?.value,
            association?.value,
            userCurrentRoleStatusActiveRole,
            projectId,
            userPrincipal,
            actor
          );
          result = await response.api_data; // Await the promise inside api_data
          setSelectedTypeData(response.selectedStatus);
          setActiveTabTypeData(response.activeTab);
        } else if (selectedType.value === "FundRaised") {
          result = await fetchRequestMoneyRaised(
            status?.value,
            userCurrentRoleStatusActiveRole,
            actor,
            projectId
          );
        } else if (selectedType.value === "Document") {
          result = await fetchRequestDocument(
            status?.value,
            userCurrentRoleStatusActiveRole,
            actor
          );
        }
      } else if (userCurrentRoleStatusActiveRole === "mentor") {
        if (selectedType.value === "Associates") {
          const response = fetchRequestAssociation(
            status?.value,
            association?.value,
            userCurrentRoleStatusActiveRole,
            projectId,
            userPrincipal,
            actor
          );
          result = await response.api_data; // Await the promise inside api_data
          setSelectedTypeData(response.selectedStatus);
          setActiveTabTypeData(response.activeTab);

        } else if (selectedType.value === "CohortRequest") {
          result = await fetchRequestCohort(
            status?.value,
            userCurrentRoleStatusActiveRole,
            actor,
            userPrincipal
          );
        }
      } else if (userCurrentRoleStatusActiveRole === "vc") {
        if (selectedType.value === "Associates") {
          const response = fetchRequestAssociation(
            status?.value,
            association?.value,
            userCurrentRoleStatusActiveRole,
            projectId,
            userPrincipal,
            actor
          );
          result = await response.api_data; // Await the promise inside api_data
          setSelectedTypeData(response.selectedStatus);
          setActiveTabTypeData(response.activeTab)

        }
      }

      if (result) {
        console.log("data", result);
        console.log(`result-in-${selectedType.value}`, result);
        setAssociateData(result);
     handleClose();

      }
    } catch (error) {
      console.log(`error-in-${selectedType.value}`, error);
     handleClose();
    }
  };

  if (!rendered) return null;

  return (
    <div
      className={`fixed top-[-16px] inset-0 z-50 transition-opacity duration-700 ease-in-out ${
        show ? "opacity-100 bg-opacity-30" : "opacity-0 bg-opacity-0"
      } bg-black backdrop-blur-xs`}
    >
      <div
        className={`transition-transform duration-300 ease-in-out transform ${
          show ? "translate-x-0" : "translate-x-full"
        } mx-auto w-[25%] absolute right-0 top-0 z-10 bg-white h-screen flex flex-col`}
      >
        <div className="p-5 mb-5 flex justify-start">
          <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
        </div>
        <div className="container p-5 flex-grow">
          <h3 className="mb-4 text-lg font-semibold">Filters</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Types
            </label>
            <Select
              value={selectedType}
              onChange={setSelectedType}
              options={typeOptions}
              className="w-full"
            />
          </div>

          {selectedType && selectedType.value === "Associates" && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Association
                </label>
                <Select
                  value={association}
                  onChange={setAssociation}
                  options={associationOptions}
                  className="w-full"
                />
              </div>
              {association &&
                renderStatusSelect(association.value, selectedType.value)}
            </>
          )}

          {selectedType &&
            (selectedType.value === "FundRaised" ||
              selectedType.value === "Document" ||
              selectedType.value === "CohortRequest") &&
            renderStatusSelect(null, selectedType.value)}
        </div>

        <div className="p-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

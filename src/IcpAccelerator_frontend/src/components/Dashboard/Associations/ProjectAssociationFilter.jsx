import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import fetchRequestAssociation from '../../Utils/apiNames/getAssociationApiName';
import fetchRequestDocument from '../../Utils/apiNames/getDocumentApiName';
import fetchRequestMoneyRaised from '../../Utils/apiNames/getMoneyRaisedApiName';
import fetchRequestCohort from '../../Utils/apiNames/getCohortApiName';

export default function ProjectAssociationFilter({ open, close, userRole }) {
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
    if (userCurrentRoleStatusActiveRole === 'project') {
      return [
        { value: 'Associates', label: 'Associates' },
        { value: 'FundRaised', label: 'Fund Raised' },
        { value: 'Document', label: 'Document' },
      ];
    } else if (userCurrentRoleStatusActiveRole === 'mentor') {
      return [
        { value: 'Associates', label: 'Associates' },
        { value: 'Cohort Request', label: 'Cohort Request' },
      ];
    } else if (userCurrentRoleStatusActiveRole === 'vc') {
      return [
        { value: 'Associates', label: 'Associates' },
      ];
    } else {
      return [];
    }
  };

  const typeOptions = getTypeOptions();

  const associationOptions = [];

  if (userCurrentRoleStatusActiveRole === 'project') {
    associationOptions.push(
      { value: 'to-mentor', label: 'To Mentor' },
      { value: 'from-mentor', label: 'From Mentor' },
      { value: 'to-investor', label: 'To Investor' },
      { value: 'from-investor', label: 'From Investor' }
    );
  }

  if (userCurrentRoleStatusActiveRole === 'mentor' || userCurrentRoleStatusActiveRole === 'vc') {
    associationOptions.push(
      { value: 'to-project', label: 'To Project' },
      { value: 'from-project', label: 'From Project' }
    );
  }

  const baseStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'declined', label: 'Declined' },
    { value: 'self-reject', label: 'Self Declined' },
  ];

  const getStatusOptions = (selectedTypeValue) => {
    if (selectedTypeValue === 'FundRaised' || selectedTypeValue === 'Document') {
      // Exclude 'Self Declined' for FundRaised and Document
      return baseStatusOptions.filter(option => option.value !== 'self-reject');
    }
    return baseStatusOptions;
  };

  const renderStatusSelect = (associationValue, selectedTypeValue) => {
    const filteredStatusOptions = getStatusOptions(selectedTypeValue);
    if (
      associationValue === 'to-mentor' ||
      associationValue === 'from-mentor' ||
      associationValue === 'to-investor' ||
      associationValue === 'from-investor' ||
      associationValue === 'to-project' ||
      associationValue === 'from-project' ||
      selectedTypeValue === 'FundRaised' ||
      selectedTypeValue === 'Document'
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

  const handleApply = async() => {
    let data;
  
    if (userCurrentRoleStatusActiveRole === 'project') {
      if (selectedType.value === 'Associates') {
        data = fetchRequestAssociation(status?.value, association?.value, userCurrentRoleStatusActiveRole);
      } else if (selectedType.value === 'FundRaised') {
        data = fetchRequestMoneyRaised(status?.value);
      } else if (selectedType.value === 'Document') {
        data = fetchRequestDocument(status?.value);
      }
    } else if (userCurrentRoleStatusActiveRole === 'mentor') {
      if (selectedType.value === 'Associates') {
        data = fetchRequestAssociation(status?.value, association?.value, userCurrentRoleStatusActiveRole);
      } else if (selectedType.value === 'Cohort Request') {
        data = fetchRequestCohort(status?.value);
      }
    } else if (userCurrentRoleStatusActiveRole === 'vc') {
      if (selectedType.value === 'Associates') {
        data = fetchRequestAssociation(status?.value, association?.value, userCurrentRoleStatusActiveRole);
      }
    }
    try {
      const result = await actor.data;
      console.log(`result-in-${data}`, result);
    
    } catch (error) {
      console.log(`error-in-${data}`, error);
      
    }
    console.log(data);
    // handleClose();
  };
  

  if (!rendered) return null;

  return (
    <div
      className={`fixed top-[-16px] inset-0 z-50 transition-opacity duration-700 ease-in-out ${
        show ? 'opacity-100 bg-opacity-30' : 'opacity-0 bg-opacity-0'
      } bg-black backdrop-blur-xs`}
    >
      <div
        className={`transition-transform duration-300 ease-in-out transform ${
          show ? 'translate-x-0' : 'translate-x-full'
        } mx-auto w-[25%] absolute right-0 top-0 z-10 bg-white h-screen flex flex-col`}
      >
        <div className="p-5 mb-5 flex justify-start">
          <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
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

          {selectedType && selectedType.value === 'Associates' && (
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
              {association && renderStatusSelect(association.value, selectedType.value)}
            </>
          )}

          {(selectedType && (selectedType.value === 'FundRaised' || selectedType.value === 'Document')) && 
            renderStatusSelect(null, selectedType.value)
          }
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
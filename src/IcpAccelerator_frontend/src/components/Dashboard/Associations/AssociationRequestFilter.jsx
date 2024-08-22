import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';

export default function AssociationRequestFilter({ open, close }) {
  const [show, setShow] = useState(open);
  const [rendered, setRendered] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [association, setAssociation] = useState(null);

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

  const typeOptions = [
    { value: 'All', label: 'All' },
    { value: 'Associates', label: 'Associates' },
    { value: 'FundRaised', label: 'Fund Raised' },
    { value: 'Document', label: 'Document' },
  ];

  const associationOptions = [
    { value: 'All', label: 'All' },
    { value: 'ToMentor', label: 'To Mentor' },
    { value: 'FromMentor', label: 'From Mentor' },
    { value: 'ToInvestor', label: 'To Investor' },
    { value: 'FromInvestor', label: 'From Investor' },
  ];

  
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
          )}
        </div>

        <div className="p-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleClose}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

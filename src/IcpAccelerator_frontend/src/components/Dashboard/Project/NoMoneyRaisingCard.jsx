import React, { useState } from 'react';
import MoneyRaisingModal from '../../Modals/ProjectRegisterModal/MoneyRaisingModal';

const NoMoneyRaising = ({ ProjectId }) => {
  const [isOpen, setIsOpen] = useState(false); // Manage modal open/close state

  return (
    <div>
      <div className="text-center py-12">
        <div className="flex justify-center items-center">
          {/* SVG and other content */}
        </div>
        <h2 className="text-xl font-semibold mb-2">
          You haven't Raised any Money yet
        </h2>
        <p className="text-gray-600 mb-2">
          Any amount of Money Raised will live here.
        </p>
        <p className="text-gray-600 mb-6">
          Start raising by demanding your Requirement
        </p>
        <button
          className="bg-[#155EEF] text-white px-4 py-2 rounded-md flex items-center justify-center mx-auto"
          onClick={() => setIsOpen(true)} // Open the modal
        >
          + Raise Money
        </button>
      </div>

      {/* Conditionally render the MoneyRaisingModal */}
      {isOpen && (
        <MoneyRaisingModal
          setIsOpen={setIsOpen} // Pass setIsOpen to control the modal's open state
          isOpen={isOpen} // Pass the open state to the modal
          ProjectId={ProjectId}
        />
      )}
    </div>
  );
}

export default NoMoneyRaising;

import React, { useState } from 'react'
import MoneyRaisingModal from '../../Modals/ProjectRegisterModal/MoneyRaisingModal';

export default function NomoneyRaisFound() {
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
      setModalOpen(true);
    };
  return (
   <>
     <div className="text-center py-12">
          <div className="flex justify-center items-center">
            <svg
              width="154"
              height="64"
              viewBox="0 0 154 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
            
            </svg>
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
            onClick={handleModalOpen}
          >
            + Raise Money
          </button>

     
        </div>
        {modalOpen && (
        <MoneyRaisingModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
   </>
  )
}

import React, { useState } from "react";
import MoneyRaisingModal from "../../Modals/ProjectRegisterModal/MoneyRaisingModal";
import MoneyRaisedCard from "./MoneyRaisedCard";
import NomoneyRaisFound from "./NomoneyRaisFound";

const MoneyRaising = ({ cardData }) => {
  const [moneyRaisingData, setMoneyRaisingData] = useState(
    cardData || []
  ); // Store money-raising data
 console.log("Store money-raising data",moneyRaisingData)
  const handleAddMoneyRaising = (newMoneyData) => {
    setMoneyRaisingData([...moneyRaisingData, newMoneyData]);
    setIsOpen(false); 
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  return (
    <div>
      {moneyRaisingData.length === 0 ? (
        <>
        <NomoneyRaisFound/>
        </>
      ) : (
        <>
         <div className="flex flex-col items-end mb-8 max-w-7xl pt-4">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={handleModalOpen}
        >
          + Add More Money Raising
        </button>
      </div>
      <div className="max-w-7xl mx-auto bg-white">
        {moneyRaisingData.map((data, index) => (
          <MoneyRaisedCard key={index} data={data} />
        ))}
      </div>
        </>
      )}
     
      {/* Conditionally render the MoneyRaisingModal */}

      {modalOpen && (
        <MoneyRaisingModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          onSubmit={handleAddMoneyRaising}
        />
      )}
    </div>
  );
};

export default MoneyRaising;

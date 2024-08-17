import React, { useState, useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const Mentormodal4 = ({ isOpen, onClose }) => {

    const [modalOpen, setModalOpen] = useState(isOpen || true);
    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modalOpen]);
    //   if (!isOpen) return null;

    const [deliverables, setDeliverables] = useState([{ title: '', description: '' }]);
    const [faq, setfaq] = useState([{ faq: '', description: '' }])

    const handleAddDeliverable = () => {
        setDeliverables([...deliverables, { faq: '', description: '' }]);
    };
    const handleAddfaq = () => {
        setDeliverables([...deliverables, { title: '', description: '' }]);
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newDeliverables = [...deliverables];

        newDeliverables[index][name] = value;
        setDeliverables(newDeliverables);
    };
    const handleChangefaq = (index, e) => {
        const { name, value } = e.target;
        const newfaq = [...faq];

        newfaq[index][name] = value;
        setfaq(newfaq);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
            {/* <div className="bg-white rounded-lg p-6 w-[500px] max-h-[100vh] overflow-y-auto overflow-hidden "> */}
            <div className="bg-white rounded-lg p-6 w-[500px] max-h-[100vh] overflow-y-auto overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style jsx>{`
    div::-webkit-scrollbar {
      display: none;
    }
  `}</style>

                <div className="flex justify-between items-center mb-1">
                    <h2 className="text-sm font-semibold text-[#364152]">Step 4 of 5</h2>
                    <button className="text-[#364152] text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
                </div>
                <h2 className="text-2xl font-bold ">Additional details</h2>
                <p className='text-[#697586] mb-4 text-sm' >Optional, but recommended</p>


                <div className="mb-4">

                    <h3 className="text-lg font-medium mb-2">Deliverables</h3>
                    {deliverables.map((deliverable, index) => (
                        <div key={index} className="mb-2 p-4 border rounded-lg bg-[#F8FAFC]">
                            <input
                                type="text"
                                name="title"
                                value={deliverable.title}
                                onChange={(e) => handleChange(index, e)}
                                placeholder="Deliverable title"
                                className="block w-full border border-gray-300 rounded-md p-2 mb-2"
                            />
                            <textarea
                                name="description"
                                value={deliverable.description}
                                onChange={(e) => handleChange(index, e)}
                                placeholder="Description"
                                className="block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleAddDeliverable}
                        className="text-blue-500 text-sm "
                    >
                        Add another deliverable item
                    </button>


                </div>
                <div className="mb-4">

                    <h3 className="text-lg font-medium mb-2">FAQ</h3>
                    {faq.map((faq, index) => (
                        <div key={index} className="mb-2 p-4 border rounded-lg bg-[#F8FAFC]">
                            <input
                                type="text"
                                name="title"
                                value={faq.title}
                                onChange={(e) => handleChangefaq(index, e)}
                                placeholder="Type a question..eg- What are deliverables?"
                                className="block w-full border border-gray-300 rounded-md p-2 mb-2"
                            />
                            <textarea
                                name="description"
                                value={faq.description}
                                onChange={(e) => handleChangefaq(index, e)}
                                placeholder="Type your answer"
                                className="block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleAddfaq}
                        className="text-blue-500 text-sm"
                    >
                        Add another FAQ
                    </button>
                </div>
                <div className="flex justify-between">
                    <button
                        type="button"
                        // onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    // onClick={handleContinue}
                    >
                        Continue<ArrowForwardIcon fontSize="small" className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Mentormodal4;

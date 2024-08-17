import React, { useState } from 'react'

const AnnouncementModal = ({modalOpen,setModalOpen}) => {
    const handleCreate =()=>{
        
    }
  return (
    <div>
        {modalOpen && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg w-[500px]">
                        <div className="flex justify-end mr-4">
                            <button className='text-3xl text-[#121926]' onClick={() => {  setModalOpen(false); }}>&times;</button>
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Create Announcement</h2>
                            
                            
                            <button
                                onClick={handleCreate}
                                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </div>
  )
}

export default AnnouncementModal





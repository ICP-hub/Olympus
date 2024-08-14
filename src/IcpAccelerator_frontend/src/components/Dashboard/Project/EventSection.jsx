import React from 'react';
import { Folder, Add } from '@mui/icons-material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

const EventSection = () => {
    return (
        <div className="p-6">


            {/* Content */}
            <div className="text-center py-12">
                <Folder className="w-2 h-24 text-gray-300 text-6xl mb-4 mx-auto" />
                <h2 className="text-xl font-semibold mb-2">You haven't posted any events yet</h2>
                <p className="text-gray-600 mb-2">Any assets used in projects will live here.</p>
                <p className="text-gray-600 mb-6">Start creating by uploading your files.</p>
                <button className="bg-[#155EEF] text-white px-4 py-2 rounded-md flex items-center justify-center mx-auto">
                    <WorkOutlineOutlinedIcon className="mr-2" />
                    Create a event
                </button>
            </div>


        </div>
    );
};

export default EventSection;
import React, { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DiscoverMentorDetail from './DiscoverMentorDetail';
import DiscoverDocument from './DiscoverDocument';
import DiscoverTeam from './DiscoverTeam';



const DiscoverMentorPage = ({ openDetail, setOpenDetail, projectDetails }) => {

    console.log('projectdetail in discovermentorpage',projectDetails)

    useEffect(() => {
        if (openDetail) {
            // Prevent background from scrolling when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Restore background scroll when modal is closed
            document.body.style.overflow = 'auto';
        }
        // Cleanup when the component is unmounted
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [openDetail]);

    

    return (
        <div className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${openDetail ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className={`mx-auto w-[70%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${openDetail ? 'translate-x-0' : 'translate-x-full'} z-20`}>
                <div className='p-2 mb-2'>
                    <CloseIcon sx={{ cursor: "pointer" }} onClick={() => setOpenDetail(false)} />
                </div>
                <div className='container h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto'> 
                    <div className='flex justify-evenly px-[1%]'>
                        <div className="border h-fit rounded-lg w-[30%]">
                            <DiscoverMentorDetail projectDetails={projectDetails}/>
                        </div>
                        <div className="p-3 w-[65%]">
                            <div>
                                <DiscoverDocument />
                            </div>
                            <div className='my-6'>
                                <DiscoverTeam/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiscoverMentorPage;

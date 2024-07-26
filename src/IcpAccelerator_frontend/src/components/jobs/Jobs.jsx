import React from 'react'

const Jobs = () => {
    return (
        <div className='container mx-auto'>
            <div className="flex mx-[3%] mb-5">
                <h2 className='text-2xl font-bold'>Jobs</h2>
            </div>
            <div className="flex ">
                <div className="main">
                    <div className=''>
                        <div className=''>
                            <div className="">
                                <p className=''>1 day ago</p>
                                <h3 className='text-xl font-bold'>Senior/Lead Product Designer</h3>
                                <p className=''><span className=''></span>Cypherpunk Labs</p>
                            </div>
                            <div className="">
                                <button className='border rounded-md bg-[#155EEF] py-1  text-white'>Apply <span className='pl-1 text-white'></span><ArrowOutwardIcon sx={{ marginTop: "-6px", fontSize: "medium" }} /></button>
                                <p className='text-[#155EEF] '>view Detail</p>
                            </div>
                        </div>
                        <div className="">
                            <p className=''>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis.</p>
                            <div className=''>
                                icons
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">

                </div>
            </div>
        </div>
    )
}

export default Jobs
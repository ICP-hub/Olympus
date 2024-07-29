import React, { useState } from 'react'
import CenterFocusStrongOutlinedIcon from '@mui/icons-material/CenterFocusStrongOutlined';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import JobDetails from './JobDetails';

const Jobs = () => {
    const jobData = [
        {
            id: "1",
            day: "1 day ago",
            role: "Senior/Lead Product Designer",
            icon: "icon",
            company: "Cypherpunk Labs",
            text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
        },
        {
            id: "2",
            day: "1 day ago",
            role: "Senior/Lead Product Designer",
            icon: "icon",
            company: "Cypherpunk Labs",
            text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
        },
        {
            id: "3",
            day: "1 day ago",
            role: "Senior/Lead Product Designer",
            icon: "icon",
            company: "Cypherpunk Labs",
            text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
        }
        , {
            id: "4",
            day: "1 day ago",
            role: "Senior/Lead Product Designer",
            icon: "icon",
            company: "Cypherpunk Labs",
            text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
        },
        {
            id: "5",
            day: "1 day ago",
            role: "Senior/Lead Product Designer",
            icon: "icon",
            company: "Cypherpunk Labs",
            text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
        }
    ]
    const [open, setOpen] = useState(false)
    return (<>

        <div className='container mx-auto bg-white'>
            <div className="flex mx-auto -top-10 mb-5 sticky ">
                <h2 className='text-3xl font-bold p-5 bg-white w-full '>Jobs</h2>
            </div>
            <div className="flex mx-auto justify-evenly">
                <div className="my-5 w-[65%] ">
                    {jobData.map(job => {
                        return (
                            <>
                                <div className='flex flex-col gap-3 my-8'>
                                    <div className='flex justify-between'>
                                        <div onClick={() => setOpen(true)} className="flex flex-col gap-3  ">
                                            <p className='text-gray-400'>{job.day} </p>
                                            <h3 className='text-xl font-bold'>{job.role} </h3>
                                            <p className=''><span className=''>{job.icon} </span>{job.company} </p>
                                        </div>
                                        <div className="flex flex-col gap-4 items-center">
                                            <button onClick={() => setOpen(true)} className='border rounded-md bg-[#155EEF] py-2 px-4 text-white text-center'>Apply <span className='pl-1 text-white'></span><ArrowOutwardIcon sx={{ marginTop: "-2px", fontSize: "medium" }} /></button>
                                            <button onClick={() => setOpen(true)} className='hover:bg-slate-300 py-2 px-3 text-[#155EEF] font-medium '>view details</button>
                                        </div>
                                    </div>
                                    <div onClick={() => setOpen(true)} className="flex flex-col gap-3">
                                        <p className=''>{job.text} </p>
                                        <div className='flex gap-5 items-center'>
                                            <div className=''><CenterFocusStrongOutlinedIcon sx={{ marginTop: "-4px" }} /> <span className='ml-2'>Product</span> </div>
                                            <div className=''><FmdGoodOutlinedIcon sx={{ marginTop: "-4px" }} /> <span className='ml-2'>Remote</span> </div>
                                            <div className=''><AccessTimeOutlinedIcon sx={{ marginTop: "-4px" }} /> <span className='ml-2'>Full Time</span> </div>
                                            <div className=''><AccessTimeOutlinedIcon sx={{ marginTop: "-4px" }} /> <span className='ml-2'>$80K-100k</span> </div>
                                        </div>
                                    </div>
                                </div>
                                {open && job.id === "1" ? <JobDetails setOpen={setOpen} /> : ""}
                                <hr />
                            </>
                        )
                    })}

                </div>

                <div className="w-[30%]">
                    <div className="p-4 bg-white sticky top-0  max-w-sm">
                        <h2 className="text-xl font-semibold mb-4">Filters</h2>

                        <div className="mb-4">
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                            <select id="department" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option>Select role</option>
                                {/* Add more options here */}
                            </select>
                        </div>

                        <div className="mb-4">
                            <span className="block text-sm font-medium text-gray-700">Occupation</span>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center">
                                    <input id="full-time" name="occupation" type="checkbox" className="h-4 w-4 text-indigo-600 border-2 border-gray-300 rounded" />
                                    <label htmlFor="full-time" className="ml-2 block text-sm text-gray-900">Full-time</label>
                                </div>
                                <div className="flex items-center">
                                    <input id="part-time" name="occupation" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 border-2  rounded" />
                                    <label htmlFor="part-time" className="ml-2 block text-sm text-gray-900">Part-time</label>
                                </div>
                                <div className="flex items-center">
                                    <input id="contract" name="occupation" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded" />
                                    <label htmlFor="contract" className="ml-2 block text-sm text-gray-900">Contract</label>
                                </div>
                                <div className="flex items-center">
                                    <input id="internship" name="occupation" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded" />
                                    <label htmlFor="internship" className="ml-2 block text-sm text-gray-900">Internship</label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" id="location" className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Start typing" />
                            <div className="flex items-center mt-2">
                                <input id="remote" name="location" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded" />
                                <label htmlFor="remote" className="ml-2 block text-sm text-gray-900">Remote</label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Salary</label>
                            <div className="flex mt-1 w-full">
                                <input type="text" className="w-[40%]  px-1 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="$ From" />
                                <div className='px-2 text-center'>-</div>
                                <input type="text" className="w-[40%] px-1 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="$ To" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default Jobs
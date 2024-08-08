// import React, { useState } from 'react'
// import CenterFocusStrongOutlinedIcon from '@mui/icons-material/CenterFocusStrongOutlined';
// import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
// import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
// import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
// import JobDetails from './JobDetails';
// import awtar from "../../../assets/images/icons/_Avatar.png"
// import { clockSvgIcon, coinStackedSvgIcon, lenseSvgIcon, locationSvgIcon } from '../Utils/Data/SvgData';

// const Jobs = () => {
//     const jobData = [
//         {
//             id: "1",
//             day: "1 day ago",
//             role: "Senior/Lead Product Designer",
//             icon: awtar,
//             company: "Cypherpunk Labs",
//             text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
//         },
//         {
//             id: "2",
//             day: "1 day ago",
//             role: "Senior/Lead Product Designer",
//             icon: "icon",
//             company: "Cypherpunk Labs",
//             text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
//         },
//         {
//             id: "3",
//             day: "1 day ago",
//             role: "Senior/Lead Product Designer",
//             icon: "icon",
//             company: "Cypherpunk Labs",
//             text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
//         }
//         , {
//             id: "4",
//             day: "1 day ago",
//             role: "Senior/Lead Product Designer",
//             icon: "icon",
//             company: "Cypherpunk Labs",
//             text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
//         },
//         {
//             id: "5",
//             day: "1 day ago",
//             role: "Senior/Lead Product Designer",
//             icon: "icon",
//             company: "Cypherpunk Labs",
//             text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
//         }
//     ]

//     const [filter, setFilter] = useState({
//         role: "",
//         fullTime: false,
//         partTime: true,
//         contract: true,
//         internship: true,
//         location: "",
//         remote: true,
//         minSalary: "",
//         maxSalary: ""
//     })
//     const [open, setOpen] = useState(false)
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFilter({ ...filter, [name]: value })
//     }
//     const handlecheckbox = (e) => {
//         const { name, checked } = e.target;
//         setFilter({ ...filter, [name]: checked })
//     }
//     console.log(filter)
//     return (<>

//         <div className='container mx-auto bg-white'>
//             <div className="flex mx-auto -top-10 mb-5 sticky ">
//                 <h2 className='text-3xl font-bold p-5 bg-white w-full '>Jobs</h2>
//             </div>
//             <div className="flex mx-auto justify-evenly">
//                 <div className="mb-5 w-[65%] ">
//                     {jobData.map(job => {
//                         return (
//                             <>
//                                 <div className='flex flex-col gap-3 my-8'>
//                                     <div className='flex justify-between'>
//                                         <div onClick={() => setOpen(true)} className="flex flex-col gap-3  ">
//                                             <p className='text-gray-400'>{job.day} </p>
//                                             <h3 className='text-xl font-bold'>{job.role} </h3>
//                                             <p className='flex items-center'><span className='mr-3'><img src={job.icon} alt='icon' /></span>{job.company} </p>
//                                         </div>
//                                         <div className="flex flex-col gap-4 items-center">
//                                             <button onClick={() => setOpen(true)} className='border rounded-md bg-[#155EEF] py-2 px-4 text-white text-center'>Apply <span className='pl-1 text-white'></span><ArrowOutwardIcon sx={{ marginTop: "-2px", fontSize: "medium" }} /></button>
//                                             <button onClick={() => setOpen(true)} className='hover:bg-slate-300 py-2 px-3 text-[#155EEF] font-medium '>view details</button>
//                                         </div>
//                                     </div>
//                                     <div onClick={() => setOpen(true)} className="flex flex-col gap-3">
//                                         <p className=''>{job.text} </p>
//                                         <div className='flex gap-5 items-center'>
//                                             <div className='flex items-center gap-2'> {lenseSvgIcon} <span className=''>Product</span> </div>
//                                             <div className='flex items-center gap-2'>{locationSvgIcon} <span className=''>Remote</span> </div>
//                                             <div className='flex items-center gap-2'>{clockSvgIcon} <span className='ml-2'>Full Time</span> </div>
//                                             <div className='flex items-center gap-2'><span className=''>{coinStackedSvgIcon} </span>80k-100k </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {open && job.id === "1" ? <JobDetails setOpen={setOpen} /> : ""}
//                                 <hr />
//                             </>
//                         )
//                     })}

//                 </div>

//                 <div className="w-[30%]">
//                     <div className="p-4 bg-white sticky top-0  max-w-sm">
//                         <h2 className="text-xl font-semibold mb-4">Filters</h2>

//                         <div className="mb-4">
//                             <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
//                             <select value={filter.role} onChange={handleChange} id="department" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
//                                 <option>Select role</option>
//                                 {/* Add more options here */}
//                             </select>
//                         </div>

//                         <div className="mb-4">
//                             <span className="block text-sm font-medium text-gray-700">Occupation</span>
//                             <div className="mt-2 space-y-2">
//                                 <div className="flex items-center">
//                                     <input id="full-time" checked={filter.fullTime} onChange={handlecheckbox} name="fullTime" type="checkbox" className="h-4 w-4 text-indigo-600 border-2 border-gray-300 rounded" />
//                                     <label htmlFor="full-time" className="ml-2 block text-sm text-gray-900">Full-time</label>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <input id="part-time" checked={filter.partTime} onChange={handlecheckbox} name="partTime" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 border-2  rounded" />
//                                     <label htmlFor="part-time" className="ml-2 block text-sm text-gray-900">Part-time</label>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <input id="contract" checked={filter.contract} onChange={handlecheckbox} name="contract" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded" />
//                                     <label htmlFor="contract" className="ml-2 block text-sm text-gray-900">Contract</label>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <input id="internship" checked={filter.internship} onChange={handlecheckbox} name="internship" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded" />
//                                     <label htmlFor="internship" className="ml-2 block text-sm text-gray-900">Internship</label>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="mb-4">
//                             <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
//                             <input type="text" name='location' value={filter.location} onChange={handleChange} id="location" className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Start typing" />
//                             <div className="flex items-center mt-2">
//                                 <input id="remote" checked={filter.remote} onChange={handlecheckbox} name="remote" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded" />
//                                 <label htmlFor="remote" className="ml-2 block text-sm text-gray-900">Remote</label>
//                             </div>
//                         </div>

//                         <div className="mb-4">
//                             <label className="block text-sm font-medium text-gray-700">Salary</label>
//                             <div className="flex mt-1 w-full">
//                                 <input type="text" name='minSalary' value={filter.minSalary} onChange={handleChange} className="w-[40%]  px-1 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="$ From" />
//                                 <div className='px-2 text-center'>-</div>
//                                 <input type="text" name='maxSalary' value={filter.maxSalary} onChange={handleChange} className="w-[40%] px-1 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="$ To" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </>
//     )
// }

// export default Jobs
import React, { useState } from 'react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import JobDetails from './JobDetails';
import awtar from "../../../assets/images/icons/_Avatar.png";
import { clockSvgIcon, coinStackedSvgIcon, lenseSvgIcon, locationSvgIcon } from '../Utils/Data/SvgData';

const Jobs = () => {
    const jobData = [
        {
            id: "1",
            day: "1 day ago",
            role: "Senior/Lead Product Designer",
            icon: awtar,
            company: "Cypherpunk Labs",
            text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, blanditiis."
        },
        // ... other job data
    ];

    const [filter, setFilter] = useState({
        role: "",
        fullTime: false,
        partTime: false,
        contract: false,
        internship: false,
        location: "",
        remote: false,
        minSalary: "",
        maxSalary: ""
    });

    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter(prevFilter => ({ ...prevFilter, [name]: value }));
    };

    const handleCheckbox = (e) => {
        const { name, checked } = e.target;
        setFilter(prevFilter => ({ ...prevFilter, [name]: checked }));
    };

    return (
        <div className='container mx-auto bg-white'>
            <div className="flex mx-auto -top-10 mb-5 sticky ">
                <h2 className='text-3xl font-bold p-5 bg-white w-full '>Jobs</h2>
            </div>
            <div className="flex mx-auto justify-evenly">
                <div className="mb-5 w-[65%] ">
                    {jobData.map(job => (
                        <React.Fragment key={job.id}>
                            <div className='flex flex-col gap-3 my-8'>
                                <div className='flex justify-between'>
                                    <div onClick={() => setOpen(true)} className="flex flex-col gap-3  ">
                                        <p className='text-gray-400'>{job.day}</p>
                                        <h3 className='text-xl font-bold'>{job.role}</h3>
                                        <p className='flex items-center'><span className='mr-3'><img src={job.icon} alt='icon' /></span>{job.company}</p>
                                    </div>
                                    <div className="flex flex-col gap-4 items-center">
                                        <button onClick={() => setOpen(true)} className='border rounded-md bg-[#155EEF] py-2 px-4 text-white text-center'>
                                            Apply <ArrowOutwardIcon sx={{ marginTop: "-2px", fontSize: "medium" }} />
                                        </button>
                                        <button onClick={() => setOpen(true)} className='hover:bg-slate-300 py-2 px-3 text-[#155EEF] font-medium '>view details</button>
                                    </div>
                                </div>
                                <div onClick={() => setOpen(true)} className="flex flex-col gap-3">
                                    <p>{job.text}</p>
                                    <div className='flex gap-5 items-center'>
                                        <div className='flex items-center gap-2'>{lenseSvgIcon} <span>Product</span></div>
                                        <div className='flex items-center gap-2'>{locationSvgIcon} <span>Remote</span></div>
                                        <div className='flex items-center gap-2'>{clockSvgIcon} <span className='ml-2'>Full Time</span></div>
                                        <div className='flex items-center gap-2'><span>{coinStackedSvgIcon}</span>80k-100k</div>
                                    </div>
                                </div>
                            </div>
                            {open && job.id === "1" && <JobDetails setOpen={setOpen} />}
                            <hr />
                        </React.Fragment>
                    ))}
                </div>

                <div className="w-[30%]">
                    <div className="p-4 bg-white sticky top-0 max-w-sm">
                        <h2 className="text-xl font-semibold mb-4">Filters</h2>

                        <div className="mb-4">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Department</label>
                            <select 
                                value={filter.role} 
                                onChange={handleChange} 
                                name="role" 
                                id="role" 
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Select role</option>
                                <option value="design">Design</option>
                                <option value="development">Development</option>
                                <option value="marketing">Marketing</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <span className="block text-sm font-medium text-gray-700">Occupation</span>
                            <div className="mt-2 space-y-2">
                                {['fullTime', 'partTime', 'contract', 'internship'].map((type) => (
                                    <div key={type} className="flex items-center">
                                        <input
                                            id={type}
                                            name={type}
                                            type="checkbox"
                                            checked={filter[type]}
                                            onChange={handleCheckbox}
                                            className="h-4 w-4 text-indigo-600 border-2 border-gray-300 rounded"
                                        />
                                        <label htmlFor={type} className="ml-2 block text-sm text-gray-900">
                                            {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input 
                                type="text" 
                                name='location' 
                                value={filter.location} 
                                onChange={handleChange} 
                                id="location" 
                                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                placeholder="Start typing" 
                            />
                            <div className="flex items-center mt-2">
                                <input 
                                    id="remote" 
                                    checked={filter.remote} 
                                    onChange={handleCheckbox} 
                                    name="remote" 
                                    type="checkbox" 
                                    className="h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded" 
                                />
                                <label htmlFor="remote" className="ml-2 block text-sm text-gray-900">Remote</label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Salary</label>
                            <div className="flex mt-1 w-full">
                                <input 
                                    type="text" 
                                    name='minSalary' 
                                    value={filter.minSalary} 
                                    onChange={handleChange} 
                                    className="w-[40%] px-1 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                    placeholder="$ From" 
                                />
                                <div className='px-2 text-center'>-</div>
                                <input 
                                    type="text" 
                                    name='maxSalary' 
                                    value={filter.maxSalary} 
                                    onChange={handleChange} 
                                    className="w-[40%] px-1 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                    placeholder="$ To" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
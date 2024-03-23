import React, { useState } from 'react';
import girl from "../../../../IcpAccelerator_frontend/assets/images/girl.jpeg";

const Adminalluser2 = () => {
    const [selectedOption, setSelectedOption] = useState("Users");
    const projects = [
        {
            img: girl,
            Role: "mentor",
            name: "Jammy",
            linkedin: "http://www.konmatfix.com",
            level: 110,
            Country: "India",
        },
        {
            img: girl,
            Role: "mentor",
            name: "Jammy",
            linkedin: "http://www.konmatfix.com",
            level: 110,
            Country: "India",
        },
        {
            img: girl,
            Role: "mentor",
            name: "Jammy",
            linkedin: "http://www.konmatfix.com",
            level: 110,
            Country: "India",
        },
        {
            img: girl,
            Role: "mentor",
            name: "Jammy",
            linkedin: "http://www.konmatfix.com",
            level: 110,
            Country: "India",
        },
        {
            img: girl,
            Role: "mentor",
            name: "Jammy",
            linkedin: "http://www.konmatfix.com",
            level: 110,
            Country: "India",
        },
      
    ];

    return (
        <div className="px-[4%] w-full flex flex-col bg-gray-100 justify-center gap-8">
            <div className=" px-[1%] w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold">
                {selectedOption}
            </div>

            <div className="relative overflow-x-auto shadow-xl sm:rounded-lg w-full flex justify-between">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xl text-black  bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          
                            <th scope="col" className="pl-16 py-3 ">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Country
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Level
                            </th>
                            <th scope="col" className=" py-3">
                                LinkedIn
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {projects.map((project, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? 'even:bg-gray-50 even:dark:bg-gray-800' : 'odd:bg-white odd:dark:bg-gray-900'} text-lg`}>
                                <div className='flex flex-row'>
                                <img className="mt-2 w-10 h-10 rounded-full ml-2 flex justify-center items-center" src={project.img} alt="abc" />
                                <td className="px-6 py-4  font-bold whitespace-nowrap dark:text-white">
                                    {project.name}
                                </td>
                                </div> 
                                <td className="px-4 py-4 font-bold">
                                    {project.Role}
                                </td>
                                <td className="px-6 py-4 font-bold">
                                    {project.Country}
                                </td>
                                <td className="px-6 py-4 font-bold">
                                    {project.level}
                                </td>
                                <td className=" py-4 font-bold">
                                    {project.linkedin}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Adminalluser2;

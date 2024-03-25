import React, { useEffect, useState } from 'react';
import girl from "../../../../IcpAccelerator_frontend/assets/images/girl.jpeg";


import { projectFilterSvg } from '../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import fetchRequestFromUtils from '../../../../IcpAccelerator_frontend/src/components/Utils/apiNames/getAssociationApiName';
import viewProfileHandlerFromUtils from '../../../../IcpAccelerator_frontend/src/components/Utils/navigationHelper/navigationFromAssociation';

const Projectrequest = () => {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');
    const [data, setData] = useState([
        {
            image: girl,
            name: 'Ms.Lisa',
            date: ' 10 October, 2023',
            msg: 'PANONY was established in March 2018 with operations in Greater China, South Korea and the U.S. Both founders are Forbes Asia 30 under 30 honorees.PANONY was established in March 2018 with operations in Greater China, South Korea and the U.S. Both founders are Forbes Asia 30 under 30 honorees.',
        },
        {
            image: girl,
            name: 'Ms.Lisa',
            date: 'Requested on 10 October, 2023',
            msg: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad quaerat, dolorem, sequi placeat, perferendis explicabo sint magnam odit vitae velit minima aliquam. Quasi, cumque cum omnis animi enim rem voluptas.',
        },
        {
            image: girl,
            name: 'Ms.Lisa',
            date: 'Requested on 10 October, 2023',
            msg: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad quaerat, dolorem, sequi placeat, perferendis explicabo sint magnam odit vitae velit minima aliquam. Quasi, cumque cum omnis animi enim rem voluptas.',
        },


    ]);
    const [noData, setNoData] = useState(false);
    const headerData = [
        {
            id: "pending",
            label: "pending",
        },
        {
            id: "approved",
            label: "approved",
        },
        {
            id: "declined",
            label: "declined",
        },

    ];
    const [rolesFilterArray, setRolesFilterArray] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(rolesFilterArray.length > 0 ? rolesFilterArray[0].id : "");
    // const userCurrentRoleStatus = useSelector((currState) => currState.currentRoleStatus.rolesStatusArray);
    // const userCurrentRoleStatusActiveRole = useSelector((currState) => currState.currentRoleStatus.activeRole);
    const actor = useSelector((currState) => currState.actors.actor);

    const getTabClassName = (tab) => {
        return `inline-block p-1 ${activeTab === tab
            ? "border-b-2 border-[#3505B2]"
            : "text-[#737373] border-transparent"
            } rounded-t-lg`;
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // useEffect(() => {
    //     if (actor) {
    //         // const api_name = fetchRequestFromUtils(activeTab, selectedStatus, userCurrentRoleStatusActiveRole);
    //         console.log('api_name', api_name)
    //         // if (api_name) {
    //         //     (async () => {
    //         //         await actor.api_name().then((result) => {
    //         //             console.log(`result-in-${api_name}`, result);
    //         //         }).catch((error) => {
    //         //             console.log(`error-in-${api_name}`, error)
    //         //         });
    //         //     })();
    //         // }
    //     }
    // }, [actor, activeTab, selectedStatus,])


    // useEffect(() => {
    //     if (userCurrentRoleStatus.length === 4 && userCurrentRoleStatusActiveRole) {
    //         // console.log('userCurrentRoleStatusActiveRole--inside', userCurrentRoleStatusActiveRole)
    //         switch (userCurrentRoleStatusActiveRole) {
    //             case "project":
    //                 setRolesFilterArray([
    //                     {
    //                         id: "to-mentor",
    //                         label: "to mentor"
    //                     },
    //                     {
    //                         id: "from-mentor",
    //                         label: "from mentor"
    //                     },
    //                     {
    //                         id: "to-investor",
    //                         label: "to investor"
    //                     },
    //                     {
    //                         id: "from-investor",
    //                         label: "from investor"
    //                     }
    //                 ]);
    //                 setSelectedStatus('to-mentor')
    //                 break;
    //             case "mentor":
    //                 setRolesFilterArray([
    //                     {
    //                         id: "to-project",
    //                         label: "to project"
    //                     },
    //                     {
    //                         id: "from-project",
    //                         label: "from project"
    //                     }
    //                 ]);
    //                 setSelectedStatus('to-project');
    //                 break;
    //             case "vc":
    //                 setRolesFilterArray([
    //                     {
    //                         id: "to-project",
    //                         label: "to project"
    //                     },
    //                     {
    //                         id: "from-project",
    //                         label: "from project"
    //                     }
    //                 ]);
    //                 setSelectedStatus('to-project');
    //                 break;
    //             default:
    //                 navigate('/');
    //                 break;
    //         }
    //     } {
    //         //     navigate('/');
    //         //     console.log('userCurrentRoleStatus-outside', userCurrentRoleStatus)
    //         //     console.log('userCurrentRoleStatusActiveRole-outside', userCurrentRoleStatusActiveRole)
    //     }

    // }, [userCurrentRoleStatus, userCurrentRoleStatusActiveRole])

    // if(noData){
    //     return <h1>Loading...</h1>
    // }
    const statusOptions = [
        { id: "pending", label: "Pending" },
        { id: "approved", label: "Approved" },
        { id: "declined", label: "Declined" },
    ];


    return (
        <div className="font-fontUse flex flex-col items-center w-full h-fit px-[5%] lg1:px-[4%] py-[4%] md:pt-0">
            <div className="mb-4 flex flex-row justify-between items-end w-full">
                <div className='flex flex-row'>
                    <p className="text-xl font-bold text-[#3505B2]">
                        Profile Request
                    </p>
                </div>
                <div className="text-sm text-center text-[#737373] mt-2">
                    <ul className="flex flex-wrap -mb-px text-[10px] ss2:text-[10.5px] ss3:text-[11px]  cursor-pointer">
                        {statusOptions.map((option, index) => (
                            <li key={index} className="me-6 relative group">
                                <button className={`inline-block p-1 ${activeTab === option.id ? "border-b-2 border-[#3505B2]" : "text-[#737373] border-transparent"} rounded-t-lg`} onClick={() => handleTabClick(option.id)}>
                                    <div className="capitalize text-base">{option.label}</div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="cursor-pointer gap-2 flex flex-row items-center" onClick={() => setIsPopupOpen(!isPopupOpen)}>
                    <button className=" border-blue-900 p-1 font-bold rounded-md text-blue-900 px-2 capitalize">
                        {selectedStatus.replace(/-/g, ' ')}
                    </button>
                    {projectFilterSvg}
                </div>
                {isPopupOpen && (
                    <div className="absolute w-[200px] top-52 right-16 bg-white shadow-xl rounded-lg border border-gray-300 p-4 z-50">
                        {statusOptions.map((status, index) => (
                            <React.Fragment key={index}>
                                <button
                                    onClick={() => {
                                        setSelectedStatus(status.id);
                                        setIsPopupOpen(false);
                                    }}
                                    className={`${selectedStatus === status.id ? 'bg-blue-50 text-blue-700' : ''} block w-full text-left px-4 py-2 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150 ease-in-out capitalize`}
                                    style={{ borderBottom: statusOptions.length + 6 ? '2px solid black' : 'none' }} 
                                    // Add border bottom style
                                >
                                    {status.label}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                )}

            </div>
            <div className='h-screen overflow-y-scroll scroll-smooth'>
                {data && data.length > 0 ?
                    data.map((val, index) => {
                        let img = val.image
                        let name = val.name
                        let date = val.date
                        let msg = val.msg
                        return (



                            
                            <div className='p-4 border-2 bg-white rounded-lg mb-4' key={index}>
                                <div className='flex'>
                                    <div className='flex flex-col'>
                                        <div className='w-12 h-12'>
                                            <img src={img} alt="img" className='object-cover rounded-full h-full w-full' />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-col w-full pl-4 ">
                                            <div className='flex justify-between flex-wrap md:flex-nowrap'>
                                                <p className='text-2xl font-extrabold text-[#3505B2]'>{name}</p>
                                                <p className='text-[#3505B2] font-bold'>{date}</p>
                                            </div>
                                            <div className='min-h-4 line-clamp-3 text-gray-400'>
                                                <p>{msg}</p>
                                            </div>
                                            <div className='flex justify-end pt-4'>
                                                <div className='flex gap-4'>
                                                    <div>

                                                    </div>
                                                    {activeTab !== 'pending' ? '' :
                                                        selectedStatus.startsWith('to-') ?
                                                            <div>

                                                            </div>
                                                            :
                                                            <>
                                                                <div>
                                                                    <button className='capitalize border-2 font-semibold bg-[#3505B2] border-[#3505B2] text-white px-2 py-1 rounded-md  hover:text-[#3505B2] hover:bg-white'>
                                                                        View User Profile
                                                                    </button>
                                                                </div>
                                                                <div>

                                                                </div>
                                                                <div>

                                                                </div>
                                                            </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    : <>
                        <h1>No Data</h1>
                    </>
                }
            </div>
        </div >
    )
}

export default Projectrequest;
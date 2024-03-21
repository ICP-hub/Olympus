import React, { useEffect, useState } from 'react';
import girl from "../../../assets/images/girl.jpeg";
import { projectFilterSvg } from '../Utils/Data/SvgData';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import fetchRequestFromUtils from '../Utils/apiNames/getAssociationApiName';
import viewProfileHandlerFromUtils from '../Utils/navigationHelper/navigationFromAssociation';

const ProjectAssociation = () => {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');
    const [data, setData] = useState([
        {
            image: girl,
            name: 'Ms.Lisa',
            date: '10 October, 2023',
            msg: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad quaerat, dolorem, sequi placeat, perferendis explicabo sint magnam odit vitae velit minima aliquam. Quasi, cumque cum omnis animi enim rem voluptas.',
        },
        {
            image: girl,
            name: 'Ms.Lisa',
            date: '10 October, 2023',
            msg: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad quaerat, dolorem, sequi placeat, perferendis explicabo sint magnam odit vitae velit minima aliquam. Quasi, cumque cum omnis animi enim rem voluptas.',
        },
        {
            image: girl,
            name: 'Ms.Lisa',
            date: '10 October, 2023',
            msg: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad quaerat, dolorem, sequi placeat, perferendis explicabo sint magnam odit vitae velit minima aliquam. Quasi, cumque cum omnis animi enim rem voluptas.',
        },
        {
            image: girl,
            name: 'Ms.Lisa',
            date: '10 October, 2023',
            msg: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad quaerat, dolorem, sequi placeat, perferendis explicabo sint magnam odit vitae velit minima aliquam. Quasi, cumque cum omnis animi enim rem voluptas.',
        },
        {
            image: girl,
            name: 'Ms.Lisa',
            date: '10 October, 2023',
            msg: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad quaerat, dolorem, sequi placeat, perferendis explicabo sint magnam odit vitae velit minima aliquam. Quasi, cumque cum omnis animi enim rem voluptas.',
        },
        {
            image: girl,
            name: 'Ms.Lisa',
            date: '10 October, 2023',
            msg: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad quaerat, dolorem, sequi placeat, perferendis explicabo sint magnam odit vitae velit minima aliquam. Quasi, cumque cum omnis animi enim rem voluptas.',
        },
        {
            image: girl,
            name: 'Ms.Lisa',
            date: '10 October, 2023',
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
        {
            id: "self-reject",
            label: "self reject",
        },
    ];
    const [rolesFilterArray, setRolesFilterArray] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(rolesFilterArray.length > 0 ? rolesFilterArray[0].id : "");
    const userCurrentRoleStatus = useSelector((currState) => currState.currentRoleStatus.rolesStatusArray);
    const userCurrentRoleStatusActiveRole = useSelector((currState) => currState.currentRoleStatus.activeRole);
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

    useEffect(() => {
        if (actor) {
            const api_name = fetchRequestFromUtils(activeTab, selectedStatus, userCurrentRoleStatusActiveRole);
            console.log('api_name', api_name)
            // if (api_name) {
            //     (async () => {
            //         await actor.api_name().then((result) => {
            //             console.log(`result-in-${api_name}`, result);
            //         }).catch((error) => {
            //             console.log(`error-in-${api_name}`, error)
            //         });
            //     })();
            // }
        }
    }, [actor, activeTab, selectedStatus, userCurrentRoleStatusActiveRole])


    useEffect(() => {
        if (userCurrentRoleStatus.length === 4 && userCurrentRoleStatusActiveRole) {
            // console.log('userCurrentRoleStatusActiveRole--inside', userCurrentRoleStatusActiveRole)
            switch (userCurrentRoleStatusActiveRole) {
                case "project":
                    setRolesFilterArray([
                        {
                            id: "to-mentor",
                            label: "to mentor"
                        },
                        {
                            id: "from-mentor",
                            label: "from mentor"
                        },
                        {
                            id: "to-investor",
                            label: "to investor"
                        },
                        {
                            id: "from-investor",
                            label: "from investor"
                        }
                    ]);
                    setSelectedStatus('to-mentor')
                    break;
                case "mentor":
                    setRolesFilterArray([
                        {
                            id: "to-project",
                            label: "to project"
                        },
                        {
                            id: "from-project",
                            label: "from project"
                        }
                    ]);
                    setSelectedStatus('to-project');
                    break;
                case "vc":
                    setRolesFilterArray([
                        {
                            id: "to-project",
                            label: "to project"
                        },
                        {
                            id: "from-project",
                            label: "from project"
                        }
                    ]);
                    setSelectedStatus('to-project');
                    break;
                default:
                    navigate('/');
                    break;
            }
        } {
            //     navigate('/');
            //     console.log('userCurrentRoleStatus-outside', userCurrentRoleStatus)
            //     console.log('userCurrentRoleStatusActiveRole-outside', userCurrentRoleStatusActiveRole)
        }

    }, [userCurrentRoleStatus, userCurrentRoleStatusActiveRole])

    // if(noData){
    //     return <h1>Loading...</h1>
    // }
    return (
        <div className="font-fontUse flex flex-col items-center w-full h-fit px-[5%] lg1:px-[4%] py-[4%] md:pt-0">
            <div className="mb-4 flex flex-row justify-between items-end w-full">
                <div className='flex flex-row'>
                    <p className="text-lg font-semibold bg-gradient-to-r from-indigo-900 to-sky-400 inline-block text-transparent bg-clip-text">
                        Association Requests
                    </p>
                </div>
                <div className="text-sm text-center text-[#737373] mt-2">
                    <ul className="flex flex-wrap -mb-px text-[10px] ss2:text-[10.5px] ss3:text-[11px]  cursor-pointer">
                        {headerData.map((header, index) => (
                            <li key={index} className="me-6 relative group">
                                <button className={getTabClassName(header?.id)}
                                    onClick={() => handleTabClick(header?.id)}>
                                    <div className="capitalize text-base">
                                        {header.label}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div onClick={() => setIsPopupOpen(!isPopupOpen)} className="cursor-pointer gap-2 flex flex-row items-center">
                    <button className="border-2 border-blue-900 p-1 font-bold rounded-md text-blue-900 px-2 capitalize">
                        {selectedStatus.replace(/-/g, ' ')}
                    </button>
                    {projectFilterSvg}
                </div>
                {isPopupOpen && (
                    <div className="absolute w-[250px] top-52 right-16 bg-white shadow-xl rounded-lg border border-gray-300 p-4 z-50">
                        {rolesFilterArray.map((status, index) => (
                            <button key={index} onClick={() => {
                                setSelectedStatus(status?.id);
                                setIsPopupOpen(false)
                            }}
                                className={`${selectedStatus === status?.id ? 'bg-blue-50 text-blue-700' : ''} block w-full text-left px-4 py-2 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150 ease-in-out capitalize`}>
                                {status?.label}
                            </button>
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
                                            <div className='flex justify-between'>
                                                <p className='text-gray-500 font-bold'>{name}</p>
                                                <p className='text-gray-400 font-thin'>{date}</p>
                                            </div>
                                            <div className='min-h-4 line-clamp-3 text-gray-400'>
                                                <p>{msg}</p>
                                            </div>
                                            <div className='flex justify-end pt-4'>
                                                <div className='flex gap-4'>
                                                    <div>
                                                        <button onClick={() => viewProfileHandlerFromUtils(activeTab, selectedStatus, userCurrentRoleStatusActiveRole, 'abc')} className='capitalize border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900'>
                                                            view profile
                                                        </button>
                                                    </div>
                                                    {activeTab !== 'pending' ? '' :
                                                        selectedStatus.startsWith('to-') ?
                                                            <div>
                                                                <button className="capitalize border-2 font-semibold bg-blue-900 border-blue-900 text-white px-2 py-1 rounded-md  hover:text-blue-900 hover:bg-white">
                                                                    self decline
                                                                </button>
                                                            </div>
                                                            :
                                                            <>
                                                                <div>
                                                                    <button className='capitalize border-2 font-semibold bg-red-700 border-red-700 text-white px-2 py-1 rounded-md  hover:text-red-900 hover:bg-white'>
                                                                        reject
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button className="capitalize border-2 font-semibold bg-blue-900 border-blue-900 text-white px-2 py-1 rounded-md  hover:text-blue-900 hover:bg-white">
                                                                        approve
                                                                    </button>
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

export default ProjectAssociation;
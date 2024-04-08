import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProjectDetailsCard from './ProjectDetailsCard';
import MembersProfileDetailsCard from './MembersProfileDetailsCard';
import MentorsProfileDetailsCard from './MentorsProfileDetailsCard';
import InvestorProfileDetailsCard from './InvestorProfileDetailsCard';
import AnnouncementDetailsCard from './AnnouncementDetailsCard';
import ProjectJobDetailsCard from './ProjectJobDetailsCard';
import ProjectDetailsCommunityRatings from './ProjectDetailsCommunityRatings';
import toast, { Toaster } from "react-hot-toast";
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ProjectDetailsForUserRole = () => {

    const stateData = useLocation();
    const projectData = stateData.state
    const navigate = useNavigate();

    if (!projectData) {
        navigate('/');
        return null
    }

    console.log("projectData ================>>>>>>", projectData)
    
    const { id } = useParams()
    const actor = useSelector((currState) => currState.actors.actor)
    const principal = useSelector((currState) => currState.internet.principal);

    // const fetchProjectData = async () => {
    //     await actor.get_project_info_for_user(id)
    //         .then((result) => {
    //             console.log('result-in-get_project_info_for_user', result)
    //             if (result && Object.keys(result).length > 0) {
    //                 setProjectData(result[0])
    //             } else {
    //                 setProjectData(null)
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('error-in-get_project_info_for_user', error)
    //             setProjectData(null)
    //         })
    // };

    const headerData = [
        {
            id: "team-member",
            label: "team member",
        },
        {
            id: "mentors-associated",
            label: "mentors associated",
        },
        {
            id: "investors-associated",
            label: "investors",
        },
        {
            id: "community-ratings",
            label: "community rating",
        },
    ];

    const [activeTab, setActiveTab] = useState(headerData[0].id);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const getTabClassName = (tab) => {
        return `inline-block p-1 ${activeTab === tab
            ? "border-b-2 border-[#3505B2]"
            : "text-[#737373]  border-transparent"
            } rounded-t-lg`;
    };

    const renderComponent = () => {
        switch (activeTab) {
            case "team-member":
                return (
                    <MembersProfileDetailsCard
                        data={projectData}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        addButton={false}
                        filter={"team"}
                    />
                );
            case "mentors-associated":
                return (
                    <MentorsProfileDetailsCard
                        data={projectData}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        addButton={false}
                        filter={"mentor"}
                    />
                );
            case "investors-associated":
                return (
                    <InvestorProfileDetailsCard
                        data={projectData}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        addButton={false}
                        filter={"investor"}
                    />
                );
            case "community-ratings":
                return (
                    <ProjectDetailsCommunityRatings
                        data={projectData}
                        isProjectLive={true}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        filter={"team"}
                    />
                )


            default:
                return null;
        }
    };

    useEffect(() => {
        if(!actor){
            navigate('/');
        }
        // console.log("actor", actor)
    },[actor])

    // useEffect(() => {
    //     if (actor && principal) {
    //         if (!projectData) {
    //             fetchProjectData();
    //         } else {

    //         }
    //     }
    // }, [actor, principal, projectData]);

    return (
        <section className="text-black bg-gray-100 pb-4 font-fontUse">
            <div className="w-full px-[4%] lg1:px-[5%]">
                <div className="flex-col">
                    <div className="pt-4 mb-4">
                        <ProjectDetailsCard
                            data={projectData}
                            image={true}
                            title={true}
                            rubric={false}
                            tags={true}
                            socials={true}
                            doj={true}
                            country={true}
                            website={true}
                            dapp={true}
                        />
                    </div>
                    {projectData?.params?.project_description && (
                        <div className="flex flex-col w-full py-4">
                            <div className='flex justify-between w-full'>
                                <p className="capitalize pb-2 font-bold text-xl">overview</p>
                            </div>
                            <p className="text-base text-gray-500 max-h-32 overflow-y-scroll">
                                {projectData?.params?.project_description}
                            </p>
                        </div>
                    )}

                    <div className="mb-4">
                        <div className="text-sm font-bold text-center text-[#737373] mt-5 pt-4">
                            <ul className="flex flex-wrap -mb-px text-[10px] ss2:text-[10.5px] ss3:text-[11px]  cursor-pointer">
                                {headerData.map((header) => (
                                    <li key={header.id} className="me-6 relative group">
                                        <button
                                            className={getTabClassName(header?.id)}
                                            onClick={() => handleTabClick(header?.id)}
                                        >
                                            <div className="capitalize text-base">
                                                {header.label}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='py-4'>
                            {renderComponent()}
                        </div>
                    </div>
                    <div className="flex flex-col py-4">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
                                Announcement
                            </h1>
                        </div>
                        <AnnouncementDetailsCard data={projectData} />
                    </div>
                    <div className="flex flex-col py-4">
                        <div className="flex justify-between">
                            <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
                                Jobs / Bounties
                            </h1>
                        </div>
                        <ProjectJobDetailsCard
                            data={projectData}
                            image={true}
                            tags={true}
                            country={true}
                            website={true}
                        />
                    </div>
                </div>
            </div>
            <Toaster />
        </section>
    );
};

export default ProjectDetailsForUserRole;
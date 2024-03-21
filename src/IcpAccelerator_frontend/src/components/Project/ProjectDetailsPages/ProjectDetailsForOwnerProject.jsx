import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProjectDetailsCard from './ProjectDetailsCard';
import MembersProfileCard from '../../TeamMembers/MembersProfileCard';
import MentorsProfileCard from '../../TeamMembers/MentorsProfileCard';
import InvenstorProfileCard from '../../TeamMembers/InvenstorProfileCard';
import ProjectRatings from '../ProjectRatings';
import MembersProfileDetailsCard from './MembersProfileDetailsCard';
import MentorsProfileDetailsCard from './MentorsProfileDetailsCard';
import InvestorProfileDetailsCard from './InvestorProfileDetailsCard';
import { Principal } from '@dfinity/principal';
import AnnouncementModal from '../../../models/AnnouncementModal';
import AddJobsModal from '../../../models/AddJobsModal';
const ProjectDetailsForOwnerProject = () => {
    // Add your component logic here
    const actor = useSelector((currState) => currState.actors.actor)
    const [projectData, setProjectData] = useState(null);

    const fetchProjectData = async () => {
        await actor.get_my_project()
            .then((result) => {
                console.log('result-in-get_my_project', result)
                if (result && Object.keys(result).length > 0) {
                    setProjectData(result)
                } else {
                    setProjectData(null)
                }
            })
            .catch((error) => {
                console.log('error-in-get_my_project', error)
                setProjectData(null)
            })
    };

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
            id: "project-ratings",
            label: "Rubric Rating",
        },
    ];

    const [activeTab, setActiveTab] = useState(headerData[0].id);
    const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
    const [isJobsModalOpen, setJobsModalOpen] = useState(false);

    const handleCloseModal = () => setAnnouncementModalOpen(false);
    const handleOpenModal = () => setAnnouncementModalOpen(true);
    const handleJobsCloseModal = () => setJobsModalOpen(false);
    const handleJobsOpenModal = () => setJobsModalOpen(true);

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
                        filter={"investor"}
                    />
                );
            case "project-ratings":
                return (
                    <ProjectRatings
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        filter={"rubric"}
                    />
                );
            default:
                return null;
        }
    };

    const renderAddButton = () => {

    }

    const handleAddTeamMember = () => {
        console.log('add team member')
        if (actor) {
            let argument = {
                project_id: projectData?.uid,
                member_principal_id: Principal.fromText('mjyg6-bruno-7wwxo-mfpgo-gm2ny-f4v7c-fzzzg-4x75y-5c4rp-uyn2d-fqe')
            }
            console.log('argument', argument)
            actor.update_team_member(argument)
                .then((result) => {
                    console.log('result-in-update_team_member', result)
                    // if (result && Object.keys(result).length > 0) {
                    //     fetchProjectData();
                    // } else {
                    //     fetchProjectData();
                    // }
                })
                .catch((error) => {
                    console.log('error-in-update_team_member', error)
                    // fetchProjectData();
                })
        }
    }


    const handleAddAnnouncement = ({ announcementTitle, announcementDescription }) => {
        console.log('add announcement')
        if (actor) {
            let argument = {
                project_id: projectData?.uid,
                announcement_title: announcementTitle,
                announcement_description: announcementDescription,
                timestamp: Date.now(),
            }
            console.log('argument', argument)
            actor.add_announcement(argument)
                .then((result) => {
                    console.log('result-in-add_announcement', result)
                    // if (result && Object.keys(result).length > 0) {
                    //     fetchProjectData();
                    // } else {
                    //     fetchProjectData();
                    // }
                })
                .catch((error) => {
                    console.log('error-in-add_announcement', error)
                    // fetchProjectData();
                })
        }
    }

    const handleAddJob = ({ jobTitle, jobDescription, jobCategory, jobLocation }) => {
        // const handleAddJob = () => {
        console.log('add job')
        if (actor) {
            let argument = {
                title: jobTitle,
                description: jobDescription,
                category: 'Bounty',
                location: jobLocation,
                link: 'hhtps://www.jeevan.me',
                project_id: projectData?.uid,

            }
            console.log('argument', argument)
            actor.post_job(argument)
                .then((result) => {
                    console.log('result-in-post_job', result)
                    // if (result) {
                    //     fetchProjectData();
                    // } else {
                    //     fetchProjectData();
                    // }
                })
                .catch((error) => {
                    console.log('error-in-post_job', error)
                    // fetchProjectData();
                })
        }
    }


    useEffect(() => {
        if (actor) {
            fetchProjectData();
        }
    }, [actor]);

    return (
        <section className="text-black bg-gray-100 pb-4">
            <div className="w-full px-[4%] lg1:px-[5%]">
                <div className="flex-col">
                    <div className="mb-4">
                        <ProjectDetailsCard
                            data={projectData}
                            image={true}
                            title={true}
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
                            <p className="capitalize pb-2 font-bold text-xl">overview</p>
                            <p className="text-base text-gray-500 max-h-32 overflow-y-scroll">
                                {projectData?.params?.project_description}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col justify-between w-full py-4">
                        <div className='flex'>
                            <button onClick={() => handleAddTeamMember()} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                                Add Team
                            </button>
                            <button onClick={handleOpenModal} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                                Add Announcement
                            </button>
                            <button onClick={handleJobsOpenModal} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                                Add Job
                            </button>

                            {/* {renderAddButton()} */}
                        </div>
                    </div>
                    <div className="mb-4">
                        {/* <ProjectRank dayRank={true} weekRank={true} /> */}
                        <div className="text-sm font-bold text-center text-[#737373] mt-2">
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
                        <div>
                            {renderComponent()}
                        </div>
                    </div>
                </div>
            </div>
            {isAnnouncementModalOpen && (
                <AnnouncementModal onClose={handleCloseModal} onSubmitHandler={handleAddAnnouncement} />)}
            {isJobsModalOpen && (
                <AddJobsModal onJobsClose={handleJobsCloseModal} onSubmitHandler={handleAddJob} />)}
        </section>
    );
};

export default ProjectDetailsForOwnerProject;
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
import AnnouncementModal from '../../../models/AnnouncementModal';
import AddJobsModal from '../../../models/AddJobsModal';
import AddRatingModal from '../../../models/AddRatingModal';
import AnnouncementCard from '../../Dashboard/AnnouncementCard';
import ProjectJobCard from '../ProjectDetails/ProjectJobCard';
import ment from "../../../../assets/images/ment.jpg";
import AnnouncementDetailsCard from './AnnouncementDetailsCard';
import ProjectJobDetailsCard from './ProjectJobDetailsCard';
import ProjectDetailsCommunityRatings from './ProjectDetailsCommunityRatings';
import AddAMentorRequestModal from '../../../models/AddAMentorRequestModal';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import ProjectDocuments from '../../Resources/ProjectDocuments';
import ProjectMoneyRaising from '../../Resources/ProjectMoneyRaising';
const ProjectDetailsForOwnerProject = () => {
    const navigate = useNavigate();
    const actor = useSelector((currState) => currState.actors.actor)
    const [projectData, setProjectData] = useState(null);
    const [isProjectLive, setIsProjectLive] = useState(null);

    const fetchProjectData = async () => {
        await actor.get_my_project()
            .then((result) => {
                console.log('result-in-get_my_project', result)
                if (result && Object.keys(result).length > 0) {
                    setProjectData(result)
                    setIsProjectLive(result?.params?.dapp_link[0] && result?.params?.dapp_link[0].trim() !== '' ? result?.params?.dapp_link[0] : null)
                } else {
                    setProjectData(null)
                    setIsProjectLive(null)
                }
            })
            .catch((error) => {
                console.log('error-in-get_my_project', error)
                setProjectData(null)
                setIsProjectLive(null)
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
            id: "community-ratings",
            label: "community rating",
        },
        {
            id: "project-ratings",
            label: "Rubric Rating",
        },
        {
            id: "project-documents",
            label: "Documents",
        },
        {
            id: "project-money-raising",
            label: "Money Raised",
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
                        isProjectLive={isProjectLive}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        addButton={true}
                        filter={"team"}
                    />
                );
            case "mentors-associated":
                return (
                    <MentorsProfileDetailsCard
                        data={projectData}
                        isProjectLive={isProjectLive}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        addButton={true}
                        filter={"mentor"}
                    />
                );
            case "investors-associated":
                return (
                    <InvestorProfileDetailsCard
                        data={projectData}
                        isProjectLive={isProjectLive}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        addButton={true}
                        filter={"investor"}
                    />
                );
            case "community-ratings":
                return (
                    <ProjectDetailsCommunityRatings
                        data={projectData}
                        isProjectLive={isProjectLive}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        filter={"team"}
                    />
                )

            case "project-ratings":
                return (
                    <ProjectRatings
                        data={projectData}
                        isProjectLive={isProjectLive}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        filter={"rubric"}
                    />
                );
            case "project-documents":
                return (
                    <ProjectDocuments
                        data={projectData}
                        isProjectLive={isProjectLive}
                        profile={true}
                        type={!true}
                        name={true}
                        role={true}
                        socials={true}
                        filter={"documents"}
                    />
                );
                case "project-money-raising":
                return (
                    <ProjectMoneyRaising
                    data={projectData}
                    profile={true}
                    type={!true}
                    name={true}
                    role={true}
                    socials={true}
                    filter={"raising"}
                    />
                );
            default:
                return null;
        }
    };

    const handleAddAnnouncement = async ({ announcementTitle, announcementDescription }) => {
        console.log('add announcement')
        if (actor) {
            let argument = {
                project_id: projectData?.uid,
                announcement_title: announcementTitle,
                announcement_description: announcementDescription,
                timestamp: Date.now(),
            }
            console.log('argument', argument)
            await actor.add_announcement(argument)
                .then((result) => {
                    console.log('result-in-add_announcement', result)
                    if (result && Object.keys(result).length > 0) {
                        handleCloseModal();
                        fetchProjectData();
                        toast.success('announcement added successfully')
                    } else {
                        handleCloseModal();
                        toast.error('something got wrong')
                    }
                })
                .catch((error) => {
                    console.log('error-in-add_announcement', error)
                    toast.error('something got wrong')
                    handleCloseModal();
                })
        }
    }

    const handleAddJob = async ({ jobTitle, jobLink, jobDescription, jobCategory, jobLocation }) => {
        console.log('add job')
        if (actor) {
            let argument = {
                title: jobTitle,
                description: jobDescription,
                category: jobCategory,
                location: jobLocation,
                link: jobLink,
                project_id: projectData?.uid,

            }
            console.log('argument', argument)
            await actor.post_job(argument)
                .then((result) => {
                    console.log('result-in-post_job', result)
                    if (result) {
                        handleJobsCloseModal();
                        fetchProjectData();
                        toast.success('job posted successfully')
                    } else {
                        handleJobsCloseModal();
                        toast.error('something got wrong')
                    }
                })
                .catch((error) => {
                    console.log('error-in-post_job', error)
                    toast.error('something got wrong')
                    handleJobsCloseModal();
                })
        }
    }

    // const fetchRubricRating = async (val) => {
    //     await actor.calculate_average(val?.uid)
    //         .then((result) => {
    //             console.log('result-in-calculate_average', result)
    //         })
    //         .catch((error) => {
    //             console.log('error-in-calculate_average', error)
    //         })
    // }

    useEffect(() => {
        if (actor) {
            if (!projectData) {
                fetchProjectData();
            } else {
                // fetchRubricRating(projectData);
            }
        } else {
            navigate('/');
        }
    }, [actor, projectData]);

    return (
        <section className="text-black bg-gray-100 pb-4 font-fontUse">
            <div className="w-full px-[4%] lg1:px-[5%]">
                <div className="flex-col">
                    <div className="pt-4 mb-4">
                        <ProjectDetailsCard
                            data={projectData}
                            image={true}
                            title={true}
                            rubric={true}
                            tags={true}
                            socials={true}
                            doj={true}
                            country={true}
                            website={true}
                            dapp={true}
                        />
                    </div>
                    <div className="flex justify-end w-full py-4">

                    </div>
                    {projectData?.params?.project_description && (
                        <div className="flex flex-col w-full py-4">
                            <div className='flex justify-between w-full'>
                                <p className="capitalize pb-2 font-bold text-xl">overview</p>
                                <button onClick={() => navigate('/project-association-requests')} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                                    View Association Requests
                                </button>
                            </div>
                            <p className="text-base text-gray-500 max-h-32 overflow-y-scroll">
                                {projectData?.params?.project_description}
                            </p>
                        </div>
                    )}

                    <div className="mb-4">
                        {/* <ProjectRank dayRank={true} weekRank={true} /> */}
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
                            {isProjectLive &&
                                (<button className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900"
                                    onClick={handleOpenModal}>
                                    Add Announcement
                                </button>
                                )}
                        </div>
                        <AnnouncementDetailsCard
                            data={projectData}
                        />
                    </div>
                    <div className="flex flex-col py-4">
                        <div className="flex justify-between">
                            <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
                                Jobs / Bounties
                            </h1>
                            {isProjectLive &&
                                (<button className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900"
                                    onClick={handleJobsOpenModal}>
                                    Add Jobs
                                </button>
                                )}
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


            {isAnnouncementModalOpen && (
                <AnnouncementModal
                    onClose={handleCloseModal}
                    onSubmitHandler={handleAddAnnouncement}
                />)}
            {isJobsModalOpen && (
                <AddJobsModal
                    onJobsClose={handleJobsCloseModal}
                    onSubmitHandler={handleAddJob}
                />)}

            <Toaster />
        </section>
    );
};

export default ProjectDetailsForOwnerProject;
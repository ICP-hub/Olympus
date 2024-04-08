import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
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
import AddTeamMember from '../../../models/AddTeamMember';
import AnnouncementCard from '../../Dashboard/AnnouncementCard';
import ProjectJobCard from '../ProjectDetails/ProjectJobCard';
import ment from "../../../../assets/images/ment.jpg";
import AnnouncementDetailsCard from './AnnouncementDetailsCard';
import ProjectJobDetailsCard from './ProjectJobDetailsCard';
import ProjectDetailsCommunityRatings from './ProjectDetailsCommunityRatings';
import AddAMentorRequestModal from '../../../models/AddAMentorRequestModal';
import toast, { Toaster } from "react-hot-toast";
import Details from '../../Resources/ProjectDocuments';
import ProjectDocuments from '../../Resources/ProjectDocuments';
import ProjectMoneyRaising from '../../Resources/ProjectMoneyRaising';

const ProjectDetailsForMentorProject = () => {
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
    const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
    const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
    const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
    const [isJobsModalOpen, setJobsModalOpen] = useState(false);
    const [isRatingModalOpen, setRatingModalOpen] = useState(false);

    const handleTeamMemberCloseModal = () => setIsAddTeamModalOpen(false);
    const handleTeamMemberOpenModal = () => setIsAddTeamModalOpen(true);
    const handleMentorCloseModal = () => setIsAddMentorModalOpen(false);
    const handleMentorOpenModal = () => setIsAddMentorModalOpen(true);
    const handleCloseModal = () => setAnnouncementModalOpen(false);
    const handleOpenModal = () => setAnnouncementModalOpen(true);
    const handleJobsCloseModal = () => setJobsModalOpen(false);
    const handleJobsOpenModal = () => setJobsModalOpen(true);
    const handleRatingCloseModal = () => setRatingModalOpen(false);
    const handleRatingOpenModal = () => setRatingModalOpen(true);

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
            case "community-ratings":
                return (
                    <ProjectDetailsCommunityRatings
                        data={projectData}
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

    const renderAddButton = () => {

    }
    
    const handleAddTeamMember = ({ user_id }) => {
        console.log('add team member')
        if (actor) {
            let project_id = projectData?.uid;
            let member_principal_id = Principal.fromText(user_id)
            actor.update_team_member(project_id, member_principal_id)
                .then((result) => {
                    console.log('result-in-update_team_member', result)
                    if (result) {
                        handleTeamMemberCloseModal();
                        fetchProjectData();
                        toast.success('team member added successfully')
                    } else {
                        handleTeamMemberCloseModal();
                        toast.error('something got wrong')

                    }
                })
                .catch((error) => {
                    console.log('error-in-update_team_member', error)
                    handleTeamMemberCloseModal();
                    toast.error('something got wrong')

                })
        }
    }

    const handleAddMentor = ({ user_id, message }) => {
        console.log('add a mentor')
        if (actor) {
            let mentor_id = Principal.fromText(user_id)
            let msg = message
            let project_id = projectData?.uid;

            actor.send_offer_to_mentor(mentor_id, msg, project_id)
                .then((result) => {
                    console.log('result-in-send_offer_to_mentor', result)
                    if (result) {
                        handleMentorCloseModal();
                        fetchProjectData();
                        toast.success('offer sent to mentor successfully')
                    } else {
                        handleMentorCloseModal();
                        toast.error('something got wrong')

                    }
                })
                .catch((error) => {
                    console.log('error-in-send_offer_to_mentor', error)
                    handleMentorCloseModal();
                    toast.error('something got wrong')

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

    const handleAddJob = ({ jobTitle, jobLink, jobDescription, jobCategory, jobLocation }) => {
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
            actor.post_job(argument)
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

    const handleAddRating = ({ rating, ratingDescription }) => {
        console.log('add job')
        if (actor) {
            actor.add_review(rating, ratingDescription)
                .then((result) => {
                    console.log('result-in-add_review', result)
                    if (result) {
                        handleRatingCloseModal();
                        fetchProjectData();
                        toast.success('review added successfully')
                    } else {
                        handleRatingCloseModal();
                        toast.error('something got wrong')
                    }
                })
                .catch((error) => {
                    console.log('error-in-add_review', error)
                    toast.error('something got wrong')
                    handleRatingCloseModal();
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
                    <div className="pt-4 mb-4">
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
                    {/* <div className="flex justify-end w-full py-4">
                        <div className='flex gap-2'>
                            <button onClick={handleTeamMemberOpenModal} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                                Add Team Member
                            </button>
                            <button onClick={handleMentorOpenModal} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                                Associate Mentor
                            </button>
                            <button onClick={handleJobsOpenModal} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                                Associate Investor
                            </button>
                            <button onClick={handleRatingOpenModal} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                                Add Community Rating
                            </button>
                        </div>
                    </div> */}
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
                        <div className='py-4'>
                            {renderComponent()}
                        </div>
                    </div>
                    <div className="flex flex-col py-4">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="font-[950] text-lg md:text-2xl  text-blue-700">
                                Announcement
                            </h1>
                            {/* <button className="font-[950] border bg-[#3505B2] py-[7px] px-[9px] rounded-md text-white text-nowrap capitalize"
                                onClick={handleOpenModal}>
                                Add Announcement
                            </button> */}
                        </div>
                        <AnnouncementDetailsCard data={projectData} />
                    </div>
                    <div className="flex flex-col py-4">
                        <div className="flex justify-between">
                            <h1 className="font-[950] text-lg md:text-2xl  text-blue-700">
                                Jobs / Bounties
                            </h1>
                            {/* <button className="font-[950] border bg-[#3505B2] px-4 py-2 rounded-md text-white text-nowrap capitalize"
                                onClick={handleJobsOpenModal}>
                                Add Jobs
                            </button> */}
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
            
            {isAddTeamModalOpen && (
                <AddTeamMember
                    title={'Add Team Member'}
                    onClose={handleTeamMemberCloseModal}
                    onSubmitHandler={handleAddTeamMember}
                />)}
              {isAddMentorModalOpen && (
                <AddAMentorRequestModal
                    title={'Associate Mentor'}
                    onClose={handleMentorCloseModal}
                    onSubmitHandler={handleAddMentor}
                />)}
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
            {isRatingModalOpen && (
                <AddRatingModal 
                onRatingClose={handleRatingCloseModal} 
                onSubmitHandler={handleAddRating} 
                />)}
            <Toaster/>
        </section>
    );
};

export default ProjectDetailsForMentorProject;
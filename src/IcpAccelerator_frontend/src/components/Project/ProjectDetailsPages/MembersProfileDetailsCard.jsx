import React, { useState } from "react";
import {
    linkedInSvg,
    twitterSvg,
} from "../../Utils/Data/SvgData";
import { useSelector } from "react-redux";
import { Principal } from '@dfinity/principal';
import AddTeamMember from "../../../models/AddTeamMember";
import toast, { Toaster } from "react-hot-toast";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";


const MembersProfileDetailsCard = ({ data,  isProjectLive, profile, type, name, role, socials, addButton, filter }) => {
    if (!data) {
        return null;
    }
    
    const actor = useSelector((currState) => currState.actors.actor)
    const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

    const handleTeamMemberCloseModal = () => setIsAddTeamModalOpen(false);
    const handleTeamMemberOpenModal = () => setIsAddTeamModalOpen(true);

    const handleAddTeamMember = async ({ user_id }) => {
        console.log('add team member')
        if (actor) {
            let project_id = data?.uid;
            let member_principal_id = Principal.fromText(user_id)
            await actor.update_team_member(project_id, member_principal_id)
                .then((result) => {
                    console.log('result-in-update_team_member', result)
                    if (result) {
                        handleTeamMemberCloseModal();
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

    return (
        <>
            {addButton && isProjectLive && (
                <div className="flex w-full justify-end mb-4">
                    <button onClick={handleTeamMemberOpenModal} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">Add Team Member</button>
                </div>)}
            <div className="md1:flex flex-wrap gap-10">
                <div className={`w-[100%] md1:w-[calc(100%/2-40px)] dxl:w-[calc(100%/3-40px)] xl2:w-[calc(25%-10px)] rounded-[10px] shadow-lg md:m-1 mb-10 p-6 bg-blue-200`}>
                    <div className="flex w-full justify-between">
                        {profile && (
                            <div className="p-[3px] rounded-full flex bg-blend-overlay "
                                style={{
                                    boxSizing: "border-box",
                                    background: `url(${uint8ArrayToBase64(data?.params?.user_data?.profile_picture[0])}) center / cover, linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                                    backdropFilter: "blur(20px)"
                                }}>
                                <img className="rounded-full object-cover w-20 h-20"
                                    src={uint8ArrayToBase64(data?.params?.user_data?.profile_picture[0])} alt={'img'} />
                            </div>)}
                        {socials && (
                            <div className="flex gap-3">
                                {data?.params?.user_data?.linkedin_link && (
                                    <div className="w-4 h-4">
                                        <a href={data?.params?.user_data?.linkedin_link} target="_blank">
                                            {linkedInSvg}
                                        </a>
                                    </div>)}
                                {data?.params?.user_data?.twitter_id[0] && (
                                    <div className="w-4 h-4">
                                        <a href={data?.params?.user_data?.twitter_id[0]} target="_blank">
                                            {twitterSvg}
                                        </a>
                                    </div>)}
                            </div>
                        )}
                    </div>
                    {
                        name && role && (<div className="pt-4 pb-4 sm:pb-2 md:pb-0">
                            <div className="font-extrabold text-lg md:text-2xl mb-1">{data?.params?.user_data?.full_name ?? ""}</div>
                            <p className="text-gray-700 text-base capitalize">Author</p>
                        </div>
                        )
                    }
                </div>
                {data?.params?.project_team && data?.params?.project_team.length > 0 ?
                    data?.params?.project_team.map((val, index) => {
                        let data = val[0]?.member_data;
                        console.log(data)
                        return (
                            <div key={index} className={`w-[100%] md1:w-[calc(100%/2-40px)] dxl:w-[calc(100%/3-40px)] xl2:w-[calc(25%-10px)] rounded-[10px] shadow-lg md:m-1 mb-10 p-6 bg-white`}>
                                <div className="flex w-full justify-between">
                                    {profile && (
                                        <div className="p-[3px] rounded-full flex bg-blend-overlay "
                                            style={{
                                                boxSizing: "border-box",
                                                background: `url(${uint8ArrayToBase64(data?.profile_picture[0])}) center / cover, linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                                                backdropFilter: "blur(20px)"
                                            }}>
                                            <img className="rounded-full object-cover w-20 h-20"
                                                src={uint8ArrayToBase64(data?.profile_picture[0])} alt={'img'} />
                                        </div>)}
                                    {socials && (
                                        <div className="flex gap-3">
                                            {data?.linkedin && (
                                                <div className="w-4 h-4">
                                                    <a href={data?.linkedin} target="_blank">
                                                        {linkedInSvg}
                                                    </a>
                                                </div>)}
                                            {data?.twitter_id && (
                                                <div className="w-4 h-4">
                                                    <a href={data?.twitter_id} target="_blank">
                                                        {twitterSvg}
                                                    </a>
                                                </div>)}
                                        </div>
                                    )}
                                </div>
                                {/* {
                                type && (
                                    <span className="text-sm font-bold text-gray-500 mb-2 px-4 uppercase">
                                        {data?.type ?? ""}
                                    </span>
                                )
                            } */}
                                {
                                    name && role && (<div className="pt-4 pb-4 sm:pb-2 md:pb-0">
                                        <div className="font-extrabold text-lg md:text-2xl mb-1">{data?.full_name ?? ""}</div>
                                        {/* <p className="text-gray-700 text-base capitalize">{index === 0 ? 'Author' : 'project member'}</p> */}
                                        <p className="text-gray-700 text-base capitalize">{'project member'}</p>
                                    </div>
                                    )
                                }
                            </div>
                        )
                    })
                    : null
                    // <div>
                    //     <h1>No Data</h1>
                    // </div>
                }
            </div >
            {isAddTeamModalOpen && (
                <AddTeamMember
                    title={'Add Team Member'}
                    onClose={handleTeamMemberCloseModal}
                    onSubmitHandler={handleAddTeamMember}
                />)}
            <Toaster />

        </>
    );
};

export default MembersProfileDetailsCard;

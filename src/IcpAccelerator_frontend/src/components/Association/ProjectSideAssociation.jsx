import React, { useEffect, useState } from 'react';
import girl from "../../../assets/images/girl.jpeg";
import { projectFilterSvg } from '../Utils/Data/SvgData';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import fetchRequestFromUtils from '../Utils/apiNames/getAssociationApiName';
import viewProfileHandlerFromUtils from '../Utils/navigationHelper/navigationFromAssociation';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import { formatFullDateFromBigInt } from '../Utils/formatter/formatDateFromBigInt';
import AcceptOfferModal from '../../models/AcceptOfferModal';
import DeclineOfferModal from '../../models/DeclineOfferModal';
import NoDataCard from '../Mentors/Event/ProjectAssocReqNoDataCard';

const ProjectSideAssociation = () => {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');
    const [data, setData] = useState([]);
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

    const rolesFilterArray = [
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
    ];

    const actor = useSelector((currState) => currState.actors.actor);
    const principal = useSelector((currState) => currState.internet.principal);
    const [selectedStatus, setSelectedStatus] = useState('to-mentor');
    const [isAcceptMentorOfferModal, setIsAcceptMentorOfferModal] = useState(null);
    const [isDeclineMentorOfferModal, setIsDeclineMentorOfferModal] = useState(null);
    const [isAcceptInvestorOfferModal, setIsAcceptInvestorOfferModal] = useState(null);
    const [isDeclineInvestorOfferModal, setIsDeclineInvestorOfferModal] = useState(null);
    const [offerId, setOfferId] = useState(null);
    const [projectId, setProjectId] = useState(null);


    const getTabClassName = (tab) => {
        return `inline-block p-1 ${activeTab === tab
            ? "border-b-2 border-[#3505B2]"
            : "text-[#737373] border-transparent"
            } rounded-t-lg`;
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // // // MENTOR SIDE REQUEST MODAL HANDLER // // //
    const handleMentorAcceptModalCloseHandler = () => {
        setOfferId(null);
        setIsAcceptMentorOfferModal(false);
    }
    const handleMentorAcceptModalOpenHandler = (val) => {
        setOfferId(val);
        setIsAcceptMentorOfferModal(true);
    }


    const handleMentorDeclineModalCloseHandler = () => {
        setOfferId(null);
        setIsDeclineMentorOfferModal(false);
    }
    const handleMentorDeclineModalOpenHandler = (val) => {
        setOfferId(val);
        setIsDeclineMentorOfferModal(true);
    }


    // // // INVESTOR SIDE REQUEST MODAL HANDLER // // //

    const handleInvestorAcceptModalCloseHandler = () => {
        setOfferId(null);
        setIsAcceptInvestorOfferModal(false);
    }
    const handleInvestorAcceptModalOpenHandler = (val) => {
        setOfferId(val);
        setIsAcceptInvestorOfferModal(true);
    }


    const handleInvestorDeclineModalCloseHandler = () => {
        setOfferId(null);
        setIsDeclineInvestorOfferModal(false);
    }
    const handleInvestorDeclineModalOpenHandler = (val) => {
        setOfferId(val);
        setIsDeclineInvestorOfferModal(true);
    }




    // GET MY PROJECT ID HANDLER
    const fetchProjectId = async () => {
        try {
            const result = await actor.get_project_id();
            console.log(`result-in-get_project_id`, result);
            if (result && result !== "couldn't get project information") {
                setProjectId(result)
            } else {
                setProjectId(null);
            }
        } catch (error) {
            console.log(`error-in-get_project_id`, error);
            setProjectId(null);
        }
    }

    /// /// MENTOR SIDE


    // // // GET POST API HANDLERS WHERE PROJECT APPROCHES MENTOR // // //

    // GET API HANDLER TO GET THE PENDING REQUESTS DATA WHERE PROJECT APPROCHES MENTOR
    const fetchPendingRequestFromProjectToMentor = async () => {
        try {
            const result = await actor.get_project_pending_offers();
            console.log(`result-in-get_project_pending_offers`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_project_pending_offers`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE APPROVED REQUESTS DATA WHERE PROJECT APPROCHES MENTOR
    const fetchApprovedRequestFromProjectToMentor = async () => {
        try {
            const result = await actor.get_accepted_request_for_project();
            console.log(`result-in-get_accepted_request_for_project`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_accepted_request_for_project`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE DECLINED REQUESTS DATA WHERE PROJECT APPROCHES MENTOR
    const fetchDeclinedRequestFromProjectToMentor = async () => {
        try {
            const result = await actor.get_declined_request_for_project();
            console.log(`result-in-get_declined_request_for_project`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_declined_request_for_project`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE SELF-REJECT REQUESTS DATA WHERE PROJECT APPROCHES MENTOR AND SELF DECLINED THE REQUEST
    const fetchSelfRejectedRequestFromProjectToMentor = async () => {
        try {
            const result = await actor.get_self_declined_requests_for_project();
            console.log(`result-in-get_self_declined_requests_for_project`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_self_declined_requests_for_project`, error);
            setData([]);
        }
    }

    // POST API HANDLER TO SELF-REJECT A REQUEST WHERE PROJECT APPROCHES MENTOR
    const handleMentorSelfReject = async (offer_id) => {
        try {
            const result = await actor.self_decline_request(offer_id);
            console.log(`result-in-self_decline_request`, result);
            fetchPendingRequestFromProjectToMentor();
        } catch (error) {
            console.log(`error-in-self_decline_request`, error);
        }

    }



    // // // GET POST API HANDLERS WHERE MENTOR APPROCHES PROJECT // // //

    // GET API HANDLER TO GET THE PENDING REQUESTS DATA WHERE MENTOR APPROCHES PROJECT
    const fetchPendingRequestFromMentorToProject = async () => {
        try {
            const result = await actor.get_all_offers_which_are_pending_for_project(projectId);
            console.log(`result-in-get_all_offers_which_are_pending_for_project`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_all_offers_which_are_pending_for_project`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE APPROVED REQUESTS DATA WHERE MENTOR APPROCHES PROJECT
    const fetchApprovedRequestFromMentorToProject = async () => {
        try {
            const result = await actor.get_all_requests_which_got_accepted_for_project(projectId);
            console.log(`result-in-get_all_requests_which_got_accepted_for_project`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_all_requests_which_got_accepted_for_project`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE DECLINED REQUESTS DATA WHERE MENTOR APPROCHES PROJECT
    const fetchDeclinedRequestFromMentorToProject = async () => {
        try {
            const result = await actor.get_all_requests_which_got_declined_for_project(projectId);
            console.log(`result-in-get_all_requests_which_got_declined_for_project`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_all_requests_which_got_declined_for_project`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE SELF-REJECT REQUESTS DATA WHERE MENTOR APPROCHES PROJECT AND SELF DECLINED THE REQUEST
    const fetchSelfRejectedRequestFromMentorToProject = async () => {
        try {
            const result = await actor.get_all_requests_which_got_self_declined_for_project(projectId);
            console.log(`result-in-get_all_requests_which_got_self_declined_for_project`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_all_requests_which_got_self_declined_for_project`, error);
            setData([]);
        }
    }

    // POST API HANDLER TO APPROVE THE PENDING REQUEST BY PROJECT WHERE MENTOR APPROCHES PROJECT
    const handleAcceptMentorOffer = async ({ message }) => {

        try {
            const result = await actor.accept_offer_of_mentor(offerId, message, projectId);
            console.log(`result-in-accept_offer_of_mentor`, result);
            handleMentorAcceptModalCloseHandler();
            fetchPendingRequestFromMentorToProject();
        } catch (error) {
            console.log(`error-in-accept_offer_of_mentor`, error);
            handleMentorAcceptModalCloseHandler();
        }
    }

    // POST API HANDLER TO DECLINE THE PENDING REQUEST BY PROJECT WHERE MENTOR APPROCHES PROJECT
    const handleDeclineMentorOffer = async ({ message }) => {

        try {
            const result = await actor.decline_offer_of_mentor(offerId, message, projectId);
            console.log(`result-in-decline_offer_of_mentor`, result);
            handleMentorDeclineModalCloseHandler();
            fetchPendingRequestFromMentorToProject();
        } catch (error) {
            console.log(`error-in-decline_offer_of_mentor`, error);
            handleMentorDeclineModalCloseHandler();
        }
    }


    /// /// INVESTOR SIDE

    // // // GET POST API HANDLERS WHERE PROJECT APPROCHES INVESTOR // // //

    // GET API HANDLER TO GET THE PENDING REQUESTS DATA WHERE PROJECT APPROCHES INVESTOR
    const fetchPendingRequestFromProjectToInvestor = async () => {
        try {
            const result = await actor.get_pending_offers_received_from_investor(projectId);
            console.log(`result-in-get_pending_offers_received_from_investor`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_pending_offers_received_from_investor`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE APPROVED REQUESTS DATA WHERE PROJECT APPROCHES INVESTOR
    const fetchApprovedRequestFromProjectToInvestor = async () => {
        try {
            const result = await actor.get_accepted_request_of_project_by_investor(projectId);
            console.log(`result-in-get_accepted_request_of_project_by_investor`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_accepted_request_of_project_by_investor`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE DECLINED REQUESTS DATA WHERE PROJECT APPROCHES INVESTOR
    const fetchDeclinedRequestFromProjectToInvestor = async () => {
        try {
            const result = await actor.get_declined_request_of_project_by_investor(projectId);
            console.log(`result-in-get_declined_request_of_project_by_investor`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_declined_request_of_project_by_investor`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE SELF-REJECT REQUESTS DATA WHERE PROJECT APPROCHES INVESTOR AND SELF DECLINED THE REQUEST
    const fetchSelfRejectedRequestFromProjectToInvestor = async () => {
        try {
            const result = await actor.get_self_declined_requests_of_project(projectId);
            console.log(`result-in-get_self_declined_requests_for_project`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_self_declined_requests_for_project`, error);
            setData([]);
        }
    }

    // POST API HANDLER TO SELF-REJECT A REQUEST WHERE PROJECT APPROCHES INVESTOR
    const handleInvestorSelfReject = async (offer_id) => {
        try {
            const result = await actor.self_decline_request_for_project(offer_id, projectId);
            console.log(`result-in-self_decline_request_for_project`, result);
            fetchPendingRequestFromProjectToInvestor();
        } catch (error) {
            console.log(`error-in-self_decline_request_for_project`, error);
        }

    }



    // // // GET POST API HANDLERS WHERE INVESTOR APPROCHES PROJECT // // //

    // GET API HANDLER TO GET THE PENDING REQUESTS DATA WHERE INVESTOR APPROCHES PROJECT
    const fetchPendingRequestFromInvestorToProject = async () => {
        try {
            const result = await actor.get_all_offers_which_are_pending_for_project_from_investor(projectId);
            console.log(`result-in-get_all_offers_which_are_pending_for_project_from_investor`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_all_offers_which_are_pending_for_project_from_investor`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE APPROVED REQUESTS DATA WHERE INVESTOR APPROCHES PROJECT
    const fetchApprovedRequestFromInvestorToProject = async () => {
        try {
            const result = await actor.get_all_requests_which_got_accepted_by_project_of_investor(projectId);
            console.log(`result-in-get_all_requests_which_got_accepted_by_project_of_investor`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_all_requests_which_got_accepted_by_project_of_investor`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE DECLINED REQUESTS DATA WHERE INVESTOR APPROCHES PROJECT
    const fetchDeclinedRequestFromInvestorToProject = async () => {
        try {
            const result = await actor.get_all_requests_which_got_declined_by_project_of_investor(projectId);
            console.log(`result-in-get_all_requests_which_got_declined_by_project_of_investor`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_all_requests_which_got_declined_by_project_of_investor`, error);
            setData([]);
        }
    }

    // GET API HANDLER TO GET THE SELF-REJECT REQUESTS DATA WHERE INVESTOR APPROCHES PROJECT AND SELF DECLINED THE REQUEST
    const fetchSelfRejectedRequestFromInvestorToProject = async () => {
        try {
            const result = await actor.get_all_requests_which_got_self_declined_by_investor(projectId);
            console.log(`result-in-get_all_requests_which_got_self_declined_by_investor`, result);
            setData(result)
        } catch (error) {
            console.log(`error-in-get_all_requests_which_got_self_declined_by_investor`, error);
            setData([]);
        }
    }

    // POST API HANDLER TO APPROVE THE PENDING REQUEST BY PROJECT WHERE INVESTOR APPROCHES PROJECT
    const handleAcceptInvestorOffer = async ({ message }) => {
        try {
            const result = await actor.accept_offer_of_investor(offerId, message, projectId);
            console.log(`result-in-accept_offer_of_investor`, result);
            handleInvestorAcceptModalCloseHandler();
            fetchPendingRequestFromInvestorToProject();
        } catch (error) {
            console.log(`error-in-accept_offer_of_investor`, error);
            handleInvestorAcceptModalCloseHandler();
        }
    }

    // POST API HANDLER TO DECLINE THE PENDING REQUEST BY PROJECT WHERE INVESTOR APPROCHES PROJECT
    const handleDeclineInvestorOffer = async ({ message }) => {
        try {
            const result = await actor.decline_offer_of_investor(offerId, message, projectId);
            console.log(`result-in-decline_offer_of_investor`, result);
            handleInvestorDeclineModalCloseHandler();
            fetchPendingRequestFromInvestorToProject();
        } catch (error) {
            console.log(`error-in-decline_offer_of_investor`, error);
            handleInvestorDeclineModalCloseHandler();
        }
    }


    // NAVIGATE TO VIEW MENTOR OR VIEW INVESTOR DETAILS PAGE HANDLER
    const viewMentorOrInvestorProfileHanlder = (val) => {
        let route = null;
        switch (selectedStatus) {
            case 'to-mentor':
                route = `/view-mentor-details/${val?.mentor_id.toText()}`
                break;
            case 'from-mentor':
                route = `/view-mentor-details/${val?.mentor_info?.mentor_id.toText()}`
                break;
            case 'to-investor':
                route = `/view-investor-details/${val?.investor_id.toText()}`
                break;
            case 'from-investor':
                route = `/view-investor-details/${val?.investor_info?.investor_id.toText()}`
                break;
            default:
                break;
        }
        return route
    }

    useEffect(() => {
        setData([]);
        if (!projectId) {
            fetchProjectId();
        } else if (actor && principal && activeTab && selectedStatus && projectId) {
            switch (activeTab) {
                case 'pending':
                    switch (selectedStatus) {
                        case 'to-mentor':
                            fetchPendingRequestFromProjectToMentor();
                            break;
                        case 'from-mentor':
                            fetchPendingRequestFromMentorToProject();
                            break;
                        case 'to-investor':
                            fetchPendingRequestFromProjectToInvestor();
                            break;
                        case 'from-investor':
                            fetchPendingRequestFromInvestorToProject();
                            break;
                        default:
                            break;
                    }
                    break;
                case 'approved':
                    switch (selectedStatus) {
                        case 'to-mentor':
                            fetchApprovedRequestFromProjectToMentor();
                            break;
                        case 'from-mentor':
                            fetchApprovedRequestFromMentorToProject();
                            break;
                        case 'to-investor':
                            fetchApprovedRequestFromProjectToInvestor();
                            break;
                        case 'from-investor':
                            fetchApprovedRequestFromInvestorToProject();
                            break;
                        default:
                            break;
                    }
                    break;
                case 'declined':
                    switch (selectedStatus) {
                        case 'to-mentor':
                            fetchDeclinedRequestFromProjectToMentor();
                            break;
                        case 'from-mentor':
                            fetchDeclinedRequestFromMentorToProject();
                            break;
                        case 'to-investor':
                            fetchDeclinedRequestFromProjectToInvestor();
                            break;
                        case 'from-investor':
                            fetchDeclinedRequestFromInvestorToProject();
                            break;
                        default:
                            break;
                    }
                    break;
                case 'self-reject':
                    switch (selectedStatus) {
                        case 'to-mentor':
                            fetchSelfRejectedRequestFromProjectToMentor();
                            break;
                        case 'from-mentor':
                            fetchSelfRejectedRequestFromMentorToProject();
                            break;
                        case 'to-investor':
                            fetchSelfRejectedRequestFromProjectToInvestor();
                            break;
                        case 'from-investor':
                            fetchSelfRejectedRequestFromInvestorToProject();
                            break;
                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
        }
    }, [actor, principal, activeTab, selectedStatus, projectId])

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
                                    onClick={() => { setData([]); handleTabClick(header?.id) }}>
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
                                setData([]);
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
            <div className='h-screen overflow-y-scroll scroll-smooth w-full'>
                {data && data.length > 0 ?
                    data.map((val, index) => {
                        console.log('full-val', val);
                        let img = ""
                        let name = ""
                        let date = ""
                        let msg = ""
                        let offer_id = ""
                        let resp_msg = ""
                        let accpt_date = ""
                        let decln_date = ""
                        let self_decln = ""

                        switch (activeTab) {
                            case "pending":
                                switch (selectedStatus) {
                                    case 'to-mentor':
                                        img = val?.mentor_image[0] ? uint8ArrayToBase64(val?.mentor_image[0]) : ""
                                        name = val?.mentor_name ?? ""
                                        date = val?.time_of_request ? formatFullDateFromBigInt(val?.time_of_request) : ""
                                        msg = val?.offer_i_have_written ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        break;
                                    case 'from-mentor':
                                        img = val?.mentor_info?.mentor_image ? uint8ArrayToBase64(val?.mentor_info?.mentor_image) : ""
                                        name = val?.mentor_info?.mentor_name ?? ""
                                        date = val?.sent_at ? formatFullDateFromBigInt(val?.sent_at) : ""
                                        msg = val?.offer ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        break;
                                    case 'to-investor':
                                        img = val?.investor_image[0] ? uint8ArrayToBase64(val?.investor_image[0]) : ""
                                        name = val?.investor_name ?? ""
                                        date = val?.time_of_request ? formatFullDateFromBigInt(val?.time_of_request) : ""
                                        msg = val?.offer_i_have_written ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        break;
                                    case 'from-investor':
                                        img = val?.investor_info?.investor_image ? uint8ArrayToBase64(val?.investor_info?.investor_image) : ""
                                        name = val?.investor_info?.investor_name ?? ""
                                        date = val?.sent_at ? formatFullDateFromBigInt(val?.sent_at) : ""
                                        msg = val?.offer ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case "approved":
                                switch (selectedStatus) {
                                    case 'to-mentor':
                                        img = val?.mentor_image[0] ? uint8ArrayToBase64(val?.mentor_image[0]) : ""
                                        name = val?.mentor_name ?? ""
                                        date = val?.time_of_request ? formatFullDateFromBigInt(val?.time_of_request) : ""
                                        msg = val?.offer_i_have_written ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        resp_msg = val?.response ?? ""
                                        accpt_date = val?.accepted_at ? formatFullDateFromBigInt(val?.accepted_at) : ""
                                        break;
                                    case 'from-mentor':
                                        img = val?.mentor_info?.mentor_image ? uint8ArrayToBase64(val?.mentor_info?.mentor_image) : ""
                                        name = val?.mentor_info?.mentor_name ?? ""
                                        date = val?.sent_at ? formatFullDateFromBigInt(val?.sent_at) : ""
                                        msg = val?.offer ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        resp_msg = val?.response ?? ""
                                        accpt_date = val?.accepted_at ? formatFullDateFromBigInt(val?.accepted_at) : ""
                                        break;
                                    case 'to-investor':
                                        img = val?.investor_image[0] ? uint8ArrayToBase64(val?.investor_image[0]) : ""
                                        name = val?.investor_name ?? ""
                                        date = val?.time_of_request ? formatFullDateFromBigInt(val?.time_of_request) : ""
                                        msg = val?.offer_i_have_written ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        resp_msg = val?.response ?? ""
                                        accpt_date = val?.accepted_at ? formatFullDateFromBigInt(val?.accepted_at) : ""
                                        break;
                                    case 'from-investor':
                                        img = val?.investor_info?.investor_image ? uint8ArrayToBase64(val?.investor_info?.investor_image) : ""
                                        name = val?.investor_info?.investor_name ?? ""
                                        date = val?.sent_at ? formatFullDateFromBigInt(val?.sent_at) : ""
                                        msg = val?.offer ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        resp_msg = val?.response ?? ""
                                        accpt_date = val?.accepted_at ? formatFullDateFromBigInt(val?.accepted_at) : ""
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case "declined":
                                switch (selectedStatus) {
                                    case 'to-mentor':
                                        img = val?.mentor_image[0] ? uint8ArrayToBase64(val?.mentor_image[0]) : ""
                                        name = val?.mentor_name ?? ""
                                        date = val?.time_of_request ? formatFullDateFromBigInt(val?.time_of_request) : ""
                                        msg = val?.offer_i_have_written ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        resp_msg = val?.response ?? ""
                                        decln_date = val?.declined_at ? formatFullDateFromBigInt(val?.declined_at) : ""
                                        break;
                                    case 'from-mentor':
                                        img = val?.mentor_info?.mentor_image ? uint8ArrayToBase64(val?.mentor_info?.mentor_image) : ""
                                        name = val?.mentor_info?.mentor_name ?? ""
                                        date = val?.sent_at ? formatFullDateFromBigInt(val?.sent_at) : ""
                                        msg = val?.offer ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        resp_msg = val?.response ?? ""
                                        decln_date = val?.declined_at ? formatFullDateFromBigInt(val?.declined_at) : ""
                                        break;
                                    case 'to-investor':
                                        img = val?.investor_image[0] ? uint8ArrayToBase64(val?.investor_image[0]) : ""
                                        name = val?.investor_name ?? ""
                                        date = val?.time_of_request ? formatFullDateFromBigInt(val?.time_of_request) : ""
                                        msg = val?.offer_i_have_written ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        resp_msg = val?.response ?? ""
                                        decln_date = val?.declined_at ? formatFullDateFromBigInt(val?.declined_at) : ""
                                        break;
                                    case 'from-investor':
                                        img = val?.investor_info?.investor_image ? uint8ArrayToBase64(val?.investor_info?.investor_image) : ""
                                        name = val?.investor_info?.investor_name ?? ""
                                        date = val?.sent_at ? formatFullDateFromBigInt(val?.sent_at) : ""
                                        msg = val?.offer ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        resp_msg = val?.response ?? ""
                                        decln_date = val?.declined_at ? formatFullDateFromBigInt(val?.declined_at) : ""
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case "self-reject":
                                switch (selectedStatus) {
                                    case 'to-mentor':
                                        img = val?.mentor_image[0] ? uint8ArrayToBase64(val?.mentor_image[0]) : ""
                                        name = val?.mentor_name ?? ""
                                        date = val?.time_of_request ? formatFullDateFromBigInt(val?.time_of_request) : ""
                                        msg = val?.offer_i_have_written ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        self_decln = val?.self_declined_at ? formatFullDateFromBigInt(val?.self_declined_at) : ""
                                        break;
                                    case 'from-mentor':
                                        img = val?.mentor_info?.mentor_image ? uint8ArrayToBase64(val?.mentor_info?.mentor_image) : ""
                                        name = val?.mentor_info?.mentor_name ?? ""
                                        date = val?.sent_at ? formatFullDateFromBigInt(val?.sent_at) : ""
                                        msg = val?.offer ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        self_decln = val?.self_declined_at ? formatFullDateFromBigInt(val?.self_declined_at) : ""
                                        break;
                                    case 'to-investor':
                                        img = val?.investor_image[0] ? uint8ArrayToBase64(val?.investor_image[0]) : ""
                                        name = val?.investor_name ?? ""
                                        date = val?.time_of_request ? formatFullDateFromBigInt(val?.time_of_request) : ""
                                        msg = val?.offer_i_have_written ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        self_decln = val?.self_declined_at ? formatFullDateFromBigInt(val?.self_declined_at) : ""
                                        break;
                                    case 'from-investor':
                                        img = val?.investor_info?.investor_image ? uint8ArrayToBase64(val?.investor_info?.investor_image) : ""
                                        name = val?.investor_info?.investor_name ?? ""
                                        date = val?.sent_at ? formatFullDateFromBigInt(val?.sent_at) : ""
                                        msg = val?.offer ?? ""
                                        offer_id = val?.offer_id ?? ""
                                        self_decln = val?.self_declined_at ? formatFullDateFromBigInt(val?.self_declined_at) : ""
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }

                        return (
                            <div className='p-4 border-2 bg-white rounded-lg mb-4' key={index}>
                                <div className='flex'>
                                    <div className='flex flex-col'>
                                        <div className='w-12 h-12'>
                                            <img src={img} alt="img" className='object-cover rounded-full h-full w-full' />
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        <div className="flex flex-col w-full pl-4 ">
                                            <div className='flex justify-between'>
                                                <p className='text-gray-500 font-bold'>{name}</p>
                                                <p className='text-gray-400 font-thin'>{date}</p>
                                            </div>
                                            <div className='min-h-4 line-clamp-3 text-gray-400'>
                                                <p>{msg}</p>
                                            </div>
                                            {(activeTab === 'approved' && resp_msg && resp_msg.trim() !== "" && accpt_date && accpt_date.trim() !== "") ?
                                                <>
                                                    <div className='flex justify-between pt-2'>
                                                        <p className='text-green-700'>{'RESPONSE'}</p>
                                                        <p className='text-gray-400 font-thin'>{accpt_date}</p>
                                                    </div>
                                                    <div className='min-h-4 line-clamp-3 text-gray-400'>
                                                        <p>{resp_msg}</p>
                                                    </div>
                                                </>
                                                : ""
                                            }
                                            {(activeTab === 'declined' && resp_msg && resp_msg.trim() !== "" && decln_date && decln_date.trim() !== "") ?
                                                <>
                                                    <div className='flex justify-between pt-2'>
                                                        <p className='text-red-700'>{'RESPONSE'}</p>
                                                        <p className='text-gray-400 font-thin'>{decln_date}</p>
                                                    </div>
                                                    <div className='min-h-4 line-clamp-3 text-gray-400'>
                                                        <p>{resp_msg}</p>
                                                    </div>
                                                </>
                                                : ""
                                            }
                                            {(activeTab === 'self-reject' && self_decln && self_decln.trim() !== "") ?
                                                <>
                                                    <div className='flex justify-between pt-2'>
                                                        <p className='text-blue-700 uppercase'>self reject</p>
                                                        <p className='text-gray-400 font-thin'>{self_decln}</p>
                                                    </div>
                                                </>
                                                : ''
                                            }
                                            <div className='flex justify-end pt-4'>
                                                <div className='flex gap-4'>
                                                    <div>
                                                        <button
                                                            onClick={() => navigate(viewMentorOrInvestorProfileHanlder(val))}
                                                            className='capitalize border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900'>
                                                            view profile
                                                        </button>
                                                    </div>
                                                    {activeTab !== 'pending' ? '' :
                                                        selectedStatus.startsWith('to-') ?
                                                            <div>
                                                                <button
                                                                    onClick={() => { selectedStatus.endsWith('mentor') ? handleMentorSelfReject(offer_id) : handleInvestorSelfReject(offer_id) }}
                                                                    className="capitalize border-2 font-semibold bg-blue-900 border-blue-900 text-white px-2 py-1 rounded-md  hover:text-blue-900 hover:bg-white">
                                                                    self decline
                                                                </button>
                                                            </div>
                                                            :
                                                            selectedStatus.endsWith('mentor') ?
                                                                <>
                                                                    <div>
                                                                        <button
                                                                            onClick={() => handleMentorDeclineModalOpenHandler(offer_id)}
                                                                            className='capitalize border-2 font-semibold bg-red-700 border-red-700 text-white px-2 py-1 rounded-md  hover:text-red-900 hover:bg-white'>
                                                                            reject
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <button
                                                                            onClick={() => handleMentorAcceptModalOpenHandler(offer_id)}
                                                                            className="capitalize border-2 font-semibold bg-blue-900 border-blue-900 text-white px-2 py-1 rounded-md  hover:text-blue-900 hover:bg-white">
                                                                            approve
                                                                        </button>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div>
                                                                        <button
                                                                            onClick={() => handleInvestorDeclineModalOpenHandler(offer_id)}
                                                                            className='capitalize border-2 font-semibold bg-red-700 border-red-700 text-white px-2 py-1 rounded-md  hover:text-red-900 hover:bg-white'>
                                                                            reject
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <button
                                                                            onClick={() => handleInvestorAcceptModalOpenHandler(offer_id)}
                                                                            className="capitalize border-2 font-semibold bg-blue-900 border-blue-900 text-white px-2 py-1 rounded-md  hover:text-blue-900 hover:bg-white">
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
                        <NoDataCard/>
                    </>
                }
            </div>

            {isAcceptMentorOfferModal && (
                <AcceptOfferModal
                    title={'Accept Offer'}
                    onClose={handleMentorAcceptModalCloseHandler}
                    onSubmitHandler={handleAcceptMentorOffer}
                />)}
            {isDeclineMentorOfferModal && (
                <DeclineOfferModal
                    title={'Decline Offer'}
                    onClose={handleMentorDeclineModalCloseHandler}
                    onSubmitHandler={handleDeclineMentorOffer}
                />)}

            {isAcceptInvestorOfferModal && (
                <AcceptOfferModal
                    title={'Accept Offer'}
                    onClose={handleInvestorAcceptModalCloseHandler}
                    onSubmitHandler={handleAcceptInvestorOffer}
                />)}
            {isDeclineInvestorOfferModal && (
                <DeclineOfferModal
                    title={'Decline Offer'}
                    onClose={handleInvestorDeclineModalCloseHandler}
                    onSubmitHandler={handleDeclineInvestorOffer}
                />)}
        </div >
    )
}

export default ProjectSideAssociation;
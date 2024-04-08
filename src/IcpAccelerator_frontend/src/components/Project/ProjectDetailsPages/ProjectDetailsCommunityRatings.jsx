import React, { useEffect, useState } from "react";
import { Star, colorStar } from '../../Utils/Data/SvgData';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import AddRatingModal from "../../../models/AddRatingModal";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import NoDataCard from "../../Mentors/Event/RatingNoDataCard";


const ProjectDetailsCommunityRatings = ({ data, isProjectLive, profile, type, name, role, socials, filter }) => {
    if (!data) {
        return null;
    }
    const actor = useSelector((currState) => currState.actors.actor)

    const [isRatingModalOpen, setRatingModalOpen] = useState(false);
    const [cardData, setCardData] = useState([]);
    const [alreadyRated, setAlreadyRated] = useState(null);
    const [overallRating, setOverallRating] = useState(0);
    const ratingPercentage = (overallRating / 5) * 100;
    const handleRatingCloseModal = () => setRatingModalOpen(false);
    const handleRatingOpenModal = () => setRatingModalOpen(true);
    const [noData, setNoData] = useState(null);
    const handleAddRating = async ({ rating, ratingDescription }) => {
        console.log('add job')
        if (actor) {
            let argument =
            {
                rating,
                message: ratingDescription,
                project_id: data?.uid,
            }


            await actor.add_project_rating(argument)
                .then((result) => {
                    console.log('result-in-add_project_rating', result)
                    if (result) {
                        handleRatingCloseModal();
                        toast.success('review added successfully')
                    } else {
                        handleRatingCloseModal();
                        toast.error('something got wrong')
                    }
                })
                .catch((error) => {
                    console.log('error-in-add_project_rating', error)
                    toast.error('something got wrong')
                    handleRatingCloseModal();
                })
        }
    }

    const fetchCommunityRating = async (val) => {
        await actor.get_project_ratings(val?.uid)
            .then((result) => {
                console.log('result-in-get_project_ratings', result)
                if (result && result.Err) {
                    setNoData(true)
                    setCardData([])
                    setAlreadyRated(false)
                    setOverallRating(0);
                } else {
                    setNoData(false)
                    setCardData(result.Ok[0])
                    setAlreadyRated(result.Ok[2]);
                    setOverallRating(result.Ok[1]);
                }
            })
            .catch((error) => {
                console.log('error-in-get_project_ratings', error)
                setNoData(true)
                setCardData([])
                setAlreadyRated(false)
                setOverallRating(0);
            })
    }

    console.log('cardData', cardData)
    console.log('overallRating', overallRating)
    console.log('alreadyRated', alreadyRated)

    useEffect(() => {
        if (actor) {
            fetchCommunityRating(data);
        }
    }, [actor]);


    return (
        <>

            {alreadyRated ? null :
                <div className="w-full flex justify-end mb-4">
                    {isProjectLive && (<button onClick={handleRatingOpenModal} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                        Add Community Rating
                    </button>)}
                </div>}
            {noData ? <NoDataCard /> :
                <div className="md1:flex sm:flex flex-wrap ">
                    {/* Overall circlular   part1 Cards  Start */}
                    <div className="flex w-full sm:w/1/2 md:w-1/3 justify-between">
                        <div className="w-full sm:w-full md:w-full p-4">
                            <div className="shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-blue-200 p-4 h-full">
                                <div className='flex flex-row justify-between flex-wrap'>
                                    <p className='text-lg text-black font-bold'>Overall Rating</p>
                                    {/* <p className='text-[#737373] text-sm flex items-center'>10 October, 2023</p> */}
                                </div>
                                <div className='flex flex-row gap-6 flex-wrap items-center'>
                                    <div>
                                        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                                            <defs>
                                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#FF6347" />
                                                    <stop offset="100%" stopColor="#32CD32" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <CircularProgressbar
                                            value={ratingPercentage}
                                            text={`${overallRating}/5`}
                                            className="w-20 h-20 font-extrabold text-md"
                                            strokeWidth={8}
                                            styles={buildStyles({
                                                strokeLinecap: "round",
                                                pathTransitionDuration: 0.5,
                                                pathColor: `#2247AF`,
                                                trailColor: "#d6d6d6",
                                                textColor: "#3505B2",
                                            })}
                                        />
                                    </div>
                                    <div className='flex flex-row justify-center items-center gap-2'>
                                        <div className="flex items-center hover:text-blue-800 w-16 h-16">
                                            {[...Array(5)].map((star, index) => {
                                                index += 1;
                                                return (
                                                    <button
                                                        key={index}
                                                        className={
                                                            index <= overallRating
                                                                ? "text-blue-800"
                                                                : "text-gray-300 dark:text-gray-500"
                                                        }
                                                    >
                                                        <svg
                                                            className="w-6 h-6 ms-2"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 22 20"
                                                        >
                                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                        </svg>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <p className='my-2 overflow-y-scroll text-[#737373]'>On basis of all Community ratings</p>
                            </div>
                        </div>
                    </div>
                    {/* Overall rating part1 Cards Ending */}

                    {cardData[0]?.map((val, index) => {
                        let bg_color = ((index % 2) == 0) ? 'bg-white' : 'bg-blue-200';
                        let name = val[1]?.name ?? ""
                        let image = val[1]?.profile_pic ? uint8ArrayToBase64(val[1]?.profile_pic) : ""
                        let rating = val[1]?.rating
                        let message = val[1]?.message
                        let tag = val[1]?.tag
                        let date = val[1]?.timestamp ? formatFullDateFromBigInt(val[1]?.timestamp) : ""
                        return (
                            <div className="flex flex-wrap justify-center sm:justify-between w-full sm:w/1/2 md:w-1/3" key={index}>
                                <div className="w-full p-4">
                                    <div className={`shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 p-4 ${bg_color}`}>
                                        <div className='flex flex-row justify-start sm:justify-start lg:justify-start flex-wrap gap-2 items-center'>
                                            <img className='h-14 object-cover w-14 rounded-full' src={image} alt='Img' />
                                            <div className='flex flex-col max-w-[120]'>
                                                <p className='text-black font-bold truncate'>{name}</p>
                                                <p className='text-[#737373] flex items-center truncate'>{date}</p>
                                            </div>
                                            <div className='flex flex-row justify-center items-center gap-2'>
                                                <div className="flex items-center hover:text-blue-800 sm:w-16 h-16">
                                                    {[...Array(5)].map((star, index) => {
                                                        index += 1;
                                                        return (
                                                            <button
                                                                key={index}
                                                                className={
                                                                    index <= rating
                                                                        ? "text-blue-800"
                                                                        : "text-gray-300 dark:text-gray-500"
                                                                }
                                                            >
                                                                <svg
                                                                    className="w-6 h-6 ms-2"
                                                                    aria-hidden="true"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 22 20"
                                                                >
                                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                                </svg>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col ml-0 sm:ml-0 lg:ml-12'>
                                            <p className='font-bold'>{`"${tag}"`}</p>
                                            <p className='h-20 my-2 overflow-y-scroll text-[#737373]'>{message}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                    })}
                </div>}
            {isRatingModalOpen && (
                <AddRatingModal
                    onRatingClose={handleRatingCloseModal}
                    onSubmitHandler={handleAddRating}
                />)}
            <Toaster />

        </>
    );
};

export default ProjectDetailsCommunityRatings;
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import awtar from "../../../assets/images/icons/_Avatar.png"
import { useSelector } from 'react-redux';


const JobDetails = ({ setOpen }) => {
    const actor = useSelector((currState) => currState.actors.actor);
    const [jobDetails, setJobDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            setIsLoading(true);
            try {
                const result = await actor.get_single_job(uid);
                console.log("Fetched job details:", result);
                setJobDetails(result);
            } catch (error) {
                console.error("Failed to fetch job details:", error);
                setError("Failed to load job details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (actor && uid) {
            fetchJobDetails();
        }
    }, [actor, uid]);

    return (
        <div className='w-full bg-fixed h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50'>
            <div className=' mx-auto w-[83%] absolute right-0 top-0 z-10 bg-white h-screen'>
                <div className=' p-5 mb-5'><CloseIcon sx={{ cursor: "pointer" }} onClick={() => setOpen(false)} /></div>
                <div className='container'>
                    <div className='flex justify-evenly px-[1%] '>
                        <div className="border h-fit rounded-lg w-[30%] ">
                            <div className='py-6 px-5 border rounded-t-lg bg-[#EEF2F6]'>
                                <div className='flex gap-2 items-center'>
                                    <span className=''><img src={awtar} alt='icon' /></span>
                                    <p className=''>Cypherpunk Labs</p>
                                </div>
                                <div className="">
                                    <h2 className='text-xl font-bold my-3'>
                                        Quality Assurance Engineer
                                    </h2>
                                </div>
                                <div className=''>
                                    <button className='border rounded-md bg-[#155EEF] py-2 w-full text-white text-center'>Apply <span className=' text-white'></span><ArrowOutwardIcon sx={{ marginTop: "-2px", fontSize: "medium" }} /></button>
                                </div>
                            </div>
                            <div className="p-3 ">
                                <div className='p-2'>
                                    <h3 className='text-gray-400 mb-2 text-sm'>DATE</h3>
                                    <h4 className='text-sm font-medium'>22 july,2024</h4>
                                </div>
                                <div className='p-2'>
                                    <h3 className='text-gray-400 mb-2 text-sm'>DEPARTMENT</h3>
                                    <h4 className='text-sm font-medium'>Porducts</h4>
                                </div>
                                <div className='p-2'>
                                    <h3 className='text-gray-400 mb-2 text-sm'>LOCATION</h3>
                                    <h4 className='text-sm font-medium'>Remote</h4>
                                </div>
                                <div className='p-2'>
                                    <h3 className='text-gray-400 mb-2 text-sm'>OCCUPATION</h3>
                                    <h4 className='text-sm font-medium'>Full-time</h4>
                                </div>
                                <div className='p-2'>
                                    <h3 className='text-gray-400 mb-2 text-sm'>SALARY</h3>
                                    <h4 className='text-sm font-medium'>$80k-100k</h4>
                                </div>
                            </div>
                        </div>
                        <div className="border rounded-lg p-3 w-[65%] overflow-y-auto h-[84vh] ">
                            <div className=''>
                                <div className=''>
                                    <p className=''>Sweatcoin is a London-based and well-funded scale-up with a team of 100+ and the mission to make the world more physically active. Our iOS and Android apps have more than 150M installs, 15M+ active users, more than 500 commercial partners and confirmed by the independent academic research ability to make our users up to 20% more active.
                                    </p>
                                    <p className=''> If you are interested in solving complex problems, then we are looking forward to seeing you be a part of our team!.
                                    </p>
                                </div>
                                <div className=' '>
                                    <h3 className='font-bold'>we are :</h3>
                                    <ul className='list-disc pl-[5%]'>
                                        <li className=''>
                                            A team of exceptional people who celebrate our community by being supportive and creative all the way. The head of data once was developing mind-reading helmet; a software developer has his certified psychological practice; QA-vet; QA-skipper; and a number of musicians that might allow us to start our own band. All together we're multiplying each other's talents which inspire us to develop a product we're all proud of.
                                        </li>
                                        <li className=''>
                                            A product that promotes health and fitness in more than 100 countries. Sweatcoin has proven to help people and create multiple inspiring stories like this one:https://blog.sweatco.in/one-sweatcoiners-journey-to-100000-steps/.
                                        </li>
                                        <li className=''>
                                            A startup that actually works. We are completely self-sufficient yet our investors are excited to provide us with even more resources to keep growing. We recently broke our record of 10M new users each week.
                                        </li>
                                    </ul>
                                </div>
                                <div className=''>
                                    <h3 className='font-bold'>What to expect:</h3>
                                    <ul className='list-disc pl-[5%]'>
                                        <li className=''>
                                            Working over product solutions along with designers, product managers, and developers throughout the entire development cycle in one / two product teams
                                        </li>
                                        <li className=''>
                                            Perform functional testing of applications
                                        </li>
                                        <li className=''>
                                            Perform feature design review
                                        </li>
                                        <li className=''>
                                            Analyze, detect and document bugs
                                        </li>
                                        <li className=''>
                                            Write checklists from scratch in Qase
                                        </li>
                                        <li className=''>
                                            Be a QA-ninja (we will tell you more in the interview)
                                        </li>
                                    </ul>
                                </div>
                                <div className=''>
                                    <h3 className='font-bold'>Requirements:</h3>
                                    <ul className='list-disc pl-[5%]'>
                                        <li className=''>Hands-on experience in mobile testing or strong theoretical knowledge;</li>
                                        <li className=''>Experience testing APIs and RESTful services (manual or automated)</li>
                                        <li className=''>Good understanding principles of of web, https, json, restful-services;</li>
                                        <li className=''>Skills for applying test-design theories into practice.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default JobDetails
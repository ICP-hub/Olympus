import React from 'react';
import girl from "../../../assets/images/girl.jpeg"

const MainCards = () => {

    const dataArray = [
        {
            img: girl,
            role: 'projects',
            title: 'Any web3 idea to a fully mature projects',
            desc: 'Leverage the benefits of a traditional accelerator-scale quickly, raise funds, attract talent and engage with mentor'
        },
        {
            img: girl,
            role: 'users',
            title: 'Anyone who wants to join web3',
            desc: 'Become an early adopter of the latest dApps. Provide feedback that helps to shape the final products'
        },
        {
            img: girl,
            role: 'mentors',
            title: 'Experts like accelerators, token listing, tokennomics, tech, custody, infra, marketing etc.',
            desc: 'Promote services to founders seeking guidance and support and establish expertise in the field'
        },
        {
            img: girl,
            role: 'investors',
            title: 'Any angel or well established VC fund',
            desc: 'Access globally vetted deals involving innovative Web3 projects and verified data to support decisions'
        }
    ]

    return (
        <>
            <div className='flex flex-row overflow-x-scroll w-full'>
                {dataArray && dataArray.map((val, index) => {
                    let img = val?.img ?? "";
                    let role = val?.role ?? "";
                    let title = val?.title ?? "";
                    let desc = val?.desc ?? "";
                    return (
                        <div className="w-1/4" key={index}>
                            <div className='bg-black rounded-lg'>
                                <div className="flex gap-2 items-start p-2">
                                    <img className='h-14 object-cover rounded-full w-14' src={img} alt="img" />
                                    <div className='flex flex-col text-white'>
                                        <p className='font-bold text-lg capitalize'>{role}</p>
                                        <p className='font-thin'>{title}</p>
                                    </div>
                                </div>
                                <div className='bg-gray-500 rounded-lg p-2'>
                                    <p className='p-2 text-black'>{desc}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
};

export default MainCards;
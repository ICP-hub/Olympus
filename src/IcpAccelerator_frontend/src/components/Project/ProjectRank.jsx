import React from 'react';

const ProjectRank = ({ dayRank, weekRank }) => {
    return (
        <div className="flex flex-col w-full pb-4 text-[#737373]">
            <div className="mt-2 flex flex-col">
                {dayRank && (<div className='flex justify-between p-2 text-lg border-b-2'>
                    <p className="font-bold capitalize">day rank</p>
                    <p className='font-semibold'>#1</p>
                </div>)}
                {weekRank && (<div className='flex justify-between p-2 text-lg border-b-2'>
                    <p className="font-bold capitalize">week rank</p>
                    <p className='font-semibold'>#6</p>
                </div>)}
            </div>
        </div>
    )
}

export default ProjectRank;
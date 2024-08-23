import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'; import XIcon from '@mui/icons-material/X';
const attendees = [
    {
        name: 'Matt Bowers',
        username: '@mattbowers',
        role: 'Founder & CEO',
        image: 'https://randomuser.me/api/portraits/men/32.jpg', // Example image URL
        social: {
            twitter: '#',
            linkedin: '#',
            facebook: '#'
        },
        badges: ['OLYMPIAN', 'FOUNDER']
    },
    {
        name: 'Tricia Renner',
        username: '@triciarenner',
        role: 'Co-founder, CTO',
        image: 'https://randomuser.me/api/portraits/women/44.jpg', // Example image URL
        social: {
            twitter: '#',
            linkedin: '#'
        },
        badges: ['OLYMPIAN']
    },
    {
        name: 'Billy Aufderhar',
        username: '@billyaufderhar',
        role: 'Marketing Lead',
        image: 'https://randomuser.me/api/portraits/men/68.jpg', // Example image URL
        social: {
            twitter: '#'
        },
        badges: ['OLYMPIAN', 'MENTOR']
    }
];

const AttendeesCard = ({ member }) => {
    return (
        <div className="flex gap-6 items-center p-4 bg-white shadow-sm rounded-lg  mb-4">
            <div className="">
                <div className="">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-[70px] h-[70px] rounded-full"
                    />
                </div>
                <div className="flex items-center mt-2 space-x-2">
                    {member.social.twitter && (
                        <a href={member.social.twitter} className="text-gray-500">
                            <XIcon sx={{ fontSize: "medium" }} />
                        </a>
                    )}
                    {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-gray-500">
                            <LinkedInIcon />
                        </a>
                    )}
                    {member.social.facebook && (
                        <a href={member.social.facebook} className="text-gray-500">
                            <FacebookRoundedIcon />
                        </a>
                    )}
                </div>
            </div>

            <div className="ml-4">
                <h4 className="text-base font-semibold">{member.name}</h4>
                <p className="text-gray-500 text-xs">{member.username}</p>
                <p className="text-gray-600 text-sm">{member.role}</p>

                <div className="mt-2 space-x-2">
                    {member.badges.map((badge, idx) => (
                        <span
                            key={idx}
                            className={`px-2 py-1 rounded-lg border text-xs font-normal ${badge === 'FOUNDER'
                                ? 'bg-purple-100 text-xs text-[#3538CD]'
                                : badge === 'MENTOR'
                                    ? 'bg-pink-100 text-xs text-pink-800'
                                    : 'bg-blue-100 text-xs text-blue-800'
                                }`}
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Attendees = () => {
    return (
        <div className="p-6 border border-gray-200 shadow-lg rounded-xl bg-white">
            <div className=" mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Attendees</h2>
                    <a href="#" className="text-sm font-medium text-blue-500">View all Attendees</a>
                </div>
                {attendees.map((member, idx) => (
                    <AttendeesCard key={idx} member={member} />
                ))}
            </div>
        </div>
    );
};

export default Attendees;

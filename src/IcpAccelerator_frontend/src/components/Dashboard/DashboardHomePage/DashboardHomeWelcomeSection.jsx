
import React, { useState } from 'react';
import KYCfileIcon from "../../../../assets/Logo/KYCfileIcon.png";
import DashboardHomeProfileCards from './DashboardHomeProfileCards';
import mentor from "../../../../assets/Logo/mentor.png";
import talent from "../../../../assets/Logo/talent.png";
import founder from "../../../../assets/Logo/founder.png";
import Avatar3 from "../../../../assets/Logo/Avatar3.png";
import { dashboard } from "../../jsondata/data/dashboardData";
import Modal1 from '../../Modals/Project Modal/modal1';
import { useSelector } from 'react-redux';
const styles = {
  circularChart: {
    display: 'block',
    margin: '10px auto',
    maxWidth: '80%',
    maxHeight: '250px',
  },
  circleBg: {
    fill: 'none',
    stroke: '#eee',
    strokeWidth: 4.5,
  },
  circle: {
    fill: 'none',
    strokeWidth: 4.5,
    strokeLinecap: 'round',
    animation: 'progress 1s ease-out forwards',
  },
  percentage: {
    fill: '#666',
    fontFamily: 'sans-serif',
    fontSize: '0.5em',
    textAnchor: 'middle',
  },
  '@keyframes progress': {
    '0%': {
      strokeDasharray: '0 100',
    },
  },
  imageGroup: {
    width: '20px',  // Adjust size as needed
    height: '20px', // Adjust size as needed
  },
};

function DashboardHomeWelcomeSection({ userName, profileCompletion }) {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const { dashboardwelcomesection } = dashboard
  const userFullData = useSelector((currState) => currState.userData.data.Ok);

  const actionCards = [
    {
      title: 'Complete profile',
      description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.',
      progress: profileCompletion,
      action: 'Complete profile',
    },
    {
      title: 'Explore platform',
      description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.',
      action: 'Discover',
      dismissable: true,
    },
    {
      title: 'Verify identity',
      description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.',
      action: 'Take KYC',
      icon: KYCfileIcon,
    },
    {
      title: 'Create new role',
      description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.',
      action: 'Create role',
      dismissable: true,
      imageGroup: true, // Adding a flag to indicate that this card should have the image group
    },
  ];
  const handleButtonClick = (action) => {
    if (action === 'Create role') {
      setRoleModalOpen(!roleModalOpen);
    }
  };
  return (
    <>
      <div className="bg-white rounded-lg p-6 mb-6 pt-1">
        <h1 className="text-3xl font-bold mb-6 mt-6">{dashboardwelcomesection.welcome}, {userFullData.full_name}!</h1>
        <div className="overflow-x-auto">
          <div className="flex gap-6 my-1">
            {actionCards.map((card, index) => (
              <div
                key={index}
                className="bg-[#F8FAFC] rounded-lg p-4 relative flex flex-col  md:w-[330px] w-[280px] h-[226px] flex-shrink-0 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow pr-4">
                    <h3 className="text-md text-[#121926] font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-[#4B5565] line-clamp-3 hover:line-clamp-6  ">{card.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {card.progress && (
                      <div className="w-20 h-16">
                        <svg viewBox="0 0 36 36" style={styles.circularChart}>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={styles.circleBg} />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            style={{
                              ...styles.circle,
                              stroke: "#4CAF50",
                              strokeDasharray: `${card.progress}, 100`,
                            }} />
                          <text x="18" y="20.35" className=" font-bold" style={styles.percentage}>
                            {card.progress}%
                          </text>
                        </svg>
                      </div>
                    )}
                    {card.icon && (
                      <img src={card.icon} alt="KYC Icon" className="w-14 h-14 object-contain" />
                    )}
                    {card.imageGroup && (
                      <div className='w-14 pt-2'>
                        <div className="relative  mx-auto w-[30px] h-[30px]  ">
                          <div className="absolute top-0 left-0 transform translate-x-1/4 -translate-y-1/4 ">
                            <img src={mentor} alt="Image 1" className="rounded-full  " />
                          </div>
                          <div className="absolute top-0 right-0 transform -translate-x-1/4 -translate-y-1/4">
                            <img src={founder} alt="Image 2" className="rounded-full " />
                          </div>
                          <div className="absolute bottom-0 left-0 transform translate-x-1/4 translate-y-1/4 ">
                            <img src={founder} alt="Image 3" className="rounded-full " />
                          </div>
                          <div className="bottom-0 right-0 transform -translate-x-1/4 translate-y-1/4">
                            <img src={talent} alt="Image 4" className="rounded-full " />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-auto pt-4 flex items-center space-x-2">
                  <button className="bg-white border-2 border-[#CDD5DF] text-[#364152] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors" onClick={() => handleButtonClick(card.action)}>
                    {card.action}
                  </button>
                  {card.dismissable && (
                    <button className="text-[#4B5565] hover:text-gray-600 text-sm">
                      {dashboardwelcomesection.dismiss}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DashboardHomeProfileCards />
      {roleModalOpen && <Modal1 isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} />}
    </>
  );
}

export default DashboardHomeWelcomeSection;

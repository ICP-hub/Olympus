import React from 'react';
import DashboardHomeProfileCards from './DashboardHomeProfileCards';

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
};

function DashboardHomeWelcomeSection({ userName, profileCompletion }) {
  const actionCards = [
    { 
      title: 'Complete profile', 
      description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.', 
      progress: profileCompletion, 
      action: 'Complete profile' 
    },
    { 
      title: 'Explore platform', 
      description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.', 
      action: 'Discover',
      dismissable: true
    },
    { 
      title: 'Verify identity', 
      description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.', 
      action: 'Take KYC',
      icon: 'KYC'
    },
    { 
      title: 'Create new role', 
      description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.', 
      action: 'Create role',
      dismissable: true
    },
  ];

  return (
    <>
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actionCards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 relative flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-grow pr-4">
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
              <div className="flex-shrink-0">
                {card.progress && (
                  <div className="w-16 h-16">
                    <svg viewBox="0 0 36 36" style={styles.circularChart}>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={styles.circleBg}/>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        style={{
                          ...styles.circle,
                          stroke: "#4CAF50",
                          strokeDasharray: `${card.progress}, 100`,}}/>
                      <text x="18" y="20.35" style={styles.percentage}>
                        {card.progress}%
                      </text>
                    </svg>
                  </div>
                )}
                {card.icon && (
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {card.icon}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-auto pt-4 flex items-center space-x-2">
              <button className="bg-white border-2 border-grey-50 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                {card.action}
              </button>
              {card.dismissable && (
                <button className="text-gray-400 hover:text-gray-600 text-sm">
                  Dismiss
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    <DashboardHomeProfileCards />
    </>
  );
}

export default DashboardHomeWelcomeSection;
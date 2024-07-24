import React from 'react';
import { AccountCircle, Star, Group } from '@mui/icons-material';

function DashboardHomeProfileCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Main profile card */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Main profile</h2>
          <button className="text-blue-500 font-semibold">Manage &gt;</button>
        </div>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden">
            <AccountCircle className="w-full h-full text-gray-400" />
          </div>
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-1">
              OLYMPIAN
            </span>
            <h3 className="text-lg font-semibold flex items-center">
              Matt Bowers
              <span className="text-blue-500 ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </span>
            </h3>
            <p className="text-gray-500">@mattbowers</p>
          </div>
        </div>
      </div>

      {/* Rating card */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Rating</h2>
          <button className="text-blue-500 font-semibold">View details &gt;</button>
        </div>
        <div className="flex flex-col items-center">
          <Star className="text-gray-300 w-12 h-12 mb-2" />
          <p className="text-gray-500 font-semibold">No ratings yet</p>
          <p className="text-gray-400 text-sm text-center mt-2">
            Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.
          </p>
        </div>
      </div>

      {/* Roles card */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Roles</h2>
          <button className="text-blue-500 font-semibold">Manage &gt;</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-2"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHomeProfileCards;
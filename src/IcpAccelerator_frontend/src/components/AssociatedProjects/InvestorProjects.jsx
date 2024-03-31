import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IcpAccelerator_backend } from '../../../../declarations/IcpAccelerator_backend/index';
import NoDataCard from '../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard';
import InvestorDashboard from '../Dashboard/RoleDashboard/InvestorDashboard';
import InvestedProjects from '../Dashboard/InvestedCards';

const InvestorProjects = () => {
  const principal = useSelector((currState) => currState.internet.principal);
  // const actor = useSelector((currState) => currState.actors.actor);
  let actor = IcpAccelerator_backend;
  const [data, setInvestorAssociatedData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Associated Projects");

  const fetchInvestorProjects = async () => {
    try {
      const investorAssociated = await actor.get_mock_project_info();
      console.log('Investor Projects: ', investorAssociated);
      setInvestorAssociatedData(investorAssociated);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    actor && fetchInvestorProjects();
  }, [actor]);

  return (
    <div className='md:mx-6 mx-0'>
    <div className=" p-6 lg:left-auto ml-6 bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold">
            {selectedOption}
          </div>
    <div className="flex flex-row space-x-4 overflow-x-auto">
      {data.length === 0 ? (
        <NoDataCard />
      ) : (
        data.map((data, index) => (
          <InvestedProjects data={data} key={index} />
        ))
      )}
    </div>
    </div>
  );
};

export default InvestorProjects;

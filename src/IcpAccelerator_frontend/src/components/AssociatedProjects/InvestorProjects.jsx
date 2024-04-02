import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoDataCard from '../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard';
import InvestedProjects from '../Dashboard/InvestedCards';
import { Principal } from "@dfinity/principal";
import { useNavigate } from 'react-router-dom';

const InvestorProjects = () => {
  const navigate = useNavigate();
  const principal = useSelector((currState) => currState.internet.principal);
  const actor = useSelector((currState) => currState.actors.actor);

  const [data, setData] = useState([]);

  const investorprojects = async () => {
    let investor_id = Principal.fromText(principal)
    try {
      const result = await actor.get_projects_associated_with_investor(investor_id);
      console.log('Investor Associated Projects: ', result);
      if (result && result.length > 0) {
        setData(result);
      } else {
        setData([]);
      }
    } catch(err) {
      setData([]);
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (actor && principal) {
      investorprojects()
    } else {
      navigate('/');
    }
  }, [actor, principal]);
  return (
    <div className='md:mx-6 mx-0'>
      <div className="flex flex-row space-x-4 overflow-x-auto">
        {data && data.length === 0 ? (
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

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoDataCard from '../../components/Mentors/Event/InvestorAssociatedNoDataCard';
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
      // console.log('Investor Associated Projects: ', result);
      if (result && result.length > 0) {
        setData(result);
      } else {
        setData([]);
      }
    } catch (err) {
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
    <>
      {data && data.length === 0 ? (
        <NoDataCard />
      ) : (
        data.map((data, index) => {
          return (
            <div key={index} className='w-full sm:w-1/2 lg:w-1/3 p-2'>
              <InvestedProjects data={data} />
            </div>
          )
        })
      )}
    </>
  );
};

export default InvestorProjects;

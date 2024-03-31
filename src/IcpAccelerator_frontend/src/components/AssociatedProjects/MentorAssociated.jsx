import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AssociatedProjects from '../Dashboard/MentorAssociatedCards'; 
import { IcpAccelerator_backend } from '../../../../declarations/IcpAccelerator_backend/index';
import NoDataCard from '../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard';

const MentorAssociated = () => {
  const principal = useSelector((currState) => currState.internet.principal);
  // const actor = useSelector((currState) => currState.actors.actor);
  let actor = IcpAccelerator_backend;
  const [data, setMentorAssociatedData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Associated Projects");
  
  const mentorprojects = async () => {
    try {
      const mentorassociated = await actor.get_mock_project_info();
      console.log('Mentor Associated Projects: ', mentorassociated);
      setMentorAssociatedData(mentorassociated); 
    } catch (err) {
      console.error('Error:', err);
    }
  };
  
  useEffect(() => {
    actor && mentorprojects();
  }, [actor]);

  return (
<div className='md:mx-6'>
    <div className=" p-6 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold">
            {selectedOption}
          </div>
   <div className="flex flex-row space-x-4 overflow-x-auto">

      
      {data.length === 0 ? (
        
        <NoDataCard />
      ):(
        data.map((project, index) => (
          <AssociatedProjects data={project} key={index} />
            ))
      )}
    
    </div>
    
    </div>
  );
};

export default MentorAssociated;

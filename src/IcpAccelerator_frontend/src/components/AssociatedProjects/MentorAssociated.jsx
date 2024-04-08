import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AssociatedProjects from '../Dashboard/MentorAssociatedCards';
import { useNavigate } from 'react-router-dom';
import NoDataCard from '../../components/Mentors/Event/MentorAssociatedNoDataCard';
import { Principal } from "@dfinity/principal";

const MentorAssociated = () => {
  const navigate = useNavigate();
  const principal = useSelector((currState) => currState.internet.principal);
  const actor = useSelector((currState) => currState.actors.actor);

  const [data, setData] = useState([]);

  const mentorprojects = async () => {
    let mentor_id = Principal.fromText(principal)
    try {
      const result = await actor.get_projects_associated_with_mentor(mentor_id);
      // console.log('Mentor Associated Projects: ', result);
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
      mentorprojects()
    } else {
      navigate('/');
    }
  }, [actor, principal]);

  return (
    <>
      {data && data.length === 0 ? (
        <NoDataCard />
      ) : (
        data.map((project, index) => {
          return (
            <div key={index} className='w-full lg:w-1/2 p-2'>
              <AssociatedProjects data={project} />
            </div>
          )
        })
      )}
    </>
  );
};

export default MentorAssociated;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AssociatedProjects from "../Dashboard/MentorAssociatedCards";
import { useNavigate } from "react-router-dom";
import NoDataCard from "../Mentors/Event/MentorAssociatedNoDataCard";
import { Principal } from "@dfinity/principal";
import AssociatedProjectSkeleton from "../Dashboard/Skeleton/Associatedprojectsskeleton";

const MentorAssociated = () => {
  const navigate = useNavigate();
  const principal = useSelector((currState) => currState.internet.principal);
  const actor = useSelector((currState) => currState.actors.actor);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [numSkeletons, setNumSkeletons] = useState(1);

  const updateNumSkeletons = () => {
    if (window.innerWidth >= 870) {
      setNumSkeletons(2);
    } else {
      setNumSkeletons(1);
    }
  };
  useEffect(() => {
    updateNumSkeletons();
    window.addEventListener("resize", updateNumSkeletons);
    return () => {
      window.removeEventListener("resize", updateNumSkeletons);
    };
  }, []);
  const mentorprojects = async () => {
    setIsLoading(true);
    let mentor_id = Principal.fromText(principal);
    try {
      const result = await actor.get_projects_associated_with_mentor(mentor_id);
      // console.log('Mentor Associated Projects: ', result);
      if (result && result.length > 0) {
        setData(result);
        setIsLoading(false);
      } else {
        setData([]);
        setIsLoading(false);
      }
    } catch (err) {
      setData([]);
      setIsLoading(false);
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    if (actor && principal) {
      mentorprojects();
    } else {
      navigate("/");
    }
  }, [actor, principal]);

  return (
    <>
      {isLoading ? (
        Array(numSkeletons)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="w-full lg:w-1/2 p-2">
              <AssociatedProjectSkeleton key={index} />
            </div>
          ))
      ) : data && data.length === 0 ? (
        <NoDataCard />
      ) : (
        data.map((project, index) => {
          return (
            <div key={index} className="w-full lg:w-1/2 p-2">
              <AssociatedProjects data={project} />
            </div>
          );
        })
      )}
    </>
  );
};

export default MentorAssociated;

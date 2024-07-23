import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NoDataCard from "../Mentors/Event/InvestorAssociatedNoDataCard";
import InvestedProjects from "../Dashboard/InvestedCards";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "react-router-dom";
import { InvestorAssociatedtSkeleton } from "../Dashboard/Skeleton/InvestorAssociatedskeleton";

const InvestorProjects = ({ numSkeletons }) => {
  const navigate = useNavigate();
  const principal = useSelector((currState) => currState.internet.principal);
  const actor = useSelector((currState) => currState.actors.actor);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  // const [numSkeletons, setNumSkeletons] = useState(1);

  // const updateNumSkeletons = () => {
  //   if (window.innerWidth >= 870) {
  //     setNumSkeletons(2);
  //   } else {
  //     setNumSkeletons(1);
  //   }
  // };
  // useEffect(() => {
  //   updateNumSkeletons();
  //   window.addEventListener("resize", updateNumSkeletons);
  //   return () => {
  //     window.removeEventListener("resize", updateNumSkeletons);
  //   };
  // }, []);

  const investorprojects = async () => {
    setIsLoading(true);
    let investor_id = Principal.fromText(principal);
    try {
      const result = await actor.get_projects_associated_with_investor(
        investor_id
      );
      // console.log('Investor Associated Projects: ', result);
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
      investorprojects();
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
            <div key={index} className="w-full md3:w-1/2 dxl:w-1/3 p-2">
              <InvestorAssociatedtSkeleton key={index} />
            </div>
          ))
      ) : data && data.length === 0 ? (
        <NoDataCard />
      ) : (
        data.map((data, index) => {
          return (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <InvestedProjects data={data} />
            </div>
          );
        })
      )}
    </>
  );
};

export default InvestorProjects;

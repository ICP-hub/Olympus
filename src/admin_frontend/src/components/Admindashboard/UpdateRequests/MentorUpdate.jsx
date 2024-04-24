import React from "react";
import { useLocation } from "react-router-dom";

const MentorUpdate = () => {

  const location = useLocation();
  const CurrentUserPrincipal = location.state;



  return (
    <div> mentor {CurrentUserPrincipal}</div>
  )
};

export default MentorUpdate;

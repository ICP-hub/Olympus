import React from "react";
import { useLocation } from "react-router-dom";

const InvestorUpdate = () => {

  const location = useLocation();
  const CurrentUserPrincipal = location.state;


  return <div>in investor {CurrentUserPrincipal}</div>;
};

export default InvestorUpdate;

import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ component: Component, allowedRoles }) => {
  const userRoles =['Project']
  console.log(allowedRoles)
  const isAuthorized = allowedRoles.some(role => userRoles.includes(role));

  return isAuthorized ? <Component /> : <Navigate to="/Error404" replace />;
};

export default RoleBasedRoute;

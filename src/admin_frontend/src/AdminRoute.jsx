import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

// import { userRoleHandler } from "./components/StateManagement/Redux/Reducers/userRoleReducer";
import Loader from "./components/Loader/Loader";
import RequestCheck from "./components/Request/RequestCheck";
import { useState } from "react";
// import ConfirmationModal from "./components/models/ConfirmationModal";

const Error404 = lazy(() => import("./components/Error404/Error404"));

const AdminDashboard = lazy(()=> import("./components/Admindashboard/AdminDashboard"))
const AdminGraph = lazy(()=> import("./components/Admindashboard/Admingraph"))
const ConfirmationModal = lazy(()=> import("./components/models/ConfirmationModal"))

const AdminRoute = () => {
  

    const actor = useSelector((currState) => currState.actors.actor);

//   const roleNames = isAuthenticated
//     ? allRoles.roles?.map((role) => role.name)
//     : [];

  // const publicRoutes=[
  //     { path: "/", element: <Home /> },
  //     // {path:"/" , element: <Hubdashboardlive /> },
  //     { path: "/details", element: <AllDetailsForm /> },
  //     { path: "/roleSelect", element: <RoleSelector /> },
  // ]

  const publicRoutes = [
    { path: "/", element: <AdminDashboard /> },
    { path: "/admin-dashboard", element: <AdminGraph/> },
    { path: "/notification", element: <RequestCheck /> },
    { path: "/modal", element: <ConfirmationModal/> },
 ];

  const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(userRoleHandler());
//   }, [actor, dispatch]);

//   useEffect(() => {
//     dispatch(rolesHandlerRequest());
//   }, [actor, dispatch]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* {protectedRoutes.map((route, index) => {
          const isAuthorized = route?.allowedRoles?.includes(specificRole);
          return (
            <Route
              key={index}
              path={route.path}
              element={isAuthorized ? <route.component /> : <Navigate to="/" />}
            />
          );
        })} */}
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoute;

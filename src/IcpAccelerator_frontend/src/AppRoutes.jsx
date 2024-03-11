import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { rolesHandlerRequest } from "./components/StateManagement/Redux/Reducers/RoleReducer";

import Hubdashboardlive from "./components/Hubdashboardlive/Hubdashboardlive";

import { userRoleHandler } from "./components/StateManagement/Redux/Reducers/userRoleReducer";
import Loader from "./components/Loader/Loader";
import NormalUser from "./components/RoleSelector/NormalUser";
import CreateProject from "./components/Project/CreateProject/CreateProject";

const DashBoard = lazy(() => import("./components/Dashboard/DashBoard"));
const AllDetailsForm = lazy(() =>
  import("./components/Registration/AllDetailsForm")
);
const ProjectDetails = lazy(() =>
  import("./components/Project/ProjectDetails")
);
const Home = lazy(() => import("./components/Home/Home"));
const UserProfile = lazy(() => import("./components/UserProfile/UserProfile"));
const RoleSelector = lazy(() =>
  import("./components/RoleSelector/RoleSelector")
);
const Error404 = lazy(() => import("./components/Error404/Error404"));

const AppRoutes = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const allRoles = useSelector((currState) => currState.role.roles);
  const specificRole = useSelector((state) => state.current.specificRole);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );

  const roleNames = isAuthenticated
    ? allRoles.roles?.map((role) => role.name)
    : [];

  // const publicRoutes=[
  //     { path: "/", element: <Home /> },
  //     // {path:"/" , element: <Hubdashboardlive /> },
  //     { path: "/details", element: <AllDetailsForm /> },
  //     { path: "/roleSelect", element: <RoleSelector /> },
  // ]

  const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/createUser", element: <NormalUser /> },
    { path: "/create-project", element: <CreateProject /> },
    { path: "/details", element: <AllDetailsForm /> },
    { path: "/roleSelect", element: <RoleSelector /> },
    { path: "/dashboard", element: <DashBoard /> },
  ];

  const protectedRoutes = [
    // { path: "/dashboard", component: DashBoard, allowedRoles: roleNames },
    {
      path: "/project-details",
      component: ProjectDetails,
      allowedRoles: roleNames,
    },
    { path: "/profile", component: UserProfile, allowedRoles: roleNames },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userRoleHandler());
  }, [actor, dispatch]);

  useEffect(() => {
    dispatch(rolesHandlerRequest());
  }, [actor, dispatch]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {protectedRoutes.map((route, index) => {
          const isAuthorized = route?.allowedRoles?.includes(specificRole);
          return (
            <Route
              key={index}
              path={route.path}
              element={isAuthorized ? <route.component /> : <Navigate to="/" />}
            />
          );
        })}
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

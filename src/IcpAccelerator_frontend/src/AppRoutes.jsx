import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route,Navigate } from "react-router-dom";
// import RoleBasedRoute from "./RoleBasedRoute";
// import routes from "./components/Utils/Data/Route";
import { rolesHandlerRequest } from "./components/StateManagement/Redux/Reducers/RoleReducer";
import { userRoleHandler } from "./components/StateManagement/Redux/Reducers/userRoleReducer"
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
  // const allRoles = useSelector((currState)=> currState.role.roles)
  const  specificRole = useSelector((state) => state.current.specificRole);
   const isAuthenticated = useSelector((currState)=> currState.internet.isAuthenticated)

  // console.log(allRoles, "<<<<==== allRoles")

  const roleNames =isAuthenticated === true ? allRoles.roles?.map(role => role.name):[]

  const publicRoutes=[
    { path: "/", element: <Home /> },
      { path: "/details", element: <AllDetailsForm /> },
      { path: "/roleSelect", element: <RoleSelector /> },
  ]
  
    const protectedRoutes = [
      { path: "/dashboard", component: DashBoard, allowedRoles: roleNames},
      {  path: "/project-details", component: ProjectDetails, allowedRoles:roleNames,},
      { path: "/profile",component: UserProfile, allowedRoles:roleNames,},
      { path: "/Error404", component: Error404, allowedRoles: [""] },
    ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userRoleHandler());
  }, [actor, dispatch]);
  useEffect(() => {
    dispatch(rolesHandlerRequest());
  }, [actor, dispatch]);


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
      {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        {protectedRoutes.map((route, index) => {
         const isAuthorized = route.allowedRoles.includes(specificRole);
          return (
            <Route
              key={index}
              path={route.path}
              element={
                isAuthorized ? (
                  <route.component />
                ) : (
                  <Navigate to="/Error404" replace />
                )
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;

import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { rolesHandlerRequest } from "./components/StateManagement/Redux/Reducers/RoleReducer";

import Hubdashboardlive from "./components/Hubdashboardlive/Hubdashboardlive";

import { userRoleHandler } from "./components/StateManagement/Redux/Reducers/userRoleReducer";
import Loader from "./components/Loader/Loader";
import NormalUser from "./components/RoleSelector/NormalUser";
import CreateProject from "./components/Project/CreateProject/CreateProject";
import InvestorRegistration from "./components/Registration/InvestorRegistration/InvestorRegistration";
import MentorRegistration from "./components/Registration/MentorRegistration/MentorRegistration";
import ProjectDetailsForUser from "./components/Project/ProjectDetails/ProjectDetailsForUser";
import Newcards from "./components/Project/ProjectDetails/Newcards";
import MentorsProfile from "./components/Mentors/MentorsProfile";
import InvestorProfile from "./components/Dashboard/Investor/InvestorProfile";
import ProjectDashboard from "./components/Dashboard/RoleDashboard/ProjectDashboard";
import MentorDashboard from "./components/Dashboard/RoleDashboard/MentorDashboard";
import InvestorDashboard from "./components/Dashboard/RoleDashboard/InvestorDashboard";
import { useNavigate } from 'react-router-dom';
import SearchMentors from "./components/Mentors/SearchMentors";
import EventForm from "./components/Mentors/Event/EventForm";
import MoreProjectLaunchPage from "./components/Dashboard/MoreLaunchPages/MoreProjectLaunchPage";
import MoreCurrentlyRaisingProjects from "./components/Dashboard/MoreLaunchPages/MoreCurrentlyRaisingProjects";
import ViewInvestor from "./components/Dashboard/MoreLaunchPages/ViewInvestors";
import Breadcrumbs from "./components/Layout/Breadcrumbs/BreadCrumbs";
import ProjectAssociation from "./components/Association/ProjectAssociation";
import ProjectDetailsForOwnerProject from "./components/Project/ProjectDetailsPages/ProjectDetailsForOwnerProject";

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    // { path: "/", element: <DashBoard /> },
    // { path: "/", element: <ProjectDashboard /> },
    // { path: "/", element: <MentorDashboard /> },
    // { path: "/", element: <InvestorDashboard /> },
    { path: "/", element: <ProjectDetailsForOwnerProject /> },
    { path: "/association", element: <ProjectAssociation /> },
    { path: "/create-user", element: <NormalUser /> },
    { path: "/create-project", element: <CreateProject /> },
    { path: "/create-investor", element: <InvestorRegistration /> },
    { path: "/event-form", element: <EventForm /> },
    // { path: "/details", element: <AllDetailsForm /> ,label:'Home'},
    { path: "/project-details", element: <ProjectDetails /> },
    { path: "/profile", element: <UserProfile /> },
    { path: "/create-mentor", element: <MentorRegistration /> },
    { path: "/individual-project-details-user/:id", element: <ProjectDetailsForUser /> },
    { path: "/view-mentor-details/:id", element: <MentorsProfile /> },
    { path: "/view-investor-details/:id", element: <InvestorProfile /> },
    { path: "/view-mentors", element: <SearchMentors /> },
    { path: "/launch-projects", element: <MoreProjectLaunchPage /> },
    { path: "/raising-projects", element: <MoreCurrentlyRaisingProjects /> },
    { path: "/view-investor", element: <ViewInvestor /> },

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

  return (<>
    <Breadcrumbs publicRoutes={publicRoutes} />
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
  </>
  );
};

export default AppRoutes;

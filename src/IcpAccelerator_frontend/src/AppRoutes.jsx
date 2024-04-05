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
import ProjectSideAssociation from "./components/Association/ProjectSideAssociation";
import MentorSideAssociation from "./components/Association/MentorSideAssociation";
import SearchMentorsByProjectId from "./components/Mentors/SearchMentorsByProjectId";
import InvestorSideAssociation from "./components/Association/InvestorSideAssociation";
import ViewInvestorByProjectId from "./components/Dashboard/MoreLaunchPages/ViewInvestorByProjectId";
import ProjectDetailsForMentorProject from "./components/Project/ProjectDetailsPages/ProjectDetailsForMentorProject";
import RequestsPrivateDocument from "./components/Project/ProjectDetailsPages/RequestsPrivateDocument";
import ProjectDetailsForMentor from "./components/Project/ProjectDetailsPages/ProjectDetailsForMentor";
import ProjectDetailsForInvestor from "./components/Project/ProjectDetailsPages/ProjectDetailsForInvestor";
import ProjectDetailsForUserRole from "./components/Project/ProjectDetailsPages/ProjectDetailsForUserRole";
import MoreLiveProjects from "./components/Dashboard/MoreLivePages/MoreLiveProjects";
import LiveEventsCards from "./components/Dashboard/LiveEventsCards";

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
    { path: "/", element: <DashBoard /> },
    
    // { path: "/", element: <MentorRegistration /> },
    // { path: "/", element: <CreateProject /> },
    // { path: "/", element: <NormalUser /> },
    // { path: "/", element: <InvestorRegistration /> },
    // { path: "/", element: <ProjectDashboard /> },
    // { path: "/", element: <MentorDashboard /> },
    // { path: "/", element: <InvestorDashboard /> },
    // { path: "/", element: <ProjectDetailsForOwnerProject /> },
    // { path: "/individual-project-details-project-mentor/:id", element: <ProjectDetailsForMentorProject /> },
    // { path: "/individual-project-details-user/:id", element: <ProjectDetailsForUser /> },
    { path: "/individual-project-details-user/:id", element: <ProjectDetailsForUserRole /> },
    { path: "/individual-project-details-project-owner", element: <ProjectDetailsForOwnerProject /> },
    { path: "/individual-project-details-project-mentor/:id", element: <ProjectDetailsForMentor /> },
    { path: "/individual-project-details-project-investor/:id", element: <ProjectDetailsForInvestor /> },
    { path: "/association", element: <ProjectAssociation /> },
    { path: "/create-user", element: <NormalUser /> },
    { path: "/create-project", element: <CreateProject /> },
    { path: "/create-investor", element: <InvestorRegistration /> },
    { path: "/event-form", element: <EventForm /> },
    { path: "/update-project", element: <CreateProject /> },
    // { path: "/details", element: <AllDetailsForm /> ,label:'Home'},
    { path: "/project-details", element: <ProjectDetails /> },
    { path: "/profile", element: <UserProfile /> },
    { path: "/create-mentor", element: <MentorRegistration /> },
    { path: "/view-mentor-details/:id", element: <MentorsProfile /> },
    { path: "/view-investor-details/:id", element: <InvestorProfile /> },
    { path: "/view-mentors", element: <SearchMentors /> },
    { path: "/view-mentors/:id", element: <SearchMentorsByProjectId /> },
    { path: "/launch-projects", element: <MoreProjectLaunchPage /> },
    { path: "/live-projects", element: <MoreLiveProjects /> },
    { path: "/raising-projects", element: <MoreCurrentlyRaisingProjects /> },
    { path: "/view-investor", element: <ViewInvestor /> },
    { path: "/view-investor/:id", element: <ViewInvestorByProjectId /> },
    { path: "/project-association-requests", element: <ProjectSideAssociation /> },
    { path: "/mentor-association-requests", element: <MentorSideAssociation /> },
    { path: "/investor-association-requests", element: <InvestorSideAssociation /> },
    { path: "/project-private-document-requests", element: <RequestsPrivateDocument /> },
    { path: "/all-live-events", element: <LiveEventsCards /> },
   
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

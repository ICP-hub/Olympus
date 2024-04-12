import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import NormalUser from "./components/RoleSelector/NormalUser";
import CreateProject from "./components/Project/CreateProject/CreateProject";
import InvestorRegistration from "./components/Registration/InvestorRegistration/InvestorRegistration";
import MentorRegistration from "./components/Registration/MentorRegistration/MentorRegistration";
import MentorsProfile from "./components/Mentors/MentorsProfile";
import InvestorProfile from "./components/Dashboard/Investor/InvestorProfile";
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
import RequestsPrivateDocument from "./components/Project/ProjectDetailsPages/RequestsPrivateDocument";
import ProjectDetailsForMentor from "./components/Project/ProjectDetailsPages/ProjectDetailsForMentor";
import ProjectDetailsForInvestor from "./components/Project/ProjectDetailsPages/ProjectDetailsForInvestor";
import ProjectDetailsForUserRole from "./components/Project/ProjectDetailsPages/ProjectDetailsForUserRole";
import MoreLiveProjects from "./components/Dashboard/MoreLivePages/MoreLiveProjects";
import LiveEventsCards from "./components/Dashboard/LiveEventsCards";
import UserRegForm from "./components/RegForms.jsx/UserRegForm";
import MentorRegForm from "./components/RegForms.jsx/MentorRegForm";
import InvestorRegForm from "./components/RegForms.jsx/InvestorRegForm";
import ProjectRegForm from "./components/RegForms.jsx/ProjectRegForm";

const DashBoard = lazy(() => import("./components/Dashboard/DashBoard"));
const ProjectDetails = lazy(() => import("./components/Project/ProjectDetails"));
const UserProfile = lazy(() => import("./components/UserProfile/UserProfile"));
const Error404 = lazy(() => import("./components/Error404/Error404"));

const AppRoutes = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const allRoles = useSelector((currState) => currState.role.roles);
  const specificRole = useSelector((state) => state.current.specificRole);
  const isAuthenticated = useSelector((currState) => currState.internet.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const publicRoutes = [
    { path: "/", element: <DashBoard /> },
    { path: "/individual-project-details-user/:id", element: <ProjectDetailsForUserRole /> },
    { path: "/individual-project-details-project-owner", element: <ProjectDetailsForOwnerProject /> },
    { path: "/individual-project-details-project-mentor/:id", element: <ProjectDetailsForMentor /> },
    { path: "/individual-project-details-project-investor/:id", element: <ProjectDetailsForInvestor /> },
    { path: "/association", element: <ProjectAssociation /> },
    { path: "/create-user", element: <UserRegForm /> },
    // { path: "/create-user", element: <NormalUser /> },
    { path: "/create-user", element: <UserRegForm /> },
    { path: "/create-project", element: <ProjectRegForm /> },
    // { path: "/create-investor", element: <InvestorRegistration /> },
    { path: "/create-investor", element: <InvestorRegForm /> },
    { path: "/event-form", element: <EventForm /> },
    { path: "/update-project", element: <ProjectRegForm /> },
    { path: "/project-details", element: <ProjectDetails /> },
    { path: "/profile", element: <UserProfile /> },
    // { path: "/create-mentor", element: <MentorRegistration /> },
    { path: "/create-mentor", element: <MentorRegForm /> },
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


  return (<>
    <Breadcrumbs publicRoutes={publicRoutes} />
    <Suspense fallback={<Loader />}>
      <Routes>
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

import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
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
import ProjectDetailsForMentor from "./components/Project/ProjectDetailsPages/ProjectDetailsForMentorProject";
import ProjectDetailsForInvestor from "./components/Project/ProjectDetailsPages/ProjectDetailsForInvestorProject";
import ProjectDetailsForUserRole from "./components/Project/ProjectDetailsPages/ProjectDetailsForUserRole";
import MoreLiveProjects from "./components/Dashboard/MoreLivePages/MoreLiveProjects";
import LiveEventsCards from "./components/Mentors/Event/LiveEventsCards";
import UserRegForm from "./components/RegForms.jsx/UserRegForm";
import MentorRegForm from "./components/RegForms.jsx/MentorRegForm";
import InvestorRegForm from "./components/RegForms.jsx/InvestorRegForm";
import ProjectRegForm from "./components/RegForms.jsx/ProjectRegForm";
import RequestMoneyRaising from "./components/Project/ProjectDetailsPages/RequestMoneyRaising";
import Home from "./components/Home/Home";
import EventRegistration from "./components/Mentors/Event/EventRegistration";
import CohortPage from "./components/Mentors/Event/CohortPage";
import EventMentorProfile from "./components/Mentors/Event/EventMentorProfile";
import LiveEventViewAll from "./components/Mentors/Event/LiveEventViewAll";
import EventProjectDetail from "./components/Mentors/Event/EventProjectDetail";

const DashBoard = lazy(() => import("./components/Dashboard/DashBoard"));
const ProjectDetails = lazy(() =>
  import("./components/Project/ProjectDetails")
);
const UserProfile = lazy(() => import("./components/UserProfile/UserProfile"));
const Error404 = lazy(() => import("./components/Error404/Error404"));

const AppRoutes = () => {
  const publicRoutes = [
    { path: "/", element: <DashBoard /> },
    {
      path: "/individual-project-details-user/:id",
      element: <ProjectDetailsForUserRole />,
    },
    {
      path: "/individual-project-details-project-owner",
      element: <ProjectDetailsForOwnerProject />,
    },
    {
      path: "/individual-project-details-project-mentor/:id",
      element: <ProjectDetailsForMentor />,
    },
    {
      path: "/individual-project-details-project-investor/:id",
      element: <ProjectDetailsForInvestor />,
    },
    { path: "/association", element: <ProjectAssociation /> },
    { path: "/event-register-request", element: <EventRegistration /> },
    { path: "/event-page", element: <CohortPage /> },
    { path: "/cohort-project-detail/:id", element: <EventProjectDetail /> },
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
    { path: "/view-mentor-details", element: <EventMentorProfile /> },
    { path: "/view-mentor-details/:id", element: <MentorsProfile /> },
    { path: "/view-investor-details/:id", element: <InvestorProfile /> },
    { path: "/view-mentors", element: <SearchMentors /> },
    { path: "/view-mentors/:id", element: <SearchMentorsByProjectId /> },
    { path: "/launch-projects", element: <MoreProjectLaunchPage /> },
    { path: "/live-projects", element: <MoreLiveProjects /> },
    { path: "/raising-projects", element: <MoreCurrentlyRaisingProjects /> },
    { path: "/view-investor", element: <ViewInvestor /> },
    { path: "/view-investor/:id", element: <ViewInvestorByProjectId /> },
    {
      path: "/project-association-requests",
      element: <ProjectSideAssociation />,
    },
    {
      path: "/mentor-association-requests",
      element: <MentorSideAssociation />,
    },
    {
      path: "/investor-association-requests",
      element: <InvestorSideAssociation />,
    },
    {
      path: "/project-private-document-requests",
      element: <RequestsPrivateDocument />,
    },
    {
      path: "/project-money-raising-requests/:id",
      element: <RequestMoneyRaising />,
    },
    { path: "/all-live-events", element: <LiveEventViewAll /> },
    { path: "/event-details/:id", element: <CohortPage /> },
  ];

  return (
    <>
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

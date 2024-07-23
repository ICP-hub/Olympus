import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Loader from "./component/Loader/Loader";
import MentorsProfile from "./component/Mentors/MentorsProfile";
import InvestorProfile from "./component/Dashboard/Investor/InvestorProfile";
import SearchMentors from "./component/Mentors/SearchMentors";
import EventForm from "./component/Mentors/Event/EventForm";
import MoreProjectLaunchPage from "./component/Dashboard/MoreLaunchPages/MoreProjectLaunchPage";
import MoreCurrentlyRaisingProjects from "./component/Dashboard/MoreLaunchPages/MoreCurrentlyRaisingProjects";
import ViewInvestor from "./component/Dashboard/MoreLaunchPages/ViewInvestors";
import Breadcrumbs from "./component/Layout/Breadcrumbs/BreadCrumbs";
import ProjectAssociation from "./component/Association/ProjectAssociation";
import ProjectDetailsForOwnerProject from "./component/Project/ProjectDetailsPages/ProjectDetailsForOwnerProject";
import ProjectSideAssociation from "./component/Association/ProjectSideAssociation";
import MentorSideAssociation from "./component/Association/MentorSideAssociation";
import SearchMentorsByProjectId from "./component/Mentors/SearchMentorsByProjectId";
import InvestorSideAssociation from "./component/Association/InvestorSideAssociation";
import ViewInvestorByProjectId from "./component/Dashboard/MoreLaunchPages/ViewInvestorByProjectId";
import RequestsPrivateDocument from "./component/Project/ProjectDetailsPages/RequestsPrivateDocument";
import ProjectDetailsForMentor from "./component/Project/ProjectDetailsPages/ProjectDetailsForMentorProject";
import ProjectDetailsForInvestor from "./component/Project/ProjectDetailsPages/ProjectDetailsForInvestorProject";
import ProjectDetailsForUserRole from "./component/Project/ProjectDetailsPages/ProjectDetailsForUserRole";
import MoreLiveProjects from "./component/Dashboard/MoreLivePages/MoreLiveProjects";
import UserRegForm from "./component/RegForms.jsx/UserRegForm";
import MentorRegForm from "./component/RegForms.jsx/MentorRegForm";
import InvestorRegForm from "./component/RegForms.jsx/InvestorRegForm";
import ProjectRegForm from "./component/RegForms.jsx/ProjectRegForm";
import RequestMoneyRaising from "./component/Project/ProjectDetailsPages/RequestMoneyRaising";
import Home from "./component/Home/Home";
import EventRegistration from "./component/Mentors/Event/EventRegistration";
import CohortPage from "./component/Mentors/Event/CohortPage";
import EventMentorProfile from "./component/Mentors/Event/EventMentorProfile";
import LiveEventViewAll from "./component/Mentors/Event/LiveEventViewAll";
import EventProjectDetail from "./component/Mentors/Event/EventProjectDetail";
import LiveEventsViewAllUpcoming from "./component/Mentors/Event/LiveEventsViewAllUpcoming";
import UserDetailPage from "./component/UserProfile/UserDetailPage";
import EventProjectViewMore from "./component/Mentors/Event/EventProjectViewMore";
import NewHome from "./components/Home/Home";

const DashBoard = lazy(() => import("./component/Dashboard/DashBoard"));
// const ProjectDetails = lazy(() =>
//   import("./components/Project/ProjectDetails")
// );
const UserProfile = lazy(() => import("./component/UserProfile/UserProfile"));
const Error404 = lazy(() => import("./component/Error404/Error404"));

const AppRoutes = () => {
  const publicRoutes = [
    { path: "/", element: <NewHome /> },
    // {
    //   path: "/individual-project-details-user/:id",
    //   element: <ProjectDetailsForUserRole />,
    // },
    // {
    //   path: "/individual-project-details-project-owner",
    //   element: <ProjectDetailsForOwnerProject />,
    // },
    // {
    //   path: "/individual-project-details-project-mentor/:id",
    //   element: <ProjectDetailsForMentor />,
    // },
    // {
    //   path: "/individual-project-details-project-investor/:id",
    //   element: <ProjectDetailsForInvestor />,
    // },
    // { path: "/association", element: <ProjectAssociation /> },
    // { path: "/cohort-register-request", element: <EventRegistration /> },
    // { path: "/cohort-details-page", element: <CohortPage /> },
    // { path: "/cohort-project-detail/:id", element: <EventProjectDetail /> },
    // { path: "/create-user", element: <UserRegForm /> },
    // { path: "/create-project", element: <ProjectRegForm /> },
    // // { path: "/create-investor", element: <InvestorRegistration /> },
    // { path: "/create-investor", element: <InvestorRegForm /> },
    // { path: "/cohort-form", element: <EventForm /> },
    // { path: "/update-project", element: <ProjectRegForm /> },
    // // { path: "/project-details", element: <ProjectDetails /> },
    // { path: "/profile", element: <UserProfile /> },
    // // { path: "/create-mentor", element: <MentorRegistration /> },
    // { path: "/create-mentor", element: <MentorRegForm /> },
    // { path: "/view-mentor-details", element: <EventMentorProfile /> },
    // { path: "/view-user-details", element: <UserDetailPage /> },
    // { path: "/view-mentor-details/:id", element: <MentorsProfile /> },
    // { path: "/view-investor-details/:id", element: <InvestorProfile /> },
    // { path: "/view-mentors", element: <SearchMentors /> },
    // { path: "/view-mentors/:id", element: <SearchMentorsByProjectId /> },
    // { path: "/launch-projects", element: <MoreProjectLaunchPage /> },
    // { path: "/live-projects", element: <MoreLiveProjects /> },
    // { path: "/raising-projects", element: <MoreCurrentlyRaisingProjects /> },
    // { path: "/view-investor", element: <ViewInvestor /> },
    // { path: "/view-investor/:id", element: <ViewInvestorByProjectId /> },
    // {
    //   path: "/project-association-requests",
    //   element: <ProjectSideAssociation />,
    // },
    // {
    //   path: "/mentor-association-requests",
    //   element: <MentorSideAssociation />,
    // },
    // {
    //   path: "/investor-association-requests",
    //   element: <InvestorSideAssociation />,
    // },
    // {
    //   path: "/project-private-document-requests",
    //   element: <RequestsPrivateDocument />,
    // },
    // {
    //   path: "/project-money-raising-requests/:id",
    //   element: <RequestMoneyRaising />,
    // },
    // { path: "/all-live-ongoing-cohort", element: <LiveEventViewAll /> },
    // {
    //   path: "/all-live-upcoming-cohort",
    //   element: <LiveEventsViewAllUpcoming />,
    // },

    // { path: "/cohort-details/:id", element: <CohortPage /> },
    // { path: "/cohort-applied-projects", element: <EventProjectViewMore /> },
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

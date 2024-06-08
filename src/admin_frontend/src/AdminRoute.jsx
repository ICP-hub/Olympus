import React, { lazy, Suspense, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import UpdateMentorProfile from "./components/Admindashboard/UpdateRequests/UpdateMentorProfile";
import UpdateInvestorProfile from "./components/Admindashboard/UpdateRequests/UpdateInvestorProfile";
import UserProfileProjectUpdate from "./components/UserProfileUpdate/UserProfileProjectUpdate";
import UserProfileMentorUpdate from "./components/UserProfileUpdate/UserProfileMentorUpdate";
import UserProfileInvestorUpdate from "./components/UserProfileUpdate/UserProfileInvestorUpdate";
import DeleteCohort from "./components/Request/CohortDeleteAndRemove/DeleteCohort";
import DeleteFromCohort from "./components/Request/CohortDeleteAndRemove/DeleteFromCohort";

const Adminalluser = lazy(() =>
  import("./components/Admindashboard/Adminalluser")
);
const Projectdetails = lazy(() =>
  import("./components/Admindashboard/Projectdetails")
);
const Error404 = lazy(() => import("./components/Error404/Error404"));
const AcceptModal = lazy(() => import("./components/models/AcceptModal"));
const RejectModal = lazy(() => import("./components/models/RejectModal"));
const RequestCheck = lazy(() => import("./components/Request/RequestCheck"));
const RequestCohort = lazy(() => import("./components/Request/RequestCohort"));
const AdminHome = lazy(() => import("./components/Admindashboard/AdminHome"));
const AdminDashboard = lazy(() =>
  import("./components/Admindashboard/AdminDashboard")
);

const UserAllProfile = lazy(() =>
  import("./components/Admindashboard/Profile/UserAllProfile")
);
// const AllProject = lazy(() => import("./components/Admindashboard/AllProject"));
const LiveIncubated = lazy(() =>
  import("./components/Admindashboard/LiveIncubated")
);
const UpdateAllRequest = lazy(() =>
  import("./components/Admindashboard/UpdateRequests/UpdateAllRequest")
);
const MentorUpdate = lazy(() =>
  import("./components/Admindashboard/UpdateRequests/MentorUpdate")
);
const ProjectUpdate = lazy(() =>
  import("./components/Admindashboard/UpdateRequests/ProjectUpdate")
);
const UserUpdate = lazy(() =>
  import("./components/Admindashboard/UpdateRequests/UserUpdate")
);
const InvestorUpdate = lazy(() =>
  import("./components/Admindashboard/UpdateRequests/InvestorUpdate")
);

const AdminRoute = ({ setModalOpen }) => {
  // const actor = useSelector((currState) => currState.actors.actor);

  const publicRoutes = [
    { path: "/", element: <AdminHome setModalOpen={setModalOpen} /> },
    {
      path: "/dashboard",
      element: <AdminDashboard setModalOpen={setModalOpen} />,
    },
    { path: "/request", element: <RequestCheck /> },
    { path: "/alluser", element: <Adminalluser /> },
    { path: "/reject", element: <RejectModal /> },
    { path: "/accept", element: <AcceptModal /> },
    { path: "/project_details", element: <Projectdetails /> },
    { path: "/cohortRequest", element: <RequestCohort /> },
    { path: "/cohortDelete", element: <DeleteCohort /> },
    { path: "/cohortRemove", element: <DeleteFromCohort /> },
    { path: "/all", element: <UserAllProfile /> },
    { path: "/live", element: <LiveIncubated /> },
    { path: "/allUpdateRequest", element: <UpdateAllRequest /> },
    { path: "/projectupdate", element: <ProjectUpdate /> },
    { path: "/userupdate", element: <UserUpdate /> },
    { path: "/mentorupdate", element: <UpdateMentorProfile /> },
    { path: "/investorupdate", element: <UpdateInvestorProfile /> },
    {
      path: "/userProfileProjectUpdate",
      element: <UserProfileProjectUpdate />,
    },
    { path: "/userProfileMentorUpdate", element: <UserProfileMentorUpdate /> },
    {
      path: "/userProfileInvestorUpdate",
      element: <UserProfileInvestorUpdate />,
    },
  ];

  // const dispatch = useDispatch();

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoute;

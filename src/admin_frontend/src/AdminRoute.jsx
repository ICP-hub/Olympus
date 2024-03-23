import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import Projectprofile from "./components/Admindashboard/Profile/Projectprofile";

const Error404 = lazy(() => import("./components/Error404/Error404"));
const AcceptModal = lazy(()=> import ("./components/models/AcceptModal"))
const RejectModal = lazy(()=> import ("./components/models/RejectModal"))
const RequestCheck = lazy(()=> import ("./components/Request/RequestCheck"))
const AdminHome = lazy(() => import("./components/Admindashboard/AdminHome"));
const AdminDashboard = lazy(() =>
  import("./components/Admindashboard/AdminDashboard")
);
const ConfirmationModal = lazy(() =>
  import("./components/models/ConfirmationModal")
);

const AdminRoute = ({ setModalOpen }) => {
  // const actor = useSelector((currState) => currState.actors.actor);

  const publicRoutes = [
    { path: "/", element: <AdminHome setModalOpen={setModalOpen} /> },
    { path: "/dashboard", element: <AdminDashboard setModalOpen={setModalOpen}/> },
    { path: "/request", element: <RequestCheck /> },
    { path: "/modal", element: <ConfirmationModal /> },
    { path: "/reject", element: <RejectModal /> },
    { path: "/accept", element: <AcceptModal /> },
    { path: "/profile", element: <Projectprofile /> },

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

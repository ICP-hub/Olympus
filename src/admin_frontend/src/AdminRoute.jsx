import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import RequestCheck from "./components/Request/RequestCheck";

const Error404 = lazy(() => import("./components/Error404/Error404"));

const AdminDashboard = lazy(()=> import("./components/Admindashboard/AdminDashboard"))
const AdminGraph = lazy(()=> import("./components/Admindashboard/Admingraph"))
const ConfirmationModal = lazy(()=> import("./components/models/ConfirmationModal"))

const AdminRoute = () => {
  

    // const actor = useSelector((currState) => currState.actors.actor);


  const publicRoutes = [
    { path: "/", element: <AdminDashboard /> },
    { path: "/graph", element: <AdminGraph/> },
    { path: "/request", element: <RequestCheck /> },
    { path: "/modal", element: <ConfirmationModal/> },
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

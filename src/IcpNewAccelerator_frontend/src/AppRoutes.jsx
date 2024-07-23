import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import Breadcrumbs from "./components/Layout/Breadcrumbs/BreadCrumbs";
import ProjectDetailsForUserRole from "./components/Project/ProjectDetailsPages/ProjectDetailsForUserRole";
import Home from "./components/Home/Home";


const DashBoard = lazy(() => import("./components/Dashboard/DashBoard"));
// const ProjectDetails = lazy(() =>
//   import("./components/Project/ProjectDetails")
// );
const UserProfile = lazy(() => import("./components/UserProfile/UserProfile"));
const Error404 = lazy(() => import("./components/Error404/Error404"));

const AppRoutes = () => {
  const publicRoutes = [
    { path: "/", element: <Home /> },
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

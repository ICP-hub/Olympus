import React, { lazy, Suspense, } from "react";
import { Routes, Route, } from "react-router-dom";

import Loader from "./component/Loader/Loader";
import Breadcrumbs from "./components/Layout/Breadcrumbs/BreadCrumbs";
import Home from "./components/Home/Home";
import MainLayout from "./components/Layout/MainLayout";
import { useAuth } from "./components/StateManagement/useContext/useAuth";
import toast, { Toaster } from "react-hot-toast";
// import DashboardHomePage from "./components/Dashboard/DashboardHomePage/DashboardHomePage";
const DashboardHomePage = lazy(() => import("./components/Dashboard/DashboardHomePage/DashboardHomePage"));
const UserProfile = lazy(() => import("./component/UserProfile/UserProfile"));
const Error404 = lazy(() => import("./component/Error404/Error404"));

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const renderCommonRoutes = () => (
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </>
  );
  const authenticatedRoutes = [
    { path: "register-user", element: <DashboardHomePage /> },
    { path: "dashboard/*", element: <DashboardHomePage /> },
   
  ];
  return (
    <>
      {/* <Breadcrumbs authenticatedRoutes={authenticatedRoutes} /> */}
      <div>
        <Suspense fallback={<Loader />}>
          <Routes>
            {renderCommonRoutes()}
            {isAuthenticated &&
              authenticatedRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </>
  );
};

export default AppRoutes;

import React, { lazy, Suspense, } from "react";
import { Routes, Route, } from "react-router-dom";
import Home from "./components/Home/Home";
import MainLayout from "./components/Layout/MainLayout";
import { useAuth } from "./components/StateManagement/useContext/useAuth";
import Loader from "./components/Loader/Loader";
const DashboardHomePage = lazy(() => import("./components/Dashboard/DashboardHomePage/DashboardHomePage"));
const Error404 = lazy(() => import("./components/Error404/Error404"));
const UserRegistration = lazy(() => import("./components/UserRegistration/UserRegistration"));
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const renderCommonRoutes = () => (
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<Error404 />} />
       
      </Route>
      <Route path="register-user" element={<UserRegistration />} />
    </>
  );
  const authenticatedRoutes = [
    { path: "dashboard/*", element: <DashboardHomePage /> },
  ];
  return (
        <Suspense fallback={<Loader />}>
          <Routes>
            {renderCommonRoutes()}
            {isAuthenticated &&
              authenticatedRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
          </Routes>
        </Suspense>
  );
};

export default AppRoutes;

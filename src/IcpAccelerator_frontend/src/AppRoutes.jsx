import React, { lazy, Suspense, } from "react";
import { Routes, Route, } from "react-router-dom";
import Breadcrumbs from "./components/Layout/Breadcrumbs/BreadCrumbs";
import Home from "./components/Home/Home";
import MainLayout from "./components/Layout/MainLayout";
import { useAuth } from "./components/StateManagement/useContext/useAuth";
import toast, { Toaster } from "react-hot-toast";
import UserRegistration from "./components/UserRegistration/UserRegistration";
import Loader from "./components/Loader/Loader";
// import DashboardHomePage from "./components/Dashboard/DashboardHomePage/DashboardHomePage";
const DashboardHomePage = lazy(() => import("./components/Dashboard/DashboardHomePage/DashboardHomePage"));
const Error404 = lazy(() => import("./components/Error404/Error404"));

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
    // { path: "register-user", element: <UserRegistration /> },
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

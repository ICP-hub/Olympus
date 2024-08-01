import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Loader from "./component/Loader/Loader";
import Home from "./components/Home/Home";
import MainLayout from "./components/Layout/MainLayout";
import { useAuth } from "./component/StateManagement/useContext/useAuth";
import DashboardHomePage from "./components/Dashboard/DashboardHomePage/DashboardHomePage";



import Signupmain from "./components/Auth/Signup1";
import Signupmain2 from "./components/UserRegistration/Signup2";
import Signupmain1 from "./components/UserRegistration/SignupMain";
import ProfileForm from "./components/UserRegistration/Signup4";
import MentorSignupMain from "./components/Modals/Mentor-Signup-Model/MentorsignUpmain";



const DashBoard = lazy(() => import("./component/Dashboard/DashBoard"));
// const Home = lazy(() =>
//   import("./components/Home/Home")
// );
const UserProfile = lazy(() => import("./component/UserProfile/UserProfile"));
const Error404 = lazy(() => import("./component/Error404/Error404"));

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  // const isAuthenticated = true;

  // useEffect(() => {}, [isAuthenticated]);
  const renderCommonRoutes = () => (
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<Error404 />} />
      </Route>
      <Route path="sign-up" element={<Signupmain1 />} />
    </>
  );
  const authenticatedRoutes = [
    { path: "dashboard/*", element: <DashboardHomePage /> },
    { path: "sign-up-step1", element: <Signupmain /> },
    { path: "sign-up-step2", element: <Signupmain2 /> },
    { path: "sign-up-step3-complete-profile", element: <ProfileForm /> },
    { path: "mentor-signup", element: <MentorSignupMain /> },
  ];
  return (
    <>
      {/* <Breadcrumbs publicRoutes={publicRoutes} /> */}
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
        {/* <ToastContainer /> */}
      </div>
    </>
  );
};

export default AppRoutes;

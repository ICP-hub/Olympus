import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Loader from "./component/Loader/Loader";
import Breadcrumbs from "./component/Layout/Breadcrumbs/BreadCrumbs";
import Home from "./components/Home/Home";
import MainLayout from "./components/Layout/MainLayout";
import { useAuth } from "./component/StateManagement/useContext/useAuth";
import Terms from "./components/Home/Terms";
import DashboardHomePage from "./components/Dashboard/DashboardHomePage/DashboardHomePage";



import Signupmain from "./components/Auth/Signup1";
import Signupmain2 from "./components/UserRegistration/RegisterForm2";
import Signupmain1 from "./components/UserRegistration/SignupMain";

import ProfileForm from "./components/UserRegistration/RegisterForm3";
import RegisterForm1 from "./components/UserRegistration/RegisterForm1";
import UserRegistration from "./components/UserRegistration/UserRegistration";
import MentorSignupMain from "./components/Modals/Mentor-Signup-Model/MentorsignUpmain";
import ProjectRegisterMain from "./components/Modals/ProjectRegisterModal/ProjectRegisterMain";




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
      <Route path="register-user" element={<UserRegistration />} />

      {/* <Route path="sign-up-step1" element={<Signupmain />} />
        <Route path="sign-up-step2" element={<Signupmain2 />} />
        <Route path="sign-up-step3-complete-profile" element={<ProfileForm />} />  */}
    </>
  );
  const authenticatedRoutes = [
    { path: "dashboard/*", element: <DashboardHomePage /> },
    // { path: "mentor-sign-up", element: <MentorSignupMain /> },


    // { path: "sign-up-step2", element: <Signupmain2 /> },
    // { path: "sign-up-step3-complete-profile", element: <ProfileForm /> },
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

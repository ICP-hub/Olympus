import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import { useAuth } from './components/StateManagement/useContext/useAuthentication';
import TermsOfUse from './components/Footer/TermOfUse';
import CookiePolicy from './components/Footer/CookiePolicy';
import PrivacyPolicy from './components/Footer/PrivacyPolicy';
const Home = lazy(() => import('./components/Home/Home'));
const MainLayout = lazy(() => import('./components/Layout/MainLayout'));
const DashboardHomePage = lazy(
  () => import('./components/Dashboard/DashboardHomePage/DashboardHomePage')
);
const Error404 = lazy(() => import('./components/Error404/Error404'));
const UserRegistration = lazy(
  () => import('./components/UserRegistration/UserRegistration')
);
// const TermsOfUse = lazy(() => import('../src/components/Footer/TermOfUse'));
// const CookiePolicy = lazy(() => import('../src/components/Footer/CookiePolicy'));
// const PrivacyPolicy = lazy(() => import('../src/components/Footer/PrivacyPolicy'));
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const renderCommonRoutes = () => (
    <>
      <Route path='/' element={<MainLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='terms-of-use' element={<TermsOfUse />} />
        <Route path='cookie-policy' element={<CookiePolicy />} />
        <Route path='privacy-policy' element={<PrivacyPolicy />} />
        <Route path='*' element={<Error404 />} />
      </Route>
      <Route path='register-user' element={<UserRegistration />} />
    </>
  );
  const authenticatedRoutes = [
    { path: 'dashboard/*', element: <DashboardHomePage /> },
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

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import { useAuth } from './components/StateManagement/useContext/useAuth';
const Home = lazy(() => import('./components/Home/Home'));
const MainLayout = lazy(() => import('./components/Layout/MainLayout'));
const DashboardHomePage = lazy(
  () => import('./components/Dashboard/DashboardHomePage/DashboardHomePage')
);
const Error404 = lazy(() => import('./components/Error404/Error404'));
const UserRegistration = lazy(
  () => import('./components/UserRegistration/UserRegistration')
);
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const renderCommonRoutes = () => (
    <>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Home />} />
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

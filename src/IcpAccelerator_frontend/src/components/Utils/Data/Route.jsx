import React, { lazy, Suspense } from 'react';

const DashBoard = lazy(() => import("../../Dashboard/DashBoard"));
const AllDetailsForm = lazy(() => import("../../Registration/AllDetailsForm"));
const ProjectDetails = lazy(() => import("../../Project/ProjectDetails"));
const Home = lazy(() => import("../../Home/Home"));
const UserProfile = lazy(() => import("../../UserProfile/UserProfile"));
const RoleSelector = lazy(() => import("../../RoleSelector/RoleSelector"));
const Error404=lazy(()=> import("../../Error404/Error404"))

const routes = [
    { path: '/dashboard', component: DashBoard, allowedRoles: ['Admin', 'Project'] },
    // { path: '/progress', component: ProgressCard, allowedRoles: ['Admin', 'User'] },
    { path: '/details', component: AllDetailsForm, allowedRoles: ['Admin', 'Project'] },
    { path: '/project-details', component: ProjectDetails, allowedRoles: ['Admin', 'Project'] },
    { path: '/Home', component: Home, allowedRoles: ['Admin', 'Project'] },
    { path: '/user-profile', component: UserProfile, allowedRoles: ['Admin', 'Project'] },
    { path: '/', component: RoleSelector, allowedRoles: ['Admin', 'Project'] },
    { path: '/Error404', component:Error404 , allowedRoles: [''] }

];

  export default routes;
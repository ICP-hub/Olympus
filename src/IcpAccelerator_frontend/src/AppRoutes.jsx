import React, { lazy, Suspense ,useEffect} from "react";
import { useSelector ,useDispatch} from "react-redux";
import { Routes,Route } from 'react-router-dom';
import RoleBasedRoute from "./RoleBasedRoute";
// import routes from "./components/Utils/Data/Route";
import { rolesHandlerRequest } from "./components/Redux/Reducers/RoleReducer";

const DashBoard = lazy(() => import("./components/Dashboard/DashBoard"));
const AllDetailsForm = lazy(() => import("./components/Registration/AllDetailsForm"));
const ProjectDetails = lazy(() => import("./components/Project/ProjectDetails"));
const Home = lazy(() => import("./components/Home/Home"));
const UserProfile = lazy(() => import("./components/UserProfile/UserProfile"));
const RoleSelector = lazy(() => import("./components/RoleSelector/RoleSelector"));
const Error404 = lazy(() => import("./components/Error404/Error404"));



const AppRoutes = () => {

  const actor = useSelector((currState) => currState.actors.actor);
  // const allRoles = useSelector((currState)=> currState.role.roles)
  // const isAuthenticated = useSelector((currState)=> currState.internet.isAuthenticated)
  
  // console.log(allRoles, "<<<<==== allRoles")

  // if(isAuthenticated){
  //    const roleNames = allRoles.roles?.map(role => role.name)
  //    console.log('roleNames', roleNames)
  // }


  const routes = [
  { path: "/dashboard", component: DashBoard,  allowedRoles: ["Admin", "Project"],},
  // { path: '/progress', component: ProgressCard, allowedRoles: ['Admin', 'User'] },
  { path: "/details",  component: AllDetailsForm, allowedRoles: [ "Admin", "Project", "Mentor/Expert", "Hub Organizer","Venture",],},
  { path: "/project-details", component: ProjectDetails, allowedRoles: ["Admin", "Project"], },
  {  path: "/",  component: Home,  allowedRoles: [ "Admin", "Project", "Mentor/Expert", "Hub Organizer", "Venture",],},
  {  path: "/user-profile",  component: UserProfile, allowedRoles: ["Admin", "Project"],},
  {  path: "/roleSelect", component: RoleSelector, allowedRoles: ["Admin", "Project"], },
  { path: "/Error404", component: Error404, allowedRoles: [""] },
];


const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rolesHandlerRequest());
  }, [actor,dispatch]);


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes> 
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <RoleBasedRoute
                component={route.component}
                allowedRoles={route.allowedRoles}
              />
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
};
 export default AppRoutes
import React, { Suspense ,useEffect} from "react";
import { useSelector ,useDispatch} from "react-redux";
import { Routes,Route } from 'react-router-dom';
import RoleBasedRoute from "./RoleBasedRoute";
import routes from "./components/Utils/Data/Route";
import { rolesHandlerRequest } from "./components/Redux/Reducers/RoleReducer";


const AppRoutes = () => {

  const actor = useSelector((currState) => currState.actors.actor);
  const userRoles = useSelector((state) => state.role.roles)

   console.log(userRoles)
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
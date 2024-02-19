// AppRoutes.js
import React, { Suspense ,useEffect} from "react";
import { useSelector ,useDispatch} from "react-redux";
import { Routes,Route } from 'react-router-dom';
import RoleBasedRoute from "./RoleBasedRoute";
import routes from "./components/Utils/Data/Route";
import { rolesHandlerRequest } from "./components/Redux/Reducers/RoleReducer";

// Add other lazy imports as needed

const AppRoutes = () => {
  const userRoles = useSelector((state) => state.role.roles || [])
   console.log(userRoles)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rolesHandlerRequest());
  }, [dispatch]);


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes> {/* Updated component */}
        {routes.map((route, index) => (
          // In react-router-dom v6, you need to adjust how you define routes with components.
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
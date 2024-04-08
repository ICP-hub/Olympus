import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { removeActor } from "../../StateManagement/Redux/Reducers/actorBindReducer";
import { useDispatch } from "react-redux";
import { useAuth } from "../../StateManagement/useContext/useAuth";
const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const isHexId = (segment) => {
    return /^[0-9a-fA-F]{64}$/.test(segment);
  };
  const isCustomId = (segment) => {
    return /^([a-z0-9]{5}-){10}[a-z0-9]{5}$/.test(segment);
  };
  const isSpecificCustomId = (segment) => {
    return /^[a-z0-9]{5}(?:-[a-z0-9]{5}){10}$/i.test(segment);
  };
  const getLabelForPathSegment = (segment) => {
    if (isHexId(segment) || isCustomId(segment) || isSpecificCustomId(segment)){
      return 'Detail';
    }
    return segment.replace(/-/g, " ").replace(/_/g, " ");
  };
  const breadcrumbs = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
  
    return pathSegments.map((segment, index) => {
      const isId = segment.length === 64 ? isHexId(segment) : 
      isCustomId(segment) || isSpecificCustomId(segment);
  
      if (isId) {
        return null;
      }
      const pathToPart = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = getLabelForPathSegment(segment);
      return { label, path: pathToPart };
    }).filter(crumb => crumb); 
  }, [pathname]);
 
  if (pathname === '/') {
    return null; 
  }

  const handleNavigate = () => {
    if (window.location.pathname.includes('/create-user')) {
      logout()
      dispatch(removeActor())
    }
    navigate('/');
  }
  return (
    <div className="container mx-auto font-fontUse">
    <nav className="flex px-10 py-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center" onClick={() => handleNavigate()}>
          <a
            // href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-800 dark:text-gray-400 cursor-pointer"
          >
            <svg
              className="w-3 h-3 me-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            Home
          </a>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <li>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                {(index === breadcrumbs.length - 1 )  ? (
                  <span className={`ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400 ${
                    crumb.path.includes("/view-mentor-details") || crumb.path.includes("/view-investor-details") ? 'hidden' : ''
                  }`}>{crumb.label == "View mentor details"}
                    {crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)}
                  </span>
                ) : 
                (index === breadcrumbs.length - 1 ) ? "" :
                (
                  <a
                    href={crumb.path}
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 hover:text-blue-800"
                  >
                    {crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)}
                  </a>
                )}
              </div>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
    </div>
  );
};

export default Breadcrumbs;

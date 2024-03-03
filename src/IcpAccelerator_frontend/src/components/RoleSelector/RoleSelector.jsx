import React, { useState, useMemo, useEffect } from "react";
import astro1 from "../../../assets/images/astro1.png";
import Footer from "../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { rolesHandlerRequest } from "../StateManagement/Redux/Reducers/RoleReducer";
import { useNavigate } from "react-router-dom";
import { changeHasSelectedRoleHandler } from "../StateManagement/Redux/Reducers/userRoleReducer";

const RoleSelector = React.memo(() => {
  const actor = useSelector((currState) => currState.actors.actor);
  const rolesArr = useSelector((state) => state.role.roles);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(rolesHandlerRequest());
  }, [actor, dispatch]);

  const [selectedRole, setSelectedRole] = useState({
    id: rolesArr.length > 0 ? rolesArr[0].id : 0,
    name: rolesArr.length > 0 ? rolesArr[0].name : "",
  });

  useEffect(() => {
    if (rolesArr.length > 0) {
      setSelectedRole({ id: rolesArr[0].id, name: rolesArr[0].name });
    }
  }, [rolesArr]);

  const handlePlanChange = (roleId, roleName) => {
    setSelectedRole({ id: roleId, name: roleName });
    //  console.log('before roleName+id send',roleId, roleName)
    dispatch(changeHasSelectedRoleHandler(true));
    navigate("/details", { state: { roleId: roleId, roleName: roleName } });
    // console.log('after roleName send',roleId, roleName)
  };
  const [translate, setTranslate] = useState("translate-y-0");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTranslate((prevTranslate) =>
        prevTranslate === "translate-y-2" ? "translate-y-5" : "translate-y-2"
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div>
      <section className="bg-gray-100 font-fontUse">
        <div className="flex justify-center py-16">
          <div className=" bg-indigo-300 rounded-xl flex flex-row border-8 border-blue-100 w-2/3 h-fit">
            <div className="flex-col flex relative">
              <div className="p-12 z-20 relative">
                <h1 className="text-white font-bold pt-6 text-[14.5px] sm:text-[18px] md:text-[20.8px] lg:text-[23px] xl:text-[25.5px] 2xl:text-[26px]">
                  Select your role
                </h1>

                <h2 className="mt-4 text-white mb-6 text-[13px] sm:text-[13.5px] md:text-[16.3px] lg:text-[18.5px] xl:text-[21px] 2xl:text-[21.5px] overflow-hidden line-clamp-3">
                  World’s 1st fully On-chain, Decentralised, Permissionless,
                  Transparent and Non-Competitive Incubator cum Accelerator
                </h2>

                <div className="flex justify-between flex-wrap items-center">
                  {rolesArr.roles?.map((plan) => (
                    <label
                      key={plan.id}
                      className="relative flex bg-of p-4 shadow- cursor-pointer my-2 w-auto hover:bg-indigo-500 hover:bg-opacity-20 hover:rounded-lg"
                      onClick={() => handlePlanChange(plan.id, plan.name)}
                    >
                      <div className="group flex justify-between w-full items-center">
                        <span className="font-bold text-white leading-tight uppercase">
                          {plan.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className="hidden group-hover:flex items-center justify-center border-2 border-white bg-transparent rounded-full ml-4"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 8 7"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="m-1"
                          >
                            <path
                              d="M1.33337 4.50016C1.33337 4.50016 2.40004 5.10851 2.93337 6.00016C2.93337 6.00016 4.53337 2.50016 6.66671 1.3335"
                              stroke="white"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 bg-gradient-to-r from-purple-400/40 to-purple-600/40 ellipse-quarter-role rounded-md lg:w-64 lg:h-80 md:w-56 md:h-72 sm:w-48 sm:h-64 w-40 h-56"></div>
            </div>
            <div className="relative flex justify-center items-center lg:-top-20 md:-top-16 sm:-top-12 -top-10 left-0">
              <img
                src={astro1}
                alt="Astronaut"
                className={`z-20 lg:w-[500px] md:w-[450px] sm:w-[350px] xxs:w-[300px] xxs:-top-[170px] w-[250px] relative top-4 lg:top-16 md:-top-16  sm:-top-36 sm:left-12 left-8 md:h-[300px] transition-transform duration-1000 ease-in-out transform ${translate}`}
              />
              <div className="absolute top-1 left-[15%] w-[150px] h-[150px] sm:top-2 sm:left-[15%] md:top-3 md:left-[10%] lg:top-4 lg:left-[15%] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xxs:w-[150px] xxs:h-[150px] xxs:-left-0 rounded-full bg-gradient-to-r from-purple-300/40 to-purple-600"></div>
              <div className="absolute top-[80px] left-[55%] w-[60px] h-[60px] sm:top-[170px] sm:left-[110%] md:top-[180px] md:left-[65%] lg:top-[220px] lg:left-[90%] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] rounded-full bg-gradient-to-r from-purple-900 to-blue-500 opacity-30"></div>
              <div className="absolute top-[50px] left-[40%] w-[100px] h-[110px] sm:top-[120px] sm:left-[80%] md:top-[130px] md:left-[80%] lg:top-[160px] lg:left-[70%] sm:w-[100px] sm:h-[120px] md:w-[130px] md:h-[150px] lg:w-[160px] lg:h-[180px] bg-gradient-to-b from-white/30 to-transparent rounded-lg backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default RoleSelector;

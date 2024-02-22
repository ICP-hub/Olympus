import React, { useState, useMemo, useEffect } from "react";
import astro1 from "../../../assets/images/astro1.png";
import Footer from "../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { rolesHandlerRequest } from "../Redux/Reducers/RoleReducer";
import { useNavigate } from "react-router-dom";

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
    navigate("/details", { state: { roleId: roleId, roleName: roleName } });
  };

  return (
    <div>
      <section className="body-font bg-violet-800 font-fontUse">
        <div className="w-full h-[500px]">
          <div className="flex justify-center">
            <div className=" bg-white rounded-xl z-4 absolute flex flex-row p-4 m-16">
              <div className="w-3/4 p-4">
                <h1 className="text-textColor font-bold pt-6 text-sxxs:text-[11.5px] sxs:text-[12px] sxs1:text-[12.5px sxs2:text-[13px] sxs3:text-[13.5px] ss:text-[14px] ss1:text-[14.5px] ss2:text-[15px] ss3:text-[15.5px] ss4:text-[16px] dxs:text-[16.5px] xxs:text-[17px] xxs1:text-[17.5px] sm1:text-[18px] sm4:text-[18.5px] sm2:text-[19px] sm3:text-[19.5px] sm:text-[20px] md:text-[20.8px] md1:text-[21.5px] md2:text-[22px] md3:text-[22.5px] lg:text-[23px] dlg:text-[23.5px] lg1:text-[24px] lgx:text-[24.5px] dxl:text-[25px] xl:text-[25.5px] xl2:text-[26px]">
                  Select your role
                </h1>

                <h2 className="mt-4 text-gray-500 mb-6 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[15px] sm:text-[15.5px] md:text-[16px.3] md1:text-[17px] md2:text-[17.5px] md3:text-[18px] lg:text-[18.5px] dlg:text-[19px] lg1:text-[15.5px] lgx:text-[20px] dxl:text-[20.5px] xl:text-[21px] xl2:text-[21.5px] overflow-hidden line-clamp-2">
                  World’s 1st fully On-chain, Decentralised, Permissionless,
                  Transparent and Non-Competitive Incubator cum Accelerator
                </h2>
                <div className="flex justify-between flex-wrap">
                  {rolesArr.roles?.map((plan) => (
                    <label
                      key={plan.id}
                      className={`relative flex bg-of p-4 rounded-lg shadow- cursor-pointer my-2 w-auto ${
                        selectedRole.id === plan.id
                          ? "border-2 border-blue-500 bg-gradient-to-r from-slate-300 to-violet-300 bg-opacity-20 rounded-lg"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between w-full">
                        <span className="font-semibold text-textColor leading-tight uppercase">
                          {plan.name}
                        </span>
                        {selectedRole.id === plan.id && (
                          <span
                            aria-hidden="true"
                            className="flex items-center justify-center border-2 border-blue-500 bg-gradient-to-r from-slate-300 to-violet-300 bg-opacity-20 rounded-full ml-4"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5 text-blue-700"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="plan"
                        id={`plan-${plan.id}`}
                        value={plan.id}
                        className="absolute h-0 w-0 appearance-none"
                        checked={selectedRole.id === plan.id}
                        onChange={() => handlePlanChange(plan.id, plan.name)}
                        readOnly
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="w-1/4">
                <div className="flex justify-center">
                  <img src={astro1} alt="astro1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
});

export default RoleSelector;

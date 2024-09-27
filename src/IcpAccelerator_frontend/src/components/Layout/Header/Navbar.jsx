import React, { useState } from "react";
import DiscoverMenu from "../../Modals/DiscoverMenu";
import CompanyMenu from "../../Modals/CompanyMenu";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { homepagedata } from "../../Utils/jsondata/data/homepageData";
import logo from "../../../../assets/images/navlogo.png"
import logo1 from "../../../../assets/Logo/newLogo.png";

const Navbar = ({ setModalOpen }) => {
  const { navbar } = homepagedata;

  const [discoverMenu, setDiscoverMenu] = useState(false);
  const [companyMenu, setCompanyMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const dispatch = useDispatch();
  const principal = useSelector((currState) => currState.internet.principal);

  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  const [showSwitchRole, setShowSwitchRole] = useState(false);
  // console.log("principal in header", connectedWalletPrincipal);

  const manageHandler = () => {
    !principal ? setModalOpen(true) : setModalOpen(false);
  };
  return (
    <>
      <nav className=" h-20 flex items-center justify-center bg-[#FEF6EE]   py-10 ">
        <div className="container  bg-[#FEF6EE]">
          <div className="max-w-7xl w-full mx-auto ">
            <div className="  flex items-center justify-between    py-8 px-4 sm:px-6 lg:px-8  ">
              <div className="">
                <Link to="/">
                  {" "}
                  <img
                    src={logo1}
                    alt="Olympus"
                    className="cursor-pointer hidden md:block"
                     width="200" height="200"
                    draggable={false}
                  />
                  <img
                    src={logo}
                    alt="Olympus"
                    className="cursor-pointer md:hidden object-cover w-11 h-11"
                    loading="lazy"
                    draggable={false}
                  />
                </Link>
              </div>
              {/* <div className='flex gap-2 '>
                        <div onClick={() => setDiscoverMenu(!discoverMenu)} className='flex items-center p-2 font-semibold cursor-pointer relative'>{navbar.menuItems.discoverText} <span className='pl-1'><navbar.expandIcon.ExpandMoreIcon /></span> {discoverMenu && <DiscoverMenu discoverMenu={discoverMenu} setDiscoverMenu={setDiscoverMenu} />}</div>
                        <div className='p-2 font-semibold cursor-pointer'>{navbar.menuItems.eventText}</div>
                        <div className='p-2 font-semibold cursor-pointer'><Link to=''>{homepagedata.navbar.menuItems.blogText}</Link></div>
                        <div onClick={() => setCompanyMenu(!companyMenu)} className='flex items-center p-2 font-semibold cursor-pointer relative'>{navbar.menuItems.companyText} <span className='px-2'><navbar.expandIcon.ExpandMoreIcon /></span>
                            {companyMenu && <CompanyMenu companyMenu={companyMenu} setCompanyMenu={setCompanyMenu} />}
                        </div>
                    </div> */}
              <div className="flex gap-4">
                {/* <Link to='/dashboard'><button className=' p-2 font-semibold'>{navbar.menuItems.loginButton} </button></Link> */}
                <button
                  className="border px-4 rounded-md bg-[#155EEF] p-2 font-semibold text-white"
                  onClick={manageHandler}
                >
                  {navbar.menuItems.getstartedButton}{" "}
                  <span className="pl-1 text-white">
                    <navbar.forwardArrow.EastIcon />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* <nav className='h-20 flex items-center md:hidden'>
                <div className='container mx-auto h-11 flex items-center justify-between '>
                    <div className=''>
                        <img src={navbar.logo.logo} alt='olympus' className='cursor-pointer' />
                    </div>
                    <div className='flex gap-4'>
                        <navbar.menuicon.MenuIcon className="cursor-pointer" onClick={() => setOpenMenu(!openMenu)} />
                    </div>
                    {openMenu && <MobileMenuDrawer openMenu={openMenu} setOpenMenu={setOpenMenu} />}
                </div>
            </nav> */}
    </>
  );
};

export default Navbar;

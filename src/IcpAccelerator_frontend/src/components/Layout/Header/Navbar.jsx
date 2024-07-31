import React, { useState } from 'react'
import EastIcon from '@mui/icons-material/East';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import logo from "../../../../assets/Logo/newLogo.png"
import DiscoverMenu from '../../Modals/DiscoverMenu';
import CompanyMenu from '../../Modals/CompanyMenu';
import MenuIcon from '@mui/icons-material/Menu';
import MobileMenuDrawer from './MobileMenuDrawer';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ setModalOpen }) => {
    // const navigate = useNavigate()
    const [discoverMenu, setDiscoverMenu] = useState(false);
    const [companyMenu, setCompanyMenu] = useState(false);
    const [openMenu, setOpenMenu] = useState(false)

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
            <nav className='hidden h-20 md:flex items-center bg-[#FEF5EE] '>
                <div className='container mx-auto h-11 flex items-center justify-around '>
                    <div className=''>
                        <Link to='/'> <img src={logo} alt='Olympus' className='cursor-pointer' /></Link>
                    </div>
                    <div className='flex gap-2 '>
                        <div onClick={() => setDiscoverMenu(!discoverMenu)} className='flex items-center p-2 font-semibold cursor-pointer relative'>Discover <span className='pl-1'><ExpandMoreIcon /></span> {discoverMenu && <DiscoverMenu discoverMenu={discoverMenu} setDiscoverMenu={setDiscoverMenu} />}</div>
                        <div className='p-2 font-semibold cursor-pointer'>Events</div>
                        <div className='p-2 font-semibold cursor-pointer'><Link to='/sign-up'>Blog</Link></div>
                        <div onClick={() => setCompanyMenu(!companyMenu)} className='flex items-center p-2 font-semibold cursor-pointer relative'>Company <span className='px-2'><ExpandMoreIcon /></span>
                            {companyMenu && <CompanyMenu companyMenu={companyMenu} setCompanyMenu={setCompanyMenu} />}
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <Link to='/dashboard'><button className=' p-2 font-semibold'>Log in </button></Link>
                        <button className='border px-4 rounded-md bg-[#155EEF] p-2 font-semibold text-white' onClick={manageHandler}>Get started <span className='pl-1 text-white'><EastIcon /></span></button>
                    </div>
                </div>
            </nav>
            <nav className='h-20 flex items-center md:hidden'>
                <div className='container mx-auto h-11 flex items-center justify-between '>
                    <div className=''>
                        <img src={logo} alt='olympus' className='cursor-pointer' />
                    </div>
                    <div className='flex gap-4'>
                        <MenuIcon className="cursor-pointer" onClick={() => setOpenMenu(!openMenu)} />
                    </div>
                    {openMenu && <MobileMenuDrawer openMenu={openMenu} setOpenMenu={setOpenMenu} />}
                </div>
            </nav>
        </>
    )
}

export default Navbar
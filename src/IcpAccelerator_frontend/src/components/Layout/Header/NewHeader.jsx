import React, { useEffect, useState, useRef } from "react";
import logoWithText from "../../../../assets/Logo/topLogoWhitepng.png";
import Banner from "../../../../assets/images/banner.png";
import { useSelector, useDispatch } from "react-redux";
import LogoutModal from "../../../models/LogoutModal";
import SwitchRole from "../../../models/SwitchRole";
import { getCurrentRoleStatusFailureHandler, setCurrentActiveRole, setCurrentRoleStatus } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import { useNavigate } from "react-router-dom";
const NewHeader = ({ setModalOpen, gradient }) => {
  // const navItems = [
  //   {
  //     title: "Learn",
  //     links: [
  //       {
  //         title: "Start Here",
  //         url: "/start-here",
  //         description: "Get to know the basics",
  //         featuredImage: "/img/nav/learn/start-here.webp",
  //       },
  //       {
  //         title: "Capabilities",
  //         url: "/capabilities",
  //         description: "Explore the platform's capabilities",
  //         featuredImage: "/img/nav/learn/capabilities.webp",
  //       },
  //       // More links can be added here
  //     ],
  //     bottomLinks: [
  //       {
  //         title: "ICP Dashboard",
  //         url: "https://dashboard.internetcomputer.org/",
  //       },
  //       { title: "ICP Wiki", url: "https://wiki.internetcomputer.org/" },
  //       // More bottom links for this section
  //     ],
  //   },
  //   {
  //     title: "Use",
  //     links: [
  //       {
  //         title: "Step into Web3",
  //         url: "/web3",
  //         description: "Enter the world of Web3",
  //         featuredImage: "/img/nav/use/web3.webp",
  //       },
  //       {
  //         title: "Use Cases",
  //         url: "/use-cases",
  //         description: "Discover how to use the platform",
  //         featuredImage: "/img/nav/use/use-cases.webp",
  //       },
  //       // More links can be added here
  //     ],
  //     bottomLinks: [
  //       {
  //         title: "Create an Internet Identity",
  //         url: "https://identity.ic0.app/",
  //       },
  //       { title: "NNS and Staking", url: "https://nns.ic0.app/" },
  //       // More bottom links for this section
  //     ],
  //   },
  //   {
  //     title: "Use2",
  //     links: [
  //       {
  //         title: "Step into Web3",
  //         url: "/web3",
  //         description: "Enter the world of Web3",
  //         featuredImage: "/img/nav/use/web3.webp",
  //       },
  //       {
  //         title: "Use Cases",
  //         url: "/use-cases",
  //         description: "Discover how to use the platform",
  //         featuredImage: "/img/nav/use/use-cases.webp",
  //       },
  //       // More links can be added here
  //     ],
  //     bottomLinks: [
  //       {
  //         title: "Create an Internet Identity",
  //         url: "https://identity.ic0.app/",
  //       },
  //       { title: "NNS and Staking", url: "https://nns.ic0.app/" },
  //       // More bottom links for this section
  //     ],
  //   },
  //   {
  //     title: "Use3",
  //     links: [
  //       {
  //         title: "Step into Web3",
  //         url: "/web3",
  //         description: "Enter the world of Web3",
  //         featuredImage: "/img/nav/use/web3.webp",
  //       },
  //       {
  //         title: "Use Cases",
  //         url: "/use-cases",
  //         description: "Discover how to use the platform",
  //         featuredImage: "/img/nav/use/use-cases.webp",
  //       },
  //       // More links can be added here
  //     ],
  //     bottomLinks: [
  //       {
  //         title: "Create an Internet Identity",
  //         url: "https://identity.ic0.app/",
  //       },
  //       { title: "NNS and Staking", url: "https://nns.ic0.app/" },
  //       // More bottom links for this section
  //     ],
  //   },
  //   // Additional sections (Develop, Participate) can be similarly defined
  // ];

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const actor = useSelector((currState) => currState.actors.actor);
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
      <nav
        className="z-50 px-[5%] lg1:px-[3%] py-[3%] text-black bg-transparent sticky top-0 transition-transform"
        style={{ transform: "unset" }}>
        <div className="container-12 w-full flex items-center justify-between">
          <a className="self-center flex items-center" href="/">
            <img
              src={logoWithText}
              alt="Olympus"
              className="h-8 md:h-10 hidden"
            />
            <img src={logoWithText} alt="Olympus" className="h-8 md:h-10" />
          </a>
          <div className="hidden md:flex gap-0 items-center">
            {/* {navItems.map((navItem, navIndex) => (
              <div
                key={navIndex}
                className="relative group cursor-pointer text-lg font-extrabold"
              >
                <div className="rounded-full px-8 py-[2px] group-hover:bg-[#6E52AA] group-hover:text-white text-white">
                  {navItem.title}
                </div>
                <div className="absolute z-50 top-8 left-1/2 -translate-x-1/2 p-4 opacity-0 pointer-events-none cursor-default invisible group-hover:opacity-100 group-hover:pointer-events-auto group-hover:visible transition-opacity duration-200 ">
                  <div className="shadow-2xl dark-hero:shadow-none bg-white rounded-3xl overflow-hidden">
                    <div className="flex flex-1">
                      <div className="bg-[#F1EEF5] p-6 flex flex-col gap-3 items-stretch min-w-[220px]">
                        {navItem.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            className="text-left appearance-none border-none rounded-xl font-bold text-base p-4 bg-transparent text-[#666] hover:bg-white group"
                          >
                            <span className="group-hover:text-[#454CB9] text-[#666]">
                              {link.title}
                            </span>
                          </a>
                        ))}
                      </div>
                      <div className="pl-6 pr-8 py-6 bg-white flex flex-wrap">
                        {navItem.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            className="bg-cover bg-center aspect-video rounded-xl flex min-w-[605px] p-4 max-h-40"
                            style={{
                              backgroundImage: `url(${link.featuredImage})`,
                            }}
                          >
                            <div className="font-bold text-base text-black flex-1">
                              {link.description}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#FAFAFA] py-6 pl-10 pr-6 flex">
                      <ul className="list-none p-0 m-0 flex flex-wrap gap-4">
                        {navItem.bottomLinks.map(
                          (bottomLink, bottomLinkIndex) => (
                            <li key={bottomLinkIndex}>
                              <a
                                href={bottomLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-infinite tw-button-sm md:tw-button-xs inline-flex gap-2 items-center hover:text-black text-base"
                              >
                                {bottomLink.title}
                              </a>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
          <div className="flex gap-4 items-center group">
            <button
              type="button"
              className="font-bold rounded-xl my-2 bg-transparent border-2 border-white/50 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap group-hover:bg-white group-hover:text-[#BA77FB] z-20"
              onClick={manageHandler}
            >
              <span className="">SIGNUP / LOGIN</span>
            </button>

            {/* <button className="md:hidden flex flex-col gap-[6px] border-none bg-transparent px-[4px] h-8 w-8 p-0 justify-center">
              <span className="bg-black dark-hero:bg-white h-[2px] w-full shrink-0"></span>
              <span className="bg-black dark-hero:bg-white h-[2px] w-full shrink-0"></span>
              <span className="bg-black dark-hero:bg-white h-[2px] w-full shrink-0"></span>
            </button> */}
          </div>
        </div>
      </nav>
      {/* <div className=" overflow-auto fixed inset-0 bg-white z-[1000] px-6 pt-4 pb-12 transition-transform -translate-x-full pointer-events-none">
        <div className="flex items-center justify-between ">
          <a className="flex items-center" href="/">
            <img src="/img/logo-notext.svg" alt="" className="h-5" />
          </a>
          <button className="appearance-none border-none bg-transparent w-10 h-10 -mr-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2L18 18"
                stroke="black"
                stroke-width="2"
                stroke-linecap="square"
              ></path>
              <path
                d="M18.5 2L2.5 18"
                stroke="black"
                stroke-width="2"
                stroke-linecap="square"
              ></path>
            </svg>
          </button>
        </div>
        <ul className="list-none p-0 flex flex-col gap-6 mt-8 mb-6">
          <li className="p-0">
            <button className="border-none bg-transparent p-0 text-infinite m-0 font-circular tw-heading-4">
              Learn
            </button>
          </li>
          <li className="p-0">
            <button className="border-none bg-transparent p-0 text-infinite m-0 font-circular tw-heading-4">
              Use
            </button>
          </li>
          <li className="p-0">
            <button className="border-none bg-transparent p-0 text-infinite m-0 font-circular tw-heading-4">
              Develop
            </button>
          </li>
          <li className="p-0">
            <button className="border-none bg-transparent p-0 text-infinite m-0 font-circular tw-heading-4">
              Participate
            </button>
          </li>
        </ul>
        <ul className="relative list-none p-0 flex flex-col gap-3 mt-0 mb-0 py-5 border-0 border-t border-solid border-grey-300 md:contents">
          <li>
            <a
              href="https://dashboard.internetcomputer.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-infinite tw-button-sm md:tw-button-xs inline-flex md:flex gap-2 items-center hover:no-underline hover:text-black md:whitespace-nowrap"
            >
              ICP Dashboard
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[14px]"
              >
                <path
                  d="M11.2429 8.34285L3.65709 8.34285L3.65709 6.34315H14.6568V17.3429L12.6571 17.3429L12.6571 9.75706L4.05024 18.364L2.63603 16.9498L11.2429 8.34285Z"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              href="https://dfinity.org/grants"
              target="_blank"
              rel="noopener noreferrer"
              className="text-infinite tw-button-sm md:tw-button-xs inline-flex md:flex gap-2 items-center hover:no-underline hover:text-black md:whitespace-nowrap"
            >
              Developer Grants
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[14px]"
              >
                <path
                  d="M11.2429 8.34285L3.65709 8.34285L3.65709 6.34315H14.6568V17.3429L12.6571 17.3429L12.6571 9.75706L4.05024 18.364L2.63603 16.9498L11.2429 8.34285Z"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              href="https://support.dfinity.org/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-infinite tw-button-sm md:tw-button-xs inline-flex md:flex gap-2 items-center hover:no-underline hover:text-black md:whitespace-nowrap"
            >
              Help &amp; Support
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[14px]"
              >
                <path
                  d="M11.2429 8.34285L3.65709 8.34285L3.65709 6.34315H14.6568V17.3429L12.6571 17.3429L12.6571 9.75706L4.05024 18.364L2.63603 16.9498L11.2429 8.34285Z"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>
      <div className="md:hidden overflow-auto fixed inset-0 bg-white z-[1000] px-6 py-4 transition-transform -translate-x-full pointer-events-none"></div> */}

      {/* <section
        className="flex items-center w-full bg-gradient-to-r from-purple-900 via-purple-500 to-purple-400 pl-[9%] pr-[3%]">
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="flex flex-col justify-center md:w-1/2 pt-8 sm:pt-0 sm:px-4 w-full">
              <h1 className="text-4xl font-bold mb-4 md:text-5xl lg:text-6xl text-white">
                OLYMPUS - <br /> THE PEAK OF WEB3 ACCELERATION
              </h1>
              <p className="text-lg mb-6 md:text-xl lg:text-2xl text-white">
                Olympus is a multichain startup acceleration platform, fostering
                collaboration among key stakeholders and leveraging blockchain
                technology to increase transparency.
              </p>
              <div className="relative group">
                <a
                  href="#"
                  className="inline-block bg-white text-[#9B68EC] font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Get Early Access
                </a>
                <div className="absolute -top-10 ml-2 py-3 px-4 bg-blue-600 rounded-br-3xl rounded-tr-3xl rounded-tl-3xl text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-default ease-in-out duration-200 hidden group-hover:block">
                    <div className="flex">
                  <img
                    src={Banner}
                    alt="Profile"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <img
                     src={Banner}
                    alt="Profile"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2">
              <img
                className="object-contain h-fit w-fit relative"
                src={Banner}
                alt="Illustration"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default NewHeader;

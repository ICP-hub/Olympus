import React, { useEffect, useState } from 'react'
import DashboardHomeNavbar from './DashboardHomeNavbar'
import DashboardHomeSidebar from './DashboardHomeSidebar'
import DashboardHomeWelcomeSection from './DashboardHomeWelcomeSection'
import { Routes, Route } from 'react-router-dom';
import ProjectProfile from './ProjectProfile';
import Jobs from '../../jobs/Jobs'
import ProfilePage from '../../profile/ProfilePage'
import EventMain from '../DashboardEvents/EventMain'
import ServiceDetailPage from './ServiceDetailPage'
import AddNewWork from './AddNewWork'
import WorksSection from './WorksSection'
import WorkSectionDetailPage from './WorkSectionDetailPage'
import EventDetails from '../DashboardEvents/EventDetail'
import DocumentSection from '../Project/DocumentSection'
import DiscoverRegionalHubs from '../../RegionalHubs/RegionalHubs'
import UsersSection from '../../Discover/UserSection';
import { useSelector } from "react-redux";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
 import allfounder from "../../../../assets/images/image.png";



function DashboardHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

   const userCurrentRoleStatus = useSelector(
     (currState) => currState.currentRoleStatus.rolesStatusArray
   );

   // Check if any role exists
   const hasRoles = userCurrentRoleStatus.length > 0;

   // Check if any role is approved
   const hasApprovedRole = userCurrentRoleStatus.some(
     (role) => role.status === "approved"
   );

   useEffect(() => {
     // Retrieve tour status from local storage
     const rolesTourShown = localStorage.getItem("rolesTourShown") === "true";
     const noRolesTourShown =
       localStorage.getItem("noRolesTourShown") === "true";

     // Exit if tours have already been shown
     if (rolesTourShown || noRolesTourShown) return;

     const driverObj = driver({
       popoverClass: "driverjs-theme",
       showButtons: false,
       onPopoverRender: (popover) => {
         const skipButton = document.createElement("button");
         skipButton.innerText = "Skip";
         skipButton.style.marginRight = "10px";
         skipButton.style.backgroundColor = "#ffffff";
         skipButton.style.color = "#000";
         skipButton.style.border = "2px solid #ccc";
         skipButton.style.borderRadius = "5px";
         skipButton.style.cursor = "pointer";

         skipButton.onmouseover = () =>
           (skipButton.style.backgroundColor = "#e0e0e0");
         skipButton.onmouseout = () =>
           (skipButton.style.backgroundColor = "#ffffff");

         const nextButton = document.createElement("button");
         nextButton.innerText = "Next";
         nextButton.style.backgroundColor = "#007BFF";
         nextButton.style.color = "#fff";
         nextButton.style.border = "none";
         nextButton.style.borderRadius = "5px";
         nextButton.style.cursor = "pointer";

         nextButton.onmouseover = () =>
           (nextButton.style.backgroundColor = "#1E40AF");
         nextButton.onmouseout = () =>
           (nextButton.style.backgroundColor = "#007BFF");

         skipButton.addEventListener("click", () => {
           driverObj.destroy();
           if (hasRoles) {
             localStorage.setItem("rolesTourShown", "true"); // Mark roles tour as shown
           } else {
             localStorage.setItem("noRolesTourShown", "true"); // Mark no roles tour as shown
           }
         });

         nextButton.addEventListener("click", () => {
           driverObj.moveNext();
         });

         popover.footerButtons.innerHTML = "";
         popover.footerButtons.appendChild(skipButton);
         popover.footerButtons.appendChild(nextButton);
       },
     });

     // Conditional steps based on roles and approval status
     if (hasApprovedRole) {
       driverObj.setSteps(  
               [
           {
             popover: {
               description: `
                <div style="text-align: center;">
                  <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
                  <h2 style="font-size: 20px; font-weight: bold; color: #333;">Welcome to your dashboard</h2>
                  <p style="color: #666; margin-bottom: 20px;">We're glad to have you onboard. Here are some quick tips to get you up and running.</p>
                </div>`,
             },
           },
           {
             element: "#step1",
             popover: {
               description: `
                <div style="text-align: center;">
                  <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
                  <h2 style="font-size: 20px; font-weight: bold; color: #333;">Switch Your Role</h2>
                  <p style="color: #666; margin-bottom: 20px;">You can switch between different roles using the toggle buttons below. Only one role can be active at a time.</p>
                </div>`,
             },
           },
           {
             element: "#step2",
             popover: {
               description: `
                <div style="text-align: center;">
                  <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
                  <h2 style="font-size: 20px; font-weight: bold; color: #333;">Active Role and Profile</h2>
                  <p style="color: #666; margin-bottom: 20px;">Your current role is displayed below alongside your profile image. The active role will automatically update here.</p>
                </div>`,
             },
           },
           {
             element: "#step3",
             popover: {
               description: `
                <div style="text-align: center;">
                  <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
                  <h2 style="font-size: 20px; font-weight: bold; color: #333;">Account Actions</h2>
                  <p style="color: #666; margin-bottom: 20px;">Use the dropdown below to copy your principal or log out of your account.</p>
                </div>`,
             },
           },
           {
             element: "#step4",
             popover: {
               description: `
                <div style="text-align: center;">
                  <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
                  <h2 style="font-size: 20px; font-weight: bold; color: #333;">Profile and Data Management</h2>
                  <p style="color: #666; margin-bottom: 20px;">Navigate through the sidebar to manage and update your profile. You can also track and view all your data here.</p>
                </div>`,
             },
           },
         ],);
     } else if (hasRoles) {
       driverObj.setSteps([
         {
           element: "#step1",
           popover: {
             description: `
              <div style="text-align: center;">
                <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
                <h2 style="font-size: 20px; font-weight: bold; color: #333;">Welcome to your dashboard</h2>
                <p style="color: #666; margin-bottom: 20px;">We're glad to have you onboard. Here are some quick tips to get you up and running.</p>
              </div>`,
           },
         },
         {
           element: "#step2",
           popover: {
             description: `
              <div style="text-align: center;">
                <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
                <h2 style="font-size: 20px; font-weight: bold; color: #333;">Active Role and Profile</h2>
                <p style="color: #666; margin-bottom: 20px;">Your current role is displayed below alongside your profile image. The active role will automatically update here.</p>
              </div>`,
           },
         },
         {
           element: "#step3",
           popover: {
             description: `
              <div style="text-align: center;">
                <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
                <h2 style="font-size: 20px; font-weight: bold; color: #333;">Profile and Data Management</h2>
                <p style="color: #666; margin-bottom: 20px;">Navigate through the sidebar to manage and update your profile. You can also track and view all your data here.</p>
              </div>`,
           },
         },
         {
           element: "#step4",
           popover: {
             description: `
                <div style="text-align: center;">
                  <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
                  <h2 style="font-size: 20px; font-weight: bold; color: #333;">Profile and Data Management</h2>
                  <p style="color: #666; margin-bottom: 20px;">Navigate through the sidebar to manage and update your profile. You can also track and view all your data here.</p>
                </div>`,
           },
         },
       ]);
     }

     driverObj.drive();
   }, [hasRoles, hasApprovedRole]);
  //  useEffect(() => {
  //    const hasTourBeenShown = localStorage.getItem("hasTourBeenShown");

  //    if (!hasTourBeenShown) {
  //      const driverObj = driver({
  //        popoverClass: "driverjs-theme",
  //        showButtons: false,
  //        allowClose: false,
  //        onPopoverRender: (popover, { config, state }) => {
  //          const skipButton = document.createElement("button");
  //          skipButton.innerText = "Skip";
  //          skipButton.style.marginRight = "10px";
  //          skipButton.style.backgroundColor = "#ffffff";
  //          skipButton.style.color = "#000";
  //          skipButton.style.border = "2px solid #ccc";
  //          skipButton.style.borderRadius = "5px";
  //          skipButton.style.cursor = "pointer";

  //          skipButton.onmouseover = () => {
  //            skipButton.style.backgroundColor = "#e0e0e0";
  //          };
  //          skipButton.onmouseout = () => {
  //            skipButton.style.backgroundColor = "#ffffff";
  //          };

  //          const nextButton = document.createElement("button");
  //          nextButton.innerText = "Next";
  //          nextButton.style.backgroundColor = "#007BFF";
  //          nextButton.style.color = "#fff";
  //          nextButton.style.border = "none";
  //          nextButton.style.borderRadius = "5px";
  //          nextButton.style.cursor = "pointer";

  //          nextButton.onmouseover = () => {
  //            nextButton.style.backgroundColor = "#1E40AF";
  //          };
  //          nextButton.onmouseout = () => {
  //            nextButton.style.backgroundColor = "#007BFF";
  //          };

  //          skipButton.addEventListener("click", () => {
  //            driverObj.destroy();
  //          });

  //          nextButton.addEventListener("click", () => {
  //            driverObj.moveNext();
  //          });

  //          popover.footerButtons.innerHTML = "";
  //          popover.footerButtons.appendChild(skipButton);
  //          popover.footerButtons.appendChild(nextButton);
  //        },
  //        steps: [
  //          {
  //            popover: {
  //              description: `
  //               <div style="text-align: center;">
  //                 <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
  //                 <h2 style="font-size: 20px; font-weight: bold; color: #333;">Welcome to your dashboard</h2>
  //                 <p style="color: #666; margin-bottom: 20px;">We're glad to have you onboard. Here are some quick tips to get you up and running.</p>
  //               </div>`,
  //            },
  //          },
  //          {
  //            element: "#step1",
  //            popover: {
  //              description: `
  //               <div style="text-align: center;">
  //                 <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
  //                 <h2 style="font-size: 20px; font-weight: bold; color: #333;">Switch Your Role</h2>
  //                 <p style="color: #666; margin-bottom: 20px;">You can switch between different roles using the toggle buttons below. Only one role can be active at a time.</p>
  //               </div>`,
  //            },
  //          },
  //          {
  //            element: "#step2",
  //            popover: {
  //              description: `
  //               <div style="text-align: center;">
  //                 <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
  //                 <h2 style="font-size: 20px; font-weight: bold; color: #333;">Active Role and Profile</h2>
  //                 <p style="color: #666; margin-bottom: 20px;">Your current role is displayed below alongside your profile image. The active role will automatically update here.</p>
  //               </div>`,
  //            },
  //          },
  //          {
  //            element: "#step3",
  //            popover: {
  //              description: `
  //               <div style="text-align: center;">
  //                 <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
  //                 <h2 style="font-size: 20px; font-weight: bold; color: #333;">Account Actions</h2>
  //                 <p style="color: #666; margin-bottom: 20px;">Use the dropdown below to copy your principal or log out of your account.</p>
  //               </div>`,
  //            },
  //          },
  //          {
  //            element: "#step4",
  //            popover: {
  //              description: `
  //               <div style="text-align: center;">
  //                 <img src="${allfounder}" alt="Step visual" draggable="false" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" />
  //                 <h2 style="font-size: 20px; font-weight: bold; color: #333;">Profile and Data Management</h2>
  //                 <p style="color: #666; margin-bottom: 20px;">Navigate through the sidebar to manage and update your profile. You can also track and view all your data here.</p>
  //               </div>`,
  //            },
  //          },
  //        ],
  //      });

  //      driverObj.drive();

  //      // Set a flag 
  //      localStorage.setItem("hasTourBeenShown", "true");
  //    }
  //  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#FFF4ED] lg:flex-row" >
      <DashboardHomeSidebar
        id="step1"
        id2="step4"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHomeNavbar id="step2" id2="step3" onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 md:pt-0 bg-white lg:mr-[4%] rounded-3xl">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardHomeWelcomeSection
                  id="step3"
                  profileCompletion={"35"}
                />
              }
            />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/profile" element={<ProfilePage id="step4" />} />
            <Route path="/user" element={<UsersSection />} />
            <Route path="/event" element={<EventMain />} />
            <Route path="/single-event/:id" element={<EventDetails />} />
            <Route path="/project" element={<ProjectProfile />} />
            <Route path="/single-project" element={<ServiceDetailPage />} />
            <Route path="/single-add-new-work" element={<AddNewWork />} />
            <Route path="/work-section" element={<WorksSection />} />
            <Route
              path="/work-section-detail-page"
              element={<WorkSectionDetailPage />}
            />
            <Route path="/document" element={<DocumentSection />} />
            <Route path="/regional-hubs" element={<DiscoverRegionalHubs />} />
          </Routes>
        </main>
        {/* <CustomTour/> */}
      </div>
    </div>
  );
}

export default DashboardHomePage;

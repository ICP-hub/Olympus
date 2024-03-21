import React,{useState} from "react";
import adminGif from "../../../../IcpAccelerator_frontend/assets/images/adminGif.gif";
import admin from "../../../../IcpAccelerator_frontend/assets/images/admin.gif";
import adminPI from "../../../../IcpAccelerator_frontend/assets/images/adminPerformanceIndicator.png";
import Footer from "../../../../IcpAccelerator_frontend/src/components/Footer/Footer";
// import ProjectInterestedPop from "./ProjectInterestedPop";
import SubmitSection from "../../../../IcpAccelerator_frontend/src/components/Footer/SubmitSection";
// import project from "../../../assets/images/project";


function AdminDashboard() {

  const headerData = [
    {
      id: "description",
      label: "Project Details",
    },
    {
      id: "teamMember",
      label: "Team Members",
    },
    {
      id: "resources",
      label: "Resources",
    },
  ];
  const [activeTab, setActiveTab] = useState(headerData[0].id);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabClassName = (tab) => {
    return `inline-block p-1 ${
      activeTab === tab
          ? "border-b-2 border-[#3505B2]"
        : "text-[#737373]  border-transparent"
    } rounded-t-lg`;
  };

  const responsiveText = ` text-gray-500 mb-6 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[15px] sm:text-[15.5px] md:text-[16px.3] md1:text-[17px] md2:text-[17.5px] md3:text-[18px] lg:text-[18.5px] dlg:text-[19px] lg1:text-[15.5px] lgx:text-[20px] md:text-[20.5px] xl:text-[21px] xl2:text-[21.5px]`
  return (
    <section className="overflow-hidden relative bg-gray-100 ml-4">
      <div className="font-fontUse flex flex-col w-full h-fit px-[5%] lg1:px-[4%] py-[4%]">
        <div>
          <div className="relative bg-white p-8 pt-16 rounded-lg">
          <h1 className="font-extrabold text-transparent xl:text-6xl lg:text-4xl md:text-xl sm:text-xl  bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text mb-3">
              Effortless Administration Made Possible with Our Accelerator
            </h1>
            <h6 className="text-xl font-[450] lg:w-[50%] w-[90%] mb-6">
              Take Control of Your Admin Operations with accelerator Dashboard
              and Optimize Your Workflow
            </h6>
            <button className="bg-[#3505B2] text-white uppercase text-xs font-black p-3 rounded-md">
              Login as admin
            </button>
          </div>
          <div className="justify-end hidden lg:flex">
  <img src={adminGif} alt="gif" className="absolute top-[200px]" />
</div>

        </div>


        <div className="flex flex-row flex-wrap justify-center lg:mt-80 mt-[-30px]">
          <div className="w-full md:w-[40%] mb-4 md:mb-8 ">
            <img src={adminPI} alt="progressImage" className="w-full" />
          </div>
          <div className="w-full md:w-[50%]">
            <p className="text-2xl text-transparent bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text flex justify-center font-extrabold">How we work</p>
            <div className="h-[200px] md:w-[450px] mx-auto">
  <p className="text-left ">
    Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatu Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatuQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatu.
  </p>
</div>

          </div>
          <div className="w-11/12 md:h-[11.5rem] bg-neutral-50 rounded-[20px] drop-shadow-2xl z-10 mt-[160px] md:mt-0 mb-4">
  {/* Your content here */}
        <div className="flex  justify-center ">
          <div className="w-5/6 px-4 md:justify-between md:items-center md:flex md:left-[-60px] md:top-[60px]  md:relative  ">
            <div className="relative mb-4 mt-4 md:mt-0">
              <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                180+
              </div>
              <div className={`${responsiveText} left-0 top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse`}>
                vcs
              </div>
            </div>
            <div className="relative mb-4 ">
              <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                250+
              </div>
              <div className={`${responsiveText} left-0 top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse`}>
                Hub 
              </div>
            </div>
            <div className="relative mb-4">
              <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                400+
              </div>
              <div className={`${responsiveText} left-[22px] top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse`}>
                Founders
              </div>
            </div>
            <div className="relative mb-4">
              <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                1200+
              </div>
              <div className={`${responsiveText} left-[14px] top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse`}>
                Mentors
              </div>

            </div>
            <div className="relative mb-4">
              <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                150+
              </div>
              <div className={`${responsiveText} left-[14px] top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse`}>
                Admins
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start mt-12 mb-12">
  {/* <div className="flex">
    <h1 className="text-transparent bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text text-2xl font-extrabold  flex justify-start">Meet all our members</h1>
  </div> */}
  {/* <div>
    <p className="text-[#737373]"> We are connected with thousands of VCs, Hubs,founders and mentors</p>
  </div> */}
  <div className="border-2 border-[#737373] w-full">
  {/* <section className="text-black bg-gray-100 pb-4">
      <div className="w-full px-[4%] lg1:px-[5%]">
        <div className="flex-col">
          
          
          <div>
            <div className="text-sm font-extrabold text-center text-[#737373] ">
              <ul className="flex flex-wrap -mb-px text-[10px] ss2:text-[10.5px] ss3:text-[11px]  cursor-pointer">
                {headerData.map((header) => (
                  <li key={header.id} className="me-6 relative group">
                    <button
                      className={getTabClassName(header.id)}
                      onClick={() => handleTabClick(header.id)}
                    >
                      <div className="block">{header.label}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {activeTab === "description" && <ProjectDescription />}
            {activeTab === "teamMember" && <Members />}
            {activeTab === "resources" && <Details />}
          </div>
        </div>
      </div>
    </section> */}
</div>
</div>

      
        </div>
        <div className="mt-12 mb-12">
  <div className="w-full h-fit bg-indigo-300 rounded-md shadow-md">
    <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-center md:p-8">
      <div className="font-bold text-center md:text-center mb-4 md:mb-0 md:w-full md:max-w-[450px] md:pr-4">
        <p className=" xl:lg:text-4xl  md:text-xl sm:text-lg text-transparent bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text font-extrabold">
          Learn more about our accelerator program
        </p>
        <p className="text-white text-left mt-2 ml-2">
          Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatu.
        </p>
      </div>  
      <div className="text-center md:text-right md:w-full md:max-w-[300px] md:pl-4">
        <img className="h-auto w-full mx-auto md:mx-0" src={admin} alt="k" />
      </div>
    </div>
  </div>
</div>

<div className="mt-12 mb-12">
        <SubmitSection />
      </div>
      </div>
      {/* <Footer /> */}
    </section>
  );
}

export default AdminDashboard;

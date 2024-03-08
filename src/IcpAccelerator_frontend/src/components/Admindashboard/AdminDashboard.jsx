import React from "react";
import adminGif from "../../../assets/images/adminGif.gif";
import adminPI from "../../../assets/images/adminPerformanceIndicator.png";
function AdminDashboard() {
  return (
    <section className="overflow-hidden relative bg-gray-100">
      <div className="font-fontUse flex flex-col w-full h-fit px-[5%] lg1:px-[4%] py-[4%]">
        <div>
          <div className="relative bg-white p-8 pt-16 rounded-lg">
            <h1 className="font-extrabold text-transparent text-6xl bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text mb-3">
              Effortless Administration Made Possible with Our Accelerator
            </h1>
            <h6 className="text-xl font-[450] w-[50%] mb-6">
              Take Control of Your Admin Operations with accelerator Dashboard
              and Optimize Your Workflow
            </h6>
            <button className="bg-[#3505B2] text-white uppercase text-xs font-black p-3 rounded-md">
              Login as admin
            </button>
          </div>
          <div className="justify-end flex">
            <img src={adminGif} alt="gif" className="absolute top-[200px]" />
          </div>
        </div>
        <div>
          <div className="w-[50%]">
            <img src={adminPI} alt="progressImage" />
          </div>
          <div className="w-[50%]"></div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;

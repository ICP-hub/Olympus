import React from "react";
const Announcement = ({ data }) => {
  return (
    <div className="p-[2%] bg-white border-[0.5px] border-[#B8B8B8] rounded-xl">
      <div className="py-2">
        <h1 className="text-[#3505B2] font-bold text-xl">Announcement</h1>
      </div>
      <div className="text-black hidden sm3:block font-bold text-xl py-2 ">
        <p>New Feature</p>
      </div>
      <div className="flex flex-row flex-wrap">
        <div className="w-full hidden sm3:block lg:w-3/5 text-[#737373] text-sm">
          <p className="py-2">
            The Student Side Dashboard provides students with access to the
            assigned tests and assessments created by their respective teachers.
            Students can log in to their accounts, view a list of available
            tests, and choose the tests they want to attempt. The dashboard
            allows them to navigate through the tests, answer questions, and
            submit their responses within the specified time limit. Upon
            completing a test, students can view their scores and performance
            summary. The platform provides immediate feedback, highlighting
            correct and incorrect answers, helping students identify areas that
            require improvement. They can also access their historical test
            results and track their progress over time.
          </p>
          <p>
            Additional Features: In addition to the core functionalities
            mentioned above, the website may include other features to enhance
            the learning experience. These may include:
          </p>
          <ol className="list-decimal px-[2%] list-outside">
            <li>
              Test Scheduling: The ability for teachers to schedule tests for
              specific dates and times, ensuring timely access for students.
            </li>
            <li>
              Announcements and Notifications: Teachers can share important
              announcements, updates, and reminders with students through the
              platform.
            </li>
            <li>
              Progress Tracking: A comprehensive progress tracking system that
              allows teachers and students to monitor performance over time
            </li>
          </ol>
        </div>
        <div className="w-full lg:w-2/5 flex flex-col justify-around items-center">
          <div className="w-full flex flex-col justify-center items-center relative ">
            <img
              className="w-[342.7px] h-[194.92px]"
              src={data.img}
              alt="gdvuj"
            />
            <div
              className="absolute h-24 w-24 rounded-full ml-[185px] ss2:ml-[210px] dxs:ml-[270px] mt-32"
              style={{
                backgroundImage: "linear-gradient(to bottom, #7283EA, white)",
              }}
            ></div>

            <img
              className="absolute h-20 w-20 rounded-full flex ml-[185px] ss2:ml-[210px] dxs:ml-[270px] mt-32 justify-center items-center"
              src={data.img2}
              alt="h"
            />

            <p className="text-[#7283EA] mr-auto dxs:mr-0 font-bold">
              Announced by MS.Lucy
            </p>
          </div>
          <div className="ml-auto">
            <button className="px-2 bg-blue-900 mt-2 text-white text-xs rounded-md py-2">
              Add announcement
            </button>
          </div>
        </div>
        <div className="w-full sm3:hidden block lg:w-3/5 text-[#737373] text-xs">
          <p className="text-black sm3:hidden block font-bold text-xs py-2">
            New Feature
          </p>
          <p className="py-2">
            The Student Side Dashboard provides students with access to the
            assigned tests and assessments created by their respective teachers.
            Students can log in to their accounts, view a list of available
            tests, and choose the tests they want to attempt. The dashboard
            allows them to navigate through the tests, answer questions, and
            submit their responses within the specified time limit. Upon
            completing a test, students can view their scores and performance
            summary. The platform provides immediate feedback, highlighting
            correct and incorrect answers, helping students identify areas that
            require improvement. They can also access their historical test
            results and track their progress over time.
          </p>
          <div className="xxs:block hidden">
            <p>
              Additional Features: In addition to the core functionalities
              mentioned above, the website may include other features to enhance
              the learning experience. These may include:
            </p>
            <ol className="list-decimal px-[2%] list-outside">
              <li>
                Test Scheduling: The ability for teachers to schedule tests for
                specific dates and times, ensuring timely access for students.
              </li>
              <li>
                Announcements and Notifications: Teachers can share important
                announcements, updates, and reminders with students through the
                platform.
              </li>
              <li>
                Progress Tracking: A comprehensive progress tracking system that
                allows teachers and students to monitor performance over time
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;

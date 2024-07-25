import React from 'react';
import man1 from '../../../assets/images/man1.png';

export default function HomeSection5() {
  return (
    <>
      <div className="bg-white py-10">
        <div className="container mx-auto">
          <div className="max-w-6xl w-full mx-auto bg-[#FEF6EE] rounded-lg shadow-md">
            <section className="text-center p-12">
              <div className="mx-52">
                <button className="border border-blue-300 rounded-full text-blue-500 px-4">Get started</button>
                <h2 className="text-3xl font-medium mb-4 mt-4">How it works</h2>
                <p className="text-gray-600 mb-6 text-center">
                  Est malesuada et elit gravida vel aliquam arcu. At amet, pellentesque convallis duis diam feugiat non viverra massa tincidunt. Mauris nullam blandit integer quam nulla.
                </p>
              </div>
            </section>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
                <img
                  src={man1}
                  alt="Statue"
                  className="rounded-lg"
                />
              </div>
              <div className="md:w-1/2 min ml-2">
                <ul className="space-y-8 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  <li className="flex items-start">
                    <span className="bg-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 relative z-10">
                      1
                    </span>
                    <div>
                      <h3 className="font-bold">Create Profile</h3>
                      <p className="text-gray-600">Est malesuada et elit gravida vel aliquam arcu dui quis vitae amet.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 relative z-10">
                      2
                    </span>
                    <div>
                      <h3 className="font-bold">Discover & Connect</h3>
                      <p className="text-gray-600">Est malesuada et elit gravida vel aliquam arcu dui quis vitae amet.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 relative z-10">
                      3
                    </span>
                    <div>
                      <h3 className="font-bold">Collaborate</h3>
                      <p className="text-gray-600">Est malesuada et elit gravida vel aliquam arcu dui quis vitae amet.</p>
                    </div>
                  </li>
                  <li className="flex items-start ">
                    <span className="bg-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 relative z-10">
                      4
                    </span>
                    <div>
                      <h3 className="font-bold">Accelerate</h3>
                      <p className="text-gray-600">Est malesuada et elit gravida vel aliquam arcu dui quis vitae amet.</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 text-center md:text-left ">
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-[4px]">Get started</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

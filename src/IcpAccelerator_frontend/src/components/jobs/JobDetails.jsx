import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';


const JobDetails = ({ setOpen }) => {

    return (
        <div className=' mx-auto w-[80%] absolute right-0 top-0 bg-slate-200 z-40 h-full '>
            <div className='container relative  '>
                <div onClick={() => setOpen(false)} className='absolute top-4 left-4 p-2 mb-5'><CloseIcon /></div>
                <div className='flex justify-evenly px-[1%] mt-8'>
                    <div className="brorder rounded-lg w-[30%] ">
                        <div className='p-3 border rounded-t-lg'>
                            <div className='flex gap-2 '>
                                <span className=''>icon</span>
                                <p className=''>Cypherpunk Labs</p>
                            </div>
                            <div className="">
                                <h2 className='text-xl font-bold my-3'>
                                    Quality Assurance Engineer
                                </h2>
                            </div>
                            <div className=''>
                                <button className='border rounded-md bg-[#155EEF] py-2 w-full text-white text-center'>Apply <span className='pl-1 text-white'></span><ArrowOutwardIcon sx={{ marginTop: "-2px", fontSize: "medium" }} /></button>
                            </div>
                        </div>
                        <div className="p-3">
                            <div className='p-2'>
                                <h3 className='text-gray-400 mb-2'>DATE</h3>
                                <h4 className=''>22 july,2024</h4>
                            </div>
                            <div className='p-2'>
                                <h3 className='text-gray-400 mb-2'>DEPARTMENT</h3>
                                <h4 className=''>Porducts</h4>
                            </div>
                            <div className='p-2'>
                                <h3 className='text-gray-400 mb-2'>LOCATION</h3>
                                <h4 className=''>Remote</h4>
                            </div>
                            <div className='p-2'>
                                <h3 className='text-gray-400 mb-2'>OCCUPATION</h3>
                                <h4 className=''>Full-time</h4>
                            </div>
                            <div className='p-2'>
                                <h3 className='text-gray-400 mb-2'>SALARY</h3>
                                <h4 className=''>$80k-100k</h4>
                            </div>
                        </div>
                    </div>
                    <div className="border rounded-lg p-3 w-[65%] sticky top-0">
                        <div className=''>
                            <p className=''>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolores ex rem laboriosam perferendis consequuntur vel eius illum, voluptas quae! Aspernatur unde placeat fuga! Quaerat nulla praesentium necessitatibus omnis quis.</p>
                            <p className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab omnis voluptatem iure repellat obcaecati autem.
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae sequi consectetur veniam voluptates voluptatem dicta delectus eum, quidem hic alias odio, inventore natus cumque id ipsum maxime eveniet! Laborum amet perspiciatis ducimus nisi ut veritatis, aliquam beatae deserunt, quo fugit magnam vitae et id, doloremque reprehenderit. Eaque praesentium quasi repudiandae consequuntur. Natus, doloremque odio aliquam unde modi dolorem eum vitae in quia molestiae exercitationem nisi odit ex tempora vel dolore inventore architecto fuga nulla rerum. Atque nisi incidunt inventore ea veniam magni ratione laudantium est explicabo deserunt, molestias quos sint dignissimos odio? Voluptate sint, soluta aliquid temporibus ullam maxime fugit, iusto natus ea tenetur eligendi! Laboriosam sunt perferendis nam? Hic eum omnis consequuntur magnam delectus fugiat cum autem tempora, pariatur similique sit nobis voluptate harum animi in debitis maxime. Eum consectetur magnam dolorum ducimus quia deserunt fugiat vitae cumque quam esse explicabo similique voluptatem, deleniti culpa reprehenderit repellendus! Iure possimus, a quas ullam sapiente modi molestiae animi vitae laborum asperiores pariatur corporis? Ad quaerat ipsa ex, ipsam eaque ut enim corporis vel aspernatur natus odit facilis reiciendis omnis officiis fugit recusandae maiores commodi impedit at nulla? Vel mollitia quo eius inventore? Quia repellendus quas quasi cupiditate. Nisi quas ipsam esse?
                            </p>
                        </div>
                        <div className=''>
                            <h3 className='font-bold'>we are :</h3>
                            <ul className='list-disc'>
                                <li className=''>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat laudantium laboriosam, cumque fugit itaque eos.
                                </li>
                                <li className=''>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat laudantium laboriosam, cumque fugit itaque eos.
                                </li>
                                <li className=''>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat laudantium laboriosam, cumque fugit itaque eos.
                                </li>
                            </ul>
                        </div>
                        <div className=''>
                            <h3 className='font-bold'>What to expect:</h3>
                            <ul className='list-disc'>
                                <li className=''>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat laudantium laboriosam, cumque fugit itaque eos.
                                </li>
                                <li className=''>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat laudantium laboriosam, cumque fugit itaque eos.
                                </li>
                                <li className=''>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat laudantium laboriosam, cumque fugit itaque eos.
                                </li>
                            </ul>
                        </div>
                        <div className=''>
                            <h3 className='font-bold'>Requirements:</h3>
                            <ul className='list-disc'>
                                <li className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, reiciendis?\</li>
                                <li className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, reiciendis?\</li>
                                <li className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, reiciendis?\</li>
                                <li className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, reiciendis?\</li>
                                <li className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, reiciendis?\</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default JobDetails
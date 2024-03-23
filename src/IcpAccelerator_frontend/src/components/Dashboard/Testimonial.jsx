import React from 'react'
import user from "../../../assets/images/Ellipse 1382.svg"
const Testimonial = () => {
    const data = [
        {
          id: 1,
          name: 'James Dani',
          date: '15 Mar 2022',
          content: 'Araa and I talked about career field decisions and my portfolio. I really appreciated his feedback and advice. :)',
          imageUrl: user,
        },
        {
            id: 2,
            name: 'James Dani',
            date: '15 Mar 2022',
            content: 'Araa and I talked about career field decisions and my portfolio. I really appreciated his feedback and advice. :)',
            imageUrl: user,
          },
      ];
  return (
    <div className='flex space-x-8'>
    {data.map((card) => (
      <div key={card.id} className="bg-white rounded-lg shadow-lg w-1/2 p-12 mb-4 h-[22.2rem]">
        <div className="flex items-center space-x-4">
          <img src={card.imageUrl} alt="profile picture" className="w-14 h-14 rounded-full" />
          
          <div>
            <div className="text-xl font-semibold">{card.name}</div>
            <div className="text-gray-500">{card.date}</div>
          </div>
        </div>
        <div className="mt-4 text-gray-800">
          {card.content}
        </div>
      </div>
    ))}
  </div>
  )
}

export default Testimonial
import React from 'react'

function MentorCard() {
  return (
    <div className='mt-4'>
          <div className="xxs1:flex block items-center">
            <div
              className="relative p-1 bg-blend-overlay w-[85px] rounded-full bg-no-repeat bg-center bg-cover"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                backdropFilter: "blur(20px)",
              }}
            >
              {" "}
              <img
                className="rounded-full object-cover w-20 h-20"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                alt="img"
              />
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-[950]">builder.fi</h2>
              <p className="text-[15px] leading-4 flex-wrap">
                <span className="underline">
                  Senior SRE/Chaos Engineer/Speaker @ 
                </span>
                Talend
              </p>
              <p className="text-[#737373]">
                Site Reliability Engineer and DevOps Mentor
              </p>
              <div className="text-[15px] leading-4 flex items-center ">
                <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline ">
                  SRE
                </spna>
                <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline ml-2">
                  Observability
                </spna>
                <spna className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline ml-2">
                  Kubernetes
                </spna>
              </div>
            </div>
          </div>
    </div>
  )
}

export default MentorCard

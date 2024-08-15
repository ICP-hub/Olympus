import React from 'react';
import logo from "../../../assets/Logo/icpLogo.png";
import Layer1 from "../../../assets/Logo/Layer1.png";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {homepagedata} from "../../../src/components/jsondata/data/homepageData";


const Footer = () => {
  const { footer } = homepagedata;
  // console.log("homepagedata" , homepagedata)
  return (
    <footer className="bg-[rgb(254,246,238)] py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-center md:text-left mb-4 md:mb-0">
           {homepagedata.footer.headline}
          </h2>
          <button className="bg-[#155EEF] text-white text-lg py-3 px-6 rounded-[4px]">
            {homepagedata.footer.buttonText}
          </button>
        </div>
        <div className="border-t border-[#bd10e0bf] pt-8">
        <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <h3 className="text-xl font-semibold mb-4"> <img src={homepagedata.footer.logo.logo} alt="logo" className="text-white" /></h3>
              <p className="text-gray-600 text-sm">{homepagedata.footer.description}</p>
            </div>
            <div className="w-full md:w-3/4 flex flex-wrap justify-between">
              <div className="w-1/2 md:w-1/4 mb-8 md:mb-0">
                <h4 className="text-base font-normal mb-4 text-gray-600">{homepagedata.footer.explore.title}</h4>
                <ul className="text-[#4B5565] font-bold">
                  {homepagedata.footer.explore.items.map((item,index)=>{
                    return(
                      <li className="mb-2" key={index}><a href="/">{item}</a></li>
                    )
                  })}
                  {/* <li className="mb-2"><a href="/">Projects</a></li>
                  <li className="mb-2"><a href="/">Investors</a></li>
                  <li className="mb-2"><a href="/">Mentors</a></li>
                  <li className="mb-2"><a href="/">Talent</a></li>
                  <li><a href="/">Accelerators</a></li> */}
                </ul>
              </div>
              <div className="w-1/2 md:w-1/4 mb-8 md:mb-0">
                <h4 className="text-base font-normal mb-4 text-gray-600">{homepagedata.footer.company.title}</h4>
                <ul className="text-[#4B5565] font-bold">
                  {
                    homepagedata.footer.company.items.map((item,index)=>{
                      return(
                        <li className="mb-2" key={index}><a href="/">{item}</a></li>
                      )
                    })
                  }
                  {/* <li className="mb-2"><a href="/">About us</a></li>
                  <li className="mb-2"><a href="/">Careers</a></li>
                  <li className="mb-2"><a href="/">Roadmap</a></li>
                  <li><a href="/">Contact</a></li> */}
                </ul>
              </div>
              <div className="w-1/2 md:w-1/4 mb-8 md:mb-0">
                <h4 className="text-base font-normal mb-4 text-gray-600">{homepagedata.footer.resources.title}</h4>
                <ul className="text-[#4B5565] font-bold">
                  {
                    homepagedata.footer.resources.items.map((item,index)=>{
                      return(
                        <li className="mb-2" key={index}><a href="/">{item}</a></li>
                      )
                    })
                  }
                  {/* <li className="mb-2"><a href="/">Blog</a></li>
                  <li className="mb-2"><a href="/">Events</a></li>
                  <li><a href="/">FAQ</a></li> */}
                </ul>
              </div>
              <div className="w-1/2 md:w-1/4">
                <h4 className="text-base font-normal mb-4 text-gray-600">{homepagedata.footer.newsletter.title}</h4>
                <form>
                  {/* <MailOutlineIcon />
                  <input type="email" placeholder=" Enter your email" className="w-full p-2 border border-gray-300 rounded-lg mb-4" /> */}
                  <div className="relative w-full mb-4">
                    <homepagedata.footer.mailicon.MailOutlineIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button type="submit" className=" text-gray-600 text-lg py-2 px-6 rounded-lg w-full border border-[#CDD5DF] bg-white hover:border-[#b7bec6]">
                    {homepagedata.footer.newsletter.buttonText}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">

            <div className="flex space-x-5">
              <p className="mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} {homepagedata.footer.rightsText}
              </p>
              <a href="/" className='font-bold'>{homepagedata.footer.policies[0]}</a>
              <a href="/" className='font-bold'>{homepagedata.footer.policies[1]}</a>
              <a href="/" className='font-bold'> {homepagedata.footer.policies[2]}</a>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/" ><homepagedata.footer.socialLinks.xicon.XIcon fontSize="medium" style={{ color: 'gray' }} /> </a>
              <a href="/" ><homepagedata.footer.socialLinks.linkedinicon.LinkedInIcon fontSize="medium" style={{ color: 'gray' }} /></a>
              <a href="/" ><homepagedata.footer.socialLinks.facebookicon.FacebookIcon fontSize="medium" style={{ color: 'gray' }} /></a>
              <a href="/" ><homepagedata.footer.socialLinks.githubicon.GitHubIcon fontSize="medium" style={{ color: 'gray' }} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

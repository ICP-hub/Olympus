import logo from '../../../../../assets/Logo/newLogo.png';
import { shareSvgIcon } from '../../../Utils/Data/SvgData';
import EastIcon from '@mui/icons-material/East';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import df_logo from '../../../../../assets/Logo/df_logo.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Founder from '../../../../../assets/images/Founder.png';
import Investor from '../../../../../assets/images/Investor.png';
import MentorsImage from '../../../../../assets/images/MentorsImage.png';
import Talents from '../../../../../assets/images/Talents.png';
import hubs from '../../../../../assets/images/hubs.png';
import sec41 from '../../../../../assets/images/sec41.png';
import sec42 from '../../../../../assets/images/sec42.png';
import sec43 from '../../../../../assets/images/sec43.png';
import sec46 from '../../../../../assets/images/sec46.png';
import sec47 from '../../../../../assets/images/sec47.png';
import sec48 from '../../../../../assets/images/sec48.png';
import sec49 from '../../../../../assets/images/sec49.png';
import sec50 from '../../../../../assets/images/sec50.png';
import sec51 from '../../../../../assets/images/sec51.png';
import multichain from '../../../../../assets/images/multichain.png';
import reputation from '../../../../../assets/images/reputation.png';
import incubation from '../../../../../assets/images/incubation.png';
import globalevent from '../../../../../assets/images/globalevent.png';

import man1 from '../../../../../assets/images/man1.png';
import AccelerateIcon from '../../../../../assets/images/AccelerateIcon.png';
import CollaborateIcon from '../../../../../assets/images/CollaborateIcon.png';
import CreateProfileIcon from '../../../../../assets/images/CreateProfileIcon.png';
import DiscoverAndConnetIcon from '../../../../../assets/images/DiscoverAndConnetIcon.png';
import TestimonialProfile from '../../../../../assets/ProfIleEdit/TestimonialProfile.png';
import TestAvatar from '../../../../../assets/ProfIleEdit/TestAvatar.png';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Icplogo from '../../../../../assets/Logo/icpLogo.png';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export const homepagedata = {
  navbar: {
    logo: { logo },
    forwardArrow: { EastIcon },
    expandIcon: { ExpandMoreIcon },
    menuicon: { MenuIcon },
    menuItems: {
      discoverText: 'Discover',
      eventText: 'Events',
      blogText: 'Blog',
      companyText: 'Company',
      loginButton: 'Log in',
      getstartedButton: 'Get started',
    },
  },

  section1: {
    df_logo: { df_logo },
    arrowForwardIcon: { ArrowForwardIcon },
    content: {
      backedByText: 'Powered by',
      dfLogo: '../../../assets/Logo/df_logo.png',
      mainHeading: 'Peak of Web3 Acceleration',
      highlightedText: 'Web3',
      description:
        'OLYMPUS is the first on-chain, permissionless acceleration platform for founders, investors, mentors, users and talent from across ecosystems.',
      buttonText: 'Get started',
    },
  },

  homepagesection2: {
    aboutText: 'About',
    arrowForwardIcon: { ArrowForwardIcon },
    mainHeading: 'The Web3 Ecosystem Launchpad',
    description:
      'A platform for the next hottest projects to connect with investors, mentors, talent and communities from 20+ countries.',
    card1: {
      title: 'Founders',
      image: { Founder },
      description: 'Early Stage or mature projects',
      list: [
        'Visibility on your growth actions based on 9 key success parameters',
        'Find early adopters, users, and community',
        'Raise funds, grants, or donations',
        'Find your team',
        'Get tech support',
        'Get advisors for tokenomics, marketing, etc.',
      ],
      bgColor: '#E0F2FE',
    },
    card2: {
      title: 'Investors',
      image: { Investor },
      description: 'Angels or well-established VC funds',
      list: [
        'Access all due diligence docs and project peers for reference and verification',
        'Get a deep understanding of project health based on 9 key success parameters',
        'Option to take advisory/KOL stake or just be a mentor',
      ],
      bgColor: '#FEF0C7',
    },
    card3: {
      title: 'Mentors',
      image: { MentorsImage },
      description: 'Any KOL/expert/service provider with a proven track record',
      list: [
        'Provide services to projects across 20+ countries',
        'Option to take advisory/KOL stake or just get a service fee',
        'Start you own accelerator and invite existing platform projects, investors, mentors to join',
        ,
      ],
      bgColor: '#FDEAD7',
    },
    card4: {
      title: 'Talent',
      image: { Talents },
      description: 'New or experienced web3 professionals',
      list: [
        'Opportunities in the most promising projects',
        'Access to overall health of projects',
        'Get consulting, part-time, or full-time gigs',
      ],
      bgColor: '#CCFBEF',
    },
    buttonText: 'Get started',
  },

  // homepagesection3: {
  //   backgroundColor: 'white',
  //   paragraph1: {
  //     text: 'Our mission is to ',
  //     highlightedText: {
  //       text: 'empower founders',
  //       backgroundColor: 'blue-400',
  //     },
  //   },
  //   paragraph2: {
  //     text: ' with the resources and connections to bring their bold visions to life. We ',
  //     highlightedText2: {
  //       text: 'inspire investors',
  //       backgroundColor: 'orange-400',
  //     },
  //   },

  //   paragraph3: {
  //     text: ' to fuel innovation. We ',
  //     highlightedText3: {
  //       text: 'unite mentors',
  //       backgroundColor: 'red-400',
  //     },
  //   },

  //   paragraph4: {
  //     text: ' and ',
  //     highlightedText4: {
  //       text: 'foster talent',
  //       backgroundColor: 'green-400',
  //     },
  //   },
  //   paragraph5: {
  //     text: ' in a shared passion for building a decentralized future.',
  //   },

  //   paragraph6: {
  //     text: 'Together, we will redefine what’s possible and forge a new era of digital empowerment.',
  //   },
  // },

  homepagesection4: {
    backgroundColor: '#FEF6EE',
    arrowForwardIcon: { ArrowForwardIcon },
    paddingY: '10',
    container: {
      maxWidth: '6xl',
      padding: '4 sm:px-6 lg:px-8',
      backgroundColor: 'white',
      borderRadius: 'lg',
    },
    header: {
      maxWidth: 'xl',
      textAlign: 'center',
      title: 'Loaded with value',
      titleClass: 'text-3xl font-bold mb-6',
      description:
        'OLYMPUS ecosystem leverages the network effect, so you get compounding value back for the value you add',
      descriptionClass: 'text-gray-600 mb-10',
    },
    card1: {
      imageSrc: { globalevent },
      imageAlt: '',
      imageClass: 'py-4 object-cover object-center max-w-[241px] max-h-[407px]',
      backgroundColor: '#EEF2F6',
      // content: {
      //   title: 'Global events',
      //   titleClass: 'text-3xl font-custom text-[#121926] pb-2',
      //   description:
      //     'Find and join exclusive experinces/activations',
      //   descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
      //   description2:
      //     'Gain insights from industry-leading experts and pioneers.',
      //   tags: ['#Accelerators', '#Meetups', '#Conferences'],
      // },
      content: {
        title: 'Global Events',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description: 'Find and join exclusive experiences/activations',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        listItems: [
          'Local curated meet-ups',
          'Side events around the major Web3 conferences',
          'Private events tailored for specific outcomes',
        ],
        tags: ['#Accelerators', '#Meetups', '#Conferences'],
      },
    },
    card2: {
      imageSrc: { sec47 },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#FCE7F6',
      content: {
        title: 'Projects Evaluation',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Perpetual loop of feedback from all the stakeholders on 9 key parameters sets a clear growth trajectory.',
        listItems: [
          'Establishing the funding team',
          'Setting the vision',
          'Solidifying the value proposition',
          'Validating an investable market',
          'Proving a profitable business model',
          'Moving beyond early adopters',
          'Hitting product-market fit',
          'Scaling up',
          'Exit in sight',
        ],
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Accelerators', '#Meetups', '#Conferences '],
      },
    },
    card3: {
      imageSrc: { incubation },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#FFFACD',
      content: {
        title: 'Incubation / GTM Services',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Stakeholders can provide various services to each other in exchange of value for themselves',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        listItems: [
          'Start your accelerator',
          'Tech & adult',
          'Legal & Finance',
          'Community & marketing',
        ],
        tags: ['#Onboarding', '#Comms', '#Knowledge '],
      },
    },
    card4: {
      imageSrc: { hubs },
      imageAlt: '',
      imageClass: 'pt-4 object-cover object-center max-w-[241px] max-h-[324px]',
      backgroundColor: '#FFF4ED',
      content: {
        title: 'Regional Hubs',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Find the peers and like-minded people wherever you are are a part of ICP HUBS Network',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        description2: 'Strengthen ties with innovators in your region.',
        tags: ['#Worldwide', '#Growth', '#Networking'],
      },
    },
    card5: {
      imageSrc: { multichain },
      imageAlt: '',
      imageClass: 'pt-4 object-cover object-center max-w-[241px] max-h-[324px]',
      backgroundColor: '#FDF4FF',
      content: {
        title: 'Multichain',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Build to scale beyond the limits of one ecosystem with the Chain Fusion',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',

        tags: ['#Decentralized', '#Open'],
      },
    },
    card6: {
      imageSrc: { reputation },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#F3FEE7',
      content: {
        title: 'Reputation',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Give and get feedback and ratings for your engagements with stakeholders that are recorded on chain, making them immutable. These help you grow your business.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Transparency', '#Relationship'],
      },
    },
    card7: {
      imageSrc: { sec51 },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#EFF4FF',
      content: {
        title: 'Opportunities',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Access exclusive opportunities, deals, jobs, and bounties across multiple geographies before they are open to the public',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Networking', '#Jobs', '#Recognition'],
      },
    },
    card8: {
      imageSrc: { sec48 },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#FAFAFA',
      content: {
        title: 'Communication',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Directly contact any stakeholder enrolled on this platform using the connect option on the platform. You can also publish your requirements/services for relevant stakeholders to contact you.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Messages', '#Connections'],
      },
    },
    card9: {
      imageSrc: { sec50 },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#E3E8EF',
      content: {
        title: 'Earn',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',

        listItems: [
          'Access curated deals',
          'Make & take investments',
          'Provide services to various stakeholders',
          'Be an early adopter, and get access to deals/opportunities before anyone else',
        ],
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Chance', '#Earn'],
      },
    },
    button: {
      text: 'Get started',
      class: 'bg-blue-500 text-white px-6 py-3 rounded-[4px] border-2',
      icon: 'ArrowForwardIcon',
    },
  },

  homepagesection5: {
    header: {
      textAlign: 'center',
      padding: '12',
      maxWidth: 'xl',
      button: {
        border: 'border border-blue-300',
        borderRadius: 'full',
        textColor: 'blue-500',
        paddingX: '4',
        text: 'Get started',
      },
      title: 'How it works',
      titleClass: 'text-3xl font-medium mb-4 mt-4',
      description:
        'Follow these simple steps to create, connect, and grow your network. Collaborate with experts and accelerate your journey toward success with ease and efficiency',
      descriptionClass: 'text-gray-600 mb-6 text-center',
    },
    image: {
      src: { man1 },
      alt: 'Statue',
      class: 'rounded-lg',
    },
    step1: {
      icon: { CreateProfileIcon },
      title: 'Create Profile',
      description:
        'Showcase your skills and stand out to potential opportunities.',
      iconBackground: '#F7B27A',
      textColor: 'white',
      titleClass: 'font-bold',
      descriptionClass: 'text-gray-600',
    },
    step2: {
      icon: { DiscoverAndConnetIcon },
      title: 'Discover & Connect',
      description:
        'Network with mentors, investors, and peers to build relationships.',
      iconBackground: '#F7B27A',
      textColor: 'white',
      titleClass: 'font-bold',
      descriptionClass: 'text-gray-600',
    },
    step3: {
      icon: { CollaborateIcon },
      title: 'Collaborate',
      description: 'Work together with innovators to bring your ideas to life.',
      iconBackground: '#F7B27A',
      textColor: 'white',
      titleClass: 'font-bold',
      descriptionClass: 'text-gray-600',
    },
    step4: {
      icon: { AccelerateIcon },
      title: 'Accelerate',
      description:
        'Access tools, funding, and mentorship to achieve your goals.',
      iconBackground: '#F7B27A',
      textColor: 'white',
      titleClass: 'font-bold',
      descriptionClass: 'text-gray-600',
    },
    button: {
      text: 'Get started',
      class: 'bg-blue-500 text-white px-6 py-3 rounded-[4px]',
    },
  },

  testimonials: [
    {
      text: "Using Olympus has been a game-changer for our team. The platform's simplicity and the quick customer support have truly exceeded our expectations.",
      name: 'Aaron King',
      title: 'Fund Manager, Infinity Capital',
      avatar: { TestAvatar },
      profile: { TestimonialProfile },
    },
    {
      text: 'Olympus provided us with all the tools we needed to grow our business. Their customer service is fantastic, and the platform is very user-friendly.',
      name: 'Emma Watson',
      title: 'CEO, Tech Innovators',
      avatar: { TestAvatar },
      profile: { TestimonialProfile },
    },
  ],

  accordionData: [
    {
      title: 'What is ICP Olympus ?',
      content:
        'ICP Olympus is a collaborative platform connecting users, mentors, investors, and projects to foster innovation and growth. ',
    },
    {
      title: 'Who can use ICP Olympus?',
      content:
        'The platform is designed for users, mentors, investors, and project creators, each playing a unique role in the ecosystem.',
    },
    {
      title: 'What is the role of a mentor?',
      content:
        'Mentors guide projects, create cohorts, and associate with investors and projects to provide expertise and support.',
    },
    {
      title: 'How can investors associate with projects?',
      content:
        'Investors can browse projects, evaluate them, and associate by providing funding or resources.',
    },
    {
      title: 'How do I get started on ICP Olympus?',
      content:
        'Simply sign up, select your role, and start exploring or associating with projects, mentors, or cohorts.',
    },
    {
      title: 'What if I face issues while using the platform?',
      content:
        'You can contact our support team via the "Help" section or email us at support@icpolympus.com.',
    },
  ],

  footer: {
    headline: 'Join Olympus and reach the top. Get started today!',
    buttonText: 'Get started',
    logo: { logo },
    mailicon: { MailOutlineIcon },
    description:
      'Empowering innovators to achieve greatness and redefine the future together.',
    explore: {
      title: 'Explore',
      items: ['Projects', 'Investors', 'Mentors', 'Talent', 'Accelerators'],
    },
    company: {
      title: 'Company',
      items: ['About us', 'Careers', 'Roadmap', 'Contact'],
    },
    resources: {
      title: 'Resources',
      items: ['Blog', 'Events', 'FAQ'],
    },
    newsletter: {
      title: 'Newsletter',
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
    },
    rightsText: 'Olympus Inc. All rights reserved.',
    policies: [
      'Terms of use',
      'Cookie policy',
      'Privacy policy',
      'COPYRIGHT_YEAR',
    ],
    socialLinks: {},
  },
};

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
      backedByText: 'Backed by',
      dfLogo: '../../../assets/Logo/df_logo.png',
      mainHeading: 'The Peak of Web3 Acceleration',
      highlightedText: 'Web3',
      description:
        'OLYMPUS is the first on-chain Web3 acceleration platform connecting founders, investors, mentors and talents across different ecosystems.',
      buttonText: 'Get started',
    },
  },

  homepagesection2: {
    aboutText: 'About',
    arrowForwardIcon: { ArrowForwardIcon },
    mainHeading: 'The Web3 Ecosystem Launchpad',
    description:
      'Empowering innovators, entrepreneurs, and visionaries to build, scale, and thrive in the dynamic Web3 ecosystem. Discover tools, connections, and opportunities to unlock the future of decentralized success.',
    card1: {
      title: 'Founders',
      image: { Founder },
      description:
        'Bring your vision to life with Olympus. Founders can create and manage projects seamlessly, build teams, and share key resources.',
      list: [
        'Launch and manage innovative projects.',
        'Upload key documents and whitepapers.',
        'Build and lead strong teams.',
        'Connect with investors and mentors.',
      ],
      bgColor: '#E0F2FE',
    },
    card2: {
      title: 'Investors',
      image: { Investor },
      description:
        'Fuel innovation by investing in high-potential projects. Investors connect with projects directly to enable growth and success.',
      list: [
        'Invest in high-potential projects.',
        'Review whitepapers and tokenomics.',
        'Connect with innovative project teams.',
        'Support future-focused ideas.',
      ],
      bgColor: '#FEF0C7',
    },
    card3: {
      title: 'Mentors',
      image: { MentorsImage },
      description:
        'Shape the future by guiding projects and sharing your expertise. Mentors can create cohorts and host events to nurture talent.',
      list: [
        'Guide projects with your expertise.',
        'Host cohorts and impactful events.',
        'Partner with aligned projects.',
        'Empower founders to succeed.',
      ],
      bgColor: '#FDEAD7',
    },
    card4: {
      title: 'Talent',
      image: { Talents },
      description:
        'Join the Olympus community to showcase your skills and connect with projects that align with your ambitions. Empower yourself and accelerate your growth.',
      list: [
        'Showcase skills to find opportunities.',
        'Join innovative Web3 projects.',
        'Collaborate with founders and mentors.',
        'Advance your career in Web3.',
      ],
      bgColor: '#CCFBEF',
    },
    buttonText: 'Get started',
  },

  homepagesection3: {
    backgroundColor: 'white',
    paragraph1: {
      text: 'Our mission is to ',
      highlightedText: {
        text: 'empower founders',
        backgroundColor: 'blue-400',
      },
    },
    paragraph2: {
      text: ' with the resources and connections to bring their bold visions to life. We ',
      highlightedText2: {
        text: 'inspire investors',
        backgroundColor: 'orange-400',
      },
    },

    paragraph3: {
      text: ' to fuel innovation. We ',
      highlightedText3: {
        text: 'unite mentors',
        backgroundColor: 'red-400',
      },
    },

    paragraph4: {
      text: ' and ',
      highlightedText4: {
        text: 'foster talent',
        backgroundColor: 'green-400',
      },
    },
    paragraph5: {
      text: ' in a shared passion for building a decentralized future.',
    },

    paragraph6: {
      text: 'Together, we will redefine what’s possible and forge a new era of digital empowerment.',
    },
  },

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
        'Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra massa fringilla. Malesuada blandit integer quis tellus.',
      descriptionClass: 'text-gray-600 mb-10',
    },
    card1: {
      imageSrc: { sec41 },
      imageAlt: '',
      imageClass: 'py-4 object-cover object-center max-w-[241px] max-h-[407px]',
      backgroundColor: '#EEF2F6',
      content: {
        title: 'Global events',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Participate in exclusive meetups, conferences, and global networking opportunities.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        description2:
          'Gain insights from industry-leading experts and pioneers.',
        tags: ['#Accelerators', '#Meetups', '#Conferences'],
      },
    },
    card2: {
      imageSrc: { sec42 },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#FCE7F6',
      content: {
        title: 'AI Concierge',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Leverage AI tools to simplify processes, boost productivity, and enhance efficiency.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Onboarding', '#Comms', '#Knowledge '],
      },
    },
    card3: {
      imageSrc: { sec42 },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#FFFACD',
      content: {
        title: 'Perks',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Unlock exclusive benefits, premium tools, and resources for personal and project growth.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
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
          'Connect with local communities, accelerators, and regional networks to expand reach.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        description2: 'Strengthen ties with innovators in your region.',
        tags: ['#Accelerators', '#Meetups', '#Conferences'],
      },
    },
    card5: {
      imageSrc: { hubs },
      imageAlt: '',
      imageClass: 'pt-4 object-cover object-center max-w-[241px] max-h-[324px]',
      backgroundColor: '#FDF4FF',
      content: {
        title: 'Multichain',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Operate seamlessly across multiple blockchain ecosystems with full interoperability support.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        description2: 'Expand your reach with full multichain support.',
        tags: ['#Accelerators', '#Meetups', '#Conferences'],
      },
    },
    card6: {
      imageSrc: { sec42 },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#F3FEE7',
      content: {
        title: 'Reputation',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Showcase achievements, verify contributions, and boost credibility within the Web3 ecosystem.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Onboarding', '#Comms', '#Knowledge '],
      },
    },
    card7: {
      imageSrc: { sec47 },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#EFF4FF',
      content: {
        title: 'Opportunities',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Explore exciting career paths and projects to advance your goals and vision.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Onboarding', '#Comms'],
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
          'Streamline connections, collaboration, and communication with intuitive, efficient tools.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Onboarding', '#Comms'],
      },
    },
    card9: {
      imageSrc: { sec49 },
      imageAlt: '',
      imageClass: 'object-cover object-center',
      backgroundColor: '#E3E8EF',
      content: {
        title: 'Bounties',
        titleClass: 'text-3xl font-custom text-[#121926] pb-2',
        description:
          'Earn rewards by contributing to projects, solving challenges, and completing tasks effectively.',
        descriptionClass: 'pb-6 text-xs font-normal text-[#4B5565]',
        tags: ['#Onboarding', '#Comms'],
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
    policies: ['Terms of use', 'Cookie policy', 'Privacy policy'],
    socialLinks: {},
  },
};

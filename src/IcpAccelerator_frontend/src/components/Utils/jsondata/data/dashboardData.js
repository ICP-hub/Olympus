import { AccountCircle, Star, Menu , Close, Group,SearchOutlined, InfoOutlined, StarBorderOutlined} from '@mui/icons-material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import nodata from "../../../../../assets/images/nodata.png"
import ProfileImage from "../../../../../assets/Logo/ProfileImage.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import df_small_logo from "../../../../../assets/Logo/NavbarSmallLogo.png";
import Bellicon from "../../../../../assets/Logo/Bellicon.png";
import olympuslogo from "../../../../../assets/Logo/topLogo.png";
import df_bigLogo from "../../../../../assets/Logo/bigLogo.png";
import { afterCopySvg } from "../../../../component/Utils/Data/SvgData";
import { beforeCopySvg } from "../../../../component/Utils/Data/SvgData";
import {
  briefcaseSvgIcon,
  calenderSvgIcon,
  homeSvgIcon,
  locationHubSvgIcon,
  staroutlineSvgIcon,
  userCircleSvgIcon,
  userSvgIcon,
} from "../../../Utils/Data/SvgData";

export const dashboard={
    "dashboardHomeProfileCards":{
    "mainProfileCard": {
      "title": "Main profile",
      "buttonText": "Manage >",
      "progressBarWidth": "35%",
      "profileImage": {ProfileImage},
      "badge": {
        "text": "OLYMPIAN",
        "verifiedIcon":{VerifiedIcon},
        "style": {
          "bgColor": "#F0F9FF",
          "borderColor": "#B9E6FE",
          "textColor": "#026AA2",
          "fontSize": "text-xs",
          "fontWeight": "font-semibold"
        }
      },
      "name": "Matt Bowers",
      "username": "@mattbowers",
      
    },
    "ratingCard": {
      "title": "Rating",
      "buttonText": "View details >",
      "icon": {HelpOutlineOutlinedIcon},
      "iconColor": "text-gray-400",
      // "svg": (<svg
      // className="text-gray-200 w-20 h-20 mb-4"
      // viewBox="0 0 24 24"
      // fill="none"
      // xmlns="http://www.w3.org/2000/svg">
      //   <path
      //   d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      //   stroke="currentColor"
      //   strokeWidth="1"
      //   strokeLinecap="round"
      //   strokeLinejoin="round"
      //   />
      // </svg>),
      "noRatingsText": "No ratings yet",
      "description": "Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit."
    },
    "rolesCard": {
      "title": "Roles",
      "buttonText": "Manage ",
      "icon": {HelpOutlineOutlinedIcon},
      "iconColor": "text-gray-400",
      "roleIcons": 
        {
          "icon": {PersonOutlineOutlinedIcon},
        },
    },
    "noDataImage": {nodata}
},
    "dashboardhomenavbar" :  {
  "logoImages": {
    "bigLogo": {df_bigLogo},
    "olympuslogo": {olympuslogo},
    "df_small_logo": {df_small_logo},
    "bellicon": {Bellicon}
  },
  "icons": {
    "searchOutlined": {SearchOutlined},
    "mailOutline": "MailOutline",
    "notificationsNone": "NotificationsNone",
    "menuIcon": {Menu},
    "closeIcon": {Close},
    "dashboardIcon": {homeSvgIcon},
    "profileIcon": {userCircleSvgIcon},
    "usersIcon": {userSvgIcon},
    "eventsIcon": {calenderSvgIcon},
    "regionalHubsIcon": {locationHubSvgIcon},
    "jobsIcon": {briefcaseSvgIcon},
    "perksIcon": {staroutlineSvgIcon}
  },
  "svgIcons": {
    "briefcaseSvgIcon": "briefcaseSvgIcon",
    "calenderSvgIcon": "calenderSvgIcon",
    "homeSvgIcon": "homeSvgIcon",
    "locationHubSvgIcon": "locationHubSvgIcon",
    "staroutlineSvgIcon": "staroutlineSvgIcon",
    "userCircleSvgIcon": "userCircleSvgIcon",
    "userSvgIcon": "userSvgIcon",
    "afterCopySvg": "afterCopySvg",
    "beforeCopySvg": "beforeCopySvg"
  },
  "navbarTexts": {
    "searchPlaceholder": "Search people, projects, jobs, events",
    "principalLabel": "Principal:",
    "principalCopiedSuccessMessage": "Principal copied to clipboard!",
    "profileText": "Profile",
    "myProfileText": "My Profile",
    "signOutText": "Sign out"
  },
  "menuTexts": {
    "dashboard": "Dashboard",
    "profile": "Profile",
    "users": "Users",
    "events": "Events",
    "regionalHubs": "Regional Hubs",
    "jobs": "Jobs",
    "perks": "Perks",
    "searchPlaceholder": "Search"
  }
},
 "dashboardhomesidebar": {
  "logoImages": {
    "topLogo": "../../../../assets/Logo/topLogo.png"
  },
  
  "svgIcons": {
    "briefcaseSvgIcon": "briefcaseSvgIcon",
    "calenderSvgIcon": "calenderSvgIcon",
    "gridSvgIcon": "gridSvgIcon",
    "homeSvgIcon": "homeSvgIcon",
    "locationHubSvgIcon": "locationHubSvgIcon",
    "starSvgIcon": "star",
    "staroutlineSvgIcon": "staroutlineSvgIcon",
    "userCircleSvgIcon": "userCircleSvgIcon",
    "userSvgIcon": "userSvgIcon"
  },
  "sidebarSections": {
    "dashboard": {
      "label": "Dashboard",
      "icon": "homeSvgIcon",
      "link": "/dashboard"
    },
    "identity": {
      "label": "IDENTITY",
      "items": 
        {
          "label": "Profile",
          "icon": "userCircleSvgIcon",
          "link": "/dashboard/profile"
        }
      
    },
    "projects": {
      "label": "PROJECTS",
      "items": 
        {
          "label1": "Cyperhunk Labs",
          "label2": "Create new Project",
          "icon": "gridSvgIcon",
         
        },
    },
    "mentors": {
      "label": "MENTOR",
      "items": 
        {
          "label1": "Cyperhunk Labs",
          "label2": "Create new Mentor",
          "icon": "gridSvgIcon",
         
        },
    },
    "investors": {
      "label": "INVESTOR",
      "items": 
        {
          "label1": "Cyperhunk Labs",
          "label2": "Create new Investor",
          "icon": "gridSvgIcon",
         
        },
    },
    "discover": {
      "label": "DISCOVER",
      "items": 
        {
          "user": "Users",
          "events": "Events",
          "hub": "Regional Hubs",
          "jobs": "Jobs",
          "perks": "Perks",
          
        },
  
    }
  }
},
"dashboardwelcomesection" :{
  "welcome":"Welcome",
  "dismiss":"Dismiss",
  "actionCards":[
  {
    title: 'Complete profile',
    description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.',
    // progress: profileCompletion,
    action: 'Complete profile',
  },
  {
    title: 'Explore platform',
    description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.',
    action: 'Discover',
    dismissable: true,
  },
  {
    title: 'Verify identity',
    description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.',
    action: 'Take KYC',
    // icon: KYCfileIcon,
  },
  {
    title: 'Create new role',
    description: 'Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.',
    action: 'Create role',
    dismissable: true,
    imageGroup: true, // Adding a flag to indicate that this card should have the image group
  }]
  
}



  }
  
import { AccountCircle, Star, Group, InfoOutlined, StarBorderOutlined} from '@mui/icons-material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import nodata from "../../../../assets/images/nodata.png"
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import VerifiedIcon from "@mui/icons-material/Verified";

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
}
  }
  
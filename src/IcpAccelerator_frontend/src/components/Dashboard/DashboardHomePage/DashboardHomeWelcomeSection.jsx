import React, { useState ,useEffect} from 'react';
import KYCfileIcon from "../../../../assets/Logo/KYCfileIcon.png";
import DashboardHomeProfileCards from './DashboardHomeProfileCards';
import mentor from "../../../../assets/Logo/mentor.png";
import talent from "../../../../assets/Logo/talent.png";
import founder from "../../../../assets/Logo/founder.png";
import Avatar3 from "../../../../assets/Logo/Avatar3.png";
import { dashboard } from "../../Utils/jsondata/data/dashboardData";
import { useSelector,useDispatch } from 'react-redux';
import Modal1 from '../../Modals/ProjectModal/Modal1';
import { useNavigate } from 'react-router-dom';
import { Principal } from "@dfinity/principal";
import Tooltip from '@mui/material/Tooltip';
import { getCurrentRoleStatusFailureHandler, setCurrentActiveRole, setCurrentRoleStatus } from '../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer';

const styles = {
  circularChart: {
    display: 'block',
    margin: '10px auto',
    maxWidth: '80%',
    maxHeight: '250px',
  },
  circleBg: {
    fill: 'none',
    stroke: '#eee',
    strokeWidth: 4.5,
  },
  circle: {
    fill: 'none',
    strokeWidth: 4.5,
    strokeLinecap: 'round',
    animation: 'progress 1s ease-out forwards',
  },
  percentage: {
    fill: '#666',
    fontFamily: 'sans-serif',
    fontSize: '0.5em',
    textAnchor: 'middle',
  },
  '@keyframes progress': {
    '0%': {
      strokeDasharray: '0 100',
    },
  },
  imageGroup: {
    width: '20px',  // Adjust size as needed
    height: '20px', // Adjust size as needed
  },
};

function DashboardHomeWelcomeSection({ userName, profileCompletion }) {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const { dashboardwelcomesection } = dashboard
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  console.log("USER DATA FROM REDUX IS ", userFullData);
  const projectFullData = useSelector(
    (currState) => currState.projectData.data[0]
  );
  const mentorFullData = useSelector(
    (currState) => currState.mentorData.data[0]
  );
  const investorFullData = useSelector(
    (currState) => currState.investorData.data[0]
  );
  const mentorCompletion = mentorFullData?.[0].profile_completion;
  const projectCompletion = projectFullData?.[0].profile_completion;
  const investorCompletion = investorFullData?.[0].profile_completion
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const dispatch = useDispatch();
  const [usercompletionPercentage, setCompletionPercentage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const convertedPrincipal = await Principal.fromText(principal);
      console.log("convertedPrincipal", convertedPrincipal);
      try {
        const data = await actor.get_user_info_using_principal(
          convertedPrincipal
        );
        console.log("Received data in user update:", data);
        if (data.length > 0) {
          setCompletionPercentage(data[0].profile_completion);
        }
        setResult(data); 
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    if (actor) {
      fetchUserData();
    }
  }, [actor]);

console.log("USERFULLDATA", userFullData);

const getCompletionPercentage = (role) => {
  const completionPercentages = {
    user: usercompletionPercentage,
    mentor: mentorCompletion,
    project: projectCompletion,
    vc: investorCompletion,
  };
  return completionPercentages[role] || 0;
};

const completionPercentagetoRender = getCompletionPercentage(
  userCurrentRoleStatusActiveRole
);
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  const actionCards = [
    {
      title: "Complete profile",
      description:
        "Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.",
      progress: ["user", "mentor", "project", "vc"].includes(
        userCurrentRoleStatusActiveRole
      )
        ? completionPercentagetoRender
        : undefined,
      action: "Complete profile",
    },
    {
      title: "Explore platform",
      description:
        "Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.",
      action: "Discover",
      dismissable: true,
    },
    {
      title: "Verify identity",
      description:
        "Coming soon",
      action: "Take KYC",
      icon: KYCfileIcon,
      disabled: true,
      tooltip: "Coming soon", 

    },
    {
      title: "Create new role",
      description:
        "Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.",
      action: "Create role",
      dismissable: true,
      imageGroup: true, // Adding a flag to indicate that this card should have the image group
    },
  ];
  const navigate = useNavigate();

const handleButtonClick = (action) => {
  if (action === 'Create role') {
    setRoleModalOpen(prevState => !prevState);
  }
  else if (action === 'Discover') {
    navigate("/dashboard/user");
  }
  else if (action === 'Complete profile') {
    navigate("/dashboard/profile");
  }
};

  function formatFullDateFromBigInt(bigIntDate) {
    const date = new Date(Number(bigIntDate / 1000000n));
    const dateString = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${dateString}`;
  }

  function cloneArrayWithModifiedValues(arr) {
    return arr.map((obj) => {
      const modifiedObj = {};

      Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          if (
            key === "approved_on" ||
            key === "rejected_on" ||
            key === "requested_on"
          ) {
            // const date = new Date(Number(obj[key][0])).toLocaleDateString('en-US');
            const date = formatFullDateFromBigInt(obj[key][0]);
            modifiedObj[key] = date; // Convert bigint to string date
          } else {
            modifiedObj[key] = obj[key][0]; // Keep the first element of other arrays unchanged
          }
        } else {
          modifiedObj[key] = obj[key]; // Keep other keys unchanged
        }
      });

      return modifiedObj;
    });
  }

  const initialApi = async () => {
    try {
      const currentRoleArray = await actor.get_role_status();
      if (currentRoleArray && currentRoleArray.length !== 0) {
        const currentActiveRole = getNameOfCurrentStatus(currentRoleArray);
        dispatch(
          setCurrentRoleStatus(cloneArrayWithModifiedValues(currentRoleArray))
        );
        dispatch(setCurrentActiveRole(currentActiveRole));
      } else {
        dispatch(
          getCurrentRoleStatusFailureHandler(
            "error-in-fetching-role-at-dashboard"
          )
        );
        dispatch(setCurrentActiveRole(null));
      }
    } catch (error) {
      dispatch(getCurrentRoleStatusFailureHandler(error.toString()));
      dispatch(setCurrentActiveRole(null));
    }
  };

  useEffect(() => {
    if (actor) {
      if (!userCurrentRoleStatus.length) {
        initialApi();
      } else if (
        userCurrentRoleStatus.length === 4 &&
        userCurrentRoleStatus[0]?.status === "default"
      ) {
        navigate("/register-user");
      } else {
      }
    }
  }, [actor, dispatch, userCurrentRoleStatus, userCurrentRoleStatusActiveRole]);
  return (
    <>
      <div className="bg-white rounded-lg p-6 mb-6 pt-1">
        <h1 className="text-3xl font-bold mb-6 mt-6 pl-3">
          {dashboardwelcomesection.welcome}, {userFullData?.full_name}!
        </h1>
        <div className="overflow-x-auto">
          <div className="flex gap-6 my-1">
            {actionCards.map((card, index) => (
                <Tooltip
                key={index}
                title={card.disabled ? card.tooltip : ""}
                arrow
              >
              {/* <div
                key={index}
                className="bg-[#F8FAFC] rounded-lg p-4 relative flex flex-col  md:w-[330px] w-[280px] h-[226px] flex-shrink-0 shadow-lg"
              > */}
                <div
                  className={`bg-[#F8FAFC] rounded-lg p-4 relative flex flex-col md:w-[330px] w-[280px] h-[226px] flex-shrink-0 shadow-lg ${
                    card.disabled ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow pr-4">
                    <h3 className="text-md text-[#121926] font-semibold mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#4B5565] line-clamp-3 hover:line-clamp-6  ">
                      {card.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {card.progress && (
                      <div className="w-20 h-16">
                        <svg viewBox="0 0 36 36" style={styles.circularChart}>
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            style={styles.circleBg}
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            style={{
                              ...styles.circle,
                              stroke: "#4CAF50",
                              strokeDasharray: `${card.progress}, 100`,
                            }}
                          />
                          <text
                            x="18"
                            y="20.35"
                            className=" font-bold"
                            style={styles.percentage}
                          >
                            {card.progress}%
                          </text>
                        </svg>
                      </div>
                    )}
                    {card.icon && (
                      <img
                        src={card.icon}
                        alt="KYC Icon"
                        className="w-14 h-14 object-contain"
                      />
                    )}
                    {card.imageGroup && (
                      <div className="w-14 pt-2">
                        <div className="relative  mx-auto w-[30px] h-[30px]  ">
                          <div className="absolute top-0 left-0 transform translate-x-1/4 -translate-y-1/4 ">
                            <img
                              src={mentor}
                              alt="Image 1"
                              className="rounded-full  "
                            />
                          </div>
                          <div className="absolute top-0 right-0 transform -translate-x-1/4 -translate-y-1/4">
                            <img
                              src={founder}
                              alt="Image 2"
                              className="rounded-full "
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 transform translate-x-1/4 translate-y-1/4 ">
                            <img
                              src={founder}
                              alt="Image 3"
                              className="rounded-full "
                            />
                          </div>
                          <div className="bottom-0 right-0 transform -translate-x-1/4 translate-y-1/4">
                            <img
                              src={talent}
                              alt="Image 4"
                              className="rounded-full "
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-auto pt-4 flex items-center space-x-2">
                  <button
                    className="bg-white border-2 border-[#CDD5DF] text-[#364152] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => handleButtonClick(card.action)}
                  >
                    {card.action}
                  </button>
                  {card.dismissable && (
                    <button className="text-[#4B5565] hover:text-gray-600 text-sm">
                      {dashboardwelcomesection.dismiss}
                    </button>
                  )}
                </div>
              </div>
              </Tooltip>
            ))}
            
          </div>
        </div>
      </div>
      <DashboardHomeProfileCards percentage={usercompletionPercentage} />
      {roleModalOpen && (
        <Modal1
          isOpen={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
        />
      )}
    </>
  );
}

export default DashboardHomeWelcomeSection;
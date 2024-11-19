import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import NoData from '../../NoDataCard/NoData';
import { useSelector } from 'react-redux';
import GeneralProfileInfo from './AssociationRoleInfo/GeneralProfileInfo';
import AssociationProjectInfo from './AssociationRoleInfo/AssociationProjectInfo';
import AssociationProjectDetailsinfo from './AssociationRoleInfo/AssociationProjectDetailsinfo';
import AssociationMentorInfo from './AssociationRoleInfo/AssociationMentorInfo';
import AssociationMentorDetailsInfo from './AssociationRoleInfo/AssociationMentorDetailsInfo';
import AssociationInvestorInfo from './AssociationRoleInfo/AssociationInvestorInfo';
import AssociationInvestorDetailsInfo from './AssociationRoleInfo/AssociationInvestorDetailsInfo';
import AssociationProfileCard from './AssociationRoleInfo/AssociationProfileCard';

const AssociationOfferModal = ({
  openDetail,
  setOpenDetail,
  user,
  selectedTypeData,
  activeTabData,
}) => {
  console.log('user', user);
  const userCurrentRoleStatusActiveRole = useSelector(
    (state) => state.currentRoleStatus.activeRole
  );

  const [activeSideTab, setActiveSideTab] = useState('general');

  useEffect(() => {
    document.body.style.overflow = openDetail ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openDetail]);

  const generateConfig = (role) => {
    switch (role) {
      case 'project':
        return [
          AssociationProfileCard,
          GeneralProfileInfo,
          AssociationProjectInfo,
          AssociationProjectDetailsinfo,
          ['general', 'project'],
        ];
      case 'mentor':
        return [
          AssociationProfileCard,
          GeneralProfileInfo,
          AssociationMentorInfo,
          AssociationMentorDetailsInfo,
          ['general', 'mentor'],
        ];
      case 'investor':
        return [
          AssociationProfileCard,
          GeneralProfileInfo,
          AssociationInvestorInfo,
          AssociationInvestorDetailsInfo,
          ['general', 'investor'],
        ];
      default:
        return [];
    }
  };

  const renderConfig = {
    project: {
      pending: {
        'to-mentor': generateConfig('project'),
        'from-mentor': generateConfig('mentor'),
        'to-investor': generateConfig('project'),
        'from-investor': generateConfig('investor'),
      },
      approved: {
        'to-mentor': generateConfig('project'),
        'from-mentor': generateConfig('mentor'),
        'to-investor': generateConfig('project'),
        'from-investor': generateConfig('investor'),
      },
      declined: {
        'to-mentor': generateConfig('project'),
        'from-mentor': generateConfig('mentor'),
        'to-investor': generateConfig('project'),
        'from-investor': generateConfig('investor'),
      },
      'self-reject': {
        'to-mentor': generateConfig('project'),
        'from-mentor': generateConfig('mentor'),
        'to-investor': generateConfig('project'),
        'from-investor': generateConfig('investor'),
      },
    },
    mentor: {
      pending: {
        'to-project': generateConfig('mentor'),
        'from-project': generateConfig('project'),
      },
      approved: {
        'to-project': generateConfig('mentor'),
        'from-project': generateConfig('project'),
      },
      declined: {
        'to-project': generateConfig('mentor'),
        'from-project': generateConfig('project'),
      },
      'self-reject': {
        'to-project': generateConfig('mentor'),
        'from-project': generateConfig('project'),
      },
    },
    vc: {
      pending: {
        'to-project': generateConfig('investor'),
        'from-project': generateConfig('project'),
      },
      approved: {
        'to-project': generateConfig('investor'),
        'from-project': generateConfig('project'),
      },
      declined: {
        'to-project': generateConfig('investor'),
        'from-project': generateConfig('project'),
      },
      'self-reject': {
        'to-project': generateConfig('investor'),
        'from-project': generateConfig('project'),
      },
    },
  };

  const getComponentsAndTabs = () => {
    const roleConfig = renderConfig[userCurrentRoleStatusActiveRole];
    const statusConfig = roleConfig ? roleConfig[activeTabData] : null;
    const components = statusConfig ? statusConfig[selectedTypeData] : null;

    // Check if components exist and are in the expected format
    if (components && Array.isArray(components)) {
      const possibleTabs = components[components.length - 1];

      // Verify if the last item is indeed an array of tabs
      if (Array.isArray(possibleTabs)) {
        return { components: components.slice(0, -1), tabs: possibleTabs };
      } else {
        return { components, tabs: [] };
      }
    }

    // Fallback if components are not in the expected format
    return { components: null, tabs: [] };
  };

  const { components = [], tabs = [] } = getComponentsAndTabs();
  // useEffect(() => {
  //   if (tabs &&tabs.length > 0) {
  //     setActiveSideTab(tabs[0]); // Set the initial tab to the first available tab
  //   }
  // }, [tabs]);
  console.log('components', components);
  console.log('tabs', tabs);
  const renderContent = () => {
    if (!components) return <NoData />;

    return (
      <div className='container mx-auto h-full pb-8 px-4 sm:px-2 overflow-y-scroll'>
        <div className='flex flex-col lg:flex-row gap-4 justify-evenly'>
          <div className='border rounded-lg w-full lg:w-[32%]'>
            <AssociationProfileCard user={user} />
            <div className='bg-white p-4'>
              <div className='flex justify-start border-b mb-4'>
                {tabs &&
                  tabs?.map(
                    (tab) => (
                      console.log('tab', tab),
                      (
                        <button
                          key={tab}
                          className={`px-4 py-2 focus:outline-none font-medium ${activeSideTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
                          onClick={() => setActiveSideTab(tab)}
                        >
                          {tab?.charAt(0).toUpperCase() + tab?.slice(1)}
                        </button>
                      )
                    )
                  )}
              </div>
              {activeSideTab === 'general' &&
                components.includes(GeneralProfileInfo) && (
                  <GeneralProfileInfo user={user} />
                )}
              {activeSideTab === 'project' &&
                components.includes(AssociationProjectInfo) && (
                  <AssociationProjectInfo user={user} />
                )}
              {activeSideTab === 'mentor' &&
                components.includes(AssociationMentorInfo) && (
                  <AssociationMentorInfo user={user} />
                )}
              {activeSideTab === 'investor' &&
                components.includes(AssociationInvestorInfo) && (
                  <AssociationInvestorInfo user={user} />
                )}
            </div>
          </div>

          <div className='lg:w-[63%]'>
            <div className='md:block'>
              {activeSideTab === 'project' &&
                components.includes(AssociationProjectDetailsinfo) && (
                  <AssociationProjectDetailsinfo user={user} />
                )}
              {activeSideTab === 'mentor' &&
                components.includes(AssociationMentorDetailsInfo) && (
                  <AssociationMentorDetailsInfo user={user} />
                )}
              {activeSideTab === 'investor' &&
                components.includes(AssociationInvestorDetailsInfo) && (
                  <AssociationInvestorDetailsInfo user={user} />
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div
      className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-300 ease-in-out ${
        openDetail ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div
        className={`mx-auto w-full sm:w-[70%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-300 ease-in-out ${
          openDetail ? 'translate-x-0' : 'translate-x-full'
        } z-20`}
      >
        <div className='p-2 mb-2'>
          <CloseIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => setOpenDetail(false)}
          />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AssociationOfferModal;

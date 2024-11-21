import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactSelect from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { useCountries } from 'react-countries';
import editp from '../../../assets/Logo/edit.png';
import { allHubHandlerRequest } from '../StateManagement/Redux/Reducers/All_IcpHubReducer';
import { ThreeDots } from 'react-loader-spinner';
import parse from 'html-react-parser';
import { toast, Toaster } from 'react-hot-toast';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { founderRegisteredHandlerRequest } from '../StateManagement/Redux/Reducers/founderRegisteredData';
import getReactSelectUpdateStyles from '../Utils/navigationHelper/getReactSelectUpdateStyles';
import { validationSchema } from '../Modals/ProjectRegisterModal/projectValidation';
import getSocialLogo from '../Utils/navigationHelper/getSocialLogo';
import ProjectDescriptionEdit from './ProjectDescriptionEdit';
import getPlatformFromHostname from '../Utils/navigationHelper/getPlatformFromHostname';
import { useNavigate } from 'react-router-dom';
import CompressedImage from '../ImageCompressed/CompressedImage';
import { fileSchema } from './validationLogoAndCover';
import ProjectDetailSkeleton from './ProfileEditSkeleton/ProjectDetailSkeleton';

const ProjectDetail = forwardRef(
  (
    {
      logoPreview,
      setLogoPreview,
      logoData,
      setLogoData,
      coverPreview,
      setCoverPreview,
      coverData,
      setCoverData,
    },
    ref
  ) => {
    const {
      register,
      handleSubmit,
      clearErrors,
      setValue,
      setError,
      watch,
      control,
      getValues,
      trigger,
      formState: { errors, isSubmitting },
    } = useForm({
      resolver: yupResolver(validationSchema),
      mode: 'all',
      defaultValues: {
        upload_public_documents: false,
        publicDocs: [],
        upload_private_documents: false,
        privateDocs: [],
        weekly_active_users: 0,
        revenue: 0,
        money_raised_till_now: false,
        icp_grants: 0,
        investors: 0,
        raised_from_other_ecosystem: 0,
      },
    });
    const actor = useSelector((currState) => currState.actors.actor);
    const areaOfExpertise = useSelector(
      (currState) => currState.expertiseIn.expertise
    );
    const navigate = useNavigate();
    const [isLogoEditing, setIsLogoEditing] = useState(false);
    const [isCoverEditing, setIsCoverEditing] = useState(false);

    const typeOfProfile = useSelector(
      (currState) => currState.profileTypes.profiles
    );
    const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
    const multiChainNames = useSelector((currState) => currState.chains.chains);

    const [interestedDomainsOptions, setInterestedDomainsOptions] = useState(
      []
    );
    const [
      interestedDomainsSelectedOptions,
      setInterestedDomainsSelectedOptions,
    ] = useState([]);
    const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
    const projectFullData = useSelector(
      (currState) => currState.projectData.data
    );
    const [reasonOfJoiningOptions, setReasonOfJoiningOptions] = useState([
      {
        value: 'listing_and_promotion',
        label: 'Project listing and promotion',
      },
      { value: 'Funding', label: 'Funding' },
      { value: 'Mentoring', label: 'Mentoring' },
      { value: 'Incubation', label: 'Incubation' },
      {
        value: 'Engaging_and_building_community',
        label: 'Engaging and building community',
      },
      { value: 'Jobs', label: 'Jobs' },
    ]);
    const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
      useState([]);
    const [multiChainOptions, setMultiChainOptions] = useState([]);
    const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
      []
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
      setIsModalOpen(true); // Open the modal when edit icon is clicked
      handleEditClick('project_description');
    };

    const [editMode, setEditMode] = useState({});

    const { countries } = useCountries();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(
      (currState) => currState.internet.isAuthenticated
    );
    const projectId = projectFullData?.[0]?.[0]?.uid;

    useEffect(() => {
      dispatch(allHubHandlerRequest());
    }, [dispatch]);

    useEffect(() => {
      if (isAuthenticated) {
        dispatch(founderRegisteredHandlerRequest());
      }
    }, [isAuthenticated, dispatch]);

    const [socialLinks, setSocialLinks] = useState({});
    const [isEditingLink, setIsEditingLink] = useState({});
    const [isLinkBeingEdited, setIsLinkBeingEdited] = useState(false);
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'links',
    });

    const handleSaveLink = (key) => {
      setIsEditingLink((prev) => ({
        ...prev,
        [key]: false, // Exit editing mode for the saved link
      }));
    };

    // Handle adding new link from form field
    const handleSaveNewLink = (data, index) => {
      const linkKey = `custom-link-${Date.now()}-${index}`; // Generate unique key
      setSocialLinks((prevLinks) => ({
        ...prevLinks,
        [linkKey]: data, // Add new link to socialLinks state
      }));
      remove(index); // Remove the field after saving
    };

    // Toggle the editing of individual links
    const handleLinkEditToggle = (key) => {
      setIsEditingLink((prev) => ({
        ...prev,
        [key]: !prev[key], // Toggle the edit state for each link
      }));
      setIsLinkBeingEdited(!isLinkBeingEdited);
    };

    // Handle changes to individual links
    const handleLinkChange = (e, key) => {
      setSocialLinks((prev) => ({
        ...prev,
        [key]: e.target.value, // Update the specific link's value
      }));
    };

    // Handle deletion of existing links
    const handleLinkDelete = (key) => {
      setSocialLinks((prev) => {
        const updatedLinks = { ...prev };
        delete updatedLinks[key]; // Remove the link
        return updatedLinks;
      });
    };
    const onSubmitHandler = async (data) => {
      console.log('on submit data ....', data);
      const updatedSocialLinks = Object.entries(socialLinks).map(
        ([key, value]) => ({
          link: value ? [value] : [],
        })
      );
      // Convert project_area_of_focus array to a comma-separated string

      const reasonToJoinString = Array.isArray(data.reason_to_join_incubator)
        ? data.reason_to_join_incubator.map((option) => option.value).join(', ')
        : data.reason_to_join_incubator;
      if (actor) {
        const projectData = {
          project_cover: coverData ? [coverData] : [],
          project_logo: logoData ? [logoData] : [],
          preferred_icp_hub: [data?.preferred_icp_hub ?? ''],
          project_name: data?.project_name ?? '',
          project_description: [data?.project_description ?? ''],
          project_elevator_pitch: [data?.project_elevator_pitch ?? ''],
          project_website: [data?.project_website ?? ''],
          is_your_project_registered: [
            data?.is_your_project_registered === true ? true : false,
          ],
          type_of_registration: [
            data?.is_your_project_registered === 'true' &&
            data?.type_of_registration
              ? data?.type_of_registration
              : '',
          ],
          country_of_registration: [
            data?.is_your_project_registered === 'true' &&
            data?.country_of_registration
              ? data?.country_of_registration
              : '',
          ],
          live_on_icp_mainnet: [
            data?.live_on_icp_mainnet === 'true' ? true : false,
          ],
          dapp_link: [
            data?.live_on_icp_mainnet === 'true' && data?.dapp_link
              ? data?.dapp_link.toString()
              : '',
          ],
          weekly_active_users: [
            data?.live_on_icp_mainnet === 'true' &&
            data?.weekly_active_users &&
            !isNaN(Number(data.weekly_active_users))
              ? Number(data.weekly_active_users)
              : 0,
          ],
          revenue: [
            data?.live_on_icp_mainnet === 'true' && data?.revenue
              ? Number(data.revenue)
              : 0,
          ],
          supports_multichain: [
            data?.multi_chain === 'true' && data?.multi_chain_names
              ? data?.multi_chain_names
              : '',
          ],
          money_raised_till_now: [
            data?.money_raised_till_now === 'true' ? true : false,
          ],
          money_raising: [data?.money_raising === 'true' ? true : false],
          money_raised: [
            {
              icp_grants: data.icp_grants ? data.icp_grants.toString() : null, // Convert to string or null
              investors: data?.investors ? data?.investors.toString() : null, // Convert to string or null
              raised_from_other_ecosystem: data.raised_from_other_ecosystem
                ? data.raised_from_other_ecosystem.toString()
                : null, // Convert to string or null
              target_amount: data.target_amount
                ? parseFloat(data.target_amount)
                : null, // Convert to float or null
              sns: data.valuation ? data.valuation.toString() : null,
            },
          ],
          promotional_video: [data?.promotional_video ?? ''],
          links: [updatedSocialLinks],
          token_economics: [data?.token_economics ?? ''],
          long_term_goals: [data?.white_paper ?? ''],
          private_docs:
            data?.upload_private_documents === 'true'
              ? [data?.privateDocs]
              : [],
          public_docs:
            data?.upload_public_documents === 'true' ? [data?.publicDocs] : [],
          upload_private_documents: [
            data?.upload_private_documents === 'true' ? true : false,
          ],
          project_area_of_focus: Array.isArray(data.project_area_of_focus)
            ? data.project_area_of_focus.join(', ') // Join the array into a string with a comma separator
            : data.project_area_of_focus || '', // Pass as a simple string
          reason_to_join_incubator: reasonToJoinString ?? '',
          vc_assigned: [],
          mentors_assigned: [],
          project_team: [],
          project_twitter: [''],
          target_market: [''],
          technical_docs: [''],
          self_rating_of_project: 0,
        };

        console.log(
          'on submit mera project update data ja raha hai  ....',
          projectData
        );
        console.log(
          'on submit mera projectId update data ja raha hai  ....',
          projectId
        );
        try {
          await actor.update_project(projectId, projectData).then((result) => {
            console.log(
              'on submit mera result update data ja raha hai  ....',
              result
            );
            if (result) {
              toast.success(result);
              dispatch(founderRegisteredHandlerRequest());
              navigate('/dashboard/profile');
            } else {
              toast.error(result);
              dispatch(founderRegisteredHandlerRequest());
              navigate('/dashboard/profile');
            }
          });
        } catch (error) {
          toast.error(error.message);
          console.error('Error:', error);
        }
      } else {
        toast.error('Please signup with internet identity first');
        window.location.href = '/';
      }
      setIsEditingLink({});
      setIsLinkBeingEdited(false);
    };

    const onErrorHandler = (errors) => {
      console.error('Form validation errors: ', errors);

      // Loop through all errors and display each in a toast
      Object.values(errors).forEach((error) => {
        toast.error(error.message, {
          position: 'top-right',
          duration: 5000,
        });
      });
    };

    const logoCreationFunc = async (file) => {
      setIsLogoEditing(true);
      try {
        await fileSchema.validate({ logo: file }); // Manually validate
        const compressedFile = await CompressedImage(file); // Compress the file
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result); // Set preview
        };
        reader.onerror = (error) => {
          console.error('FileReader error: ', error);
          setError('logo', {
            type: 'manual',
            message: 'Failed to load the compressed logo.',
          });
        };
        reader.readAsDataURL(compressedFile);

        const byteArray = new Uint8Array(await compressedFile.arrayBuffer());
        setLogoData(byteArray); // Save the logo data
      } catch (error) {
        // Handle validation and compression errors
        const errorMessage =
          error?.name === 'ValidationError'
            ? error.message
            : 'Could not process logo, please try another.';

        setError('logo', {
          type: 'manual',
          message: errorMessage,
        });
        console.error(errorMessage, error);
      }
    };

    const clearLogoFunc = (value) => {
      let fields_id = value;
      setValue(fields_id, null);
      clearErrors(fields_id);
      setLogoData(null);
      setLogoPreview(null);
    };
    useImperativeHandle(ref, () => ({
      logoCreationFunc: logoCreationFunc,
      clearLogoFunc: clearLogoFunc,
      coverCreationFunc: coverCreationFunc,
      clearCoverFunc: clearCoverFunc,
    }));

    const coverCreationFunc = async (file) => {
      setIsCoverEditing(true);
      try {
        await fileSchema.validate({ cover: file }); // Manually validate
        const compressedFile = await CompressedImage(file); // Compress the file
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result); // Set preview
        };
        reader.onerror = (error) => {
          console.error('FileReader error: ', error);
          setError('cover', {
            type: 'manual',
            message: 'Failed to load the compressed cover.',
          });
        };
        reader.readAsDataURL(compressedFile);

        const byteArray = new Uint8Array(await compressedFile.arrayBuffer());
        setCoverData(byteArray); // Save the cover data
      } catch (error) {
        // Handle validation and compression errors
        const errorMessage =
          error?.name === 'ValidationError'
            ? error.message
            : 'Could not process logo, please try another.';

        setError('cover', {
          type: 'manual',
          message: errorMessage,
        });
        console.error(errorMessage, error);
      }
    };

    const clearCoverFunc = (val) => {
      let field_ids = val;
      setValue(field_ids, null);
      clearErrors(field_ids);
      setCoverData(null);
      setCoverPreview(null);
    };

    const handleSaveDescription = () => {
      // Save the updated description to the form state or backend
      const description = getValues('project_description'); // Retrieve updated description
      setValue('project_description', description); // Update in the form state
      console.log('Saved Description:', description);
      setEditMode((prevEditMode) => ({
        ...prevEditMode,
        project_description: true, // Turn off edit mode for description
      }));
    };

    const setProjectValuesHandler = (val) => {
      console.log('val', val);
      if (val) {
        setValue(
          'preferred_icp_hub',
          val[0]?.[0]?.params.preferred_icp_hub?.[0]
        );
        setValue('project_name', val[0]?.[0]?.params.project_name ?? '');
        setValue(
          'project_description',
          val[0]?.[0]?.params.project_description?.[0] ?? ''
        );
        setValue(
          'project_elevator_pitch',
          val[0]?.[0]?.params.project_elevator_pitch?.[0] ?? ''
        );
        setValue(
          'project_website',
          val[0]?.[0]?.params.project_website?.[0] ?? ''
        );
        setValue(
          'is_your_project_registered',
          val[0]?.[0]?.params.is_your_project_registered?.[0] ?? ''
        );

        if (val[0]?.[0]?.params.is_your_project_registered?.[0] === true) {
          setValue('is_your_project_registered', 'true');
        } else {
          setValue('is_your_project_registered', 'false');
        }
        setValue(
          'type_of_registration',
          val[0]?.[0]?.params.type_of_registration?.[0] ?? ''
        );
        setValue(
          'country_of_registration',
          val[0]?.[0]?.params.country_of_registration?.[0] ?? ''
        );
        setValue('live_on_icp_mainnet', val?.live_on_icp_mainnet?.[0] ?? '');
        if (val[0]?.[0]?.params.live_on_icp_mainnet?.[0] === true) {
          setValue('live_on_icp_mainnet', 'true');
        } else {
          setValue('live_on_icp_mainnet', 'false');
        }
        setValue('dapp_link', val[0]?.[0]?.params.dapp_link?.[0] ?? '');
        setValue(
          'weekly_active_users',
          val[0]?.[0]?.params.weekly_active_users?.[0] ?? 0
        );
        setValue('revenue', val[0]?.[0]?.params.revenue?.[0] ?? 0);
        if (val[0]?.[0]?.params.supports_multichain?.[0]) {
          setValue('multi_chain', 'true');
        } else {
          setValue('multi_chain', 'false');
        }
        setValue(
          'multi_chain_names',
          val[0]?.[0]?.params.supports_multichain
            ? val[0]?.[0]?.params.supports_multichain.join(', ')
            : ''
        );
        setMultiChainSelectedOptionsHandler(
          val[0]?.[0]?.params.supports_multichain ?? null
        );
        setValue(
          'multi_chain',
          val[0]?.[0]?.params.supports_multichain?.[0] ? 'true' : 'false'
        );

        const reasonToJoinString =
          val[0]?.[0]?.params?.reason_to_join_incubator || '';
        const reasonToJoinOptions = reasonToJoinString
          .split(',')
          .map((reason) => reason.trim());

        const formattedReasons = reasonToJoinOptions.map((reason) => ({
          value: reason,
          label: reason.charAt(0).toUpperCase() + reason.slice(1),
        }));

        setReasonOfJoiningSelectedOptions(formattedReasons);
        setValue('reason_to_join_incubator', formattedReasons);
        if (val[0]?.[0]?.params.money_raised_till_now?.[0] === true) {
          setValue('money_raised_till_now', 'true');
        } else {
          setValue('money_raised_till_now', 'false');
        }
        if (
          val[0]?.[0]?.params.money_raised?.[0]?.target_amount?.[0] &&
          val[0]?.[0]?.params.money_raised?.[0]?.sns?.[0]
        ) {
          setValue('money_raising', 'true');
        } else {
          setValue('money_raising', 'false');
        }
        setValue(
          'icp_grants',
          val[0]?.[0]?.params.money_raised?.[0]?.icp_grants || 0
        );
        setValue(
          'investors',
          val[0]?.[0]?.params.money_raised?.[0]?.investors || 0
        );
        setValue(
          'raised_from_other_ecosystem',
          val[0]?.[0]?.params.money_raised?.[0]?.raised_from_other_ecosystem ||
            0
        );
        setValue('valuation', val[0]?.[0]?.params.money_raised?.[0]?.sns ?? 0);
        setValue(
          'target_amount',
          val[0]?.[0]?.params.money_raised?.[0]?.target_amount ?? 0
        );
        setInterestedDomainsSelectedOptions(
          val[0]?.[0]?.params?.project_area_of_focus ?? null
        );
        setValue(
          'project_area_of_focus',
          val[0]?.[0]?.params?.project_area_of_focus
            ? val[0]?.[0]?.params?.project_area_of_focus
            : ''
        );
        setValue(
          'promotional_video',
          val[0]?.[0]?.params.promotional_video?.[0] ?? ''
        );
        setValue(
          'upload_private_documents',
          val[0]?.[0]?.params.upload_private_documents?.[0] ?? ''
        );
        if (val[0]?.[0]?.params.upload_private_documents?.[0] === true) {
          setValue('upload_private_documents', 'true');
        } else {
          setValue('upload_private_documents', 'false');
        }
        if (
          val[0]?.[0]?.params &&
          val[0]?.[0]?.params.public_docs?.[0] &&
          val[0]?.[0]?.params.public_docs?.[0].length
        ) {
          setValue('upload_public_documents', 'true');
        } else {
          setValue('upload_public_documents', 'false');
        }
        setValue('privateDocs', val[0]?.[0]?.params.private_docs?.[0] ?? []);
        setValue('publicDocs', val[0]?.[0]?.params.public_docs?.[0] ?? []);
        if (val[0]?.[0]?.params.links?.length) {
          const links = {};

          val[0]?.[0]?.params.links.forEach((linkArray) => {
            if (Array.isArray(linkArray)) {
              linkArray.forEach((linkData) => {
                const url = linkData.link?.[0];
                if (url && typeof url === 'string') {
                  try {
                    const parsedUrl = new URL(url);
                    const hostname = parsedUrl.hostname.replace('www.', '');
                    const platform = getPlatformFromHostname(hostname);
                    links[platform] = url;
                  } catch (error) {
                    console.error('Invalid URL:', url, error);
                  }
                }
              });
            }
          });

          setSocialLinks(links);
        } else {
          setSocialLinks({});
        }
      }
    };

    const setInterestedDomainsSelectedOptionsHandler = (val) => {
      setInterestedDomainsSelectedOptions(
        val
          ? val
              .split(', ')
              .map((interest) => ({ value: interest, label: interest }))
          : []
      );
    };

    useEffect(() => {
      if (areaOfExpertise) {
        setInterestedDomainsOptions(
          areaOfExpertise.map((expert) => ({
            value: expert.name,
            label: expert.name,
          }))
        );
      } else {
        setInterestedDomainsOptions([]);
      }
    }, [areaOfExpertise]);

    useEffect(() => {
      if (multiChainNames) {
        setMultiChainOptions(
          multiChainNames.map((chain) => ({
            value: chain,
            label: chain,
          }))
        );
      } else {
        setMultiChainOptions([]);
      }
    }, [multiChainNames]);

    const setReasonOfJoiningSelectedOptionsHandler = (val) => {
      setReasonOfJoiningSelectedOptions(
        val && val.length > 0 && val[0].length > 0
          ? val[0].map((reason) => ({ value: reason, label: reason }))
          : []
      );
    };
    const setMultiChainSelectedOptionsHandler = (val) => {
      setMultiChainSelectedOptions(
        val
          ? val?.[0]
              .split(', ')
              .map((chain) => ({ value: chain, label: chain }))
          : []
      );
    };

    const handleCancel = () => {
      setEditMode(false);
      setIsLinkBeingEdited(false);
      setIsLogoEditing(false);
      setIsCoverEditing(false);
    };

    const handleEditClick = (field) => {
      setEditMode({ ...editMode, [field]: true });
    };

    const projectDetailRef = useRef(null);

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleClickOutside = (event) => {
      if (
        projectDetailRef.current &&
        !projectDetailRef.current.contains(event.target)
      ) {
        if (Object.values(editMode).some((isEditing) => isEditing)) {
          handleSubmit((data) => {
            handleSave(data);
            setEditMode({});
          })();
        } else {
          setEditMode({});
        }
      }
    };

    useEffect(() => {
      if (areaOfExpertise) {
        setInterestedDomainsOptions(
          areaOfExpertise.map((expert) => ({
            value: expert.name,
            label: expert.name,
          }))
        );
      } else {
        setInterestedDomainsOptions([]);
      }
    }, [areaOfExpertise]);

    useEffect(() => {
      if (typeOfProfile) {
        setTypeOfProfileOptions(
          typeOfProfile.map((type) => ({
            value: type.role_type.toLowerCase(),
            label: type.role_type,
          }))
        );
      } else {
        setTypeOfProfileOptions([]);
      }
    }, [typeOfProfile]);

    useEffect(() => {
      if (multiChainNames) {
        setMultiChainOptions(
          multiChainNames.map((chain) => ({
            value: chain,
            label: chain,
          }))
        );
      } else {
        setMultiChainOptions([]);
      }
    }, [multiChainNames]);

    useEffect(() => {
      dispatch(allHubHandlerRequest());
    }, [actor, dispatch]);

    useEffect(() => {
      if (
        projectFullData &&
        Array.isArray(projectFullData) &&
        projectFullData.length > 0
      ) {
        setProjectValuesHandler(projectFullData);
        setLogoPreview(projectFullData[0]?.[0]?.params?.project_logo);
        setCoverPreview(projectFullData[0]?.[0]?.params?.project_cover);

        setEditMode(true);
      }
    }, [projectFullData]);

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, []);

    console.log(
      'multichain',
      projectFullData[0]?.[0]?.params.supports_multichain?.[0]
    );
    const preferred_icp_hub =
      projectFullData[0]?.[0]?.params.preferred_icp_hub?.[0] ?? '';
    const project_name = projectFullData[0]?.[0]?.params.project_name ?? '';
    const project_description =
      projectFullData[0]?.[0]?.params.project_description?.[0] ?? '';
    const project_elevator_pitch =
      projectFullData[0]?.[0]?.params.project_elevator_pitch ?? '';
    const project_website =
      projectFullData[0]?.[0]?.params.project_website?.[0] ?? '';
    const is_your_project_registered = projectFullData[0]?.[0]?.params
      .is_your_project_registered?.[0]
      ? true
      : false;
    const isyourprojectregistered =
      is_your_project_registered === true ? 'Yes' : 'No';
    const type_of_registration =
      projectFullData[0]?.[0]?.params.type_of_registration?.[0] ?? '';
    const country_of_registration =
      projectFullData[0]?.[0]?.params.country_of_registration?.[0] ?? '';
    const live_on_icp_mainnet = projectFullData[0]?.[0]?.params
      .live_on_icp_mainnet?.[0]
      ? 'true'
      : 'false';
    const liveonicpmainnet = live_on_icp_mainnet === true ? 'Yes' : 'No';
    const dapp_link = projectFullData[0]?.[0]?.params.dapp_link?.[0] ?? '';
    const weekly_active_users =
      projectFullData[0]?.[0]?.params.weekly_active_users?.[0] ?? 0;
    const revenue = projectFullData[0]?.[0]?.params.revenue?.[0] ?? '';
    const multi_chain = projectFullData[0]?.[0]?.params.supports_multichain?.[0]
      ? 'true'
      : 'false';
    const multichain = multi_chain === 'true' ? 'Yes' : 'No';
    const project_area_of_focus =
      projectFullData[0]?.[0]?.params.project_area_of_focus;
    const multi_chain_names =
      projectFullData[0]?.[0]?.params.supports_multichain?.join(', ') ?? '';
    const promotional_video =
      projectFullData[0]?.[0]?.params.promotional_video?.[0] ?? '';
    const links = projectFullData[0]?.[0]?.params.links;
    const token_economics =
      projectFullData[0]?.[0]?.params.token_economics?.[0] ?? '';
    const reason_to_join_incubator =
      projectFullData[0]?.[0]?.params.reason_to_join_incubator;
    console.log('isLogoEditing', isLogoEditing);

    return (
      <>
        <div ref={projectDetailRef} className='px-1'>
          <div className='px-1'>
            {isLoading ? (
              <ProjectDetailSkeleton />
            ) : (
              <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
                {/* Reason for Joining This Platform */}
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mt-4 mb-1'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start mb-2'>
                      Reason for joining this platform
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() =>
                        handleEditClick('reason_to_join_incubator')
                      }
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.reason_to_join_incubator ? (
                    <div>
                      <ReactSelect
                        isMulti
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'}
                        styles={getReactSelectUpdateStyles(
                          errors?.reason_to_join_incubator
                        )}
                        value={reasonOfJoiningSelectedOptions}
                        options={reasonOfJoiningOptions}
                        classNamePrefix='select'
                        className='basic-multi-select w-full text-start'
                        placeholder='Select your reasons to join this platform'
                        name='reason_to_join_incubator'
                        onChange={(selectedOptions) => {
                          setReasonOfJoiningSelectedOptions(selectedOptions);
                          clearErrors('reason_to_join_incubator');
                          setValue(
                            'reason_to_join_incubator',
                            selectedOptions
                              .map((option) => option.value)
                              .join(', '),
                            { shouldValidate: true }
                          );
                        }}
                      />
                      {errors.reason_to_join_incubator && (
                        <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                          {errors.reason_to_join_incubator.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className='flex overflow-x-auto gap-2'>
                      {(reason_to_join_incubator || '')
                        .split(', ')
                        .map((reason, index) => (
                          <span
                            key={index}
                            className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                          >
                            {reason}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                      Preferred ICP Hub you would like to be associated with
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() => handleEditClick('preferred_icp_hub')}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.preferred_icp_hub ? (
                    <div>
                      <select
                        {...register('preferred_icp_hub')}
                        className={`bg-gray-50 border-2 ${
                          errors.preferred_icp_hub
                            ? 'border-red-500 '
                            : 'border-[#737373]'
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                      >
                        <option className='text-lg font-bold' value=''>
                          Select your ICP Hub
                        </option>
                        {getAllIcpHubs?.map((hub) => (
                          <option
                            key={hub.id}
                            value={`${hub.name} ,${hub.region}`}
                            className='text-lg font-bold'
                          >
                            {hub.name}, {hub.region}
                          </option>
                        ))}
                      </select>
                      {errors.preferred_icp_hub && (
                        <p className='mt-1 text-sm text-red-500 font-bold text-left'>
                          {errors.preferred_icp_hub.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm'>
                        {typeof preferred_icp_hub === 'string'
                          ? preferred_icp_hub
                          : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Name */}
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                      Project Name
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() => handleEditClick('project_name')}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.project_name ? (
                    <div>
                      <input
                        type='text'
                        {...register('project_name')}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_name
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                        placeholder='Enter your Project name'
                      />
                      {errors?.project_name && (
                        <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                          {errors?.project_name?.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm'>{project_name}</span>
                    </div>
                  )}
                </div>

                {/* Project Description */}
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                      Project Description
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={handleOpenModal}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {!isModalOpen && (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm line-clamp-3 hover:line-clamp-6'>
                        {parse(watch('project_description'))}
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Elevator Pitch */}
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                      Project Elevator Pitch
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() => handleEditClick('project_elevator_pitch')}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.project_elevator_pitch ? (
                    <div>
                      <input
                        type='text'
                        {...register('project_elevator_pitch')}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_elevator_pitch
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                        placeholder='https://'
                      />
                      {errors?.project_elevator_pitch && (
                        <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                          {errors?.project_elevator_pitch?.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm'>
                        {project_elevator_pitch}
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Website */}
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                      Project Website
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() => handleEditClick('project_website')}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.project_website ? (
                    <div>
                      <input
                        type='text'
                        {...register('project_website')}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_website
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                        placeholder='https://'
                      />
                      {errors?.project_website && (
                        <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                          {errors?.project_website?.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm'>{project_website}</span>
                    </div>
                  )}
                </div>

                {/* Is Your Project Registered */}
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                      Is Your Project Registered?
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() =>
                        handleEditClick('is_your_project_registered')
                      }
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.is_your_project_registered ? (
                    <div>
                      <select
                        {...register('is_your_project_registered')}
                        className={`bg-gray-50 border-2 ${
                          errors.is_your_project_registered
                            ? 'border-red-500'
                            : 'border-[#737373]'
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                      >
                        <option className='text-lg font-bold' value={false}>
                          No
                        </option>
                        <option className='text-lg font-bold' value={true}>
                          Yes
                        </option>
                      </select>
                      {errors.is_your_project_registered && (
                        <p className='mt-1 text-sm text-red-500 font-bold text-left'>
                          {errors.is_your_project_registered.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm'>
                        {/* {getValues("is_your_project_registered") ? "Yes" : "No"} */}
                        {isyourprojectregistered}
                        {/* {is_your_project_registered} */}
                      </span>
                    </div>
                  )}
                </div>

                {watch('is_your_project_registered') === 'true' && (
                  <>
                    {/* Type of Registration */}
                    <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                      <div className='flex justify-between items-center'>
                        <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                          Type of Registration
                        </label>
                        <img
                          src={editp}
                          className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                          alt='edit'
                          onClick={() =>
                            handleEditClick('type_of_registration')
                          }
                          loading='lazy'
                          draggable={false}
                        />
                      </div>
                      {editMode.type_of_registration ? (
                        <div>
                          <select
                            {...register('type_of_registration')}
                            className={`bg-gray-50 border-2 ${
                              errors.type_of_registration
                                ? 'border-red-500'
                                : 'border-[#737373]'
                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                          >
                            <option className='text-lg font-bold' value=''>
                              Select registration type
                            </option>
                            <option
                              className='text-lg font-bold'
                              value='Company'
                            >
                              Company
                            </option>
                            <option className='text-lg font-bold' value='DAO'>
                              DAO
                            </option>
                          </select>
                          {errors.type_of_registration && (
                            <p className='mt-1 text-sm text-red-500 font-bold text-left'>
                              {errors.type_of_registration.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className='flex justify-between items-center cursor-pointer py-1'>
                          <span className='mr-2 text-sm'>
                            {type_of_registration}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Country of Registration */}
                    <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                      <div className='flex justify-between items-center'>
                        <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                          Country of Registration
                        </label>
                        <img
                          src={editp}
                          className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                          alt='edit'
                          onClick={() =>
                            handleEditClick('country_of_registration')
                          }
                          loading='lazy'
                          draggable={false}
                        />
                      </div>
                      {editMode.country_of_registration ? (
                        <div>
                          <select
                            {...register('country_of_registration')}
                            className={`bg-gray-50 border-2 ${
                              errors.country_of_registration
                                ? 'border-red-500 '
                                : 'border-[#737373]'
                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                          >
                            <option className='text-lg font-bold' value=''>
                              Select your country
                            </option>
                            {countries?.map((expert) => (
                              <option
                                key={expert.name}
                                value={expert.name}
                                className='text-lg font-bold'
                              >
                                {expert.name}
                              </option>
                            ))}
                          </select>
                          {errors?.country_of_registration && (
                            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                              {errors?.country_of_registration?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className='flex justify-between items-center cursor-pointer py-1'>
                          <span className='mr-2 text-sm'>
                            {country_of_registration}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Are you also multi-chain */}
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='font-semibold text-xs text-gray-500 uppercase'>
                      Are you also multi-chain
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() => {
                        handleEditClick('multi_chain');
                      }}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.multi_chain ? (
                    <div>
                      <select
                        {...register('multi_chain')}
                        className={`bg-gray-50 border-2 ${
                          errors.multi_chain
                            ? 'border-red-500'
                            : 'border-[#737373]'
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                      >
                        <option className='text-lg font-bold' value='false'>
                          No
                        </option>
                        <option className='text-lg font-bold' value='true'>
                          Yes
                        </option>
                      </select>
                      {errors.multi_chain && (
                        <p className='mt-1 text-sm text-red-500 font-bold text-left'>
                          {errors.multi_chain.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm'>
                        {/* {getValues("multi_chain") === "true" ? "Yes" : "No"} */}
                        {multichain}
                        {/* {multi_chain} */}
                      </span>
                    </div>
                  )}
                </div>

                {watch('multi_chain') === 'true' && (
                  <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                    <div className='flex justify-between items-center'>
                      <label className='font-semibold text-xs text-gray-500 uppercase mb-1 '>
                        Please select the chains
                      </label>
                      <img
                        src={editp}
                        className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                        alt='edit'
                        onClick={() => handleEditClick('supports_multichain')}
                        loading='lazy'
                        draggable={false}
                      />
                    </div>
                    {editMode.supports_multichain ? (
                      <>
                        <ReactSelect
                          isMulti
                          menuPortalTarget={document.body}
                          menuPosition={'fixed'}
                          styles={getReactSelectUpdateStyles(
                            errors?.multi_chain_names
                          )}
                          value={multiChainSelectedOptions}
                          options={multiChainOptions}
                          classNamePrefix='select'
                          className='basic-multi-select w-full text-start'
                          placeholder='Select a chain'
                          name='multi_chain_names'
                          onChange={(selectedOptions) => {
                            if (selectedOptions && selectedOptions.length > 0) {
                              setMultiChainSelectedOptions(selectedOptions);
                              clearErrors('multi_chain_names');
                              setValue(
                                'multi_chain_names',
                                selectedOptions
                                  .map((option) => option.value)
                                  .join(', '),
                                { shouldValidate: true }
                              );
                            } else {
                              setMultiChainSelectedOptions([]);
                              setValue('multi_chain_names', '', {
                                shouldValidate: true,
                              });
                              setError('multi_chain_names', {
                                type: 'required',
                                message: 'Atleast one chain name required',
                              });
                            }
                          }}
                        />
                        {errors.multi_chain_names && (
                          <p className='mt-1 text-sm text-red-500 font-bold text-left'>
                            {errors.multi_chain_names.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <div className='flex flex-wrap gap-2'>
                          {multi_chain_names &&
                            multi_chain_names
                              .split(', ')
                              .map((focus, index) => (
                                <span
                                  key={index}
                                  className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                                >
                                  {focus}
                                </span>
                              ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Live on ICP Mainnet */}
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                      Live on ICP Mainnet?
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() => handleEditClick('live_on_icp_mainnet')}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.live_on_icp_mainnet ? (
                    <div>
                      <select
                        {...register('live_on_icp_mainnet')}
                        className={`bg-gray-50 border-2 ${
                          errors.live_on_icp_mainnet
                            ? 'border-red-500'
                            : 'border-[#737373]'
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                      >
                        <option className='text-lg font-bold' value='false'>
                          No
                        </option>
                        <option className='text-lg font-bold' value='true'>
                          Yes
                        </option>
                      </select>
                      {errors.live_on_icp_mainnet && (
                        <p className='mt-1 text-sm text-red-500 font-bold text-left'>
                          {errors.live_on_icp_mainnet.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm'>
                        {/* {getValues("live_on_icp_mainnet") ? "Yes" : "No"} */}
                        {liveonicpmainnet}
                      </span>
                    </div>
                  )}
                </div>

                {watch('live_on_icp_mainnet') === 'true' && (
                  <>
                    {/* dApp Link */}
                    <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                      <div className='flex justify-between items-center'>
                        <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                          dApp Link
                        </label>
                        <img
                          src={editp}
                          className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                          alt='edit'
                          onClick={() => handleEditClick('dapp_link')}
                          loading='lazy'
                          draggable={false}
                        />
                      </div>
                      {editMode.dapp_link ? (
                        <div>
                          <input
                            type='text'
                            {...register('dapp_link')}
                            className={`bg-gray-50 border-2 
                                             ${
                                               errors?.dapp_link
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                            placeholder='https://'
                          />
                          {errors?.dapp_link && (
                            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                              {errors?.dapp_link?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className='flex justify-between items-center cursor-pointer py-1'>
                          <span className='mr-2 text-sm'>{dapp_link}</span>
                        </div>
                      )}
                    </div>

                    {/* Weekly Active Users */}
                    <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                      <div className='flex justify-between items-center'>
                        <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                          Weekly Active Users
                        </label>
                        <img
                          src={editp}
                          className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                          alt='edit'
                          onClick={() => handleEditClick('weekly_active_users')}
                          loading='lazy'
                          draggable={false}
                        />
                      </div>
                      {editMode.weekly_active_users ? (
                        <div>
                          <input
                            type='number'
                            {...register('weekly_active_users')}
                            className={`bg-gray-50 border-2 
                                             ${
                                               errors?.weekly_active_users
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                            placeholder='Enter Weekly active users'
                            onWheel={(e) => e.target.blur()}
                            min={0}
                          />
                          {errors?.weekly_active_users && (
                            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                              {errors?.weekly_active_users?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className='flex justify-between items-center cursor-pointer py-1'>
                          <span className='mr-2 text-sm'>
                            {weekly_active_users}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Revenue */}
                    <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                      <div className='flex justify-between items-center'>
                        <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                          Revenue (in Million USD)
                        </label>
                        <img
                          src={editp}
                          className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                          alt='edit'
                          onClick={() => handleEditClick('revenue')}
                          loading='lazy'
                          draggable={false}
                        />
                      </div>
                      {editMode.revenue ? (
                        <div>
                          <input
                            type='number'
                            {...register('revenue')}
                            className={`bg-gray-50 border-2 
                                             ${
                                               errors?.revenue
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                            placeholder='Enter Revenue'
                            onWheel={(e) => e.target.blur()}
                            min={0}
                          />
                          {errors?.revenue && (
                            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                              {errors?.revenue?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className='flex justify-between items-center cursor-pointer py-1'>
                          <span className='mr-2 text-sm'>{revenue}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div className='mb-4 group relative hover:bg-gray-100 rounded-lg p-2  '>
                  <div className='flex justify-between'>
                    <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                      Interests
                    </h3>
                    <div>
                      <button
                        type='button'
                        className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                        onClick={() => handleEditClick('project_area_of_focus')}
                      >
                        <img
                          src={editp}
                          alt='edit'
                          loading='lazy'
                          draggable={false}
                        />
                      </button>
                    </div>
                  </div>
                  {editMode.project_area_of_focus ? (
                    <ReactSelect
                      isMulti
                      menuPortalTarget={document.body}
                      menuPosition={'fixed'}
                      styles={getReactSelectUpdateStyles(
                        errors?.project_area_of_focus
                      )}
                      value={interestedDomainsSelectedOptions}
                      options={interestedDomainsOptions}
                      classNamePrefix='select'
                      className='basic-multi-select w-full text-start'
                      placeholder='Select domains you are interested in'
                      name='project_area_of_focus'
                      onChange={(selectedOptions) => {
                        if (selectedOptions && selectedOptions.length > 0) {
                          // Convert selected options to a comma-separated string of values
                          const selectedValuesString = selectedOptions
                            .map((option) => option.value)
                            .join(', ');
                          setInterestedDomainsSelectedOptions(selectedOptions);
                          clearErrors('project_area_of_focus');
                          setValue(
                            'project_area_of_focus',
                            selectedValuesString,
                            {
                              shouldValidate: true,
                            }
                          );
                        } else {
                          setInterestedDomainsSelectedOptions([]);
                          setValue('project_area_of_focus', '', {
                            shouldValidate: true,
                          });
                          setError('project_area_of_focus', {
                            type: 'required',
                            message: 'Selecting an interest is required',
                          });
                        }
                      }}
                    />
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {project_area_of_focus &&
                        project_area_of_focus
                          .split(', ')
                          .map((focus, index) => (
                            <span
                              key={index}
                              className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                            >
                              {focus}
                            </span>
                          ))}
                    </div>
                  )}
                </div>

                {/* Promotional Video */}
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                      Promotional Video
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() => handleEditClick('promotional_video')}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.promotional_video ? (
                    <div>
                      <input
                        type='text'
                        {...register('promotional_video')}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.promotional_video
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                        placeholder='https://'
                      />
                      {errors?.promotional_video && (
                        <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                          {errors?.promotional_video?.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm'>{promotional_video}</span>
                    </div>
                  )}
                </div>
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  <div className='flex justify-between items-center'>
                    <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                      Tokenomics
                    </label>
                    <img
                      src={editp}
                      className='visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
'
                      alt='edit'
                      onClick={() => handleEditClick('token_economics')}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  {editMode.token_economics ? (
                    <div>
                      <input
                        type='text'
                        {...register('token_economics')}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.token_economics
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  my-2`}
                        placeholder='https://'
                      />
                      {errors?.token_economics && (
                        <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                          {errors?.token_economics?.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className='flex justify-between items-center cursor-pointer py-1'>
                      <span className='mr-2 text-sm truncate break-all'>
                        {token_economics}
                      </span>
                    </div>
                  )}
                </div>
                <div className='group relative hover:bg-gray-100 rounded-lg p-2  mb-2'>
                  {/* <h3 className='mb-2 text-xs text-gray-500 '>LINKS</h3> */}
                  <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                    Links
                  </label>
                  <div className='relative '>
                    <div className='flex flex-wrap gap-5'>
                      {Object.keys(socialLinks)
                        .filter((key) => socialLinks[key]) // Only show links with valid URLs
                        .map((key, index) => {
                          const url = socialLinks[key];
                          const Icon = getSocialLogo(url); // Get the corresponding social icon
                          return (
                            <div
                              className='group relative flex items-center mb-3'
                              key={key}
                            >
                              {isEditingLink[key] ? (
                                <div className='flex w-full'>
                                  <div className='flex items-center w-full'>
                                    <div className='flex items-center space-x-2 w-full'>
                                      <div className='flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full'>
                                        {Icon} {/* Display the icon */}
                                      </div>
                                      <input
                                        type='text'
                                        value={url}
                                        onChange={(e) =>
                                          handleLinkChange(e, key)
                                        }
                                        className='border p-2 rounded-md w-full'
                                        placeholder='Enter your social media URL'
                                      />
                                    </div>
                                    <button
                                      type='button'
                                      onClick={() => handleSaveLink(key)} // Save the link
                                      className='ml-2 text-green-500 hover:text-green-700'
                                    >
                                      <FaSave />
                                    </button>
                                    <button
                                      type='button'
                                      onClick={() => handleLinkDelete(key)} // Delete the link
                                      className='ml-2 text-red-500 hover:text-red-700'
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <a
                                    href={url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center'
                                  >
                                    {Icon} {/* Display the icon */}
                                  </a>
                                  <button
                                    type='button'
                                    className='absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 translate-x-6 ease-in-out transform opacity-100 lgx:opacity-0 lgx:group-hover:opacity-100 md:group-hover:translate-x-6 h-10 w-7'
                                    onClick={() => handleLinkEditToggle(key)} // Toggle editing mode for this link
                                  >
                                    <img
                                      src={editp}
                                      alt='edit'
                                      loading='lazy'
                                      draggable={false}
                                    />
                                  </button>
                                </>
                              )}
                            </div>
                          );
                        })}
                    </div>
                    {fields.map((item, index) => (
                      <div key={item.id} className='flex flex-col'>
                        <div className='flex items-center mb-2 pb-1'>
                          <Controller
                            name={`links[${index}].link`}
                            control={control}
                            render={({ field, fieldState }) => (
                              <div className='flex items-center w-full'>
                                <div className='flex items-center space-x-2 w-full'>
                                  <div className='flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full'>
                                    {field.value && getSocialLogo(field.value)}{' '}
                                    {/* Display logo for new link */}
                                  </div>
                                  <input
                                    type='text'
                                    placeholder='Enter your social media URL'
                                    className={`p-2 border ${
                                      fieldState.error
                                        ? 'border-red-500'
                                        : 'border-[#737373]'
                                    } rounded-md w-full bg-gray-50 border-2 border-[#D1D5DB]`}
                                    {...field}
                                  />
                                </div>
                                <button
                                  type='button'
                                  onClick={() =>
                                    handleSaveNewLink(field.value, index)
                                  } // Save the new link
                                  className='ml-2 text-green-500 hover:text-green-700'
                                >
                                  <FaSave />
                                </button>
                                <button
                                  type='button'
                                  onClick={() => remove(index)} // Remove link field
                                  className='ml-2 text-red-500 hover:text-red-700'
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    {fields.length < 10 && (
                      <button
                        type='button'
                        onClick={() => {
                          if (fields.length < 10) {
                            append({ link: '' });
                          }
                        }}
                        className='flex items-center p-1 text-[#155EEF]'
                      >
                        <FaPlus className='mr-1' /> Add Another Link
                      </button>
                    )}
                  </div>

                  {(Object.values(editMode).some((value) => value) ||
                    isLinkBeingEdited ||
                    isLogoEditing ||
                    isCoverEditing) && (
                    <div className='flex justify-end gap-4 mt-4'>
                      <button
                        type='button'
                        onClick={handleCancel}
                        className='bg-gray-300 text-gray-700 py-2 px-4 rounded mb-4'
                      >
                        Cancel
                      </button>
                      <button
                        disabled={isSubmitting}
                        type='submit'
                        className='text-white font-bold bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4'
                      >
                        {isSubmitting ? (
                          <ThreeDots
                            visible={true}
                            height='35'
                            width='35'
                            color='#FFFEFF'
                            radius='9'
                            ariaLabel='three-dots-loading'
                            wrapperStyle={{}}
                            wrapperclassName=''
                          />
                        ) : editMode ? (
                          'Update'
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
          <Toaster />
        </div>
        {isModalOpen && (
          <ProjectDescriptionEdit
            control={control}
            errors={errors}
            trigger={trigger}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            project_description={watch('project_description')}
            onSaveDescription={handleSaveDescription}
          />
        )}
      </>
    );
  }
);

export default ProjectDetail;

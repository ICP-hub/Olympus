import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { useCountries } from "react-countries";
import editp from "../../../assets/Logo/edit.png";
import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { ThreeDots } from "react-loader-spinner";
import parse from "html-react-parser";
import { toast, Toaster } from "react-hot-toast";
import { LinkedIn, GitHub, Telegram, Language } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { founderRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/founderRegisteredData";
import getReactSelectStyles from "../Utils/navigationHelper/getReactSelectStyles";

const ProjectDetail = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverData, setCoverData] = useState(null);
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const multiChainNames = useSelector((currState) => currState.chains.chains);

  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const [reasonOfJoiningOptions, setReasonOfJoiningOptions] = useState([
    { value: "listing_and_promotion", label: "Project listing and promotion" },
    { value: "Funding", label: "Funding" },
    { value: "Mentoring", label: "Mentoring" },
    { value: "Incubation", label: "Incubation" },
    {
      value: "Engaging_and_building_community",
      label: "Engaging and building community",
    },
    { value: "Jobs", label: "Jobs" },
  ]);
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
    []
  );
  const [editMode, setEditMode] = useState({});

  const { countries } = useCountries();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const projectId = projectFullData?.[0]?.[0]?.uid;
console.log("id aa",projectFullData?.[0]?.[0]?.uid)
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    getValues,
    setError,
    watch,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(va),
    mode: "all",
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

  const { fields, append, remove } = useFieldArray({
    name: "links",
    control,
  });

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(founderRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);

  const setFormValues = (data) => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key] || "");
      });
      setFormData(data);
    }
  };

  const [socialLinks, setSocialLinks] = useState({});
  const [isEditingLink, setIsEditingLink] = useState({});
  const [isLinkBeingEdited, setIsLinkBeingEdited] = useState(false);

  const handleLinkEditToggle = (link) => {
    setIsEditingLink((prev) => ({
      ...prev,
      [link]: !prev[link],
    }));
    setIsLinkBeingEdited(!isLinkBeingEdited);
  };

  const handleLinkChange = (e, link) => {
    setSocialLinks((prev) => ({
      ...prev,
      [link]: e.target.value,
    }));
  };

  const getIconForLink = (url) => {
    if (url.includes("linkedin.com")) {
      return LinkedIn;
    } else if (url.includes("github.com")) {
      return GitHub;
    } else if (url.includes("t.me") || url.includes("telegram")) {
      return Telegram;
    } else {
      return Language;
    }
  };

  const onSubmitHandler = async (data) => {
    console.log("on submit data ....",data )
    const updatedSocialLinks = Object.entries(socialLinks).map(([key, value]) => ({
      link: value ? [value] : [],
    }));
    // Convert project_area_of_focus array to a comma-separated string
    let projectAreaOfFocusString = '';
    if (Array.isArray(data.project_area_of_focus)) {
        projectAreaOfFocusString = data.project_area_of_focus
            .map(option => option.value.replace(/\"/g, ''))  // Ensure no extra quotes
            .join(", ");
    } else if (typeof data.project_area_of_focus === "string") {
        projectAreaOfFocusString = data.project_area_of_focus;
    }
  
    const reasonToJoinString = Array.isArray(data.reason_to_join_incubator)
    ? data.reason_to_join_incubator.map((option) => option.value).join(", ")
    : data.reason_to_join_incubator;
    if (actor) {
      const projectData = {
        project_cover: coverData ? [coverData] : [],
        project_logo: logoData ? [logoData] : [],
        preferred_icp_hub: [data?.preferred_icp_hub ?? ""],
        project_name: data?.project_name ?? "",
        project_description: [data?.project_description ?? ""],
        project_elevator_pitch: [data?.project_elevator_pitch ?? ""],
        project_website: [data?.project_website ?? ""],
        is_your_project_registered: [
          data?.is_your_project_registered === "true" ? true : false,
        ],
        type_of_registration: [
          data?.is_your_project_registered === "true" && data?.type_of_registration
            ? data?.type_of_registration
            : "",
        ],
        country_of_registration: [
          data?.is_your_project_registered === "true" && data?.country_of_registration
            ? data?.country_of_registration
            : "",
        ],
        live_on_icp_mainnet: [
          data?.live_on_icp_mainnet === "true" ? true : false,
        ],
        dapp_link: [
          data?.live_on_icp_mainnet === "true" && data?.dapp_link
            ? data?.dapp_link.toString()
            : "",
        ],
        weekly_active_users: [
          data?.live_on_icp_mainnet === "true" && data?.weekly_active_users
            ? Number(data.weekly_active_users)
            : 0,
        ],
        revenue: [
          data?.live_on_icp_mainnet === "true" && data?.revenue
            ? Number(data.revenue)
            : 0,
        ],
        supports_multichain: [
          data?.multi_chain === "true" && data?.multi_chain_names
            ? data?.multi_chain_names
            : "",
        ],
        money_raised_till_now: [
          data?.money_raised_till_now === "true" ? true : false,
        ],
        money_raising: [data?.money_raising === "true" ? true : false],
        money_raised: [
          {
            icp_grants: data.icp_grants ? data.icp_grants.toString() : null, // Convert to string or null
            investors: data?.investors ? data?.investors.toString() : null, // Convert to string or null
            raised_from_other_ecosystem: data.raised_from_other_ecosystem ? data.raised_from_other_ecosystem.toString() : null, // Convert to string or null
            target_amount: data.target_amount ? parseFloat(data.target_amount) : null, // Convert to float or null
            sns: data.valuation ? data.valuation.toString() : null,

          },
        ],
        promotional_video: [data?.promotional_video ?? ""],
          links: [updatedSocialLinks], 
        token_economics: [data?.token_economics ?? ""],
        long_term_goals: [data?.white_paper ?? ""],
        private_docs:
          data?.upload_private_documents === "true" ? [data?.privateDocs] : [],
        public_docs:
          data?.upload_public_documents === "true" ? [data?.publicDocs] : [],
        upload_private_documents: [
          data?.upload_private_documents === "true" ? true : false,
        ],
        project_area_of_focus: projectAreaOfFocusString, // Pass as a simple string
      reason_to_join_incubator: reasonToJoinString ?? "",
        vc_assigned: [],
        mentors_assigned: [],
        project_team: [],
        project_twitter: [""],
        target_market: [""],
        technical_docs: [""],
        self_rating_of_project: 0,
      };
    
      console.log("on submit mera project update data ja raha hai  ....",projectData )
      console.log("on submit mera projectId update data ja raha hai  ....",projectId )
      try {
        await actor.update_project(projectId, projectData).then((result) => {
          console.log("on submit mera result update data ja raha hai  ....",result )
          if (result) {
            toast.success(result);
          }
        });
      } catch (error) {
        toast.error(error.message);
        console.error("Error:", error);
      }
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
    setIsEditingLink({});
    setIsLinkBeingEdited(false);
  };

  // const onErrorHandler = (errors) => {
  //   console.error("Form validation errors: ", errors);
  //   toast.error("Empty fields or invalid values, please recheck the form");
  // };
  const onErrorHandler = (errors) => {
    console.error("Form validation errors: ", errors);

    // Loop through all errors and display each in a toast
    Object.values(errors).forEach((error) => {
      toast.error(error.message, {
        position: "top-right",
        duration: 5000,
      });
    });
  };
  const setProjectValuesHandler = (val) => {
    console.log("icp prefer",  val[0]?.[0]?.params.preferred_icp_hub?.[0])
    if (val) {
      setLogoPreview(
        val?.project_logo?.[0] instanceof Uint8Array
          ? uint8ArrayToBase64(val?.project_logo?.[0])
          : ""
      );
      setCoverPreview(
        val?.project_cover?.[0] instanceof Uint8Array
          ? uint8ArrayToBase64(val?.project_cover?.[0])
          : ""
      );

      setValue(
        "preferred_icp_hub",
        val[0]?.[0]?.params.preferred_icp_hub?.[0]
      );
      setValue("project_name", val[0]?.[0]?.params.project_name ?? "");
      setValue(
        "project_description",
        val[0]?.[0]?.params.project_description?.[0] ?? ""
      );
      setValue(
        "project_elevator_pitch",
        val[0]?.[0]?.params.project_elevator_pitch?.[0] ?? ""
      );
      setValue("project_website", val[0]?.[0]?.params.project_website?.[0] ?? "");
      setValue(
        "is_your_project_registered",
        val[0]?.[0]?.params.is_your_project_registered?.[0] ?? ""
      );

      if (val[0]?.[0]?.params.is_your_project_registered?.[0] === true) {
        setValue("is_your_project_registered", "true");
      } else {
        setValue("is_your_project_registered", "false");
      }
      setValue(
        "type_of_registration",
        val[0]?.[0]?.params.type_of_registration?.[0] ?? ""
      );
      setValue(
        "country_of_registration",
        val[0]?.[0]?.params.country_of_registration?.[0] ?? ""
      );
      setValue("live_on_icp_mainnet", val?.live_on_icp_mainnet?.[0] ?? "");
      if (val[0]?.[0]?.params.live_on_icp_mainnet?.[0] === true) {
        setValue("live_on_icp_mainnet", "true");
      } else {
        setValue("live_on_icp_mainnet", "false");
      }
      setValue("dapp_link", val[0]?.[0]?.params.dapp_link?.[0] ?? "");
      setValue(
        "weekly_active_users",
        val[0]?.[0]?.params.weekly_active_users?.[0] ?? 0
      );
      setValue("revenue", val[0]?.[0]?.params.revenue?.[0] ?? 0);
      if (val[0]?.[0]?.params.supports_multichain?.[0]) {
        setValue("multi_chain", "true");
      } else {
        setValue("multi_chain", "false");
      }
      setValue(
        "multi_chain_names",
        val[0]?.[0]?.params.supports_multichain
          ? val[0]?.[0]?.params.supports_multichain.join(", ")
          : ""
      );
      setMultiChainSelectedOptionsHandler(
        val[0]?.[0]?.params.supports_multichain ?? null
      );
      setValue(
        "multi_chain",
        val[0]?.[0]?.params.supports_multichain?.[0] ? "true" : "false"
      );

      const reasonToJoinString =
        val[0]?.[0]?.params?.reason_to_join_incubator || "";
      const reasonToJoinOptions = reasonToJoinString
        .split(",")
        .map((reason) => reason.trim());

      const formattedReasons = reasonToJoinOptions.map((reason) => ({
        value: reason,
        label: reason.charAt(0).toUpperCase() + reason.slice(1),
      }));

      setReasonOfJoiningSelectedOptions(formattedReasons);
      setValue("reason_to_join_incubator", formattedReasons);
      if (val[0]?.[0]?.params.money_raised_till_now?.[0] === true) {
        setValue("money_raised_till_now", "true");
      } else {
        setValue("money_raised_till_now", "false");
      }
      if (
        val[0]?.[0]?.params.money_raised?.[0]?.target_amount?.[0] &&
        val[0]?.[0]?.params.money_raised?.[0]?.sns?.[0]
      ) {
        setValue("money_raising", "true");
      } else {
        setValue("money_raising", "false");
      }
      setValue(
        "icp_grants",
        val[0]?.[0]?.params.money_raised?.[0]?.icp_grants || 0
      );
      setValue(
        "investors",
        val[0]?.[0]?.params.money_raised?.[0]?.investors || 0
      );
      setValue(
        "raised_from_other_ecosystem",
        val[0]?.[0]?.params.money_raised?.[0]?.raised_from_other_ecosystem ||
          0
      );
      setValue("valuation", val[0]?.[0]?.params.money_raised?.[0]?.sns ?? 0);
      setValue(
        "target_amount",
        val[0]?.[0]?.params.money_raised?.[0]?.target_amount ?? 0
      );

      const projectAreaOfFocusString =
        val[0]?.[0]?.params?.project_area_of_focus || "";
      const projectAreaOfFocusArray = projectAreaOfFocusString
        .split(",")
        .map((area) => area.trim());

      const formattedAreas = projectAreaOfFocusArray.map((area) => ({
        value: area,
        label: area.charAt(0).toUpperCase() + area.slice(1),
      }));

      setInterestedDomainsSelectedOptions(formattedAreas);
      setValue("project_area_of_focus", formattedAreas);
      setValue(
        "promotional_video",
        val[0]?.[0]?.params.promotional_video?.[0] ?? ""
      );
      setValue(
        "upload_private_documents",
        val[0]?.[0]?.params.upload_private_documents?.[0] ?? ""
      );
      if (val[0]?.[0]?.params.upload_private_documents?.[0] === true) {
        setValue("upload_private_documents", "true");
      } else {
        setValue("upload_private_documents", "false");
      }
      if (
        val[0]?.[0]?.params &&
        val[0]?.[0]?.params.public_docs?.[0] &&
        val[0]?.[0]?.params.public_docs?.[0].length
      ) {
        setValue("upload_public_documents", "true");
      } else {
        setValue("upload_public_documents", "false");
      }
      setValue("privateDocs", val[0]?.[0]?.params.private_docs?.[0] ?? []);
      setValue("publicDocs", val[0]?.[0]?.params.public_docs?.[0] ?? []);
      if (val[0]?.[0]?.params.links?.length) {
        const links = {};

        val[0]?.[0]?.params.links.forEach((linkArray) => {
          linkArray.forEach((linkData) => {
            const url = linkData.link[0];

            if (url && typeof url === "string") {
              if (url.includes("linkedin.com")) {
                links["LinkedIn"] = url;
              } else if (url.includes("github.com")) {
                links["GitHub"] = url;
              } else if (url.includes("t.me") || url.includes("telegram")) {
                links["Telegram"] = url;
              } else {
                const domainKey = new URL(url).hostname.replace("www.", "");
                links[domainKey] = url;
              }
            }
          });
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
            .split(", ")
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
        ? val?.[0].split(", ").map((chain) => ({ value: chain, label: chain }))
        : []
    );
  };

  const handleCancel = () => {
    setEditMode(false);
    setIsLinkBeingEdited(false);
  };

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const projectDetailRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
    if (actor) {
      (async () => {
        if (actor.get_my_project) {
          const result = await actor.get_my_project();
          if (result) {
            setImageData(
              result?.params?.user_data?.profile_picture?.[0] ?? null
            );
            setLogoData(result?.params?.project_logo?.[0] ?? []);
            setCoverData(result?.params?.project_cover?.[0] ?? []);
            setValue(
              "type_of_profile",
              result?.params?.user_data?.type_of_profile?.[0] ?? ""
            );
            setValue(
              "preferred_icp_hub",
              result?.params?.preferred_icp_hub?.[0] ?? ""
            );
          } else {
            setImageData(null);
            setLogoData([]);
            setCoverData([]);
            setValue("type_of_profile", "");
            setValue("preferred_icp_hub", "");
          }
        }
      })();
    }
  }, [actor]);

  useEffect(() => {
    if (projectFullData) {
      setProjectValuesHandler(projectFullData);
      setEditMode(true);
    }
  }, [projectFullData]);

  const preferred_icp_hub =
    projectFullData[0]?.[0]?.params.preferred_icp_hub?.[0] ?? "";
  const project_name = projectFullData[0]?.[0]?.params.project_name ?? "";
  const project_description =
    projectFullData[0]?.[0]?.params.project_description?.[0] ?? "";
  const project_elevator_pitch =
    projectFullData[0]?.[0]?.params.project_elevator_pitch ?? "";
  const project_website =
    projectFullData[0]?.[0]?.params.project_website?.[0] ?? "";
  const is_your_project_registered = projectFullData[0]?.[0]?.params
    .is_your_project_registered?.[0]
    ? "true"
    : "false";
  const isyourprojectregistered = is_your_project_registered ? "Yes" : "No";
  const type_of_registration =
    projectFullData[0]?.[0]?.params.type_of_registration?.[0] ?? "";
  const country_of_registration =
    projectFullData[0]?.[0]?.params.country_of_registration?.[0] ?? "";
  const live_on_icp_mainnet = projectFullData[0]?.[0]?.params
    .live_on_icp_mainnet?.[0]
    ? "true"
    : "false";
  const liveonicpmainnet = live_on_icp_mainnet ? "Yes" : "No";
  const dapp_link = projectFullData[0]?.[0]?.params.dapp_link?.[0] ?? "";
  const weekly_active_users =
    projectFullData[0]?.[0]?.params.weekly_active_users?.[0] ?? "";
  const revenue = projectFullData[0]?.[0]?.params.revenue?.[0] ?? "";
  const multi_chain = projectFullData[0]?.[0]?.params.supports_multichain?.[0]
    ? "true"
    : "false";
  const multichain = multi_chain ? "Yes" : "No";
  const project_area_of_focus =
    projectFullData[0]?.[0]?.params.project_area_of_focus;
  const multi_chain_names =
    projectFullData[0]?.[0]?.params.supports_multichain?.join(", ") ?? "";
  const money_raised_till_now = projectFullData[0]?.[0]?.params
    .money_raised_till_now?.[0]
    ? "true"
    : "false";
  const moneyraisedtillnow = money_raised_till_now ? "Yes" : "No";
  const money_raising =
    projectFullData[0]?.[0]?.params.money_raised?.[0]?.target_amount?.[0] &&
    projectFullData[0]?.[0]?.params.money_raised?.[0]?.sns?.[0]
      ? "true"
      : "false";
  const moneyraising = money_raising ? "Yes" : "No";
  const icp_grants =
    projectFullData[0]?.[0]?.params.money_raised?.[0]?.icp_grants ?? "";
  const investors =
    projectFullData[0]?.[0]?.params.money_raised?.[0]?.investors ?? "";
  const raised_from_other_ecosystem =
    projectFullData[0]?.[0]?.params.money_raised?.[0]?.raised_from_other_ecosystem ??
    "";
  const valuation = projectFullData[0]?.[0]?.params.money_raised?.[0]?.sns ?? "";
  const target_amount =
    projectFullData[0]?.[0]?.params.money_raised?.[0]?.target_amount ?? 0;
  const promotional_video =
    projectFullData[0]?.[0]?.params.promotional_video?.[0] ?? "";
  const links = projectFullData[0]?.[0]?.params.links;
  const token_economics =
    projectFullData[0]?.[0]?.params.token_economics?.[0] ?? "";
  const white_paper =
    projectFullData[0]?.[0]?.params.long_term_goals?.[0] ?? "";
  const upload_private_documents = projectFullData[0]?.[0]?.params
    .upload_private_documents?.[0]
    ? "true"
    : "false";
  const upload_public_documents = projectFullData[0]?.[0]?.params
    .public_docs?.[0]?.length
    ? "true"
    : "false";
  const privateDocs = projectFullData[0]?.[0]?.params.private_docs?.[0] ?? [];
  const publicDocs = projectFullData[0]?.[0]?.params.public_docs?.[0] ?? [];
  const reason_to_join_incubator =
    projectFullData[0]?.[0]?.params.reason_to_join_incubator;

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline"],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "align",
    "link",
  ];

  return (
    <div ref={projectDetailRef} className="px-1">
      <div className="px-1">
        <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
          {/* Preferred ICP Hub */}
       {/* Reason for Joining This Platform */}
<div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
  <div className="flex justify-between items-center">
    <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start mb-2">
      Reason for joining this platform
    </label>
    <img
      src={editp}
      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
      alt="edit"
      onClick={() => handleEditClick("reason_to_join_incubator")}
    />
  </div>
  {editMode.reason_to_join_incubator ? (
    <div>
      <ReactSelect
        isMulti
        menuPortalTarget={document.body}
        menuPosition={"fixed"}
        styles={getReactSelectStyles(errors?.reason_to_join_incubator)}
        value={reasonOfJoiningSelectedOptions}
        options={reasonOfJoiningOptions}
        classNamePrefix="select"
        className="basic-multi-select w-full text-start"
        placeholder="Select your reasons to join this platform"
        name="reason_to_join_incubator"
        onChange={(selectedOptions) => {
          setReasonOfJoiningSelectedOptions(selectedOptions);
          clearErrors("reason_to_join_incubator");
          setValue(
            "reason_to_join_incubator",
            selectedOptions.map((option) => option.value).join(", "),
            { shouldValidate: true }
          );
        }}
      />
      {errors.reason_to_join_incubator && (
        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
          {errors.reason_to_join_incubator.message}
        </span>
      )}
    </div>
  ) : (
    <div className="flex flex-wrap gap-2">
      {(reason_to_join_incubator || "")
        .split(", ")
        .map((reason, index) => (
          <span
            key={index}
            className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
          >
            {reason}
          </span>
        ))}
    </div>
  )}
</div>


          
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
  <div className="flex justify-between items-center">
    <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
      Preferred ICP Hub you would like to be associated with
    </label>
    <img
      src={editp}
      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
      alt="edit"
      onClick={() => handleEditClick("preferred_icp_hub")}
    />
  </div>
  {editMode.preferred_icp_hub ? (
    <div>
      <select
        {...register("preferred_icp_hub")}
        className={`bg-gray-50 border-2 ${
          errors.preferred_icp_hub ? "border-red-500 " : "border-[#737373]"
        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      >
        <option className="text-lg font-bold" value="">
          Select your ICP Hub
        </option>
        {getAllIcpHubs?.map((hub) => (
          <option
            key={hub.id}
            value={`${hub.name} ,${hub.region}`}
            className="text-lg font-bold"
          >
            {hub.name}, {hub.region}
          </option>
        ))}
      </select>
      {errors.preferred_icp_hub && (
        <p className="mt-1 text-sm text-red-500 font-bold text-left">
          {errors.preferred_icp_hub.message}
        </p>
      )}
    </div>
  ) : (
    <div className="flex justify-between items-center cursor-pointer py-1">
      <span className="mr-2 text-sm">
        {typeof preferred_icp_hub === 'string' ? preferred_icp_hub : ''}
      </span>
    </div>
  )}
</div>


          {/* Project Name */}
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Project Name
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("project_name")}
              />
            </div>
            {editMode.project_name ? (
              <div>
                <input
                  type="text"
                  {...register("project_name")}
                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_name
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Enter your Project name"
                />
                {errors?.project_name && (
                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                    {errors?.project_name?.message}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">
                  {project_name}
                </span>
              </div>
            )}
          </div>

          {/* Project Description */}
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Project Description
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("project_description")}
              />
            </div>
            {editMode.project_description ? (
              <div>
                <Controller
        name="project_description"
        control={control}
        defaultValue={project_description}
        render={({ field: { onChange, value } }) => (
          <ReactQuill
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder="Enter your description here..."
          />
        )}
      />
                {errors.project_description && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.project_description.message}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm line-clamp-3 hover:line-clamp-6">
                  {parse(project_description)}
                </span>
              </div>
            )}
          </div>

          {/* Project Elevator Pitch */}
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Project Elevator Pitch
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("project_elevator_pitch")}
              />
            </div>
            {editMode.project_elevator_pitch ? (
              <div>
                <input
                  type="text"
                  {...register("project_elevator_pitch")}
                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_elevator_pitch
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="https://"
                />
                {errors?.project_elevator_pitch && (
                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                    {errors?.project_elevator_pitch?.message}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">
                  {project_elevator_pitch}
                </span>
              </div>
            )}
          </div>

          {/* Project Website */}
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Project Website
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("project_website")}
              />
            </div>
            {editMode.project_website ? (
              <div>
                <input
                  type="text"
                  {...register("project_website")}
                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_website
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="https://"
                />
                {errors?.project_website && (
                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                    {errors?.project_website?.message}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">
                  {project_website}
                </span>
              </div>
            )}
          </div>

          {/* Is Your Project Registered */}
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Is Your Project Registered?
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("is_your_project_registered")}
              />
            </div>
            {editMode.is_your_project_registered ? (
              <div>
                <select
                  {...register("is_your_project_registered")}
                  className={`bg-gray-50 border-2 ${
                    errors.is_your_project_registered
                      ? "border-red-500"
                      : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                  <option className="text-lg font-bold" value="false">
                    No
                  </option>
                  <option className="text-lg font-bold" value="true">
                    Yes
                  </option>
                </select>
                {errors.is_your_project_registered && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.is_your_project_registered.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">
                  {/* {getValues("is_your_project_registered") ? "Yes" : "No"} */}
                  {isyourprojectregistered}
                  {/* {is_your_project_registered} */}
                </span>
              </div>
            )}
          </div>

          {watch("is_your_project_registered") === "true" && (
            <>
              {/* Type of Registration */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    Type of Registration
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("type_of_registration")}
                  />
                </div>
                {editMode.type_of_registration ? (
                  <div>
                    <select
                      {...register("type_of_registration")}
                      className={`bg-gray-50 border-2 ${
                        errors.type_of_registration
                          ? "border-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="">
                        Select registration type
                      </option>
                      <option className="text-lg font-bold" value="Company">
                        Company
                      </option>
                      <option className="text-lg font-bold" value="DAO">
                        DAO
                      </option>
                    </select>
                    {errors.type_of_registration && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.type_of_registration.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">
                      {type_of_registration}
                    </span>
                  </div>
                )}
              </div>

              {/* Country of Registration */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    Country of Registration
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("country_of_registration")}
                  />
                </div>
                {editMode.country_of_registration ? (
                  <div>
                    <select
                      {...register("country_of_registration")}
                      className={`bg-gray-50 border-2 ${
                        errors.country_of_registration
                          ? "border-red-500 "
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="">
                        Select your country
                      </option>
                      {countries?.map((expert) => (
                        <option
                          key={expert.name}
                          value={expert.name}
                          className="text-lg font-bold"
                        >
                          {expert.name}
                        </option>
                      ))}
                    </select>
                    {errors?.country_of_registration && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.country_of_registration?.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">
                      {country_of_registration}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Are you also multi-chain */}
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-xs text-gray-500 uppercase">
                Are you also multi-chain
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => {
                  handleEditClick("multi_chain");
                }}
              />
            </div>
            {editMode.multi_chain ? (
              <div>
                <select
        {...register("multi_chain")}
        className={`bg-gray-50 border-2 ${
          errors.multi_chain ? "border-red-500" : "border-[#737373]"
        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      >
        <option className="text-lg font-bold" value="false">
          No
        </option>
        <option className="text-lg font-bold" value="true">
          Yes
        </option>
      </select>
                  {errors.multi_chain && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.multi_chain.message}
                    </p>
                  )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">
                  {/* {getValues("multi_chain") === "true" ? "Yes" : "No"} */}
                  {multichain}
                  {/* {multi_chain} */}
                </span>
              </div>
            )}
          </div>

          {watch("multi_chain") === "true" && (
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-xs text-gray-500 uppercase mb-1 ">
                  Please select the chains
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("supports_multichain")}
                />
              </div>
              {editMode.supports_multichain ? (
                <>
                 <ReactSelect
                      isMulti
                      menuPortalTarget={document.body}
                      menuPosition={"fixed"}
                      styles={getReactSelectStyles(errors?.multi_chain_names)}
                      value={multiChainSelectedOptions}
                      options={multiChainOptions}
                      classNamePrefix="select"
                      className="basic-multi-select w-full text-start"
                      placeholder="Select a chain"
                      name="multi_chain_names"
                      onChange={(selectedOptions) => {
                        if (selectedOptions && selectedOptions.length > 0) {
                          setMultiChainSelectedOptions(selectedOptions);
                          clearErrors("multi_chain_names");
                          setValue(
                            "multi_chain_names",
                            selectedOptions
                              .map((option) => option.value)
                              .join(", "),
                            { shouldValidate: true }
                          );
                        } else {
                          setMultiChainSelectedOptions([]);
                          setValue("multi_chain_names", "", {
                            shouldValidate: true,
                          });
                          setError("multi_chain_names", {
                            type: "required",
                            message: "Atleast one chain name required",
                          });
                        }
                      }}
                    />
                    {errors.multi_chain_names && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.multi_chain_names.message}
                      </p>
                    )}
                </>
              ) : (
                <>
              <div className="flex flex-wrap gap-2">
                {(multi_chain_names) &&
                  (multi_chain_names)
                    .split(", ")
                    .map((focus, index) => (
                      <span
                        key={index}
                        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
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
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Live on ICP Mainnet?
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("live_on_icp_mainnet")}
              />
            </div>
            {editMode.live_on_icp_mainnet ? (
              <div>
                <select
                  {...register("live_on_icp_mainnet")}
                  className={`bg-gray-50 border-2 ${
                    errors.live_on_icp_mainnet
                      ? "border-red-500"
                      : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                  <option className="text-lg font-bold" value="false">
                    No
                  </option>
                  <option className="text-lg font-bold" value="true">
                    Yes
                  </option>
                </select>
                {errors.live_on_icp_mainnet && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.live_on_icp_mainnet.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">
                  {/* {getValues("live_on_icp_mainnet") ? "Yes" : "No"} */}
                  {liveonicpmainnet}
                </span>
              </div>
            )}
          </div>

          {watch("live_on_icp_mainnet") === "true" && (
            <>
              {/* dApp Link */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    dApp Link
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("dapp_link")}
                  />
                </div>
                {editMode.dapp_link ? (
                  <div>
                    <input
                      type="text"
                      {...register("dapp_link")}
                      className={`bg-gray-50 border-2 
                                             ${
                                               errors?.dapp_link
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="https://"
                    />
                    {errors?.dapp_link && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.dapp_link?.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">
                      {dapp_link}
                    </span>
                  </div>
                )}
              </div>

              {/* Weekly Active Users */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    Weekly Active Users
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("weekly_active_users")}
                  />
                </div>
                {editMode.weekly_active_users ? (
                  <div>
                    <input
                      type="number"
                      {...register("weekly_active_users")}
                      className={`bg-gray-50 border-2 
                                             ${
                                               errors?.weekly_active_users
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="Enter Weekly active users"
                      onWheel={(e) => e.target.blur()}
                      min={0}
                    />
                    {errors?.weekly_active_users && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.weekly_active_users?.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">
                      {weekly_active_users}
                    </span>
                  </div>
                )}
              </div>

              {/* Revenue */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    Revenue (in Million USD)
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("revenue")}
                  />
                </div>
                {editMode.revenue ? (
                  <div>
                    <input
                      type="number"
                      {...register("revenue")}
                      className={`bg-gray-50 border-2 
                                             ${
                                               errors?.revenue
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="Enter Revenue"
                      onWheel={(e) => e.target.blur()}
                      min={0}
                    />
                    {errors?.revenue && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.revenue?.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">{revenue}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Money Raised Till Now */}
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Money Raised Till Now?
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("money_raised_till_now")}
              />
            </div>
            {editMode.money_raised_till_now ? (
              <div>
                <select
                  {...register("money_raised_till_now")}
                  className={`bg-gray-50 border-2 ${
                    errors.money_raised_till_now
                      ? "border-red-500"
                      : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                  <option className="text-lg font-bold" value="false">
                    No
                  </option>
                  <option className="text-lg font-bold" value="true">
                    Yes
                  </option>
                </select>
                {errors.money_raised_till_now && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.money_raised_till_now.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">
                  {/* {getValues("money_raised_till_now") ? "Yes" : "No"} */}
                  {moneyraisedtillnow}
                </span>
              </div>
            )}
          </div>

          {watch("money_raised_till_now") === "true" && (
            <>
              {/* ICP Grants */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    ICP Grants
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("icp_grants")}
                  />
                </div>
                {editMode.icp_grants ? (
                  <div>
                    <input
                      type="number"
                      {...register("icp_grants")}
                      className={`bg-gray-50 border-2 
                                             ${
                                               errors?.icp_grants
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="Enter your Grants"
                      onWheel={(e) => e.target.blur()}
                      min={0}
                    />
                    {errors?.icp_grants && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.icp_grants?.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">
                      {icp_grants}
                    </span>
                  </div>
                )}
              </div>

              {/* Investors */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    Investors
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("investors")}
                  />
                </div>
                {editMode.investors ? (
                  <div>
                    <input
                      type="number"
                      {...register("investors")}
                      className={`bg-gray-50 border-2 
                                             ${
                                               errors?.investors
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="Enter Investors"
                      onWheel={(e) => e.target.blur()}
                      min={0}
                    />
                    {errors?.investors && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investors?.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">
                      {investors}
                    </span>
                  </div>
                )}
              </div>

              {/* Raised from Other Ecosystem */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    Raised from Other Ecosystem
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() =>
                      handleEditClick("raised_from_other_ecosystem")
                    }
                  />
                </div>
                {editMode.raised_from_other_ecosystem ? (
                  <div>
                    <input
                      type="number"
                      {...register("raised_from_other_ecosystem")}
                      className={`bg-gray-50 border-2 
                                             ${
                                               errors?.raised_from_other_ecosystem
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="Enter Launchpad"
                      onWheel={(e) => e.target.blur()}
                      min={0}
                    />
                    {errors?.raised_from_other_ecosystem && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.raised_from_other_ecosystem?.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">
                      {raised_from_other_ecosystem}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Money Raising */}
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Money Raising?
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("money_raising")}
              />
            </div>
            {editMode.money_raising ? (
              <div>
                <select
                  {...register("money_raising")}
                  className={`bg-gray-50 border-2 ${
                    errors.money_raising ? "border-red-500" : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                  <option className="text-lg font-bold" value="false">
                    No
                  </option>
                  <option className="text-lg font-bold" value="true">
                    Yes
                  </option>
                </select>
                {errors.money_raising && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.money_raising.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">
                  {/* {getValues("money_raising") ? "Yes" : "No"} */}
                  {moneyraising}
                </span>
              </div>
            )}
          </div>

          {watch("money_raising") === "true" && (
            <>
              {/* Target Amount */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    Target Amount (in Million USD)
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("target_amount")}
                  />
                </div>
                {editMode.target_amount ? (
                  <div>
                    <input
                      type="number"
                      {...register("target_amount")}
                      className={`bg-gray-50 border-2 
                                             ${
                                               errors?.target_amount
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="Enter your Target Amount"
                      onWheel={(e) => e.target.blur()}
                      min={0}
                    />
                    {errors?.target_amount && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.target_amount?.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">
                      {target_amount}
                    </span>
                  </div>
                )}
              </div>

              {/* SNS */}
              <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                    SNS
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("valuation")}
                  />
                </div>
                {editMode.valuation ? (
                  <div>
                    <input
                      type="number"
                      {...register("valuation")}
                      className={`bg-gray-50 border-2 
                                             ${
                                               errors?.valuation
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="Enter valuation (In million)"
                      onWheel={(e) => e.target.blur()}
                      min={0}
                    />
                    {errors?.valuation && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.valuation?.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">{valuation}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between">
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                Interests
              </h3>
              <div>
                <button
                  type="button"
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  onClick={() => handleEditClick("project_area_of_focus")}
                >
                  <img src={editp} alt="edit" />
                </button>
              </div>
            </div>
            {editMode.project_area_of_focus ? (
             <ReactSelect
             isMulti
             menuPortalTarget={document.body}
             menuPosition={"fixed"}
             styles={getReactSelectStyles(errors?.project_area_of_focus)}
             value={interestedDomainsSelectedOptions}
             options={interestedDomainsOptions}
             classNamePrefix="select"
             className="basic-multi-select w-full text-start"
             placeholder="Select domains you are interested in"
             name="project_area_of_focus"
             onChange={(selectedOptions) => {
               if (selectedOptions && selectedOptions.length > 0) {
                 setInterestedDomainsSelectedOptions(selectedOptions);
                 clearErrors("project_area_of_focus");
                 setValue(
                   "project_area_of_focus",
                   selectedOptions.map((option) => option.value).join(", "),
                   { shouldValidate: true }
                 );
               } else {
                 setInterestedDomainsSelectedOptions([]);
                 setValue("project_area_of_focus", "", {
                   shouldValidate: true,
                 });
                 setError("project_area_of_focus", {
                   type: "required",
                   message: "Selecting an interest is required",
                 });
               }
             }}
           />
           
            ) : (
              <div className="flex flex-wrap gap-2">
                {(project_area_of_focus) &&
                  (project_area_of_focus)
                    .split(", ")
                    .map((focus, index) => (
                      <span
                        key={index}
                        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                      >
                        {focus}
                      </span>
                    ))}
              </div>
            )}
          </div>

          {/* Promotional Video */}
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Promotional Video
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("promotional_video")}
              />
            </div>
            {editMode.promotional_video ? (
              <div>
                <input
                  type="text"
                  {...register("promotional_video")}
                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.promotional_video
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="https://"
                />
                {errors?.promotional_video && (
                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                    {errors?.promotional_video?.message}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">
                  {promotional_video}
                </span>
              </div>
            )}
          </div>

          {/* Links */}
          {/* <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Links
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("links")}
              />
            </div>
            {editMode.links ? (
              <div className="relative">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center mb-4 border-b pb-2"
                  >
                    <Controller
                      name={`links[${index}].link`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="flex items-center w-full">
                          <div className="flex items-center space-x-2 w-full">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                              {field.value && getLogo(field.value)}
                            </div>
                            <input
                              type="text"
                              placeholder="Enter your social media URL"
                              className={`px-2 py-1 border ${
                                fieldState.error
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md w-full`}
                              {...field}
                            />
                          </div>
                        </div>
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ link: "" })}
                  className="flex items-center p-1 text-[#155EEF] font-semibold text-xs"
                >
                  <FaPlus className="mr-1" /> Add Another Link
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {(links) &&
                  (links).map((linkObj, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                        {linkObj.link && getLogo(linkObj.link)}
                      </div>
                      <span className="text-sm text-gray-700">
                        {linkObj.link}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div> */}
          <h3 className="mb-2 text-xs text-gray-500 px-3">LINKS</h3>
          <div className="flex items-center gap-5 px-3">
            {/* Display existing links */}
            {console.log("Display existing links ", socialLinks)}
            {socialLinks &&
              Object.keys(socialLinks).map((key, index) => {
                const url = socialLinks[key];
                if (!url) {
                  return null;
                }

                const Icon = getIconForLink(url);
                return (
                  <div className="group relative flex items-center" key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Icon className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                    </a>
                    <button
                      type="button"
                      className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-6 h-10 w-7"
                      onClick={() => handleLinkEditToggle(key)}
                    >
                      <img src={editp} alt="edit" />
                    </button>
                    {isEditingLink[key] && (
                      <input
                        type="text"
                        {...register(`social_links[${key}]`)}
                        value={url}
                        onChange={(e) => handleLinkChange(e, key)}
                        className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
                      />
                    )}
                  </div>
                );
              })}
          </div>

          {/* Buttons */}
            {/* {Object.values(editMode).some((value) => value) && ( */}
                {(Object.values(editMode).some((value) => value) || isLinkBeingEdited ) && (
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                type="submit"
                className="text-white font-bold bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4"
              >
                {isSubmitting ? (
                  <ThreeDots
                    visible={true}
                    height="35"
                    width="35"
                    color="#FFFEFF"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperclassName=""
                  />
                ) : editMode ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
      <Toaster/>
    </div>
  );
};

export default ProjectDetail;

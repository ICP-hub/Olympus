use crate::mentor::MentorProfile;

use crate::admin::send_approval_request;
use crate::is_admin;
use crate::is_user_anonymous;
use crate::ratings::calculate_average_api;
use crate::ratings::{RatingAverages, RatingSystem};
use crate::state_handler::{mutate_state, read_state, Candid, StoredPrincipal};
use crate::user_module::*;
use crate::user_module::{UserInfoInternal, UserInformation};
use crate::vc_registration::VentureCapitalist;
use bincode::{self, DefaultOptions, Options};
use candid::{CandidType, Principal};
use ic_cdk::api::call::call;
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::api::time;
use ic_cdk::storage;
use ic_cdk_macros::*;
use ic_certified_assets::types::Key;
use ic_stable_structures::vec;
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use serde_cbor::Value::Null;
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::cmp;
use std::collections::HashMap;
use std::io::Read;
#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct TeamMember {
    pub member_uid: String,
    pub member_data: UserInformation,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Jobs {
    title: String,
    description: String,
    category: String,
    link: String,
    project_id: String,
    location: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct JobsInternal {
    job_data: Jobs,
    timestamp: u64,
    project_name: String,
    project_desc: Option<String>,
    project_logo: Option<Vec<u8>>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Announcements {
    project_id: String,
    announcement_title: String,
    announcement_description: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct AnnouncementsInternal {
    announcement_data: Announcements,
    timestamp: u64,
    project_name: String,
    project_desc: Option<String>,
    project_logo: Option<Vec<u8>>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfo {
    pub project_name: String,
    pub project_logo: Option<Vec<u8>>,
    pub preferred_icp_hub: Option<String>,
    pub live_on_icp_mainnet: Option<bool>,
    pub money_raised_till_now: Option<bool>,
    pub supports_multichain: Option<String>,
    pub project_elevator_pitch: Option<String>,
    pub project_area_of_focus: String,
    pub promotional_video: Option<String>,
    pub github_link: Option<String>,
    pub reason_to_join_incubator: String,
    pub project_description: Option<String>, //
    pub project_cover: Option<Vec<u8>>,
    pub project_team: Option<Vec<TeamMember>>,
    pub token_economics: Option<String>,
    pub technical_docs: Option<String>,
    pub long_term_goals: Option<String>,
    pub target_market: Option<String>, //
    pub self_rating_of_project: f64,
    pub user_data: UserInformation,
    pub mentors_assigned: Option<Vec<MentorProfile>>,
    pub vc_assigned: Option<Vec<VentureCapitalist>>,
    pub project_twitter: Option<String>,
    pub project_linkedin: Option<String>,
    pub project_website: Option<String>,
    pub project_discord: Option<String>,
    pub money_raised: Option<MoneyRaised>,
    upload_private_documents: Option<bool>,
    private_docs: Option<Vec<Docs>>,
    public_docs: Option<Vec<Docs>>,
    pub dapp_link: Option<String>,
    pub weekly_active_users: Option<u64>,
    pub revenue: Option<u64>,
    pub is_your_project_registered: Option<bool>,
    pub type_of_registration: Option<String>,
    pub country_of_registration: Option<String>,
}

impl ProjectInfo {
    pub fn validate(&self) -> Result<(), String> {
        if let Some(ref preferred_icp_hub) = self.preferred_icp_hub {
            if preferred_icp_hub.trim().is_empty() {
                return Err("Field cannot be empty".into());
            }
        }

        // if let Some(ref exisitng_icp_project_porfolio) = self.existing_icp_project_porfolio {
        //     if exisitng_icp_project_porfolio.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        // if let Some(ref multichain) = self.multichain {
        //     if multichain.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        Ok(())
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectPublicInfo {
    pub project_id: String,
    pub project_name: String,
    pub project_logo: Option<Vec<u8>>,
    pub preferred_icp_hub: Option<String>,
    pub live_on_icp_mainnet: Option<bool>,
    pub money_raised_till_now: Option<bool>,
    pub supports_multichain: Option<String>,
    pub project_elevator_pitch: Option<String>,
    pub project_area_of_focus: String,
    pub promotional_video: Option<String>,
    pub github_link: Option<String>,
    pub reason_to_join_incubator: String,
    pub project_description: Option<String>,
    pub project_cover: Option<Vec<u8>>,
    pub project_team: Option<Vec<TeamMember>>,
    pub token_economics: Option<String>,
    pub technical_docs: Option<String>,
    pub long_term_goals: Option<String>,
    pub target_market: Option<String>,
    pub self_rating_of_project: f64,
    pub user_data: UserInformation,
    pub mentors_assigned: Option<Vec<MentorProfile>>,
    pub vc_assigned: Option<Vec<VentureCapitalist>>,
    pub project_twitter: Option<String>,
    pub project_linkedin: Option<String>,
    pub project_website: Option<String>,
    pub project_discord: Option<String>,
    upload_private_documents: Option<bool>,
    public_docs: Option<Vec<Docs>>,
    pub dapp_link: Option<String>,
}

#[derive(Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectPublicInfoInternal {
    pub params: ProjectPublicInfo,
    pub uid: String,
    pub is_active: bool,
    pub is_verified: bool,
    creation_date: u64,
}

impl ProjectInfo {}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Docs {
    title: String,
    link: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct MoneyRaised {
    pub target_amount: Option<f64>,
    pub icp_grants: Option<String>,
    pub investors: Option<String>,
    pub sns: Option<String>,
    pub raised_from_other_ecosystem: Option<String>,
}

impl MoneyRaised {
    // Calculates the total amount raised from various sources.
    // Assumes all Option<String> fields represent valid f64 values or None.
    pub fn total_amount(&self) -> f64 {
        let mut total: f64 = 0.0;

        if let Some(icp_grants) = &self.icp_grants {
            total += icp_grants.parse::<f64>().unwrap_or(0.0);
        }
        if let Some(investors) = &self.investors {
            total += investors.parse::<f64>().unwrap_or(0.0);
        }
        if let Some(sns) = &self.sns {
            total += sns.parse::<f64>().unwrap_or(0.0);
        }
        if let Some(raised_from_other_ecosystem) = &self.raised_from_other_ecosystem {
            total += raised_from_other_ecosystem.parse::<f64>().unwrap_or(0.0);
        }

        total
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoForUser {
    pub project_name: Option<String>,
    pub project_logo: Option<Vec<u8>>,
    pub project_description: Option<String>,
    pub community_rating: Option<RatingAverages>,
    pub project_cover: Option<Vec<u8>>,
    pub project_twitter: Option<String>,
    pub project_linkedin: Option<String>,
    pub project_website: Option<String>,
    pub project_discord: Option<String>,
    pub promotional_video: Option<String>,
    pub github_link: Option<String>,
    //pub user_data: UserInformation,
    pub project_team: Option<Vec<TeamMember>>,
    pub dapp_link: Option<String>,
    pub weekly_active_users: Option<u64>,
    pub date_of_joining: Option<u64>,
    pub mentor_associated: Option<Vec<MentorProfile>>,
    pub vc_associated: Option<Vec<VentureCapitalist>>,
    pub team_member_info: Option<Vec<TeamMember>>,
    pub announcements: HashMap<Principal, Vec<AnnouncementsInternal>>,
    pub website_social_group: Option<String>,
    pub live_link_of_project: Option<String>,
    pub jobs_opportunity: Option<Vec<JobsInternal>>,
    pub area_of_focus: Option<String>,
    pub country_of_project: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoForUserInternal {
    pub params: ProjectInfoForUser,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoInternal {
    pub params: ProjectInfo,
    pub uid: String,
    pub is_active: bool,
    pub is_verified: bool,
    pub creation_date: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct NotificationProject {
    notifiation_id: String,
    pub project_id: String,
    pub message: String,
    notification_sender: NotificationSender,
    notification_verifier: NotificationVerifier,
    timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct NotificationSender {
    name: String,
    image: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct NotificationVerifier {
    name: String,
    image: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct NotificationForOwner {
    sender_name: String,
    sender_image: Vec<u8>,
    message: String,
    project_id: String,
    timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Blog {
    blog_url: String,
    timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct FilterCriteria {
    pub country: Option<String>,
    pub rating_range: Option<(f64, f64)>,
    pub area_of_focus: Option<String>,
    pub money_raised_range: Option<(f64, f64)>,
    pub mentor_name: Option<String>,
    pub vc_name: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
pub struct ProjectUpdateRequest {
    project_id: String,
    pub original_info: ProjectInfo,
    pub updated_info: ProjectInfo,
    pub principal: Principal,
    pub accepted_at: u64,
    pub rejected_at: u64,
    pub sent_at: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
pub struct ProjectVecWithRoles {
    pub project_profile: Vec<ProjectInfoInternal>,
    pub roles: Vec<Role>,
}

// #[derive(Serialize, Deserialize, Clone, CandidType)]
// pub struct ProjectVecWithRolesAndRating {
//     pub project_profile: Vec<ProjectInfoInternal>,
//     pub roles: Vec<Role>,
//     pub rating : RatingAverages
// }

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct SpotlightDetails {
    pub added_by: Principal,
    pub project_id: String,
    pub project_details: ProjectInfoInternal,
    pub approval_time: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AccessRequest {
    sender: Principal,
    name: String,
    image: Vec<u8>,
    project_id: String,
    request_type: String,
    status: String,
}
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
enum ProjectNotificationType {
    AccessRequest(AccessRequest),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProjectNotification {
    notification_type: ProjectNotificationType,
    timestamp: u64,
}

#[derive(CandidType, Clone, Serialize, Deserialize, Debug)]
pub struct ProjectReview {
    name: String,
    profile_pic: Vec<u8>,
    message: String,
    timestamp: u64,
    tag: String,
    rating: u32,
}

#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct ProjectRatingStruct {
    rating: u32,
    message: String,
    project_id: String,
}

impl ProjectReview {
    pub fn new(
        name: String,
        profile_pic: Vec<u8>,
        message: String,
        rating: u32,
    ) -> Result<ProjectReview, &'static str> {
        if rating > 5 {
            return Err("Rating must be between 0.0 and 5.0");
        }

        let rating_int = (rating * 10) as i32;

        let tag = match rating_int {
            0..=10 => "Needs Improvement",
            11..=20 => "Fair",
            21..=30 => "Good",
            31..=40 => "Very Good",
            41..=50 => "Excellent",
            _ => "Unknown",
        }
        .to_string();

        Ok(ProjectReview {
            name,
            profile_pic,
            message,
            timestamp: time(),
            tag,
            rating,
        })
    }
}

// pub type ProjectAnnouncements = HashMap<Principal, Vec<AnnouncementsInternal>>;
// pub type Notifications = HashMap<Principal, Vec<NotificationProject>>;
// pub type BlogPost = HashMap<Principal, Vec<Blog>>;

// pub type ApplicationDetails = HashMap<Principal, Vec<ProjectInfoInternal>>;
// pub type PendingDetails = HashMap<String, ProjectUpdateRequest>;
// pub type DeclinedDetails = HashMap<String, ProjectUpdateRequest>;

// pub type ProjectDetails = HashMap<Principal, ProjectInfoInternal>;
// pub type JobDetails = HashMap<Principal, Vec<JobsInternal>>;
// pub type SpotlightProjects = Vec<SpotlightDetails>;
// pub type MoneyAccess = HashMap<Principal, Vec<AccessRequest>>;
// pub type PrivateDocsAccess = HashMap<Principal, Vec<AccessRequest>>;

// thread_local! {
//     pub static PROJECT_ACCESS_NOTIFICATIONS : RefCell<HashMap<String, Vec<ProjectNotification>>> = RefCell::new(HashMap::new());
//     pub static  APPLICATION_FORM: RefCell<ApplicationDetails> = RefCell::new(ApplicationDetails::new());
//     //pub static PROJECT_DETAILS: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());
//     pub static NOTIFICATIONS: RefCell<Notifications> = RefCell::new(Notifications::new());
//     pub static OWNER_NOTIFICATIONS: RefCell<HashMap<Principal, Vec<NotificationForOwner>>> = RefCell::new(HashMap::new());
//     pub static PROJECT_ANNOUNCEMENTS:RefCell<ProjectAnnouncements> = RefCell::new(ProjectAnnouncements::new());
//     pub static BLOG_POST:RefCell<BlogPost> = RefCell::new(BlogPost::new());

//     pub static PROJECT_AWAITS_RESPONSE: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());
//     pub static DECLINED_PROJECT_REQUESTS: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());

//     pub static PENDING_PROJECT_UPDATES: RefCell<PendingDetails> = RefCell::new(PendingDetails::new());
//     pub static DECLINED_PROJECT_UPDATES: RefCell<DeclinedDetails> = RefCell::new(DeclinedDetails::new());
//     pub static POST_JOB: RefCell<JobDetails> = RefCell::new(JobDetails::new());
//     pub static JOB_TYPE: RefCell<Vec<String>> = RefCell::new(vec!["BOUNTY".to_string(),"JOBS".to_string(),"RFP".to_string()]);
//     pub static SPOTLIGHT_PROJECTS: RefCell<SpotlightProjects> = RefCell::new(SpotlightProjects::new());
//     pub static MONEY_ACCESS: RefCell<HashMap<String, Vec<Principal>>> = RefCell::new(HashMap::new());
//     pub static PRIVATE_DOCS_ACCESS: RefCell<HashMap<String, Vec<Principal>>> = RefCell::new(HashMap::new());

//     pub static PROJECT_RATING : RefCell<HashMap<String, Vec<(Principal,ProjectReview)>>> = RefCell::new(HashMap::new());

//     pub static  MONEY_ACCESS_REQUESTS :RefCell<MoneyAccess> = RefCell::new(MoneyAccess::new());

//     pub static PRIVATE_DOCS_ACCESS_REQUESTS :RefCell<PrivateDocsAccess> = RefCell::new(PrivateDocsAccess::new());

// }



pub async fn create_project(info: ProjectInfo) -> String {
    if info.private_docs.is_some() && info.upload_private_documents != Some(true) {
        return "Cannot set private documents unless upload private docs has been set to true"
            .to_string();
    }

    let caller = caller();

    // // Check if the caller has any declined project requests
    // let has_declined_requests = read_state(|state| {
    //     state
    //         .declined_project_details
    //         .contains_key(&StoredPrincipal(caller))
    // });

    // if has_declined_requests {
    //     panic!("You had got your request declined earlier");
    // }

    // Check if the caller has already registered a project or has one awaiting response
    let already_registered = read_state(|state| {
        state.project_storage.contains_key(&StoredPrincipal(caller))
            || state
                .project_awaits_response
                .contains_key(&StoredPrincipal(caller))
    });

    if already_registered {
        ic_cdk::println!("You can't create more than one project");
        return "You can't create more than one project".to_string();
    }

    // mutate_state(|state| {
    //     let role_status = &mut state.role_status;

    //     if let Some(mut role_status_vec_candid) = role_status.get(&StoredPrincipal(caller)) {
    //         let mut role_status_vec = role_status_vec_candid.0;
    //         for role in role_status_vec.iter_mut() {
    //             if role.name == "project" {
    //                 role.status = "requested".to_string();
    //                 role.requested_on = Some(time());
    //                 break;
    //             }
    //         }
    //         role_status.insert(StoredPrincipal(caller), Candid(role_status_vec));
    //     } else {
    //         // If the role_status doesn't exist for the caller, insert the initial roles
    //         let initial_roles = vec![
    //             Role {
    //                 name: "user".to_string(),
    //                 status: "active".to_string(),
    //                 requested_on: None,
    //                 approved_on: Some(time()),
    //                 rejected_on: None,
    //             },
    //             Role {
    //                 name: "project".to_string(),
    //                 status: "default".to_string(),
    //                 requested_on: None,
    //                 approved_on: None,
    //                 rejected_on: None,
    //             },
    //             Role {
    //                 name: "mentor".to_string(),
    //                 status: "default".to_string(),
    //                 requested_on: None,
    //                 approved_on: None,
    //                 rejected_on: None,
    //             },
    //             Role {
    //                 name: "vc".to_string(),
    //                 status: "default".to_string(),
    //                 requested_on: None,
    //                 approved_on: None,
    //                 rejected_on: None,
    //             },
    //         ];
    //         role_status.insert(StoredPrincipal(caller), Candid(initial_roles));
    //     }
    // });

    // crate::latest_popular_projects::update_project_status_live_incubated(new_project).await;

    // let user_data_for_updation = info.clone();
    // crate::user_module::update_data_for_roles(caller, user_data_for_updation.user_data).await;

    //let info_clone = info.clone();
    //let user_uid = crate::user_module::update_user(info_clone.user_data).await;
    match info.validate() {
        Ok(_) => {
            let uuids = raw_rand().await.unwrap().0;
            let uid = format!("{:x}", Sha256::digest(&uuids));
            let new_id = uid.clone().to_string();

            let canister_id = crate::asset_manager::get_asset_canister();
            let mut info_with_default = change_project_images(caller, info.clone()).await;
            // change ids
            // let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
            // let key = "/uploads/".to_owned() + &caller.to_string() + "_user.jpeg";

            // let full_url_logo = canister_id.to_string() + "/uploads/default_project_logo.jpeg";
            // let key_logo = "/uploads/".to_owned() + &caller.to_string() + "_project_logo.jpeg";

            // let full_url_cover = canister_id.to_string() + "/uploads/default_project_cover.jpeg";
            // let key_cover = "/uploads/".to_owned() + &caller.to_string() + "_project_cover.jpeg";

            // fn default_profile_picture(full_url: &str) -> Vec<u8> {
            //     // base64::decode(DEFAULT_USER_AVATAR_BASE64).expect("Failed to decode base64 image")
            //     full_url.as_bytes().to_vec()
            // }

            // let mut info_with_default = info.clone();

            // if info_with_default.user_data.profile_picture.is_none() {
            //     info_with_default.user_data.profile_picture =
            //         Some(default_profile_picture(&full_url));
            // } else {
            //     let arg_logo = StoreArg {
            //         key: key.clone(),
            //         content_type: "image/*".to_string(),
            //         content_encoding: "identity".to_string(),
            //         content: ByteBuf::from(
            //             info_with_default.user_data.profile_picture.clone().unwrap(),
            //         ),
            //         sha256: None,
            //     };
            //     let delete_asset = DeleteAsset { key: key.clone() };
            //     let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            //         .await
            //         .unwrap();
            //     let (result,): ((),) = call(canister_id, "store", (arg_logo,)).await.unwrap();
            //     info_with_default.user_data.profile_picture =
            //         Some((canister_id.to_string() + &key).as_bytes().to_vec());
            // }

            // if info_with_default.project_logo.is_none() {
            //     info_with_default.project_logo = Some(default_profile_picture(&full_url_logo));
            // } else {
            //     let arg_logo = StoreArg {
            //         key: key_logo.clone(),
            //         content_type: "image/*".to_string(),
            //         content_encoding: "identity".to_string(),
            //         content: ByteBuf::from(info_with_default.project_logo.clone().unwrap()),
            //         sha256: None,
            //     };
            //     let delete_asset = DeleteAsset {
            //         key: key_logo.clone(),
            //     };
            //     let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            //         .await
            //         .unwrap();
            //     let (result,): ((),) = call(canister_id, "store", (arg_logo,)).await.unwrap();
            //     info_with_default.project_logo =
            //         Some((canister_id.to_string() + &key_logo).as_bytes().to_vec());
            // }

            // if info_with_default.project_cover.is_none() {
            //     info_with_default.project_cover = Some(default_profile_picture(&full_url_cover));
            // } else {
            //     let arg_cover = StoreArg {
            //         key: key_cover.clone(),
            //         content_type: "image/*".to_string(),
            //         content_encoding: "identity".to_string(),
            //         content: ByteBuf::from(info_with_default.project_cover.clone().unwrap()),
            //         sha256: None,
            //     };
            //     let delete_asset = DeleteAsset {
            //         key: key_cover.clone(),
            //     };
            //     let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            //         .await
            //         .unwrap();
            //     let (result,): ((),) = call(canister_id, "store", (arg_cover,)).await.unwrap();
            //     info_with_default.project_cover =
            //         Some((canister_id.to_string() + &key_cover).as_bytes().to_vec());
            // }

            let new_project = ProjectInfoInternal {
                params: info_with_default,
                uid: new_id,
                is_active: true,
                is_verified: false,
                creation_date: time(),
            };

            mutate_state(|state| {
                state
                    .project_storage
                    .insert(StoredPrincipal(caller), Candid(vec![new_project.clone()]));
               
                let role_status = &mut state.role_status;
                if let Some(mut role_status_vec_candid) =
                    role_status.get(&StoredPrincipal(caller))
                {
                    let mut role_status_vec = role_status_vec_candid.0;
                    for role in role_status_vec.iter_mut() {
                        if role.name == "project" {
                            role.status = "approved".to_string();
                            break;
                        }
                    }
                    role_status.insert(StoredPrincipal(caller), Candid(role_status_vec));
                }
            });

            // let res = send_approval_request(
            //     info.user_data.profile_picture.unwrap_or_else(|| Vec::new()),
            //     info.user_data.full_name,
            //     info.user_data.country,
            //     info.project_area_of_focus,
            //     "project".to_string(),
            //     info.user_data.bio.unwrap_or("no bio".to_string()),
            // )
            // .await;

            format!("Project created Succesfully with UID {}", new_project.uid)
        }
        Err(e) => format!("Validation error: {}", e),
    }
}

#[query(guard = "is_user_anonymous")]
pub fn get_project_info_using_principal(caller: Principal) -> Option<ProjectInfoInternal> {
    read_state(|state| {
        state
            .project_storage
            .get(&StoredPrincipal(caller))
            .and_then(|projects| projects.0.first().cloned())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_project_awaiting_info_using_principal(caller: Principal) -> Option<ProjectInfoInternal> {
    read_state(|state| {
        state
            .project_awaits_response
            .get(&StoredPrincipal(caller))
            .map(|project| project.0.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_project_declined_info_using_principal(caller: Principal) -> Option<ProjectInfoInternal> {
    read_state(|state| {
        state
            .project_declined_request
            .get(&StoredPrincipal(caller))
            .map(|project| project.0.clone())
    })
}

// all created projects but without ProjectInternal
pub fn get_projects_for_caller() -> Vec<ProjectInfo> {
    let caller = ic_cdk::caller();
    read_state(|state| {
        if let Some(founder_projects) = state.project_storage.get(&StoredPrincipal(caller)) {
            founder_projects
                .0
                .iter()
                .map(|project_internal| project_internal.params.clone())
                .collect()
        } else {
            Vec::new()
        }
    })
}

//get_my_project; firstly created project || all_pub_plus_private_info
#[query(guard = "is_user_anonymous")]
pub fn get_my_project() -> ProjectInfoInternal {
    let caller = ic_cdk::caller();
    read_state(|state| {
        state
            .project_storage
            .get(&StoredPrincipal(caller))
            .and_then(|projects| projects.0.first().cloned())
            .expect("Couldn't get a project")
    })
}

// all created projects
#[query(guard = "is_user_anonymous")]
pub fn get_projects_with_all_info() -> Vec<ProjectInfoInternal> {
    let caller = ic_cdk::caller();
    read_state(|state| {
        state
            .project_storage
            .get(&StoredPrincipal(caller))
            .map(|projects| projects.0.clone())
            .unwrap_or_default()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_project_id() -> String {
    let caller = ic_cdk::caller();
    read_state(|state| {
        state
            .project_storage
            .get(&StoredPrincipal(caller))
            .and_then(|projects| projects.0.first().map(|project| project.uid.clone()))
            .expect("Couldn't get project information")
    })
}

//this should only be for admin
pub fn find_project_by_id(project_id: &str) -> Option<ProjectInfoInternal> {
    read_state(|state| {
        for (_, projects) in state.project_storage.iter() {
            if let Some(project) = projects.0.iter().find(|p| p.uid == project_id) {
                return Some(project.clone());
            }
        }
        None
    })
}

//newbie api shows restricted info!
#[query(guard = "is_user_anonymous")]
pub fn get_project_details_for_mentor_and_investor(
    project_id: String,
) -> ProjectPublicInfoInternal {
    let project_details = find_project_by_id(project_id.as_str()).expect("project not found");
    let project_id = project_id.to_string().clone();

    let project = ProjectPublicInfo {
        project_id,
        project_name: project_details.params.project_name,
        project_logo: project_details.params.project_logo,
        preferred_icp_hub: project_details.params.preferred_icp_hub,
        live_on_icp_mainnet: project_details.params.live_on_icp_mainnet,
        money_raised_till_now: project_details.params.money_raised_till_now,
        supports_multichain: project_details.params.supports_multichain,
        project_elevator_pitch: project_details.params.project_elevator_pitch,
        project_area_of_focus: project_details.params.project_area_of_focus,
        promotional_video: project_details.params.promotional_video,
        github_link: project_details.params.github_link,
        reason_to_join_incubator: project_details.params.reason_to_join_incubator,
        project_description: project_details.params.project_description,
        project_cover: project_details.params.project_cover,
        project_team: project_details.params.project_team,
        token_economics: project_details.params.token_economics,
        technical_docs: project_details.params.technical_docs,
        long_term_goals: project_details.params.long_term_goals,
        target_market: project_details.params.target_market,
        self_rating_of_project: project_details.params.self_rating_of_project,
        user_data: project_details.params.user_data,
        mentors_assigned: project_details.params.mentors_assigned,
        vc_assigned: project_details.params.vc_assigned,
        project_twitter: project_details.params.project_twitter,
        project_linkedin: project_details.params.project_linkedin,
        project_website: project_details.params.project_website,
        project_discord: project_details.params.project_discord,
        upload_private_documents: project_details.params.upload_private_documents,
        public_docs: project_details.params.public_docs,
        dapp_link: project_details.params.dapp_link,
    };

    let project_internal = ProjectPublicInfoInternal {
        params: project,
        uid: project_details.uid,
        is_active: project_details.is_active,
        is_verified: project_details.is_verified,
        creation_date: project_details.creation_date,
    };

    project_internal
}

#[query(guard = "is_user_anonymous")]
pub fn get_project_public_information_using_id(project_id: String) -> ProjectPublicInfoInternal {
    let project_details = find_project_by_id(project_id.as_str()).expect("project not found");
    let project_id = project_id.to_string().clone();

    let project = ProjectPublicInfo {
        project_id,
        project_name: project_details.params.project_name,
        project_logo: project_details.params.project_logo,
        preferred_icp_hub: project_details.params.preferred_icp_hub,
        live_on_icp_mainnet: project_details.params.live_on_icp_mainnet,
        money_raised_till_now: project_details.params.money_raised_till_now,
        supports_multichain: project_details.params.supports_multichain,
        project_elevator_pitch: project_details.params.project_elevator_pitch,
        project_area_of_focus: project_details.params.project_area_of_focus,
        promotional_video: project_details.params.promotional_video,
        github_link: project_details.params.github_link,
        reason_to_join_incubator: project_details.params.reason_to_join_incubator,
        project_description: project_details.params.project_description,
        project_cover: project_details.params.project_cover,
        project_team: project_details.params.project_team,
        token_economics: project_details.params.token_economics,
        technical_docs: project_details.params.technical_docs,
        long_term_goals: project_details.params.long_term_goals,
        target_market: project_details.params.target_market,
        self_rating_of_project: project_details.params.self_rating_of_project,
        user_data: project_details.params.user_data,
        mentors_assigned: project_details.params.mentors_assigned,
        vc_assigned: project_details.params.vc_assigned,
        project_twitter: project_details.params.project_twitter,
        project_linkedin: project_details.params.project_linkedin,
        project_website: project_details.params.project_website,
        project_discord: project_details.params.project_discord,
        upload_private_documents: project_details.params.upload_private_documents,
        public_docs: project_details.params.public_docs,
        dapp_link: project_details.params.dapp_link,
    };

    let project_internal = ProjectPublicInfoInternal {
        params: project,
        uid: project_details.uid,
        is_active: project_details.is_active,
        is_verified: project_details.is_verified,
        creation_date: project_details.creation_date,
    };

    project_internal
}

#[derive(CandidType, Clone)]
pub struct PaginationReturnProjectDataList {
    pub data: HashMap<Principal, ProjectVecWithRoles>,
    pub count: u64,
}

#[query(guard = "is_admin")]
pub fn list_all_projects_for_admin(
    pagination_params: PaginationParams,
) -> PaginationReturnProjectDataList {
    let project_count = read_state(|state| state.project_storage.len());

    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let end = std::cmp::min(start + pagination_params.page_size, project_count.try_into().unwrap());

    let projects_snapshot = read_state(|state| {
        state.project_storage.iter()
            .skip(start)
            .take(end - start)
            .map(|(stored_principal, project_info)| {
                let principal = stored_principal.0; 
                let roles = get_roles_for_principal(principal); 
                let project_with_roles = ProjectVecWithRoles {
                    project_profile: project_info.0.clone(),
                    roles,
                };
                (principal, project_with_roles)
            })
            .collect::<Vec<_>>()
    });

    let paginated_map: HashMap<Principal, ProjectVecWithRoles> = projects_snapshot
        .into_iter()
        .collect();

    PaginationReturnProjectDataList {
        data: paginated_map,
        count: project_count,
    }
}


#[derive(CandidType, Clone)]
pub struct ListAllProjects {
    principal: StoredPrincipal,
    params: ProjectInfoInternal,
    overall_average: Option<f64>,
}

// #[query(guard = "is_user_anonymous")]
// pub fn list_all_projects() -> Vec<ListAllProjects> {
//     APPLICATION_FORM.with(|projects: &RefCell<ApplicationDetails>| {
//         let projects = projects.borrow();

//         let mut list_all_projects: Vec<ListAllProjects> = vec![];

//         for (principal, projects) in projects.iter() {
//             for project in projects {
//                 let get_rating = calculate_average_api(&project.uid);

//                 let project_info = ListAllProjects {
//                     principal: principal.clone(),
//                     params: project.clone(),
//                     overall_average: get_rating.overall_average,
//                 };

//                 list_all_projects.push(project_info)
//             }
//         }
//         list_all_projects
//     })
// }
#[query(guard = "is_user_anonymous")]
pub fn list_all_projects() -> Vec<ListAllProjects> {
    let projects_snapshot = read_state(|state| {
        state.project_storage.iter().map(|(principal, project_infos)| {
            (principal.clone(), project_infos.0.clone())  // Clone the data to use outside the state borrow
        }).collect::<Vec<_>>()
    });

    let mut list_all_projects: Vec<ListAllProjects> = Vec::new();

    // Process the projects outside of the state borrow
    for (stored_principal, project_infos) in projects_snapshot {
        for project_info in project_infos {
            if project_info.is_active {
                // Here, replace calculate_average_api with the actual function or logic you use to fetch the average
                let get_rating = calculate_average_api(&project_info.uid);  // Assume this function doesn't mutate the global state.

                let project_struct = ListAllProjects {
                    principal: stored_principal,
                    params: project_info,
                    overall_average: get_rating.overall_average.get(0).cloned(),
                };
                list_all_projects.push(project_struct);
            }
        }
    }

    list_all_projects
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationParams {
    pub page: usize,
    pub page_size: usize,
}

#[derive(CandidType, Clone)]
pub struct PaginationReturnProjectData {
    pub data: Vec<ListAllProjects>,
    pub count: u64,
}

#[query(guard = "is_user_anonymous")]
pub fn list_all_projects_with_pagination(
    pagination_params: PaginationParams,
) -> PaginationReturnProjectData {
    let project_count = read_state(|state| state.project_storage.len());

    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let end = std::cmp::min(start + pagination_params.page_size, project_count.try_into().unwrap());

    let projects_snapshot = read_state(|state| {
        state.project_storage.iter()
            .skip(start)
            .take(end - start)
            .map(|(principal, project_infos)| (principal.clone(), project_infos.0.clone()))
            .collect::<Vec<_>>()
    });

    let mut list_all_projects: Vec<ListAllProjects> = Vec::new();

    for (stored_principal, project_infos) in projects_snapshot {
        for project_info in project_infos {
            if project_info.is_active {
                let get_rating = calculate_average_api(&project_info.uid); 
                let project_info_struct = ListAllProjects {
                    principal: stored_principal,
                    params: project_info,
                    overall_average: get_rating.overall_average.get(0).cloned(),
                };
                list_all_projects.push(project_info_struct);
            }
        }
    }

    PaginationReturnProjectData {
        data: list_all_projects,
        count: project_count,
    }
}

#[query]
pub fn get_top_three_projects() -> Vec<ListAllProjects> {
    let projects_snapshot = read_state(|state| {
        // Clone the necessary parts of the state to reduce the duration of the borrow.
        state.project_storage.iter().map(|(principal, project_infos)| {
            (principal.clone(), project_infos.0.clone())
        }).collect::<Vec<_>>()
    });

    let mut list_all_projects: Vec<ListAllProjects> = Vec::new();

    for (stored_principal, project_infos) in projects_snapshot {
        for project_info in project_infos {
            if project_info.is_active {
                let get_rating = calculate_average_api(&project_info.uid);  // Assumes this function might mutate global state.
                let project_info_struct = ListAllProjects {
                    principal: stored_principal,
                    params: project_info,
                    overall_average: get_rating.overall_average.get(0).cloned(),
                };
                list_all_projects.push(project_info_struct);
            }
        }
    }

    // Sort the projects by the overall average rating in descending order
    list_all_projects.sort_by(|a, b| b.overall_average.partial_cmp(&a.overall_average).unwrap_or(std::cmp::Ordering::Equal));

    // Return only the top 3 projects
    list_all_projects.into_iter().take(3).collect()
}

pub async fn change_project_images(
    caller: Principal,
    mut updated_project: ProjectInfo,
) -> ProjectInfo {
    let temp_image = updated_project.user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();
    let project_logo = updated_project.project_logo.clone();
    let project_cover = updated_project.project_cover.clone();

    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        updated_project.user_data.profile_picture = Some((full_url).as_bytes().to_vec());
    } else if temp_image.clone().unwrap().len() < 300 {
        ic_cdk::println!("Profile image is already uploaded");
    } else {
        let key = "/uploads/".to_owned() + &caller.to_string() + "_user.jpeg";

        let arg = StoreArg {
            key: key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(temp_image.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset { key: key.clone() };

        let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (result,): ((),) = call(canister_id, "store", (arg,)).await.unwrap();

        updated_project.user_data.profile_picture =
            Some((canister_id.to_string() + &key).as_bytes().to_vec());
    }

    if project_logo.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_project_logo.jpeg";
        updated_project.project_logo = Some((full_url).as_bytes().to_vec());
    } else if project_logo.clone().unwrap().len() < 300 {
        ic_cdk::println!("Project logo is already uploaded");
    } else {
        let project_logo_key = "/uploads/".to_owned() + &caller.to_string() + "_project_logo.jpeg";

        let project_logo_arg = StoreArg {
            key: project_logo_key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(project_logo.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset {
            key: project_logo_key.clone(),
        };

        let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (result,): ((),) = call(canister_id, "store", (project_logo_arg,))
            .await
            .unwrap();

        updated_project.project_logo = Some(
            (canister_id.to_string() + &project_logo_key)
                .as_bytes()
                .to_vec(),
        );
    }

    if project_cover.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_project_cover.jpeg";
        updated_project.project_cover = Some((full_url).as_bytes().to_vec());
    } else if project_cover.clone().unwrap().len() < 300 {
        ic_cdk::println!("Project logo is already uploaded");
    } else {
        let project_cover_key =
            "/uploads/".to_owned() + &caller.to_string() + "_project_cover.jpeg";

        let project_cover_arg = StoreArg {
            key: project_cover_key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(project_cover.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset {
            key: project_cover_key.clone(),
        };

        let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (result,): ((),) = call(canister_id, "store", (project_cover_arg,))
            .await
            .unwrap();

        updated_project.project_cover = Some(
            (canister_id.to_string() + &project_cover_key)
                .as_bytes()
                .to_vec(),
        );
    }

    updated_project
}

pub async fn update_project(project_id: String, mut updated_project: ProjectInfo) -> String {
    let caller = ic_cdk::caller();

    let is_owner = read_state(|state| {
        state
            .project_storage
            .iter()
            .any(|(stored_principal, project_infos)| {
                stored_principal.0 == caller && project_infos.0.iter().any(|p| p.uid == project_id)
            })
    });

    if !is_owner {
        return "Error: Only the project owner can request updates.".to_string();
    }

    let exists = read_state(|state| {
        state
            .project_declined_request
            .contains_key(&StoredPrincipal(caller))
    });

    if exists {
        panic!("Your update request was previously declined.");
    }

    if !is_owner {
        return "Error: Only the project owner can request updates.".to_string();
    }

    let original_info = read_state(|state| state.project_storage.get(&StoredPrincipal(caller)));

    let mut approved_timestamp = 0;
    let mut rejected_timestamp = 0;

    mutate_state(|state| {
        if let Some(mut role_status) = state.role_status.get(&StoredPrincipal(caller)) {
            if let Some(role) = role_status.0.iter_mut().find(|r| r.name == "project") {
                if role.status == "approved" {
                    approved_timestamp = time();
                    role.approved_on = Some(approved_timestamp);
                } else if role.status == "rejected" {
                    rejected_timestamp = time();
                    role.rejected_on = Some(rejected_timestamp);
                }
            }
        }
    });

    updated_project = change_project_images(caller, updated_project.clone()).await;

    match original_info {
        Some(orig_infos) => {
            if let Some(orig_info) = orig_infos.0.iter().find(|p| p.uid == project_id) {
                mutate_state(|state| {
                    state.pending_project_details.insert(
                        orig_info.uid.clone(),
                        Candid(ProjectUpdateRequest {
                            project_id: project_id.clone(),
                            original_info: orig_info.params.clone(),
                            updated_info: updated_project.clone(),
                            principal: caller,
                            accepted_at: approved_timestamp,
                            rejected_at: rejected_timestamp,

                            sent_at: time(),
                        }),
                    );
                });
            }
        }
        None => return "No original project info found.".to_string(),
    }

    let res = send_approval_request(
        updated_project
            .user_data
            .profile_picture
            .unwrap_or_else(Vec::new),
        updated_project.user_data.full_name,
        updated_project.user_data.country,
        updated_project.project_area_of_focus,
        "project".to_string(),
        updated_project.user_data.bio.unwrap_or_default(),
    )
    .await;

    format!("{}", res)
}

pub fn delete_project(id: String) -> std::string::String {
    let caller = ic_cdk::caller();

    let mut is_found = false;

    mutate_state(|state| {
        if let Some(mut projects) = state.project_storage.get(&StoredPrincipal(caller)) {
            for project in projects.0.iter_mut() {
                if project.uid == id {
                    project.is_active = false;
                    is_found = true;
                    break;
                }
            }
        }
    });

    if is_found {
        "Project Status Set To Inactive".to_string()
    } else {
        "Please Provide a Valid Project Id".to_string()
    }
}

// pub fn verify_project(project_id: &str) -> String {
//     let verifier_info = hub_organizer::get_hub_organizer();

//     match verifier_info {
//         Some(info) => {
//             let mut project_found = false;

//             APPLICATION_FORM.with(|projects| {
//                 let mut projects = projects.borrow_mut();
//                 for project_internal in projects.values_mut().flat_map(|v| v.iter_mut()) {
//                     if project_internal.uid == project_id {
//                         project_internal.is_verified = true;
//                         project_found = true;
//                         break;
//                     }
//                 }
//             });

//             if project_found {
//                 NOTIFICATIONS.with(|notifications| {
//                     let mut notifications = notifications.borrow_mut();
//                     if let Some(notification) = notifications
//                         .values_mut()
//                         .flat_map(|n| n.iter_mut())
//                         .find(|n| n.project_id == project_id)
//                     {
//                         notification.notification_verifier = NotificationVerifier {
//                             name: info
//                                 .hubs
//                                 .full_name
//                                 .clone()
//                                 .unwrap_or_else(|| "Default Name".to_string()),
//                             image: info.hubs.profile_picture.clone().unwrap_or_else(|| vec![]),
//                         };
//                     }
//                 });
//             }

//             "Project verified successfully.".to_string()
//         }
//         None => "Verifier information could not be retrieved.".to_string(),
//     }
// }

pub fn get_notifications_for_caller() -> Vec<NotificationProject> {
    let caller_principal = ic_cdk::caller();

    read_state(|state| {
        state
            .notifications
            .get(&StoredPrincipal(caller_principal))
            .map_or_else(Vec::new, |notifications| notifications.0.clone())
    })
}

fn find_project_owner_principal(project_id: &str) -> Option<Principal> {
    read_state(|state| {
        for (stored_principal, projects) in state.project_storage.iter() {
            if projects.0.iter().any(|p| p.uid == project_id) {
                return Some(stored_principal.0);
            }
        }
        None
    })
}

pub fn get_notifications_for_owner() -> Vec<NotificationForOwner> {
    let owner_principal = ic_cdk::caller();

    read_state(|state| {
        state
            .owner_notification
            .get(&StoredPrincipal(owner_principal))
            .map_or_else(Vec::new, |notifications| notifications.0.clone())
    })
}

pub async fn update_team_member(project_id: &str, member_principal_id: Principal) -> String {
    let member_uid = read_state(|state| {
        match state
            .user_storage
            .get(&StoredPrincipal(member_principal_id))
        {
            Some(user_internal) => user_internal.0.uid.clone(),
            None => panic!("You are not a user"),
        }
    });

    let user_info_result = crate::user_module::get_user_info_by_id(member_uid.clone()).await;

    let user_info = match user_info_result {
        Ok(info) => info,
        Err(err) => return format!("Failed to retrieve user info: {}", err),
    };

    let (project_found, member_added_or_updated) = mutate_state(|storage| {
        let mut project_found = false;
        let mut member_added_or_updated = false;
        let mut updated_project_info_list = None;

        // Iterate over the storage map to find the project
        for (project_owner, project_info_list) in storage.project_storage.iter() {
            for project_internal in project_info_list.0.iter() {
                if project_internal.uid == project_id {
                    project_found = true;

                    // Clone the project_info_list to modify it
                    let mut project_info_list_clone = project_info_list.clone();

                    // Find the project within the cloned list
                    for project_internal in project_info_list_clone.0.iter_mut() {
                        if project_internal.uid == project_id {
                            // Check if the project already has a team member list
                            if let Some(team) = &mut project_internal.params.project_team {
                                // Look for an existing team member with the same UID
                                if let Some(member) = team.iter_mut().find(|m| m.member_uid == member_uid) {
                                    // If the member exists, update their info
                                    member.member_data = user_info.clone();
                                    member_added_or_updated = true;
                                } else {
                                    // If the member doesn't exist, add them to the list
                                    let new_team_member = TeamMember {
                                        member_uid: member_uid.clone(),
                                        member_data: user_info.clone(),
                                    };
                                    team.push(new_team_member);
                                    member_added_or_updated = true;
                                }
                            } else {
                                // If the project does not have any team members yet, create a new list
                                let new_team_member = TeamMember {
                                    member_uid: member_uid.clone(),
                                    member_data: user_info.clone(),
                                };
                                project_internal.params.project_team = Some(vec![new_team_member]);
                                member_added_or_updated = true;
                            }
                        }
                    }

                    // Store the modified project_info_list to update the storage after the loop
                    updated_project_info_list = Some((project_owner.clone(), project_info_list_clone));
                    break;
                }
            }
        }

        // Update the storage outside the loop
        if let Some((project_owner, project_info_list_clone)) = updated_project_info_list {
            storage.project_storage.insert(project_owner, project_info_list_clone);
        }

        (project_found, member_added_or_updated)
    });

    match (project_found, member_added_or_updated) {
        (true, true) => "Team member updated successfully.".to_string(),
        (true, false) => "Failed to update the team member in the specified project.".to_string(),
        _ => "Project not found.".to_string(),
    }
}

#[update(guard = "is_user_anonymous")]
pub fn add_announcement(announcement_details: Announcements) -> String {
    let caller_id = caller();
    let current_time = time();

    ic_cdk::println!("Caller ID: {:?}", caller_id);
    ic_cdk::println!("Current Time: {}", current_time);

    let project_info_internal = match find_project_by_id(&announcement_details.project_id) {
        Some(info) => {
            ic_cdk::println!("Project info fetched successfully: {:?}", info);
            info
        }
        None => {
            ic_cdk::println!(
                "Failed to fetch project info for project ID: {}",
                &announcement_details.project_id
            );
            return "Project ID does not exist in application forms.".to_string();
        }
    };

    let new_announcement = AnnouncementsInternal {
        announcement_data: announcement_details,
        timestamp: current_time,
        project_name: project_info_internal.params.project_name.clone(),
        project_desc: project_info_internal.params.project_description.clone(),
        project_logo: project_info_internal.params.project_logo.clone(),
    };

    ic_cdk::println!("New Announcement Details: {:?}", new_announcement);

    let result = mutate_state(|state| {
        let announcement_storage = &mut state.project_announcement;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(caller_id)) {
            ic_cdk::println!("Existing announcement entry found.");
            ic_cdk::println!("State before addition: {:?}", caller_announcements.0);
            let mut caller_announcements = caller_announcements.clone(); // Clone to mutate
            caller_announcements.0.push(new_announcement);
            ic_cdk::println!("State after addition: {:?}", caller_announcements.0);
            announcement_storage.insert(StoredPrincipal(caller_id), caller_announcements);
            format!("Announcement added successfully at {}", current_time)
        } else {
            ic_cdk::println!("No announcement entry found for this caller.");
            ic_cdk::println!("State before addition: None"); 
            announcement_storage.insert(StoredPrincipal(caller_id), Candid(vec![new_announcement]));
            
            format!("Announcement added successfully at {}", current_time)
        }
    });

    result
}

//for testing purpose
#[query(guard = "is_user_anonymous")]
pub fn get_announcements() -> HashMap<Principal, Vec<AnnouncementsInternal>> {
    read_state(|state| {
        let mut hashmap = HashMap::new();
        for (stored_principal, announcements) in state.project_announcement.iter() {
            let principal = stored_principal.0.clone();
            hashmap.insert(principal, announcements.0.clone());
        }
        hashmap
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_latest_announcements() -> HashMap<Principal, Vec<AnnouncementsInternal>> {
    read_state(|state| {
        let mut hashmap = HashMap::new();
        for (stored_principal, announcement_internals) in state.project_announcement.iter() {
            let principal = stored_principal.0.clone();
            let mut sorted_announcements = announcement_internals.0.clone();
            sorted_announcements.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
            hashmap.insert(principal, sorted_announcements);
        }
        hashmap
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_announcements_by_project_id(project_id: String) -> Vec<AnnouncementsInternal> {
    read_state(|state| {
        state
            .project_announcement
            .iter()
            .flat_map(|(_, announcements)| {
                announcements
                    .0
                    .clone() // Clone the entire Vec<AnnouncementsInternal>
                    .into_iter()
                    .filter(|announcement| announcement.announcement_data.project_id == project_id)
            })
            .collect() // Collect the filtered announcements into a vector
    })
}
#[update(guard = "is_user_anonymous")]
pub async fn update_project_announcement_by_id(
    timestamp: u64,
    new_details: Announcements,
) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.project_announcement;
        if let Some(mut caller_announcements) = announcement_storage.get(&StoredPrincipal(caller()))
        {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("state before update {:?}", caller_announcements.0);
            for announcement in caller_announcements.0.iter_mut() {
                if announcement.timestamp == timestamp {
                    ic_cdk::println!("announcement before update: {:?}", announcement);
                    // Update announcement details
                    announcement.announcement_data = new_details;
                    ic_cdk::println!("State after update: {:?}", announcement);
                    announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);

                    return format!("Announcement updated successfully for {}", timestamp);
                }
            }

            format!("No announcement found with timestamp {}", timestamp)
        } else {
            ic_cdk::println!("No announcement entry found for this caller.");
            format!("No announcement entry found for this caller.")
        }
    })
}
#[query(guard = "is_user_anonymous")]
pub async fn delete_project_announcement_by_id(timestamp: u64) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.project_announcement;
        if let Some(mut caller_announcements) = announcement_storage.get(&StoredPrincipal(caller()))
        {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("state before update {:?}", caller_announcements.0);

            let original_len = caller_announcements.0.len();
            caller_announcements
                .0
                .retain(|announcement| announcement.timestamp != timestamp);

            if caller_announcements.0.len() < original_len {
                announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);
                ic_cdk::println!("Announcement deleted successfully for {}", timestamp);
                format!("Announcement deleted successfully for {}", timestamp)
            } else {
                ic_cdk::println!("No announcement found with timestamp {}", timestamp);
                format!("No announcement found with timestamp {}", timestamp)
            }
        } else {
            ic_cdk::println!("No announcement entry found for this caller.");
            format!("No announcement entry found for this caller.")
        }
    })
}

#[update(guard = "is_user_anonymous")]
pub fn add_BlogPost(url: String) -> String {
    let caller_id = caller();
    let current_time = time();

    mutate_state(|state| {
        // Ensure the caller's blog post vector exists
        let mut blog_posts = state
            .blog_post
            .get(&StoredPrincipal(caller_id))
            .unwrap_or_else(|| {
                state
                    .blog_post
                    .insert(StoredPrincipal(caller_id.clone()), Candid(Vec::new()));
                state.blog_post.get(&StoredPrincipal(caller_id)).unwrap()
            });

        // Add the new blog post
        let new_blog = Blog {
            blog_url: url,
            timestamp: current_time,
        };
        blog_posts.0.push(new_blog);

        format!("Blog Post added successfully at {}", current_time)
    })
}

//for testing purpose
#[query(guard = "is_user_anonymous")]
pub fn get_blog_post() -> HashMap<Principal, Vec<Blog>> {
    read_state(|state| {
        state
            .blog_post
            .iter()
            .map(|(principal, candid_vec)| (principal.0, candid_vec.0.clone()))
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn filter_projects(criteria: FilterCriteria) -> Vec<ProjectInfo> {
    read_state(|projects| {
        projects
            .project_storage
            .iter()
            .flat_map(|(_, project_list)| project_list.0.clone().into_iter())
            .filter(|project_internal| {
                let country_match = criteria
                    .country
                    .as_ref()
                    .map_or(true, |c| &project_internal.params.user_data.country == c);

                let rating_match = criteria.rating_range.map_or(true, |(min, max)| {
                    project_internal.params.self_rating_of_project >= min
                        && project_internal.params.self_rating_of_project <= max
                });

                let focus_match = criteria.area_of_focus.as_ref().map_or(true, |focus| {
                    &project_internal.params.project_area_of_focus == focus
                });

                // let mentor_match = criteria.mentor_name.as_ref().map_or(true, |mentor_name| {
                //     project_internal
                //         .params
                //         .mentors_assigned
                //         .as_ref()
                //         .map_or(false, |mentors| {
                //             mentors
                //                 .iter()
                //                 .any(|mentor| mentor.user_data.full_name.contains(mentor_name))
                //         })
                // });

                let vc_match = criteria.vc_name.as_ref().map_or(true, |vc_name| {
                    project_internal
                        .params
                        .vc_assigned
                        .as_ref()
                        .map_or(false, |vcs| {
                            vcs.iter().any(|vc| vc.name_of_fund.contains(vc_name))
                        })
                });

                country_match && rating_match && focus_match && vc_match
            })
            .map(|project_internal| project_internal.params.clone())
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_project_info_for_user(project_id: String) -> Option<ProjectInfoForUserInternal> {
    let announcements_project = get_announcements();
    let jobs_opportunity_posted = get_jobs_posted_by_project(project_id.clone());

    let community_ratings = crate::ratings::calculate_average_api(&project_id);

    read_state(|storage| {
        let projects = storage.project_storage.iter();

        projects
            .flat_map(|(_, project_list)| project_list.0.clone().into_iter())
            .find(|project_internal| project_internal.uid == project_id)
            .map(|project_internal| ProjectInfoForUserInternal {
                params: ProjectInfoForUser {
                    project_name: Some(project_internal.params.project_name.clone()),
                    project_logo: project_internal.params.project_logo.clone(),
                    project_description: project_internal.params.project_description.clone(),
                    community_rating: Some(community_ratings),
                    project_cover: project_internal.params.project_cover.clone(),
                    project_twitter: project_internal.params.project_twitter.clone(),
                    project_linkedin: project_internal.params.project_linkedin.clone(),
                    project_website: project_internal.params.project_website.clone(),
                    project_discord: project_internal.params.project_discord.clone(),
                    promotional_video: project_internal.params.promotional_video.clone(),
                    github_link: project_internal.params.github_link.clone(),
                    //user_data: project_internal.params.user_data.clone(),
                    project_team: project_internal.params.project_team.clone(),
                    dapp_link: project_internal.params.dapp_link.clone(),
                    weekly_active_users: project_internal.params.weekly_active_users.clone(),
                    date_of_joining: Some(project_internal.creation_date),
                    mentor_associated: project_internal.params.mentors_assigned.clone(),
                    vc_associated: project_internal.params.vc_assigned.clone(),
                    team_member_info: project_internal.params.project_team.clone(),
                    announcements: announcements_project,
                    website_social_group: project_internal.params.project_discord.clone(),
                    live_link_of_project: project_internal.params.dapp_link.clone(),
                    jobs_opportunity: Some(jobs_opportunity_posted),
                    area_of_focus: Some(project_internal.params.project_area_of_focus.clone()),
                    country_of_project: project_internal.params.preferred_icp_hub.clone(),
                },
            })
    })
}

#[update(guard = "is_user_anonymous")]
pub fn make_project_active_inactive(p_id: Principal, project_id: String) -> String {
    let principal_id = caller();
    if p_id == principal_id || ic_cdk::api::is_controller(&principal_id) {
        mutate_state(|storage| {
            // First, try to get the vector of ProjectDetail associated with p_id
            if let Some(mut projects) = storage.project_storage.get(&StoredPrincipal(p_id)) {
                // Find the project with the matching project_id
                if let Some(project) = projects.0.iter_mut().find(|p| p.uid == project_id) {
                    // Toggle the is_active flag and return a message accordingly
                    project.is_active = !project.is_active;
                    if project.is_active {
                        "Project made active".to_string()
                    } else {
                        "Project made inactive".to_string()
                    }
                } else {
                    // Project with the given id not found in the vector
                    "Project not found".to_string()
                }
            } else {
                // p_id not found in the storage
                "Profile not found".to_string()
            }
        })
    } else {
        "You are not authorized to use this function".to_string()
    }
}

// pub fn get_dummy_team_member() -> TeamMember {
//     TeamMember {
//         member_uid: "TM123456".to_string(),
//         member_data: get_dummy_user_information(),
//     }
// }

// fn get_dummy_user_information() -> UserInformation {
//     UserInformation {
//         full_name: "Jane Doe".to_string(),
//         profile_picture: Some(vec![0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), // Example binary data for an image
//         email: Some("janedoe@example.com".to_string()),
//         country: "Nowhereland".to_string(),
//         telegram_id: Some("janedoe_telegram".to_string()),
//         bio: Some("An enthusiastic explorer of new technologies.".to_string()),
//         area_of_interest: "Artificial Intelligence".to_string(),
//         twitter_id: Some("@janedoeAI".to_string()),
//         openchat_username: Some("janedoeChat".to_string()),
//         // joining_date: 0,
//     }
// }

// pub fn get_dummy_mentor_profile() -> MentorProfile {
//     MentorProfile {
//         preferred_icp_hub: Some("Example Hub".to_string()),
//         user_data: get_dummy_user_information(), // This function should be defined as previously shown
//         existing_icp_mentor: true,
//         existing_icp_project_porfolio: Some("Example Portfolio".to_string()),
//         icop_hub_or_spoke: false,
//         category_of_mentoring_service: "Technology and Innovation".to_string(),
//         linkedin_link: "https://example-social-link.com".to_string(),
//         multichain: Some("Example Multichain".to_string()),
//         years_of_mentoring: "5 years".to_string(),
//         website: "https://example-mentor-website.com".to_string(),
//         area_of_expertise: "Blockchain Technology".to_string(),
//         reason_for_joining: "To share knowledge and experiences with budding entrepreneurs"
//             .to_string(),
//         hub_owner: Some("icp india".to_string()),
//     }
// }

// pub fn get_dummy_venture_capitalist() -> VentureCapitalist {
//     VentureCapitalist {
//         name_of_fund: "Example VC Fund".to_string(),
//         fund_size: 100_000_000.0, // Example fund size in USD
//         assets_under_management: "500_000_000 USD".to_string(),
//         logo: Some(vec![0, 1, 2, 3, 4, 5]), // Simulated binary data for a logo
//         registered_under_any_hub: Some(true),
//         average_check_size: 1_000_000.0, // Example check size in USD
//         existing_icp_investor: true,
//         money_invested: Some(50_000_000.0), // Example money invested in USD
//         existing_icp_portfolio: Some("Example Portfolio".to_string()),
//         type_of_investment: "Equity".to_string(),
//         project_on_multichain: Some("Yes".to_string()),
//         category_of_investment: "Technology".to_string(),
//         reason_for_joining: "To find promising startups".to_string(),
//         preferred_icp_hub: "Example Hub".to_string(),
//         investor_type: "Angel Investor".to_string(),
//         number_of_portfolio_companies: 10,
//         portfolio_link: "https://example-portfolio-link.com".to_string(),
//         announcement_details: Some("New funding round opened".to_string()),
//         user_data: get_dummy_user_information(),
//         website_link: "hfdfdfdf".to_string(),
//         linkedin_link: "dfdfdfdf".to_string(),
//         registered_country: Some("india".to_string()),
//         registered: true, // Generate dummy user information
//     }
// }

// pub fn get_dummy_announcements() -> Announcements {
//     Announcements {
//         project_name: "Project X".to_string(),
//         announcement_message: "We are thrilled to announce the launch of Project X, set to revolutionize the industry!".to_string(),
//         timestamp: 1672522562, // Example timestamp in Unix time format
//     }
// }

// pub fn get_dummy_jon_opportunity() -> Jobs {
//     Jobs {
//         title: ("Example Job Title".to_string()),
//         description: ("This Job Is For Testing Purpose".to_string()),
//         category: ("Software Developer".to_string()),
//         link: ("test link".to_string()),
//         project_id: ("Testing Project Id".to_string()),
//         timestamp: (time()),
//         location: ("Test Location".to_string()),
//         project_data: todo!(),
//     }
// }

// #[query(guard = "is_user_anonymous")]
// pub fn get_dummy_data_for_project_details_for_users() -> ProjectInfoForUser {
//     ProjectInfoForUser {
//         date_of_joining: Some("2024-01-01".to_string()),
//         mentor_associated: Some(vec![get_dummy_mentor_profile()]),
//         vc_associated: Some(vec![get_dummy_venture_capitalist()]),
//         team_member_info: Some(vec![get_dummy_team_member()]),
//         //announcements: Some(vec![get_dummy_announcements()]),
//         //reviews: Some(get_dummy_suggestion()),
//         website_social_group: Some("https://example.com".to_string()),
//         live_link_of_project: Some("https://projectlink.com".to_string()),
//         jobs_opportunity: Some(vec![get_dummy_jon_opportunity()]),
//         area_of_focus: Some("Technology".to_string()),
//         country_of_project: Some("USA".to_string()),
//     }
// }

#[update(guard = "is_user_anonymous")]
pub fn post_job(params: Jobs) -> String {
    let principal_id = ic_cdk::api::caller();

    ic_cdk::println!("Principal ID: {:?}", principal_id);

    let is_owner = read_state(|state| {
        state
            .project_storage
            .iter()
            .any(|(owner_principal, projects)| {
                owner_principal == StoredPrincipal(principal_id)
                    && projects.0.iter().any(|p| p.uid == params.project_id)
            })
    });

    if !is_owner {
        let error_message = format!(
            "Error: Principal {:?} is not the owner of project ID: {}",
            principal_id, params.project_id
        );
        ic_cdk::println!("{}", error_message);
        return error_message;
    }

    let project_info_internal = match find_project_by_id(&params.project_id) {
        Some(info) => info,
        None => {
            let error_message = format!("Error: Project ID: {} not found.", params.project_id);
            ic_cdk::println!("{}", error_message);
            return error_message;
        }
    };

    let current_time = ic_cdk::api::time();
    let project_data_for_job = project_info_internal.params;

    ic_cdk::println!("Project data for job posting: {:?}", project_data_for_job);

    let new_job = JobsInternal {
        job_data: params.clone(),
        timestamp: current_time,
        project_name: project_data_for_job.project_name.clone(),
        project_desc: project_data_for_job.project_description.clone(),
        project_logo: project_data_for_job.project_logo.clone(),
    };

    ic_cdk::println!("New Job Details: {:?}", new_job);

    let result = mutate_state(|state| {
        let announcement_storage = &mut state.post_job;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(principal_id))
        {
            ic_cdk::println!("Existing job entry found.");
            ic_cdk::println!("State before addition: {:?}", caller_announcements.0);
            let mut caller_announcements = caller_announcements.clone(); // Clone to mutate
            caller_announcements.0.push(new_job);
            ic_cdk::println!("State after addition: {:?}", caller_announcements.0);
            announcement_storage.insert(StoredPrincipal(principal_id), caller_announcements);
            format!("Job post added successfully at {}", current_time)
        } else {
            ic_cdk::println!("No job entry found for this caller.");
            ic_cdk::println!("State before addition: None");
            announcement_storage.insert(StoredPrincipal(principal_id), Candid(vec![new_job]));

            format!("Job Post added successfully at {}", current_time)
        }
    });

    result
}

pub fn get_jobs_for_project(project_id: String) -> Vec<JobsInternal> {
    read_state(|state| {
        let mut jobs_for_project = Vec::new();

        for (_, job_list) in state.post_job.iter() {
            for job in job_list.0.iter() {
                if job.job_data.project_id == project_id {
                    jobs_for_project.push(job.clone());
                }
            }
        }

        jobs_for_project
    })
}

// #[query(guard = "is_user_anonymous")]
// pub fn get_latest_jobs() -> Vec<Jobs> {

#[query(guard = "is_user_anonymous")]
pub fn get_all_jobs() -> Vec<JobsInternal> {
    read_state(|state| {
        let mut all_jobs = Vec::new();

        for (_, job_list) in state.post_job.iter() {
            for job_internal in job_list.0.iter() {
                all_jobs.push(job_internal.clone());
            }
        }

        all_jobs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

        all_jobs
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_jobs_posted_by_project(project_id: String) -> Vec<JobsInternal> {
    read_state(|state| {
        let mut jobs_for_project = Vec::new();
        for (_, job_list) in state.post_job.iter() {
            jobs_for_project.extend(
                job_list.0.iter()
                         .filter(|job_internal| job_internal.job_data.project_id == project_id)
                         .cloned()
            );
        }
        jobs_for_project
    })
}

#[update(guard = "is_user_anonymous")]
pub async fn update_job_post_by_id(timestamp: u64, new_details: Jobs) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.post_job;
        if let Some(mut caller_announcements) = announcement_storage.get(&StoredPrincipal(caller()))
        {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("state before update {:?}", caller_announcements.0);
            for announcement in caller_announcements.0.iter_mut() {
                if announcement.timestamp == timestamp {
                    ic_cdk::println!("job post before update: {:?}", announcement);
                    // Update announcement details
                    announcement.job_data = new_details;
                    ic_cdk::println!("State after update: {:?}", announcement);
                    announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);

                    return format!("job post updated successfully for {}", timestamp);
                }
            }

            format!("No job post found with timestamp {}", timestamp)
        } else {
            ic_cdk::println!("No job post entry found for this caller.");
            format!("No job post entry found for this caller.")
        }
    })
}

#[update(guard = "is_user_anonymous")]
pub async fn delete_job_post_by_id(timestamp: u64) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.post_job;
        if let Some(mut caller_announcements) = announcement_storage.get(&StoredPrincipal(caller()))
        {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("state before update {:?}", caller_announcements.0);

            let original_len = caller_announcements.0.len();
            caller_announcements
                .0
                .retain(|announcement| announcement.timestamp != timestamp);

            if caller_announcements.0.len() < original_len {
                announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);
                ic_cdk::println!("job post deleted successfully for {}", timestamp);
                format!("job post deleted successfully for {}", timestamp)
            } else {
                ic_cdk::println!("No job post found with timestamp {}", timestamp);
                format!("No job post found with timestamp {}", timestamp)
            }
        } else {
            ic_cdk::println!("No job post entry found for this caller.");
            format!("No job post entry found for this caller.")
        }
    })
}

#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct JobCategory {
    id: i32,
    name: String,
}

#[query(guard = "is_user_anonymous")]
pub fn get_job_category() -> Vec<JobCategory> {
    vec![
        JobCategory {
            id: 1,
            name: "JOBS".to_string(),
        },
        JobCategory {
            id: 2,
            name: "BOUNTY".to_string(),
        },
        JobCategory {
            id: 3,
            name: "RFP".to_string(),
        },
    ]
}

#[update(guard = "is_user_anonymous")]
pub async fn send_money_access_request(project_id: String) -> String {
    let caller = caller();
    let mut has_pending_request = false;

    let has_pending_request_result = read_state(|state| {
        // Check if the caller exists in the HashMap
        if let Some(request_vec) = state.money_access_request.get(&StoredPrincipal(caller)) {
            // Iterate through the Vec<AccessRequest> to find a matching and pending project_id request
            has_pending_request = request_vec
                .0
                .iter()
                .any(|request| request.project_id == project_id && request.status == "pending");
        }
        has_pending_request
    });

    if has_pending_request_result {
        return "You already have a pending request for this project.".to_string();
    }

    let userData: Result<UserInformation, &str> = get_user_info();

    // Assuming the existence of get_user_info() which might fail hence the unwrap_or_else pattern
    let userData = userData.unwrap_or_else(|_| panic!("Failed to get user data"));

    let access_request = AccessRequest {
        sender: caller.clone(), // Assuming caller() gives us Principal
        name: userData.full_name,
        image: userData.profile_picture.expect("Profile picture not found"),
        project_id: project_id.clone(),
        request_type: "money_details_access".to_string(),
        status: "pending".to_string(),
    };

    // Add request to the MONEY_ACCESS_REQUESTS hashmap
    mutate_state(|state| {
        if let Some(mut request_vec) = state.money_access_request.get(&StoredPrincipal(caller)) {
            request_vec.0.push(access_request.clone());
        } else {
            state.money_access_request.insert(
                StoredPrincipal(caller),
                Candid(vec![access_request.clone()]),
            );
        }
    });

    // Create and send a notification for the request
    let notification_to_send = ProjectNotification {
        notification_type: ProjectNotificationType::AccessRequest(access_request.clone()), // Cloned to satisfy borrow checker
        timestamp: time(), // Assuming the existence of time() that returns u64 timestamp
    };

    mutate_state(|state| {
        if let Some(mut notifications) = state.project_access_notifications.get(&project_id) {
            notifications.0.push(notification_to_send);
        } else {
            state
                .project_access_notifications
                .insert(project_id.clone(), Candid(vec![notification_to_send]));
        }
    });

    "Your access request has been sent and is pending approval.".to_string()
}

// pub get_money_details_access()->String{

// }

#[update(guard = "is_user_anonymous")]
pub async fn send_private_docs_access_request(project_id: String) -> String {
    //sender
    let caller = caller();

    let has_pending_request = read_state(|state| {
        if let Some(request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(caller))
        {
            // Iterate through the Vec<AccessRequest> to find a matching and pending project_id request
            request_vec
                .0
                .iter()
                .any(|request| request.project_id == project_id && request.status == "pending")
        } else {
            false
        }
    });

    if has_pending_request {
        return "You already have a pending request for this project.".to_string();
    }

    let userData: Result<UserInformation, &str> = get_user_info();

    // Assuming the existence of get_user_info() which might fail hence the unwrap_or_else pattern
    let userData = userData.unwrap_or_else(|_| panic!("Failed to get user data"));

    let access_request = AccessRequest {
        sender: caller.clone(), // Assuming caller() gives us Principal
        name: userData.full_name,
        image: userData.profile_picture.expect("Profile picture not found"),
        project_id: project_id.clone(),
        request_type: "private_docs_access".to_string(),
        status: "pending".to_string(),
    };

    // Add request to the MONEY_ACCESS_REQUESTS hashmap
    mutate_state(|state| {
        if let Some(mut request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(caller))
        {
            // If the caller already has requests, append the new one
            request_vec.0.push(access_request.clone());
        } else {
            // If the caller doesn't have any requests yet, create a new vector
            state.private_docs_access_request.insert(
                StoredPrincipal(caller.clone()),
                Candid(vec![access_request.clone()]),
            );
        }
    });

    // Create and send a notification for the request
    let notification_to_send = ProjectNotification {
        notification_type: ProjectNotificationType::AccessRequest(access_request.clone()), // Cloned to satisfy borrow checker
        timestamp: time(), // Assuming the existence of time() that returns u64 timestamp
    };

    mutate_state(|state| {
        if let Some(mut notifications) = state.project_access_notifications.get(&project_id) {
            notifications.0.push(notification_to_send.clone());
        } else {
            state.project_access_notifications.insert(
                project_id.clone(),
                Candid(vec![notification_to_send.clone()]),
            );
        }
    });

    "Your access request has been sent and is pending approval.".to_string()
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_pending_requests() -> Vec<ProjectNotification> {
    read_state(|state| {
        state
            .project_access_notifications
            .iter()
            .flat_map(|(_, notifications)| {
                notifications
                    .0
                    .iter()
                    .filter_map(|notification| match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.status == "pending" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    })
                    .collect::<Vec<_>>()
            })
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_pending_docs_access_requests() -> Vec<ProjectNotification> {
    read_state(|state| {
        state
            .project_access_notifications
            .iter()
            .flat_map(|(_, notifications)| {
                notifications
                    .0
                    .iter()
                    .filter_map(|notification| match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.request_type == "private_docs_access"
                                && access_request.status == "pending" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    })
                    .collect::<Vec<_>>()
            })
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_approved_docs_access_requests() -> Vec<ProjectNotification> {
    read_state(|state| {
        state
            .project_access_notifications
            .iter()
            .flat_map(|(_, notifications)| {
                notifications
                    .0
                    .iter()
                    .filter_map(|notification| match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.request_type == "private_docs_access"
                                && access_request.status == "approved" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    })
                    .collect::<Vec<_>>()
            })
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_declined_docs_access_requests() -> Vec<ProjectNotification> {
    read_state(|state| {
        state
            .project_access_notifications
            .iter()
            .flat_map(|(_, notifications)| {
                notifications
                    .0
                    .iter()
                    .filter_map(|notification| match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.request_type == "private_docs_access"
                                && access_request.status == "declined" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    })
                    .collect::<Vec<_>>()
            })
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_declined_requests() -> Vec<ProjectNotification> {
    read_state(|state| {
        state
            .project_access_notifications
            .iter()
            .flat_map(|(_, notifications)| {
                notifications
                    .0
                    .iter()
                    .filter_map(|notification| match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.status == "declined" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    })
                    .collect::<Vec<_>>()
            })
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_approved_requests() -> Vec<ProjectNotification> {
    read_state(|state| {
        state
            .project_access_notifications
            .iter()
            .flat_map(|(_, notifications)| {
                notifications
                    .0
                    .iter()
                    .filter_map(|notification| match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.status == "approved" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    })
                    .collect::<Vec<_>>()
            })
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_pending_money_requests(project_id: String) -> Vec<ProjectNotification> {
    read_state(
        |state| match state.project_access_notifications.get(&project_id) {
            Some(info) => info.0.iter()
                .filter(|notif| match &notif.notification_type {
                    ProjectNotificationType::AccessRequest(access_request) => 
                        access_request.request_type == "money_details_access" && 
                        access_request.status == "pending",
                    _ => false,
                })
                .cloned()
                .collect(),
            None => Vec::new(),
        },
    )
}

#[query(guard = "is_user_anonymous")]
pub fn get_dapp_link(project_id: String) -> String {
    match find_project_by_id(&project_id) {
        Some(project_data_internal) => match project_data_internal.params.dapp_link {
            Some(link) => link,
            None => "DApp link not available.".to_string(),
        },
        None => "Error: Project not_found.".to_string(),
    }
}

fn add_user_to_money_access(project_id: String, user: Principal) {
    mutate_state(|state| {
        if let Some(mut access_list) = state.money_access.get(&project_id) {
            access_list.0.push(user);
        } else {
            state.money_access.insert(project_id, Candid(vec![user]));
        }
    });
}

/// Adds a `Principal` to the list of approved users for a given project in the `PRIVATE_DOCS_ACCESS` hashmap.
fn add_user_to_private_docs_access(project_id: String, user: Principal) {
    mutate_state(|state| {
        if let Some(mut access_list) = state.private_docs_access.get(&project_id) {
            access_list.0.push(user);
        } else {
            state
                .private_docs_access
                .insert(project_id, Candid(vec![user]));
        }
    });
}

#[update(guard = "is_user_anonymous")]
pub async fn approve_money_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(mut request_vec) = state.money_access_request.get(&StoredPrincipal(sender_id)) {
            for request in request_vec.0.iter_mut() {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "approved".to_string();
                    request_found_and_updated = true;
                    break;
                }
            }
        }
    });

    if !request_found_and_updated {
        return "Request not found or already approved.".to_string();
    }

    // Update the status in PROJECT_ACCESS_NOTIFICATIONS
    mutate_state(|state| {
        if let Some(mut notification_vec) = state.project_access_notifications.get(&project_id) {
            for notification in notification_vec.0.iter_mut() {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "money_details_access" =>
                    {
                        access_request.status = "approved".to_string();
                        break; // Exit after finding and updating the first matching request
                    }
                    _ => {} // Do nothing for other cases or variants
                }
            }
        }
    });

    // Assuming the existence of a function or mechanism to add the sender's Principal to a money_access vector
    add_user_to_money_access(project_id, sender_id);

    "Money access request approved successfully.".to_string()
}

// Placeholder for the function to add the sender's Principal to the money_access vector
// Implement this function based on how your application manages the money_access data

#[update(guard = "is_user_anonymous")]
pub async fn approve_private_docs_access_request(
    project_id: String,
    sender_id: Principal,
) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(mut request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(sender_id))
        {
            for request in request_vec.0.iter_mut() {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "approved".to_string();
                    request_found_and_updated = true;
                    break;
                }
            }
        }
    });

    if !request_found_and_updated {
        return "Request not found or already approved.".to_string();
    }

    // Update the status in PROJECT_ACCESS_NOTIFICATIONS
    mutate_state(|state| {
        if let Some(mut notification_vec) = state.project_access_notifications.get(&project_id) {
            for notification in notification_vec.0.iter_mut() {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "private_docs_access" =>
                    {
                        access_request.status = "approved".to_string();
                        break; // Exit after finding and updating the first matching request
                    }
                    _ => {} // Do nothing for other cases or variants
                }
            }
        }
    });

    // Assuming the existence of a function or mechanism to add the sender's Principal to a money_access vector
    add_user_to_private_docs_access(project_id, sender_id);

    "Private docs access request approved successfully.".to_string()
}

#[query(guard = "is_user_anonymous")]
pub fn access_money_details(project_id: String) -> Result<MoneyRaised, CustomError> {
    let caller = ic_cdk::api::caller();

    let is_owner = read_state(|state| {
        state.project_storage.iter().any(|(principal, projects)| {
            principal == StoredPrincipal(caller) && projects.0.iter().any(|p| p.uid == project_id)
        })
    });

    // Check if the caller is approved to access the money details for this project
    let is_approved = is_owner
        || read_state(|state| {
            state
                .money_access
                .get(&project_id)
                .map_or(false, |principals| {
                    principals.0.contains(&Principal::from(caller))
                })
        });

    if !is_approved {
        return Err(CustomError {
            message: "You do not have access to view the money details for this project."
                .to_string(),
            is_owner,
        });
    }

    read_state(|state| {
        for (_, projects) in state.project_storage.iter() {
            for project in projects.0.iter() {
                if project.uid == project_id {
                    if let Some(money_raised) = &project.params.money_raised {
                        return Ok(money_raised.clone());
                    } else {
                        return Err(CustomError {
                            message: "Money raised details not available for this project."
                                .to_string(),
                            is_owner,
                        });
                    }
                }
            }
        }
        Err(CustomError {
            message: "Project ID not found.".to_string(),
            is_owner,
        })
    })
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct CustomError {
    message: String,
    is_owner: bool,
}

#[query(guard = "is_user_anonymous")]
pub fn access_private_docs(project_id: String) -> Result<Vec<Docs>, CustomError> {
    let caller = ic_cdk::api::caller();

    let is_owner = read_state(|state| {
        state.project_storage.iter().any(|(principal, projects)| {
            principal == StoredPrincipal(caller) && projects.0.iter().any(|p| p.uid == project_id)
        })
    });

    let is_approved = is_owner
        || read_state(|state| {
            state
                .private_docs_access
                .get(&project_id)
                .map_or(false, |principals| {
                    principals.0.contains(&Principal::from(caller))
                })
        });

    if !is_approved {
        return Err(CustomError {
            message: "You do not have access to view the private documents for this project."
                .to_string(),
            is_owner,
        });
    }

    read_state(|state| {
        for (_, projects) in state.project_storage.iter() {
            for project in projects.0.iter() {
                if project.uid == project_id {
                    if let Some(private_docs) = &project.params.private_docs {
                        return Ok(private_docs.clone());
                    } else {
                        return Err(CustomError {
                            message: "Private Docs details not available for this project."
                                .to_string(),
                            is_owner,
                        });
                    }
                }
            }
        }
        Err(CustomError {
            message: "Project ID not found.".to_string(),
            is_owner,
        })
    })
}

#[update(guard = "is_user_anonymous")]
pub fn decline_money_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(mut request_vec) = state.money_access_request.get(&StoredPrincipal(sender_id)) {
            for request in request_vec.0.iter_mut() {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "declined".to_string();
                    request_found_and_updated = true;
                    break;
                }
            }
        }
    });

    if !request_found_and_updated {
        return "Request not found or not in pending status.".to_string();
    }

    // Update the status in PROJECT_ACCESS_NOTIFICATIONS
    mutate_state(|state| {
        if let Some(mut notification_vec) = state.project_access_notifications.get(&project_id) {
            for notification in notification_vec.0.iter_mut() {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "money_details_access" =>
                    {
                        access_request.status = "declined".to_string();
                        break;
                    }
                    _ => {} // Do nothing for other types or statuses
                }
            }
        }
    });

    "Money access request declined successfully.".to_string()
}

#[update(guard = "is_user_anonymous")]
pub fn decline_private_docs_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in PRIVATE_DOCS_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(mut request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(sender_id))
        {
            for request in request_vec.0.iter_mut() {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "declined".to_string();
                    request_found_and_updated = true;
                    break;
                }
            }
        }
    });

    if !request_found_and_updated {
        return "Request not found or already processed.".to_string();
    }

    // Assuming you also track notifications for private docs requests
    mutate_state(|state| {
        if let Some(mut notification_vec) = state.project_access_notifications.get(&project_id) {
            for notification in notification_vec.0.iter_mut() {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "private_docs_access" =>
                    {
                        access_request.status = "declined".to_string();
                        break;
                    }
                    _ => {} // Do nothing for other cases or variants
                }
            }
        }
    });

    "Private docs access request declined successfully.".to_string()
}

pub fn check_project_exists(project_id: String) -> bool {
    find_project_by_id(&project_id).is_some()
}

#[update(guard = "is_user_anonymous")]
pub fn add_project_rating(ratings: ProjectRatingStruct) -> Result<String, String> {
    let principal = caller(); // Assuming `caller()` correctly retrieves the principal of the caller

    // Attempt to retrieve user data or return an error message if unavailable
    let user_data = get_user_info().clone().map_err(|e| e.to_string())?;
    ic_cdk::println!("User data retrieved: {:?}", user_data);

    // Check if the project ID exists
    let project_exists = check_project_exists(ratings.project_id.clone());
    ic_cdk::println!("Project exists: {}", project_exists); 

    if project_exists {
        // Check if the current user has already submitted a review for this project
        let already_rated = read_state(|state| {
            state
                .project_rating
                .get(&ratings.project_id)
                .map_or(false, |reviews| {
                    reviews
                        .0
                        .iter()
                        .any(|(user_principal, _)| *user_principal == principal)
                })
        });

        if already_rated {
            return Err("User has already rated this project.".to_string());
        }

        let project_review = ProjectReview::new(
            user_data.full_name,
            user_data
                .profile_picture
                .ok_or("Profile picture not found")?,
            ratings.message,
            ratings.rating,
        )
        .map_err(|e| e.to_string())?; // Gracefully handle the error
     ic_cdk::println!("Project review created: {:?}", project_review);

        mutate_state(|state| {
            if let Some(mut reviews) = state.project_rating.get(&ratings.project_id) {
                // Project exists and has reviews, add new review
                reviews.0.push((principal, project_review.clone()));
                ic_cdk::println!("Review added to existing project ID: {}", ratings.project_id);
                state.project_rating.insert(ratings.project_id.clone(), reviews.clone()); // Ensure the updated reviews are inserted back
            } else {
                // Project does not exist, create new vector and add review
                state.project_rating.insert(ratings.project_id.clone(), Candid(vec![(principal, project_review.clone())]));
                ic_cdk::println!("New reviews vector created and review added for project ID: {}", ratings.project_id);
            }
        });

        Ok("Rating added".to_string())
    } else {
        Err("Project with ID does not exist.".to_string())
    }
}

#[query(guard = "is_user_anonymous")]
fn get_project_ratings(
    project_id: String,
) -> Result<(Option<Vec<(Principal, ProjectReview)>>, f32, bool), String> {
    let caller = caller(); // Assuming this retrieves the current user's principal
    let (ratings, average_rating, caller_present) = read_state(|state| {
        match state.project_rating.get(&project_id) {
            Some(ratings) => {
                let total_ratings = ratings.0.len() as f32;
                if total_ratings == 0.0 {
                    // No ratings exist for the project
                    (Some(vec![]), 0.0, false)
                } else {
                    let sum_ratings: u32 = ratings.0.iter().map(|(_, review)| review.rating).sum();
                    let average_rating = sum_ratings as f32 / total_ratings;
                    let caller_present =
                        ratings.0.iter().any(|(principal, _)| principal == &caller);
                    (Some(ratings.0.clone()), average_rating, caller_present)
                }
            }
            None => (None, 0.0, false),
        }
    });
    if let Some(ratings) = ratings {
        Ok((Some(ratings), average_rating, caller_present))
    } else {
        Err("No ratings found for the specified project ID.".to_string())
    }
}

#[query(guard = "is_user_anonymous")]
pub fn get_frequent_reviewers() -> Vec<UserInfoInternal> {
    let mut review_count: HashMap<Principal, usize> = HashMap::new();

    read_state(|state| {
        for (project_id, ratings) in state.project_rating.iter() {
            for (principal, _) in ratings.0.iter() {
                *review_count.entry(principal.clone()).or_insert(0) += 1;
            }
        }
    });

    let frequent_reviewers = review_count
        .into_iter()
        .filter_map(|(principal, count)| {
            if count > 5 {
                get_user_info_using_principal(principal)
            } else {
                None
            }
        })
        .collect::<Vec<_>>();

    frequent_reviewers
}

pub fn get_type_of_registration() -> Vec<String> {
    vec!["Company".to_string(), "DAO".to_string()]
}



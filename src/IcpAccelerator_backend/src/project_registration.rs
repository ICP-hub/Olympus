use crate::admin::*;
use crate::mentor::MentorProfile;

use crate::user_module::*;

use crate::ratings::{RatingAverages, RatingSystem};
use crate::roadmap_suggestion::Suggestion;
use crate::user_module::{UserInfoInternal, UserInformation};

use crate::admin::send_approval_request;
use crate::ratings::calculate_average_api;
use crate::vc_registration::VentureCapitalist;
use crate::{
    hub_organizer,
    register_user::{self, get_founder_info},
};
use bincode::{self, DefaultOptions, Options};
use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::api::time;
use ic_cdk::storage;
use ic_cdk_macros::*;
use ic_stable_structures::vec;
use serde::{Deserialize, Serialize};
use serde_cbor::Value::Null;
use sha2::{Digest, Sha256};
use std::cell::RefCell;
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
    project_logo: Vec<u8>,
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
    project_logo: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfo {
    pub project_name: String,
    pub project_logo: Vec<u8>,
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
    pub project_cover: Vec<u8>,
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
    pub is_your_project_registered : Option<bool>,
    pub type_of_registration : Option<String>,
    pub country_of_registration : Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectPublicInfo {
    pub project_id: String,
    pub project_name: String,
    pub project_logo: Vec<u8>,
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
    pub project_cover: Vec<u8>,
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
    pub project_cover: Vec<u8>,
    pub project_twitter: Option<String>,
    pub project_linkedin: Option<String>,
    pub project_website: Option<String>,
    pub project_discord: Option<String>,
    pub promotional_video: Option<String>,
    pub github_link: Option<String>,
    pub user_data: UserInformation,
    pub project_team: Option<Vec<TeamMember>>,
    pub dapp_link: Option<String>,
    pub weekly_active_users: Option<u64>,
    pub date_of_joining: Option<u64>,
    pub mentor_associated: Option<Vec<MentorProfile>>,
    pub vc_associated: Option<Vec<VentureCapitalist>>,
    pub team_member_info: Option<Vec<TeamMember>>,
    pub announcements: HashMap<Principal, Vec<AnnouncementsInternal>>,
    pub reviews: Vec<Suggestion>,
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

pub type ProjectAnnouncements = HashMap<Principal, Vec<AnnouncementsInternal>>;
pub type Notifications = HashMap<Principal, Vec<NotificationProject>>;
pub type BlogPost = HashMap<Principal, Vec<Blog>>;

pub type ApplicationDetails = HashMap<Principal, Vec<ProjectInfoInternal>>;
pub type PendingDetails = HashMap<String, ProjectUpdateRequest>;
pub type DeclinedDetails = HashMap<String, ProjectUpdateRequest>;

pub type ProjectDetails = HashMap<Principal, ProjectInfoInternal>;
pub type JobDetails = HashMap<Principal, Vec<JobsInternal>>;
pub type SpotlightProjects = Vec<SpotlightDetails>;
pub type MoneyAccess = HashMap<Principal, Vec<AccessRequest>>;
pub type PrivateDocsAccess = HashMap<Principal, Vec<AccessRequest>>;

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

#[derive(CandidType, Clone, Serialize, Deserialize)]
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

thread_local! {
    pub static PROJECT_ACCESS_NOTIFICATIONS : RefCell<HashMap<String, Vec<ProjectNotification>>> = RefCell::new(HashMap::new());
    pub static  APPLICATION_FORM: RefCell<ApplicationDetails> = RefCell::new(ApplicationDetails::new());
    pub static PROJECT_DETAILS: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());
    pub static NOTIFICATIONS: RefCell<Notifications> = RefCell::new(Notifications::new());
    pub static OWNER_NOTIFICATIONS: RefCell<HashMap<Principal, Vec<NotificationForOwner>>> = RefCell::new(HashMap::new());
    pub static PROJECT_ANNOUNCEMENTS:RefCell<ProjectAnnouncements> = RefCell::new(ProjectAnnouncements::new());
    pub static BLOG_POST:RefCell<BlogPost> = RefCell::new(BlogPost::new());

    pub static PROJECT_AWAITS_RESPONSE: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());
    pub static DECLINED_PROJECT_REQUESTS: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());

    pub static PENDING_PROJECT_UPDATES: RefCell<PendingDetails> = RefCell::new(PendingDetails::new());
    pub static DECLINED_PROJECT_UPDATES: RefCell<DeclinedDetails> = RefCell::new(DeclinedDetails::new());
    pub static POST_JOB: RefCell<JobDetails> = RefCell::new(JobDetails::new());
    pub static JOB_TYPE: RefCell<Vec<String>> = RefCell::new(vec!["BOUNTY".to_string(),"JOBS".to_string(),"RFP".to_string()]);
    pub static SPOTLIGHT_PROJECTS: RefCell<SpotlightProjects> = RefCell::new(SpotlightProjects::new());
    pub static MONEY_ACCESS: RefCell<HashMap<String, Vec<Principal>>> = RefCell::new(HashMap::new());
    pub static PRIVATE_DOCS_ACCESS: RefCell<HashMap<String, Vec<Principal>>> = RefCell::new(HashMap::new());

    pub static PROJECT_RATING : RefCell<HashMap<String, Vec<(Principal,ProjectReview)>>> = RefCell::new(HashMap::new());

    pub static  MONEY_ACCESS_REQUESTS :RefCell<MoneyAccess> = RefCell::new(MoneyAccess::new());

    pub static PRIVATE_DOCS_ACCESS_REQUESTS :RefCell<PrivateDocsAccess> = RefCell::new(PrivateDocsAccess::new());

}

pub fn pre_upgrade_project_registration() {
    PROJECT_ACCESS_NOTIFICATIONS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save PROJECT_ACCESS_NOTIFICATIONS");
    });
    APPLICATION_FORM.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save APPLICATION_FORM");
    });
    PROJECT_DETAILS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save PROJECT_DETAILS");
    });
    NOTIFICATIONS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save NOTIFICATIONS");
    });
    OWNER_NOTIFICATIONS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save OWNER_NOTIFICATIONS");
    });
    PROJECT_ANNOUNCEMENTS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save PROJECT_ANNOUNCEMENTS");
    });
    BLOG_POST.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save BLOG_POST");
    });
    PROJECT_AWAITS_RESPONSE.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save PROJECT_AWAITS_RESPONSE");
    });
    DECLINED_PROJECT_REQUESTS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save DECLINED_PROJECT_REQUESTS");
    });
    PENDING_PROJECT_UPDATES.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save PENDING_PROJECT_UPDATES");
    });
    DECLINED_PROJECT_UPDATES.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save DECLINED_PROJECT_UPDATES");
    });
    POST_JOB.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save POST_JOB");
    });
    JOB_TYPE.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save JOB_TYPE");
    });
    SPOTLIGHT_PROJECTS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save SPOTLIGHT_PROJECTS");
    });
    MONEY_ACCESS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save MONEY_ACCESS");
    });
    PRIVATE_DOCS_ACCESS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save PRIVATE_DOCS_ACCESS");
    });
    PROJECT_RATING.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save PROJECT_RATING");
    });
    MONEY_ACCESS_REQUESTS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save MONEY_ACCESS_REQUESTS");
    });
    PRIVATE_DOCS_ACCESS_REQUESTS.with(|data| {
        let cloned_data = data.borrow().clone();
        ic_cdk::storage::stable_save((&cloned_data,)).expect("Failed to save PRIVATE_DOCS_ACCESS_REQUESTS");
    });
}

pub fn post_upgrade_project_registration() {
    let (project_access_notifications,): (HashMap<String, Vec<ProjectNotification>>, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore PROJECT_ACCESS_NOTIFICATIONS");
    PROJECT_ACCESS_NOTIFICATIONS.with(|data| *data.borrow_mut() = project_access_notifications);

    let (application_form,): (ApplicationDetails, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore APPLICATION_FORM");
    APPLICATION_FORM.with(|data| *data.borrow_mut() = application_form);

    let (project_details,): (ProjectDetails, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore PROJECT_DETAILS");
    PROJECT_DETAILS.with(|data| *data.borrow_mut() = project_details);

    let (notifications,): (Notifications, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore NOTIFICATIONS");
    NOTIFICATIONS.with(|data| *data.borrow_mut() = notifications);

    let (owner_notifications,): (HashMap<Principal, Vec<NotificationForOwner>>, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore OWNER_NOTIFICATIONS");
    OWNER_NOTIFICATIONS.with(|data| *data.borrow_mut() = owner_notifications);

    let (project_announcements,): (ProjectAnnouncements, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore PROJECT_ANNOUNCEMENTS");
    PROJECT_ANNOUNCEMENTS.with(|data| *data.borrow_mut() = project_announcements);

    let (blog_post,): (BlogPost, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore BLOG_POST");
    BLOG_POST.with(|data| *data.borrow_mut() = blog_post);

    let (project_awaits_response,): (ProjectDetails, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore PROJECT_AWAITS_RESPONSE");
    PROJECT_AWAITS_RESPONSE.with(|data| *data.borrow_mut() = project_awaits_response);

    let (declined_project_requests,): (ProjectDetails, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore DECLINED_PROJECT_REQUESTS");
    DECLINED_PROJECT_REQUESTS.with(|data| *data.borrow_mut() = declined_project_requests);

    let (pending_project_updates,): (PendingDetails, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore PENDING_PROJECT_UPDATES");
    PENDING_PROJECT_UPDATES.with(|data| *data.borrow_mut() = pending_project_updates);

    let (declined_project_updates,): (DeclinedDetails, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore DECLINED_PROJECT_UPDATES");
    DECLINED_PROJECT_UPDATES.with(|data| *data.borrow_mut() = declined_project_updates);

    let (post_job,): (JobDetails, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore POST_JOB");
    POST_JOB.with(|data| *data.borrow_mut() = post_job);

    let (job_type,): (Vec<String>, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore JOB_TYPE");
    JOB_TYPE.with(|data| *data.borrow_mut() = job_type);

    let (spotlight_projects,): (SpotlightProjects, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore SPOTLIGHT_PROJECTS");
    SPOTLIGHT_PROJECTS.with(|data| *data.borrow_mut() = spotlight_projects);

    let (money_access,): (HashMap<String, Vec<Principal>>, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore MONEY_ACCESS");
    MONEY_ACCESS.with(|data| *data.borrow_mut() = money_access);

    let (private_docs_access,): (HashMap<String, Vec<Principal>>, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore PRIVATE_DOCS_ACCESS");
    PRIVATE_DOCS_ACCESS.with(|data| *data.borrow_mut() = private_docs_access);

    let (project_rating,): (HashMap<String, Vec<(Principal, ProjectReview)>>, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore PROJECT_RATING");
    PROJECT_RATING.with(|data| *data.borrow_mut() = project_rating);

    let (money_access_requests,): (MoneyAccess, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore MONEY_ACCESS_REQUESTS");
    MONEY_ACCESS_REQUESTS.with(|data| *data.borrow_mut() = money_access_requests);

    let (private_docs_access_requests,): (PrivateDocsAccess, ) =
        ic_cdk::storage::stable_restore().expect("Failed to restore PRIVATE_DOCS_ACCESS_REQUESTS");
    PRIVATE_DOCS_ACCESS_REQUESTS.with(|data| *data.borrow_mut() = private_docs_access_requests);

}

pub async fn create_project(info: ProjectInfo) -> String {
    if info.private_docs.is_some() && info.upload_private_documents != Some(true) {
        return "Cannot set private documents unless upload private docs has been set to true"
            .to_string();
    }

    // if info.money_raised.is_some() && info.money_raised_till_now != Some(true) {
    //     return "Cannot populate MoneyRaised unless money_raised_till_now is true.".to_string();
    // }

    // if let Some(money_raised) = &info.money_raised {
    //     let total_raised = money_raised.total_amount();
    //     if total_raised <= 0.0 {
    //         return "The total amount raised must be greater than zero.".to_string();
    //     } else if total_raised
    //         > money_raised
    //             .target_amount
    //             .expect("Target amount must be set.")
    //     {
    //         return "The sum of funding sources exceeds the target amount.".to_string();
    //     }
    // }
    // Validate the project info

    // Validation succeeded, continue with creating the project
    let caller = caller();

    DECLINED_PROJECT_REQUESTS.with(|d_vc| {
        let exits = d_vc.borrow().contains_key(&caller);
        if exits {
            panic!("You had got your request declined earlier");
        }
    });

    let already_registered = APPLICATION_FORM
        .with(|registry| registry.borrow().contains_key(&caller))
        || PROJECT_AWAITS_RESPONSE.with(|registry| registry.borrow().contains_key(&caller));

    if already_registered {
        ic_cdk::println!("You can't create more than one project");
        return "You can't create more than one project".to_string();
    }

    ROLE_STATUS_ARRAY.with(|role_status| {
        let mut role_status = role_status.borrow_mut();

        for role in role_status
            .get_mut(&caller)
            .expect("You have to register yourself as a user first!")
            .iter_mut()
        {
            if role.name == "project" {
                role.status = "requested".to_string();
                role.requested_on = Some(time());
            }
        }
    });

    let info_clone = info.clone();
    let user_uid = crate::user_module::update_user(info_clone.user_data).await;
    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    let new_project = ProjectInfoInternal {
        params: info.clone(),
        uid: new_id,
        is_active: true,
        is_verified: false,
        creation_date: time(),
    };


    PROJECT_AWAITS_RESPONSE.with(
        |awaiters: &RefCell<HashMap<Principal, ProjectInfoInternal>>| {
            let mut await_ers: std::cell::RefMut<'_, HashMap<Principal, ProjectInfoInternal>> =
                awaiters.borrow_mut();
            await_ers.insert(caller, new_project.clone());
        },
    );

    crate::latest_popular_projects::update_project_status_live_incubated(new_project);

    let user_data_for_updation = info.clone();
    crate::user_module::update_data_for_roles(caller, user_data_for_updation.user_data);

    let res = send_approval_request(
        info.user_data.profile_picture.unwrap_or_else(|| Vec::new()),
        info.user_data.full_name,
        info.user_data.country,
        info.project_area_of_focus,
        "project".to_string(),
        info.user_data.bio.unwrap_or("no bio".to_string()),
    )
    .await;

    format!("{}", res)
}

#[query]
pub fn get_project_info_using_principal(caller: Principal) -> Option<ProjectInfoInternal> {
    APPLICATION_FORM.with(|registry| {
        registry
            .borrow()
            .get(&caller)
            .and_then(|projects| projects.first().cloned())
    })
}

#[query]
pub fn get_project_awaiting_info_using_principal(caller: Principal) -> Option<ProjectInfoInternal> {
    PROJECT_AWAITS_RESPONSE.with(|registry| registry.borrow().get(&caller).cloned())
}

#[query]
pub fn get_project_declined_info_using_principal(caller: Principal) -> Option<ProjectInfoInternal> {
    DECLINED_PROJECT_REQUESTS.with(|registry| registry.borrow().get(&caller).cloned())
}

// all created projects but without ProjectInternal
pub fn get_projects_for_caller() -> Vec<ProjectInfo> {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        let projects = storage.borrow();
        if let Some(founder_projects) = projects.get(&caller) {
            founder_projects
                .iter()
                .map(|project_internal| project_internal.params.clone())
                .collect()
        } else {
            Vec::new()
        }
    })
}

//get_my_project; firstly created project || all_pub_plus_private_info
#[query]
pub fn get_my_project() -> ProjectInfoInternal {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        let projects = storage.borrow();
        let one_project = projects.get(&caller).expect("couldn't get a project");
        let one = one_project[0].clone();
        one.clone()
    })
}

// all created projects
#[query]
pub fn get_projects_with_all_info() -> Vec<ProjectInfoInternal> {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        let projects = storage.borrow();
        let project_info = projects.get(&caller);
        let projects = project_info
            .expect("couldn't get project information")
            .clone();
        projects
    })
}

#[query]
pub fn get_project_id() -> String {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        let projects = storage.borrow();
        let project_info = projects.get(&caller);
        let projects = project_info
            .expect("couldn't get project information")
            .clone();
        let one = projects[0].clone();
        one.uid
    })
}

//this should only be for admin
pub fn find_project_by_id(project_id: &str) -> Option<ProjectInfoInternal> {
    APPLICATION_FORM.with(|storage| {
        for projects in storage.borrow().values() {
            if let Some(project) = projects.iter().find(|p| p.uid == project_id) {
                return Some(project.clone());
            }
        }
        None
    })
}

//newbie api shows restricted info!
#[query]
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


#[query]
pub fn get_project_public_information_using_id(
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
        creation_date: project_details.creation_date
    };

    project_internal
}

#[query]
pub fn list_all_projects_for_admin() -> HashMap<Principal, ProjectVecWithRoles> {
    let project_awaiters = APPLICATION_FORM.with(|awaiters| awaiters.borrow().clone());

    let mut project_with_roles_map: HashMap<Principal, ProjectVecWithRoles> = HashMap::new();

    for (principal, vc_internal) in project_awaiters.iter() {
        let roles = get_roles_for_principal(*principal);
        let project_with_roles = ProjectVecWithRoles {
            project_profile: vc_internal.clone(),
            roles,
        };

        project_with_roles_map.insert(*principal, project_with_roles);
    }

    project_with_roles_map
}

#[derive(CandidType, Clone)]
pub struct ListAllProjects {
    principal: Principal,
    params: ProjectInfoInternal,
    overall_average: Option<f64>,
}

// #[query]
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


#[query]
pub fn list_all_projects() -> Vec<ListAllProjects> {
    APPLICATION_FORM.with(|projects: &RefCell<ApplicationDetails>| {
        let projects = projects.borrow();

        if projects.is_empty() {
            return Vec::new();
        }



        let mut list_all_projects: Vec<ListAllProjects> = vec![];

        for (principal, projects) in projects.iter() {

            if projects.is_empty() {
                continue;
            }

            for project in projects {
                let get_rating = calculate_average_api(&project.uid);


                if !get_rating.overall_average.is_empty() {
                    let project_info = ListAllProjects {
                        principal: principal.clone(),
                        params: project.clone(),
                        overall_average: Some(get_rating.overall_average[0]),
                    };

                    if project.is_active == true{
                        list_all_projects.push(project_info);
                    }

                } else {

                    let project_info = ListAllProjects {
                        principal: principal.clone(),
                        params: project.clone(),
                        overall_average: None,
                    };

                    if project.is_active == true{
                        list_all_projects.push(project_info);
                    }
                }
            }
        }
        list_all_projects
    })
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationParams {
    page: usize,
    page_size: usize,
}

#[query]
pub fn list_all_projects_with_pagination(pagination_params: PaginationParams) -> Vec<ListAllProjects> {
    APPLICATION_FORM.with(|projects: &RefCell<ApplicationDetails>| {
        let projects = projects.borrow();

        if projects.is_empty() {
            return Vec::new();
        }

        let mut list_all_projects: Vec<ListAllProjects> = Vec::new();

        for (principal, projects) in projects.iter() {
            if projects.is_empty() {
                continue;
            }

            for project in projects {
                let get_rating = calculate_average_api(&project.uid);

                let project_info = ListAllProjects {
                    principal: principal.clone(),
                    params: project.clone(),
                    overall_average: if !get_rating.overall_average.is_empty() {
                        Some(get_rating.overall_average[0])
                    } else {
                        None
                    },
                };

                if project.is_active {
                    list_all_projects.push(project_info);
                }
            }
        }

        // Calculate the start index based on the page number and page size. Ensure it does not exceed the list's bounds.
        let start = std::cmp::min((pagination_params.page - 1) * pagination_params.page_size, list_all_projects.len());

        // Calculate the end index based on the start index and page size. Ensure it does not exceed the list's bounds.
        let end = std::cmp::min(start + pagination_params.page_size, list_all_projects.len());

        // Using the safe start and end indices, slice the vector and return a new vector containing just the paginated items.
        list_all_projects[start..end].to_vec()
    })
}

pub async fn update_project(project_id: String, updated_project: ProjectInfo) -> String {
    let caller = caller();

    let is_owner = APPLICATION_FORM.with(|projects| {
        projects.borrow().iter().any(|(owner_principal, projects)| {
            *owner_principal == caller && projects.iter().any(|p| p.uid == project_id)
        })
    });

    if !is_owner {
        return "Error: Only the project owner can request updates.".to_string();
    }

    DECLINED_PROJECT_UPDATES.with(|d_vc| {
        let exits = d_vc.borrow().contains_key(&project_id);
        if exits {
            panic!("You had got your request declined earlier");
        }
    });

    let is_owner = APPLICATION_FORM.with(|projects| {
        projects
            .borrow()
            .iter()
            .any(|(_, project_list)| project_list.iter().any(|p| p.uid == project_id))
    });

    if !is_owner {
        return "Error: Only the project owner can request updates.".to_string();
    }

    let original_info_cloned = APPLICATION_FORM.with(|app_form| {
        app_form.borrow().get(&caller).cloned()
    });
    match original_info_cloned {
        Some(orig_infos) => {
            // Attempt to find the specific ProjectInfoInternal by project_id
            if let Some(orig_info) = orig_infos.iter().find(|p| p.uid == project_id) {
                // Now we have the original project info, proceed to create the update request
                PENDING_PROJECT_UPDATES.with(|updates| {
                    let mut updates = updates.borrow_mut();
                    updates.insert(project_id.clone(), ProjectUpdateRequest {
                        project_id: project_id.clone(),
                        original_info: orig_info.params.clone(),  // Assuming `params` is of type `ProjectInfo`
                        updated_info: updated_project.clone(),
                    });
                });
            }
        },
        None => todo!(),
    }

    let res = send_approval_request(
        updated_project
            .user_data
            .profile_picture
            .unwrap_or_else(|| Vec::new()),
        updated_project.user_data.full_name,
        updated_project.user_data.country,
        updated_project.project_area_of_focus,
        "project".to_string(),
        updated_project
            .user_data
            .bio
            .unwrap_or("no bio".to_string()),
    )
    .await;

    format!("{}", res)
}

pub fn delete_project(id: String) -> std::string::String {
    let caller = caller();
    let mut is_found = false;

    APPLICATION_FORM.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(projects) = storage.get_mut(&caller) {
            for project in projects.iter_mut() {
                if project.uid == id {
                    project.is_active = false;
                    break;
                }
            }
        }
        is_found = true;
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
    let hub_principal = caller();

    NOTIFICATIONS.with(|notifications| {
        notifications
            .borrow()
            .get(&hub_principal)
            .cloned()
            .unwrap_or_else(Vec::new)
    })
}

fn find_project_owner_principal(project_id: &str) -> Option<Principal> {
    APPLICATION_FORM.with(|app_details| {
        let app_details = app_details.borrow();
        for (owner_principal, projects) in app_details.iter() {
            if projects.iter().any(|p| p.uid == project_id) {
                return Some(owner_principal.clone());
            }
        }
        None
    })
}

pub fn send_connection_request_to_owner(project_id: &str, team_member_username: &str) -> String {
    let caller_principal = caller();

    let sender_info = register_user::get_founder_info();
    if sender_info.is_none() {
        return "Sender information could not be retrieved.".to_string();
    }
    let (name, image) = match sender_info {
        Some(info) => {
            let name = info
                .thirty_info
                .as_ref()
                .and_then(|thirty_info| thirty_info.full_name.clone());
            let image = info
                .seventy_info
                .as_ref()
                .and_then(|seventy_info| seventy_info.founder_image.clone());
            (name, image)
        }
        None => (None, None),
    };

    let message = format!(
        "{} is interested in connecting with team member {} in your project.",
        name.clone().unwrap_or_else(|| "Unknown Sender".to_string()),
        team_member_username
    );

    let project_owner_principal = find_project_owner_principal(project_id);

    let notification = NotificationForOwner {
        sender_name: name.unwrap_or_else(|| "Unknown Founder".to_string()),
        sender_image: image.unwrap_or_else(|| vec![]),
        message,
        project_id: project_id.to_string(),
        timestamp: ic_cdk::api::time(),
    };

    // Store the notification
    if let Some(project_owner_principal) = find_project_owner_principal(project_id) {
        OWNER_NOTIFICATIONS.with(|notifications| {
            notifications
                .borrow_mut()
                .entry(project_owner_principal)
                .or_insert_with(Vec::new)
                .push(notification);
        });
        "Notification sent successfully.".to_string()
    } else {
        "Project owner not found.".to_string()
    }
}

pub fn get_notifications_for_owner() -> Vec<NotificationForOwner> {
    let owner_principal = caller();

    OWNER_NOTIFICATIONS.with(|notifications| {
        notifications
            .borrow()
            .get(&owner_principal)
            .cloned()
            .unwrap_or_else(Vec::new)
    })
}

pub async fn update_team_member(project_id: &str, member_principal_id: Principal) -> String {
    let member_uid = USER_STORAGE.with(|storage| {
        let storage = storage.borrow();
        let user = storage.get(&member_principal_id);
        let u = user.expect("principal hasn't registered himself as a user");
        u.uid.clone()
    });

    let user_info_result = crate::user_module::get_user_info_by_id(member_uid.clone()).await;

    let user_info = match user_info_result {
        Ok(info) => info,
        Err(err) => return format!("Failed to retrieve user info: {}", err),
    };

    let mut project_found = false;
    let mut member_added_or_updated = false;
    APPLICATION_FORM.with(|storage| {
        let mut storage = storage.borrow_mut();

        if let Some(project_internal) = storage
            .values_mut()
            .flat_map(|v| v.iter_mut())
            .find(|p| p.uid == project_id)
        {
            project_found = true;

            // Check if the project already has a team member list
            if let Some(team) = &mut project_internal.params.project_team {
                // Look for an existing team member with the same UID
                let existing_member = team.iter_mut().find(|m| m.member_uid == member_uid);

                if let Some(member) = existing_member {
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
    });
    match (project_found, member_added_or_updated) {
        (true, true) => "Team member updated successfully.".to_string(),
        (true, false) => "Failed to update the team member in the specified project.".to_string(),
        _ => "Project not found.".to_string(),
    }
}

#[update]
pub fn add_announcement(mut announcement_details: Announcements) -> String {
    let caller_id = caller();

    let current_time = time();

    let project_id_exists = APPLICATION_FORM.with(|forms| {
        forms.borrow().values().any(|projects| {
            projects
                .iter()
                .any(|project_info| project_info.uid == announcement_details.project_id)
        })
    });

    let project_info_internal = match find_project_by_id(&announcement_details.project_id) {
        Some(project_info) => project_info,
        None => return "Project ID does not exist in application forms.".to_string(),
    };

    if !project_id_exists {
        return "Project ID does not exist in application forms.".to_string();
    }

    let new_announcement = AnnouncementsInternal {
        announcement_data: announcement_details,
        timestamp: current_time,
        project_name: project_info_internal.params.project_name,
        project_desc: project_info_internal.params.project_description,
        project_logo: project_info_internal.params.project_logo,
    };

    PROJECT_ANNOUNCEMENTS.with(|state| {
        let mut state = state.borrow_mut();
        state
            .entry(caller_id)
            .or_insert_with(Vec::new)
            .push(new_announcement);
        format!("Announcement added successfully at {}", current_time)
    })
}

//for testing purpose
#[query]
pub fn get_announcements() -> HashMap<Principal, Vec<AnnouncementsInternal>> {
    PROJECT_ANNOUNCEMENTS.with(|state| state.borrow().clone())
}

#[query]
pub fn get_latest_announcements() -> HashMap<Principal, Vec<AnnouncementsInternal>> {
    PROJECT_ANNOUNCEMENTS.with(|state| {
        let state = state.borrow();
        state
            .iter()
            .map(|(principal, announcement_internals)| {
                let mut sorted_announcements = announcement_internals.clone();
                sorted_announcements.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
                (principal.clone(), sorted_announcements)
            })
            .collect()
    })
}

#[query]
pub fn get_announcements_by_project_id(project_id: String) -> Vec<AnnouncementsInternal> {
    PROJECT_ANNOUNCEMENTS.with(|state| {
        state
            .borrow()
            .values()
            .flat_map(|announcements| {
                announcements
                    .iter()
                    .filter(|announcement| announcement.announcement_data.project_id == project_id)
            })
            .cloned()
            .collect()
    })
}

#[update]
pub fn add_BlogPost(url: String) -> String {
    let caller_id = caller();

    let current_time = time();

    BLOG_POST.with(|state| {
        let mut state = state.borrow_mut();
        let new_blog = Blog {
            blog_url: url,
            timestamp: current_time,
        };
        state
            .entry(caller_id)
            .or_insert_with(Vec::new)
            .push(new_blog);
        format!("Blog Post added successfully at {}", current_time)
    })
}

//for testing purpose
#[query]
pub fn get_blog_post() -> HashMap<Principal, Vec<Blog>> {
    BLOG_POST.with(|state| {
        let state = state.borrow();
        state.clone()
    })
}

pub fn filter_projects(criteria: FilterCriteria) -> Vec<ProjectInfo> {
    APPLICATION_FORM.with(|projects| {
        let projects = projects.borrow();

        projects
            .iter()
            .flat_map(|(_, project_list)| project_list.iter())
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

                //todo:- what is use of this check and uncomment
                // let money_raised_match = criteria.money_raised_range.map_or(true, |(min, max)| {
                //     if let Some(money_raised_str) = &project_internal.params.money_raised_till_now {
                //         if let Ok(money_raised) = money_raised_str.parse::<f64>() {
                //             return money_raised >= min && money_raised <= max;
                //         }
                //     }
                //     false
                // });

                let mentor_match = criteria.mentor_name.as_ref().map_or(true, |mentor_name| {
                    project_internal
                        .params
                        .mentors_assigned
                        .as_ref()
                        .map_or(false, |mentors| {
                            mentors
                                .iter()
                                .any(|mentor| mentor.user_data.full_name.contains(mentor_name))
                        })
                });

                let vc_match = criteria.vc_name.as_ref().map_or(true, |vc_name| {
                    project_internal
                        .params
                        .vc_assigned
                        .as_ref()
                        .map_or(false, |vcs| {
                            vcs.iter().any(|vc| vc.name_of_fund.contains(vc_name))
                        })
                });

                country_match
                    && rating_match
                    && focus_match
                    // && money_raised_match
                    && mentor_match
                    && vc_match
            })
            .map(|project_internal| project_internal.params.clone())
            .collect()
    })
}

#[query]
pub fn get_project_info_for_user(project_id: String) -> Option<ProjectInfoForUserInternal> {
    let announcements_project = get_announcements();
    let project_reviews = crate::roadmap_suggestion::get_suggestions_by_status(
        project_id.clone(),
        "In Progress".to_string(),
    );
    let jobs_opportunity_posted = get_jobs_posted_by_project(project_id.clone());

    let community_ratings = crate::ratings::calculate_average_api(&project_id);

    APPLICATION_FORM.with(|storage| {
        let projects = storage.borrow();

        projects
            .iter()
            .flat_map(|(_, project_list)| project_list.iter())
            .find(|project_internal| project_internal.uid == project_id)
            .map(|project_internal| ProjectInfoForUserInternal {
                params: ProjectInfoForUser {
                    project_name: Some(project_internal.params.project_name.clone()),
                    project_logo: Some(project_internal.params.project_logo.clone()),
                    project_description: project_internal.params.project_description.clone(),
                    community_rating: Some(community_ratings),
                    project_cover: project_internal.params.project_cover.clone(),
                    project_twitter: project_internal.params.project_twitter.clone(),
                    project_linkedin: project_internal.params.project_linkedin.clone(),
                    project_website: project_internal.params.project_website.clone(),
                    project_discord: project_internal.params.project_discord.clone(),
                    promotional_video: project_internal.params.promotional_video.clone(),
                    github_link: project_internal.params.github_link.clone(),
                    user_data: project_internal.params.user_data.clone(),
                    project_team: project_internal.params.project_team.clone(),
                    dapp_link: project_internal.params.dapp_link.clone(),
                    weekly_active_users: project_internal.params.weekly_active_users.clone(),
                    date_of_joining: Some(project_internal.creation_date),
                    mentor_associated: project_internal.params.mentors_assigned.clone(),
                    vc_associated: project_internal.params.vc_assigned.clone(),
                    team_member_info: project_internal.params.project_team.clone(),
                    announcements: announcements_project,
                    reviews: project_reviews,
                    website_social_group: project_internal.params.project_discord.clone(),
                    live_link_of_project: project_internal.params.dapp_link.clone(),
                    jobs_opportunity: Some(jobs_opportunity_posted),
                    area_of_focus: Some(project_internal.params.project_area_of_focus.clone()),
                    country_of_project: project_internal.params.preferred_icp_hub.clone(),
                },
            })
    })
}

#[update]
pub fn make_project_active_inactive(p_id: Principal, project_id: String) -> String {
    let principal_id = caller();
    if p_id == principal_id || ic_cdk::api::is_controller(&principal_id) {
        APPLICATION_FORM.with(|storage| {
            let mut storage = storage.borrow_mut();

            // First, try to get the vector of ProjectDetail associated with p_id
            if let Some(projects) = storage.get_mut(&p_id) {
                // Find the project with the matching project_id
                if let Some(project) = projects.iter_mut().find(|p| p.uid == project_id) {
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
        "you are not authorised to use this function".to_string()
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

pub fn get_dummy_suggestion() -> Suggestion {
    Suggestion {
        id: 1, // Example ID
        content: "This project could benefit from more robust testing strategies.".to_string(),
        status: "Pending Review".to_string(),
        project_id: "ProjectX123".to_string(),
        parent_id: None, // or Some(id) if you want to simulate a response to another suggestion
    }
}

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

// #[query]
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

#[update]
pub fn post_job(params: Jobs) -> String {
    let principal_id = caller();
    let is_owner = APPLICATION_FORM.with(|projects| {
        projects.borrow().iter().any(|(owner_principal, projects)| {
            *owner_principal == principal_id && projects.iter().any(|p| p.uid == params.project_id)
        })
    });

    if !is_owner {
        return "Error: Only the project owner can request updates.".to_string();
    }
    match find_project_by_id(&params.project_id) {
        Some(project_data_internal) => {
            let current_time = time();
            let project_data_for_job = project_data_internal.params;

            JOB_TYPE.with(|job_types| {
                let job_types = job_types.borrow();
                if job_types.contains(&params.category) {
                    POST_JOB.with(|state| {
                        let mut state = state.borrow_mut();
                        let new_job = JobsInternal {
                            job_data: params,
                            timestamp: current_time,
                            project_name: project_data_for_job.project_name,
                            project_desc: project_data_for_job.project_description,
                            project_logo: project_data_for_job.project_logo,
                        };
                        state
                            .entry(principal_id)
                            .or_insert_with(Vec::new)
                            .push(new_job);
                        format!("Job Post added successfully at {}", current_time)
                    })
                } else {
                    "Choose correct job type".to_string()
                }
            })
        }
        None => "Error: Project not found.".to_string(),
    }
}

pub fn get_jobs_for_project(project_id: String) -> Vec<JobsInternal> {
    let mut jobs_for_project = Vec::new();

    POST_JOB.with(|jobs| {
        let jobs = jobs.borrow();

        for job_list in jobs.values() {
            for job in job_list {
                if job.job_data.project_id == project_id {
                    jobs_for_project.push(job.clone());
                }
            }
        }
    });
    jobs_for_project
}

// #[query]
// pub fn get_latest_jobs() -> Vec<Jobs> {

#[query]
pub fn get_all_jobs() -> Vec<JobsInternal> {
    let mut all_jobs = Vec::new();

    POST_JOB.with(|jobs| {
        let jobs = jobs.borrow();

        for job_list in jobs.values() {
            for job_internal in job_list {
                all_jobs.push(job_internal.clone());
            }
        }
    });

    all_jobs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

    all_jobs
}

#[query]
pub fn get_jobs_posted_by_project(project_id: String) -> Vec<JobsInternal> {
    let mut jobs_for_project = Vec::new();

    POST_JOB.with(|jobs| {
        let jobs = jobs.borrow();

        for job_list in jobs.values() {
            for job_internal in job_list {
                if job_internal.job_data.project_id == project_id {
                    jobs_for_project.push(job_internal.clone());
                }
            }
        }
    });

    jobs_for_project
}

#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct JobCategory {
    id: i32,
    name: String,
}

#[query]
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

#[update]
pub async fn send_money_access_request(project_id: String) -> String {
    let caller = caller();
    let mut has_pending_request = false;

    MONEY_ACCESS_REQUESTS.with(|requests| {
        let requests = requests.borrow();

        // Check if the caller exists in the HashMap
        if let Some(request_vec) = requests.get(&caller) {
            // Iterate through the Vec<AccessRequest> to find a matching and pending project_id request
            has_pending_request = request_vec
                .iter()
                .any(|request| request.project_id == project_id && request.status == "pending");
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
        request_type: "money_details_access".to_string(),
        status: "pending".to_string(),
    };

    // Add request to the MONEY_ACCESS_REQUESTS hashmap
    MONEY_ACCESS_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        requests
            .entry(caller)
            .or_insert_with(Vec::new)
            .push(access_request.clone());
    });

    // Create and send a notification for the request
    let notification_to_send = ProjectNotification {
        notification_type: ProjectNotificationType::AccessRequest(access_request.clone()), // Cloned to satisfy borrow checker
        timestamp: time(), // Assuming the existence of time() that returns u64 timestamp
    };

    PROJECT_ACCESS_NOTIFICATIONS.with(|notifications| {
        let mut notifications = notifications.borrow_mut();
        notifications
            .entry(project_id)
            .or_default()
            .push(notification_to_send);
    });

    "Your access request has been sent and is pending approval.".to_string()
}

// pub get_money_details_access()->String{

// }

#[update]
pub async fn send_private_docs_access_request(project_id: String) -> String {
    //sender
    let caller = caller();
    let mut has_pending_request = false;

    PRIVATE_DOCS_ACCESS_REQUESTS.with(|requests| {
        let requests = requests.borrow();

        // Check if the caller exists in the HashMap
        if let Some(request_vec) = requests.get(&caller) {
            // Iterate through the Vec<AccessRequest> to find a matching and pending project_id request
            has_pending_request = request_vec
                .iter()
                .any(|request| request.project_id == project_id && request.status == "pending");
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
    PRIVATE_DOCS_ACCESS_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        requests
            .entry(caller)
            .or_insert_with(Vec::new)
            .push(access_request.clone());
    });

    // Create and send a notification for the request
    let notification_to_send = ProjectNotification {
        notification_type: ProjectNotificationType::AccessRequest(access_request.clone()), // Cloned to satisfy borrow checker
        timestamp: time(), // Assuming the existence of time() that returns u64 timestamp
    };

    PROJECT_ACCESS_NOTIFICATIONS.with(|notifications| {
        let mut notifications = notifications.borrow_mut();
        notifications
            .entry(project_id)
            .or_default()
            .push(notification_to_send);
    });

    "Your access request has been sent and is pending approval.".to_string()
}

#[query]
pub fn get_all_pending_requests() -> Vec<ProjectNotification> {
    PROJECT_ACCESS_NOTIFICATIONS.with(|storage| {
        let projects = storage.borrow();
        projects
            .values()
            .flat_map(|notifications| {
                notifications.iter().filter_map(|notification| {
                    match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.status == "pending" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    }
                })
            })
            .collect()
    })
}

#[query]
pub fn get_all_declined_requests() -> Vec<ProjectNotification> {
    PROJECT_ACCESS_NOTIFICATIONS.with(|storage| {
        let projects = storage.borrow();
        projects
            .values()
            .flat_map(|notifications| {
                notifications.iter().filter_map(|notification| {
                    match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.status == "declined" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    }
                })
            })
            .collect()
    })
}

#[query]
pub fn get_all_approved_requests() -> Vec<ProjectNotification> {
    PROJECT_ACCESS_NOTIFICATIONS.with(|storage| {
        let projects = storage.borrow();
        projects
            .values()
            .flat_map(|notifications| {
                notifications.iter().filter_map(|notification| {
                    match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.status == "approved" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    }
                })
            })
            .collect()
    })
}

#[query]
pub fn get_pending_money_requestes(project_id: String) -> Vec<ProjectNotification> {
    PROJECT_ACCESS_NOTIFICATIONS.with(|storage| {
        let projects = storage.borrow();
        let project_info = projects.get(&project_id);
        let projects = project_info
            .expect("couldn't get project information")
            .clone();
        projects
    })
}

#[query]
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
    MONEY_ACCESS.with(|access| {
        let mut access = access.borrow_mut();
        access.entry(project_id).or_default().push(user);
    });
}

/// Adds a `Principal` to the list of approved users for a given project in the `PRIVATE_DOCS_ACCESS` hashmap.
fn add_user_to_private_docs_access(project_id: String, user: Principal) {
    PRIVATE_DOCS_ACCESS.with(|access| {
        let mut access = access.borrow_mut();
        access.entry(project_id).or_default().push(user);
    });
}

#[update]
pub async fn approve_money_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    MONEY_ACCESS_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        if let Some(request_vec) = requests.get_mut(&sender_id) {
            for request in request_vec.iter_mut() {
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
    PROJECT_ACCESS_NOTIFICATIONS.with(|notifications| {
        let mut notifications = notifications.borrow_mut();
        if let Some(notification_vec) = notifications.get_mut(&project_id) {
            for notification in notification_vec.iter_mut() {
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

#[update]
pub async fn approve_private_docs_access_request(
    project_id: String,
    sender_id: Principal,
) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    PRIVATE_DOCS_ACCESS_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        if let Some(request_vec) = requests.get_mut(&sender_id) {
            for request in request_vec.iter_mut() {
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
    PROJECT_ACCESS_NOTIFICATIONS.with(|notifications| {
        let mut notifications = notifications.borrow_mut();
        if let Some(notification_vec) = notifications.get_mut(&project_id) {
            for notification in notification_vec.iter_mut() {
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

#[query]
pub fn access_money_details(project_id: String) -> Result<MoneyRaised, CustomError> {
    let caller = ic_cdk::api::caller();

    let is_owner = APPLICATION_FORM.with(|app_form| {
        let app_details = app_form.borrow();

        app_details.iter().any(|(principal, projects)| {
            *principal == caller && projects.iter().any(|p| p.uid == project_id)
        })
    });

    // Check if the caller is approved to access the money details for this project
    let is_approved = is_owner
        || MONEY_ACCESS.with(|access| {
            access
                .borrow()
                .get(&project_id)
                .map_or(false, |principals| principals.contains(&caller))
        });

    if !is_approved {
        return Err(CustomError {
            message: "You do not have access to view the money details for this project."
                .to_string(),
            is_owner,
        });
    }

    APPLICATION_FORM.with(|projects_registry| {
        let projects = projects_registry.borrow();

        for project_list in projects.values() {
            if let Some(project) = project_list.iter().find(|p| p.uid == project_id) {
                return project.params.money_raised.clone().ok_or(CustomError {
                    message: "Money raised details not available for this project.".to_string(),
                    is_owner,
                });
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

#[query]
pub fn access_private_docs(project_id: String) -> Result<Vec<Docs>, CustomError> {
    let caller = ic_cdk::api::caller();

    let is_owner = APPLICATION_FORM.with(|app_form| {
        let app_details = app_form.borrow();

        app_details.iter().any(|(principal, projects)| {
            *principal == caller && projects.iter().any(|p| p.uid == project_id)
        })
    });

    let is_approved = is_owner
        || PRIVATE_DOCS_ACCESS.with(|access| {
            access
                .borrow()
                .get(&project_id)
                .map_or(false, |principals| principals.contains(&caller))
        });

    if !is_approved {
        return Err(CustomError {
            message: "You do not have access to view the private documents for this project."
                .to_string(),
            is_owner,
        });
    }

    APPLICATION_FORM.with(|projects_registry| {
        let projects = projects_registry.borrow();

        for project_list in projects.values() {
            if let Some(project) = project_list.iter().find(|p| p.uid == project_id) {
                return Ok(project.params.private_docs.clone().ok_or(CustomError {
                    message: "Private documents not available for this project.".to_string(),
                    is_owner,
                })?);
            }
        }

        Err(CustomError {
            message: "Project ID not found.".to_string(),
            is_owner,
        })
    })
}

#[update]
pub fn decline_money_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    MONEY_ACCESS_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        if let Some(request_vec) = requests.get_mut(&sender_id) {
            for request in request_vec.iter_mut() {
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
    PROJECT_ACCESS_NOTIFICATIONS.with(|notifications| {
        let mut notifications = notifications.borrow_mut();
        if let Some(notification_vec) = notifications.get_mut(&project_id) {
            for notification in notification_vec.iter_mut() {
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

#[update]
pub fn decline_private_docs_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in PRIVATE_DOCS_ACCESS_REQUESTS
    PRIVATE_DOCS_ACCESS_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        if let Some(request_vec) = requests.get_mut(&sender_id) {
            for request in request_vec.iter_mut() {
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
    PROJECT_ACCESS_NOTIFICATIONS.with(|notifications| {
        let mut notifications = notifications.borrow_mut();
        if let Some(notification_vec) = notifications.get_mut(&project_id) {
            for notification in notification_vec.iter_mut() {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "private_docs_access" =>
                    {
                        access_request.status = "declined".to_string();
                        break; // Exit after finding and updating the first matching request
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

#[update]
pub fn add_project_rating(ratings: ProjectRatingStruct) -> Result<String, String> {
    if check_project_exists(ratings.project_id.clone()) {
        let principal = caller(); // Assuming `caller()` correctly retrieves the principal of the caller
        let user_data = get_user_info().clone().unwrap();

        // Check if the current user has already submitted a review for this project
        let already_rated = PROJECT_RATING.with(|registry| {
            registry
                .borrow()
                .get(&ratings.project_id)
                .map_or(false, |reviews| {
                    reviews
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

        PROJECT_RATING.with(|registry| {
            registry
                .borrow_mut()
                .entry(ratings.project_id.clone())
                .or_insert_with(Vec::new)
                .push((principal, project_review));
        });

        Ok("Rating added".to_string())
    } else {
        Err("Project with ID does not exist.".to_string())
    }
}

#[query]
fn get_project_ratings(
    project_id: String,
) -> Result<(Option<Vec<(Principal, ProjectReview)>>, f32, bool), String> {
    let caller = caller(); // Assuming this retrieves the current user's principal
    PROJECT_RATING.with(|ratings| {
        let ratings = ratings.borrow();
        match ratings.get(&project_id) {
            Some(ratings) => {
                let total_ratings = ratings.len() as f32;
                if total_ratings == 0.0 {
                    // No ratings exist for the project
                    Ok((Some(vec![]), 0.0, false))
                } else {
                    let sum_ratings: u32 = ratings.iter().map(|(_, review)| review.rating).sum();
                    let average_rating = sum_ratings as f32 / total_ratings;
                    let caller_present = ratings.iter().any(|(principal, _)| principal == &caller);
                    Ok((Some(ratings.clone()), average_rating, caller_present))
                }
            }
            None => Err("No ratings found for the specified project ID.".to_string()),
        }
    })
}

pub fn get_type_of_registration() -> Vec<String>{
    vec![
        "Company".to_string(),
        "DAO".to_string()
    ]
}
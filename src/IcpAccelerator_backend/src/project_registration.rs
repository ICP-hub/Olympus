use crate::admin::*;
use crate::mentor::MentorProfile;
use crate::user_module::*;
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
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use serde_cbor::Value::Null;
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::Read;

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct TeamMember {
    member_uid: String,
    member_data: UserInformation,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfo {
    project_name: String,
    project_logo: Vec<u8>,
    preferred_icp_hub: Option<String>,
    live_on_icp_mainnet: Option<String>,
    money_raised_till_now: Option<String>,
    supports_multichain: Option<String>,
    project_elevator_pitch: Vec<u8>,
    project_area_of_focus: String,
    promotional_video: String,
    github_link: String,
    reason_to_join_incubator: String,
    project_description: String,
    project_cover: Vec<u8>,
    project_team: Option<TeamMember>,
    token_economics: String,
    technical_docs: String,
    long_term_goals: String,
    target_market: String,
    self_rating_of_project: f64,
    user_data: UserInformation,
    mentors_assigned: Option<Vec<MentorProfile>>,
    vc_assigned: Option<Vec<VentureCapitalist>>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoInternal {
    pub params: ProjectInfo,
    pub uid: String,
    pub is_active: bool,
    pub is_verified: bool,
    creation_date: u64,
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
pub struct Announcements {
    project_name: String,
    announcement_message: String,
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

pub type ProjectAnnouncements = HashMap<Principal, Vec<Announcements>>;
pub type Notifications = HashMap<Principal, Vec<NotificationProject>>;
pub type BlogPost = HashMap<Principal, Vec<Blog>>;

pub type ApplicationDetails = HashMap<Principal, Vec<ProjectInfoInternal>>;

pub type ProjectDetails = HashMap<Principal, ProjectInfoInternal>;

thread_local! {
    pub static APPLICATION_FORM: RefCell<ApplicationDetails> = RefCell::new(ApplicationDetails::new());
    pub static PROJECT_DETAILS: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());
    pub static NOTIFICATIONS: RefCell<Notifications> = RefCell::new(Notifications::new());
    static OWNER_NOTIFICATIONS: RefCell<HashMap<Principal, Vec<NotificationForOwner>>> = RefCell::new(HashMap::new());
    pub static PROJECT_ANNOUNCEMENTS:RefCell<ProjectAnnouncements> = RefCell::new(ProjectAnnouncements::new());
    pub static BLOG_POST:RefCell<BlogPost> = RefCell::new(BlogPost::new());
    pub static PROJECT_AWAITS_RESPONSE: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());
    pub static DECLINED_PROJECT_REQUESTS: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());
}

pub fn pre_upgrade() {
    // Serialize and write data to stable storage
    APPLICATION_FORM.with(|forms| {
        let serialized = bincode::serialize(&*forms.borrow()).expect("Serialization failed");
        let mut writer = StableWriter::default();
        writer
            .write(&serialized)
            .expect("Failed to write to stable storage");
    });
}

// pub fn post_upgrade() {
//     // Read and deserialize data from stable storage
//     let mut reader = StableReader::default();
//     let mut data = Vec::new();
//     reader
//         .read_to_end(&mut data)
//         .expect("Failed to read from stable storage");
//     let project_registry: ApplicationDetails = bincode::deserialize(&data).expect("Deserialization failed");
//     // Restore data
//     APPLICATION_FORM.with(|registry| {
//         *registry.borrow_mut() = project_registry;
//     });
// }

pub async fn create_project(info: ProjectInfo) -> String {
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
        ic_cdk::println!("You cant create more than one project");
        return "You cant create more than one project".to_string();
    }

    ROLE_STATUS_ARRAY.with(|role_status| {
        let mut role_status = role_status.borrow_mut();

        for role in role_status
            .get_mut(&caller)
            .expect("couldn't get role status for this principal")
            .iter_mut()
        {
            if role.name == "project" {
                role.status = "requested".to_string();
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
            await_ers.insert(caller, new_project);
        },
    );

    let res = send_approval_request().await;

    format!("{}", res)
}

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

pub fn list_all_projects() -> Vec<ProjectInfo> {
    let projects = APPLICATION_FORM.with(|storage| {
        storage
            .borrow()
            .values()
            .flat_map(|project_internals| {
                project_internals
                    .iter()
                    .map(|project_internal| project_internal.params.clone())
            })
            .collect::<Vec<ProjectInfo>>()
    });

    ic_cdk::println!("Listing all projects: {:?}", projects);
    projects
}

pub fn update_project(project_id: String, updated_project: ProjectInfo) -> String {
    let caller = caller();
    let mut is_updated = false;

    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project_internal) = projects.iter_mut().find(|p| p.uid == project_id) {
                // Update fields directly
                project_internal.params.project_name = updated_project.project_name;
                project_internal.params.project_logo = updated_project.project_logo;
                project_internal.params.preferred_icp_hub = updated_project.preferred_icp_hub;
                project_internal.params.live_on_icp_mainnet = updated_project.live_on_icp_mainnet;
                project_internal.params.money_raised_till_now =
                    updated_project.money_raised_till_now;
                project_internal.params.supports_multichain = updated_project.supports_multichain;
                project_internal.params.project_elevator_pitch =
                    updated_project.project_elevator_pitch;
                project_internal.params.project_area_of_focus =
                    updated_project.project_area_of_focus;
                project_internal.params.promotional_video = updated_project.promotional_video;

                project_internal.params.github_link = updated_project.github_link;
                project_internal.params.reason_to_join_incubator =
                    updated_project.reason_to_join_incubator;

                project_internal.params.project_description = updated_project.project_description;
                project_internal.params.project_cover = updated_project.project_cover;

                project_internal.params.project_team = updated_project.project_team;
                project_internal.params.token_economics = updated_project.token_economics;
                project_internal.params.technical_docs = updated_project.technical_docs;
                project_internal.params.long_term_goals = updated_project.long_term_goals;
                project_internal.params.target_market = updated_project.target_market;
                project_internal.params.self_rating_of_project =
                    updated_project.self_rating_of_project;

                is_updated = true;
            }
        }
    });

    if is_updated {
        "Project Details are Updated Successfully".to_string()
    } else {
        "Failed to update project. Please provide a valid project ID.".to_string()
    }
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

pub fn verify_project(project_id: &str) -> String {
    let verifier_info = hub_organizer::get_hub_organizer();

    match verifier_info {
        Some(info) => {
            let mut project_found = false;

            APPLICATION_FORM.with(|projects| {
                let mut projects = projects.borrow_mut();
                for project_internal in projects.values_mut().flat_map(|v| v.iter_mut()) {
                    if project_internal.uid == project_id {
                        project_internal.is_verified = true;
                        project_found = true;
                        break;
                    }
                }
            });

            if project_found {
                NOTIFICATIONS.with(|notifications| {
                    let mut notifications = notifications.borrow_mut();
                    if let Some(notification) = notifications
                        .values_mut()
                        .flat_map(|n| n.iter_mut())
                        .find(|n| n.project_id == project_id)
                    {
                        notification.notification_verifier = NotificationVerifier {
                            name: info
                                .hubs
                                .full_name
                                .clone()
                                .unwrap_or_else(|| "Default Name".to_string()),
                            image: info.hubs.profile_picture.clone().unwrap_or_else(|| vec![]),
                        };
                    }
                });
            }

            "Project verified successfully.".to_string()
        }
        None => "Verifier information could not be retrieved.".to_string(),
    }
}

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

pub async fn update_team_member(project_id: &str, member_uid: String) -> String {
    let user_info_result = crate::user_module::get_user_info_by_id(member_uid.clone()).await;

    let user_info = match user_info_result {
        Ok(info) => info,
        Err(err) => return format!("Failed to retrieve user info: {}", err),
    };

    let mut project_found = false;
    let mut member_updated = false;
    APPLICATION_FORM.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(project_internal) = storage
            .values_mut()
            .flat_map(|v| v.iter_mut())
            .find(|p| p.uid == project_id)
        {
            project_found = true;
            project_internal.params.project_team = Some(TeamMember {
                member_uid: member_uid.clone(),
                member_data: user_info,
            });
            member_updated = true;
        }
    });
    match (project_found, member_updated) {
        (true, true) => "Team member updated successfully.".to_string(),
        (true, false) => "Failed to update the team member in the specified project.".to_string(),
        _ => "Project not found.".to_string(),
    }
}

#[update]
pub fn add_announcement(mut announcement_details: Announcements) -> String {
    let caller_id = caller();

    let current_time = time();

    PROJECT_ANNOUNCEMENTS.with(|state| {
        let mut state = state.borrow_mut();
        announcement_details.timestamp = current_time;
        state
            .entry(caller_id)
            .or_insert_with(Vec::new)
            .push(announcement_details);
        format!("Announcement added successfully at {}", current_time)
    })
}

//for testing purpose
#[query]
pub fn get_announcements() -> HashMap<Principal, Vec<Announcements>> {
    PROJECT_ANNOUNCEMENTS.with(|state| {
        let state = state.borrow();
        state.clone()
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

                let money_raised_match = criteria.money_raised_range.map_or(true, |(min, max)| {
                    if let Some(money_raised_str) = &project_internal.params.money_raised_till_now {
                        if let Ok(money_raised) = money_raised_str.parse::<f64>() {
                            return money_raised >= min && money_raised <= max;
                        }
                    }
                    false
                });

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
                    && money_raised_match
                    && mentor_match
                    && vc_match
            })
            .map(|project_internal| project_internal.params.clone())
            .collect()
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

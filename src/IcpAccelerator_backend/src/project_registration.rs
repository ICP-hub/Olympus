use crate::user_module::UserInformation;
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
pub struct SocialLinksInfo {
    twitter: Option<String>,
    linkedin: Option<String>,
    facebook: Option<String>,
}

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
    social_links: SocialLinksInfo,
    reason_to_join_incubator: String,
    project_description: String,
    project_cover: Vec<u8>,
    creation_date: String,
    project_team: Option<TeamMember>,
    token_economics: String,
    technical_docs: String,
    long_term_goals: String,
    target_market: String,
    self_rating_of_project: f64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoInternal {
    pub params: ProjectInfo,
    pub uid: String,
    pub is_active: bool,
    pub is_verified: bool,
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
pub type ProjectAnnouncements = HashMap<Principal, Vec<Announcements>>;
pub type Notifications = HashMap<Principal, Vec<NotificationProject>>;
pub type BlogPost = HashMap<Principal, Vec<Blog>>;

pub type ApplicationDetails = HashMap<Principal, Vec<ProjectInfoInternal>>;

thread_local! {
    pub static APPLICATION_FORM: RefCell<ApplicationDetails> = RefCell::new(ApplicationDetails::new());
    pub static NOTIFICATIONS: RefCell<Notifications> = RefCell::new(Notifications::new());
    static OWNER_NOTIFICATIONS: RefCell<HashMap<Principal, Vec<NotificationForOwner>>> = RefCell::new(HashMap::new());
    pub static PROJECT_ANNOUNCEMENTS:RefCell<ProjectAnnouncements> = RefCell::new(ProjectAnnouncements::new());
    pub static BLOG_POST:RefCell<BlogPost> = RefCell::new(BlogPost::new());
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
    let founder_info = get_founder_info();

    let (name, image) = match founder_info {
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

    let noti_sender = NotificationSender {
        name: name.unwrap_or_else(|| "Unknown Founder".to_string()),
        image: image.unwrap_or_else(|| vec![]),
    };

    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    let new_project = ProjectInfoInternal {
        params: info.clone(),
        uid: new_id,
        is_active: true,
        is_verified: false,
    };
    APPLICATION_FORM.with(|storage| {
        let mut applications = storage.borrow_mut();
        applications
            .entry(caller)
            .or_insert_with(Vec::new)
            .push(new_project);
    });

    if let Some(region) = &info.preferred_icp_hub {
        let hub_principals =
            crate::hub_organizer::get_hub_organizer_principals_by_region(region.clone());
        let noti_uuids = raw_rand().await.unwrap().0;
        let noti_uid = format!("{:x}", Sha256::digest(&noti_uuids));
        let noti_id = noti_uid.clone().to_string();
        for hub_principal_str in hub_principals {
            match Principal::from_text(&hub_principal_str) {
                Ok(hub_principal) => {
                    let notification = NotificationProject {
                        notifiation_id: noti_id.clone(),
                        project_id: uid.clone(),
                        message: "SomeOne Created Project Under your Hub".to_string(),
                        timestamp: time(),
                        notification_sender: noti_sender.clone(),
                        notification_verifier: NotificationVerifier {
                            name: "".to_string(),
                            image: vec![],
                        },
                    };

                    NOTIFICATIONS.with(|notifications| {
                        let mut notifs = notifications.borrow_mut();
                        notifs
                            .entry(hub_principal)
                            .or_insert_with(Vec::new)
                            .push(notification);
                    });
                }
                Err(_) => {
                    "Recieved an Invalid Princicpal".to_string();
                }
            }
        }
    }

    format!("Project Created successfully with ID: {}", uid)
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
                project_internal.params.social_links = updated_project.social_links;
                project_internal.params.reason_to_join_incubator =
                    updated_project.reason_to_join_incubator;
                project_internal.params.project_description = updated_project.project_description;
                project_internal.params.project_cover = updated_project.project_cover;
                project_internal.params.creation_date = updated_project.creation_date;
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

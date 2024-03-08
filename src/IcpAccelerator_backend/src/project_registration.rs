use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ic_cdk::api::stable::{StableReader, StableWriter};
use std::cell::RefCell;
use bincode::{self, DefaultOptions, Options};
use ic_cdk::api::management_canister::main::raw_rand;
use sha2::{Digest, Sha256};
use std::io::Read;
use ic_cdk::api::time;
use serde_cbor::Value::Null;

use crate::{register_user::{get_founder_info, self}, hub_organizer};


#[derive(Serialize, Deserialize, Clone, Debug, CandidType,PartialEq)]
pub struct DocsInfo {
    pitch_deck: Option<String>,
    white_paper: Option<String>,
    technical_docs: Option<String>,
    tokenomics: Option<String>,
}


#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct SocialLinksInfo {
    twitter: Option<String>,
    linkedin: Option<String>,
    facebook: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct TeamMember {
    member_image: Option<Vec<u8>>,
    member_name: Option<String>,
    member_role: Option<String>,
    social_links: Option<SocialLinksInfo>,
    member_username: Option<String>,
}


#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ThirtyInfoProject{
    project_name: Option<String>,
    project_logo: Option<Vec<u8>>,
    project_cover: Option<Vec<u8>>,
    project_area_of_focus: Option<String>,
    project_description: Option<String>,
    project_url: Option<String>,
    social_links: Option<SocialLinksInfo>,
    preferred_icp_hub: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct SeventyInfoProject{
    tags: Option<String>,
    project_creation_date: Option<String>,
    technology_stack: Option<String>,
    video_link: Option<String>,
    development_stage: Option<String>,
    docs: Option<DocsInfo>,
    team: Option<Vec<TeamMember>>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfo {
    thirty_info: Option<ThirtyInfoProject>,
    seventy_info: Option<SeventyInfoProject>,
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
pub struct NotificationSender{
    name: String,
    image: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct NotificationVerifier{
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

pub type Notifications = HashMap<Principal, Vec<NotificationProject>>;


pub type ApplicationDetails = HashMap<Principal, Vec<ProjectInfoInternal>>;

thread_local! {
    pub static APPLICATION_FORM: RefCell<ApplicationDetails> = RefCell::new(ApplicationDetails::new());
    pub static NOTIFICATIONS: RefCell<Notifications> = RefCell::new(Notifications::new());
    static OWNER_NOTIFICATIONS: RefCell<HashMap<Principal, Vec<NotificationForOwner>>> = RefCell::new(HashMap::new());
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

pub async fn create_project(thirty_info: ThirtyInfoProject)-> String {

    let caller = caller();
    let founder_info = get_founder_info();

    let (name, image) = match founder_info {
        Some(info) => {
            let name = info.thirty_info.as_ref().and_then(|thirty_info| thirty_info.full_name.clone());
            let image = info.seventy_info.as_ref().and_then(|seventy_info| seventy_info.founder_image.clone());
            (name, image)
        },
        None => (None, None),
    };

    let noti_sender = NotificationSender {
        name: name.unwrap_or_else(|| "Unknown Founder".to_string()), 
        image: image.unwrap_or_else(|| vec![]), 
    };

    let uuids = raw_rand().await.unwrap().0; 
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    let thirty_info_clone = thirty_info.clone();
    let project = ProjectInfo{
        thirty_info: Some(thirty_info),
        seventy_info: None,
    };

    let new_project = ProjectInfoInternal{
        params:project,
        uid: new_id,
        is_active: true,
        is_verified: false,
    };
    APPLICATION_FORM.with(|storage| {
        let mut applications = storage.borrow_mut();
        applications.entry(caller).or_insert_with(Vec::new).push(new_project);
    });

    if let Some(region) = &thirty_info_clone.preferred_icp_hub {
        let hub_principals = crate::hub_organizer::get_hub_organizer_principals_by_region(region.clone());
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
                        notification_verifier: NotificationVerifier { name: "".to_string(), image: vec![] },
                    };

                    NOTIFICATIONS.with(|notifications| {
                        let mut notifs = notifications.borrow_mut();
                        notifs.entry(hub_principal).or_insert_with(Vec::new).push(notification);
                    });
                },
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
            founder_projects.iter().map(|project_internal| project_internal.params.clone()).collect()
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
        storage.borrow().values()
            .flat_map(|project_internals| project_internals.iter().map(|project_internal| project_internal.params.clone()))
            .collect::<Vec<ProjectInfo>>()
    });

    ic_cdk::println!("Listing all projects: {:?}", projects);
    projects
}

pub fn update_project_docs(project_id: String, docs: DocsInfo)->String {
    let caller = caller();
    let mut is_updated = false;
    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project_internal) = projects.iter_mut().find(|p| p.uid == project_id) {
                if let Some(seventy_info) = &mut project_internal.params.seventy_info {
                    seventy_info.docs = Some(docs);
                }
                is_updated = true;
            }
        }
    });
    if is_updated{
        "Document Details are Updated Successfully".to_string()
    }else{
        "Please Provide valid Project Id".to_string()
    }
}

pub fn update_team_member(project_id: String, team_member: TeamMember) ->String {
    let caller = caller();
    let mut is_updated = false;
    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project_internal) = projects.iter_mut().find(|p| p.uid == project_id) {
                if let Some(seventy_info) = &mut project_internal.params.seventy_info {
                    if seventy_info.team.is_none() {
                        seventy_info.team = Some(Vec::new());
                    }
                    let team = seventy_info.team.as_mut().unwrap();
                    match team.iter_mut().find(|m| m.member_username == team_member.member_username) {
                        Some(existing_member) => *existing_member = team_member,
                        None => team.push(team_member),
                    }
                    is_updated = true;
                }
            }
        }
    });
    if is_updated{
            "Team Member Details are Updated Successfully".to_string()
        }else{
            "Please Provide valid Project Id".to_string()
        }
}





pub fn update_project(project_id: String, updated_project: ProjectInfo)->String {
    let caller = caller();
    let mut is_updated = true;
    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project_internal) = projects.iter_mut().find(|p| p.uid == project_id) {
                if let Some(ref mut thirty_info) = project_internal.params.thirty_info {
                    if let Some(updated_thirty_info) = &updated_project.thirty_info {
                        thirty_info.project_name = updated_thirty_info.project_name.clone().or(thirty_info.project_name.clone());
                        thirty_info.project_logo = updated_thirty_info.project_logo.clone().or(thirty_info.project_logo.clone());
                        thirty_info.project_cover = updated_thirty_info.project_cover.clone().or(thirty_info.project_cover.clone());
                        thirty_info.project_area_of_focus = updated_thirty_info.project_area_of_focus.clone().or(thirty_info.project_area_of_focus.clone());
                        thirty_info.project_description = updated_thirty_info.project_description.clone().or(thirty_info.project_description.clone());
                        thirty_info.project_url = updated_thirty_info.project_url.clone().or(thirty_info.project_url.clone());
                    }
                }
                if let Some(ref mut seventy_info) = project_internal.params.seventy_info {
                    if let Some(updated_seventy_info) = &updated_project.seventy_info {
                        seventy_info.tags = updated_seventy_info.tags.clone().or(seventy_info.tags.clone());
                        seventy_info.project_creation_date = updated_seventy_info.project_creation_date.clone().or(seventy_info.project_creation_date.clone());
                        seventy_info.technology_stack = updated_seventy_info.technology_stack.clone().or(seventy_info.technology_stack.clone());
                        seventy_info.video_link = updated_seventy_info.video_link.clone().or(seventy_info.video_link.clone());
                        seventy_info.development_stage = updated_seventy_info.development_stage.clone().or(seventy_info.development_stage.clone());
                    }
                }
                is_updated = true;
            }
        }
    });
    if is_updated{
        "Project Details are Updated Successfully".to_string()
    }else{
        "Please Provide valid Input".to_string()
    }
}



pub fn delete_project(id: String)->std::string::String {
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
    if is_found{
        "Project Status Set To Inactive".to_string()
    }else{
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
                    if let Some(notification) = notifications.values_mut().flat_map(|n| n.iter_mut()).find(|n| n.project_id == project_id) {
                        notification.notification_verifier = NotificationVerifier {
                            name: info.hubs.full_name.clone().unwrap_or_else(|| "Default Name".to_string()),
                            image: info.hubs.profile_picture.clone().unwrap_or_else(|| vec![]),
                        };
                    }
                });
            }
            
            "Project verified successfully.".to_string()
        },
        None => "Verifier information could not be retrieved.".to_string(),
    }
}

pub fn get_notifications_for_caller() -> Vec<NotificationProject> {
    let hub_principal = caller(); 

    NOTIFICATIONS.with(|notifications| {
        notifications.borrow()
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
            let name = info.thirty_info.as_ref().and_then(|thirty_info| thirty_info.full_name.clone());
            let image = info.seventy_info.as_ref().and_then(|seventy_info| seventy_info.founder_image.clone());
            (name, image)
        },
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
            notifications.borrow_mut().entry(project_owner_principal).or_insert_with(Vec::new).push(notification);
        });
        "Notification sent successfully.".to_string()
    } else {
        "Project owner not found.".to_string()
    }
}

pub fn get_notifications_for_owner() -> Vec<NotificationForOwner> {
    let owner_principal = caller(); 
    
    OWNER_NOTIFICATIONS.with(|notifications| {
        notifications.borrow()
            .get(&owner_principal)
            .cloned()
            .unwrap_or_else(Vec::new) 
    })
}
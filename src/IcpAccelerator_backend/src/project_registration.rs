use crate::admin::*;
use crate::mentor::MentorProfile;

use crate::user_module::*;

use crate::ratings::RatingSystem;
use crate::roadmap_suggestion::Suggestion;
use crate::user_module::UserInformation;

use crate::admin::send_approval_request;
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
    pub member_uid: String,
    pub member_data: UserInformation,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Jobs {
    title: String,
    description: String,
    opportunity: String,
    link: String,
    project_id: String,
    timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfo {
    pub project_name: String,
    pub project_logo: Vec<u8>,
    pub preferred_icp_hub: Option<String>,
    pub live_on_icp_mainnet: Option<String>,
    pub money_raised_till_now: Option<bool>,
    pub supports_multichain: Option<String>,
    pub project_elevator_pitch: Option<String>,
    pub project_area_of_focus: String,
    pub promotional_video: Option<String>,
    pub github_link: Option<String>,
    pub reason_to_join_incubator: String,
    pub project_description: String,
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
    pub icp_grants: Option<String>,
    pub investors: Option<String>,
    pub sns: Option<String>,
    pub raised_from_other_ecosystem: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoForUser {
    pub date_of_joining: Option<u64>,
    pub mentor_associated: Option<Vec<MentorProfile>>,
    pub vc_associated: Option<Vec<VentureCapitalist>>,
    pub team_member_info: Option<Vec<TeamMember>>,
    pub announcements: HashMap<Principal, Vec<Announcements>>,
    pub reviews: Vec<Suggestion>,
    pub website_social_group: Option<String>,
    pub live_link_of_project: Option<String>,
    pub jobs_opportunity: Option<Vec<Jobs>>,
    pub area_of_focus: Option<String>,
    pub country_of_project: Option<String>,
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

#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
pub struct ProjectUpdateRequest {
    project_id: String,
    pub updated_info: ProjectInfo,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
pub struct ProjectVecWithRoles {
    pub project_profile: Vec<ProjectInfoInternal>,
    pub roles: Vec<Role>,
}

pub type ProjectAnnouncements = HashMap<Principal, Vec<Announcements>>;
pub type Notifications = HashMap<Principal, Vec<NotificationProject>>;
pub type BlogPost = HashMap<Principal, Vec<Blog>>;

pub type ApplicationDetails = HashMap<Principal, Vec<ProjectInfoInternal>>;
pub type PendingDetails = HashMap<String, ProjectUpdateRequest>;
pub type DeclinedDetails = HashMap<String, ProjectUpdateRequest>;

pub type ProjectDetails = HashMap<Principal, ProjectInfoInternal>;
pub type JobDetails = HashMap<Principal, Vec<Jobs>>;

thread_local! {
    pub static  APPLICATION_FORM: RefCell<ApplicationDetails> = RefCell::new(ApplicationDetails::new());
    pub static PROJECT_DETAILS: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());
    pub static NOTIFICATIONS: RefCell<Notifications> = RefCell::new(Notifications::new());
    static OWNER_NOTIFICATIONS: RefCell<HashMap<Principal, Vec<NotificationForOwner>>> = RefCell::new(HashMap::new());
    pub static PROJECT_ANNOUNCEMENTS:RefCell<ProjectAnnouncements> = RefCell::new(ProjectAnnouncements::new());
    pub static BLOG_POST:RefCell<BlogPost> = RefCell::new(BlogPost::new());

    pub static PROJECT_AWAITS_RESPONSE: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());
    pub static DECLINED_PROJECT_REQUESTS: RefCell<ProjectDetails> = RefCell::new(ProjectDetails::new());

    pub static PENDING_PROJECT_UPDATES: RefCell<PendingDetails> = RefCell::new(PendingDetails::new());
    pub static DECLINED_PROJECT_UPDATES: RefCell<DeclinedDetails> = RefCell::new(DeclinedDetails::new());
    pub static POST_JOB: RefCell<JobDetails> = RefCell::new(JobDetails::new());
    pub static JOB_TYPE: RefCell<Vec<String>> = RefCell::new(vec!["Bounty".to_string(),"Job".to_string()]);

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
    let res = send_approval_request(
        info.user_data.profile_picture.unwrap_or_else(|| Vec::new()),
        info.user_data.full_name,
        info.user_data.country,
        info.project_area_of_focus,
        "project".to_string(),
    )
    .await;

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

pub fn list_all_projects() -> HashMap<Principal, ProjectVecWithRoles> {
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

    let update_request = ProjectUpdateRequest {
        updated_info: updated_project.clone(),
        project_id: project_id.clone(),
    };

    PENDING_PROJECT_UPDATES.with(
        |awaiters: &RefCell<HashMap<String, ProjectUpdateRequest>>| {
            let mut await_ers: std::cell::RefMut<'_, HashMap<String, ProjectUpdateRequest>> =
                awaiters.borrow_mut();
            await_ers.insert(project_id, update_request.clone());
        },
    );

    let res = send_approval_request(
        updated_project
            .user_data
            .profile_picture
            .unwrap_or_else(|| Vec::new()),
        updated_project.user_data.full_name,
        updated_project.user_data.country,
        updated_project.project_area_of_focus,
        "project".to_string(),
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
pub fn get_project_info_for_user(project_id: String) -> Option<ProjectInfoForUser> {
    let announcements_project = get_announcements();
    let project_reviews = crate::roadmap_suggestion::get_suggestions_by_status(
        project_id.clone(),
        "In Progress".to_string(),
    );
    let jobs_opportunity_posted = get_jobs_for_project(project_id.clone());

    APPLICATION_FORM.with(|storage| {
        let projects = storage.borrow();

        projects
            .iter()
            .flat_map(|(_, project_list)| project_list.iter())
            .find(|project_internal| project_internal.uid == project_id)
            .map(|project_internal| ProjectInfoForUser {
                date_of_joining: Some(project_internal.creation_date),
                mentor_associated: project_internal.params.mentors_assigned.clone(),
                vc_associated: project_internal.params.vc_assigned.clone(),
                team_member_info: project_internal.params.project_team.clone(),
                announcements: announcements_project,
                reviews: project_reviews,
                website_social_group: project_internal.params.project_discord.clone(),
                live_link_of_project: project_internal.params.live_on_icp_mainnet.clone(),
                jobs_opportunity: Some(jobs_opportunity_posted),
                area_of_focus: Some(project_internal.params.project_area_of_focus.clone()),
                country_of_project: project_internal.params.preferred_icp_hub.clone(),
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

pub fn get_dummy_team_member() -> TeamMember {
    TeamMember {
        member_uid: "TM123456".to_string(),
        member_data: get_dummy_user_information(),
    }
}

fn get_dummy_user_information() -> UserInformation {
    UserInformation {
        full_name: "Jane Doe".to_string(),
        profile_picture: Some(vec![0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), // Example binary data for an image
        email: Some("janedoe@example.com".to_string()),
        country: "Nowhereland".to_string(),
        telegram_id: Some("janedoe_telegram".to_string()),
        bio: Some("An enthusiastic explorer of new technologies.".to_string()),
        area_of_intrest: "Artificial Intelligence".to_string(),
        twitter_id: Some("@janedoeAI".to_string()),
        openchat_username: Some("janedoeChat".to_string()),
    }
}

pub fn get_dummy_mentor_profile() -> MentorProfile {
    MentorProfile {
        preferred_icp_hub: Some("Example Hub".to_string()),
        user_data: get_dummy_user_information(), // This function should be defined as previously shown
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Example Portfolio".to_string()),
        icop_hub_or_spoke: false,
        category_of_mentoring_service: "Technology and Innovation".to_string(),
        linkedin_link: "https://example-social-link.com".to_string(),
        multichain: Some("Example Multichain".to_string()),
        years_of_mentoring: "5 years".to_string(),
        website: "https://example-mentor-website.com".to_string(),
        area_of_expertise: "Blockchain Technology".to_string(),
        reason_for_joining: "To share knowledge and experiences with budding entrepreneurs"
            .to_string(),
        hub_owner: Some("icp india".to_string()),
    }
}

pub fn get_dummy_venture_capitalist() -> VentureCapitalist {
    VentureCapitalist {
        name_of_fund: "Example VC Fund".to_string(),
        fund_size: 100_000_000.0, // Example fund size in USD
        assets_under_management: "500_000_000 USD".to_string(),
        logo: Some(vec![0, 1, 2, 3, 4, 5]), // Simulated binary data for a logo
        registered_under_any_hub: Some(true),
        average_check_size: 1_000_000.0, // Example check size in USD
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0), // Example money invested in USD
        existing_icp_portfolio: Some("Example Portfolio".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Yes".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: "To find promising startups".to_string(),
        preferred_icp_hub: "Example Hub".to_string(),
        investor_type: "Angel Investor".to_string(),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://example-portfolio-link.com".to_string(),
        announcement_details: Some("New funding round opened".to_string()),
        user_data: get_dummy_user_information(),
        website_link: "hfdfdfdf".to_string(),
        linkedin_link: "dfdfdfdf".to_string(), // Generate dummy user information
    }
}

pub fn get_dummy_announcements() -> Announcements {
    Announcements {
        project_name: "Project X".to_string(),
        announcement_message: "We are thrilled to announce the launch of Project X, set to revolutionize the industry!".to_string(),
        timestamp: 1672522562, // Example timestamp in Unix time format
    }
}

pub fn get_dummy_suggestion() -> Suggestion {
    Suggestion {
        id: 1, // Example ID
        content: "This project could benefit from more robust testing strategies.".to_string(),
        status: "Pending Review".to_string(),
        project_id: "ProjectX123".to_string(),
        parent_id: None, // or Some(id) if you want to simulate a response to another suggestion
    }
}

pub fn get_dummy_jon_opportunity() -> Jobs {
    Jobs {
        title: ("Example Job Title".to_string()),
        description: ("This Job Is For Testing Purpose".to_string()),
        opportunity: ("Software Developer".to_string()),
        link: ("test link".to_string()),
        project_id: ("Testing Project Id".to_string()),
        timestamp: (time()),
    }
}

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
pub fn post_job(
    title: String,
    description: String,
    opportunity: String,
    link: String,
    project_id: String,
) -> String {
    let principal_id = caller();
    let is_owner = APPLICATION_FORM.with(|projects| {
        projects.borrow().iter().any(|(owner_principal, projects)| {
            *owner_principal == principal_id && projects.iter().any(|p| p.uid == project_id)
        })
    });

    if !is_owner {
        return "Error: Only the project owner can request updates.".to_string();
    }
    let current_time = time();

    JOB_TYPE.with(|job_types| {
        let job_types = job_types.borrow();
        if job_types.contains(&opportunity) {
            POST_JOB.with(|state| {
                let mut state = state.borrow_mut();
                let new_blog = Jobs {
                    link: link,
                    title: title,
                    timestamp: current_time,
                    description: description,
                    project_id: project_id,
                    opportunity: opportunity,
                };
                state
                    .entry(principal_id)
                    .or_insert_with(Vec::new)
                    .push(new_blog);
                format!("Job Post added successfully at {}", current_time)
            })
        } else {
            return "Choose correct job type".to_string();
        }
    })
}


pub fn get_jobs_for_project(project_id: String) -> Vec<Jobs> {
    let mut jobs_for_project = Vec::new();

    POST_JOB.with(|jobs| {
        let jobs = jobs.borrow();

        for job_list in jobs.values() {
            for job in job_list {
                if job.project_id == project_id {
                    jobs_for_project.push(job.clone());
                }
            }
        }
    });

    jobs_for_project
}

#[query]
pub fn get_jobs_posted_by_project(project_id: String) -> Vec<Jobs>{

    POST_JOB.with(|jobs| {
        if let Some(job_list) = jobs.borrow().get(&caller()) {
            
            let mut project_jobs: Vec<&Jobs> = job_list
                .iter()
                .filter(|job| job.project_id == project_id)
                .collect();

            project_jobs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

            project_jobs.into_iter().take(6).cloned().collect()
        }else{
            Vec::new()
        }
    })
}

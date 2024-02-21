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



#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
pub struct ProjectInfo {
    id: Option<String>, // Assuming 'id' field is generated here
    project_name: Option<String>,
    project_logo: Option<String>,
    project_cover: Option<Vec<u8>>,
    project_area_of_focus: Option<AreaOfFocus>,
    project_description: Option<String>,
    project_url: Option<String>,
    social_links: Option<SocialLinksInfo>,
    tags: Option<String>,
    project_creation_date: Option<String>,
    technology_stack: Option<String>,
    video_link: Option<String>,
    development_stage: Option<String>,
    docs: Option<DocsInfo>,
    team: Option<Vec<TeamMember>>,
    is_active: Option<bool>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
pub struct DocsInfo {
    pitch_deck: Option<String>,
    white_paper: Option<String>,
    technical_docs: Option<String>,
    tokenomics: Option<String>,
}


#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
pub struct SocialLinksInfo {
    twitter: Option<String>,
    linkedin: Option<String>,
    facebook: Option<String>,
    // Add more social links as needed
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
pub struct TeamMember {
    member_image: Option<Vec<u8>>,
    member_name: Option<String>,
    member_role: Option<String>,
    social_links: Option<SocialLinksInfo>,
    member_username: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq, Eq, Hash)]
pub enum AreaOfFocus {
    DeFi,
    Tooling,
    NFTs,
    Infrastructure,
    DAO,
    Social,
    Games,
    Other,
    MetaVerse,
}

pub type ApplicationDetails = HashMap<Principal, Vec<ProjectInfo>>;

thread_local! {
    pub static APPLICATION_FORM: RefCell<ApplicationDetails> = RefCell::new(ApplicationDetails::new());
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

pub async fn create_project(params: ProjectInfo)-> String {

    // Generate a unique ID for the project
    let uuids = raw_rand().await.unwrap().0; // Note: In production, handle errors properly
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    let caller = caller();
    let new_project = ProjectInfo{
        id: Some(new_id),
        project_name: params.project_name,
        project_logo: params.project_logo,
        project_cover: params.project_cover,
        project_area_of_focus: params.project_area_of_focus.clone(),
        project_description: params.project_description,
        project_url: params.project_url,
        social_links: params.social_links,
        tags: None,
        project_creation_date: None,
        technology_stack: None,
        video_link: None,
        development_stage: None,
        docs: None,
        team: None,
        is_active: Some(true),
    };
    APPLICATION_FORM.with(|storage| {
        let mut applications = storage.borrow_mut();
        applications.entry(caller).or_insert_with(Vec::new).push(new_project);
    });
    format!("Project Created successfully with ID: {}", uid)
}


pub fn get_projects_for_caller() -> Vec<ProjectInfo> {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        storage.borrow().get(&caller).cloned().unwrap_or_else(Vec::new)
    })
}







pub fn list_all_projects() -> Vec<ProjectInfo> {
    let projects = APPLICATION_FORM.with(|storage| {
        storage.borrow().values()
            .flat_map(|projects| projects.iter().cloned())
            .collect::<Vec<ProjectInfo>>()
    });

    ic_cdk::println!("Listing all projects: {:?}", projects);
    projects
}

pub fn update_project_docs(project_id: String, docs: DocsInfo) {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project) = projects.iter_mut().find(|p| p.id.as_ref() == Some(&project_id)) {
                project.docs = Some(docs);
            }
        }
    });
}

pub fn update_team_member(project_id: String, team_member: TeamMember) {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project) = projects.iter_mut().find(|p| p.id.as_ref() == Some(&project_id)) {
                match project.team {
                    Some(ref mut team) => {
                        if let Some(existing_member) = team.iter_mut().find(|m| m.member_username == team_member.member_username) {
                            *existing_member = team_member;
                        } else {
                            team.push(team_member);
                        }
                    },
                    None => project.team = Some(vec![team_member]),
                }

            }
        }
    });
}



pub fn update_project(project_id: String, updated_project: ProjectInfo) {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project) = projects.iter_mut().find(|p| p.id.as_ref() == Some(&project_id)) {
                project.tags = updated_project.tags;
                project.project_creation_date = updated_project.project_creation_date;
                project.technology_stack = updated_project.technology_stack;
                project.video_link = updated_project.video_link;
                project.development_stage = updated_project.development_stage;
                project.project_area_of_focus = updated_project.project_area_of_focus;
            }
        }
    });
}



pub fn delete_project(id: String)->std::string::String {
    let caller = caller();

    APPLICATION_FORM.with(|storage| {
        let mut storage = storage.borrow_mut();
        // Find the caller's projects
        if let Some(projects) = storage.get_mut(&caller) {
            // Iterate over projects to find the one with the matching id
            for project in projects.iter_mut() {
                if project.id.as_ref() == Some(&id) {
                    // Mark the project as inactive
                    project.is_active = Some(false);
                    break;
                }
            }
        }
    });
    format!("Project Status Set To InActive")
}




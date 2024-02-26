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

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq, Eq, Hash)]
pub enum AreaOfFocus {
    DeFi,
    Tooling,
    NFTs,
    Infrastructure,
    DAO,
    Social,
    Games,
    Other(String),
    MetaVerse,
}


#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ThirtyInfoProject{
    project_name: Option<String>,
    project_logo: Option<Vec<u8>>,
    project_cover: Option<Vec<u8>>,
    project_area_of_focus: Option<AreaOfFocus>,
    project_description: Option<String>,
    project_url: Option<String>,
    social_links: Option<SocialLinksInfo>,
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
}


pub type ApplicationDetails = HashMap<Principal, Vec<ProjectInfoInternal>>;

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

    let uuids = raw_rand().await.unwrap().0; 
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    let caller = caller();

    let new_project = ProjectInfoInternal{
        params,
        uid: new_id,
        is_active: true,
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
        let projects = storage.borrow();
        if let Some(founder_projects) = projects.get(&caller) {
            founder_projects.iter().map(|project_internal| project_internal.params.clone()).collect()
        } else {
            Vec::new() 
        }
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

pub fn update_project_docs(project_id: String, docs: DocsInfo) {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project_internal) = projects.iter_mut().find(|p| p.uid == project_id) {
                if let Some(seventy_info) = &mut project_internal.params.seventy_info {
                    seventy_info.docs = Some(docs);
                }
            }
        }
    });
}

pub fn update_team_member(project_id: String, team_member: TeamMember) {
    let caller = caller();
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
                }
            }
        }
    });
}





pub fn update_project(project_id: String, updated_project: ProjectInfo) {
    let caller = caller();
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
            }
        }
    });
}



pub fn delete_project(id: String)->std::string::String {
    let caller = caller();

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
    });
    format!("Project Status Set To InActive")
}




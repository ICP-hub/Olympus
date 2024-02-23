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



#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfo {
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
    Other,
    MetaVerse,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoInternal {
    pub params: ProjectInfo,
    pub uid: String,
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

pub async fn create_project(params: ProjectInfo)->std::string::String {

    let uuids = raw_rand().await.unwrap().0; 
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    let caller = caller();
    let mut new_project = ProjectInfoInternal{
        params,
        uid: new_id,
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
        let projects_internal = storage.borrow().get(&caller).cloned().unwrap_or_else(Vec::new);
        projects_internal.into_iter().map(|project_internal| project_internal.params).collect()
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
            if let Some(project) = projects.iter_mut().find(|p| p.uid == project_id) {
                project.params.docs = Some(docs);
            }
        }
    });
}

pub fn update_team_member(project_id: String, team_member: TeamMember) {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project) = projects.iter_mut().find(|p| p.uid == project_id) {
                match &mut project.params.team {
                    Some(team) => {
                        if let Some(existing_member) = team.iter_mut().find(|m| m.member_username == team_member.member_username) {
                            *existing_member = team_member;
                        } else {
                            team.push(team_member);
                        }
                    },
                    None => {
                        project.params.team = Some(vec![team_member]);
                    },
                }
            }
        }
    });
}





pub fn update_project(project_id: String, updated_project: ProjectInfo) {
    let caller = caller();
    APPLICATION_FORM.with(|storage| {
        if let Some(projects) = storage.borrow_mut().get_mut(&caller) {
            if let Some(project) = projects.iter_mut().find(|p| p.uid == project_id) {
                project.params.tags = updated_project.tags;
                project.params.project_creation_date = updated_project.project_creation_date;
                project.params.technology_stack = updated_project.technology_stack;
                project.params.video_link = updated_project.video_link;
                project.params.development_stage = updated_project.development_stage;
                project.params.project_area_of_focus = updated_project.project_area_of_focus;
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
                    project.params.is_active = Some(false);
                    break;
                }
            }
        }
    });
    format!("Project Status Set To InActive")
}




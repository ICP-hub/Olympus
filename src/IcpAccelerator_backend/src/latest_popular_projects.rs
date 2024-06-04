use crate::state_handler::*;
use crate::{project_registration, upvotes};
use candid::Nat;
use ic_cdk_macros::{query, update};
use num_traits::ToPrimitive;
use project_registration::{list_all_projects, ProjectInfoInternal};
use std::{borrow::BorrowMut, cell::RefCell};
use upvotes::{get_upvote_record, UPVOTES};

thread_local! {
    pub static LIVE_PROJECTS: RefCell<Vec<ProjectInfoInternal>> = RefCell::new(Vec::new());
    pub static INCUBATED_PROJECTS: RefCell<Vec<ProjectInfoInternal>> = RefCell::new(Vec::new());
}

#[update]
pub fn update_project_status_live_incubated(
    project: ProjectInfoInternal,
) -> Result<&'static str, &'static str> {
    let is_live = project.params.live_on_icp_mainnet.unwrap_or(false);
    let has_dapp_link = project.params.dapp_link.is_some();

    if is_live && has_dapp_link {
        mutate_state(|projects| {
            let projects = &mut projects.live_projects;
            projects.insert(project.uid.clone(), Candid(project));
            Ok("Project successfully classified as live.")
        })
    } else {
        mutate_state(|projects| {
            let projects = &mut projects.incubated_projects;
            projects.insert(project.uid.clone(), Candid(project));
            Ok("Project successfully classified as incubated.")
        })
    }
}

#[query]
pub fn get_all_live_projects() -> Vec<ProjectInfoInternal> {
    read_state(|projects| {
        let live_projects = &projects.live_projects;
        live_projects
            .iter()
            .map(|(_, project)| project.0.clone())
            .collect()
    })
}

#[query]
pub fn get_all_incubated_projects() -> Vec<ProjectInfoInternal> {
    read_state(|projects| {
        let live_projects = &projects.incubated_projects;
        live_projects
            .iter()
            .map(|(_, project)| project.0.clone())
            .collect()
    })
}

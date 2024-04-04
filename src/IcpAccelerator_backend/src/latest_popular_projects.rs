use crate::{project_registration, upvotes};
use candid::Nat;
use ic_cdk_macros::{update, query};
use project_registration::{ProjectInfoInternal, list_all_projects, APPLICATION_FORM};
use upvotes::{get_upvote_record,UPVOTES};
use std::cell::RefCell;
use num_traits::ToPrimitive;


thread_local! {
    pub static LIVE_PROJECTS: RefCell<Vec<ProjectInfoInternal>> = RefCell::new(Vec::new());
    pub static INCUBATED_PROJECTS: RefCell<Vec<ProjectInfoInternal>> = RefCell::new(Vec::new());   
}

#[update]
pub fn update_project_status_live_incubated(project: ProjectInfoInternal) -> Result<&'static str, &'static str> {
    let is_live = project.params.live_on_icp_mainnet.unwrap_or(false);
    let has_dapp_link = project.params.dapp_link.is_some();

    if is_live && has_dapp_link {
        LIVE_PROJECTS.with(|projects| {
            let mut projects = projects.borrow_mut();
            projects.push(project);
            Ok("Project successfully classified as live.")
        })
    } else {
        INCUBATED_PROJECTS.with(|projects| {
            let mut projects = projects.borrow_mut();
            projects.push(project);
            Ok("Project classified as incubated.")
        })
    }
}

#[query]
pub fn get_all_live_projects() -> Vec<ProjectInfoInternal> {
    LIVE_PROJECTS.with(|projects| projects.borrow().clone())
}

#[query]
pub fn get_all_incubated_projects() -> Vec<ProjectInfoInternal> {
    INCUBATED_PROJECTS.with(|projects| projects.borrow().clone())
}
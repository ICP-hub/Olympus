use crate::project_registration::*;
use ic_cdk_macros::{query, update};
use crate::state_handler::*;

#[update]
pub fn update_project_status_live_incubated(
    project: ProjectInfoInternal,
) -> Result<&'static str, &'static str> {
    let is_live = project.params.live_on_icp_mainnet.unwrap_or(false);
    let has_dapp_link = project.params.dapp_link.is_some();

    if is_live && has_dapp_link {
        mutate_state(|state| {
            let projects = &mut state.live_projects;
            projects.insert(project.uid.clone(), Candid(project));
            Ok("Project successfully classified as live.")
        })
    } else {
        mutate_state(|state| {
            let projects = &mut state.incubated_projects;
            projects.insert(project.uid.clone(), Candid(project));
            Ok("Project successfully classified as incubated.")
        })
    }
}

#[query]
pub fn get_all_live_projects() -> Vec<ProjectInfoInternal> {
    read_state(|state| {
        state
            .live_projects
            .iter()
            .map(|(_, candid_res)| candid_res.0.clone())
            .collect::<Vec<ProjectInfoInternal>>()
    })
}

#[query]
pub fn get_all_incubated_projects() -> Vec<ProjectInfoInternal> {
    read_state(|state| {
        state
            .incubated_projects
            .iter()
            .map(|(_, candid_res)| candid_res.0.clone())
            .collect::<Vec<ProjectInfoInternal>>()
    })
}

use crate::read_state;
use crate::state_handler;
use crate::ProjectInfoInternal;
use candid::Principal;
use std::cell::RefCell;
use std::collections::HashMap;

#[ic_cdk::query]
pub fn get_projects_associated_with_mentor(mentor_id: Principal) -> Vec<ProjectInfoInternal> {
    read_state(|state| {
        let storage = &state.projects_associated_with_mentor;
        storage
            .get(&crate::StoredPrincipal(mentor_id))
            .map(|candid_vec| candid_vec.0.clone())
            .unwrap_or_else(Vec::new)
    })
}

#[ic_cdk::query]
pub fn get_projects_associated_with_investor(investor_id: Principal) -> Vec<ProjectInfoInternal> {
    read_state(|state| {
        let storage = &state.projects_associated_with_vc;
        storage
            .get(&crate::StoredPrincipal(investor_id))
            .map(|candid_vec| candid_vec.0.clone())
            .unwrap_or_else(Vec::new)
    })
}

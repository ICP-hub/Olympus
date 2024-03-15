use candid::Deserialize;
use candid::CandidType;
use ic_cdk::query;
use std::collections::{HashMap, HashSet};
use candid::Principal;

use std::cell::RefCell;
use ic_cdk_macros::{update};
use ic_cdk::caller;

#[derive(CandidType, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub enum UserRole {
    Mentor,
    Project,
    VC,
    ICPHubOrganizer,
    Founder
}


pub type RoleRegistry = HashMap<Principal, HashSet<UserRole>>;

thread_local! {
    pub static ROLES: RefCell<RoleRegistry> = RefCell::new(RoleRegistry::new());
}


pub fn get_role_from_principal() -> Option<HashSet<UserRole>> {
    let p_id = caller();
    ROLES.with(|roles| {
        let user_roles = roles.borrow();
        user_roles.get(&p_id).cloned()
    })
}









pub fn has_required_role( required_roles: &[UserRole]) -> bool {
    let principal = caller();
    ROLES.with(|roles| {
        let roles = roles.borrow();
        if let Some(user_roles) = roles.get(&principal) {
            required_roles.iter().any(|role| user_roles.contains(role))
        } else {
            false
        }
    })
}

pub fn has_required_role_by_principal( principal : Principal, required_roles: &[UserRole]) -> bool {
    //let principal = caller();
    ROLES.with(|roles| {
        let roles = roles.borrow();
        if let Some(user_roles) = roles.get(&principal) {
            required_roles.iter().any(|role| user_roles.contains(role))
        } else {
            false
        }
    })
}




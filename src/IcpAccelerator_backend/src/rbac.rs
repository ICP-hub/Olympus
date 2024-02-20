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
    HubOrganizer,
}


pub type RoleRegistry = HashMap<Principal, HashSet<UserRole>>;

thread_local! {
    pub static ROLES: RefCell<RoleRegistry> = RefCell::new(RoleRegistry::new());
}

#[query]
pub fn get_role_from_principal() -> Option<HashSet<UserRole>> {
    let p_id = caller();
    ROLES.with(|roles| {
        let user_roles = roles.borrow();
        user_roles.get(&p_id).cloned()
    })
}

#[update]
pub fn assign_roles_to_principal(roles_to_assign: Vec<UserRole>) -> String {
    let principal = caller();

    ROLES.with(|roles| {
        let mut roles = roles.borrow_mut();
        let user_roles = roles.entry(principal).or_insert_with(HashSet::new);
        for role in roles_to_assign {
            user_roles.insert(role);
        }
        "Roles assigned successfully".to_string()
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





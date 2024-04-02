use crate::ProjectInfoInternal;
use std::cell::RefCell;
use candid::Principal;
use std::collections::HashMap;


thread_local!{
    pub static PROJECTS_ASSOCIATED_WITH_MENTOR : RefCell<HashMap<Principal, Vec<ProjectInfoInternal>>> = RefCell::new(HashMap::new());
    pub static PROJECTS_ASSOCIATED_WITH_INVESTOR : RefCell<HashMap<Principal, Vec<ProjectInfoInternal>>> = RefCell::new(HashMap::new());
}

#[ic_cdk::query]
pub fn get_projects_associated_with_mentor(mentor_id : Principal) -> Vec<ProjectInfoInternal>{
    PROJECTS_ASSOCIATED_WITH_MENTOR.with(|storage|{
        let storage = storage.borrow();
        storage.get(&mentor_id).unwrap_or(&Vec::new()).clone()
    })
}

#[ic_cdk::query]
pub fn get_projects_associated_with_investor(investor_id : Principal) -> Vec<ProjectInfoInternal>{
    PROJECTS_ASSOCIATED_WITH_INVESTOR.with(|storage|{
        let storage = storage.borrow();
        storage.get(&investor_id).unwrap_or(&Vec::new()).clone()
    })
}
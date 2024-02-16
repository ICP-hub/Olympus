use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::cell::RefCell;

thread_local! {
    static STATE: RefCell<LikeState> = RefCell::new(LikeState::default());
}

#[derive(CandidType, Deserialize, Serialize, Default)]
pub struct LikeState {
    user_likes: HashMap<Principal, Vec<String>>, // Maps user principal to list of liked project IDs
}



pub fn like_project(project_id: String)->std::string::String {
    let caller = caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let user_likes = state.user_likes.entry(caller).or_insert_with(Vec::new);
        if !user_likes.contains(&project_id) {
            user_likes.push(project_id);
        }
    });
    format!("Project Liked Succesfully")
}


pub fn get_user_likes() -> Vec<String> {
    let caller = caller();
    STATE.with(|state| {
        let state = state.borrow();
        state.user_likes.get(&caller).cloned().unwrap_or_else(Vec::new)
    })
}


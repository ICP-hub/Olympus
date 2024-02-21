use candid::{CandidType, Principal, Nat};
use ic_cdk::api::caller;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::cell::RefCell;

use crate::register_user;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct LikesInfo {
    principal_id: Option<String>,
    name: Option<String>,
    image: Option<Vec<u8>>, // Assuming image is stored as a URL or similar string representation
}

#[derive(CandidType, Deserialize, Serialize, Default, Clone, Debug)]
pub struct LikeRecord {
    pub count: Nat, // Total upvotes for the project
    upvoters: Vec<LikesInfo>, // Maps Principal to UpvoterInfo
}


#[derive(CandidType, Deserialize, Serialize, Default, Clone)]
pub struct likeStorage {
    pub projects: HashMap<String, LikeRecord>, // Maps project ID to its upvote record
}

thread_local! {
    pub static STATE: RefCell<likeStorage> = RefCell::new(likeStorage::default());
}



pub fn like_project(project_id: String)->std::string::String {
    let caller = caller();
    if let Some(founder_info) = register_user::get_founder_info() {
        if founder_info.full_name.is_some() && founder_info.founder_image.is_some() {
            ic_cdk::println!("Got Founder Info from get API");
            let likes_info = LikesInfo {
                name: Some(founder_info.full_name.unwrap()),
                image: Some(founder_info.founder_image.unwrap()),
                principal_id: Some(caller.to_string()), 
            };
            ic_cdk::println!("Upvoter Details are: {:?}", likes_info.clone());
            STATE.with(|likes| {
                let mut likes = likes.borrow_mut();
                let like_record = likes.projects.entry(project_id.clone()).or_insert_with(Default::default);
                like_record.upvoters.push(likes_info.clone());
                like_record.count += Nat::from(1);
                ic_cdk::println!("Upvote Record is {:?}", like_record);
                ic_cdk::println!("Upvote Info is {:?}", likes_info);
            });
        } 
    } 
    format!("Project Liked Succesfully")
}


pub fn get_user_likes(project_id: String) -> Option<LikeRecord> {
     STATE.with(|state| {
        let state = state.borrow();
        state.projects.get(&project_id).cloned() // Return a cloned LikeRecord if found, None otherwise
    })
}


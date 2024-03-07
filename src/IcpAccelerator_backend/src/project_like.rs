use candid::{CandidType, Principal, Nat};
use ic_cdk::api::caller;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::cell::RefCell;
use ic_cdk::api::time;

use crate::register_user;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct LikesInfo {
    principal_id: Option<String>,
    name: Option<String>,
    image: Option<Vec<u8>>, 
    time: u64,
}

#[derive(CandidType, Deserialize, Serialize, Default, Clone, Debug)]
pub struct LikeRecord {
    pub count: Nat, 
    upvoters: Vec<LikesInfo>, 
}


#[derive(CandidType, Deserialize, Serialize, Default, Clone)]
pub struct likeStorage {
    pub projects: HashMap<String, LikeRecord>, 
}

thread_local! {
    pub static STATE: RefCell<likeStorage> = RefCell::new(likeStorage::default());
}



pub fn like_project(project_id: String) -> std::string::String {
    let caller = caller();
    if let Some(founder_info) = register_user::get_founder_info() {
        if let (Some(full_name), Some(founder_image)) = (
            founder_info.thirty_info.as_ref().and_then(|info| info.full_name.clone()),
            founder_info.seventy_info.as_ref().and_then(|info| info.founder_image.clone())
        ) {
            ic_cdk::println!("Got Founder Info from get API");
            let likes_info = LikesInfo {
                name: Some(full_name),
                image: Some(founder_image),
                principal_id: Some(caller.to_string()), 
                time: time(), 
            };
            ic_cdk::println!("Upvoter Details are: {:?}", likes_info.clone());
            
            let mut project_found_and_liked = false;

            STATE.with(|likes| {
                let mut likes = likes.borrow_mut();
                if likes.projects.contains_key(&project_id) {
                    let like_record = likes.projects.entry(project_id.clone()).or_insert_with(Default::default);
                    like_record.upvoters.push(likes_info.clone());
                    like_record.count += Nat::from(1_u32); 
                    ic_cdk::println!("Upvote Record is {:?}", like_record);
                    ic_cdk::println!("Upvote Info is {:?}", likes_info);
                    project_found_and_liked = true;
                }
            });

            if project_found_and_liked {
                "Project Liked Successfully".to_string()
            } else {
                "No Project Found".to_string()
            }
        } else {
            "Incomplete Founder Info".to_string()
        }
    } else {
        "Founder Info Not Found".to_string()
    }
}



pub fn get_user_likes(project_id: String) -> Option<LikeRecord> {
     STATE.with(|state| {
        let state = state.borrow();
        state.projects.get(&project_id).cloned() 
    })
}


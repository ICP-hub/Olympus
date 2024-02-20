use candid::Nat;
use candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::{query, update};
use serde::Serialize;
use ic_cdk::api::caller;
use std::cell::RefCell;
use std::collections::HashMap;
use std::collections::HashSet;
use std::fmt::Display;

use crate::register_user;
use crate::register_user::FOUNDER_STORAGE;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct UpvoterInfo {
    principal_id: Option<String>,
    name: Option<String>,
    image: Option<Vec<u8>>, // Assuming image is stored as a URL or similar string representation
}

#[derive(CandidType, Deserialize, Serialize, Default, Clone, Debug)]
pub struct UpvoteRecord {
    pub count: Nat, // Total upvotes for the project
    upvoters: Vec<UpvoterInfo>, // Maps Principal to UpvoterInfo
}


#[derive(CandidType, Deserialize, Serialize, Default, Clone)]
pub struct UpvoteStorage {
    pub projects: HashMap<String, UpvoteRecord>, // Maps project ID to its upvote record
}

thread_local! {
    pub static UPVOTES: RefCell<UpvoteStorage> = RefCell::new(UpvoteStorage::default());
}


// Function to upvote a project by a user
pub fn upvote(project_id: String) ->std::string::String {
    let caller = caller();
    if let Some(founder_info) = register_user::get_founder_info() {
        if founder_info.full_name.is_some() && founder_info.founder_image.is_some() {
            ic_cdk::println!("Got Founder Info from get API");
            let upvoter_info = UpvoterInfo {
                name: Some(founder_info.full_name.unwrap()),
                image: Some(founder_info.founder_image.unwrap()),
                principal_id: Some(caller.to_string()), 
            };
            ic_cdk::println!("Upvoter Details are: {:?}", upvoter_info.clone());
            UPVOTES.with(|upvotes| {
                let mut upvotes = upvotes.borrow_mut();
                let upvote_record = upvotes.projects.entry(project_id.clone()).or_insert_with(Default::default);
                upvote_record.upvoters.push(upvoter_info.clone());
                upvote_record.count += Nat::from(1);
                ic_cdk::println!("Upvote Record is {:?}", upvote_record);
                ic_cdk::println!("Upvote Info is {:?}", upvoter_info);
            });
        } 
    } 
    format!("Project Liked Succesfully")
}

// Function to get the upvote count for a project
#[query]
pub fn get_upvote_record(project_id: String) -> Option<UpvoteRecord> {
    let record = UPVOTES.with(|upvotes| upvotes.borrow().projects.get(&project_id).cloned());

    // Log the retrieved record for debugging
    ic_cdk::println!("Retrieved upvote record: {:?}", record.clone());

    record
}


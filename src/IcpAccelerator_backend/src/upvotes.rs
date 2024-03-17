use crate::register_user;
use crate::register_user::FOUNDER_STORAGE;
use candid::Nat;
use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::api::time;
use ic_cdk_macros::{query, update};
use serde::Serialize;
use std::cell::RefCell;
use std::collections::HashMap;
use std::collections::HashSet;
use std::fmt::Display;
use std::io::Read;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct UpvoterInfo {
    principal_id: Option<String>,
    name: Option<String>,
    image: Option<Vec<u8>>,
    timestamp: u64,
}

#[derive(CandidType, Deserialize, Serialize, Default, Clone, Debug)]
pub struct UpvoteRecord {
    pub count: Nat,
    upvoters: Vec<UpvoterInfo>,
}

#[derive(CandidType, Deserialize, Serialize, Default, Clone)]
pub struct UpvoteStorage {
    pub projects: HashMap<String, UpvoteRecord>,
}

thread_local! {
    pub static UPVOTES: RefCell<UpvoteStorage> = RefCell::new(UpvoteStorage::default());
}

pub fn upvote(project_id: String) -> std::string::String {
    let caller = caller();
    if let Some(founder_info) = register_user::get_founder_info() {
        match (
            founder_info
                .thirty_info
                .as_ref()
                .and_then(|info| info.full_name.clone()),
            founder_info
                .seventy_info
                .as_ref()
                .and_then(|info| info.founder_image.clone()),
        ) {
            (Some(name), Some(image)) => {
                ic_cdk::println!("Got Founder Info from get API");
                let upvoter_info = UpvoterInfo {
                    name: Some(name),
                    image: Some(image),
                    principal_id: Some(caller.to_string()),
                    timestamp: time(),
                };
                ic_cdk::println!("Upvoter Details are: {:?}", upvoter_info.clone());
                UPVOTES.with(|upvotes| {
                    let mut upvotes = upvotes.borrow_mut();
                    let upvote_record = upvotes
                        .projects
                        .entry(project_id.clone())
                        .or_insert_with(Default::default);
                    upvote_record.upvoters.push(upvoter_info.clone());
                    // Assuming Nat::from works as expected, otherwise adjust accordingly
                    upvote_record.count += Nat::from(1_u32); // Simplified for clarity; adjust as needed based on your Nat type
                    ic_cdk::println!("Upvote Record is {:?}", upvote_record);
                    ic_cdk::println!("Upvote Info is {:?}", upvoter_info);
                });
                "Project Liked Successfully".to_string()
            }
            _ => "Missing required founder info".to_string(),
        }
    } else {
        "Founder info not found".to_string()
    }
}

pub fn get_upvote_record(project_id: String) -> Option<UpvoteRecord> {
    let record = UPVOTES.with(|upvotes| upvotes.borrow().projects.get(&project_id).cloned());
    record
}

pub fn pre_upgrade_upvotes() {
    UPVOTES.with(|notifications| {
        let serialized =
            bincode::serialize(&*notifications.borrow()).expect("Serialization failed");
        let mut writer = StableWriter::default();
        writer
            .write(&serialized)
            .expect("Failed to write to stable storage");
    });
}

pub fn post_upgrade_upvotes() {
    let mut reader = StableReader::default();
    let mut data = Vec::new();
    reader
        .read_to_end(&mut data)
        .expect("Failed to read from stable storage");
    let upvotes: UpvoteStorage =
        bincode::deserialize(&data).expect("Deserialization failed of notification");
    UPVOTES.with(|notifications_ref| {
        *notifications_ref.borrow_mut() = upvotes;
    });
}

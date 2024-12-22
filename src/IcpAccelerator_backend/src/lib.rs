#![allow(non_snake_case)]

pub mod user_modules;
pub mod project_module;
pub mod vc_module;
pub mod mentor_module;
pub mod cohort_module;
pub mod access_requests;
pub mod announcements;
pub mod jobs;
pub mod constant_api;
pub mod types;
pub mod association_module;
pub mod ratings_module;
pub mod notifications;
pub mod profile_view;

use ic_cdk::api::management_canister::main::CanisterStatusResponse;
use std::collections::HashMap;
use ic_cdk::export_candid;
use candid::Principal;
use candid::{self, CandidType, Deserialize};
mod asset_manager;
mod leaderboard;
mod state_handler;
mod guard;

use ic_cdk::api::caller;
use ic_cdk_macros::*;

use crate::association_module::investor_offer_to_project::*;
use crate::association_module::project_offer_to_investor::*;
use crate::association_module::notification_to_mentor::*;
use crate::association_module::notification_to_project::*;
use crate::project_module::project_types::*;
use crate::cohort_module::cohort_types::*;
use crate::types::individual_types::*;
use crate::announcements::ann_types::*;
use crate::mentor_module::mentor_types::*;
use crate::vc_module::vc_types::*;
use crate::types::pagination_types::*;
use crate::jobs::job_types::*;
use crate::user_modules::user_types::*;
use crate::constant_api::cnst_api::*;
use crate::constant_api::manage_hubs::*;
use crate::cohort_module::cohort_rating::*;
use crate::types::ratings_types::*;
use crate::ratings_module::rubric_ratings::*;
use crate::guard::*;
use crate::notifications::notification::*;
use crate::profile_view::ViewDataResponse;

#[query(guard = "combined_guard")]
fn greet(name: String) -> String {
    format!("Hello! {}", name)
}

#[query(guard = "combined_guard")]
fn get_my_id() -> Principal {
    caller()
}
 
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Icrc28TrustedOriginsResponse {
    pub trusted_origins: Vec<String>
}
 
// list every base URL that users will authenticate to your app from
#[update]
fn icrc28_trusted_origins() -> Icrc28TrustedOriginsResponse {
    let trusted_origins = vec![
        String::from("https://hptzq-yaaaa-aaaam-adb5a-cai.icp0.io"),
        String::from("http://localhost:8080/"),
        String::from("http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai"),
        String::from("http://bd3sg-teaaa-aaaaa-qaaba-cai.localhost:4943/"),
        String::from("http://127.0.0.1:4200/"),
    ];
 
    return Icrc28TrustedOriginsResponse { trusted_origins }
}
//2vxsx-fae
export_candid!();
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

use ic_cdk::api::management_canister::main::CanisterStatusResponse;
use std::collections::HashMap;
use ic_cdk::export_candid;
use candid::Principal;
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

#[query(guard = "combined_guard")]
fn greet(name: String) -> String {
    format!("Hello! {}", name)
}

#[query(guard = "combined_guard")]
fn get_my_id() -> Principal {
    caller()
}
//2vxsx-fae
export_candid!();
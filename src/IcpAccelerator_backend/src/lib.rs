use ic_cdk::api::management_canister::main::CanisterStatusResponse;
use std::collections::HashMap;
use ic_cdk::export_candid;
use candid::Principal;
mod project_registration;
mod ratings;
use crate::project_registration::Announcements;

mod admin;
mod asset_manager;
mod latest_popular_projects;
mod leaderboard;
mod manage_focus_expertise;
mod manage_hubs;
mod mentor;
mod investor_offer_to_project;
mod notification_to_mentor;
mod notification_to_project;
mod project_offer_to_investor;
mod state_handler;
mod associations;
mod cohort;
mod cohort_rating;
mod mentor_investor_ratings;
mod user_module;
mod vc_registration;


use crate::cohort_rating::*;
use crate::mentor_investor_ratings::*;
use crate::project_registration::*;
use crate::manage_hubs::*;
use crate::cohort::*;
use crate::admin::*;
use crate::manage_focus_expertise::*;
use investor_offer_to_project::*;
use notification_to_mentor::*;
use notification_to_project::*;
use project_offer_to_investor::*;
use ic_cdk::api::caller;
use leaderboard::*;
use ratings::*;
use user_module::*;
use ic_cdk_macros::*;
use mentor::*;
use vc_registration::*;

pub fn is_admin() -> Result<(), String> {
    Ok(())
    // if !ic_cdk::api::is_controller(&caller()) {
    //     Err("Only Admin can use these functions".to_string())
    // } else {
    //     Ok(())
    // }
}

pub fn is_user_anonymous() -> Result<(), String> {
    Ok(())
    // let caller = caller();

    // if caller.to_string() != "2vxsx-fae" {
    //     Ok(())
    // } else {
    //     Err("login with your identity to use functions".to_string())
    // }
}


#[query(guard = "is_user_anonymous")]
fn greet(name: String) -> String {
    format!("Hello! {}", name)
}

#[query(guard = "is_user_anonymous")]
fn get_my_id() -> Principal {
    caller()
}
//2vxsx-fae
export_candid!();
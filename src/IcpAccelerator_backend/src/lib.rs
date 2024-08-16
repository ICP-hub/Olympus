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
mod default_images;
mod mentor_investor_ratings;
mod roles;
mod user_module;
mod vc_registration;

use crate::cohort_rating::LeaderboardEntryForCohorts;
use crate::cohort_rating::PeerRatingUpdate;
use crate::mentor_investor_ratings::RatingMentorInvestor;
use crate::project_registration::*;
use crate::manage_hubs::*;
use cohort::*;
use ic_cdk::api::management_canister::main::CanisterStatusResponse;
use investor_offer_to_project::*;
use notification_to_mentor::*;
use notification_to_project::*;
use project_offer_to_investor::*;
use ic_cdk::api::caller;
use leaderboard::LeaderboardEntryForRatings;
use crate::ratings::*;
use project_registration::FilterCriteria;
use roles::{get_roles, RolesResponse};
use std::collections::HashMap;
use user_module::*;
use ic_cdk::export_candid;
use manage_focus_expertise::{get_areas, Areas};
use manage_hubs::{get_icp_hubs, IcpHub};
use mentor::MentorProfile;
mod project_registration;
mod ratings;
use crate::project_registration::Announcements;
use crate::project_registration::Blog;
use admin::*;
use candid::Principal;
use ic_cdk_macros::*;
use mentor::*;
use project_registration::{
    NotificationForOwner, NotificationProject, ProjectInfo, ProjectInfoInternal,
};

use crate::ratings::RatingView;
use vc_registration::VentureCapitalist;
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

// #[init]
// fn init() {
//     user_module::initialize_roles();
//     //ic_cdk::println!("initialization done");
// }

#[update(guard = "is_admin")]
fn approve_mentor_creation_request_candid(requester: Principal, approve: bool) -> String {
    // check_admin();
    approve_mentor_creation_request(requester, approve)
}

#[update(guard = "is_admin")]
fn decline_mentor_creation_request_candid(requester: Principal, decline: bool) -> String {
    // check_admin();
    decline_mentor_creation_request(requester, decline)
}

#[update(guard = "is_admin")]
fn approve_project_details_updation_request(
    requester: Principal,
    project_id: String,
    approve: bool,
) -> String {
    admin::approve_project_update(requester, project_id, approve)
}

#[query(guard = "is_user_anonymous")]
pub async fn get_user_information_using_uid(uid: String) -> Result<UserInformation, &'static str> {
    user_module::get_user_info_by_id(uid).await
}

#[update(guard = "is_user_anonymous")]
pub async fn register_user(profile: UserInformation) -> String {
    user_module::register_user_role(profile).await
}

#[query(guard = "is_user_anonymous")]
pub fn get_user_information() -> Result<UserInformation, &'static str> {
    user_module::get_user_info()
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_users_information(pagination: PaginationUser) -> Vec<UserInformation> {
    user_module::list_all_users(pagination)
}

#[update(guard = "is_user_anonymous")]
pub fn make_user_inactive() -> String {
    user_module::delete_user()
}

// #[query]
// fn get_founder_info_caller() -> Option<FounderInfo> {
//     register_user::get_founder_info()
// }

#[update(guard = "is_user_anonymous")]

async fn register_project(params: ProjectInfo) -> String {
    project_registration::create_project(params).await
}

#[query(guard = "is_user_anonymous")]
fn filter_out_projects(criteria: FilterCriteria) -> Vec<ProjectInfo> {
    project_registration::filter_projects(criteria)
}

// #[query]
// fn get_projects_for_caller() -> Vec<ProjectInfo> {
//     project_registration::get_projects_for_caller()
// }

#[query(guard = "is_user_anonymous")]
fn get_project_using_id(project_id: String) -> Option<ProjectInfoInternal> {
    project_registration::find_project_by_id(&project_id)
}

// #[query]
// fn list_all_projects() -> HashMap<Principal, ProjectVecWithRoles> {
//     project_registration::list_all_projects()
// }

#[update(guard = "is_user_anonymous")]
async fn update_project(project_id: String, updated_project: ProjectInfo) -> String {
    project_registration::update_project(project_id, updated_project).await
}

#[update(guard = "is_user_anonymous")]
async fn update_team_member(project_id: String, member_principal_id: Principal) -> String {
    project_registration::update_team_member(&project_id, member_principal_id).await
}

#[update(guard = "is_user_anonymous")]
fn delete_project(id: String) -> std::string::String {
    project_registration::delete_project(id)
}

// #[update(guard = "is_admin")]
// fn verify_project_under_your_hub(project_id: String) -> String {
//     project_registration::verify_project(&project_id)
// }

#[query(guard = "is_user_anonymous")]
fn get_your_project_notifications() -> Vec<NotificationForOwner> {
    project_registration::get_notifications_for_owner()
}

#[query(guard = "is_user_anonymous")]
fn get_notifications_for_hubs() -> Vec<NotificationProject> {
    project_registration::get_notifications_for_caller()
}

// #[update(guard = "is_admin")]
// fn add_suggestion_caller(
//     content: String,
//     project_id: String,
// ) -> Result<(u64, String), &'static str> {
//     roadmap_suggestion::add_suggestion(content, project_id)
// }

#[query(guard = "is_user_anonymous")]
fn get_all_roles() -> RolesResponse {
    get_roles() // Call the get_roles function from the roles module
}

#[update(guard = "is_user_anonymous")]
async fn register_mentor_candid(profile: MentorProfile) -> String {
    mentor::register_mentor(profile).await
    //"request has been made to admin".to_string()
}

// #[query]

// fn get_mentor_candid() -> Option<MentorProfile> {
//     mentor::get_mentor()
// }

#[update(guard = "is_admin")]
fn delete_mentor_candid() -> String {
    mentor::delete_mentor()
}

#[update(guard = "is_user_anonymous")]

fn make_active_inactive_mentor(id: Principal) -> String {
    mentor::make_active_inactive(id)
}

#[query(guard = "is_user_anonymous")]

fn get_all_mentors_candid() -> HashMap<Principal, MentorWithRoles> {
    mentor::get_all_mentors()
}

#[query(guard = "is_user_anonymous")]

fn get_venture_capitalist_info() -> Option<VentureCapitalist> {
    vc_registration::get_vc_info()
}

#[update(guard = "is_admin")]

async fn update_venture_capitalist_caller(params: VentureCapitalist) -> String {
    vc_registration::update_venture_capitalist(params).await
}

#[update(guard = "is_admin")]

fn delete_venture_capitalist_caller() -> std::string::String {
    vc_registration::delete_venture_capitalist()
}

#[query(guard = "is_user_anonymous")]
fn get_icp_hubs_candid() -> Vec<IcpHub> {
    get_icp_hubs()
}

#[query(guard = "is_user_anonymous")]
fn get_area_focus_expertise() -> Vec<Areas> {
    get_areas()
}

#[query(guard = "is_user_anonymous")]
fn greet(name: String) -> String {
    format!("Hello! {}", name)
}

#[query(guard = "is_user_anonymous")]

fn get_leaderboard_using_ratings() -> Vec<LeaderboardEntryForRatings> {
    leaderboard::get_leaderboard_by_ratings()
}

#[update(guard = "is_user_anonymous")]

fn update_rating(rating_data: RatingUpdate) -> String {
    ratings::update_rating_api(rating_data)
}

#[query(guard = "is_user_anonymous")]

fn calculate_average(project_id: String) -> RatingAverages {
    ratings::calculate_average_api(&project_id)
}

// #[query]

// fn get_main_level_ratings(project_id: String) -> HashMap<String, MainLevelRatings> {
//     ratings::get_ratings_by_project_id(&project_id)
// }

//made for admin side.....
// #[query]
//  fn get_role() -> RolesResponse {
//     roles::get_roles()
// }
// made for admin side.....

#[query(guard = "is_user_anonymous")]
fn get_role() -> RolesResponse {
    roles::get_roles()
}

#[query(guard = "is_user_anonymous")]

fn get_my_id() -> Principal {
    caller()
}

#[query(guard = "is_admin")]
fn get_admin_notifications() -> Vec<admin::Notification> {
    admin::get_admin_notifications()
}

// #[update(guard = "is_admin")]
//  fn add_roles(name: String) -> Role {
//     roles::add_role(name)
// }

// #[query(name = "__get_candid_interface_tmp_hack")]
// fn export_candid() -> String {
//     export_service!();
//     __export_service()
// }

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn save_candid() {
//         use std::env;
//         use std::fs::write;
//         use std::path::PathBuf;

//         let dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());

//         // Directly use dir for the current directory
//         let file_path = dir.join("IcpAccelerator_backend.did");
//         write(file_path, export_candid()).expect("Write failed.");
//     }
// }

//2vxsx-fae

// #[pre_upgrade]
// fn pre_upgrade() {
//     pre_upgrade_venture_capitalist();
//     //pre_upgrade_user_modules();
//     pre_upgrade_project_registration();
//     // pre_upgrade_upvotes();
//     //pre_upgrade_mentor();
//     //pre_upgrade_admin();
//     //pre_upgrade_rating_system();
// }

// #[post_upgrade]
// fn post_upgrade() {
//     post_upgrade_venture_capitalist();
//     //post_upgrade_user_modules();
//     post_upgrade_project_registration();
//     //post_upgrade_upvotes();
//     //post_upgrade_mentor();
//     //post_upgrade_admin();
//     //post_upgrade_rating_system();
// }

export_candid!();

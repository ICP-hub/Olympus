mod admin;
mod hub_organizer;
mod latest_popular_projects;
mod leaderboard;
mod manage_focus_expertise;
mod manage_hubs;
mod mentor;
mod notification;

mod notification_to_mentor;
mod notification_to_project;
mod project_offer_to_investor;
mod investor_offer_to_project;

mod associations;

mod project_like;
mod requests;
mod roles;
mod upvotes;
mod user_module;
mod vc_registration;
mod cohort;
mod default_images;

use crate::project_registration::*;
use cohort::*;

use project_offer_to_investor::*;
use investor_offer_to_project::*;
use notification_to_mentor::*;
use notification_to_project::*;
use associations::*;


use ic_cdk::api::caller;
use ic_cdk_macros::pre_upgrade;

use leaderboard::{
    LeaderboardEntryForLikes, LeaderboardEntryForRatings, LeaderboardEntryForUpvote,
};
// use notification::pre_upgrade_notifications;
use project_like::LikeRecord;
use project_registration::FilterCriteria;
use ratings::RatingAverages;
use requests::Request;
use roles::{get_roles, RolesResponse};
use std::collections::HashMap;

use user_module::*;

use ic_cdk::export_candid;
use manage_focus_expertise::{get_areas, Areas};
use manage_hubs::{get_icp_hubs, IcpHub};
use mentor::MentorProfile;
use upvotes::*;

mod project_registration;
mod ratings;
mod rbac;
mod register_user;
mod roadmap_suggestion;
mod trie;

// use crate::notification::Notification;
use crate::project_registration::Announcements;
use crate::project_registration::Blog;
use crate::ratings::MainLevelRatings;
use crate::ratings::Rating;
use admin::*;
use candid::Principal;

use ic_cdk_macros::{init, query, update};
use mentor::*;
use project_registration::{
    NotificationForOwner, NotificationProject, ProjectInfo, ProjectInfoInternal, TeamMember,
};

use notification::*;
use register_user::FounderInfo;
use roadmap_suggestion::Suggestion;

use vc_registration::VentureCapitalist;
use vc_registration::*;

// private function to check if the caller is one of the controllers of the canister
fn check_admin() {
    if !ic_cdk::api::is_controller(&caller()) {
        ic_cdk::api::trap("This user is unauthorised to use this function");
    }
}

// #[init]
// fn init() {
//     user_module::initialize_roles();
//     //ic_cdk::println!("initialization done");
// }

#[update]
fn approve_mentor_creation_request_candid(requester: Principal, approve: bool) -> String {
    // check_admin();
    approve_mentor_creation_request(requester, approve)
}

#[update]
fn decline_mentor_creation_request_candid(requester: Principal, decline: bool) -> String {
    // check_admin();
    decline_mentor_creation_request(requester, decline)
}

#[update]
fn approve_project_details_updation_request(
    requester: Principal,
    project_id: String,
    approve: bool,
) -> String {
    admin::approve_project_update(requester, project_id, approve)
}

#[query]
pub async fn get_user_information_using_uid(uid: String) -> Result<UserInformation, &'static str> {
    user_module::get_user_info_by_id(uid).await
}

#[update]
pub async fn register_user(profile: UserInformation) -> String {
    user_module::register_user_role(profile).await
}

#[query]
pub fn get_user_information() -> Result<UserInformation, &'static str> {
    user_module::get_user_info()
}

#[query]
pub fn get_all_users_information() -> Vec<UserInformation> {
    user_module::list_all_users()
}

#[update]
pub fn make_user_inactive() -> String {
    user_module::delete_user()
}

#[query]
fn get_founder_info_caller() -> Option<FounderInfo> {
    register_user::get_founder_info()
}

#[query]
fn list_all_founders() -> Vec<register_user::FounderInfo> {
    register_user::list_all_founders()
}

#[update]
fn delete_founder_caller() -> std::string::String {
    register_user::delete_founder()
}

#[update]
fn update_founder_caller(updated_profile: FounderInfo) -> String {
    register_user::update_founder(updated_profile)
}

#[update]

async fn register_project(params: ProjectInfo) -> String {
    project_registration::create_project(params).await
}

#[query]
fn filter_out_projects(criteria: FilterCriteria) -> Vec<ProjectInfo> {
    project_registration::filter_projects(criteria)
}

// #[query]
// fn get_projects_for_caller() -> Vec<ProjectInfo> {
//     project_registration::get_projects_for_caller()
// }

#[query]
fn get_project_using_id(project_id: String) -> Option<ProjectInfoInternal> {
    project_registration::find_project_by_id(&project_id)
}

#[query]
fn list_all_projects() -> HashMap<Principal, ProjectVecWithRoles> {
    project_registration::list_all_projects()
}

#[update]
async fn update_project(project_id: String, updated_project: ProjectInfo) -> String {
    project_registration::update_project(project_id, updated_project).await
}

#[update]
async fn update_team_member(project_id: String, member_principal_id: Principal) -> String {
    project_registration::update_team_member(&project_id, member_principal_id).await
}

#[update]
fn delete_project(id: String) -> std::string::String {
    project_registration::delete_project(id)
}

// #[update]
// fn verify_project_under_your_hub(project_id: String) -> String {
//     project_registration::verify_project(&project_id)
// }

#[update]
fn connect_to_team_member(project_id: String, team_user_name: String) -> String {
    project_registration::send_connection_request_to_owner(&project_id, &team_user_name)
}

#[query]
fn get_your_project_notifications() -> Vec<NotificationForOwner> {
    project_registration::get_notifications_for_owner()
}

#[query]
fn get_notifications_for_hubs() -> Vec<NotificationProject> {
    project_registration::get_notifications_for_caller()
}

#[update]
fn like_project(project_id: String) -> std::string::String {
    project_like::like_project(project_id)
}

#[query]
fn get_user_likes(project_id: String) -> Option<LikeRecord> {
    project_like::get_user_likes(project_id)
}

// #[update]
// fn add_suggestion_caller(
//     content: String,
//     project_id: String,
// ) -> Result<(u64, String), &'static str> {
//     roadmap_suggestion::add_suggestion(content, project_id)
// }

#[update]
fn update_suggestion_status_caller(id: u64, status: String, project_id: String) {
    roadmap_suggestion::update_suggestion_status(id, status, project_id);
}

#[query]
fn get_suggestions_by_status_caller(project_id: String, status: String) -> Vec<Suggestion> {
    roadmap_suggestion::get_suggestions_by_status(project_id, status)
}

#[update]
fn reply_to_suggestion_caller(
    parent_id: u64,
    reply_content: String,
    project_id: String,
) -> (u64, String) {
    roadmap_suggestion::reply_to_suggestion(parent_id, reply_content, project_id)
}

#[query]
fn get_suggestions_by_parent_id_caller(project_id: String, parent_id: u64) -> Vec<Suggestion> {
    roadmap_suggestion::get_suggestions_by_parent_id(project_id, parent_id)
}

#[query]
fn get_total_suggestions(project_id: String) -> u64 {
    roadmap_suggestion::get_total_suggestions_count(project_id)
}

#[query]
fn get_all_roles() -> RolesResponse {
    get_roles() // Call the get_roles function from the roles module
}

#[update]
async fn register_mentor_candid(profile: MentorProfile) -> String {
    mentor::register_mentor(profile).await;

    "request has been made to admin".to_string()
}

// #[query]

// fn get_mentor_candid() -> Option<MentorProfile> {
//     mentor::get_mentor()
// }

#[update]
fn delete_mentor_candid() -> String {
    mentor::delete_mentor()
}

#[update]

fn make_active_inactive_mentor(id: Principal) -> String {
    mentor::make_active_inactive(id)
}

#[query]

fn get_all_mentors_candid() -> HashMap<Principal, MentorWithRoles> {
    mentor::get_all_mentors()
}

#[query]

fn get_mentor_by_expertise(area_of_expertise: String) -> Vec<MentorProfile> {
    mentor::find_mentors_by_expertise(&area_of_expertise)
}

#[update]

fn upvote_project(project_id: String) -> std::string::String {
    upvotes::upvote(project_id)
}

#[query]

fn get_project_upvotes(project_id: String) -> Option<UpvoteRecord> {
    upvotes::get_upvote_record(project_id)
}

#[query]

fn get_latest_live_proposal() -> Vec<ProjectInfoInternal> {
    latest_popular_projects::get_live_proposals_latest()
}

#[query]

fn get_latest_listed_project() -> Vec<ProjectInfoInternal> {
    latest_popular_projects::get_listed_projects_latest()
}

#[query]

fn get_popular_live_proposal() -> Vec<ProjectInfoInternal> {
    latest_popular_projects::get_live_proposals_popular()
}

#[query]

fn get_popular_listed_project() -> Vec<ProjectInfoInternal> {
    latest_popular_projects::get_listed_projects_popular()
}

#[query]

fn get_venture_capitalist_info() -> Option<VentureCapitalist> {
    vc_registration::get_vc_info()
}

#[update]

async fn update_venture_capitalist_caller(params: VentureCapitalist) -> String {
    vc_registration::update_venture_capitalist(params).await
}

#[update]

fn delete_venture_capitalist_caller() -> std::string::String {
    vc_registration::delete_venture_capitalist()
}

#[query]
fn get_icp_hubs_candid() -> Vec<IcpHub> {
    get_icp_hubs()
}

#[query]
fn get_area_focus_expertise() -> Vec<Areas> {
    get_areas()
}

#[query]
fn greet(name: String) -> String {
    format!("Hello! {}", name)
}

#[query]
fn get_leaderboard_using_upvotes() -> Vec<LeaderboardEntryForUpvote> {
    leaderboard::get_leaderboard_by_upvotes()
}

#[query]

fn get_leaderboard_using_likes() -> Vec<LeaderboardEntryForLikes> {
    leaderboard::get_leaderboard_by_likes()
}

#[query]

fn get_leaderboard_using_ratings() -> Vec<LeaderboardEntryForRatings> {
    leaderboard::get_leaderboard_by_ratings()
}

#[update]

fn update_rating_api(rating: Vec<Rating>) {
    ratings::update_rating(rating);
}

#[query]

fn calculate_average(project_id: String) -> RatingAverages {
    ratings::calculate_average_api(&project_id)
}

#[query]

fn get_main_level_ratings(project_id: String) -> HashMap<String, MainLevelRatings> {
    ratings::get_ratings_by_project_id(&project_id)
}

#[update]

fn send_request_as_mentor(project_id: String, request_text: String) -> String {
    requests::send_request_to_project(project_id, request_text)
}

#[query]

fn get_project_requests(project_id: String) -> Vec<Request> {
    requests::get_requests(project_id)
}

//made for admin side.....
// #[query]
//  fn get_role() -> RolesResponse {
//     roles::get_roles()
// }
// made for admin side.....

#[query]
fn get_role() -> RolesResponse {
    roles::get_roles()
}

#[query]

fn get_my_id() -> Principal {
    caller()
}

#[query]
fn get_admin_notifications() -> Vec<admin::Notification> {
    check_admin();
    admin::get_admin_notifications()
}

// #[update]
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
//     pre_upgrade_vc();
//     pre_upgrade_user_modules();
//     pre_upgrade_upvotes();
//     pre_upgrade_mentor();
//     pre_upgrade_admin();
// }

// #[post_upgrade]
// fn post_upgrade() {
//     post_upgrade_vc();
//     post_upgrade_user_modules();
//     post_upgrade_upvotes();
//     post_upgrade_mentor();
//     post_upgrade_admin();
// }

export_candid!();

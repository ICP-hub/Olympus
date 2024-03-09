mod admin;
mod hub_organizer;
mod latest_popular_projects;
mod leaderboard;
mod manage_focus_expertise;
mod manage_hubs;
mod mentor;
mod notification;
mod project_like;
mod requests;
mod roles;
mod upvotes;
mod vc_registration;

use hub_organizer::{HubOrganizerRegistration, UniqueHubs};
use ic_cdk::api::caller;
use leaderboard::{
    LeaderboardEntryForLikes, LeaderboardEntryForRatings, LeaderboardEntryForUpvote,
};
use project_like::LikeRecord;
use requests::Request;
use roles::{get_roles, RolesResponse};
use std::collections::{HashMap, HashSet};

use ic_cdk::export_candid;
use manage_focus_expertise::{get_areas, Areas};
use manage_hubs::{get_icp_hubs, IcpHub};
use mentor::MentorProfile;
use upvotes::UpvoteRecord;

mod project_registration;
mod ratings;
mod rbac;
mod register_user;
mod roadmap_suggestion;
mod trie;

use crate::notification::Notification;
use crate::ratings::MainLevel;
use crate::ratings::MainLevelRatings;
use crate::ratings::Rating;
use candid::Principal;
use ic_cdk_macros::{query, update};
use project_registration::{
    DocsInfo, NotificationForOwner, NotificationProject, ProjectInfo, ProjectInfoInternal,
    TeamMember, ThirtyInfoProject,
};
use rbac::{assign_roles_to_principal, has_required_role, UserRole};
use register_user::{FounderInfo, FounderInfoInternal, ThirtyInfoFounder};
use roadmap_suggestion::Suggestion;
use upvotes::UpvoteStorage;
use vc_registration::VentureCapitalist;
use admin::*;
use mentor::*;

// private function to check if the caller is one of the controllers of the canister
fn check_admin() {
    if !ic_cdk::api::is_controller(&caller()){
        ic_cdk::api::trap("This user is unauthorised to use this function");
    }
}

#[update]
fn approve_mentor_creation_request_candid(requester : Principal, approve : bool) -> String{
    check_admin();
    approve_mentor_creation_request(requester, approve)
}

#[update]
fn decline_mentor_creation_request_candid(requester : Principal, decline : bool) -> String{
    check_admin();
    decline_mentor_creation_request(requester, decline)
}

#[query]
fn get_role_from_p_id() -> Option<HashSet<UserRole>> {
    rbac::get_role_from_principal()
}

#[update]

async fn register_founder_caller(profile: ThirtyInfoFounder) -> String {
    let role = vec![UserRole::Project];
    register_user::register_founder(profile).await;
    assign_roles_to_principal(role)
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
    if has_required_role(&vec![UserRole::Project]) {
        register_user::update_founder(updated_profile)
    } else {
        "you are not supposed to change someone profile".to_string()
    }
}

#[update]

async fn create_project(params: ThirtyInfoProject) -> String {
    if has_required_role(&vec![UserRole::Project]) {
        project_registration::create_project(params).await
    } else {
        "you hv n't registered as a user yet".to_string()
    }
    // assign_roles_to_principal(roles)
}

#[query]
fn get_projects_for_caller() -> Vec<ProjectInfo> {
    project_registration::get_projects_for_caller()
}

#[query]
fn get_project_using_id(project_id: String) -> Option<ProjectInfoInternal> {
    project_registration::find_project_by_id(&project_id)
}

#[query]
fn list_all_projects() -> Vec<ProjectInfo> {
    project_registration::list_all_projects()
}

#[update]
fn update_project(project_id: String, updated_project: ProjectInfo) -> String {
    if has_required_role(&vec![ UserRole::Project]) {
        project_registration::update_project(project_id, updated_project)
    } else {
        "you are not supposed to change someone profile".to_string()
    }
}

#[update]
fn update_project_docs(project_id: String, docs: DocsInfo) -> String {
    if has_required_role(&vec![UserRole::Project, ]) {
        project_registration::update_project_docs(project_id, docs)
    } else {
        format!("you arn't have permissions to update someone's belongings")
    }
}

#[update]
fn update_team_member(project_id: String, team_member: TeamMember) -> String {
    if has_required_role(&vec![ UserRole::Project]) {
        project_registration::update_team_member(project_id, team_member)
    } else {
        "you hv n't registered as a user yet".to_string()
    }
}

#[update]
fn delete_project(id: String) -> std::string::String {
    project_registration::delete_project(id)
}

#[update]
fn verify_project_under_your_hub(project_id: String) -> String {
    project_registration::verify_project(&project_id)
}

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

#[update]
fn add_suggestion_caller(content: String, project_id: String) -> (u64, String) {
    roadmap_suggestion::add_suggestion(content, project_id)
}

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

    let roles_to_assign = vec![UserRole::Mentor];

    assign_roles_to_principal(roles_to_assign);

    "mentor got registered".to_string()
}

#[query]

 fn get_mentor_candid() -> Option<MentorProfile> {
    mentor::get_mentor()
}

#[update]
fn delete_mentor_candid() -> String {
    mentor::delete_mentor()
}

#[update]

 fn update_mentor_profile(updated_profile: MentorProfile) -> String {
    let required_roles = [UserRole::Mentor];

    if has_required_role(&required_roles) {
        mentor::update_mentor(updated_profile)
    } else {
        "I am sorry, you don't hv access to this function!".to_string()
    }
}

#[update]

 fn make_active_inactive_mentor(id: Principal) -> String {
    mentor::make_active_inactive(id)
}

#[query]

 fn get_all_mentors_candid() -> Vec<MentorProfile> {
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

#[update]

 async fn register_venture_capitalist_caller(params: VentureCapitalist) -> String {
    let roles_to_assign = vec![UserRole::VC];
    vc_registration::register_venture_capitalist(params).await;
    assign_roles_to_principal(roles_to_assign)
}

#[query]

 fn get_venture_capitalist_info() -> Option<VentureCapitalist> {
    vc_registration::get_vc_info()
}

#[query]

 fn list_all_venture_capitalist() -> Vec<VentureCapitalist> {
    vc_registration::list_all_vcs()
}

#[update]

 fn update_venture_capitalist_caller(params: VentureCapitalist) -> String {
    let required_roles = [UserRole::VC];

    if has_required_role(&required_roles) {
        vc_registration::update_venture_capitalist(params);
        "updation done".to_string()
    } else {
        "I am sorry, you don't hv access to this function!".to_string()
    }
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
fn get_hubs_principal_using_region(region: String) -> Vec<String> {
    hub_organizer::get_hub_organizer_principals_by_region(region)
}

#[query]
fn greet(name: String) -> String {
    format!("Hello! {}", name)
}

#[update]
fn send_connection_request(mentor_id: Principal, msg: String) -> String{
    notification::send_connection_request(mentor_id, msg)
}

#[query]
 fn view_notifications_candid(mentor_id: Principal) -> Vec<Notification> {
    notification::view_notifications(mentor_id)
}

#[update]
 fn respond_to_connection_request_candid(startup_id: Principal, accept: bool) -> String {
    notification::respond_to_connection_request(startup_id, accept)
}

//Hub Organizers
#[update]

 async fn register_hub_organizer_candid(
    form: hub_organizer::HubOrganizerRegistration,
) -> String {
    let reg_response = hub_organizer::register_hub_organizer(form).await;
    let roles_to_assign = vec![UserRole::ICPHubOrganizer];
    let assigned = assign_roles_to_principal(roles_to_assign);
    //if assigned { return format!("roles assigned")}
    reg_response
}

#[query]

 fn get_hub_organizer_candid() -> Option<UniqueHubs> {
    hub_organizer::get_hub_organizer()
}

#[update]

 fn update_hub_organizer_candid(params: HubOrganizerRegistration) -> String {
    let required_role = vec![UserRole::ICPHubOrganizer];

    if has_required_role(&required_role) {
        hub_organizer::update_hub_organizer(params)
    } else {
        "you don't have access to this function".to_string()
    }
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

 fn calculate_average_api(project_id: String) -> Option<f64> {
    ratings::calculate_average(&project_id)
}

#[query]

 fn get_main_level_ratings(project_id: String) -> HashMap<MainLevel, MainLevelRatings> {
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
 fn get_admin_notifications(caller: Principal) -> Vec<admin::Notification> {
    admin::get_admin_notifications(caller)
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

export_candid!();

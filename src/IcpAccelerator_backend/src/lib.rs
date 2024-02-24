mod hub_organizer;
mod leaderboard;
mod manage_hubs;
mod mentor;
mod notification;
mod project_like;
mod roles;
mod upvotes;
mod vc_registration;

use hub_organizer::{HubOrganizerRegistration, UniqueHubs};
use ic_cdk::api::caller;
use ic_kit::candid::{candid_method, export_service};
use leaderboard::{LeaderboardEntryForLikes, LeaderboardEntryForUpvote};
use project_like::LikeRecord;
use roles::{get_roles, RolesResponse};
use std::collections::HashSet;

use manage_hubs::{get_icp_hubs, IcpHub};
use mentor::MentorProfile;
use upvotes::UpvoteRecord;

mod project_registration;
mod rbac;
mod register_user;
mod roadmap_suggestion;

use rbac::{assign_roles_to_principal, has_required_role, UserRole};

use candid::Principal;
use ic_cdk_macros::{pre_upgrade, query, update};
use project_registration::{AreaOfFocus, DocsInfo, ProjectInfo, TeamMember};
use register_user::FounderInfo;
use roadmap_suggestion::{Status, Suggestion};
use upvotes::UpvoteStorage;
use vc_registration::VentureCapitalist;

use crate::notification::Notification;

// #[pre_upgrade]
// fn pre_upgrade() {
//     mentor::mentor_specific_pre_upgrade_actions();
// }

#[pre_upgrade]
fn pre_upgrade() {
    register_user::pre_upgrade();
    project_registration::pre_upgrade();
    roadmap_suggestion::pre_upgrade();
}

// #[post_upgrade]
// fn post_upgrade() {
//     mentor::mentor_specific_post_upgrade_actions();
// }

#[query]
#[candid_method(query)]
pub fn get_role_from_p_id() -> Option<HashSet<UserRole>> {
    rbac::get_role_from_principal()
}

#[update]
#[candid_method(update)]
async fn register_founder_caller(profile: FounderInfo) -> String {
    let role = vec![UserRole::Founder, UserRole::Project];
    register_user::register_founder(profile).await;
    assign_roles_to_principal(role)
}

#[query]
#[candid_method(query)]
fn get_founder_info_caller() -> Option<FounderInfo> {
    register_user::get_founder_info()
}

#[query]
#[candid_method(query)]
fn list_all_founders_caller() -> Vec<register_user::FounderInfo> {
    register_user::list_all_founders()
}

#[update]
#[candid_method(update)]
fn delete_founder_caller() -> std::string::String {
    register_user::delete_founder()
}

#[update]
#[candid_method(update)]
fn update_founder_caller(updated_profile: FounderInfo) -> String {
    if has_required_role(&vec![UserRole::Founder, UserRole::Project]) {
        register_user::update_founder(updated_profile)
    } else {
        "you are not supposed to change someone profile".to_string()
    }
}

#[update]
#[candid_method(update)]
async fn create_project(params: ProjectInfo) -> String {
    if has_required_role(&vec![UserRole::Founder, UserRole::Project]) {
        project_registration::create_project(params).await
    } else {
        "you hv n't registered as a user yet".to_string()
    }
    // assign_roles_to_principal(roles)
}

#[query]
#[candid_method(query)]
fn get_projects_for_caller() -> Vec<ProjectInfo> {
    project_registration::get_projects_for_caller()
}

#[query]
#[candid_method(query)]
fn list_all_projects() -> Vec<ProjectInfo> {
    project_registration::list_all_projects()
}

#[update]
#[candid_method(update)]
fn update_project(project_id: String, updated_project: ProjectInfo) -> String {
    if has_required_role(&vec![UserRole::Founder, UserRole::Project]) {
        project_registration::update_project(project_id, updated_project);
        "updation success".to_string()
    } else {
        "you are not supposed to change someone profile".to_string()
    }
}

#[update]
#[candid_method(update)]
fn update_project_docs(project_id: String, docs: DocsInfo) -> String {
    if has_required_role(&vec![UserRole::Project, UserRole::Founder]) {
        project_registration::update_project_docs(project_id, docs);
        format!("project docs got updated")
    } else {
        format!("you arn't have permissions to update someone's belongings")
    }
}

#[update]
#[candid_method(update)]
fn update_team_member(project_id: String, team_member: TeamMember) -> String {
    if has_required_role(&vec![UserRole::Founder, UserRole::Project]) {
        project_registration::update_team_member(project_id, team_member);
        "team members updated sucessfully".to_string()
    } else {
        "you hv n't registered as a user yet".to_string()
    }
}

#[update]
#[candid_method(update)]
fn delete_project(id: String) -> std::string::String {
    project_registration::delete_project(id)
}

#[update]
#[candid_method(update)]
fn like_project(project_id: String) -> std::string::String {
    project_like::like_project(project_id)
}

#[query]
#[candid_method(query)]
fn get_user_likes(project_id: String) -> Option<LikeRecord> {
    project_like::get_user_likes(project_id)
}

#[update]
#[candid_method(update)]
fn add_suggestion_caller(content: String) -> (u64, Status) {
    roadmap_suggestion::add_suggestion(content)
}

#[update]
#[candid_method(update)]
fn update_suggestion_status_caller(id: u64, status: Status) {
    roadmap_suggestion::update_suggestion_status(id, status);
}

#[query]
#[candid_method(query)]
fn get_suggestions_by_status_caller(status: Status) -> Vec<Suggestion> {
    roadmap_suggestion::get_suggestions_by_status(status)
}

#[update]
#[candid_method(update)]
fn reply_to_suggestion_caller(parent_id: u64, reply_content: String) -> (u64, Status) {
    roadmap_suggestion::reply_to_suggestion(parent_id, reply_content)
}

#[query]
#[candid_method(query)]
fn get_suggestions_by_parent_id_caller(parent_id: u64) -> Vec<Suggestion> {
    roadmap_suggestion::get_suggestions_by_parent_id(parent_id)
}

#[query]
#[candid_method(query)]
fn get_total_suggestions() -> u64 {
    roadmap_suggestion::get_total_suggestions_count()
}

#[query]
#[candid_method(query)]
fn get_all_roles() -> RolesResponse {
    get_roles() // Call the get_roles function from the roles module
}

#[update]
#[candid_method(update)]
async fn register_mentor_candid(profile: MentorProfile) -> std::string::String {
    let start = ic_cdk::api::instruction_counter();
    ic_cdk::println!("instructions start {}",start);
    
    mentor::register_mentor(profile).await;

    let roles_to_assign = vec![UserRole::Mentor];

    assign_roles_to_principal(roles_to_assign);
    let end = ic_cdk::api::instruction_counter();

   
    ic_cdk::println!("instructions end {}", end);
    ic_cdk::println!("instructions {}", end - start);
    //record_measurement(end - start);
    "mentor got registered".to_string()
}

#[query]
#[candid_method(query)]
pub fn get_mentor_candid() -> Option<MentorProfile> {
    mentor::get_mentor()
}

#[update]
#[candid_method(update)]
pub fn delete_mentor_candid() -> String {
    mentor::delete_mentor()
}

#[update]
#[candid_method(update)]
pub fn update_mentor_profile(updated_profile: MentorProfile) -> String {
    let required_roles = [UserRole::Mentor];

    if has_required_role(&required_roles) {
        mentor::update_mentor(updated_profile)
    } else {
        "I am sorry, you don't hv access to this function!".to_string()
    }
}

#[update]
#[candid_method(update)]
pub fn make_active_inactive_mentor(id : Principal) -> String{
    mentor::make_active_inactive(id)
}

#[query]
#[candid_method(query)]
pub fn get_all_mentors_candid() -> Vec<MentorProfile> {
    mentor::get_all_mentors()
}

#[update]
#[candid_method(update)]
pub fn upvote_project(project_id: String) -> std::string::String {
    upvotes::upvote(project_id)
}

#[query]
#[candid_method(query)]
pub fn get_project_upvotes(project_id: String) -> Option<UpvoteRecord> {
    upvotes::get_upvote_record(project_id)
}

#[update]
#[candid_method(update)]
pub async fn register_venture_capitalist_caller(params: VentureCapitalist) -> String {
    let roles_to_assign = vec![UserRole::VC];
    vc_registration::register_venture_capitalist(params).await;
    assign_roles_to_principal(roles_to_assign)
}

#[query]
#[candid_method(query)]
pub fn get_venture_capitalist_info() -> Option<VentureCapitalist> {
    vc_registration::get_vc_info()
}

#[query]
#[candid_method(query)]
pub fn list_all_venture_capitalist() -> Vec<VentureCapitalist> {
    vc_registration::list_all_vcs()
}

#[update]
#[candid_method(update)]
pub fn update_venture_capitalist_caller(params: VentureCapitalist) -> String {
    let required_roles = [UserRole::VC];

    if has_required_role(&required_roles) {
        vc_registration::update_venture_capitalist(params);
        "updation done".to_string()
    } else {
        "I am sorry, you don't hv access to this function!".to_string()
    }
}

#[update]
#[candid_method(update)]
pub fn delete_venture_capitalist_caller() -> std::string::String {
    vc_registration::delete_venture_capitalist()
}

#[query]
#[candid_method(query)]
fn get_icp_hubs_candid() -> Vec<IcpHub> {
    get_icp_hubs()
}

// #[query]
// #[candid_method(query)]
// fn greet() -> String {
//     let principal_id = caller().to_string();
//     format!("principal id - : {:?}", principal_id)
// }

#[query]
fn greet(name: String) -> String {
    format!("Hello! {}", name)
}

#[update]
#[candid_method(update)]
fn send_connection_request(mentor_id: Principal, msg: String) {
    notification::send_connection_request(mentor_id, msg)
}

#[query]
#[candid_method(query)]
pub fn view_notifications_candid(mentor_id: Principal) -> Vec<Notification> {
    notification::view_notifications(mentor_id)
}

#[update]
#[candid_method(update)]
pub fn respond_to_connection_request_candid(
    mentor_id: Principal,
    startup_id: Principal,
    accept: bool,
) {
    notification::respond_to_connection_request(mentor_id, startup_id, accept);
}

//Hub Organizers
#[update]
#[candid_method(update)]
pub async fn register_hub_organizer_candid(
    form: hub_organizer::HubOrganizerRegistration,
) -> String {
    hub_organizer::register_hub_organizer(form).await;
    let roles_to_assign = vec![UserRole::HubOrganizer];
    assign_roles_to_principal(roles_to_assign)
}

#[query]
#[candid_method(query)]
pub fn get_hub_organizer_candid() -> Option<UniqueHubs> {
    hub_organizer::get_hub_organizer()
}

#[update]
#[candid_method(update)]
pub fn update_hub_organizer_candid(params: HubOrganizerRegistration) -> String {
    let required_role = vec![UserRole::HubOrganizer];

    if has_required_role(&required_role) {
        hub_organizer::update_hub_organizer(params)
    } else {
        "you don't have access to this function".to_string()
    }
}

#[query]
#[candid_method(query)]
pub fn get_leaderboard_using_upvotes() -> Vec<LeaderboardEntryForUpvote> {
    leaderboard::get_leaderboard_by_upvotes()
}

#[query]
#[candid_method(query)]
pub fn get_leaderboard_using_likes() -> Vec<LeaderboardEntryForLikes> {
    leaderboard::get_leaderboard_by_likes()
}

//made for admin side.....
// #[query]
// pub fn get_role() -> RolesResponse {
//     roles::get_roles()
// }
// made for admin side.....
#[query]
pub fn get_role() -> RolesResponse {
    roles::get_roles()
}

#[query]
#[candid_method(query)]
pub fn get_my_id() -> Principal{
    caller()
}

// #[update]
// pub fn add_roles(name: String) -> Role {
//     roles::add_role(name)
// }

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn save_candid() {
        use std::env;
        use std::fs::write;
        use std::path::PathBuf;

        let dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
        let dir = dir.parent().unwrap().parent().unwrap().join("candid");

        write(dir.join("/home/harshpreet-singh/Documents/quadb/axxxelerator-new/ICPAccelerator/src/IcpAccelerator_backend/IcpAccelerator_backend.did"), export_candid()).expect("Write failed.");
    }
}

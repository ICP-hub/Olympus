use crate::state_handler::*;
use crate::project_module::project_types::*;
use crate::user_modules::get_user::*;
use crate::types::individual_types::*;
use crate::project_module::get_project::*;
use crate::guard::*;
use candid::Principal;
use ic_cdk::api::call::call;
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::time;
use ic_cdk_macros::update;
use serde_bytes::ByteBuf;
use sha2::{Digest, Sha256};

fn record_measurement(measurement: u64) {
    ic_cdk::println!("Instructions used: {}", measurement);
}

#[update(guard = "combined_guard")]
pub async fn register_project(info: ProjectInfo) -> String {
    let initial_cycles = ic_cdk::api::canister_balance();
    if info.private_docs.is_some() && info.upload_private_documents != Some(true) {
        return "Cannot set private documents unless upload private docs has been set to true"
            .to_string();
    }

    let caller = caller();

    let has_mentor_role = read_state(|state| {
        state.role_status.get(&StoredPrincipal(caller)).map_or(false, |roles| {
            roles.0.iter().any(|role| role.name == "mentor" && (role.status == "approved" || role.status == "active"))
        })
    });

    if has_mentor_role {
        return "You are not allowed to get this role because you already have the Mentor role.".to_string();
    }

    let has_vc_role = read_state(|state| {
        state.role_status.get(&StoredPrincipal(caller)).map_or(false, |roles| {
            roles.0.iter().any(|role| role.name == "vc" && (role.status == "approved" || role.status == "active"))
        })
    });

    if has_vc_role {
        return "You are not allowed to get this role because you already have the Venture Capitalist role.".to_string();
    }

    let role_count = get_approved_role_count_for_principal(caller);
    if role_count >= 2 {
        return "You are not eligible for this role because you have 2 or more roles".to_string();
    }

    // Check if the caller has already registered a project or has one awaiting response
    let already_registered = read_state(|state| {
        state.project_storage.contains_key(&StoredPrincipal(caller))
            || state
                .project_awaits_response
                .contains_key(&StoredPrincipal(caller))
    });

    if already_registered {
        ic_cdk::println!("You can't create more than one project");
        return "You can't create more than one project".to_string();
    }

    match info.validate() {
        Ok(_) => {
            let uuids = raw_rand().await.unwrap().0;
            let uid = format!("{:x}", Sha256::digest(&uuids));
            let new_id = uid.clone().to_string();

            let _canister_id = crate::asset_manager::get_asset_canister();
            let info_with_default = change_project_images(caller, info.clone()).await;

            let mut new_project = ProjectInfoInternal {
                params: info_with_default,
                uid: new_id,
                is_active: true,
                is_verified: false,
                creation_date: time(),
                profile_completion: 0,
            };
            new_project.update_completion_percentage();

            mutate_state(|state| {
                state
                    .project_storage
                    .insert(StoredPrincipal(caller), Candid(vec![new_project.clone()]));
               
                let role_status = &mut state.role_status;
                if let Some(role_status_vec_candid) =
                    role_status.get(&StoredPrincipal(caller))
                {
                    let mut role_status_vec = role_status_vec_candid.0;
                    for role in role_status_vec.iter_mut() {
                        if role.name == "project" {
                            role.status = "approved".to_string();
                            role.approval_status = Some("approved".to_string());
                            break;
                        }
                    }
                    role_status.insert(StoredPrincipal(caller), Candid(role_status_vec));
                }
            });
            let final_cycles = ic_cdk::api::canister_balance();
    
            let cycles_consumed = initial_cycles - final_cycles;
            
            record_measurement(cycles_consumed);

            format!("Project created Succesfully with UID {}", new_project.uid)
        }
        Err(e) => format!("Validation error: {}", e),
    }
    
}

pub async fn change_project_images(
    caller: Principal,
    mut updated_project: ProjectInfo,
) -> ProjectInfo {
    let mut user_data = get_user_information_internal(caller);
    let temp_image = user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();
    let project_logo = updated_project.project_logo.clone();
    let project_cover = updated_project.project_cover.clone();

    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        user_data.profile_picture = Some((full_url).as_bytes().to_vec());
    } else if temp_image.clone().unwrap().len() < 300 {
        ic_cdk::println!("Profile image is already uploaded");
    } else {
        let key = "/uploads/".to_owned() + &caller.to_string() + "_user.jpeg";

        let arg = StoreArg {
            key: key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(temp_image.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset { key: key.clone() };

        let (_deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (_result,): ((),) = call(canister_id, "store", (arg,)).await.unwrap();

        user_data.profile_picture =
            Some((canister_id.to_string() + &key).as_bytes().to_vec());
    }

    if project_logo.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_project_logo.jpeg";
        updated_project.project_logo = Some((full_url).as_bytes().to_vec());
    } else if project_logo.clone().unwrap().len() < 300 {
        ic_cdk::println!("Project logo is already uploaded");
    } else {
        let project_logo_key = "/uploads/".to_owned() + &caller.to_string() + "_project_logo.jpeg";

        let project_logo_arg = StoreArg {
            key: project_logo_key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(project_logo.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset {
            key: project_logo_key.clone(),
        };

        let (_deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (_result,): ((),) = call(canister_id, "store", (project_logo_arg,))
            .await
            .unwrap();

        updated_project.project_logo = Some(
            (canister_id.to_string() + &project_logo_key)
                .as_bytes()
                .to_vec(),
        );
    }

    if project_cover.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_project_cover.jpeg";
        updated_project.project_cover = Some((full_url).as_bytes().to_vec());
    } else if project_cover.clone().unwrap().len() < 300 {
        ic_cdk::println!("Project logo is already uploaded");
    } else {
        let project_cover_key =
            "/uploads/".to_owned() + &caller.to_string() + "_project_cover.jpeg";

        let project_cover_arg = StoreArg {
            key: project_cover_key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(project_cover.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset {
            key: project_cover_key.clone(),
        };

        let (_deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (_result,): ((),) = call(canister_id, "store", (project_cover_arg,))
            .await
            .unwrap();

        updated_project.project_cover = Some(
            (canister_id.to_string() + &project_cover_key)
                .as_bytes()
                .to_vec(),
        );
    }

    updated_project
}

#[update(guard = "combined_guard")]
pub async fn update_project(project_id: String, mut updated_project: ProjectInfo) -> String {
    let caller = ic_cdk::caller();

    let is_owner = read_state(|state| {
        state
            .project_storage
            .iter()
            .any(|(stored_principal, project_infos)| {
                stored_principal.0 == caller && project_infos.0.iter().any(|p| p.uid == project_id)
            })
    });

    if !is_owner {
        return "Error: Only the project owner can request updates.".to_string();
    }

    updated_project = change_project_images(caller, updated_project.clone()).await;

    let update_result = mutate_state(|state| {
                if let Some( mut project_list) = state.project_storage.get(&StoredPrincipal(caller)) {
                    if let Some(project) = project_list.0.iter_mut().find(|p| p.uid == project_id) {
                        project.params.project_name = updated_project.project_name;
                        project.params.project_logo = updated_project.project_logo;
                        project.params.preferred_icp_hub = updated_project.preferred_icp_hub;
                        project.params.live_on_icp_mainnet = updated_project.live_on_icp_mainnet;
                        project.params.money_raised_till_now = updated_project.money_raised_till_now;
                        project.params.supports_multichain = updated_project.supports_multichain;
                        project.params.project_elevator_pitch = updated_project.project_elevator_pitch;
                        project.params.project_area_of_focus = updated_project.project_area_of_focus;
                        project.params.promotional_video = updated_project.promotional_video;
                        project.params.reason_to_join_incubator = updated_project.reason_to_join_incubator;
                        project.params.project_description = updated_project.project_description;
                        project.params.project_cover = updated_project.project_cover;
                        project.params.project_team = updated_project.project_team;
                        project.params.token_economics = updated_project.token_economics;
                        project.params.technical_docs = updated_project.technical_docs;
                        project.params.long_term_goals = updated_project.long_term_goals;
                        project.params.target_market = updated_project.target_market;
                        project.params.self_rating_of_project = updated_project.self_rating_of_project;
                        project.params.mentors_assigned = updated_project.mentors_assigned;
                        project.params.vc_assigned = updated_project.vc_assigned;
                        project.params.project_website = updated_project.project_website;
                        project.params.links = updated_project.links;

                        state.project_storage.insert(StoredPrincipal(caller), project_list.clone());
                        return Ok("Profile updated successfully");
                    }
                }
                return Err("No existing Project profile found to update.");
    });

    match update_result {
        Ok(message) => {
            message.to_string()
        },
        Err(error) => format!("Error processing request: {}", error),
    }
}

#[update(guard = "combined_guard")]
pub fn delete_project(id: String) -> std::string::String {
    let caller = ic_cdk::caller();

    let mut is_found = false;

    mutate_state(|state| {
        if let Some(mut projects) = state.project_storage.get(&StoredPrincipal(caller)) {
            for project in projects.0.iter_mut() {
                if project.uid == id {
                    project.is_active = false;
                    is_found = true;
                    break;
                }
            }
        }
    });

    if is_found {
        "Project Status Set To Inactive".to_string()
    } else {
        "Please Provide a Valid Project Id".to_string()
    }
}

pub fn find_project_owner_principal(project_id: &str) -> Option<Principal> {
    read_state(|state| {
        for (stored_principal, projects) in state.project_storage.iter() {
            if projects.0.iter().any(|p| p.uid == project_id) {
                return Some(stored_principal.0);
            }
        }
        None
    })
}

#[update(guard = "combined_guard")]
pub async fn update_team_member(project_id: String, member_principal_id: Principal) -> String {
    let member_uid = read_state(|state| {
        match state
            .user_storage
            .get(&StoredPrincipal(member_principal_id))
        {
            Some(user_internal) => user_internal.0.uid.clone(),
            None => panic!("You are not a user"),
        }
    });

    let user_info_result = get_user_information_using_uid(member_uid.clone()).await;

    let user_info = match user_info_result {
        Ok(info) => info,
        Err(err) => return format!("Failed to retrieve user info: {}", err),
    };

    let (project_found, member_added_or_updated) = mutate_state(|storage| {
        let mut project_found = false;
        let mut member_added_or_updated = false;
        let mut updated_project_info_list = None;
        for (project_owner, project_info_list) in storage.project_storage.iter() {
            for project_internal in project_info_list.0.iter() {
                if project_internal.uid == project_id {
                    project_found = true;

                    let mut project_info_list_clone = project_info_list.clone();

                    for project_internal in project_info_list_clone.0.iter_mut() {
                        if project_internal.uid == project_id {
                            if let Some(team) = &mut project_internal.params.project_team {
                                if let Some(member) = team.iter_mut().find(|m| m.member_uid == member_uid) {
                                    member.member_data = user_info.clone();
                                    member_added_or_updated = true;
                                } else {
                                    let new_team_member = TeamMember {
                                        member_uid: member_uid.clone(),
                                        member_data: user_info.clone(),
                                        member_principal: member_principal_id
                                    };
                                    team.push(new_team_member);
                                    member_added_or_updated = true;
                                }
                            } else {
                                let new_team_member = TeamMember {
                                    member_uid: member_uid.clone(),
                                    member_data: user_info.clone(),
                                    member_principal: member_principal_id
                                };
                                project_internal.params.project_team = Some(vec![new_team_member]);
                                member_added_or_updated = true;
                            }
                        }
                    }
                    updated_project_info_list = Some((project_owner.clone(), project_info_list_clone));
                    break;
                }
            }
        }

        if let Some((project_owner, project_info_list_clone)) = updated_project_info_list {
            storage.project_storage.insert(project_owner, project_info_list_clone);
        }

        (project_found, member_added_or_updated)
    });

    match (project_found, member_added_or_updated) {
        (true, true) => "Team member updated successfully.".to_string(),
        (true, false) => "Failed to update the team member in the specified project.".to_string(),
        _ => "Project not found.".to_string(),
    }
}

#[update(guard="combined_guard")]
pub async fn delete_team_member(project_id: String, member_principal_id: Principal) -> String {
    let member_uid = read_state(|state| {
        match state
            .user_storage
            .get(&StoredPrincipal(member_principal_id))
        {
            Some(user_internal) => user_internal.0.uid.clone(),
            None => {
                ic_cdk::println!("User not found in user_storage");
                return String::new();
            }
        }
    });

    if member_uid.is_empty() {
        return "User not found.".to_string();
    }

    let (project_found, member_deleted) = mutate_state(|storage| {
        let mut project_found = false;
        let mut member_deleted = false;
        let mut updated_project_info_list = None;

        for (project_owner, project_info_list) in storage.project_storage.iter() {
            for project_internal in project_info_list.0.iter() {
                if project_internal.uid == project_id {
                    project_found = true;

                    let mut project_info_list_clone = project_info_list.clone();

                    for project_internal in project_info_list_clone.0.iter_mut() {
                        if project_internal.uid == project_id {
                            if let Some(team) = &mut project_internal.params.project_team {
                                if let Some(pos) = team.iter().position(|m| m.member_uid == member_uid) {
                                    ic_cdk::println!("Removing team member with UID: {}", member_uid);
                                    team.remove(pos);
                                    member_deleted = true;
                                } else {
                                    ic_cdk::println!("Team member with UID: {} not found", member_uid);
                                }
                            } else {
                                ic_cdk::println!("No team members found for this project.");
                            }
                        }
                    }

                    updated_project_info_list = Some((project_owner.clone(), project_info_list_clone));
                    break;
                }
            }
        }

        if let Some((project_owner, project_info_list_clone)) = updated_project_info_list {
            storage.project_storage.insert(project_owner, project_info_list_clone);
        }

        (project_found, member_deleted)
    });

    match (project_found, member_deleted) {
        (true, true) => "Team member deleted successfully.".to_string(),
        (true, false) => "Failed to delete the team member from the specified project.".to_string(),
        _ => "Project not found.".to_string(),
    }
}

#[update(guard = "combined_guard")]
pub fn add_project_rating(ratings: ProjectRatingStruct) -> Result<String, String> {
    let principal = caller(); // Assuming `caller()` correctly retrieves the principal of the caller

    // Attempt to retrieve user data or return an error message if unavailable
    let user_data = get_user_information().clone().map_err(|e| e.to_string())?;
    ic_cdk::println!("User data retrieved: {:?}", user_data);

    // Check if the project ID exists
    let project_exists = check_project_exists(ratings.project_id.clone());
    ic_cdk::println!("Project exists: {}", project_exists); 

    if project_exists {
        // Check if the current user has already submitted a review for this project
        let already_rated = read_state(|state| {
            state
                .project_rating
                .get(&ratings.project_id)
                .map_or(false, |reviews| {
                    reviews
                        .0
                        .iter()
                        .any(|(user_principal, _)| *user_principal == principal)
                })
        });

        if already_rated {
            return Err("User has already rated this project.".to_string());
        }

        let project_review = ProjectReview::new(
            user_data.full_name,
            user_data
                .profile_picture
                .ok_or("Profile picture not found")?,
            ratings.message,
            ratings.rating,
        )
        .map_err(|e| e.to_string())?; // Gracefully handle the error
     ic_cdk::println!("Project review created: {:?}", project_review);

        mutate_state(|state| {
            if let Some(mut reviews) = state.project_rating.get(&ratings.project_id) {
                // Project exists and has reviews, add new review
                reviews.0.push((principal, project_review.clone()));
                ic_cdk::println!("Review added to existing project ID: {}", ratings.project_id);
                state.project_rating.insert(ratings.project_id.clone(), reviews.clone()); // Ensure the updated reviews are inserted back
            } else {
                // Project does not exist, create new vector and add review
                state.project_rating.insert(ratings.project_id.clone(), Candid(vec![(principal, project_review.clone())]));
                ic_cdk::println!("New reviews vector created and review added for project ID: {}", ratings.project_id);
            }
        });

        Ok("Rating added".to_string())
    } else {
        Err("Project with ID does not exist.".to_string())
    }
}
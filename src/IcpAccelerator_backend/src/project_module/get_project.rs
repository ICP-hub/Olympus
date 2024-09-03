use crate::state_handler::*;
use crate::project_module::project_types::*;
use crate::user_modules::user_types::*;
use crate::types::pagination_types::*;
use crate::user_modules::get_user::*;
use crate::guard::*;
use ic_cdk::caller;
use ic_cdk_macros::*;
use candid::Principal;
use std::collections::HashMap;

#[query(guard = "combined_guard")]
pub fn get_project_info_using_principal(
    caller: Principal,
) -> Option<(ProjectInfoInternal, UserInfoInternal)> {
    read_state(|state| {
        // Retrieve the project information
        let project_info = state
            .project_storage
            .get(&StoredPrincipal(caller))
            .and_then(|projects| projects.0.first().cloned());

        // Retrieve the user information based on the principal
        let user_info = state
            .user_storage
            .get(&StoredPrincipal(caller))
            .map(|candid_user_info| candid_user_info.0.clone());

    // Return both as a tuple if both are found
    match (project_info, user_info) {
        (Some(project), Some(user)) => Some((project, user)),
        _ => None, // Return None if either is not found
    }
})
}

pub fn _get_projects_for_caller() -> Vec<ProjectInfo> {
    let caller = ic_cdk::caller();
    read_state(|state| {
        if let Some(founder_projects) = state.project_storage.get(&StoredPrincipal(caller)) {
            founder_projects
                .0
                .iter()
                .map(|project_internal| project_internal.params.clone())
                .collect()
        } else {
            Vec::new()
        }
    })
}

#[query(guard = "combined_guard")]
pub fn get_my_project() -> (ProjectInfoInternal, UserInfoInternal) {
    let caller = ic_cdk::caller();
    read_state(|state| {
        let project_info = state
            .project_storage
            .get(&StoredPrincipal(caller))
            .and_then(|projects| projects.0.first().cloned())
            .expect("Couldn't get a project");

        let user_info = state
            .user_storage
            .get(&StoredPrincipal(caller))
            .map(|candid_user_info| candid_user_info.0.clone())
            .expect("Couldn't get user information");

        (project_info, user_info)
    })
}

#[query(guard = "combined_guard")]
pub fn get_project_id() -> String {
    let caller = ic_cdk::caller();
    read_state(|state| {
        state
            .project_storage
            .get(&StoredPrincipal(caller))
            .and_then(|projects| projects.0.first().map(|project| project.uid.clone()))
            .expect("Couldn't get project information")
    })
}

//this should only be for admin
#[query(guard = "combined_guard")]
pub fn get_project_using_id(project_id: String) -> Option<ProjectInfoInternal> {
    read_state(|state| {
        for (_, projects) in state.project_storage.iter() {
            if let Some(project) = projects.0.iter().find(|p| p.uid == project_id) {
                return Some(project.clone());
            }
        }
        None
    })
}

#[query(guard = "combined_guard")]
pub fn get_project_details_for_mentor_and_investor(
    project_id: String,
) -> ProjectPublicInfoInternal {
    let project_details = get_project_using_id(project_id.clone()).expect("project not found");
    let project_id = project_id.to_string().clone();

    let project = ProjectPublicInfo {
        project_id,
        project_name: project_details.params.project_name,
        project_logo: project_details.params.project_logo,
        preferred_icp_hub: project_details.params.preferred_icp_hub,
        live_on_icp_mainnet: project_details.params.live_on_icp_mainnet,
        money_raised_till_now: project_details.params.money_raised_till_now,
        supports_multichain: project_details.params.supports_multichain,
        project_elevator_pitch: project_details.params.project_elevator_pitch,
        project_area_of_focus: project_details.params.project_area_of_focus,
        promotional_video: project_details.params.promotional_video,
        reason_to_join_incubator: project_details.params.reason_to_join_incubator,
        project_description: project_details.params.project_description,
        project_cover: project_details.params.project_cover,
        project_team: project_details.params.project_team,
        token_economics: project_details.params.token_economics,
        technical_docs: project_details.params.technical_docs,
        long_term_goals: project_details.params.long_term_goals,
        target_market: project_details.params.target_market,
        self_rating_of_project: project_details.params.self_rating_of_project,
        project_website: project_details.params.project_website,
        links: project_details.params.links,
        upload_private_documents: project_details.params.upload_private_documents,
        public_docs: project_details.params.public_docs,
        dapp_link: project_details.params.dapp_link,
    };

    let project_internal = ProjectPublicInfoInternal {
        params: project,
        uid: project_details.uid,
        is_active: project_details.is_active,
        is_verified: project_details.is_verified,
        creation_date: project_details.creation_date,
    };

    project_internal
}

#[query(guard = "combined_guard")]
pub fn get_project_public_information_using_id(project_id: String) -> ProjectPublicInfoInternal {
    let project_details = get_project_using_id(project_id.clone()).expect("project not found");
    let project_id = project_id.to_string().clone();

    let project = ProjectPublicInfo {
        project_id,
        project_name: project_details.params.project_name,
        project_logo: project_details.params.project_logo,
        preferred_icp_hub: project_details.params.preferred_icp_hub,
        live_on_icp_mainnet: project_details.params.live_on_icp_mainnet,
        money_raised_till_now: project_details.params.money_raised_till_now,
        supports_multichain: project_details.params.supports_multichain,
        project_elevator_pitch: project_details.params.project_elevator_pitch,
        project_area_of_focus: project_details.params.project_area_of_focus,
        promotional_video: project_details.params.promotional_video,
        reason_to_join_incubator: project_details.params.reason_to_join_incubator,
        project_description: project_details.params.project_description,
        project_cover: project_details.params.project_cover,
        project_team: project_details.params.project_team,
        token_economics: project_details.params.token_economics,
        technical_docs: project_details.params.technical_docs,
        long_term_goals: project_details.params.long_term_goals,
        target_market: project_details.params.target_market,
        self_rating_of_project: project_details.params.self_rating_of_project,
        project_website: project_details.params.project_website,
        links: project_details.params.links,
        upload_private_documents: project_details.params.upload_private_documents,
        public_docs: project_details.params.public_docs,
        dapp_link: project_details.params.dapp_link,
    };

    let project_internal = ProjectPublicInfoInternal {
        params: project,
        uid: project_details.uid,
        is_active: project_details.is_active,
        is_verified: project_details.is_verified,
        creation_date: project_details.creation_date,
    };

    project_internal
}


#[query(guard = "combined_guard")]
pub fn list_all_projects() -> Vec<(ProjectInfoInternal, UserInfoInternal)> {
    let projects_snapshot = read_state(|state| {
        state.project_storage.iter().map(|(principal, project_infos)| {
            (principal.clone(), project_infos.0.clone())  // Clone the data to use outside the state borrow
        }).collect::<Vec<_>>()
    });
    
    let mut projects_with_users: Vec<(ProjectInfoInternal, UserInfoInternal)> = Vec::new();
    
    for (stored_principal, project_infos) in projects_snapshot {
        for project_info in project_infos {
            if project_info.is_active {
                let user_info = read_state(|state| {
                    state.user_storage.get(&stored_principal)
                    .map(|candid_user_info| candid_user_info.0.clone())
                });
                
                if let Some(user_info) = user_info {
                    projects_with_users.push((project_info, user_info));
                }
            }
        }
    }
    projects_with_users
}

#[query(guard = "combined_guard")]
pub fn list_all_projects_with_pagination(
    pagination_params: PaginationParams,
) -> PaginationReturnProjectData {
    let (projects_snapshot, project_count) = read_state(|state| {
        // Debugging: Output total projects before filtering
        ic_cdk::println!("Total Projects in Storage: {}", state.project_storage.len());

        let filtered_projects: Vec<_> = state.project_storage.iter()
            .filter(|(_, project_infos)| {
                let is_valid = project_infos.0.iter().any(|project_info| 
                    project_info.is_active && project_info.params.live_on_icp_mainnet.unwrap_or(true) // Assume true if null
                );
                // Debugging: Check each project's status
                println!("Project Active and Live on ICP: {}", is_valid);
                is_valid
            })
            .collect();

        // Debugging: Output number of filtered projects
        ic_cdk::println!("Filtered Projects Count: {}", filtered_projects.len());

        let project_count = filtered_projects.len();
        let start = (pagination_params.page - 1) * pagination_params.page_size;

        // Debugging: Check pagination start and size
        ic_cdk::println!("Pagination Start Index: {}, Page Size: {}", start, pagination_params.page_size);

        let projects_snapshot = filtered_projects.iter()
            .skip(start)
            .take(pagination_params.page_size)
            .map(|(principal, project_infos)| {
                (principal.clone(), project_infos.0.clone())
            })
            .collect::<Vec<_>>();

        // Debugging: Output the snapshot size
        ic_cdk::println!("Projects Snapshot Size for Current Page: {}", projects_snapshot.len());

        (projects_snapshot, project_count)
    });

    let mut data: Vec<(Principal, ListAllProjects, UserInformation)> = Vec::new();

    for (stored_principal, project_infos) in projects_snapshot {
        for project_info in project_infos {
            if project_info.is_active && project_info.params.live_on_icp_mainnet.unwrap_or(false) {
                let get_rating = crate::ratings_module::rubric_ratings::calculate_average(project_info.uid.clone());
                let project_info_struct = ListAllProjects {
                    params: project_info.clone(),
                    overall_average: get_rating.overall_average.get(0).cloned(),
                };
                
                let user_info = get_user_information_internal(stored_principal.0);

                data.push((stored_principal.0.clone(), project_info_struct, user_info));
                // Debugging: Output project info being added
                ic_cdk::println!("Adding Project: {}", project_info.params.project_name);
            }
        }
    }

    // Debugging: Output final count and data size
    ic_cdk::println!("Final Data Size: {}, Project Count: {}", data.len(), project_count);

    PaginationReturnProjectData {
        data,
        count: project_count as u64,
    }
}




#[query(guard = "combined_guard")]
pub fn filter_projects(criteria: FilterCriteria) -> Vec<ProjectInfo> {
    read_state(|projects| {
        projects
            .project_storage
            .iter()
            .flat_map(|(_, project_list)| project_list.0.clone().into_iter())
            .filter(|project_internal| {
                // let country_match = criteria
                //     .country
                //     .as_ref()
                //     .map_or(true, |c| &project_internal.params.user_data.country == c);

                let rating_match = criteria.rating_range.map_or(true, |(min, max)| {
                    project_internal.params.self_rating_of_project >= min
                        && project_internal.params.self_rating_of_project <= max
                });

                let focus_match = criteria.area_of_focus.as_ref().map_or(true, |focus| {
                    &project_internal.params.project_area_of_focus == focus
                });

                // let mentor_match = criteria.mentor_name.as_ref().map_or(true, |mentor_name| {
                //     project_internal
                //         .params
                //         .mentors_assigned
                //         .as_ref()
                //         .map_or(false, |mentors| {
                //             mentors
                //                 .iter()
                //                 .any(|mentor| mentor.user_data.full_name.contains(mentor_name))
                //         })
                // });

                // let vc_match = criteria.vc_name.as_ref().map_or(true, |vc_name| {
                //     project_internal
                //         .params
                //         .vc_assigned
                //         .as_ref()
                //         .map_or(false, |vcs| {
                //             vcs.iter().any(|vc| vc.name_of_fund.contains(vc_name))
                //         })
                // });

                rating_match && focus_match 
            })
            .map(|project_internal| project_internal.params.clone())
            .collect()
    })
}

#[query(guard = "combined_guard")]
pub fn get_project_info_for_user(project_id: String) -> Option<ProjectInfoForUserInternal> {
    let community_ratings = crate::ratings_module::rubric_ratings::calculate_average(project_id.clone());

    read_state(|storage| {
        let projects = storage.project_storage.iter();

        projects
            .flat_map(|(_, project_list)| project_list.0.clone().into_iter())
            .find(|project_internal| project_internal.uid == project_id)
            .map(|project_internal| ProjectInfoForUserInternal {
                params: ProjectInfoForUser {
                    project_name: Some(project_internal.params.project_name.clone()),
                    project_logo: project_internal.params.project_logo.clone(),
                    project_description: project_internal.params.project_description.clone(),
                    community_rating: Some(community_ratings),
                    project_cover: project_internal.params.project_cover.clone(),
                    project_website: project_internal.params.project_website.clone(),
                    promotional_video: project_internal.params.promotional_video.clone(),
                    project_team: project_internal.params.project_team.clone(),
                    dapp_link: project_internal.params.dapp_link.clone(),
                    weekly_active_users: project_internal.params.weekly_active_users.clone(),
                    date_of_joining: Some(project_internal.creation_date),
                    team_member_info: project_internal.params.project_team.clone(),
                    links: project_internal.params.links.clone(),
                    live_link_of_project: project_internal.params.dapp_link.clone(),
                    area_of_focus: Some(project_internal.params.project_area_of_focus.clone()),
                    country_of_project: project_internal.params.preferred_icp_hub.clone(),
                },
            })
    })
}

#[update(guard = "combined_guard")]
pub fn make_project_active_inactive(p_id: Principal, project_id: String) -> String {
    let principal_id = caller();
    if p_id == principal_id || ic_cdk::api::is_controller(&principal_id) {
        mutate_state(|storage| {
            // First, try to get the vector of ProjectDetail associated with p_id
            if let Some(mut projects) = storage.project_storage.get(&StoredPrincipal(p_id)) {
                // Find the project with the matching project_id
                if let Some(project) = projects.0.iter_mut().find(|p| p.uid == project_id) {
                    // Toggle the is_active flag and return a message accordingly
                    project.is_active = !project.is_active;
                    if project.is_active {
                        "Project made active".to_string()
                    } else {
                        "Project made inactive".to_string()
                    }
                } else {
                    // Project with the given id not found in the vector
                    "Project not found".to_string()
                }
            } else {
                // p_id not found in the storage
                "Profile not found".to_string()
            }
        })
    } else {
        "You are not authorized to use this function".to_string()
    }
}

pub fn check_project_exists(project_id: String) -> bool {
    get_project_using_id(project_id).is_some()
}

#[query(guard = "combined_guard")]
fn get_project_ratings(
    project_id: String,
) -> Result<(Option<Vec<(Principal, ProjectReview)>>, f32, bool), String> {
    let caller = caller(); // Assuming this retrieves the current user's principal
    let (ratings, average_rating, caller_present) = read_state(|state| {
        match state.project_rating.get(&project_id) {
            Some(ratings) => {
                let total_ratings = ratings.0.len() as f32;
                if total_ratings == 0.0 {
                    // No ratings exist for the project
                    (Some(vec![]), 0.0, false)
                } else {
                    let sum_ratings: u32 = ratings.0.iter().map(|(_, review)| review.rating).sum();
                    let average_rating = sum_ratings as f32 / total_ratings;
                    let caller_present =
                        ratings.0.iter().any(|(principal, _)| principal == &caller);
                    (Some(ratings.0.clone()), average_rating, caller_present)
                }
            }
            None => (None, 0.0, false),
        }
    });
    if let Some(ratings) = ratings {
        Ok((Some(ratings), average_rating, caller_present))
    } else {
        Err("No ratings found for the specified project ID.".to_string())
    }
}

#[query(guard = "combined_guard")]
pub fn get_frequent_reviewers() -> Vec<UserInfoInternal> {
    let mut review_count: HashMap<Principal, usize> = HashMap::new();

    read_state(|state| {
        for (_project_id, ratings) in state.project_rating.iter() {
            for (principal, _) in ratings.0.iter() {
                *review_count.entry(*principal).or_insert(0) += 1;
            }
        }
    });

    let frequent_reviewers = review_count
        .into_iter()
        .filter_map(|(principal, count)| {
            if count > 5 {
                get_user_info_using_principal(principal)
            } else {
                None
            }
        })
        .collect::<Vec<_>>();

    frequent_reviewers
}


#[query(guard = "combined_guard")]
pub fn filter_projects_by_live_status(is_live: bool) -> Vec<ProjectInfo> {
    read_state(|projects| {
        projects
            .project_storage
            .iter()
            .flat_map(|(_, project_list)| project_list.0.clone().into_iter())
            .filter(|project_internal| {
                project_internal.params.live_on_icp_mainnet == Some(is_live)
            })
            .map(|project_internal| project_internal.params.clone())
            .collect()
    })
}

use crate::{state_handler::*, UserInfoInternal};
use crate::cohort_module::cohort_types::*;
use crate::project_module::project_types::*;
use crate::mentor_module::mentor_types::*;
use crate::vc_module::vc_types::*;
use crate::guard::*;
use ic_cdk_macros::*;
use crate::types::pagination_types::*;
use candid::Principal;


#[query(guard = "combined_guard")]
pub fn get_cohort(cohort_id: String) -> CohortDetails {
    read_state(|state| {
        state
            .cohort_info
            .get(&cohort_id)
            .expect("You have not created a cohort")
            .0
            .clone()
    })
}

#[query(guard = "combined_guard")]
pub fn get_cohorts_by_principal(principal_id: Principal) -> Vec<CohortDetails> {
    read_state(|state| {
        state
            .cohort_info
            .iter()
            .filter_map(|(_cohort_id, cohort_data)| {
                if cohort_data.0.cohort_creator == principal_id {
                    Some(cohort_data.0.clone())
                } else {
                    None
                }
            })
            .collect()
    })
}

#[query(guard = "combined_guard")]
pub fn get_all_cohorts(pagination_params: Pagination, cohort_type: String) -> PaginationReturnCohort {
    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let current_time = ic_cdk::api::time(); 

    let filtered_data: Vec<CohortDetails> = read_state(|state| {
        let cohorts = state.cohort_info.iter()
            .map(|(_key, candid_cohort_details)| candid_cohort_details.0.clone())
            .collect::<Vec<_>>();

        match cohort_type.as_str() {
            "Upcoming" => cohorts
                .into_iter()
                .filter(|cohort| cohort.cohort.start_date > current_time.to_string())
                .collect(),
            "Present" => cohorts
                .into_iter()
                .filter(|cohort| {
                    cohort.cohort.start_date <= current_time.to_string()
                        && cohort.cohort.cohort_end_date >= current_time.to_string()
                })
                .collect(),
            "Past" => cohorts
                .into_iter()
                .filter(|cohort| cohort.cohort.cohort_end_date < current_time.to_string())
                .collect(),
            _ => vec![], 
        }
    });

    let paginated_data = filtered_data
        .iter()
        .skip(start)
        .take(pagination_params.page_size)
        .cloned()
        .collect::<Vec<_>>();

    let total_count = filtered_data.len();

    PaginationReturnCohort {
        data: paginated_data, 
        total_count,
        upoming_cohorts: vec![], 
        present_cohorts: vec![], 
        past_cohorts: vec![],  
    }
}



#[query(guard = "combined_guard")]
pub fn get_pending_cohort_enrollment_requests(
    mentor_principal: Principal,
) -> Vec<CohortEnrollmentRequest> {
    ic_cdk::println!("Fetching pending cohort enrollment requests for principal: {:?}", mentor_principal);

    let pending_requests = read_state(|state| {
        state
            .cohort_enrollment_request
            .get(&StoredPrincipal(mentor_principal))
            .map_or_else(
                || {
                    ic_cdk::println!("No enrollment requests found for principal: {:?}", mentor_principal);
                    Vec::new()
                },
                |request_list| {
                    let pending: Vec<_> = request_list
                        .0
                        .iter()
                        .filter(|request| request.request_status == "pending")
                        .cloned()
                        .collect();

                    ic_cdk::println!("Found {} pending requests for principal: {:?}", pending.len(), mentor_principal);
                    pending
                },
            )
    });

    ic_cdk::println!("Total pending requests returned: {}", pending_requests.len());
    pending_requests
}

#[query(guard = "combined_guard")]
pub fn get_accepted_cohort_enrollment_requests(
    mentor_principal: Principal,
) -> Vec<CohortEnrollmentRequest> {
    read_state(|state| {
        state
            .cohort_enrollment_request
            .get(&StoredPrincipal(mentor_principal))
            .map_or_else(
                Vec::new,
                |request_list| {
                    request_list
                        .0
                        .iter()
                        .filter(|request| request.request_status == "accepted")
                        .cloned()
                        .collect()
                },
            )
    })
}

#[query(guard = "combined_guard")]
pub fn get_rejected_cohort_enrollment_requests(
    mentor_principal: Principal,
) -> Vec<CohortEnrollmentRequest> {
    read_state(|state| {
        state
            .cohort_enrollment_request
            .get(&StoredPrincipal(mentor_principal))
            .map_or_else(
                Vec::new,
                |request_list| {
                    request_list
                        .0
                        .iter()
                        .filter(|request| request.request_status == "rejected")
                        .cloned()
                        .collect()
                },
            )
    })
}

#[query(guard = "combined_guard")]
pub fn get_no_of_individuals_applied_for_cohort_using_id(cohort_id: String) -> Result<u8, String> {
    let count: Option<u64> = read_state(|state| state.applier_count.get(&cohort_id));

    let project_count_in_cohort: u8 = match count {
        Some(count) => {
            if let Ok(count_u8) = count.try_into() {
                count_u8
            } else {
                return Err("The number of applicants is too large to fit into a u8".to_string());
            }
        }
        None => return Err("No one has applied for this cohort".to_string()),
    };

    Ok(project_count_in_cohort.try_into().unwrap())
}

#[query(guard = "combined_guard")]
pub fn get_projects_applied_for_cohort(
    cohort_id: String,
) -> Result<Vec<(ProjectInfoInternal, UserInfoInternal, Principal)>, String> {
    let projects_in_cohort_with_users: Vec<(ProjectInfoInternal, UserInfoInternal, Principal)> = read_state(|state| {
        let mut results: Vec<(ProjectInfoInternal, UserInfoInternal, Principal)> = Vec::new();

        ic_cdk::println!("Debug: Total projects applied for all cohorts: {}", state.project_applied_for_cohort.len());

        if let Some(candid_projects) = state.project_applied_for_cohort.get(&cohort_id) {
            for project in &candid_projects.0 {
                // Change from find to filter_map to collect all matches
                let matched_projects: Vec<Principal> = state.project_storage.iter()
                    .filter_map(|(principal, stored_project)| {
                        if stored_project.0.iter().any(|stored| stored.uid == project.0.uid) {
                            Some(principal.0)
                        } else {
                            None
                        }
                    }).collect();

                for principal in matched_projects {
                    if let Some(user_info) = state.user_storage.get(&StoredPrincipal(principal)) {
                        results.push((project.0.clone(), user_info.0.clone(), principal));
                    }
                }

                ic_cdk::println!("Debug: Project ID {}, Results collected: {}", project.0.uid, results.len()); // Debugging output
            }
        } else {
            ic_cdk::println!("No projects found for cohort ID {}", cohort_id); // Debugging output if no cohort data is found
        }

        results
    });

    if projects_in_cohort_with_users.is_empty() {
        ic_cdk::println!("No data returned for cohort ID {}", cohort_id); // Debugging output if results are empty
    }

    Ok(projects_in_cohort_with_users)
}


#[query(guard = "combined_guard")]
pub fn get_mentors_applied_for_cohort(cohort_id: String) -> Result<Vec<(MentorInternal, UserInfoInternal, Principal)>, String> {
    let mentors_in_cohort_with_users: Vec<(MentorInternal, UserInfoInternal, Principal)> = read_state(|state| {
        let mut results : Vec<(MentorInternal, UserInfoInternal, Principal)> = Vec::new();

        if let Some(candid_mentors) = state.mentor_applied_for_cohort.get(&cohort_id) {
            for mentor in &candid_mentors.0 {
                if let Some((principal, _stored_mentor)) = state.mentor_storage.iter().find(|(_, stored_mentor)| {
                    stored_mentor.0.uid == mentor.0.uid 
                }) {
                    if let Some(user_info) = state.user_storage.get(&principal) {
                        results.push((mentor.0.clone(), user_info.0.clone(), principal.0));
                    }
                }
            }
        }

        results
    });

    Ok(mentors_in_cohort_with_users)
}

#[query(guard = "combined_guard")]
pub fn get_vcs_applied_for_cohort(
    cohort_id: String,
) -> Result<Vec<(VentureCapitalistInternal, UserInfoInternal, Principal)>, String> {
    let vcs_in_cohort_with_users: Vec<(VentureCapitalistInternal, UserInfoInternal, Principal)> = read_state(|state| {
        let mut results : Vec<(VentureCapitalistInternal, UserInfoInternal, Principal)> = Vec::new();

        if let Some(candid_vcs) = state.vc_applied_for_cohort.get(&cohort_id) {
            for vc in &candid_vcs.0 {
                if let Some((principal, _stored_vc)) = state.vc_storage.iter().find(|(_, stored_vc)| {
                    stored_vc.0.uid == vc.0.uid 
                }) {
                    if let Some(user_info) = state.user_storage.get(&principal) {
                        results.push((vc.0.clone(), user_info.0.clone(), principal.0));
                    }
                }
            }
        }

        results
    });

    Ok(vcs_in_cohort_with_users)
}


#[query(guard = "combined_guard")]
pub fn filter_cohorts(criteria: CohortFilterCriteria) -> Vec<CohortDetails> {
    read_state(|state| {
        state
            .cohort_info
            .iter()
            .filter_map(|(_, candid_cohort)| {
                let cohort_details = &candid_cohort.0;

                let tags_match = criteria.tags.as_ref().map_or(true, |tags| {
                    cohort_details
                        .cohort
                        .tags
                        .chars()
                        .any(|tag| tags.contains(tag))
                });

                let level_match = criteria.level_on_rubric.map_or(true, |level| {
                    cohort_details.cohort.criteria.level_on_rubric == level
                });

                let seats_match =
                    criteria
                        .no_of_seats_range
                        .map_or(true, |(min_seats, max_seats)| {
                            let seats = cohort_details.cohort.no_of_seats;
                            seats >= min_seats && seats <= max_seats
                        });

                if tags_match && level_match && seats_match {
                    Some(cohort_details.clone())
                } else {
                    None
                }
            })
            .collect()
    })
}

#[query(guard = "combined_guard")]
pub fn check_principal_in_states(principal_id: Principal) -> bool {
    read_state(|state| {
        let in_cohort = state.cohort_info.iter().any(|(_, cohort_data)| {
            cohort_data.0.cohort_creator == principal_id
        });

        let in_project = state.project_storage.iter().any(|(proj_principal, _)| {
            proj_principal.0 == principal_id
        });

        let in_mentor = state.mentor_storage.iter().any(|(ment_principal, _)| {
            ment_principal.0 == principal_id
        });

        let in_vc = state.vc_storage.iter().any(|(vc_principal, _)| {
            vc_principal.0 == principal_id
        });

        in_cohort || in_project || in_mentor || in_vc
    })
}

#[query(guard = "combined_guard")]
pub fn check_cohort_mebership(principal_id: Principal, cohort_id: String) -> bool {
    let mentors_result = get_mentors_applied_for_cohort(cohort_id.clone());

    let in_mentor = if let Ok(mentors) = mentors_result {
        mentors.iter().any(|(_, _, ment_principal)| *ment_principal == principal_id)
    } else {
        false
    };

    let vcs_result = get_vcs_applied_for_cohort(cohort_id.clone());

    let in_vc = if let Ok(vcs) = vcs_result {
        vcs.iter().any(|(_, _, vc_principal)| *vc_principal == principal_id)
    } else {
        false
    };

    let projects_result = get_projects_applied_for_cohort(cohort_id);

    let in_project = if let Ok(projects) = projects_result {
        projects.iter().any(|(_, _, proj_principal)| *proj_principal == principal_id)
    } else {
        false
    };

    in_mentor || in_vc || in_project
}


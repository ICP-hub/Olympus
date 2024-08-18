use crate::is_user_anonymous;
use crate::mentor::get_mentor_info_using_principal;
use crate::project_registration::{get_project_info_using_principal, ProjectInfoInternal};
use crate::state_handler::{mutate_state, read_state, Candid, StoredPrincipal};
use crate::vc_registration::get_vc_info_using_principal;
use crate::{get_roles_for_principal, MentorInternal, VentureCapitalistInternal};
use candid::{CandidType, Principal};
use ic_cdk::api::call::call;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::caller;
use ic_cdk_macros::{query, update};
use ic_certified_assets::types::Key;
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use sha2::{Digest, Sha256};

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct Eligibility {
    level_on_rubric: f64,
    eligibility: Option<String>,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct Cohort {
    title: String,
    description: String,
    tags: String,
    criteria: Eligibility,
    no_of_seats: u64,
    country: String,
    funding_amount: String,
    funding_type: String,
    start_date: String,
    deadline: String,
    cohort_launch_date: String,
    cohort_end_date: String,
    cohort_banner: Option<Vec<u8>>,
    host_name: Option<String>,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct CohortDetails {
    pub cohort_id: String,
    pub cohort: Cohort,
    pub cohort_created_at: u64,
    pub cohort_creator: Principal,
    pub cohort_creator_role: Vec<String>,
    pub cohort_creator_principal: Principal,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct CohortRequest {
    pub cohort_details: CohortDetails,
    pub sent_at: u64,
    pub accepted_at: u64,
    pub rejected_at: u64,
    pub request_status: String,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct EnrollerDataInternal {
    pub project_data: Option<ProjectInfoInternal>,
    pub mentor_data: Option<MentorInternal>,
    pub vc_data: Option<VentureCapitalistInternal>,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct CohortEnrollmentRequest {
    pub cohort_details: CohortDetails,
    pub sent_at: u64,
    pub accepted_at: u64,
    pub rejected_at: u64,
    pub request_status: String,
    pub enroller_data: EnrollerDataInternal,
    pub enroller_principal: Principal,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct InviteRequest {
    pub cohort_id: String,
    pub sender_principal: Principal,
    pub mentor_data: MentorInternal,
    pub invite_message: String,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct StoreArg {
    pub key: Key,
    pub content_type: String,
    pub content_encoding: String,
    pub content: ByteBuf,
    pub sha256: Option<ByteBuf>,
}
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct DeleteAsset {
    pub key: Key
}

//a. create_cohort
#[update(guard = "is_user_anonymous")]
pub async fn create_cohort(mut params: Cohort) -> Result<String, String> {
    let caller_principal = caller();

    let is_mentor_or_investor = read_state(|state| {
        state
            .mentor_storage
            .contains_key(&StoredPrincipal(caller_principal))
            || state
                .vc_storage
                .contains_key(&StoredPrincipal(caller_principal))
    });

    if !is_mentor_or_investor {
        return Err("You are not privileged to create a cohort.".to_string());
    }

    let u_ids = raw_rand().await.unwrap().0;
    let cohort_id = format!("{:x}", Sha256::digest(&u_ids));

    let roles_assigned = read_state(|_state| {
        get_roles_for_principal(caller_principal)
            .iter()
            .filter(|r| r.status == "approved" || r.status == "active")
            .map(|r| r.name.clone())
            .collect::<Vec<String>>()
    });
    let canister_id = crate::asset_manager::get_asset_canister();
    if params.cohort_banner.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_cohort_logo.jpeg";
        params.cohort_banner = Some((full_url).as_bytes().to_vec());
    } else if params.cohort_banner.clone().unwrap().len() < 300 {
        ic_cdk::println!("Project logo is already uploaded");
    } else {
        let cohort_logo_key = "/uploads/".to_owned() + &caller_principal.to_string() + "_project_logo.jpeg";

        let cohort_logo_arg = StoreArg {
            key: cohort_logo_key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(params.cohort_banner.unwrap()),
            sha256: None,
        };

        let _delete_asset = DeleteAsset {
            key: cohort_logo_key.clone(),
        };

        // let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
        //     .await
        //     .unwrap();

        let _result = call(canister_id, "store", (cohort_logo_arg,)).await.map_err(|e| format!("Error storing asset: {:?}", e))?;

        params.cohort_banner = Some(
            (canister_id.to_string() + &cohort_logo_key)
                .as_bytes()
                .to_vec(),
        );
    }

    let cohort_details = CohortDetails {
        cohort_id: cohort_id.clone(),
        cohort: params,
        cohort_created_at: ic_cdk::api::time(),
        cohort_creator: caller_principal,
        cohort_creator_role: roles_assigned,
        cohort_creator_principal: caller_principal,
    };

    mutate_state(|state| {
        state.cohort_info.insert(cohort_id.clone(), Candid(cohort_details.clone()));
    });
    Ok("Cohort Has Been Created Succesfully".to_string())
}

#[query(guard = "is_user_anonymous")]
pub fn get_my_pending_cohort_creation_requests() -> Vec<CohortRequest> {
    let caller_principal = ic_cdk::caller();
    read_state(|state| {
        state
            .my_sent_cohort_request
            .get(&StoredPrincipal(caller_principal))
            .map_or_else(
                Vec::new,
                |requests| {
                    requests
                        .0
                        .iter()
                        .filter(|request| request.request_status == "pending")
                        .cloned()
                        .collect()
                },
            )
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_my_accepted_cohort_creation_request() -> Vec<CohortRequest> {
    let caller_principal = ic_cdk::caller();
    read_state(|state| {
        state
            .my_sent_cohort_request
            .get(&StoredPrincipal(caller_principal))
            .map_or_else(
                Vec::new,
                |requests| {
                    requests
                        .0
                        .iter()
                        .filter(|request| request.request_status == "accepted")
                        .cloned()
                        .collect()
                },
            )
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_my_declined_cohort_creation_requests() -> Vec<CohortRequest> {
    let caller_principal = ic_cdk::caller();
    read_state(|state| {
        state
            .my_sent_cohort_request
            .get(&StoredPrincipal(caller_principal))
            .map_or_else(
                Vec::new,
                |requests| {
                    requests
                        .0
                        .iter()
                        .filter(|request| request.request_status == "declined")
                        .cloned()
                        .collect()
                },
            )
    })
}

#[query(guard = "is_user_anonymous")]
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

#[query(guard = "is_user_anonymous")]
pub fn get_cohorts_by_principal() -> Vec<CohortDetails> {
    let principal_id = Principal::from_text("2vxsx-fae").unwrap();
    read_state(|state| {
        state
            .cohort_info
            .iter()
            .filter_map(|(cohort_id, cohort_data)| {
                if cohort_data.0.cohort_creator == principal_id {
                    Some(cohort_data.0.clone())
                } else {
                    None
                }
            })
            .collect()
    })
}


// pub fn get_cohort_inner_func(cohort_id: String) -> Option<CohortDetails> {
//     read_state(|state| {
//         state.cohort_info.get(&cohort_id)
//             .map(|candid_cohort_details| candid_cohort_details.0.clone())
//     })
// }

#[derive(CandidType, Debug, Clone, Serialize, Deserialize)]
pub struct Pagination {
    pub page: usize,
    pub page_size: usize,
}

#[derive(CandidType, Debug, Clone, Serialize, Deserialize)]
pub struct PaginationReturnCohort {
    pub data: Vec<CohortDetails>,
    pub total_count: usize,
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_cohorts(pagination_params: Pagination) -> PaginationReturnCohort {
    let start = (pagination_params.page - 1) * pagination_params.page_size;

    let cohorts_snapshot = read_state(|state| {
        state.cohort_info.iter()
            .skip(start)
            .take(pagination_params.page_size)
            .map(|(_key, candid_cohort_details)| candid_cohort_details.0.clone())
            .collect::<Vec<_>>()
    });

    let total_count = read_state(|state| state.cohort_info.len());

    PaginationReturnCohort {
        data: cohorts_snapshot,
        total_count: total_count.try_into().unwrap(),
    }
}


#[update(guard = "is_user_anonymous")]
pub fn send_enrollment_request_as_mentor(cohort_id: String, user_info: MentorInternal) -> String {
    let caller = ic_cdk::api::caller();
    let now = ic_cdk::api::time();

    // Retrieve the cohort creator's Principal and check for existing pending requests
    let (cohort_creator_principal, is_pending) = read_state(|state| {
        let cohort_creator_principal = state
            .cohort_info
            .get(&cohort_id)
            .map(|c| c.0.cohort_creator)
            .unwrap_or(Principal::anonymous());

        let is_pending = state
            .cohort_enrollment_request
            .get(&StoredPrincipal(cohort_creator_principal))
            .map_or(false, |reqs| {
                reqs.0
                    .iter()
                    .any(|req| req.request_status == "pending" && req.enroller_principal == caller)
            });

        (cohort_creator_principal, is_pending)
    });

    if is_pending {
        return "There is already a pending enrollment request for this cohort.".to_string();
    }

    // Create and send enrollment request
    let enrollment_request = CohortEnrollmentRequest {
        cohort_details: get_cohort(cohort_id),
        sent_at: now,
        accepted_at: 0,
        rejected_at: 0,
        request_status: "pending".to_string(),
        enroller_data: EnrollerDataInternal {
            project_data: None,
            mentor_data: Some(user_info),
            vc_data: None,
        },
        enroller_principal: caller,
    };

    mutate_state(|state| {
        let stored_principal = StoredPrincipal(cohort_creator_principal);
        let mut updated_requests = state
            .cohort_enrollment_request
            .get(&stored_principal)
            .map_or_else(
                Vec::new,
                |reqs| reqs.0.clone(),
            );

        updated_requests.push(enrollment_request.clone());
        state.cohort_enrollment_request.insert(stored_principal, Candid(updated_requests.clone()));

        ic_cdk::println!("State after mutation:");
        for (key, value) in state.cohort_enrollment_request.iter() {
            ic_cdk::println!(
                "Principal: {:?}, Number of Requests: {}, Requests: {:?}",
                key,
                value.0.len(),
                value
            );
        }
    });

    "Enrollment request sent successfully".to_string()
}

#[update(guard = "is_user_anonymous")]
pub fn send_enrollment_request_as_investor(
    cohort_id: String,
    user_info: VentureCapitalistInternal,
) -> String {
    let caller = ic_cdk::api::caller();
    let now = ic_cdk::api::time();

    ic_cdk::println!("Caller Principal: {:?}", caller);
    ic_cdk::println!("Sending enrollment request for cohort ID: {}", cohort_id);

    // Retrieve the cohort creator's Principal and check for existing pending requests
    let (cohort_creator_principal, is_pending) = read_state(|state| {
        let cohort_creator_principal = state
            .cohort_info
            .get(&cohort_id)
            .map(|c| c.0.cohort_creator)
            .unwrap_or_else(|| {
                ic_cdk::println!("Cohort ID {} not found, using anonymous principal.", cohort_id);
                Principal::anonymous()
            });

        let is_pending = state
            .cohort_enrollment_request
            .get(&StoredPrincipal(cohort_creator_principal))
            .map_or(false, |reqs| {
                reqs.0
                    .iter()
                    .any(|req| req.request_status == "pending" && req.enroller_principal == caller)
            });

        ic_cdk::println!("Cohort creator principal: {:?}", cohort_creator_principal);
        ic_cdk::println!("Is there a pending request already? {}", is_pending);

        (cohort_creator_principal, is_pending)
    });

    if is_pending {
        ic_cdk::println!("Rejected: Existing pending enrollment request found for cohort ID {}", cohort_id);
        return "There is already a pending enrollment request for this cohort.".to_string();
    }

    let enrollment_request = CohortEnrollmentRequest {
        cohort_details: get_cohort(cohort_id.clone()),
        sent_at: now,
        accepted_at: 0,
        rejected_at: 0,
        request_status: "pending".to_string(),
        enroller_data: EnrollerDataInternal {
            project_data: None,
            mentor_data: None,
            vc_data: Some(user_info),
        },
        enroller_principal: caller,
    };

    ic_cdk::println!("Created enrollment request: {:?}", enrollment_request);

    mutate_state(|state| {
        let stored_principal = StoredPrincipal(cohort_creator_principal);
        let mut updated_requests = state
            .cohort_enrollment_request
            .get(&stored_principal)
            .map_or_else(
                Vec::new,
                |reqs| reqs.0.clone(),
            );

        updated_requests.push(enrollment_request.clone());
        state.cohort_enrollment_request.insert(stored_principal, Candid(updated_requests.clone()));

        ic_cdk::println!("State after mutation:");
        for (key, value) in state.cohort_enrollment_request.iter() {
            ic_cdk::println!(
                "Principal: {:?}, Number of Requests: {}, Requests: {:?}",
                key,
                value.0.len(),
                value
            );
        }
    });

    ic_cdk::println!("Enrollment request sent successfully for cohort ID {}", cohort_id);
    "Enrollment request sent successfully".to_string()
}

#[update(guard = "is_user_anonymous")]
pub fn send_enrollment_request_as_project(
    cohort_id: String,
    user_info: ProjectInfoInternal,
) -> String {
    let caller = ic_cdk::api::caller();
    let now = ic_cdk::api::time();

    // Retrieve the cohort creator's Principal and check for existing pending requests
    let (cohort_creator_principal, is_pending) = read_state(|state| {
        let cohort_creator_principal = state
            .cohort_info
            .get(&cohort_id)
            .map(|c| c.0.cohort_creator)
            .unwrap_or(Principal::anonymous());

        let is_pending = state
            .cohort_enrollment_request
            .get(&StoredPrincipal(cohort_creator_principal))
            .map_or(false, |reqs| {
                reqs.0
                    .iter()
                    .any(|req| req.request_status == "pending" && req.enroller_principal == caller)
            });

        (cohort_creator_principal, is_pending)
    });

    ic_cdk::println!(
        "check cohort pending and principal {:?} ",
        (cohort_creator_principal, is_pending)
    );

    if is_pending {
        return "There is already a pending enrollment request for this cohort.".to_string();
    }

    let enrollment_request = CohortEnrollmentRequest {
        cohort_details: get_cohort(cohort_id),
        sent_at: now,
        accepted_at: 0,
        rejected_at: 0,
        request_status: "pending".to_string(),
        enroller_data: EnrollerDataInternal {
            project_data: Some(user_info),
            mentor_data: None,
            vc_data: None,
        },
        enroller_principal: caller,
    };

    ic_cdk::println!("enrollment request {:?}", enrollment_request);

    mutate_state(|state| {
        let stored_principal = StoredPrincipal(cohort_creator_principal);
        let mut updated_requests = state
            .cohort_enrollment_request
            .get(&stored_principal)
            .map_or_else(Vec::new, |reqs| reqs.0.clone());

        updated_requests.push(enrollment_request.clone());
        state
            .cohort_enrollment_request
            .insert(stored_principal, Candid(updated_requests.clone()));

        ic_cdk::println!("State after mutation:");
        for (key, value) in state.cohort_enrollment_request.iter() {
            ic_cdk::println!(
                "Principal: {:?}, Number of Requests: {}, Requests: {:?}",
                key,
                value.0.len(),
                value
            );
        }
    });

    "Enrollment request sent successfully".to_string()
}

#[query(guard = "is_user_anonymous")]
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


#[query(guard = "is_user_anonymous")]
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

#[query(guard = "is_user_anonymous")]
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

#[update(guard = "is_user_anonymous")]
pub fn approve_enrollment_request(cohort_id: String, enroller_principal: Principal) -> String {
    let caller = ic_cdk::api::caller();

    // Check if there's a pending request and current applier count
    let (is_request_pending, mut current_count, max_seats) = read_state(|state| {
        let is_request_pending = state
            .cohort_enrollment_request
            .get(&StoredPrincipal(caller))
            .map_or(false, |reqs| {
                reqs.0.iter().any(|req| {
                    req.enroller_principal == enroller_principal && req.request_status == "pending"
                })
            });

        let current_count = state.applier_count.get(&cohort_id).unwrap_or(0);
        let max_seats = state
            .cohort_info
            .get(&cohort_id)
            .map(|c| c.0.cohort.no_of_seats)
            .unwrap_or(0);

        (is_request_pending, current_count, max_seats)
    });

    if !is_request_pending {
        return "Request not found or already processed".to_string();
    }

    if current_count >= max_seats {
        return "All seats for this cohort are occupied!".to_string();
    }

    // Update the request status to accepted
    mutate_state(|state| {
        if let Some(mut reqs) = state.cohort_enrollment_request.get(&StoredPrincipal(caller)) {
            let mut found = false;
            for request in reqs.0.iter_mut() {
                if request.enroller_principal == enroller_principal && request.request_status == "pending" {
                    request.request_status = "accepted".to_string();
                    request.accepted_at = ic_cdk::api::time();
                    found = true;
                    break;
                }
            }
            if found {
                state.cohort_enrollment_request.insert(StoredPrincipal(caller), reqs.clone());
            }
        }

        if let Some(reqs) = state.cohort_enrollment_request.get(&StoredPrincipal(caller)) {
            for request in reqs.0.iter() {
                if request.enroller_principal == enroller_principal {
                    match &request.enroller_data {
                        EnrollerDataInternal { project_data: Some(project_data), .. } => {
                            if let Some(mut projects) = state.project_applied_for_cohort.get(&cohort_id) {
                                projects.0.push(project_data.clone());
                            } else {
                                state.project_applied_for_cohort.insert(cohort_id.clone(), Candid(vec![project_data.clone()]));
                            }
                        },
                        EnrollerDataInternal { mentor_data: Some(mentor_data), .. } => {
                            if let Some(mut mentors) = state.mentor_applied_for_cohort.get(&cohort_id) {
                                mentors.0.push(mentor_data.clone());
                            } else {
                                state.mentor_applied_for_cohort.insert(cohort_id.clone(), Candid(vec![mentor_data.clone()]));
                            }
                        },
                        EnrollerDataInternal { vc_data: Some(vc_data), .. } => {
                            if let Some(mut vcs) = state.vc_applied_for_cohort.get(&cohort_id) {
                                vcs.0.push(vc_data.clone());
                            } else {
                                state.vc_applied_for_cohort.insert(cohort_id.clone(), Candid(vec![vc_data.clone()]));
                            }
                        },
                        _ => {}
                    }
                    break;
                }
            }
        }

        // Increase applier count and update the state
        current_count += 1;
        state.applier_count.insert(cohort_id, current_count);
    });

    "Request approved successfully".to_string()
}


#[update(guard = "is_user_anonymous")]
pub fn reject_enrollment_request(
    cohort_creator_principal: Principal,
    enroller_principal: Principal,
) -> String {
    mutate_state(|state| {
        if let Some(mut request_list) = state
            .cohort_enrollment_request
            .get(&StoredPrincipal(cohort_creator_principal))
        {
            for request in request_list.0.iter_mut() {
                if request.enroller_principal == enroller_principal
                    && request.request_status == "pending"
                {
                    request.request_status = "rejected".to_string();
                    request.rejected_at = ic_cdk::api::time();
                    return "Request rejected successfully".to_string();
                }
            }
        }
        "Request not found or already processed".to_string()
    })
}

//needs to be made good in terms of error handling

#[update(guard = "is_user_anonymous")]
pub fn apply_for_a_cohort_as_a_mentor(cohort_id: String) -> String {
    let caller = ic_cdk::api::caller();

    let is_he_mentor =
        read_state(|state| state.mentor_storage.contains_key(&StoredPrincipal(caller)));

    if is_he_mentor {
        let mentor_data_option = get_mentor_info_using_principal(caller);
        let mentor_data = match mentor_data_option {
            Some(data) => data,
            None => return "Mentor data is required but not found.".to_string(),
        };
        send_enrollment_request_as_mentor(cohort_id, mentor_data)
    } else {
        "You should either be a mentor to register yourself in a cohort".to_string()
    }
}

#[update(guard = "is_user_anonymous")]
pub fn apply_for_a_cohort_as_a_investor(cohort_id: String) -> String {
    let caller = ic_cdk::api::caller();

    let is_he_investor =
        read_state(|state| state.vc_storage.contains_key(&StoredPrincipal(caller)));

    if is_he_investor {
        let vc_data_option = get_vc_info_using_principal(caller);
        let vc_data = match vc_data_option {
            Some(data) => data,
            None => return "Investor data is required but not found.".to_string(),
        };
        send_enrollment_request_as_investor(cohort_id, vc_data)
    } else {
        "You should either be an investor to register yourself in a cohort".to_string()
    }
}

#[query(guard = "is_user_anonymous")]
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

#[update(guard = "is_user_anonymous")]
pub fn apply_for_a_cohort_as_a_project(cohort_id: String) -> String {
    let caller = ic_cdk::api::caller();

    let is_he_project =
        read_state(|state| state.project_storage.contains_key(&StoredPrincipal(caller)));

    ic_cdk::println!(" is_he_project {}", is_he_project);
    if is_he_project {
        let project_data_option = get_project_info_using_principal(caller);

        let project_data = match project_data_option {
            Some(data) => data,
            None => return "Project data is required but not found.".to_string(),
        };
        ic_cdk::println!(" project data  {:?}", project_data);
        send_enrollment_request_as_project(cohort_id, project_data);
        "Request Has Been Sent To Cohort Creator".to_string()
    } else {
        "You should either be a project to register yourself in a cohort".to_string()
    }
}

#[query(guard = "is_user_anonymous")]
pub fn get_projects_applied_for_cohort(
    cohort_id: String,
) -> Result<Vec<ProjectInfoInternal>, String> {
    // Retrieve projects applied for the given cohort using read_state
    let projects_in_cohort: Vec<ProjectInfoInternal> = read_state(|state| {
        state
            .project_applied_for_cohort
            .get(&cohort_id)
            .map(|candid_projects| candid_projects.0.clone())
            .unwrap_or_default()
    });

    Ok(projects_in_cohort)
}

#[query(guard = "is_user_anonymous")]
pub fn get_mentors_applied_for_cohort(cohort_id: String) -> Result<Vec<MentorInternal>, String> {
    let mentors_in_cohort: Vec<MentorInternal> = read_state(|state| {
        state
            .mentor_applied_for_cohort
            .get(&cohort_id)
            .map_or_else(Vec::new, |candid_mentors| candid_mentors.0.clone())
    });

    Ok(mentors_in_cohort)
}

#[query(guard = "is_user_anonymous")]
pub fn get_vcs_applied_for_cohort(
    cohort_id: String,
) -> Result<Vec<VentureCapitalistInternal>, String> {
    let vcs_in_cohort: Vec<VentureCapitalistInternal> = read_state(|state| {
        state
            .vc_applied_for_cohort
            .get(&cohort_id)
            .map_or_else(Vec::new, |candid_mentors| candid_mentors.0.clone())
    });

    Ok(vcs_in_cohort)
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct CohortFilterCriteria {
    pub tags: Option<String>,
    pub level_on_rubric: Option<f64>,
    pub no_of_seats_range: Option<(u64, u64)>,
}

#[query(guard = "is_user_anonymous")]
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

#[update(guard="is_user_anonymous")]
pub async fn update_cohort(cohort_id: String, updated_params: Cohort) -> Result<String, String> {
    let caller_principal = caller();

    // Check if the caller is the creator of the cohort or has the required privileges
    let mut cohort_details = read_state(|state| state.cohort_info.get(&cohort_id).unwrap().0.clone());

    let mut params = updated_params.clone();

    let canister_id = crate::asset_manager::get_asset_canister();
    if params.cohort_banner.is_some() && params.cohort_banner.clone().unwrap().len() > 300 {
        let cohort_logo_key = "/uploads/".to_owned() + &caller_principal.to_string() + "_project_logo.jpeg";

        let cohort_logo_arg = StoreArg {
            key: cohort_logo_key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(params.cohort_banner.clone().unwrap()),
            sha256: None,
        };

        let _result = call(canister_id, "store", (cohort_logo_arg,)).await.map_err(|e| format!("Error storing asset: {:?}", e))?;

        params.cohort_banner = Some(
            (canister_id.to_string() + &cohort_logo_key)
                .as_bytes()
                .to_vec(),
        );
    } else {
        ic_cdk::println!("No change in cohort banner or invalid banner data.");
    }

    cohort_details.cohort = updated_params;

    mutate_state(|state| {
        if let Some(_existing_cohort) = state.cohort_info.get(&cohort_id) {
            state.cohort_info.insert(cohort_id.clone(), Candid(cohort_details.clone()));
        }
    });

    Ok("Cohort details have been updated successfully.".to_string())
}
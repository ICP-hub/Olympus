use crate::state_handler::*;
use crate::cohort_module::cohort_types::*;
use crate::vc_module::vc_types::*;
use crate::vc_module::get_vc::*;
use crate::mentor_module::mentor_types::*;
use crate::project_module::project_types::*;
use crate::mentor_module::get_mentor::*;
use crate::cohort_module::get_cohort::*;
use crate::project_module::get_project::*;
use crate::guard::*;
use candid::Principal;
use ic_cdk_macros::*;

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
        send_enrollment_request_as_mentor(cohort_id, mentor_data.0)
    } else {
        "You should either be a mentor to register yourself in a cohort".to_string()
    }
}

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
        send_enrollment_request_as_investor(cohort_id, vc_data.0.profile)
    } else {
        "You should either be an investor to register yourself in a cohort".to_string()
    }
}

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
        send_enrollment_request_as_project(cohort_id, project_data.0);
        "Request Has Been Sent To Cohort Creator".to_string()
    } else {
        "You should either be a project to register yourself in a cohort".to_string()
    }
}

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

#[update(guard = "is_user_anonymous")]
pub fn approve_enrollment_request(cohort_id: String, enroller_principal: Principal) -> String {
    let caller = ic_cdk::api::caller();
    let mut enroller_data_to_update = None;

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
                    enroller_data_to_update = Some(request.enroller_data.clone());
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
        state.applier_count.insert(cohort_id.clone(), current_count);
    });

    if let Some(enroller_data) = enroller_data_to_update {
        let _ = update_cohort_with_applicant(
            cohort_id.clone(),
            enroller_data.project_data,
            enroller_data.mentor_data,
            enroller_data.vc_data,
        );
    }

    "Request approved successfully".to_string()
}

pub fn update_cohort_with_applicant(
    cohort_id: String,
    project_data: Option<ProjectInfoInternal>,
    mentor_data: Option<MentorInternal>,
    vc_data: Option<VentureCapitalistInternal>,
) -> Result<String, String> {

    // Retrieve the cohort details from the state
    let mut cohort_details: CohortDetails = read_state(|state| {
    state
        .cohort_info
        .get(&cohort_id)
        .map(|candid_cohort_details| candid_cohort_details.0.clone())
        .ok_or("Cohort not found".to_string())  // Convert the error message to String
    })?;

    // Update the cohort details with the new applicant data
    if let Some(project) = project_data {
        if let Some(ref mut projects) = cohort_details.projects_applied {
            projects.push(project);
        } else {
            cohort_details.projects_applied = Some(vec![project]);
        }
    }

    if let Some(mentor) = mentor_data {
        if let Some(ref mut mentors) = cohort_details.mentors_applied {
            mentors.push(mentor);
        } else {
            cohort_details.mentors_applied = Some(vec![mentor]);
        }
    }

    if let Some(vc) = vc_data {
        if let Some(ref mut vcs) = cohort_details.vcs_applied {
            vcs.push(vc);
        } else {
            cohort_details.vcs_applied = Some(vec![vc]);
        }
    }

    // Mutate the state to save the updated cohort details
    mutate_state(|state| {
        state
            .cohort_info
            .insert(cohort_id.clone(), Candid(cohort_details.clone()));
    });

    Ok("Cohort details have been updated with the new applicant.".to_string())
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

#[update(guard = "is_admin")]
pub fn send_rejoin_invitation_to_mentor(
    cohort_id: String,
    mentor_principal: Principal,
    invite_message: String,
) -> Result<String, String> {
    let result = mutate_state(|state| {
        if let Some(mut mentors) = state.mentor_removed_from_cohort.get(&cohort_id) {
            if let Some((index, _)) = mentors
                .0
                .iter()
                .enumerate()
                .find(|(_, (pr, _))| *pr == mentor_principal)
            {
                let (principal, mentor_data) = mentors.0.remove(index);
                let invite_request = InviteRequest {
                    cohort_id: cohort_id.clone(),
                    sender_principal: principal,
                    mentor_data,
                    invite_message: invite_message.clone(),
                };

                if let Some(_) = state.mentor_invite_request.get(&cohort_id) {
                    state
                        .mentor_invite_request
                        .insert(cohort_id.clone(), Candid(invite_request));
                } else {
                    state
                        .mentor_invite_request
                        .insert(cohort_id.clone(), Candid(invite_request));
                }

                return Ok("Invitation sent to rejoin the cohort.".to_string());
            }
        }
        Err("No removed mentor found for this principal in the specified cohort.".to_string())
    });

    result
}

#[update(guard = "is_admin")]
pub fn accept_rejoin_invitation(cohort_id: String) -> Result<String, String> {
    let result = mutate_state(|state| {
        if let Some(invite_request) = state.mentor_invite_request.remove(&cohort_id) {
            let mentors = state.mentor_applied_for_cohort.get(&cohort_id);
            match mentors {
                Some(mut candid_mentors) => {
                    candid_mentors.0.push(invite_request.0.mentor_data);
                }
                None => {
                    state.mentor_applied_for_cohort.insert(
                        cohort_id.clone(),
                        Candid(vec![invite_request.0.mentor_data]),
                    );
                }
            }
            return Ok(format!(
                "Mentor has successfully rejoined the cohort {}",
                cohort_id
            ));
        }
        Err("No pending invitation found for this cohort.".to_string())
    });

    result
}

pub fn decline_rejoin_invitation(cohort_id: String) -> Result<String, String> {
    let result = mutate_state(|state| {
        if state.mentor_invite_request.remove(&cohort_id).is_some() {
            return Ok(format!(
                "Mentor has declined the invitation to rejoin the cohort {}",
                cohort_id
            ));
        }
        Err("No pending invitation found for this cohort.".to_string())
    });

    result
}

#[query(guard = "is_admin")]
pub fn get_my_invitation_request(cohort_id: String) -> Result<InviteRequest, String> {
    let principal_id = ic_cdk::api::caller();

    read_state(|state| {
        if let Some(invite_request) = state.mentor_invite_request.get(&cohort_id) {
            if invite_request.0.sender_principal == principal_id {
                return Ok(invite_request.0.clone());
            } else {
                return Err("You are not authorized to view this invitation.".to_string());
            }
        }
        Err("No pending invitation found for this cohort.".to_string())
    })
}

#[query(guard = "is_admin")]
pub fn get_left_mentors_of_cohort(cohort_id: String) -> Vec<MentorInternal> {
    read_state(|state| {
        if let Some(mentors) = state.mentor_removed_from_cohort.get(&cohort_id) {
            return mentors
                .0
                .iter()
                .map(|(_, mentor_data)| mentor_data.clone())
                .collect();
        }
        Vec::new()
    })
}

#[update(guard = "is_admin")]
pub fn remove_vc_from_cohort(
    cohort_id: String,
    uid: String,
    passphrase_key: String,
) -> Result<String, String> {
    let required_key = format!("delete/{}", uid);

    if passphrase_key != required_key {
        return Err("Unauthorized attempt: Incorrect passphrase key.".to_string());
    }

    let stored_vc_principal = crate::ratings_module::mentor_investor_rating::find_vc_by_uid(uid.clone());
    let vc_principal = stored_vc_principal.0;

    mutate_state(|state| {
        if let Some(vc_up_for_cohort) = state.vc_storage.get(&StoredPrincipal(vc_principal)) {
            let vc_clone = vc_up_for_cohort.0.clone();

            if let Some(mut vcs) = state.vc_applied_for_cohort.get(&cohort_id) {
                if let Some(index) = vcs.0.iter().position(|x| *x == vc_clone) {
                    vcs.0.remove(index);

                    if let Some(count) = state.applier_count.get(&cohort_id) {
                        state.applier_count.insert(cohort_id.clone(), count.saturating_sub(1));
                    }

                    Ok(format!(
                        "Venture capitalist successfully removed from the cohort with cohort id {}",
                        cohort_id
                    ))
                } else {
                    Err("You are not part of this cohort".to_string())
                }
            } else {
                Err("No venture capitalists found for this cohort".to_string())
            }
        } else {
            Err("Invalid venture capitalist record".to_string())
        }
    })
}

#[update(guard = "is_admin")]
pub fn remove_project_from_cohort(
    cohort_id: String,
    project_uid: String,
    passphrase_key: String,
) -> Result<String, String> {
    let required_key = format!("delete/{}", project_uid);

    if passphrase_key != required_key {
        return Err("Unauthorized attempt: Incorrect passphrase key.".to_string());
    }
    mutate_state(|state| {
        if let Some(mut projects) = state.project_applied_for_cohort.get(&cohort_id) {
            if let Some(index) = projects.0.iter().position(|p| p.uid == project_uid) {
                projects.0.remove(index);

                if let Some(count) = state.applier_count.get(&cohort_id) {
                    state.applier_count.insert(cohort_id.clone(), count.saturating_sub(1));
                }

                Ok("Project successfully removed from the cohort.".to_string())
            } else {
                return Err("Project not found in this cohort.".to_string());
            }
        } else {
            return Err("Cohort not found or no projects applied.".to_string());
        }
    })
}

#[update(guard = "is_admin")]
pub fn remove_mentor_from_cohort(
    cohort_id: String,
    uid: String,
    passphrase_key: String,
) -> Result<String, String> {
    let required_key = format!("delete/{}", uid);

    if passphrase_key != required_key {
        return Err("Unauthorized attempt: Incorrect passphrase key.".to_string());
    }
    let stored_mentor_principal = crate::ratings_module::mentor_investor_rating::find_vc_by_uid(uid.clone());
    let mentor_principal = stored_mentor_principal.0;
    mutate_state(|state| {
        if let Some(mentor_up_for_cohort) =
            state.mentor_storage.get(&StoredPrincipal(mentor_principal))
        {
            let mentor_clone = mentor_up_for_cohort.0.clone();

            if let Some(mut mentors) = state.mentor_applied_for_cohort.get(&cohort_id) {
                if let Some(index) = mentors.0.iter().position(|x| *x == mentor_clone) {
                    let mentor_data = mentors.0.remove(index);

                    if let Some(mut removed_mentors) =
                        state.mentor_removed_from_cohort.get(&cohort_id)
                    {
                        removed_mentors.0.push((mentor_principal, mentor_data));
                    } else {
                        state.mentor_removed_from_cohort.insert(
                            cohort_id.clone(),
                            Candid(vec![(mentor_principal, mentor_data)]),
                        );
                    }

                    if let Some(count) = state.applier_count.get(&cohort_id) {
                        state.applier_count.insert(cohort_id.clone(), count.saturating_sub(1));
                    }

                    return Ok(format!(
                        "Mentor successfully removed from the cohort with cohort id {}",
                        cohort_id
                    ));
                } else {
                    return Err("You are not part of this cohort".to_string());
                }
            } else {
                return Err("No mentors found for this cohort".to_string());
            }
        } else {
            return Err("Invalid mentor record".to_string());
        }
    })
}
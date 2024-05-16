use crate::mentor::get_mentor_info_using_principal;
use crate::project_registration::{ProjectInfo, ProjectInfoInternal, get_project_info_using_principal};
use crate::user_module::UserInformation;
use crate::vc_registration::get_vc_info_using_principal;
use crate::{
    get_roles_for_principal, ApplicationDetails, MentorInternal, MentorRegistry,
    VentureCapitalistInternal, VentureCapitalistStorage, APPLICATION_FORM, MENTOR_REGISTRY,
    VENTURECAPITALIST_STORAGE,
};
use candid::{CandidType, Principal};
use ic_cdk::api::{management_canister::main::raw_rand, time};
use ic_cdk::caller;
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;
use crate::send_cohort_request_to_admin;
use candid::types::TypeInner::Null;

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct Eligibility {
    level_on_rubric: f64,
    eligibility: Option<String>,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct Cohort {
    title: String,
    description: String,
    tags: String,
    criteria: Eligibility,
    no_of_seats: u8,
    deadline: String,
    cohort_launch_date: String,
    cohort_end_date: String,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct CohortDetails {
    pub cohort_id: String,
    pub cohort: Cohort,
    pub cohort_created_at: u64,
    pub cohort_creator: Principal,
    pub cohort_creator_role: Vec<String>,
    pub cohort_creator_principal: Principal,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct CohortRequest {
    pub cohort_details : CohortDetails,
    pub sent_at : u64,
    pub accepted_at : u64,
    pub rejected_at : u64,
    pub request_status : String
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct EnrollerDataInternal{
    pub project_data: Option<ProjectInfoInternal>,
    pub mentor_data: Option<MentorInternal>,
    pub vc_data: Option<VentureCapitalistInternal>,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct CohortEnrollmentRequest{
    pub cohort_details : CohortDetails,
    pub sent_at : u64,
    pub accepted_at : u64,
    pub rejected_at : u64,
    pub request_status : String,
    pub enroller_data: EnrollerDataInternal,
    pub enroller_principal: Principal,
}

pub type MentorsAppliedForCohort = HashMap<String, Vec<MentorInternal>>;
pub type CohortInfo = HashMap<String, CohortDetails>;
pub type ProjectsAppliedForCohort = HashMap<String, Vec<ProjectInfoInternal>>;
pub type ApplierCount = HashMap<String, u8>;
pub type CapitalistAppliedForCohort = HashMap<String, Vec<VentureCapitalistInternal>>;
pub type CohortsAssociated = HashMap<String, Vec<String>>;
pub type CohortEnrollmentRequests = HashMap<Principal, Vec<CohortEnrollmentRequest>>;

thread_local! {
    pub static COHORT : RefCell<CohortInfo> = RefCell::new(CohortInfo::new());
    pub static PROJECTS_APPLIED_FOR_COHORT : RefCell<ProjectsAppliedForCohort> = RefCell::new(ProjectsAppliedForCohort::new());
    pub static MENTORS_APPLIED_FOR_COHORT : RefCell<MentorsAppliedForCohort> = RefCell::new(MentorsAppliedForCohort::new());
    pub static CAPITALIST_APPLIED_FOR_COHORT : RefCell<CapitalistAppliedForCohort> = RefCell::new(CapitalistAppliedForCohort::new());
    pub static APPLIER_COUNT : RefCell<ApplierCount> = RefCell::new(ApplierCount::new());
    pub static ASSOCIATED_COHORTS_WITH_PROJECT : RefCell<CohortsAssociated> = RefCell::new(CohortsAssociated::new());
    pub static MY_SENT_COHORT_REQUEST : RefCell<HashMap<Principal, Vec<CohortRequest>>> = RefCell::new(HashMap::new());
    pub static COHORT_ENROLLMENT_REQUESTS: RefCell<CohortEnrollmentRequests> = RefCell::new(HashMap::new());
}


//a. create_cohort
#[update]
pub async fn create_cohort(params: Cohort) -> Result<String, String>{
    let is_he_mentor = MENTOR_REGISTRY.with(|storage: &RefCell<MentorRegistry>| {
        let storage = storage.borrow();
        storage.contains_key(&caller())
    });

    if !is_he_mentor {
        let is_he_investor =
            VENTURECAPITALIST_STORAGE.with(|capitalist: &RefCell<VentureCapitalistStorage>| {
                let capitalist = capitalist.borrow();
                capitalist.contains_key(&caller())
            });

        if !is_he_investor {
            return Err("you are not priviledged to create a cohort".to_string());
            //return format!("you are not priviledged to create a cohort");
        }
    }

    let u_ids = raw_rand().await.unwrap().0;
    let cohort_id = format!("{:x}", Sha256::digest(&u_ids));

    let roles_of_caller = get_roles_for_principal(caller());

    let mut roles_assigned: Vec<String> = vec![];

    for r in roles_of_caller {
        if r.status == "approved" || r.status == "active" {
            roles_assigned.push(r.name)
        }
    }

    let cohort_details = CohortDetails {
        cohort_id: cohort_id.clone(),
        cohort: params.clone(),
        cohort_created_at: time(),
        cohort_creator: caller(),
        cohort_creator_role: roles_assigned,
        cohort_creator_principal: caller()
    };

    let cohort_request = CohortRequest {
        cohort_details,
        accepted_at : 0,
        rejected_at : 0,
        sent_at : time(),
        request_status : "pending".to_string()
    };

    //store my cohort creation request

    store_cohort_creation_pending_request(cohort_request.clone());
    

    ic_cdk::println!("cohort id is {}", cohort_id.clone());
    Ok(send_cohort_request_to_admin(cohort_request.clone()).await)

    // COHORT.with(|storage| {
    //     let mut storage = storage.borrow_mut();
    //     storage.insert(cohort_id.clone(), cohort_details)
    // });

    // Ok(format!(
    //     "accelerator is successfully created by {} with cohort id {}",
    //     caller(),
    //     cohort_id.clone()
    // ))
}

//admin should be notified about cohort creation 

pub fn store_cohort_creation_pending_request(request: CohortRequest) {
    MY_SENT_COHORT_REQUEST.with(|store| {
        store
            .borrow_mut()
            .entry(caller())
            .or_insert_with(Vec::new)
            .push(request);
    });
}

#[query]
pub fn get_my_pending_cohort_creation_requests() -> Vec<CohortRequest> {
    MY_SENT_COHORT_REQUEST.with(|pending_alerts| {
        pending_alerts
            .borrow()
            .get(&caller())
            .map_or_else(Vec::new, |requests| {
                requests
                    .iter()
                    .filter(|request| request.request_status == "pending")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_my_accepted_cohort_creation_request() -> Vec<CohortRequest> {
    MY_SENT_COHORT_REQUEST.with(|pending_alerts| {
        pending_alerts
            .borrow()
            .get(&caller())
            .map_or_else(Vec::new, |requests| {
                requests
                    .iter()
                    .filter(|request| request.request_status == "accepted")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_my_declined_cohort_creation_requests() -> Vec<CohortRequest> {
    MY_SENT_COHORT_REQUEST.with(|pending_alerts| {
        pending_alerts
            .borrow()
            .get(&caller())
            .map_or_else(Vec::new, |requests| {
                requests
                    .iter()
                    .filter(|request| request.request_status == "declined")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_cohort(cohort_id: String) -> CohortDetails {
    COHORT.with(|storage| {
        let res = storage
            .borrow()
            .get(&cohort_id)
            .expect("you have not crerated a cohort")
            .clone();
        res
    })
}

pub fn get_cohort_inner_func(cohort_id: String) -> Option<CohortDetails> {
    Some(COHORT.with(|storage| {
        let res = storage
            .borrow()
            .get(&cohort_id)
            .expect("you have not crerated a cohort")
            .clone();
        res
    }))
}


#[query]
pub fn get_all_cohorts() -> Vec<CohortDetails> {
    COHORT.with(|storage| {
        storage
            .borrow()
            .values()
            .map(|v| v.clone())
            .collect()
    })

}

#[update]
pub fn send_enrollment_request_as_mentor(cohort_id: String, user_info: MentorInternal) -> String {
    let caller = caller();
    let now = ic_cdk::api::time();

    // Retrieve the cohort creator's Principal
    let cohort_creator_principal = COHORT.with(|cohorts| {
        let cohorts = cohorts.borrow();
        if let Some(details) = cohorts.get(&cohort_id) {
            details.cohort_creator
        } else {
            Principal::anonymous() 
        }
    });

    let is_pending = COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        requests.borrow().get(&cohort_creator_principal).map_or(false, |reqs| {
            reqs.iter().any(|req| req.request_status == "pending" && req.enroller_principal == caller)
        })
    });

    if is_pending {
        return "There is already a pending enrollment request for this cohort.".to_string();
    }

    let enrollment_request = CohortEnrollmentRequest {
        cohort_details: get_cohort(cohort_id),
        sent_at: now,
        accepted_at: 0,
        rejected_at: 0,
        request_status: "pending".to_string(),
        enroller_data: EnrollerDataInternal{ project_data: None, mentor_data: Some(user_info), vc_data: None },
        enroller_principal: caller,
    };

    COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        requests.entry(cohort_creator_principal).or_insert_with(Vec::new).push(enrollment_request);
    });

    "Enrollment request sent successfully".to_string()
}

#[update]
pub fn send_enrollment_request_as_investor(cohort_id: String, user_info: VentureCapitalistInternal) -> String {
    let caller = caller();
    let now = ic_cdk::api::time();

    // Retrieve the cohort creator's Principal
    let cohort_creator_principal = COHORT.with(|cohorts| {
        let cohorts = cohorts.borrow();
        if let Some(details) = cohorts.get(&cohort_id) {
            details.cohort_creator
        } else {
            Principal::anonymous() 
        }
    });

    let is_pending = COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        requests.borrow().get(&cohort_creator_principal).map_or(false, |reqs| {
            reqs.iter().any(|req| req.request_status == "pending" && req.enroller_principal == caller)
        })
    });

    if is_pending {
        return "There is already a pending enrollment request for this cohort.".to_string();
    }

    let enrollment_request = CohortEnrollmentRequest {
        cohort_details: get_cohort(cohort_id),
        sent_at: now,
        accepted_at: 0,
        rejected_at: 0,
        request_status: "pending".to_string(),
        enroller_data: EnrollerDataInternal{ project_data: None, mentor_data: None, vc_data: Some(user_info) },
        enroller_principal: caller,
    };

    COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        requests.entry(cohort_creator_principal).or_insert_with(Vec::new).push(enrollment_request);
    });

    "Enrollment request sent successfully".to_string()
}

#[update]
pub fn send_enrollment_request_as_project(cohort_id: String, user_info: ProjectInfoInternal) -> String {
    let caller = caller();
    let now = ic_cdk::api::time();

    // Retrieve the cohort creator's Principal
    let cohort_creator_principal = COHORT.with(|cohorts| {
        let cohorts = cohorts.borrow();
        if let Some(details) = cohorts.get(&cohort_id) {
            details.cohort_creator
        } else {
            Principal::anonymous() 
        }
    });

    let is_pending = COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        requests.borrow().get(&cohort_creator_principal).map_or(false, |reqs| {
            reqs.iter().any(|req| req.request_status == "pending" && req.enroller_principal == caller)
        })
    });

    if is_pending {
        return "There is already a pending enrollment request for this cohort.".to_string();
    }

    let enrollment_request = CohortEnrollmentRequest {
        cohort_details: get_cohort(cohort_id),
        sent_at: now,
        accepted_at: 0,
        rejected_at: 0,
        request_status: "pending".to_string(),
        enroller_data: EnrollerDataInternal{ project_data: Some(user_info), mentor_data: None, vc_data: None },
        enroller_principal: caller,
    };

    COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        requests.entry(cohort_creator_principal).or_insert_with(Vec::new).push(enrollment_request);
    });

    "Enrollment request sent successfully".to_string()
}

#[query]
pub fn get_pending_cohort_enrollment_requests(mentor_principal: Principal) -> Vec<CohortEnrollmentRequest> {
    COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        requests.borrow()
            .get(&mentor_principal)
            .map_or_else(Vec::new, |request_list| {
                request_list.iter()
                    .filter(|request| request.request_status == "pending")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_accepted_cohort_enrollment_requests(mentor_principal: Principal) -> Vec<CohortEnrollmentRequest> {
    COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        requests.borrow()
            .get(&mentor_principal)
            .map_or_else(Vec::new, |request_list| {
                request_list.iter()
                    .filter(|request| request.request_status == "accepted")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_rejected_cohort_enrollment_requests(mentor_principal: Principal) -> Vec<CohortEnrollmentRequest> {
    COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        requests.borrow()
            .get(&mentor_principal)
            .map_or_else(Vec::new, |request_list| {
                request_list.iter()
                    .filter(|request| request.request_status == "rejected")
                    .cloned()
                    .collect()
            })
    })
}

#[update]
pub fn approve_enrollment_request(cohort_id: String, enroller_principal: Principal) -> String {
    let caller = caller();
    COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        if let Some(request_list) = requests.get_mut(&caller) {
            if let Some(request) = request_list.iter_mut().find(|req| req.request_status == "pending") {
                
                let current_count = APPLIER_COUNT.with(|applier_count| {
                    applier_count.borrow().get(&cohort_id).copied().unwrap_or(0)
                });
                let max_seats = get_cohort_inner_func(cohort_id.clone()).map(|c| c.cohort.no_of_seats).unwrap_or(0);

                if current_count >= max_seats {
                    return "All seats for this cohort are occupied!".to_string();
                }
                // Approve the request directly without any additional checks
                request.request_status = "accepted".to_string();
                request.accepted_at = ic_cdk::api::time();

                // Logic to add the user directly to the cohort
                let data_added = if MENTOR_REGISTRY.with(|mentors| mentors.borrow().contains_key(&enroller_principal)) {
                    request.enroller_data.mentor_data.clone().map(|mentor_data| {
                        MENTORS_APPLIED_FOR_COHORT.with(|mentors_applied| {
                            let mut mentors_applied = mentors_applied.borrow_mut();
                            mentors_applied.entry(cohort_id.clone()).or_default().push(mentor_data);
                        });
                        true
                    }).is_some()
                } else if VENTURECAPITALIST_STORAGE.with(|capitalist| capitalist.borrow().contains_key(&enroller_principal)) {
                    request.enroller_data.vc_data.clone().map(|vc_data| {
                        CAPITALIST_APPLIED_FOR_COHORT.with(|vcs_applied| {
                            let mut vcs_applied = vcs_applied.borrow_mut();
                            vcs_applied.entry(cohort_id.clone()).or_default().push(vc_data);
                        });
                        true
                    }).is_some()
                } else if APPLICATION_FORM.with(|projects| projects.borrow().contains_key(&enroller_principal)) {
                    request.enroller_data.project_data.clone().map(|project_data| {
                        PROJECTS_APPLIED_FOR_COHORT.with(|projects_applied| {
                            let mut projects_applied = projects_applied.borrow_mut();
                            projects_applied.entry(cohort_id.clone()).or_default().push(project_data);
                        });
                        true
                    }).is_some()
                } else {
                    false
                };

                if data_added {
                    APPLIER_COUNT.with(|applier_count| {
                        let mut applier_count = applier_count.borrow_mut();
                        *applier_count.entry(cohort_id.clone()).or_insert(0) += 1;
                    });
                    "Request approved successfully".to_string()
                } else {
                    "User role not recognized or missing necessary data to add to cohort".to_string()
                }
            } else {
                "Request not found or already processed".to_string()
            }
        } else {
            "No requests found for this cohort".to_string()
        }
    })
}



#[update]
pub fn reject_enrollment_request(cohort_creator_principal: Principal, enroller_principal: Principal) -> String {
    COHORT_ENROLLMENT_REQUESTS.with(|requests| {
        let mut requests = requests.borrow_mut();
        if let Some(request_list) = requests.get_mut(&cohort_creator_principal) {
            for request in request_list.iter_mut() {
                if request.request_status == "pending" {
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

#[update]
pub fn apply_for_a_cohort_as_a_mentor(cohort_id: String) -> String {
    let caller = caller();

    let is_he_mentor = MENTOR_REGISTRY.with(|mentors| mentors.borrow().contains_key(&caller));

    if is_he_mentor {
        let mentor_data_option = get_mentor_info_using_principal(caller);
        let mentor_data = match mentor_data_option {
            Some(data) => data,
            None => return "Mentor data is required but not found.".to_string(),
        };
        send_enrollment_request_as_mentor(cohort_id, mentor_data)
    } else {
        "You should either be an mentor to register yourself in cohort".to_string()
    }
}

#[update]
pub fn apply_for_a_cohort_as_a_investor(cohort_id: String) -> String {
    let caller = caller();
    let is_he_investor = VENTURECAPITALIST_STORAGE.with(|capitalist| capitalist.borrow().contains_key(&caller));


    if is_he_investor {
        let vc_data_option = get_vc_info_using_principal(caller);
        let vc_data = match vc_data_option {
            Some(data) => data,
            None => return "Investor data is required but not found.".to_string(),
        };
        send_enrollment_request_as_investor(cohort_id, vc_data)
    } else {
        "You should either be an investor to register yourself in cohort".to_string()
    }
}

#[query]
pub fn get_no_of_individuals_applied_for_cohort_using_id(cohort_id: String) -> Result<u8, String>{
    let count : Option<u8> = APPLIER_COUNT.with(|count| count.borrow().get(&cohort_id).cloned());

    let project_count_in_cohort = match count {
        Some(count) => count,
        None => return Err("No one has applied for this cohort".to_string())
    };

    Ok(project_count_in_cohort)
}



#[update]
pub fn apply_for_a_cohort_as_a_project(
    cohort_id: String,
) -> String {
    let caller = caller();

    let project_data_option = get_project_info_using_principal(caller);
    let project_data = match project_data_option {
        Some(data) => data,
        None => return "Mentor data is required but not found.".to_string(),
    };
    
    send_enrollment_request_as_project(cohort_id, project_data);
    "Request Has Been Sent To Cohort Creator".to_string()
}


#[query]
pub fn get_projects_applied_for_cohort(
    cohort_id: String,
) -> Result<Vec<ProjectInfoInternal>, String> {
    let caller = caller();

    let cohort: Option<CohortDetails> = COHORT.with(|cohort: &RefCell<CohortInfo>| {
        let cohort = cohort.borrow();
        cohort.get(&cohort_id).cloned()
    });

    //cohort existence
    let concerned_cohort: CohortDetails = match cohort {
        Some(cohort) => cohort,
        None => return Err("Cohort doesn't exist".to_string()),
    };



    //caller must be cohort creator
    // if concerned_cohort.cohort_creator != caller {
    //     return Err("You must be a cohort creator to see project details of individuals".to_string());
    // }

    //project applied for given cohort_id
    let projects_in_cohort: Vec<ProjectInfoInternal> =
        PROJECTS_APPLIED_FOR_COHORT.with(|cohort_projects: &RefCell<ProjectsAppliedForCohort>| {
            let cohort_projects = cohort_projects.borrow();
            cohort_projects.get(&cohort_id).cloned().unwrap_or_default()
        });

    Ok(projects_in_cohort)
}

#[query]
pub fn get_mentors_applied_for_cohort(
    cohort_id: String,
) -> Result<Vec<MentorInternal>, String> {
    let caller = caller();

    let cohort: Option<CohortDetails> = COHORT.with(|cohort: &RefCell<CohortInfo>| {
        let cohort = cohort.borrow();
        cohort.get(&cohort_id).cloned()
    });


    let concerned_cohort: CohortDetails = match cohort {
        Some(cohort) => cohort,
        None => return Err("Cohort doesn't exist".to_string()),
    };

    // if concerned_cohort.cohort_creator != caller {
    //     return Err("You must be the cohort creator to see mentor details of individuals".to_string());
    // }

    let mentors_in_cohort: Vec<MentorInternal> =
        MENTORS_APPLIED_FOR_COHORT.with(|cohort_mentors: &RefCell<MentorsAppliedForCohort>| {
            let cohort_mentors = cohort_mentors.borrow();
            cohort_mentors.get(&cohort_id).cloned().unwrap_or_default()
        });

    Ok(mentors_in_cohort)
}

#[query]
pub fn get_vcs_applied_for_cohort(
    cohort_id: String,
) -> Result<Vec<VentureCapitalistInternal>, String> {
    let caller = caller();

    let cohort: Option<CohortDetails> = COHORT.with(|cohort: &RefCell<CohortInfo>| {
        let cohort = cohort.borrow();
        cohort.get(&cohort_id).cloned()
    });


    let concerned_cohort: CohortDetails = match cohort {
        Some(cohort) => cohort,
        None => return Err("Cohort doesn't exist".to_string()),
    };


    // if concerned_cohort.cohort_creator != caller {
    //     return Err("You must be the cohort creator to see venture capitalist details of individuals".to_string());
    // }


    let vcs_in_cohort: Vec<VentureCapitalistInternal> =
        CAPITALIST_APPLIED_FOR_COHORT.with(|cohort_vcs: &RefCell<CapitalistAppliedForCohort>| {
            let cohort_vcs = cohort_vcs.borrow();
            cohort_vcs.get(&cohort_id).cloned().unwrap_or_default()
        });

    Ok(vcs_in_cohort)
}




//get_all_my_peers
pub fn get_my_peers(cohort_id : String, your_project_id : String){

    //check that caller is in the cohort    
    PROJECTS_APPLIED_FOR_COHORT.with(|cohort : &RefCell<ProjectsAppliedForCohort>|{
        let cohort_projects = cohort.borrow();

        //do cohort exists ?
        let do_cohort_exists = cohort_projects.contains_key(&cohort_id);

        // if !do_cohort_exists{
        //     retturn 
        // }

        let cohort_projects = cohort_projects.get(&cohort_id).cloned();

//         let projects = match cohort_projects{
// Some(projects) => projects,
// None => return Err("") 
//         }

    })

} 

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct CohortFilterCriteria {
    pub tags: Option<String>,
    pub level_on_rubric: Option<f64>,
    pub no_of_seats_range: Option<(u8, u8)>,
}

#[query]
pub fn filter_cohorts(criteria: CohortFilterCriteria) -> Vec<CohortDetails> {
    COHORT.with(|cohorts| {
        let cohorts = cohorts.borrow();

        cohorts.values()
            .filter(|cohort_details| {
                let tags_match = criteria.tags.as_ref()
                    .map_or(true, |tags| cohort_details.cohort.tags.contains(tags));

                let level_match = criteria.level_on_rubric
                    .map_or(true, |level| cohort_details.cohort.criteria.level_on_rubric == level);

                let seats_match = criteria.no_of_seats_range
                    .map_or(true, |(min_seats, max_seats)| {
                        let seats = cohort_details.cohort.no_of_seats;
                        seats >= min_seats && seats <= max_seats
                    });

                tags_match && level_match && seats_match
            })
            .cloned()
            .collect()
    })
}


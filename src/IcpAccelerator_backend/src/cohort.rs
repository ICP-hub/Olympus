use crate::project_registration::{ProjectInfo, ProjectInfoInternal};
use crate::{
    get_roles_for_principal, ApplicationDetails, MentorInternal, MentorRegistry,
    VentureCapitalistInternal, VentureCapitalistStorage, APPLICATION_FORM, MENTOR_REGISTRY,
    VENTURECAPITALIST_STORAGE,
};
use candid::{CandidType, Principal};
use ic_cdk::api::{management_canister::main::raw_rand, time};
use ic_cdk::caller;
use ic_cdk_macros::{query, update};
use serde::Deserialize;
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;
use crate::send_cohort_request_to_admin;

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
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct CohortRequest {
    pub cohort_details : CohortDetails,
    pub sent_at : u64,
    pub accepted_at : u64,
    pub rejected_at : u64,
    pub request_status : String
}

pub type MentorsAppliedForCohort = HashMap<String, Vec<MentorInternal>>;
pub type CohortInfo = HashMap<String, CohortDetails>;
pub type ProjectsAppliedForCohort = HashMap<String, Vec<ProjectInfoInternal>>;
pub type ApplierCount = HashMap<String, u8>;
pub type CapitalistAppliedForCohort = HashMap<String, Vec<VentureCapitalistInternal>>;
pub type CohortsAssociated = HashMap<String, Vec<String>>;

thread_local! {
    pub static COHORT : RefCell<CohortInfo> = RefCell::new(CohortInfo::new());
    pub static PROJECTS_APPLIED_FOR_COHORT : RefCell<ProjectsAppliedForCohort> = RefCell::new(ProjectsAppliedForCohort::new());
    pub static MENTORS_APPLIED_FOR_COHORT : RefCell<MentorsAppliedForCohort> = RefCell::new(MentorsAppliedForCohort::new());
    pub static CAPITALIST_APPLIED_FOR_COHORT : RefCell<CapitalistAppliedForCohort> = RefCell::new(CapitalistAppliedForCohort::new());
    pub static APPLIER_COUNT : RefCell<ApplierCount> = RefCell::new(ApplierCount::new());
    pub static ASSOCIATED_COHORTS_WITH_PROJECT : RefCell<CohortsAssociated> = RefCell::new(CohortsAssociated::new());

    pub static MY_SENT_COHORT_REQUEST : RefCell<HashMap<Principal, Vec<CohortRequest>>> = RefCell::new(HashMap::new());
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


//needs to be made good in terms of error handling

#[update]
pub fn apply_for_a_cohort_as_a_mentor_or_investor(cohort_id: String) -> String {
    let caller = caller();

    //who's applying

    let is_he_mentor: bool = MENTOR_REGISTRY.with(|mentors| mentors.borrow().contains_key(&caller));

    let is_he_investor: bool =
        VENTURECAPITALIST_STORAGE.with(|capitalist| capitalist.borrow().contains_key(&caller));

    if is_he_mentor {
        MENTOR_REGISTRY.with(|mentors: &RefCell<MentorRegistry>| {  
            let mentor_up_for_cohort = mentors.borrow().get(&caller).unwrap().clone();

            MENTORS_APPLIED_FOR_COHORT.with(|mentors_applied: &RefCell<MentorsAppliedForCohort>| {
                let mut mentors_applied = mentors_applied.borrow_mut();
                let mentors = mentors_applied
                    .entry(cohort_id.clone())
                    .or_insert(Vec::new());

                if !mentors.contains(&mentor_up_for_cohort) {
                    // mentors.push(mentor_up_for_cohort.clone())

                    APPLIER_COUNT.with(|applier_count: &RefCell<ApplierCount>| {
                        let mut applier_count = applier_count.borrow_mut();
                        let mut count = applier_count.get_mut(&cohort_id.clone()).unwrap().clone();

                        let no_of_total_seats = get_cohort(cohort_id.clone()).cohort.no_of_seats;

                        if count <= no_of_total_seats {
                            mentors.push(mentor_up_for_cohort.clone());

                            count += 1;

                            applier_count.insert(cohort_id.clone(), count);

                            return format!(
                                "you have successfully applied for the cohort with cohort id {}",
                                cohort_id.clone()
                            );
                        } else {
                            return format!("all seats for this cohort are occupied!");
                        }
                    })
                } else {
                    return format!("you are already a part of the cohort");
                }
            })
        })
    } else if is_he_investor {
        VENTURECAPITALIST_STORAGE.with(|capitalist: &RefCell<VentureCapitalistStorage>| {
            let venture_capitalist = capitalist.borrow().get(&caller).unwrap().clone();

            CAPITALIST_APPLIED_FOR_COHORT.with(
                |capitalist: &RefCell<CapitalistAppliedForCohort>| {
                    let mut capitalist_applied = capitalist.borrow_mut();
                    let ventures = capitalist_applied
                        .entry(cohort_id.clone())
                        .or_insert(Vec::new());

                    if !ventures.contains(&venture_capitalist) {
                        

                        APPLIER_COUNT.with(|applier_count: &RefCell<ApplierCount>| {
                            let mut applier_count = applier_count.borrow_mut();
                            let mut count = applier_count.get_mut(&cohort_id.clone()).unwrap().clone();
    
                            let no_of_total_seats = get_cohort(cohort_id.clone()).cohort.no_of_seats;
    
                            if count <= no_of_total_seats {
                                ventures.push(venture_capitalist);
    
                                count += 1;
    
                                applier_count.insert(cohort_id.clone(), count);
    
                                return format!(
                                    "you have successfully applied for the cohort with cohort id {}",
                                    cohort_id.clone()
                                );
                            } else {
                                return format!("all seats for this cohort are occupied!");
                            }
                        })
                    }else {
                        return format!("you are already a part of the cohort");
                    }
                },
            )
        })
    } else {
        return format!("you should either be an investor or mentor to register yourself in cohort")
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
    project_id: String,
) -> Result<String, String> {
    let caller = caller();

    //does he have any created project
    let projects: Option<Vec<ProjectInfoInternal>> = APPLICATION_FORM
        .with(|projects: &RefCell<ApplicationDetails>| projects.borrow().get(&caller).cloned());
    let projects = match projects {
        Some(projects) => projects,
        None => return Err("You don't have any existing project.".to_string()),
    };

    //has he created project with given project_id
    let concerned_project = projects
        .iter()
        .find(|p| p.uid == project_id)
        .ok_or_else(|| "Project not found.".to_string())?;

    PROJECTS_APPLIED_FOR_COHORT.with(|cohort_projects: &RefCell<ProjectsAppliedForCohort>| {
        let mut cohort_projects = cohort_projects.borrow_mut();
        let entry = cohort_projects
            .entry(cohort_id.clone())
            .or_insert_with(Vec::new);

        if entry.contains(concerned_project) {
            return Err("You are already a part of the cohort.".to_string());
        }

        // Check if cohort has available seats
        let no_of_total_seats = get_cohort(cohort_id.clone()).cohort.no_of_seats;
        let count = APPLIER_COUNT.with(|applier_count| {
            let mut applier_count = applier_count.borrow_mut();
            let count = applier_count.entry(cohort_id.clone()).or_insert(0);
            *count += 1;
            *count
        });

        if count > no_of_total_seats {
            return Err("All seats for this cohort are occupied!".to_string());
        }

        entry.push(concerned_project.clone());

        Ok(format!(
            "You have successfully applied for the cohort with cohort id {}",
            cohort_id
        ))
    })
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
    if concerned_cohort.cohort_creator != caller {
        return Err("You must be a cohort creator to see project details of individuals".to_string());
    }

    //project applied for given cohort_id
    let projects_in_cohort: Vec<ProjectInfoInternal> =
        PROJECTS_APPLIED_FOR_COHORT.with(|cohort_projects: &RefCell<ProjectsAppliedForCohort>| {
            let cohort_projects = cohort_projects.borrow();
            cohort_projects.get(&cohort_id).cloned().unwrap_or_default()
        });

    Ok(projects_in_cohort)
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
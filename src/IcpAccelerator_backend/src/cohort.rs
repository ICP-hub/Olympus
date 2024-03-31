use crate::project_registration::{ProjectInfo, ProjectInfoInternal};
use crate::{
    ApplicationDetails, MentorInternal, MentorRegistry, VentureCapitalistStorage, APPLICATION_FORM,
    MENTOR_REGISTRY, VENTURECAPITALIST_STORAGE,
};
use candid::{CandidType, Principal};
use ic_cdk::api::{management_canister::main::raw_rand, time};
use ic_cdk::caller;
use ic_cdk_macros::{query, update};
use serde::Deserialize;
use sha2::{Digest, Sha256};
use std::borrow::BorrowMut;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Clone, CandidType, Deserialize)]
pub struct Eligibility {
    level_on_rubric: f64,
    eligibility: Option<String>,
}

#[derive(Clone, CandidType, Deserialize)]
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

#[derive(Clone, CandidType, Deserialize)]
pub struct CohortDetails {
    uid: String,
    cohort: Cohort,
    created_at: u64,
}

pub type MentorsAppliedForCohort = HashMap<String, Vec<MentorInternal>>;
pub type CohortInfo = HashMap<String, Vec<CohortDetails>>;
pub type ProjectsAppliedForCohort = HashMap<String, Vec<ProjectInfoInternal>>;

thread_local! {
    pub static COHORT : RefCell<CohortInfo> = RefCell::new(CohortInfo::new());
    pub static PROJECTS_APPLIED_FOR_COHORT : RefCell<ProjectsAppliedForCohort> = RefCell::new(ProjectsAppliedForCohort::new());
    pub static MENTORS_APPLIED_FOR_COHORT : RefCell<MentorsAppliedForCohort> = RefCell::new(MentorsAppliedForCohort::new());
}

#[update]
pub async fn create_cohort(params: Cohort) -> String {
    let is_he_mentor = MENTOR_REGISTRY.with(|storage| {
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
            return format!("you are not priviledged to create a cohort");
        }
    }

    let u_ids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&u_ids));

    let cohort_details = CohortDetails {
        uid: uid.clone(),
        cohort: params.clone(),
        created_at: time(),
    };

    COHORT.with(|storage| {
        let mut storage = storage.borrow_mut();
        storage
            .entry(uid.clone())
            .or_insert_with(Vec::new)
            .push(cohort_details);
    });

    format!(
        "accelerator is successfully created by {} with cohort id {}",
        caller(),
        uid.clone()
    )
}

// #[query]
// pub fn get_cohort(cohort_id: String) -> Vec<CohortDetails> {
//     COHORT.with(|storage| {
//         let res = storage
//             .borrow()
//             .get(&cohort_id)
//             .expect("you have not crerated a cohort")
//             .clone();
//         res
//     })
// }

// #[query]
// pub fn get_all_cohorts() -> Vec<CohortDetails> {
//     COHORT.with(|storage| {
//         storage
//             .borrow()
//             .values()
//             .flat_map(|v| v.iter().cloned())
//             .collect()
//     })
// }

pub fn apply_for_a_cohort(cohort_id: String) {
    let caller = caller();

    //who's applying
    
    let is_he_mentor: bool = MENTOR_REGISTRY.with(|mentors| mentors.borrow().contains_key(&caller));

    if is_he_mentor {
        MENTOR_REGISTRY.with(|mentors: &RefCell<MentorRegistry>| {
            let mentor_up_for_cohort = mentors.borrow().get(&caller).unwrap().clone();

            MENTORS_APPLIED_FOR_COHORT.with(
                |mentors_applied: &RefCell<MentorsAppliedForCohort>| {
                    let mut mentors_applied = mentors_applied.borrow_mut();
                    let mentors = mentors_applied
                        .entry(cohort_id.clone())
                        .or_insert(Vec::new());

                    if !mentors.contains(&mentor_up_for_cohort) {
                        mentors.push(mentor_up_for_cohort.clone())
                    }
                },
            );
        })
    }

    
}


pub fn apply_for_a_cohort_as_a_project(cohort_id: String, project_id : String){
    let caller = caller();

    let is_he_project = APPLICATION_FORM.with(|projects| projects.borrow().contains_key(&caller));

    if is_he_project {
        APPLICATION_FORM.with(|projects: &RefCell<ApplicationDetails>| {
            let projects = projects.borrow().get(&caller).unwrap().clone();

            let concerned_project = projects.iter().find(|p| {
                p.uid == project_id
            }).unwrap();


            PROJECTS_APPLIED_FOR_COHORT.with(|cohort_projects : &RefCell<ProjectsAppliedForCohort>| {
                let mut cohort_projects = cohort_projects.borrow_mut();
                let cohort_projects = cohort_projects.entry(cohort_id).or_insert_with(Vec::new);

                




            });
        });
    }

}
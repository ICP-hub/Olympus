use crate::{state_handler::*, UserInfoInternal, UserInformation};
use crate::jobs::job_types::*;
use candid::Principal;
use ic_cdk::api::caller;
use ic_cdk_macros::*;
use sha2::{Digest, Sha256};
use crate::guard::*;
use crate::user_modules::get_user::*;

#[update(guard = "combined_guard")]
pub async fn post_job(params: Jobs) -> String {
    let principal_id = ic_cdk::api::caller();

    //let mut cached_user_data = None;
    //let user_data = get_user_info_with_cache(principal_id, &mut cached_user_data);

    let current_time = ic_cdk::api::time();

    let random_bytes = ic_cdk::api::management_canister::main::raw_rand()
                .await
                .expect("Failed to generate random bytes")
                .0;

    let uid = format!("{:x}", Sha256::digest(&random_bytes));

    let new_job = JobsInternal {
        job_id: uid.clone(),
        job_data: params.clone(),
        timestamp: current_time,
        job_poster: ic_cdk::caller(),
    };

    let result = mutate_state(|state| {
        let job_storage = &mut state.post_job;
        if let Some(caller_jobs) = job_storage.get(&StoredPrincipal(principal_id)) {
            let mut caller_jobs = caller_jobs.clone(); // Clone to mutate
            caller_jobs.0.push(new_job);
            job_storage.insert(StoredPrincipal(principal_id), caller_jobs);
        } else {
            job_storage.insert(StoredPrincipal(principal_id), Candid(vec![new_job]));
        }
        format!("Job post added successfully with ID: {}", uid) // Return job_id
    });

    result
}


#[update(guard = "combined_guard")]
pub async fn update_job_post_by_id(job_id: String, new_details: Jobs) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.post_job;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(caller())) {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("State before update: {:?}", caller_announcements.0);

            for announcement in caller_announcements.0.iter_mut() {
                if announcement.job_id == job_id {
                    ic_cdk::println!("Job post before update: {:?}", announcement);
                    // Update job details
                    announcement.job_data = new_details;
                    ic_cdk::println!("State after update: {:?}", announcement);
                    announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);

                    return format!("Job post updated successfully for job_id {}", job_id);
                }
            }

            format!("No job post found with job_id {}", job_id)
        } else {
            ic_cdk::println!("No job post entry found for this caller.");
            format!("No job post entry found for this caller.")
        }
    })
}


#[update(guard = "combined_guard")]
pub async fn delete_job_post_by_id(job_id: String) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.post_job;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(caller())) {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("State before deletion: {:?}", caller_announcements.0);

            let original_len = caller_announcements.0.len();
            caller_announcements
                .0
                .retain(|announcement| announcement.job_id != job_id);

            if caller_announcements.0.len() < original_len {
                announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);
                ic_cdk::println!("Job post deleted successfully for job_id {}", job_id);
                format!("Job post deleted successfully for job_id {}", job_id)
            } else {
                ic_cdk::println!("No job post found with job_id {}", job_id);
                format!("No job post found with job_id {}", job_id)
            }
        } else {
            ic_cdk::println!("No job post entry found for this caller.");
            format!("No job post entry found for this caller.")
        }
    })
}


#[query(guard = "combined_guard")]
pub fn get_all_jobs(page_number: usize, page_size: usize) -> Vec<(JobsInternal, UserInformation)> {
    read_state(|state| {
        let mut all_jobs_info: Vec<(JobsInternal, UserInformation)> = Vec::new();

        for (_, job_list) in state.post_job.iter() {
            for job_internal in job_list.0.iter() {
                let user_info = get_user_info_using_principal(job_internal.job_poster);
                all_jobs_info.push((job_internal.clone(), user_info.unwrap().params));
            }
        }

        ic_cdk::println!("Total jobs found: {}", all_jobs_info.len());

        if all_jobs_info.is_empty() {
            return vec![];
        }

        all_jobs_info.sort_by(|a, b| b.0.timestamp.cmp(&a.0.timestamp));

        let max_page_number = (all_jobs_info.len() + page_size - 1) / page_size - 1;

        if page_number > max_page_number {
            ic_cdk::println!("Page number {} is out of range, max page number is {}. Returning empty vector.", page_number, max_page_number);
            return vec![];
        }

        let start_index = page_number * page_size;

        all_jobs_info.into_iter()
            .skip(start_index)
            .take(page_size)
            .collect()
    })
}





#[query(guard = "combined_guard")]
pub fn get_jobs_posted_by_principal(caller: Principal) -> Vec<(JobsInternal, UserInformation)> {
    read_state(|state| {
        let mut jobs_info_for_principal = Vec::new();
        for (poster_principal, job_list) in state.post_job.iter() {
            if poster_principal.0 == caller {
                for job_internal in job_list.0.iter() {
                    let user_info = get_user_info_using_principal(job_internal.job_poster)
                        .unwrap_or_else(|| UserInfoInternal::default()); 
                    jobs_info_for_principal.push((job_internal.clone(), user_info.params));
                }
            }
        }
        jobs_info_for_principal
    })
}

#[query(guard = "combined_guard")]
pub fn get_job_details_using_uid(params: String) -> Option<JobsInternal> {
    read_state(|state| {
        for (_poster_principal, job_list) in state.post_job.iter() {
            for job_internal in job_list.0.iter() {
                if job_internal.job_id == params {
                    return Some(job_internal.clone());
                }
            }
        }
        None
    })
}



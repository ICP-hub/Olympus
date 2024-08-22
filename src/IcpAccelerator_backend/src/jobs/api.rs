use crate::state_handler::*;
use crate::jobs::job_types::*;
use candid::Principal;
use ic_cdk::api::caller;
use ic_cdk_macros::*;
use sha2::{Digest, Sha256};
use crate::guard::*;
use crate::user_modules::get_user::*;

#[update(guard = "is_user_anonymous")]
pub async fn post_job(params: Jobs) -> String {
    let principal_id = ic_cdk::api::caller();

    let user_data = get_user_information_internal(principal_id);

    let current_time = ic_cdk::api::time();

    let random_bytes = ic_cdk::api::management_canister::main::raw_rand()
                .await
                .expect("Failed to generate random bytes")
                .0;

    let uid = format!("{:x}", Sha256::digest(&random_bytes));

    let new_job = JobsInternal {
        job_id: uid,
        job_data: params.clone(),
        timestamp: current_time,
        job_poster: Some(user_data),
    };

    ic_cdk::println!("New Job Details: {:?}", new_job);

    let result = mutate_state(|state| {
        let announcement_storage = &mut state.post_job;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(principal_id))
        {
            ic_cdk::println!("Existing job entry found.");
            ic_cdk::println!("State before addition: {:?}", caller_announcements.0);
            let mut caller_announcements = caller_announcements.clone(); // Clone to mutate
            caller_announcements.0.push(new_job);
            ic_cdk::println!("State after addition: {:?}", caller_announcements.0);
            announcement_storage.insert(StoredPrincipal(principal_id), caller_announcements);
            format!("Job post added successfully at {}", current_time)
        } else {
            ic_cdk::println!("No job entry found for this caller.");
            ic_cdk::println!("State before addition: None");
            announcement_storage.insert(StoredPrincipal(principal_id), Candid(vec![new_job]));

            format!("Job Post added successfully at {}", current_time)
        }
    });

    result
}

#[update(guard = "is_user_anonymous")]
pub async fn update_job_post_by_id(timestamp: u64, new_details: Jobs) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.post_job;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(caller()))
        {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("state before update {:?}", caller_announcements.0);
            for announcement in caller_announcements.0.iter_mut() {
                if announcement.timestamp == timestamp {
                    ic_cdk::println!("job post before update: {:?}", announcement);
                    // Update announcement details
                    announcement.job_data = new_details;
                    ic_cdk::println!("State after update: {:?}", announcement);
                    announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);

                    return format!("job post updated successfully for {}", timestamp);
                }
            }

            format!("No job post found with timestamp {}", timestamp)
        } else {
            ic_cdk::println!("No job post entry found for this caller.");
            format!("No job post entry found for this caller.")
        }
    })
}

#[update(guard = "is_user_anonymous")]
pub async fn delete_job_post_by_id(timestamp: u64) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.post_job;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(caller()))
        {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("state before update {:?}", caller_announcements.0);

            let original_len = caller_announcements.0.len();
            caller_announcements
                .0
                .retain(|announcement| announcement.timestamp != timestamp);

            if caller_announcements.0.len() < original_len {
                announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);
                ic_cdk::println!("job post deleted successfully for {}", timestamp);
                format!("job post deleted successfully for {}", timestamp)
            } else {
                ic_cdk::println!("No job post found with timestamp {}", timestamp);
                format!("No job post found with timestamp {}", timestamp)
            }
        } else {
            ic_cdk::println!("No job post entry found for this caller.");
            format!("No job post entry found for this caller.")
        }
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_jobs(page_number: usize, page_size: usize) -> Vec<JobsInternal> {
    read_state(|state| {
        let mut all_jobs: Vec<JobsInternal> = Vec::new();

        let start_index = page_number * page_size;
        let mut current_index = 0;

        for (_, job_list) in state.post_job.iter() {
            for job_internal in job_list.0.iter() {
                if current_index >= start_index && all_jobs.len() < page_size {
                    all_jobs.push(job_internal.clone());
                }

                current_index += 1;

                if all_jobs.len() == page_size {
                    break;
                }
            }

            if all_jobs.len() == page_size {
                break;
            }
        }

        all_jobs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

        all_jobs
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_jobs_posted_by_principal(caller: Principal) -> Vec<JobsInternal> {
    read_state(|state| {
        let mut jobs_for_principal = Vec::new();
        for (poster_principal, job_list) in state.post_job.iter() {
            jobs_for_principal.extend(
                job_list.0.iter()
                         .filter(|_job_internal| poster_principal.0 == caller)
                         .cloned()
            );
        }
        jobs_for_principal
    })
}

#[query(guard = "is_user_anonymous")]
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


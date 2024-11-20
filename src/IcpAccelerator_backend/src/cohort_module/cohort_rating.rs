use crate::guard::*;
use crate::state_handler::*;
use crate::types::ratings_types::*;
use crate::project_module::project_types::*;
use candid::CandidType;
use ic_cdk::api::caller;
use ic_cdk::api::time;
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};

#[update(guard = "combined_guard")]
pub fn update_peer_rating_api(rating_data: PeerRatingUpdate) -> String {
    let caller = caller();
    ic_cdk::println!("Caller: {:?}", caller);

    if rating_data.ratings.is_empty() {
        ic_cdk::println!("No ratings provided, nothing updated.");
        return "No ratings provided, nothing updated.".to_string();
    }

    let current_timestamp = time();
    ic_cdk::println!("Current timestamp: {:?}", current_timestamp);

    let thirteen_days_in_seconds: u64 = 13 * 24 * 60 * 60;
    ic_cdk::println!("Thirteen days in seconds: {:?}", thirteen_days_in_seconds);

    let can_rate = read_state(|state| {
        let can_rate = state
            .cohort_rating_system
            .get(&rating_data.cohort_id)
            .and_then(|candid_vec| {
                candid_vec.0.get(&rating_data.project_id).map(|project| {
                    project.get(&caller).map_or(true, |ratings| {
                        ratings.last().map_or(true, |(_, last_rating)| {
                            let can_rate = current_timestamp > last_rating.timestamp + thirteen_days_in_seconds;
                            ic_cdk::println!("Last rating timestamp: {:?}, can rate: {:?}", last_rating.timestamp, can_rate);
                            can_rate
                        })
                    })
                })
            })
            .unwrap_or(true); // Ensure default to true if any of the gets are None
        ic_cdk::println!("Can rate: {:?}", can_rate);
        can_rate
    });

    if !can_rate {
        ic_cdk::println!("Rating not allowed within the 13-day window.");
        return "You cannot rate this project for the next 13 days.".to_string();
    }

     mutate_state(|state| {
        // Retrieve or initialize the cohort rating
        let mut cohort_rating = state
            .cohort_rating_system
            .get(&rating_data.cohort_id)
            .map(|candid_res| candid_res.0.clone())
            .unwrap_or_default();
        ic_cdk::println!("Cohort rating retrieved or default initialized.");

        // Retrieve or initialize the project rating
        let project_rating = cohort_rating
            .entry(rating_data.project_id.clone())
            .or_default();
        ic_cdk::println!("Project rating for project ID {:?} accessed or initialized.", rating_data.project_id);

        // Retrieve or initialize the ratings for the caller
        let project_ratings = project_rating.entry(caller).or_default();
        ic_cdk::println!("Project ratings for caller accessed or initialized.");

        // Add new ratings
        for rating in rating_data.ratings {
            let timestamped_rating = TimestampedRating {
                rating: rating.clone(),
                timestamp: current_timestamp,
            };
            ic_cdk::println!("Adding rating: {:?} at timestamp: {:?}", rating, current_timestamp);
            project_ratings.push(("peer".to_string(), timestamped_rating));
        }

        // You need to write back the modified cohort_rating map into the state
        state.cohort_rating_system.insert(rating_data.cohort_id.clone(), Candid(cohort_rating));

        ic_cdk::println!("Ratings updated successfully.");
        "Ratings updated successfully.".to_string()
    });

    read_state(|state| {
        ic_cdk::println!("Logging cohort IDs and project IDs after update...");
        for (cohort_id, projects) in state.cohort_rating_system.iter() {
            ic_cdk::println!("Cohort ID: {}", cohort_id);
            for (project_id, _) in projects.0.iter() {
                ic_cdk::println!("  Project ID: {}", project_id);
            }
        }
    });
    "Data updated and logged successfully".to_string()
}


#[update(guard = "combined_guard")]
pub fn calculate_and_store_average_rating(
    cohort_id: String,
    project_id: String,
) -> Result<f64, String> {
    let average = read_state(|system| {
        let system = &system.cohort_rating_system;
        if let Some(cohort_ratings) = system.get(&cohort_id) {
            if let Some(project_ratings) = cohort_ratings.0.get(&project_id) {
                let total_ratings = project_ratings
                    .values()
                    .flat_map(|ratings| {
                        ratings.iter().map(|(_, rating)| rating.rating.sub_level_number)
                    })
                    .collect::<Vec<_>>();

                if total_ratings.is_empty() {
                    return Err("No ratings available for this project.".to_string());
                }

                let sum: f64 = total_ratings.iter().sum();
                let count = total_ratings.len() as f64;
                Ok(sum / count)  // Calculate the average and return it
            } else {
                Err("No ratings found for the specified project in this cohort.".to_string())
            }
        } else {
            Err("Specified cohort not found.".to_string())
        }
    })?;

    mutate_state(|state| {
        let avg_ratings = &mut state.cohort_average_ratings;
        let mut cohort_avg = avg_ratings
            .get(&cohort_id)
            .map(|cohort_avg_rating| cohort_avg_rating.0.clone())
            .unwrap_or_default();

        cohort_avg.insert(project_id.clone(), average);
        avg_ratings.insert(cohort_id, Candid(cohort_avg));  
    });

    Ok(average)  
}


#[query(guard="combined_guard")]
pub fn get_stored_average_rating(cohort_id: String, project_id: String) -> Result<f64, String> {
    read_state(|avg_ratings| {
        let avg_ratings = &avg_ratings.cohort_average_ratings;
        if let Some(cohort_avg) = avg_ratings.get(&cohort_id) {
            if let Some(average) = cohort_avg.0.get(&project_id) {
                Ok(*average)
            } else {
                Err("Average rating not found for the specified project.".to_string())
            }
        } else {
            Err("Specified cohort not found.".to_string())
        }
    })
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct LeaderboardEntryForCohorts {
    cohort_id: String,
    project_data: Option<Vec<ProjectInfoInternal>>, // Storing a list of projects per cohort
    average_rating: f64,
}

#[query(guard="combined_guard")]
pub fn generate_cohort_leaderboard() -> Vec<LeaderboardEntryForCohorts> {
    let mut leaderboard_entries: Vec<LeaderboardEntryForCohorts> = Vec::new();

    mutate_state(|avg_ratings| {
        let avg_ratings = &mut avg_ratings.cohort_average_ratings;

        for (cohort_id, creator_averages) in avg_ratings.iter() {
            let mut project_entries: Vec<ProjectInfoInternal> = Vec::new();
            let mut total_average = 0.0;
            let mut project_count = 0;

            for (creator_principal, average) in creator_averages.0.iter() {
                match crate::project_module::get_project::get_project_using_id(creator_principal.to_string()) {
                    Some(info) => {
                        project_entries.push(info);
                        total_average += *average;
                        project_count += 1;
                    }
                    None => {
                        eprintln!(
                            "No project information found for Principal: {}",
                            creator_principal
                        );
                    }
                }
            }

            if project_count > 0 {
                let cohort_average = total_average / project_count as f64;
                leaderboard_entries.push(LeaderboardEntryForCohorts {
                    cohort_id: cohort_id.clone(),
                    project_data: Some(project_entries),
                    average_rating: cohort_average,
                });
            }
        }
    });

    leaderboard_entries.sort_by(|a, b| {
        b.average_rating
            .partial_cmp(&a.average_rating)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    leaderboard_entries
}

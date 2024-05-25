use crate::state_handler::*;
use crate::{
    get_project_using_id,
    project_registration::{
        get_project_public_information_using_id, ProjectInfoInternal, APPLICATION_FORM,
    },
};
use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::time;
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct TimestampedRating {
    pub rating: Rating,
    pub timestamp: u64,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct Rating {
    level_name: String,
    level_number: f64,
    sub_level: String,
    sub_level_number: f64,
    rating: f64,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct PeerRatingUpdate {
    cohort_id: String,
    project_id: String,
    ratings: Vec<Rating>,
}

// Storage type definitions
pub type ProjectRatings = HashMap<Principal, Vec<(String, TimestampedRating)>>;
pub type CohortProjectRatings = HashMap<String, ProjectRatings>;

#[update]
pub fn update_peer_rating_api(rating_data: PeerRatingUpdate) -> String {
    let caller = caller();
    if rating_data.ratings.is_empty() {
        return "No ratings provided, nothing updated.".to_string();
    }

    let current_timestamp = time();
    let thirteen_days_in_seconds: u64 = 13 * 24 * 60 * 60;

    // let can_rate = read_state(|state| {
    //     let system = state
    //         .cohort_rating_system
    //         .get(&rating_data.cohort_id)
    //         .map(|candid_vec| candid_vec.0)
    //         .and_then(|cohort| cohort.get(&rating_data.project_id))
    //         .and_then(|project| project.get(&caller))
    //         .map_or(true, |ratings| {
    //             ratings.last().map_or(true, |(_, last_rating)| {
    //                 current_timestamp > last_rating.timestamp + thirteen_days_in_seconds
    //             })
    //         });
    //     system
    // });

    let can_rate = read_state(|state| {
        state
            .cohort_rating_system
            .get(&rating_data.cohort_id)
            .and_then(|candid_vec| {
                candid_vec.0.get(&rating_data.project_id).map(|project| {
                    project.get(&caller).map_or(true, |ratings| {
                        ratings.last().map_or(true, |(_, last_rating)| {
                            current_timestamp > last_rating.timestamp + thirteen_days_in_seconds
                        })
                    })
                })
            })
            .unwrap_or(true) // Ensure default to true if any of the gets are None
    });

    if !can_rate {
        return "You cannot rate this project for the next 13 days.".to_string();
    }

    mutate_state(|state| {
        // Ensure `cohort_rating` is a mutable reference to the actual data structure that can be modified
        let mut cohort_rating = state
            .cohort_rating_system
            .get(&rating_data.cohort_id.clone())
            .map(|candid_res| candid_res.0)
            .unwrap_or_default();

        // Create or get the mutable reference to the project rating
        let project_rating = cohort_rating
            .entry(rating_data.project_id.clone())
            .or_default();

        // Create or get the mutable reference for ratings by the caller
        let project_ratings = project_rating.entry(caller).or_default();

        // Process each rating provided in `rating_data.ratings`
        for rating in rating_data.ratings {
            let timestamped_rating = TimestampedRating {
                rating,
                timestamp: current_timestamp,
            };

            // Push new rating into `project_ratings`
            project_ratings.push(("peer".to_string(), timestamped_rating));
        }

        // Return success message
        "Ratings updated successfully.".to_string()
    })
}

#[update]
pub fn calculate_and_store_average_rating(
    cohort_id: String,
    project_id: String,
) -> Result<f64, String> {
    read_state(|system| {
        let system = &system.cohort_rating_system;
        if let Some(cohort_ratings) = system.get(&cohort_id) {
            if let Some(project_ratings) = cohort_ratings.0.get(&project_id) {
                let total_ratings = project_ratings
                    .values()
                    .flat_map(|ratings| {
                        ratings
                            .iter()
                            .map(|(_, rating)| rating.rating.sub_level_number)
                    })
                    .collect::<Vec<_>>();

                if total_ratings.is_empty() {
                    return Err("No ratings available for this project.".to_string());
                }

                let sum: f64 = total_ratings.iter().sum();
                let count = total_ratings.len() as f64;
                let average = sum / count;

                // Store the calculated average in the AVERAGE_RATINGS storage
                mutate_state(|avg_ratings| {
                    let avg_ratings = &mut avg_ratings.cohort_average_ratings;
                    let mut cohort_avg = avg_ratings
                        .get(&cohort_id.clone())
                        .map(|cohort_avg_rating| cohort_avg_rating.0.clone())
                        .unwrap_or_default();

                    cohort_avg.insert(project_id.clone(), average);
                });

                Ok(average)
            } else {
                Err("No ratings found for the specified project in this cohort.".to_string())
            }
        } else {
            Err("Specified cohort not found.".to_string())
        }
    })
}

#[query]
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

#[query]
pub fn generate_cohort_leaderboard() -> Vec<LeaderboardEntryForCohorts> {
    let mut leaderboard_entries: Vec<LeaderboardEntryForCohorts> = Vec::new();

    mutate_state(|avg_ratings| {
        let avg_ratings = &mut avg_ratings.cohort_average_ratings;

        for (cohort_id, creator_averages) in avg_ratings.iter() {
            let mut project_entries: Vec<ProjectInfoInternal> = Vec::new();
            let mut total_average = 0.0;
            let mut project_count = 0;

            for (creator_principal, average) in creator_averages.0.iter() {
                match get_project_using_id(creator_principal.to_string()) {
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

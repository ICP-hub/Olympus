use crate::guard::*;
use crate::state_handler::*;
use crate::types::ratings_types::*;
use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::time;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

fn can_rate_again(
    _system: &RatingSystem,
    project_id: &String,
    user_id: &Principal,
    current_timestamp: u64,
    interval: u64,
) -> bool {
    let last_rating_time = read_state(|timestamps| {
        let timestamps_borrowed = &timestamps.last_rating_timestamps;
        if !timestamps_borrowed.contains_key(project_id) {
            ic_cdk::println!(
                "Debug: No previous ratings found for project_id: {}",
                project_id
            );
        }
        timestamps_borrowed.get(project_id).and_then(|project_map| {
            if !project_map.0.contains_key(user_id) {
                ic_cdk::println!(
                    "Debug: No previous ratings found for user_id: {:?} in project_id: {}",
                    user_id,
                    project_id
                );
            }
            project_map.0.get(user_id).cloned()
        })
    });

    match last_rating_time {
        Some(last_time) => {
            let can_rate_again = current_timestamp - last_time >= interval;
            ic_cdk::println!("Debug: Last rating time for user_id: {:?} in project_id: {} was at {}. Can rate again: {}", user_id, project_id, last_time, can_rate_again);
            can_rate_again
        }
        None => {
            ic_cdk::println!("Debug: No previous rating time found for user_id: {:?} in project_id: {}. User can rate.", user_id, project_id);
            true
        }
    }
}

fn update_last_rating_time(project_id: &String, user_id: &Principal, timestamp: u64) {
    mutate_state(|timestamps| {
        let timestampsi = &mut timestamps.last_rating_timestamps;
        if timestampsi.contains_key(project_id) {
            ic_cdk::println!(
                "Debug: Found existing project map for project_id: {}",
                project_id
            );
        } else {
            ic_cdk::println!(
                "Debug: Creating new project map for project_id: {}",
                project_id
            );
        }

        let mut project_map = timestamps
            .last_rating_timestamps
            .get(&project_id.clone())
            .map_or_else(HashMap::new, |candid_res| candid_res.0);

        if let Some(existing_timestamp) = project_map.get(user_id) {
            ic_cdk::println!("Debug: Updating existing timestamp for user_id: {:?} in project_id: {} from {} to {}", user_id, project_id, existing_timestamp, timestamp);
        } else {
            ic_cdk::println!(
                "Debug: Inserting new timestamp for user_id: {:?} in project_id: {} as {}",
                user_id,
                project_id,
                timestamp
            );
        }

        project_map.insert(*user_id, timestamp);

        ic_cdk::println!(
            "Debug: Updated timestamp for user_id: {:?} in project_id: {}. New timestamp: {}",
            user_id,
            project_id,
            timestamp
        );
    });
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct RatingUpdate {
    project_id: String,
    current_role: String,
    ratings: Vec<Rating>,
}

#[update(guard = "combined_guard")]
pub fn update_rating(rating_data: RatingUpdate) -> String {
    if rating_data.ratings.is_empty() {
        ic_cdk::println!("Debug: No ratings provided.");
        return "No ratings provided, nothing updated.".to_string();
    }

    let principal_id = caller();
    ic_cdk::println!(
        "Debug: Starting updates for Principal ID: {} with {} ratings for project ID: {}",
        principal_id,
        rating_data.ratings.len(),
        rating_data.project_id
    );

    let current_timestamp = time();
    let thirteen_days_in_seconds: u64 = 13 * 24 * 60 * 60 * 1000000000;
    let mut response_message = "No ratings updated.".to_string();
    let can_rate = read_state(|system| {
        can_rate_again(
            &system.rating_system,
            &rating_data.project_id,
            &principal_id,
            current_timestamp,
            thirteen_days_in_seconds,
        )
    });
    ic_cdk::println!("CAN RATE AGAIN FUNCTION RETURNED {}", can_rate);

    if !can_rate {
        ic_cdk::println!("Debug: User cannot rate again due to the 13-day rule.");
        return "You cannot rate this project for the next 13 days".to_string();
    }

    // Extract project_ratings and role_ratings
    let (mut project_ratings, current_role) = mutate_state(|system| {
        let system = &mut system.rating_system;
        let project_ratings = system
            .get(&rating_data.project_id.clone())
            .map_or_else(HashMap::new, |candid_res| candid_res.0);
        (project_ratings, rating_data.current_role.clone())
    });

    let role_ratings = project_ratings.entry(principal_id).or_insert_with(Vec::new);

    for rating in rating_data.ratings {
        let new_rating = (
            current_role.clone(),
            TimestampedRating {
                rating,
                timestamp: current_timestamp,
            },
        );

        match current_role.as_str() {
            "vc" => role_ratings.push(new_rating),
            "mentor" => role_ratings.push(new_rating),
            "project" => role_ratings.push(new_rating),
            _ => println!(
                "Debug: Encountered unknown role: '{}'.",
                current_role
            ),
        }
        response_message = "Ratings updated successfully".to_string();
    }

    // Update the state with the new project_ratings
    mutate_state(|system| {
        system.rating_system.insert(rating_data.project_id.clone(), Candid(project_ratings));
    });

    // Call update_last_rating_time outside of mutate_state
    update_last_rating_time(&rating_data.project_id, &principal_id, current_timestamp);

    response_message
}

fn round_to_one_decimal(value: f64) -> f64 {
    format!("{:.1}", value).parse::<f64>().unwrap()
}

pub fn calculate_average_api_storage(project_id: &str) {
    let total_levels = 8;

    let mut averages = read_state(|storage| {
        storage
            .average_storage
            .get(&project_id.to_string())
            .map(|candid_res| candid_res.0)
            .unwrap_or_default()
            .clone()
    });

    mutate_state(|system| {
        let system = &mut system.rating_system;
        if let Some(project_ratings) = system.get(&project_id.to_string()) {
            for (_, ratings) in project_ratings.0 {
                let mut mentor_sum = 0.0;
                let mut mentor_count = 0;
                let mut vc_sum = 0.0;
                let mut vc_count = 0;
                let mut own_sum = 0.0;
                let mut own_count = 0;

                // Calculate cumulative sums and counts for each role
                for (role, timestamped_rating) in ratings {
                    let sub_level_num = timestamped_rating.rating.sub_level_number as f64;

                    match role.as_str() {
                        "mentor" => {
                            mentor_sum += sub_level_num;
                            mentor_count += 1;
                        }
                        "vc" => {
                            vc_sum += sub_level_num;
                            vc_count += 1;
                        }
                        "project" => {
                            own_sum += sub_level_num;
                            own_count += 1;
                        }
                        _ => (),
                    }
                }

                // Calculate and store new averages, appending to the history
                if mentor_count > 0 {
                    let new_mentor_average = mentor_sum / total_levels as f64;
                    averages
                        .mentor_average
                        .push(round_to_one_decimal(new_mentor_average));
                }
                if vc_count > 0 {
                    let new_vc_average = vc_sum / total_levels as f64;
                    averages
                        .vc_average
                        .push(round_to_one_decimal(new_vc_average));
                }
                if own_count > 0 {
                    let new_own_average = own_sum / total_levels as f64;
                    averages
                        .own_average
                        .push(round_to_one_decimal(new_own_average));
                }
            }

            // Calculate the overall weighted average from the latest values
            let latest_mentor = averages.mentor_average.last().unwrap_or(&0.0);
            let latest_vc = averages.vc_average.last().unwrap_or(&0.0);
            let latest_own = averages.own_average.last().unwrap_or(&0.0);
            let combined_mentor_vc = (latest_mentor + latest_vc) / 2.0;
            let new_overall_average = 0.6 * combined_mentor_vc + 0.4 * latest_own;
            averages
                .overall_average
                .push(round_to_one_decimal(new_overall_average));
        }
    });

    mutate_state(|storage| {
        storage
            .average_storage
            .insert(project_id.to_string(), Candid(averages));
    });
}


#[query(guard = "combined_guard")]
pub fn calculate_average(project_id: String) -> RatingAverages {
    calculate_average_api_storage(&project_id);
    read_state(|storage| {
        let storage = &storage.average_storage;
        storage
            .get(&project_id.to_string())
            .map(|candid_res| candid_res.0)
            .unwrap_or_default()
            .clone()
    })
}

#[query(guard = "combined_guard")]
pub fn get_ratings_by_principal(project_id: String) -> Result<Vec<RatingView>, String> {
    let caller_id = caller();
    println!(
        "Retrieving ratings for Principal ID: {} on project ID: {}",
        caller_id, project_id
    );

    let mut ratings_by_principal: Vec<RatingView> = Vec::new();

    let result = read_state(|system| {
        let system = &system.rating_system;
        if let Some(project_ratings) = system.get(&project_id) {
            if let Some(role_ratings) = project_ratings.0.get(&caller_id) {
                for (_role, timestamped_rating) in role_ratings {
                    let view = RatingView {
                        level_name: timestamped_rating.rating.level_name.clone(),
                        sub_level_name: timestamped_rating.rating.sub_level.clone(),
                        rating: timestamped_rating.rating.sub_level_number as u32,
                        timestamp: timestamped_rating.timestamp,
                    };
                    ratings_by_principal.push(view);
                }
                Ok(())
            } else {
                Err("No ratings found by this Principal ID for the specified project.".to_string())
            }
        } else {
            Err("Project ID not found in the rating system.".to_string())
        }
    });

    result.map(|_| ratings_by_principal)
}


#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct MainLevels {
    id: i32,
    name: String,
}

pub fn _get_main_levels() -> Vec<MainLevels> {
    vec![
        MainLevels {
            id: 1,
            name: "Team".to_string(),
        },
        MainLevels {
            id: 2,
            name: "Problem And Vision".to_string(),
        },
        MainLevels {
            id: 3,
            name: "Value Prop".to_string(),
        },
        MainLevels {
            id: 4,
            name: "Product".to_string(),
        },
        MainLevels {
            id: 5,
            name: "Market".to_string(),
        },
        MainLevels {
            id: 6,
            name: "Business Model".to_string(),
        },
        MainLevels {
            id: 7,
            name: "Scale".to_string(),
        },
        MainLevels {
            id: 8,
            name: "Exit".to_string(),
        },
    ]
}

#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct SubLevels {
    id: i32,
    name: String,
}

pub fn _get_sub_levels() -> Vec<SubLevels> {
    vec![
        SubLevels {
            id: 1,
            name: "Establishing The Founding Team".to_string(),
        },
        SubLevels {
            id: 2,
            name: "Setting The Vision".to_string(),
        },
        SubLevels {
            id: 3,
            name: "Solidifying The Value Proposition".to_string(),
        },
        SubLevels {
            id: 4,
            name: "Validating An Investable Market".to_string(),
        },
        SubLevels {
            id: 5,
            name: "Proving A Profitable Business Model".to_string(),
        },
        SubLevels {
            id: 6,
            name: "Moving Beyond Early Adopters".to_string(),
        },
        SubLevels {
            id: 7,
            name: "Hitiing Product Market Fit".to_string(),
        },
        SubLevels {
            id: 8,
            name: "Scaling Up".to_string(),
        },
        SubLevels {
            id: 8,
            name: "Exit In Sight".to_string(),
        },
    ]
}

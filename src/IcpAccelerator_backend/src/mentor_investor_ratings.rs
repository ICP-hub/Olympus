use crate::state_handler::*;
use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::{query, update};
use serde::Serialize;
use std::collections::HashMap;

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct RatingMentorInvestor {
    pub value: f64,
    pub comment: Option<String>,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct TimestampedRatingMentorInvestor {
    pub rating: RatingMentorInvestor,
    pub timestamp: u64,
}

pub type IndividualRatings = HashMap<Principal, Vec<TimestampedRatingMentorInvestor>>;
pub type AverageRatingStorage = HashMap<Principal, f64>;

#[update]
pub fn update_mentor_ratings(principal_id: Principal, new_rating: RatingMentorInvestor) {
    let current_timestamp = time();
    mutate_state(|sys| {
        let mut sys = &mut sys.mentor_rating_system;
        sys.get(&StoredPrincipal(principal_id))
            .map(|candid_res| candid_res.0)
            .unwrap_or_default()
            .push(TimestampedRatingMentorInvestor {
                rating: new_rating,
                timestamp: current_timestamp,
            });
    });
}

#[update]
pub fn update_vc_ratings(principal_id: Principal, new_rating: RatingMentorInvestor) {
    let current_timestamp = time();
    mutate_state(|sys| {
        let mut sys = &mut sys.vc_rating_system;
        sys.get(&StoredPrincipal(principal_id))
            .map(|candid_res| candid_res.0)
            .unwrap_or_default()
            .push(TimestampedRatingMentorInvestor {
                rating: new_rating,
                timestamp: current_timestamp,
            });
    });
}

#[query]
pub fn calculate_mentor_average_rating(principal_id: Principal) -> Result<f64, String> {
    calculate_and_store_average_rating_mentor(principal_id)
}

#[query]
pub fn calculate_vc_average_rating(principal_id: Principal) -> Result<f64, String> {
    calculate_and_store_average_rating_investor(principal_id)
}

fn calculate_and_store_average_rating_mentor(principal_id: Principal) -> Result<f64, String> {
    read_state(|sys| {
        let sys = &sys.mentor_rating_system;
        if let Some(ratings) = sys.get(&StoredPrincipal(principal_id)) {
            let total_ratings = ratings.0.iter().map(|r| r.rating.value).collect::<Vec<_>>();
            if total_ratings.is_empty() {
                return Err("No ratings available.".to_string());
            }

            let sum: f64 = total_ratings.iter().sum();
            let average = sum / total_ratings.len() as f64;

            mutate_state(|avg| {
                let mut avg = &mut avg.mentor_average_rating;
                avg.insert(StoredPrincipal(principal_id.clone()), average);
            });

            Ok(average)
        } else {
            Err("No ratings found.".to_string())
        }
    })
}

fn calculate_and_store_average_rating_investor(principal_id: Principal) -> Result<f64, String> {
    read_state(|sys| {
        let sys = &sys.vc_rating_system;
        if let Some(ratings) = sys.get(&StoredPrincipal(principal_id)) {
            let total_ratings = ratings.0.iter().map(|r| r.rating.value).collect::<Vec<_>>();
            if total_ratings.is_empty() {
                return Err("No ratings available.".to_string());
            }

            let sum: f64 = total_ratings.iter().sum();
            let average = sum / total_ratings.len() as f64;

            mutate_state(|avg| {
                let mut avg = &mut avg.vc_average_rating;
                avg.insert(StoredPrincipal(principal_id.clone()), average);
            });

            Ok(average)
        } else {
            Err("No ratings found.".to_string())
        }
    })
}

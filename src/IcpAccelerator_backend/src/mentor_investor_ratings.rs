use crate::is_user_anonymous;
use crate::state_handler::*;
use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::{query, update};
use serde::Serialize;
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

// pub type IndividualRatings = HashMap<Principal, Vec<TimestampedRatingMentorInvestor>>;
// pub type AverageRatingStorage = HashMap<Principal, f64>;

pub fn find_mentor_by_uid(uid: String) -> StoredPrincipal {
    read_state(|state| {
        for (stored_principal, candid_value) in state.mentor_storage.iter() {
            if candid_value.0.uid == uid {
                return stored_principal;
            }
        }
        panic!("Mentor with uid: {} not found.", uid);
    })
}

pub fn find_vc_by_uid(uid: String) -> StoredPrincipal {
    read_state(|state| {
        for (stored_principal, candid_value) in state.vc_storage.iter() {
            if candid_value.0.uid == uid {
                return stored_principal;
            }
        }
        panic!("VC with uid: {} not found.", uid);
    })
}

#[update(guard = "is_user_anonymous")]
pub fn update_mentor_ratings(uid: String, new_rating: RatingMentorInvestor) {
    let current_timestamp = time();
    let stored_principal = find_mentor_by_uid(uid.clone());

    mutate_state(|sys| {
        let sys = &mut sys.mentor_rating_system;
        let mut ratings = sys.get(&stored_principal)
            .map(|candid_res| candid_res.0.clone())
            .unwrap_or_default();
        
        ratings.push(TimestampedRatingMentorInvestor {
            rating: new_rating,
            timestamp: current_timestamp,
        });
        
        // Insert the updated ratings back into the state
        sys.insert(stored_principal, Candid(ratings));
    });

    ic_cdk::println!("Updated ratings for mentor with uid: {}", uid);
}

#[update(guard = "is_user_anonymous")]
pub fn update_vc_ratings(uid: String, new_rating: RatingMentorInvestor) {
    let current_timestamp = time();
    let stored_principal = find_vc_by_uid(uid.clone());

    mutate_state(|sys| {
        let sys = &mut sys.vc_rating_system;
        let mut ratings = sys.get(&stored_principal)
            .map(|candid_res| candid_res.0.clone())
            .unwrap_or_default();
        
        ratings.push(TimestampedRatingMentorInvestor {
            rating: new_rating,
            timestamp: current_timestamp,
        });
        
        // Insert the updated ratings back into the state
        sys.insert(stored_principal, Candid(ratings));
    });

    ic_cdk::println!("Updated ratings for VC with uid: {}", uid);
}

#[query(guard = "is_user_anonymous")]
pub fn calculate_mentor_average_rating(uid: String) -> Result<f64, String> {
    let principal_id = find_mentor_by_uid(uid.clone());
    calculate_and_store_average_rating_mentor(principal_id.0)
}

#[query(guard = "is_user_anonymous")]
pub fn calculate_vc_average_rating(uid: String) -> Result<f64, String> {
    let principal_id = find_vc_by_uid(uid.clone());
    calculate_and_store_average_rating_investor(principal_id.0)
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
                let avg = &mut avg.mentor_average_rating;
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
                let avg = &mut avg.vc_average_rating;
                avg.insert(StoredPrincipal(principal_id.clone()), average);
            });

            Ok(average)
        } else {
            Err("No ratings found.".to_string())
        }
    })
}

use crate::ratings::{calculate_average_api, Rating, RATING_SYSTEM};

use candid::{CandidType, Nat, Principal};
use std::cmp::Ordering;
use std::fmt::Display;

#[derive(Debug, Clone, PartialEq, CandidType)]
pub struct LeaderboardEntryForUpvote {
    pub project_id: Option<String>,
    pub upvote_count: Option<Nat>,
}

#[derive(Debug, Clone, PartialEq, CandidType)]
pub struct LeaderboardEntryForLikes {
    pub project_id: Option<String>,
    pub like_count: Option<Nat>,
}

#[derive(Debug, Clone, PartialEq, CandidType)]
pub struct LeaderboardEntryForRatings {
    pub project_id: Option<String>,
    pub average_rating: Option<f64>,
}

fn compare_nat(a: &Option<Nat>, b: &Option<Nat>) -> Ordering {
    a.cmp(b)
}

pub fn get_leaderboard_by_ratings() -> Vec<LeaderboardEntryForRatings> {
    let mut leaderboard: Vec<LeaderboardEntryForRatings> = Vec::new();

    RATING_SYSTEM.with(|system| {
        let system = system.borrow();

        for (project_id, _) in system.iter() {
            let averages = calculate_average_api(project_id);
            if let Some(overall_average) = averages.overall_average.get(0) {
                // Assuming you want the first (or most recent) overall average rating
                leaderboard.push(LeaderboardEntryForRatings {
                    project_id: Some(project_id.clone()),
                    average_rating: Some(*overall_average), // Directly using the f64 value
                });
            }
        }
    });

    leaderboard.sort_by(|a, b| {
        b.average_rating
            .partial_cmp(&a.average_rating)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    leaderboard
}

use crate::state_handler::*;
use ic_cdk_macros::*;
use candid::{CandidType, Nat};
use crate::is_user_anonymous;

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

#[query(guard = "is_user_anonymous")]
pub fn get_leaderboard_using_ratings() -> Vec<LeaderboardEntryForRatings> {
    let mut leaderboard: Vec<LeaderboardEntryForRatings> = Vec::new();

    read_state(|system| {
        let system = &system.rating_system;

        for (project_id, _) in system.iter() {
            let averages = crate::ratings_module::rubric_ratings::calculate_average(project_id.clone());
            if let Some(overall_average) = averages.overall_average.get(0) {
                // Assuming you want the first (or most recent) overall average rating
                leaderboard.push(LeaderboardEntryForRatings {
                    project_id: Some(project_id.to_string().clone()),
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

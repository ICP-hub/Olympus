use crate::upvotes::{UPVOTES, UpvoteRecord}; 
use crate::ratings::{Rating,RATING_SYSTEM, calculate_average_api};
use crate::project_like::STATE;
use std::fmt::Display;
use candid::{CandidType, Principal, Nat};
use std::cmp::Ordering;


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
pub struct LeaderboardEntryForRatings{
    pub project_id: Option<String>,
    pub average_rating: Option<f64>,
}

fn compare_nat(a: &Option<Nat>, b: &Option<Nat>) -> Ordering {
    a.cmp(b)
}

pub fn get_leaderboard_by_upvotes() -> Vec<LeaderboardEntryForUpvote> {
    let mut projects: Vec<LeaderboardEntryForUpvote> = UPVOTES.with(|upvotes| {
        upvotes.borrow().projects.iter().map(|(project_id, record)| {
            let upvote_count1 = &record.count; 
            LeaderboardEntryForUpvote {
                project_id: Some(project_id.clone()),
                upvote_count: Some(upvote_count1.clone()),
            }
        }).collect()
    });

    // Sort the projects by upvote count in descending order
    projects.sort_by(|a, b| b.upvote_count.cmp(&a.upvote_count));

    projects
}

pub fn get_leaderboard_by_likes() -> Vec<LeaderboardEntryForLikes> {
    let mut projects: Vec<LeaderboardEntryForLikes> = STATE.with(|state| {
        state.borrow().projects.iter().map(|(project_id, record)| {
            let like_count1 = &record.count;
            LeaderboardEntryForLikes {
                project_id: Some(project_id.clone()),
                like_count: Some(like_count1.clone()), 
            }
        }).collect()
    });

    projects.sort_by(|a, b| b.like_count.cmp(&a.like_count));

    projects
}

pub fn get_leaderboard_by_ratings() -> Vec<LeaderboardEntryForRatings> {
    let mut leaderboard: Vec<LeaderboardEntryForRatings> = Vec::new();

    RATING_SYSTEM.with(|system| {
        let system = system.borrow();

        for (project_id, _) in system.iter() {
            if let Some(average_ratings) = calculate_average_api(project_id).overall_average {
                // Here, average_ratings is successfully unwrapped from the Option
                leaderboard.push(LeaderboardEntryForRatings {
                    project_id: Some(project_id.clone()),
                    average_rating: Some(average_ratings), // Assuming .overall is a field on RatingAverages
                });
            }
        }
    });

    leaderboard.sort_by(|a, b| b.average_rating.partial_cmp(&a.average_rating).unwrap_or(std::cmp::Ordering::Equal));

    leaderboard
}

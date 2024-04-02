use candid::{CandidType, Principal};
use ic_cdk::api::time;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk::api::caller;
use std::fmt;



#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Level {
    name: String,
    sub_levels: HashMap<String, RatingTypes>,
    timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RatingTypes {
    peer: Vec<TimestampedRating>,
    own: Vec<TimestampedRating>,
    mentor: Vec<TimestampedRating>,
    vc: Vec<TimestampedRating>,
}

// #[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
// pub enum RatingType {
//     Peer,
//     Own,
//     Mentor,
// }


#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Rating {
    level_name: String,
    level_number: u32,
    sub_level: String,
    sub_level_number: u32,
    rating: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RatingInternal{
    params: Vec<Rating>,
    timestamp: u64,
    current_role: String,
    project_id: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TimestampedRating {
    sub_level_number: u32,
    timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MainLevelRatings {
    level: String,
    ratings: Vec<f64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct RatingAverages {
    pub mentor_average: Vec<f64>,
    pub vc_average: Vec<f64>,
    pub peer_average: Vec<f64>,
    pub own_average: Vec<f64>,
    pub overall_average: Vec<f64>,
}

pub type ProjectRatings = HashMap<Principal, HashMap<String, Level>>;

pub type RatingSystem = HashMap<String, ProjectRatings>;

type LastRatingTimestamps = HashMap<String, HashMap<Principal, u64>>;

thread_local! {
    pub static RATING_SYSTEM: RefCell<RatingSystem> = RefCell::new(RatingSystem::new());
    pub static LAST_RATING_TIMESTAMPS: RefCell<LastRatingTimestamps> = RefCell::new(LastRatingTimestamps::new());
}

impl Level {
    fn new(name: &str) -> Self {
        Level {
            name: name.to_string(),
            sub_levels: HashMap::new(),
            timestamp: time(),
        }
    }
}

impl RatingTypes {
    fn new() -> Self {
        RatingTypes {
            peer: Vec::new(),
            own: Vec::new(),
            mentor: Vec::new(),
            vc: Vec::new(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct ParseMainLevelError {}

impl fmt::Display for ParseMainLevelError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "invalid MainLevel")
    }
}


// impl FromStr for MainLevel {
//     type Err = ParseMainLevelError;

//     fn from_str(s: &str) -> Result<Self, Self::Err> {
//         match s {
//             "Team" => Ok(MainLevel::Team),
//             "ProblemAndVision" => Ok(MainLevel::ProblemAndVision),
//             "ValueProp" => Ok(MainLevel::ValueProp),
//             "Product" => Ok(MainLevel::Product),
//             "Market" => Ok(MainLevel::Market),
//             "BusinessModel" => Ok(MainLevel::BusinessModel),
//             "Scale" => Ok(MainLevel::Scale),
//             "Exit" => Ok(MainLevel::Exit),
//             _ => Err(ParseMainLevelError {}),
//         }
//     }
// }


fn can_rate_again(system: &RatingSystem, project_id: &String, user_id: &Principal, current_timestamp: u64, interval: u64) -> bool {
    let last_rating_time = LAST_RATING_TIMESTAMPS.with(|timestamps| {
        let timestamps_borrowed = timestamps.borrow();
        if !timestamps_borrowed.contains_key(project_id) {
            ic_cdk::println!("Debug: No previous ratings found for project_id: {}", project_id);
        }
        timestamps_borrowed
            .get(project_id)
            .and_then(|project_map| {
                if !project_map.contains_key(user_id) {
                    ic_cdk::println!("Debug: No previous ratings found for user_id: {:?} in project_id: {}", user_id, project_id);
                }
                project_map.get(user_id)
            })
            .cloned()
    });

    match last_rating_time {
        Some(last_time) => {
            let can_rate_again = current_timestamp - last_time >= interval;
            ic_cdk::println!("Debug: Last rating time for user_id: {:?} in project_id: {} was at {}. Can rate again: {}", user_id, project_id, last_time, can_rate_again);
            can_rate_again
        },
        None => {
            ic_cdk::println!("Debug: No previous rating time found for user_id: {:?} in project_id: {}. User can rate.", user_id, project_id);
            true
        },
    }
}

fn update_last_rating_time(project_id: &String, user_id: &Principal, timestamp: u64) {
    LAST_RATING_TIMESTAMPS.with(|timestamps| {
        let mut timestamps = timestamps.borrow_mut();
        if timestamps.contains_key(project_id) {
            ic_cdk::println!("Debug: Found existing project map for project_id: {}", project_id);
        } else {
            ic_cdk::println!("Debug: Creating new project map for project_id: {}", project_id);
        }

        let project_map = timestamps.entry(project_id.clone()).or_insert_with(HashMap::new);

        if let Some(existing_timestamp) = project_map.get(user_id) {
            ic_cdk::println!("Debug: Updating existing timestamp for user_id: {:?} in project_id: {} from {} to {}", user_id, project_id, existing_timestamp, timestamp);
        } else {
            ic_cdk::println!("Debug: Inserting new timestamp for user_id: {:?} in project_id: {} as {}", user_id, project_id, timestamp);
        }

        project_map.insert(*user_id, timestamp);

        ic_cdk::println!("Debug: Updated timestamp for user_id: {:?} in project_id: {}. New timestamp: {}", user_id, project_id, timestamp);
    });
}


#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct RatingUpdate {
    project_id: String, 
    current_role: String, 
    ratings: Vec<Rating>,
}

pub fn update_rating_api(rating_data: RatingUpdate) -> String {
    if rating_data.ratings.is_empty() {
        ic_cdk::println!("Debug: No ratings provided.");
        return "No ratings provided, nothing updated.".to_string();
    }

    let principal_id = caller();
    ic_cdk::println!("Debug: Starting updates for Principal ID: {} with {} ratings for project ID: {}", principal_id, rating_data.ratings.len(), rating_data.project_id);

    let current_timestamp = time();
    let thirteen_days_in_seconds: u64 = /*13 * 24 * 60 * */ 60 * 1000000000;
    let mut response_message = "No ratings updated.".to_string();
    let can_rate = RATING_SYSTEM.with(|system| {
        can_rate_again(&system.borrow(), &rating_data.project_id, &principal_id, current_timestamp, thirteen_days_in_seconds)
    });
    ic_cdk::println!("CAN RATE AGAIN FUNTION RETURNED {}", can_rate);

    if !can_rate {
        ic_cdk::println!("Debug: User cannot rate again due to the 13-day rule.");
        return "You cannot rate this project again yet.".to_string();
    }

    RATING_SYSTEM.with(|system| {
        let mut system = system.borrow_mut();
        let project_ratings = system.entry(rating_data.project_id.clone()).or_insert_with(HashMap::new);
        ic_cdk::println!("Debug Line 193: Retrieved or inserted project ratings for project ID: {}", rating_data.project_id);

        let user_ratings = project_ratings.entry(principal_id).or_insert_with(HashMap::new);
        ic_cdk::println!("Debug Line 196: Retrieved or inserted user ratings for Principal ID: {}", principal_id);

        for rating in &rating_data.ratings {
            ic_cdk::println!("Debug Line 199: Processing rating for level: {}, sub_level: {}", rating.level_name, rating.sub_level);
            let level = user_ratings.entry(rating.level_name.clone())
                                    .or_insert_with(|| {
                                        ic_cdk::println!("Debug Line 201: Creating new Level entry for {}", rating.level_name);
                                        Level::new(&rating.level_name)
                                    });
            let rating_types = level.sub_levels.entry(rating.sub_level.clone())
                                               .or_insert_with(|| {
                                                   ic_cdk::println!("Debug line 206: Creating new RatingTypes entry for sub_level {}", rating.sub_level);
                                                   RatingTypes::new()
                                               });

            let timestamped_rating = TimestampedRating { sub_level_number: rating.sub_level_number, timestamp: current_timestamp };
            ic_cdk::println!("Debug: Created TimestampedRating with rating: {}, timestamp: {}", rating.rating, current_timestamp);

            match rating_data.current_role.as_str() {
                "vc" => rating_types.vc.push(timestamped_rating),
                "mentor" => rating_types.mentor.push(timestamped_rating),
                "project" => rating_types.own.push(timestamped_rating),
                _ => ic_cdk::println!("Debug: Encountered unknown role: '{}'.", rating_data.current_role),
            }
            response_message = "Ratings updated successfully".to_string();
        }
        update_last_rating_time(&rating_data.project_id, &principal_id, current_timestamp);
    });

    response_message
}


fn round_one_decimal(value: Option<f64>) -> Option<f64> {
    value.map(|v| format!("{:.1}", v).parse::<f64>().unwrap())
}


pub fn calculate_average_api(project_id: &str) -> RatingAverages {
    let mut averages = RatingAverages {
        mentor_average: Vec::new(),
        vc_average: Vec::new(),
        peer_average: Vec::new(),
        own_average: Vec::new(),
        overall_average: Vec::new(),
    };

    let total_levels = 8;
    RATING_SYSTEM.with(|system| {
        let system = system.borrow();
        ic_cdk::println!("Calculating averages for project ID: {}", project_id);

        if let Some(project_ratings) = system.get(project_id) {
            ic_cdk::println!("Found ratings for project ID.");

            // Determine the most recent timestamp across all ratings
            let most_recent_timestamp = project_ratings.values()
                .flat_map(|levels| levels.values())
                .flat_map(|level| level.sub_levels.values())
                .flat_map(|rating_types| rating_types.mentor.iter().chain(&rating_types.vc).chain(&rating_types.own))
                .map(|timestamped_rating| timestamped_rating.timestamp)
                .max();

            if let Some(timestamp) = most_recent_timestamp {
                ic_cdk::println!("Most recent timestamp found: {}", timestamp);

                let (mut mentor_sub_level_sum, mut mentor_count, mut vc_sub_level_sum, mut vc_count, mut own_sub_level_sum, mut own_count) = (0.0, 0, 0.0, 0, 0.0, 0);

                // Filter and accumulate ratings that match the most recent timestamp
                for levels in project_ratings.values() {
                    for level in levels.values() {
                        for rating_types in level.sub_levels.values() {
                            mentor_sub_level_sum += rating_types.mentor.iter().filter(|r| r.timestamp == timestamp).map(|r| r.sub_level_number as f64).sum::<f64>();
                            mentor_count += rating_types.mentor.iter().filter(|r| r.timestamp == timestamp).count();

                            vc_sub_level_sum += rating_types.vc.iter().filter(|r| r.timestamp == timestamp).map(|r| r.sub_level_number as f64).sum::<f64>();
                            vc_count += rating_types.vc.iter().filter(|r| r.timestamp == timestamp).count();

                            own_sub_level_sum += rating_types.own.iter().filter(|r| r.timestamp == timestamp).map(|r| r.sub_level_number as f64).sum::<f64>();
                            own_count += rating_types.own.iter().filter(|r| r.timestamp == timestamp).count();
                        }
                    }
                }

                ic_cdk::println!("Accumulated sums - Mentor: {}, VC: {}, Own: {}", mentor_sub_level_sum, vc_sub_level_sum, own_sub_level_sum);
                ic_cdk::println!("Counts - Mentor: {}, VC: {}, Own: {}", mentor_count, vc_count, own_count);

                let mentor_average = if mentor_count > 0 { mentor_sub_level_sum as f64 / total_levels as f64 } else { 0.0 };
                if mentor_count > 0 {
                    averages.mentor_average.push(mentor_sub_level_sum as f64 / total_levels as f64);
                }
                let vc_average = if vc_count > 0 { vc_sub_level_sum as f64 / total_levels as f64 } else { 0.0 };
                if vc_count > 0 {
                    averages.vc_average.push(vc_sub_level_sum as f64 / total_levels as f64 );
                }
                let own_average = if own_count > 0 { own_sub_level_sum as f64 / total_levels as f64 } else { 0.0 };
                if own_count > 0 {
                    averages.own_average.push(own_sub_level_sum as f64 / total_levels as f64 );
                }
                ic_cdk::println!("Calculated averages - Mentor: {:?}, VC: {:?}, Own: {:?}", mentor_average, vc_average, own_average);
                let combined_vc_mentor_average = if vc_count + mentor_count > 0 {
                    (vc_sub_level_sum + mentor_sub_level_sum) as f64 / (total_levels) as f64
                } else {
                    0.0
                };
                ic_cdk::println!("Combined VC And Mentor Average Is: {:?}", combined_vc_mentor_average);

                let overall_average_as_f64 = (combined_vc_mentor_average * 0.6) + (own_average * 0.4);
                averages.overall_average.push(overall_average_as_f64);

                ic_cdk::println!("Overall average calculated: {:?}", overall_average_as_f64);

                return averages
            } else {
                ic_cdk::println!("No recent timestamp found for project ID: {}", project_id);
            }
        } else {
            ic_cdk::println!("No ratings found for project ID: {}", project_id);
        }

        averages
    })
}




// pub fn get_ratings_by_project_id(project_id: &str) -> HashMap<String, MainLevelRatings> {
//     let mut ratings_by_level: HashMap<String, MainLevelRatings> = HashMap::new();

//     RATING_SYSTEM.with(|system| {
//         let system = system.borrow();

//         if let Some(project_ratings) = system.get(project_id) {
//             for (user_id, user_ratings) in project_ratings {
//                 for (level_name, level) in user_ratings {
//                     let main_level = match level_name.parse::<String>() {
//                         Ok(lvl) => lvl,
//                         Err(_) => continue, // Skip if the level name does not match any MainLevel enum
//                     };

//                     let main_level_ratings = ratings_by_level.entry(main_level.clone()).or_insert_with(|| MainLevelRatings {
//                         level: main_level,
//                         ratings: Vec::new(),
//                     });

//                     for rating_types in level.sub_levels.values() {
//                         main_level_ratings.ratings.extend_from_slice(&rating_types.peer);
//                         main_level_ratings.ratings.extend_from_slice(&rating_types.own);
//                         main_level_ratings.ratings.extend_from_slice(&rating_types.mentor);
//                     }
//                 }
//             }
//         }
//     });

//     ratings_by_level
// }



#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct MainLevels {
    id: i32,
    name: String,
}

pub fn get_main_levels() -> Vec<MainLevels> {
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

pub fn get_sub_levels() -> Vec<SubLevels> {
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

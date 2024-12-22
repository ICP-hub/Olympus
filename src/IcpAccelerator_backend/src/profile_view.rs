use candid::{CandidType, Principal};
use ic_cdk_macros::{query, update};
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use std::{collections::{HashMap, HashSet}, sync::Mutex};

// Structure to hold the view count data for each profile
#[derive(Serialize, Deserialize, Default, Debug, CandidType)]
pub struct ViewData {
    total_views: u64,
    views_last_30_days: u64,
    views_last_7_days: u64,
    views_by_caller: HashSet<Principal>, // Track unique views by caller
    last_updated: u64,                  // Last update timestamp
    daily_views: HashMap<String, u64>,  
    self_views:u64, 
    last_self_viewed:u64
}

// Struct for returning data in a structured format
#[derive(Serialize, Deserialize, Default, Debug, CandidType)]
pub struct ViewDataResponse {
    total_views: u64,
    views_last_30_days: u64,
    views_last_7_days: u64,
    last_updated: u64,
    daily_views: Vec<(String, u64)>, // Return as Vec for frontend sorting
}

// Storing the profile view data in a global static state (canister state)
static PROFILE_VIEWS: Lazy<Mutex<HashMap<Principal, ViewData>>> = Lazy::new(|| Mutex::new(HashMap::new()));

// Helper function to get the current Unix timestamp (in seconds)
fn current_timestamp() -> u64 {
    let current_nanos = ic_cdk::api::time();
    current_nanos / 1_000_000_000 // Convert nanoseconds to seconds
}

// Helper function to get the current date as "YYYY-MM-DD"
fn current_date_string() -> String {
    let timestamp = current_timestamp();
    let days_since_epoch = timestamp / 86_400; // 86,400 seconds in a day
    let year = 1970 + days_since_epoch / 365;
    let day_of_year = days_since_epoch % 365;
    let month_day = calculate_month_and_day(year, day_of_year as u16);
    format!("{:04}-{:02}-{:02}", year, month_day.0, month_day.1)
}

// Helper to calculate month and day from day-of-year
fn calculate_month_and_day(year: u64, day_of_year: u16) -> (u8, u8) {
    let mut days_left = day_of_year;
    let months = [
        31, 28 + if is_leap_year(year) { 1 } else { 0 }, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ];
    for (month, &days_in_month) in months.iter().enumerate() {
        if days_left <= days_in_month {
            return ((month + 1) as u8, days_left as u8);
        }
        days_left -= days_in_month;
    }
    (12, 31) // Default to December 31 in case of calculation error
}

// Check if a year is a leap year
fn is_leap_year(year: u64) -> bool {
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
}

// Helper function to check if a date is within the last N days
fn is_within_days(date: &str, days: u64) -> bool {
    let today = current_date_string();
    let today_timestamp = timestamp_from_date(&today);
    let date_timestamp = timestamp_from_date(date);
    today_timestamp >= date_timestamp && today_timestamp - date_timestamp <= days * 24 * 60 * 60
}

// Helper function to convert a "YYYY-MM-DD" string to a Unix timestamp
fn timestamp_from_date(date: &str) -> u64 {
    let parts: Vec<u64> = date.split('-').filter_map(|p| p.parse().ok()).collect();
    if parts.len() == 3 {
        let (year, month, day) = (parts[0], parts[1], parts[2]);
        let mut days_since_epoch = (year - 1970) * 365 + (year - 1969) / 4; // Add leap years
        let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for i in 0..(month - 1) as usize {
            days_since_epoch += months[i] as u64;
        }
        if is_leap_year(year) && month > 2 {
            days_since_epoch += 1;
        }
        days_since_epoch += day - 1;
        days_since_epoch * 86_400 // Convert days to seconds
    } else {
        current_timestamp() // Fallback to current timestamp
    }
}

// Update the view count for a profile (POST API)
#[update]
fn add_view(is_self_view: bool) -> String {
    let caller = ic_cdk::caller();
    let profile_id = caller.clone();
    let mut profile_views = PROFILE_VIEWS.lock().unwrap();

    let data = profile_views.entry(profile_id.clone()).or_insert(ViewData::default());

    if is_self_view {
        // Self-view logic
        data.self_views += 1;
        data.last_self_viewed = current_timestamp();
        return "Ok: Successfully recorded self-view.".to_string();
    } else {
        // View by others logic
        if data.views_by_caller.contains(&caller) {
            return "Warning: Caller has already viewed the profile.".to_string();
        }

        data.total_views += 1;
        data.views_by_caller.insert(caller);

        let today_date = current_date_string();
        *data.daily_views.entry(today_date.clone()).or_insert(0) += 1;

        data.views_last_30_days = data
            .daily_views
            .iter()
            .filter(|(date, _)| is_within_days(date, 30))
            .map(|(_, count)| *count)
            .sum();

        data.views_last_7_days = data
            .daily_views
            .iter()
            .filter(|(date, _)| is_within_days(date, 7))
            .map(|(_, count)| *count)
            .sum();

        data.last_updated = current_timestamp();

        "Ok: Successfully added view to profile.".to_string()
    }
}



// Query API to get all-time, 30-day, and 7-day views (GET API)
#[query]
fn get_views() -> Option<ViewDataResponse> {
    let caller = ic_cdk::caller();
    let profile_views = PROFILE_VIEWS.lock().unwrap();
    profile_views.get(&caller).map(|d| ViewDataResponse {
        total_views: d.total_views,
        views_last_30_days: d.views_last_30_days,
        views_last_7_days: d.views_last_7_days,
        last_updated: d.last_updated,
        daily_views: d.daily_views.iter().map(|(k, v)| (k.clone(), *v)).collect(),
    })
}

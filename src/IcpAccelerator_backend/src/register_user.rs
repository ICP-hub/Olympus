use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, io::Write};
use ic_cdk::api::stable::{StableReader, StableWriter};
use std::cell::RefCell;
use bincode;
use ic_cdk::api::management_canister::main::raw_rand;
use sha2::{Digest, Sha256};
use ic_cdk_macros::{query, update};


#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct ThirtyInfoFounder{
    pub full_name: Option<String>,
    date_of_birth: Option<String>,
    email: Option<String>,
    preferred_icp_hub: Option<String>,
    phone_number: Option<String>, 
    linked_in_profile: Option<String>,
    telegram_id: Option<String>,
    twitter_id: Option<String>,
}


#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct SeventyInfoFounder{
    // profile_complete: Option<u8>,
    // is_profile_complete: Option<bool>,
    // is_active: Option<bool>,

    // Company Information fields 
    location: Option<String>,
    role_within_company: Option<String>,
    employee_count: Option<String>,
    pub founder_image: Option<Vec<u8>>,
    stage_of_company: Option<String>,

    // Company Metrics fields 
    currently_users: Option<String>,
    average_monthly_spending: Option<String>,
    average_monthly_revenue: Option<String>,
    company_debt: Option<String>,
    raised_any_capital: Option<bool>,
    previous_part_in_incubator: Option<bool>,

    // Team Details fields 
    how_many_co_founder: Option<String>,
    co_founder_linkedin_profile: Option<String>,
    how_long_know_each_other: Option<String>,
    is_team_full_time_working_on_project: Option<String>,
    equity_owner_of_company: Option<String>,
    share_about_venture: Option<String>,

    // Additional Information fields 
    why_are_you_apply_for_acceleration_program: Option<String>,
    committed_to_work_on_the_program_during_acceleration: Option<bool>,
    refer: Option<String>,

    // Market Analysis fields 
    target_market: Option<String>,
    market_size: Option<String>,
    customer_demographics: Option<String>,
    competitors: Option<String>,

    // Financial Projections fields 
    projected_revenues: Option<String>,
    break_even_analysis: Option<String>,
    funding_requirements: Option<String>,

    // Legal And Compliance fields 
    registration_details: Option<String>,
    regulatory_approvals: Option<String>,

    // Milestones And Goals 
    key_achieved_milestones: Option<String>,
    future_goals: Option<String>,

    // Feedback And Testimonials 
    user_feedback: Option<String>,
    testimonials: Option<String>,

    // Risk Analysis fields 
    potential_risks: Option<String>,
    mitigation_strategies: Option<String>,

    // Vision And Long Term Goals fields 
    company_vision: Option<String>,
    long_term_goals: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct FounderInfo {
    pub thirty_info: Option<ThirtyInfoFounder>,
    pub seventy_info: Option<SeventyInfoFounder>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct FounderInfoInternal{
    pub params: FounderInfo,
    pub uid: String,
    profile_complete: u8,
    is_profile_complete: bool,
    is_active: bool,
}


impl FounderInfoInternal {
    pub fn calculate_profile_completion(&mut self) {
        let total_fields = 44; 
        let mut filled_fields = 0;

        if let Some(thirty_info) = &self.params.thirty_info {
            if thirty_info.full_name.is_some() { filled_fields += 1; }
            if thirty_info.date_of_birth.is_some() { filled_fields += 1; }
            if thirty_info.email.is_some() { filled_fields += 1; }
            if thirty_info.preferred_icp_hub.is_some() { filled_fields += 1; }
            if thirty_info.phone_number.is_some() { filled_fields += 1; }
            if thirty_info.linked_in_profile.is_some() { filled_fields += 1; }
            if thirty_info.telegram_id.is_some() { filled_fields += 1; }
            if thirty_info.twitter_id.is_some() { filled_fields += 1; }
        }

        if let Some(seventy_info) = &self.params.seventy_info {
            if seventy_info.location.is_some() { filled_fields += 1; }
            if seventy_info.role_within_company.is_some() { filled_fields += 1; }
            if seventy_info.employee_count.is_some() { filled_fields += 1; }
            if seventy_info.stage_of_company.is_some() { filled_fields += 1; }
            if seventy_info.founder_image.is_some() { filled_fields += 1; }
            if seventy_info.currently_users.is_some() { filled_fields += 1; }
            if seventy_info.average_monthly_spending.is_some() { filled_fields += 1; }
            if seventy_info.average_monthly_revenue.is_some() { filled_fields += 1; }
            if seventy_info.company_debt.is_some() { filled_fields += 1; }
            if seventy_info.raised_any_capital.is_some() { filled_fields += 1; }
            if seventy_info.previous_part_in_incubator.is_some() { filled_fields += 1; }
            if seventy_info.how_many_co_founder.is_some() { filled_fields += 1; }
            if seventy_info.co_founder_linkedin_profile.is_some() { filled_fields += 1; }
            if seventy_info.how_long_know_each_other.is_some() { filled_fields += 1; }
            if seventy_info.is_team_full_time_working_on_project.is_some() { filled_fields += 1; }
            if seventy_info.equity_owner_of_company.is_some() { filled_fields += 1; }
            if seventy_info.share_about_venture.is_some() { filled_fields += 1; }
            if seventy_info.why_are_you_apply_for_acceleration_program.is_some() { filled_fields += 1; }
            if seventy_info.committed_to_work_on_the_program_during_acceleration.is_some() { filled_fields += 1; }
            if seventy_info.refer.is_some() { filled_fields += 1; }
            if seventy_info.target_market.is_some() { filled_fields += 1; }
            if seventy_info.market_size.is_some() { filled_fields += 1; }
            if seventy_info.customer_demographics.is_some() { filled_fields += 1; }
            if seventy_info.competitors.is_some() { filled_fields += 1; }
            if seventy_info.projected_revenues.is_some() { filled_fields += 1; }
            if seventy_info.break_even_analysis.is_some() { filled_fields += 1; }
            if seventy_info.funding_requirements.is_some() { filled_fields += 1; }
            if seventy_info.registration_details.is_some() { filled_fields += 1; }
            if seventy_info.regulatory_approvals.is_some() { filled_fields += 1; }
            if seventy_info.key_achieved_milestones.is_some() { filled_fields += 1; }
            if seventy_info.future_goals.is_some() { filled_fields += 1; }
            if seventy_info.user_feedback.is_some() { filled_fields += 1; }
            if seventy_info.testimonials.is_some() { filled_fields += 1; }
            if seventy_info.potential_risks.is_some() { filled_fields += 1; }
            if seventy_info.mitigation_strategies.is_some() { filled_fields += 1; }
            if seventy_info.company_vision.is_some() { filled_fields += 1; }
            if seventy_info.long_term_goals.is_some() { filled_fields += 1; }
        }

        let completion_percentage = (filled_fields as f64 / total_fields as f64) * 100.0;
        self.profile_complete = completion_percentage as u8; 
        self.is_profile_complete = completion_percentage == 100.0; 
    }
}



pub type FounderInfoStorage = HashMap<Principal, FounderInfoInternal>;


thread_local! {
    pub static FOUNDER_STORAGE: RefCell<FounderInfoStorage> = RefCell::new(FounderInfoStorage::new());
}



pub fn pre_upgrade() {
    FOUNDER_STORAGE.with(|registry| {
        let serialized = bincode::serialize(&*registry.borrow()).expect("Serialization failed");

        let mut writer = StableWriter::default();
        writer
            .write(&serialized)
            .expect("Failed to write to stable storage");
    });
}



// pub fn post_upgrade() {
//     let mut reader = StableReader::default();
//     let mut data = Vec::new();
//     reader.read_to_end(&mut data).expect("Failed to read from stable storage");

//     // Apply bincode options directly here as well
//     let deserialized: FounderInfoStorage = DefaultOptions::new()
//         .allow_trailing_bytes()
//         .with_limit(10 * 1024 * 1024)
//         .deserialize(&data)
//         .expect("Deserialization failed");

//     FOUNDER_STORAGE.with(|storage| {
//         *storage.borrow_mut() = deserialized;
//     });
// }

#[update]
pub async fn register_founder(profile: FounderInfo)->std::string::String{
    let caller = caller();
    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();
    let mut new_founder = FounderInfoInternal{
        params: profile,
        uid: new_id.clone(),
        is_active: true,
        is_profile_complete: false,
        profile_complete: 0,
    };

    new_founder.calculate_profile_completion();

    println!("Registering founder for caller: {:?}", caller);
    FOUNDER_STORAGE.with(|storage| {

        let mut storage = storage.borrow_mut();
        // if storage.contains_key(&caller) {
        //     panic!("User with this Principal ID already exists");
        // } else {
        //     storage.insert(caller, new_founder);
        //     println!("Founder Registered {:?}", caller);
        // }

     
            storage.insert(caller, new_founder);
            println!("Founder Registered {:?}", caller);
        

    });
    format!("User registered successfully with ID: {}", new_id)
}

#[query]
pub fn get_founder_info() -> Option<FounderInfo> {
    let caller = caller();
    println!("Fetching founder info for caller: {:?}", caller);
    FOUNDER_STORAGE.with(|registry| {
        registry
            .borrow()
            .get(&caller)
            .map(|founder_internal| founder_internal.params.clone())
    })
}



#[query]
pub fn list_all_founders() -> Vec<FounderInfo> {
    FOUNDER_STORAGE.with(|storage| 
        storage
            .borrow()
            .values()
            .map(|founder_internal| founder_internal.params.clone()) 
            .collect() 
    )
}

#[update]
pub fn delete_founder()->std::string::String {
    let caller = caller();
    println!("Attempting to deactivate founder for caller: {:?}", caller);

    FOUNDER_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(founder) = storage.get_mut(&caller) {
            founder.is_active = false; // Mark the founder as inactive 
            println!("Founder deactivated for caller: {:?}", caller);
        } else {
            println!("Founder not found for caller: {:?}", caller);
        }
    });
    format!("Founder Has Been DeActivated")
}

#[update]
pub fn update_founder(mut updated_profile: FounderInfo) -> String {
    let caller = caller();

    FOUNDER_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(founder_internal) = storage.get_mut(&caller) {
            // Update ThirtyInfoFounder fields if provided
            if let Some(updated_thirty_info) = updated_profile.thirty_info {
                let thirty_info = founder_internal.params.thirty_info.get_or_insert_with(Default::default);
                thirty_info.full_name = updated_thirty_info.full_name.or(thirty_info.full_name.clone());
                thirty_info.date_of_birth = updated_thirty_info.date_of_birth.or(thirty_info.date_of_birth.clone());
                thirty_info.email = updated_thirty_info.email.or(thirty_info.email.clone());
                thirty_info.preferred_icp_hub = updated_thirty_info.preferred_icp_hub.or(thirty_info.preferred_icp_hub.clone());
                thirty_info.phone_number = updated_thirty_info.phone_number.or(thirty_info.phone_number.clone());
                thirty_info.linked_in_profile = updated_thirty_info.linked_in_profile.or(thirty_info.linked_in_profile.clone());
                thirty_info.telegram_id = updated_thirty_info.telegram_id.or(thirty_info.telegram_id.clone());
                thirty_info.twitter_id = updated_thirty_info.twitter_id.or(thirty_info.twitter_id.clone());
            }

            // Update SeventyInfoFounder fields if provided
            if let Some(updated_seventy_info) = updated_profile.seventy_info {
                let seventy_info = founder_internal.params.seventy_info.get_or_insert_with(Default::default);
                seventy_info.location = updated_seventy_info.location.or(seventy_info.location.clone());
                seventy_info.role_within_company = updated_seventy_info.role_within_company.or(seventy_info.role_within_company.clone());
                seventy_info.employee_count = updated_seventy_info.employee_count.or(seventy_info.employee_count.clone());
                seventy_info.founder_image = updated_seventy_info.founder_image.or(seventy_info.founder_image.clone());
                seventy_info.stage_of_company = updated_seventy_info.stage_of_company.or(seventy_info.stage_of_company.clone());
                seventy_info.currently_users = updated_seventy_info.currently_users.or(seventy_info.currently_users.clone());
                seventy_info.average_monthly_spending = updated_seventy_info.average_monthly_spending.or(seventy_info.average_monthly_spending.clone());
                seventy_info.average_monthly_revenue = updated_seventy_info.average_monthly_revenue.or(seventy_info.average_monthly_revenue.clone());
                seventy_info.company_debt = updated_seventy_info.company_debt.or(seventy_info.company_debt.clone());
                seventy_info.raised_any_capital = updated_seventy_info.raised_any_capital.or(seventy_info.raised_any_capital);
                seventy_info.previous_part_in_incubator = updated_seventy_info.previous_part_in_incubator.or(seventy_info.previous_part_in_incubator);
                seventy_info.how_many_co_founder = updated_seventy_info.how_many_co_founder.or(seventy_info.how_many_co_founder.clone());
                seventy_info.co_founder_linkedin_profile = updated_seventy_info.co_founder_linkedin_profile.or(seventy_info.co_founder_linkedin_profile.clone());
                seventy_info.how_long_know_each_other = updated_seventy_info.how_long_know_each_other.or(seventy_info.how_long_know_each_other.clone());
                seventy_info.is_team_full_time_working_on_project = updated_seventy_info.is_team_full_time_working_on_project.or(seventy_info.is_team_full_time_working_on_project.clone());
                seventy_info.equity_owner_of_company = updated_seventy_info.equity_owner_of_company.or(seventy_info.equity_owner_of_company.clone());
                seventy_info.share_about_venture = updated_seventy_info.share_about_venture.or(seventy_info.share_about_venture.clone());
                seventy_info.why_are_you_apply_for_acceleration_program = updated_seventy_info.why_are_you_apply_for_acceleration_program.or(seventy_info.why_are_you_apply_for_acceleration_program.clone());
                seventy_info.committed_to_work_on_the_program_during_acceleration = updated_seventy_info.committed_to_work_on_the_program_during_acceleration.or(seventy_info.committed_to_work_on_the_program_during_acceleration);
                seventy_info.refer = updated_seventy_info.refer.or(seventy_info.refer.clone());
                seventy_info.target_market = updated_seventy_info.target_market.or(seventy_info.target_market.clone());
                seventy_info.market_size = updated_seventy_info.market_size.or(seventy_info.market_size.clone());
                seventy_info.customer_demographics = updated_seventy_info.customer_demographics.or(seventy_info.customer_demographics.clone());
                seventy_info.competitors = updated_seventy_info.competitors.or(seventy_info.competitors.clone());
                seventy_info.projected_revenues = updated_seventy_info.projected_revenues.or(seventy_info.projected_revenues.clone());
                seventy_info.break_even_analysis = updated_seventy_info.break_even_analysis.or(seventy_info.break_even_analysis.clone());
                seventy_info.funding_requirements = updated_seventy_info.funding_requirements.or(seventy_info.funding_requirements.clone());
                seventy_info.registration_details = updated_seventy_info.registration_details.or(seventy_info.registration_details.clone());
                seventy_info.regulatory_approvals = updated_seventy_info.regulatory_approvals.or(seventy_info.regulatory_approvals.clone());
                seventy_info.key_achieved_milestones = updated_seventy_info.key_achieved_milestones.or(seventy_info.key_achieved_milestones.clone());
                seventy_info.future_goals = updated_seventy_info.future_goals.or(seventy_info.future_goals.clone());
                seventy_info.user_feedback = updated_seventy_info.user_feedback.or(seventy_info.user_feedback.clone());
                seventy_info.testimonials = updated_seventy_info.testimonials.or(seventy_info.testimonials.clone());
                seventy_info.potential_risks = updated_seventy_info.potential_risks.or(seventy_info.potential_risks.clone());
                seventy_info.mitigation_strategies = updated_seventy_info.mitigation_strategies.or(seventy_info.mitigation_strategies.clone());
                seventy_info.company_vision = updated_seventy_info.company_vision.or(seventy_info.company_vision.clone());
                seventy_info.long_term_goals = updated_seventy_info.long_term_goals.or(seventy_info.long_term_goals.clone());

                println!("Founder profile updated successfully.");
            } else {
                println!("Founder profile not found for caller: {}", caller);
            }
        } else {
            println!("Error accessing FOUNDER_STORAGE");
        }
    })
}


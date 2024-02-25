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


#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct FounderInfo {
    pub full_name: Option<String>,
    date_of_birth: Option<String>,
    email: Option<String>,
    preferred_icp_hub: Option<String>,
    phone_number: Option<String>, 
    linked_in_profile: Option<String>,
    telegram_id: Option<String>,
    twitter_id: Option<String>,
    profile_complete: Option<u8>,
    is_profile_complete: Option<bool>,
    is_active: Option<bool>,

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

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct FounderInfoInternal{
    pub params: FounderInfo,
    pub uid: String,
}


impl FounderInfo {
    // Calculate the completion percentage of the profile
    pub fn calculate_profile_completion(&mut self) {
        let total_fields = 44; // Total fields to consider for completion
        let mut filled_fields = 0;

        // Increment filled_fields for each non-empty field
        if !self.full_name.is_some() { filled_fields += 1; }
        if !self.date_of_birth.is_some() { filled_fields += 1; }
        if !self.email.is_some() { filled_fields += 1; }
        if !self.preferred_icp_hub.is_some() { filled_fields += 1; }
        if !self.phone_number.is_some() { filled_fields += 1; }
        if !self.linked_in_profile.is_some() { filled_fields += 1; }
        if self.telegram_id.is_some() { filled_fields += 1; }
        if self.twitter_id.is_some() { filled_fields += 1; }

        // Company Information fields 

        if self.location.is_some() { filled_fields += 1; }
        if self.role_within_company.is_some() { filled_fields += 1; }
        if self.employee_count.is_some() { filled_fields += 1; }
        if self.stage_of_company.is_some() { filled_fields += 1; }

        // Company Metrics fields 
        if self.currently_users.is_some() { filled_fields += 1; }
        if self.average_monthly_spending.is_some() { filled_fields += 1; }
        if self.average_monthly_revenue.is_some() { filled_fields += 1; }
        if self.company_debt.is_some() { filled_fields += 1; }
        if self.raised_any_capital.is_some() { filled_fields += 1; }
        if self.previous_part_in_incubator.is_some() { filled_fields += 1; }

        // Team Details fields 
        if self.how_many_co_founder.is_some() { filled_fields += 1; }
        if self.co_founder_linkedin_profile.is_some() { filled_fields += 1; }
        if self.how_long_know_each_other.is_some() { filled_fields += 1; }
        if self.is_team_full_time_working_on_project.is_some() { filled_fields += 1; }
        if self.equity_owner_of_company.is_some() { filled_fields += 1; }
        if self.share_about_venture.is_some() { filled_fields += 1; }

        // Additional Information fields 
        if self.why_are_you_apply_for_acceleration_program.is_some() { filled_fields += 1; }
        if self.committed_to_work_on_the_program_during_acceleration.is_some() { filled_fields += 1; }
        if self.refer.is_some() { filled_fields += 1; }

        // Market Analysis fields 
        if self.target_market.is_some() { filled_fields += 1; }
        if self.market_size.is_some() { filled_fields += 1; }
        if self.customer_demographics.is_some() { filled_fields += 1; }
        if self.competitors.is_some() { filled_fields += 1; }

        // Financial Projections fields 
        if self.projected_revenues.is_some() { filled_fields += 1; }
        if self.break_even_analysis.is_some() { filled_fields += 1; }
        if self.funding_requirements.is_some() { filled_fields += 1; }

        // Legal And Compliance fields 
        if self.registration_details.is_some() { filled_fields += 1; }
        if self.regulatory_approvals.is_some() { filled_fields += 1; }

        // Milestones And Goals 
        if self.key_achieved_milestones.is_some() { filled_fields += 1; }
        if self.future_goals.is_some() { filled_fields += 1; }

        // Feedback And Testimonials 
        if self.user_feedback.is_some() { filled_fields += 1; }
        if self.testimonials.is_some() { filled_fields += 1; }

        // Risk Analysis fields 
        if self.potential_risks.is_some() { filled_fields += 1; }
        if self.mitigation_strategies.is_some() { filled_fields += 1; }

        // Vision And Long Term Goals fields 
        if self.company_vision.is_some() { filled_fields += 1; }
        if self.long_term_goals.is_some() { filled_fields += 1; }

        // Calculate the completion percentage
        let completion_percentage = (filled_fields as f64 / total_fields as f64) * 100.0;
        self.profile_complete = Some(completion_percentage as u8);

        self.is_profile_complete = Some(completion_percentage == 100.0);
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
    };

    new_founder.params.calculate_profile_completion();

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
            .map(|mentor_internal| mentor_internal.params.clone())
    })
}


#[query]
pub fn list_all_founders() -> Vec<FounderInfo> {
    FOUNDER_STORAGE.with(|storage| 
        storage
            .borrow()
            .values()
            .map(|vc_internal| vc_internal.params.clone()) 
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
            founder.params.is_active = Some(false); // Mark the founder as inactive 
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
            let founder = &mut founder_internal.params;
            // Personal and Company Information
            if let Some(new_value) = updated_profile.location {
                founder.location = Some(new_value);
            }
            if let Some(new_value) = updated_profile.role_within_company {
                founder.role_within_company = Some(new_value);
            }
            if let Some(new_value) = updated_profile.employee_count {
                founder.employee_count = Some(new_value);
            }
            if let Some(new_value) = updated_profile.stage_of_company {
                founder.stage_of_company = Some(new_value);
            }
            if let Some(new_value) = updated_profile.founder_image {
                founder.founder_image = Some(new_value);
            }

            // Company Metrics
            if let Some(new_value) = updated_profile.currently_users {
                founder.currently_users = Some(new_value);
            }
            if let Some(new_value) = updated_profile.average_monthly_spending {
                founder.average_monthly_spending = Some(new_value);
            }
            if let Some(new_value) = updated_profile.average_monthly_revenue {
                founder.average_monthly_revenue = Some(new_value);
            }
            if let Some(new_value) = updated_profile.company_debt {
                founder.company_debt = Some(new_value);
            }
            if let Some(new_value) = updated_profile.raised_any_capital {
                founder.raised_any_capital = Some(new_value);
            }
            if let Some(new_value) = updated_profile.previous_part_in_incubator {
                founder.previous_part_in_incubator = Some(new_value);
            }

            // Team Details
            if let Some(new_value) = updated_profile.how_many_co_founder {
                founder.how_many_co_founder = Some(new_value);
            }
            if let Some(new_value) = updated_profile.co_founder_linkedin_profile {
                founder.co_founder_linkedin_profile = Some(new_value);
            }
            if let Some(new_value) = updated_profile.how_long_know_each_other {
                founder.how_long_know_each_other = Some(new_value);
            }
            if let Some(new_value) = updated_profile.is_team_full_time_working_on_project {
                founder.is_team_full_time_working_on_project = Some(new_value);
            }
            if let Some(new_value) = updated_profile.equity_owner_of_company {
                founder.equity_owner_of_company = Some(new_value);
            }
            if let Some(new_value) = updated_profile.share_about_venture {
                founder.share_about_venture = Some(new_value);
            }

            // Additional Information
            if let Some(new_value) = updated_profile.why_are_you_apply_for_acceleration_program {
                founder.why_are_you_apply_for_acceleration_program = Some(new_value);
            }
            if let Some(new_value) = updated_profile.committed_to_work_on_the_program_during_acceleration {
                founder.committed_to_work_on_the_program_during_acceleration = Some(new_value);
            }
            if let Some(new_value) = updated_profile.refer {
                founder.refer = Some(new_value);
            }

            // Market Analysis
            if let Some(new_value) = updated_profile.target_market {
                founder.target_market = Some(new_value);
            }
            if let Some(new_value) = updated_profile.market_size {
                founder.market_size = Some(new_value);
            }
            if let Some(new_value) = updated_profile.customer_demographics {
                founder.customer_demographics = Some(new_value);
            }
            if let Some(new_value) = updated_profile.competitors {
                founder.competitors = Some(new_value);
            }

            // Financial Projections
            if let Some(new_value) = updated_profile.projected_revenues {
                founder.projected_revenues = Some(new_value);
            }
            if let Some(new_value) = updated_profile.break_even_analysis {
                founder.break_even_analysis = Some(new_value);
            }
            if let Some(new_value) = updated_profile.funding_requirements {
                founder.funding_requirements = Some(new_value);
            }

            // Legal And Compliance
            if let Some(new_value) = updated_profile.registration_details {
                founder.registration_details = Some(new_value);
            }
            if let Some(new_value) = updated_profile.regulatory_approvals {
                founder.regulatory_approvals = Some(new_value);
            }

            // Milestones And Goals
            if let Some(new_value) = updated_profile.key_achieved_milestones {
                founder.key_achieved_milestones = Some(new_value);
            }
            if let Some(new_value) = updated_profile.future_goals {
                founder.future_goals = Some(new_value);
            }

            // Feedback And Testimonials
            if let Some(new_value) = updated_profile.user_feedback {
                founder.user_feedback = Some(new_value);
            }
            if let Some(new_value) = updated_profile.testimonials {
                founder.testimonials = Some(new_value);
            }

            // Risk Analysis
            if let Some(new_value) = updated_profile.potential_risks {
                founder.potential_risks = Some(new_value);
            }
            if let Some(new_value) = updated_profile.mitigation_strategies {
                founder.mitigation_strategies = Some(new_value);
            }

            // Vision And Long Term Goals
            if let Some(new_value) = updated_profile.company_vision {
                founder.company_vision = Some(new_value);
            }
            if let Some(new_value) = updated_profile.long_term_goals {
                founder.long_term_goals = Some(new_value);
            }

            founder.calculate_profile_completion();
            format!("Profile got updated for caller: {:?}", caller)
        }else{
            format!("Founder Can Not Be Updated")
        }
    })
}


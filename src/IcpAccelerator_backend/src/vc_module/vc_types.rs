use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct SocialLinks {
    pub link: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct VentureCapitalist {
    pub name_of_fund: String,
    pub fund_size: Option<f64>,
    pub assets_under_management: Option<String>,
    pub registered_under_any_hub: Option<bool>,
    pub average_check_size: f64,
    pub existing_icp_investor: bool,
    pub money_invested: Option<f64>,
    pub existing_icp_portfolio: Option<String>,
    pub type_of_investment: String,
    pub project_on_multichain: Option<String>,
    pub category_of_investment: String,
    pub reason_for_joining: Option<String>,
    pub preferred_icp_hub: String,
    pub investor_type: Option<String>,
    pub number_of_portfolio_companies: u16,
    pub portfolio_link: String,
    pub website_link: Option<String>,
    pub links: Option<Vec<SocialLinks>>,
    pub registered: bool,
    pub registered_country: Option<String>,
    pub stage: Option<String>,
    pub range_of_check_size: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct VentureCapitalistInternal {
    pub params: VentureCapitalist,
    pub uid: String,
    pub is_active: bool,
    pub approve: bool,
    pub decline: bool,
    pub profile_completion: u8,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateInfoStruct {
    pub original_info: Option<VentureCapitalist>,
    pub updated_info: Option<VentureCapitalist>,
    pub approved_at: u64,
    pub rejected_at: u64,
    pub sent_at: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct VcFilterCriteria {
    pub country: Option<String>,
    pub category_of_investment: Option<String>,
    pub money_invested_range: Option<(f64, f64)>, // Minimum and maximum investment range
}

#[derive(CandidType, Clone)]
pub struct VentureCapitalistAll {
    pub principal: Principal,
    pub profile: VentureCapitalistInternal,
}

impl VentureCapitalist {
    pub fn validate(&self) -> Result<(), String> {
        if self.name_of_fund.is_empty() {
            return Err("Name of the fund is a required field.".to_string());
        }
        if self.average_check_size <= 0.0 {
            return Err("Average check size must be greater than zero.".to_string());
        }
        if self.type_of_investment.is_empty() {
            return Err("Type of investment is a required field.".to_string());
        }
        if self.category_of_investment.is_empty() {
            return Err("Category of investment is a required field.".to_string());
        }
        if self.preferred_icp_hub.is_empty() {
            return Err("Preferred ICP hub is a required field.".to_string());
        }
        if self.number_of_portfolio_companies == 0 {
            return Err("Number of portfolio companies must be greater than zero.".to_string());
        }
        if self.portfolio_link.is_empty() {
            return Err("Portfolio link is a required field.".to_string());
        }

        Ok(())
    }
}

impl VentureCapitalistInternal {
    // Compute the completion percentage
    pub fn calculate_completion_percentage(&self) -> u8 {
        let mut total_fields = 11; // Count mandatory fields
        let mut filled_fields = 11; // All mandatory fields are assumed filled

        filled_fields += self.params.fund_size.is_some() as usize;
        filled_fields += self.params.assets_under_management.is_some() as usize;
        filled_fields += self.params.registered_under_any_hub.is_some() as usize;
        filled_fields += self.params.money_invested.is_some() as usize;
        filled_fields += self.params.existing_icp_portfolio.is_some() as usize;
        filled_fields += self.params.project_on_multichain.is_some() as usize;
        filled_fields += self.params.reason_for_joining.is_some() as usize;
        filled_fields += self.params.investor_type.is_some() as usize;
        filled_fields += self.params.website_link.is_some() as usize;
        filled_fields += self.params.registered_country.is_some() as usize;
        filled_fields += self.params.stage.is_some() as usize;
        filled_fields += self.params.range_of_check_size.is_some() as usize;
        filled_fields += self.params.links.as_ref().map_or(0, |v| (!v.is_empty()) as usize);

        total_fields += 13; // Count of optional fields

        ((filled_fields as f64 / total_fields as f64) * 100.0).round() as u8
    }

    // Call this function to update the completion percentage
    pub fn update_completion_percentage(&mut self) {
        self.profile_completion = self.calculate_completion_percentage();
    }
}
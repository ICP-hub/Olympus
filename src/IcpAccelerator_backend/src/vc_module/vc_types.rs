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
    pub logo: Option<Vec<u8>>,
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
    pub announcement_details: Option<String>,
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
    //validation functions for Vc
    pub fn validate(&self) -> Result<(), String> {
        // if self.fund_size == 0.0 || self.fund_size.is_nan() {
        //     return Err("Invalid input for funds size".into());
        // }

        // if let Some(money_invested) = self.money_invested {
        //     if money_invested == 0.0 || money_invested.is_nan() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        // if self.average_check_size == 0.0 || self.average_check_size.is_nan() {
        //     return Err("Invalid input for funds size".into());
        // }

        // if self.logo.is_empty() {
        //     return Err("Add a logo".into());
        // }

        // if let Some(ref registered_under_any_hub) = self.registered_under_any_hub {
        //     if registered_under_any_hub.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        // if let Some(ref project_on_multichain) = self.project_on_multichain {
        //     if project_on_multichain.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        // if self.number_of_portfolio_companies <= u16::MIN
        //     || self.number_of_portfolio_companies > u16::MAX
        // {
        //     return Err("Invalid Value".into());
        // }

        Ok(())
    }
}
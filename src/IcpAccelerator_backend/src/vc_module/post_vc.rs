use crate::state_handler::*;
use crate::vc_module::vc_types::*;
use candid::Principal;
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::time;
use ic_cdk_macros::update;
use sha2::{Digest, Sha256};
use crate::guard::*;
use crate::user_modules::get_user::*;

#[update(guard = "combined_guard")]
pub async fn register_venture_capitalist(params: VentureCapitalist) -> std::string::String {
    let caller = caller();

    let has_project_role = read_state(|state| {
        state.role_status.get(&StoredPrincipal(caller)).map_or(false, |roles| {
            roles.0.iter().any(|role| role.name == "project" && (role.status == "approved" || role.status == "active"))
        })
    });

    if has_project_role {
        return "You are not allowed to get this role because you already have the Project role.".to_string();
    }

    let role_count = get_approved_role_count_for_principal(caller);
    if role_count >= 2 {
        return "You are not eligible for this role because you have 2 or more roles".to_string();
    }

    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    // Check if the request was declined earlier
    let request_declined = read_state(|state| {
        state
            .vc_declined_request
            .contains_key(&StoredPrincipal(caller))
    });
    if request_declined {
        return "You had got your request declined earlier".to_string();
    }

    // Check if the VC is already registered
    let already_registered =
        read_state(|state| state.vc_storage.contains_key(&StoredPrincipal(caller)));
    if already_registered {
        ic_cdk::println!("This Principal is already registered");
        return "This Principal is already registered.".to_string();
    }
    match params.validate() {
        Ok(_) => {
            println!("Validation passed!");
            let profile_for_pushing = params.clone();

            let mut new_vc = VentureCapitalistInternal {
                params: profile_for_pushing,
                uid: new_id.clone(),
                is_active: true,
                approve: false,
                decline: false,
                profile_completion: 0,
            };

            new_vc.update_completion_percentage();

            // Add the new VC to the awaiting response list
            mutate_state(|state| {
                // Updating vc_storage to reflect approval status
                state
                    .vc_storage
                    .insert(StoredPrincipal(caller), Candid(new_vc.clone()));

                let role_status = &mut state.role_status;

                if let Some(role_status_vec_candid) =
                    role_status.get(&StoredPrincipal(caller))
                {
                    let mut role_status_vec = role_status_vec_candid.0;
                    for role in role_status_vec.iter_mut() {
                        if role.name == "vc" {
                            role.status = "approved".to_string();
                            role.approval_status = Some("approved".to_string());
                            role.approved_on = Some(time());
                            break;
                        }
                    }
                    role_status.insert(StoredPrincipal(caller), Candid(role_status_vec));
                }
            });
            format!("Venture Capitalist Created With UID {}", new_vc.uid)
        }
        Err(e) => format!("Validation error: {}", e),
    }
}

#[update(guard="combined_guard")]
pub async fn update_venture_capitalist(params: VentureCapitalist) -> String {
    let caller = ic_cdk::caller();

    let update_result = mutate_state(|state| {
                if let Some(mut existing_vc_internal) = state.vc_storage.get(&StoredPrincipal(caller)) {
                        existing_vc_internal.0.params.registered_under_any_hub = params.registered_under_any_hub.clone()
                            .or(existing_vc_internal.0.params.registered_under_any_hub.clone());
                        existing_vc_internal.0.params.project_on_multichain = params.project_on_multichain.clone()
                            .or(existing_vc_internal.0.params.project_on_multichain.clone());
                        existing_vc_internal.0.params.money_invested = params.money_invested.clone()
                            .or(existing_vc_internal.0.params.money_invested.clone());
                        existing_vc_internal.0.params.existing_icp_portfolio = params.existing_icp_portfolio.clone()
                            .or(existing_vc_internal.0.params.existing_icp_portfolio.clone());
                        existing_vc_internal.0.params.registered_country = params.registered_country.clone()
                            .or(existing_vc_internal.0.params.registered_country.clone());
                        existing_vc_internal.0.params.fund_size = Some(params.fund_size.unwrap_or(0.0));
                        existing_vc_internal.0.params.assets_under_management = params.assets_under_management.clone();
                        existing_vc_internal.0.params.category_of_investment = params.category_of_investment.clone();
                        existing_vc_internal.0.params.average_check_size = params.average_check_size;
                        existing_vc_internal.0.params.existing_icp_investor = params.existing_icp_investor;
                        existing_vc_internal.0.params.investor_type = params.investor_type.clone();
                        existing_vc_internal.0.params.number_of_portfolio_companies =params.number_of_portfolio_companies;
                        existing_vc_internal.0.params.portfolio_link = params.portfolio_link.clone();
                        existing_vc_internal.0.params.reason_for_joining = params.reason_for_joining.clone();
                        existing_vc_internal.0.params.name_of_fund = params.name_of_fund.clone();
                        existing_vc_internal.0.params.preferred_icp_hub = params.preferred_icp_hub.clone();
                        existing_vc_internal.0.params.type_of_investment = params.type_of_investment.clone();
                        existing_vc_internal.0.params.links = params.links.clone();
                        existing_vc_internal.0.params.website_link = params.website_link.clone();
                        existing_vc_internal.0.params.registered = params.registered.clone();
                        existing_vc_internal.0.params.range_of_check_size = params.range_of_check_size.clone();
                        existing_vc_internal.0.params.stage = params.stage.clone();

                        state.vc_storage.insert(StoredPrincipal(caller), existing_vc_internal);
                        return Ok("Profile updated successfully");
                }
                return Err("No existing VC profile found to update.");
    });

    match update_result {
        Ok(message) => {
            message.to_string()
        },
        Err(error) => format!("Error processing request: {}", error),
    }
}

#[update(guard = "combined_guard")]
pub fn delete_venture_capitalist() -> std::string::String {
    let caller = ic_cdk::caller();
    println!("Attempting to deactivate founder for caller: {:?}", caller);

    mutate_state(|state| {
        if let Some(mut vc_internal) = state.vc_storage.get(&StoredPrincipal(caller)) {
            vc_internal.0.is_active = false;
            println!("Founder deactivated for caller: {:?}", caller);
        } else {
            println!("Founder not found for caller: {:?}", caller);
        }
    });

    format!("Venture Capitalist Account Has Been DeActivated")
}

#[update(guard = "combined_guard")]
pub fn make_vc_active_inactive(p_id: Principal) -> String {
    let principal_id = caller();
    if p_id == principal_id || ic_cdk::api::is_controller(&principal_id) {
        mutate_state(|m_container| {
            let tutor_hashmap = &m_container.vc_storage;
            if let Some(mut vc_internal) = tutor_hashmap.get(&StoredPrincipal(p_id)) {
                if vc_internal.0.is_active {
                    let active = false;
                    vc_internal.0.is_active = active;

                    return "made inactive".to_string();
                } else {
                    let active = true;
                    vc_internal.0.is_active = active;
                    return "made active".to_string();
                }
            } else {
                "profile seems not to be existed".to_string()
            }
        })
    } else {
        "you are not authorised to run this function".to_string()
    }
}

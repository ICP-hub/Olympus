use crate::state_handler::*;
use crate::cohort_module::cohort_types::*;
use crate::types::individual_types::*;
use crate::user_modules::get_user::*;
use crate::guard::*;
use ic_cdk_macros::*;
use ic_cdk::api::call::call;
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use serde_bytes::ByteBuf;
use sha2::{Digest, Sha256};

#[update(guard = "combined_guard")]
pub async fn create_cohort(mut params: Cohort) -> Result<String, String> {
    let caller_principal = caller();

    let is_mentor_or_investor = read_state(|state| {
        state
            .mentor_storage
            .contains_key(&StoredPrincipal(caller_principal))
            || state
                .vc_storage
                .contains_key(&StoredPrincipal(caller_principal))
    });

    if !is_mentor_or_investor {
        return Err("You are not privileged to create a cohort ,Please Register as Mentor ...".to_string());
    }

    let u_ids = raw_rand().await.unwrap().0;
    let cohort_id = format!("{:x}", Sha256::digest(&u_ids));

    let roles_assigned = read_state(|_state| {
        get_roles_for_principal(caller_principal)
            .iter()
            .filter(|r| r.status == "approved" || r.status == "active")
            .map(|r| r.name.clone())
            .collect::<Vec<String>>()
    });
    let canister_id = crate::asset_manager::get_asset_canister();
    if params.cohort_banner.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_cohort_logo.jpeg";
        params.cohort_banner = Some((full_url).as_bytes().to_vec());
    } else if params.cohort_banner.clone().unwrap().len() < 300 {
        ic_cdk::println!("Cohort Banner is already uploaded");
    } else {
        let cohort_logo_key = "/uploads/".to_owned() + &cohort_id.to_string() + "_cohort_logo.jpeg";

        let cohort_logo_arg = StoreArg {
            key: cohort_logo_key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(params.cohort_banner.unwrap()),
            sha256: None,
        };

        let _delete_asset = DeleteAsset {
            key: cohort_logo_key.clone(),
        };

        // let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
        //     .await
        //     .unwrap();

        let _result = call(canister_id, "store", (cohort_logo_arg,)).await.map_err(|e| format!("Error storing asset: {:?}", e))?;

        params.cohort_banner = Some(
            (canister_id.to_string() + &cohort_logo_key)
                .as_bytes()
                .to_vec(),
        );
    }

    let user_data = crate::user_modules::get_user::get_user_information_internal(caller_principal);
    
    let cohort_details = CohortDetails {
        cohort_id: cohort_id.clone(),
        cohort: params,
        cohort_created_at: ic_cdk::api::time(),
        cohort_creator: caller_principal,
        cohort_creator_role: roles_assigned,
        cohort_creator_principal: caller_principal,
        cohort_creator_data: user_data
    };

    mutate_state(|state| {
        state.cohort_info.insert(cohort_id.clone(), Candid(cohort_details.clone()));
    });
    Ok("Cohort Has Been Created Succesfully".to_string())
}

#[update(guard="combined_guard")]
pub async fn update_cohort(cohort_id: String, updated_params: Cohort) -> Result<String, String> {
    let caller_principal = caller();

    // Check if the caller is the creator of the cohort or has the required privileges
    let mut cohort_details = read_state(|state| state.cohort_info.get(&cohort_id).unwrap().0.clone());

    let mut params = updated_params.clone();

    let canister_id = crate::asset_manager::get_asset_canister();
    if params.cohort_banner.is_some() && params.cohort_banner.clone().unwrap().len() > 300 {
        let cohort_logo_key = "/uploads/".to_owned() + &caller_principal.to_string() + "_cohort_logo.jpeg";

        let cohort_logo_arg = StoreArg {
            key: cohort_logo_key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(params.cohort_banner.clone().unwrap()),
            sha256: None,
        };

        let _result = call(canister_id, "store", (cohort_logo_arg,)).await.map_err(|e| format!("Error storing asset: {:?}", e))?;

        params.cohort_banner = Some(
            (canister_id.to_string() + &cohort_logo_key)
                .as_bytes()
                .to_vec(),
        );
    } else {
        ic_cdk::println!("No change in cohort banner or invalid banner data.");
    }

    cohort_details.cohort = updated_params;

    mutate_state(|state| {
        if let Some(_existing_cohort) = state.cohort_info.get(&cohort_id) {
            state.cohort_info.insert(cohort_id.clone(), Candid(cohort_details.clone()));
        }
    });

    Ok("Cohort details have been updated successfully.".to_string())
}
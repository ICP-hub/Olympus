use crate::{state_handler::{mutate_state, read_state, Candid, StoredPrincipal}, Role};
use ic_cdk::update;
use ic_cdk::api::management_canister::main::raw_rand;
use sha2::{Sha256, Digest};
use regex::Regex;

/// Checks if a string contains HTML tags.
pub fn contains_html_tags(text: &str) -> bool {
    let re = Regex::new(r"</?[a-z][\s\S]*>").unwrap();
    re.is_match(text)
}

pub fn is_admin() -> Result<(), String> {
    Ok(())
    // if !ic_cdk::api::is_controller(&caller()) {
    //     Err("Only Admin can use these functions".to_string())
    // } else {
    //     Ok(())
    // }
}

pub fn is_user_anonymous() -> Result<(), String> {
    // let caller = caller();

    // if caller.to_string() != "2vxsx-fae" {
    //     Ok(())
    // } else {
    //     Err("Your are not Authorized to call This Function, Please Use Your Internet Identity".to_string())
    // }
    Ok(())
}

pub fn is_registered_user_guard() -> Result<(), String> {
    let caller = ic_cdk::api::caller();

    // Fetch the roles for the caller
    let roles = read_state(|state| {
        if let Some(roles_candid) = state.role_status.get(&StoredPrincipal(caller)) {
            roles_candid.0.clone()
        } else {
            // Return default roles if none exist
            vec![
                Role {
                    name: "user".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                    approval_status: Some("default".to_string()),
                },
                Role {
                    name: "project".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                    approval_status: Some("default".to_string()),
                },
                Role {
                    name: "mentor".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                    approval_status: Some("default".to_string()),
                },
                Role {
                    name: "vc".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                    approval_status: Some("default".to_string()),
                },
            ]
        }
    });

    // Check if any role has an approval_status of "approved"
    let is_approved = roles.iter().any(|role| {
        if let Some(approval_status) = &role.approval_status {
            approval_status == "approved"
        } else {
            false
        }
    });

    if is_approved {
        Ok(())
    } else {
        Err("You Do Not Have Access To Do This, Please Register Yourself On The Platform".to_string())
    }
}


const REQUEST_LIMIT: u64 = 20; // Max number of requests
const TIME_WINDOW: u64 = 60 * 1_000_000_000; // 60 seconds in nanoseconds

pub fn rate_limiter_guard() -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    let now = ic_cdk::api::time();

    let (last_request_time, request_count) = read_state(|state| {
        state
            .rate_limiting
            .get(&StoredPrincipal(caller))
            .unwrap_or((0, 0))
    });

    if now - last_request_time > TIME_WINDOW {
        mutate_state(|state| {
            state.rate_limiting.insert(StoredPrincipal(caller), (now, 1));
        });
    } else if request_count >= REQUEST_LIMIT {
        return Err("You are trying it too fast. Please try again later.".to_string());
    } else {
        mutate_state(|state| {
            state.rate_limiting.insert(StoredPrincipal(caller), (last_request_time, request_count + 1));
        });
    }

    Ok(())
}

pub fn combined_guard() -> Result<(), String> {
    is_user_anonymous()?;

    is_registered_user_guard()?;

    rate_limiter_guard()?;

    Ok(())
}

async fn generate_unique_id() -> String {
    let uuids = raw_rand().await.unwrap().0;
    let current_time = ic_cdk::api::time();
    let mut hasher = Sha256::new();
    hasher.update(&uuids);
    hasher.update(current_time.to_be_bytes());
    format!("{:x}", hasher.finalize())
}

async fn store_captcha(text: String) -> String {
    let captcha_id = generate_unique_id().await;
    mutate_state(|state| {
        state.captcha_storage.insert(captcha_id.clone(), Candid(text));
    });
    captcha_id
}

async fn generate_captcha_text() -> String {
    let uuids = raw_rand().await.unwrap().0;
    let mut number = 0u32;

    for (i, byte) in uuids.iter().take(4).enumerate() {
        number |= (*byte as u32) << (i * 8);
    }

    // Ensure it's a 6-digit number
    let captcha = number % 1_000_000;
    format!("{:06}", captcha)
}

#[update]
async fn generate_captcha_with_id() -> (String, String) {
    let captcha_text = generate_captcha_text().await;
    let captcha_id = store_captcha(captcha_text.clone()).await;
    (captcha_id, captcha_text)
}

pub fn verify_captcha(captcha_id: String, user_input: String) -> bool {
    let stored_text = read_state(|state| {
        state.captcha_storage.get(&captcha_id).map(|candid| candid.0.clone())
    });
    
    if let Some(stored_text) = stored_text {
        stored_text.eq_ignore_ascii_case(&user_input)
    } else {
        false
    }
}





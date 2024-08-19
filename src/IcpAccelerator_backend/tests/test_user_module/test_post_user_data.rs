use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;

use IcpAccelerator_backend::user_module::{Role, UserInformation, UserInfoInternal};

// Define the path to your compiled Wasm file
const BACKEND_WASM: &str = "/home/harman/accelerator/ICPAccelerator/target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm";


// Setup function to initialize PocketIC and install the Wasm module
fn setup() -> (PocketIc, Principal) {
    let pic = PocketIc::new();

    let backend_canister = pic.create_canister();
    pic.add_cycles(backend_canister, 2_000_000_000_000); // 2T Cycles
    let wasm = fs::read(BACKEND_WASM).expect("Wasm file not found, run 'dfx build'.");
    pic.install_canister(backend_canister, wasm, vec![], None);
    (pic, backend_canister)
}

#[test]
fn test_register_user_with_minimum_valid_input() {
    let (pic, backend_canister) = setup();

    let user_info = UserInformation {
        full_name: "John Doe".to_string(),
        profile_picture: None,
        email: None,
        country: "USA".to_string(),
        social_links: None,
        bio: None,
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: None,
        reason_to_join: None,
    };

    let response = pic.update_call(
        backend_canister,
        Principal::anonymous(),
        "register_user",
        encode_one(user_info).unwrap(),
    );

    match response {
        Ok(WasmResult::Reply(reply_bytes)) => {
            // Decode the reply bytes into a String
            let response_str: String = decode_one(&reply_bytes).unwrap();
            assert!(response_str.contains("User registered successfully"));
        }
        Ok(WasmResult::Reject(message)) => panic!("Call was rejected: {}", message),
        Err(e) => panic!("Error during call: {:?}", e),
    }
}

#[test]
fn test_role_initialization_on_registration() {
    let (pic, backend_canister) = setup();

    let user_info = UserInformation {
        full_name: "Alice".to_string(),
        country: "Wonderland".to_string(),
        area_of_interest: "Adventure".to_string(),
        ..Default::default()
    };

    // Call the register_user_role method
    let register_response = pic.update_call(
        backend_canister,
        Principal::anonymous(),
        "register_user",
        encode_one(user_info).unwrap(),
    );

    // Handle the response for registration
    match register_response {
        Ok(WasmResult::Reply(_)) => { /* Registration succeeded, proceed */ }
        Ok(WasmResult::Reject(message)) => panic!("Registration was rejected: {}", message),
        Err(e) => panic!("Error during registration call: {:?}", e),
    }

    // Query to get the roles for the principal
    let query_response = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_roles_for_principal",
        encode_one(Principal::anonymous()).unwrap(),
    );

    // Handle the response for role query
    match query_response {
        Ok(WasmResult::Reply(reply_bytes)) => {
            let roles: Vec<Role> = decode_one(&reply_bytes).unwrap();

            // Check that all roles are initialized
            assert_eq!(roles.len(), 4); // Assuming four roles: user, project, mentor, vc

            // Check the default statuses of the roles
            for role in roles.iter() {
                ic_cdk::println!("Role: {}, Status: {}", role.name, role.status);
                if role.name == "user" {
                    assert_eq!(role.status, "active");
                } else {
                    assert_eq!(role.status, "default");
                }
            }
        }
        Ok(WasmResult::Reject(message)) => panic!("Query was rejected: {}", message),
        Err(e) => panic!("Error during query call: {:?}", e),
    }
}

#[test]
fn test_duplicate_user_registration() {
    let (pic, backend_canister) = setup();

    let user_info = UserInformation {
        full_name: "Jane Doe".to_string(),
        country: "Canada".to_string(),
        area_of_interest: "Science".to_string(),
        ..Default::default()
    };

    // First registration attempt
    let first_response = pic.update_call(
        backend_canister,
        Principal::anonymous(),
        "register_user",
        encode_one(user_info.clone()).unwrap(),
    );

    // Handle the first response (it should succeed)
    match first_response {
        Ok(WasmResult::Reply(_)) => { /* First registration succeeded, proceed */ }
        Ok(WasmResult::Reject(message)) => panic!("First registration was rejected: {}", message),
        Err(e) => panic!("Error during first registration call: {:?}", e),
    }

    // Second registration attempt (should fail with a duplicate message)
    let second_response = pic.update_call(
        backend_canister,
        Principal::anonymous(),
        "register_user",
        encode_one(user_info).unwrap(),
    );

    // Handle the second response
    match second_response {
        Ok(WasmResult::Reply(reply_bytes)) => {
            let response_str: String = decode_one(&reply_bytes).unwrap();
            assert_eq!(response_str, "User with this Principal ID already exists");
        }
        Ok(WasmResult::Reject(message)) => panic!("Second registration was rejected: {}", message),
        Err(e) => panic!("Error during second registration call: {:?}", e),
    }
}

#[test]
fn test_register_user_with_max_input_lengths() {
    let (pic, backend_canister) = setup();

    let user_info = UserInformation {
        full_name: "a".repeat(255), // Assuming 255 is the maximum length for full_name
        profile_picture: None,
        email: Some("a".repeat(320) + "@example.com"), // Assuming 320 is max for email local-part
        country: "b".repeat(255), // Assuming 255 is the maximum length for country
        social_links: None,
        bio: Some("c".repeat(1024)), // Assuming 1024 is the maximum length for bio
        area_of_interest: "Technology".to_string(),
        openchat_username: Some("d".repeat(255)), // Assuming 255 is the maximum length for username
        type_of_profile: Some("Individual".to_string()),
        reason_to_join: Some(vec!["e".repeat(255)]), // Assuming 255 is the maximum length for reason
    };

    let response = pic.update_call(
        backend_canister,
        Principal::anonymous(),
        "register_user",
        encode_one(user_info).unwrap(),
    );

    match response {
        Ok(WasmResult::Reply(reply_bytes)) => {
            let response_str: String = decode_one(&reply_bytes).unwrap();
            assert!(response_str.contains("User registered successfully"));
        }
        Ok(WasmResult::Reject(message)) => panic!("Call was rejected: {}", message),
        Err(e) => panic!("Error during call: {:?}", e),
    }
}

#[test]
fn test_register_user_with_special_characters() {
    let (pic, backend_canister) = setup();

    let user_info = UserInformation {
        full_name: "J@ne Døe!#".to_string(),
        profile_picture: None,
        email: Some("jane.doe@example.com".to_string()),
        country: "U$A".to_string(),
        social_links: None,
        bio: Some("Løvê $cience & Technølogy!".to_string()),
        area_of_interest: "Research".to_string(),
        openchat_username: Some("døe_jane".to_string()),
        type_of_profile: Some("Individual".to_string()),
        reason_to_join: Some(vec!["Curiosity & Løve for Sciencë!".to_string()]),
    };

    let response = pic.update_call(
        backend_canister,
        Principal::anonymous(),
        "register_user",
        encode_one(user_info).unwrap(),
    );

    match response {
        Ok(WasmResult::Reply(reply_bytes)) => {
            let response_str: String = decode_one(&reply_bytes).unwrap();
            assert!(response_str.contains("User registered successfully"));
        }
        Ok(WasmResult::Reject(message)) => panic!("Call was rejected: {}", message),
        Err(e) => panic!("Error during call: {:?}", e),
    }
}

#[test]
fn test_register_user_with_missing_mandatory_fields() {
    let (pic, backend_canister) = setup();

    let user_info = UserInformation {
        full_name: "".to_string(), // Missing full_name
        profile_picture: None,
        email: None,
        country: "".to_string(), // Missing country
        social_links: None,
        bio: None,
        area_of_interest: "".to_string(), // Missing area_of_interest
        openchat_username: None,
        type_of_profile: None,
        reason_to_join: None,
    };

    let response = pic.update_call(
        backend_canister,
        Principal::anonymous(),
        "register_user",
        encode_one(user_info).unwrap(),
    );

    match response {
        Ok(WasmResult::Reply(reply_bytes)) => {
            let response_str: String = decode_one(&reply_bytes).unwrap();
            assert!(response_str.contains("Missing mandatory fields"));
        }
        Ok(WasmResult::Reject(message)) => panic!("Call was rejected: {}", message),
        Err(e) => panic!("Error during call: {:?}", e),
    }
}

#[test]
fn test_user_deactivation() {
    let (pic, backend_canister) = setup();

    let user_info = UserInformation {
        full_name: "Deactivator".to_string(),
        country: "Nowhere".to_string(),
        area_of_interest: "None".to_string(),
        ..Default::default()
    };

    // Register the user
    let _ = pic.update_call(
        backend_canister,
        Principal::anonymous(),
        "register_user",
        encode_one(user_info).unwrap(),
    );

    // Deactivate the user
    let deactivate_response = pic.update_call(
        backend_canister,
        Principal::anonymous(),
        "make_user_inactive",
        encode_one(()).unwrap(),
    );

    match deactivate_response {
        Ok(WasmResult::Reply(reply_bytes)) => {
            let response_str: String = decode_one(&reply_bytes).unwrap();
            let expected_message = format!("User deactivated for caller: {:?}", Principal::anonymous().to_string());
            assert_eq!(response_str, expected_message);
        }
        Ok(WasmResult::Reject(message)) => panic!("Deactivation was rejected: {}", message),
        Err(e) => panic!("Error during deactivation call: {:?}", e),
    }

    // Verify the user is marked as inactive
    let query_response = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_user_info_using_principal",
        encode_one(Principal::anonymous()).unwrap(),
    );

    match query_response {
        Ok(WasmResult::Reply(reply_bytes)) => {
            // Decode the response to an Option<UserInfoInternal>
            let user_info_internal: Option<UserInfoInternal> = decode_one(&reply_bytes).unwrap();

            // Check if the user information exists and is marked as inactive
            if let Some(user_info) = user_info_internal {
                assert_eq!(user_info.is_active, false);
            } else {
                panic!("User information not found after deactivation");
            }
        }
        Ok(WasmResult::Reject(message)) => panic!("Query was rejected: {}", message),
        Err(e) => panic!("Error during query call: {:?}", e),
    }
}

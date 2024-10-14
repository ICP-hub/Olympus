use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{mentor_module::mentor_types::{MentorInternal, MentorProfile}, user_modules::user_types::{UserInfoInternal, UserInformation}};
use std::fs;

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
fn test_make_active_inactive_mentor() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the initial UserInformation
let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Test Mentor".to_string(),
            profile_picture: None,
            email: Some("mentor@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Mentoring in blockchain technology.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["To guide new projects.".to_string()]),
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 1625097600,
        profile_completion: 50,
    };

    // Simulate registering the user
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_args((captcha_id, captcha_input, user_info.params.clone())).unwrap(),
    )else{
        panic!("Expected Reply")
    };

    let result:Result<std::string::String, std::string::String>= decode_one(&response).unwrap();
    ic_cdk::println!("REGISTERED USER {:?}", result);

    // Define the MentorProfile to be registered
    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some(vec!["Ethereum".to_string(), "Solana".to_string()]),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: vec!["Blockchain".to_string()],
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };

    // Register the mentor
    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).expect("Mentor registration failed");

    // Call the make_active_inactive_mentor function to deactivate the mentor
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "make_active_inactive_mentor",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let deactivate_result: String = decode_one(&response).unwrap();
    ic_cdk::println!("DEACTIVATE RESUlT {:?}",deactivate_result);
    assert_eq!(deactivate_result, "made inactive");

    // Verify the mentor profile is now inactive
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();
    ic_cdk::println!("RETRIEVED MENTOR INFO {:?}",retrieved_mentor_info);
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.active, false, "Mentor should be inactive");

    // Call the make_active_inactive_mentor function again to reactivate the mentor
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "make_active_inactive_mentor",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let activate_result: String = decode_one(&response).unwrap();
    assert_eq!(activate_result, "made active");

    // Verify the mentor profile is now active
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.active, true, "Mentor should be active");
}








#[test]
fn test_make_active_inactive_mentor_non_existent() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous();
    
    // Define the initial UserInformation
let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Test Mentor".to_string(),
            profile_picture: None,
            email: Some("mentor@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Mentoring in blockchain technology.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["To guide new projects.".to_string()]),
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 1625097600,
        profile_completion: 50,
    };

    // Simulate registering the user
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_args((captcha_id, captcha_input, user_info.params.clone())).unwrap(),
    )else{
        panic!("Expected Reply")
    };

    let result:Result<std::string::String, std::string::String>= decode_one(&response).unwrap();
    ic_cdk::println!("REGISTERED USER {:?}", result);

    // Attempt to deactivate a non-existent mentor
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "make_active_inactive_mentor",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "profile seems not to be existed");
}



#[test]
fn test_make_active_inactive_mentor_with_different_principal() {
    let (pic, backend_canister) = setup();

    // Define a test principal and another principal attempting to deactivate
    let test_principal = Principal::from_slice(&[2 as u8]);
    let different_principal = Principal::from_slice(&[3 as u8]);

    // Simulate registering the user
let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Different Principal Mentor".to_string(),
            profile_picture: None,
            email: Some("different@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Mentoring in blockchain technology.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["To guide new projects.".to_string()]),
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 1625097600,
        profile_completion: 50,
    };

    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_args((captcha_id, captcha_input, user_info.params.clone())).unwrap(),
    )else{
        panic!("Expected Reply")
    };

    let result:Result<std::string::String, std::string::String>= decode_one(&response).unwrap();
    ic_cdk::println!("REGISTERED USER {:?}", result);

    // Register the mentor
    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some(vec!["Ethereum".to_string(), "Solana".to_string()]),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: vec!["Blockchain".to_string()],
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).expect("Mentor registration failed");

    // Attempt to deactivate the mentor by a different principal
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        different_principal,
        "make_active_inactive_mentor",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "you are not authorised to use this function");

    // Verify the mentor profile is still active
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.active, true, "Mentor should be active");
}

/* 
#[test]
fn test_make_active_inactive_mentor_with_concurrent_requests() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::from_slice(&[4 as u8]);

    // Simulate registering the user
let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Concurrent Mentor".to_string(),
            profile_picture: None,
            email: Some("concurrent@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Mentoring in blockchain technology.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["To guide new projects.".to_string()]),
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 1625097600,
        profile_completion: 50,
    };

    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_args((captcha_id, captcha_input, user_info.params.clone())).unwrap(),
    )else{
        panic!("Expected Reply")
    };

    let result:Result<std::string::String, std::string::String>= decode_one(&response).unwrap();
    ic_cdk::println!("REGISTERED USER {:?}", result);

    // Register the mentor
    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some(vec!["Ethereum".to_string(), "Solana".to_string()]),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: vec!["Blockchain".to_string()],
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).expect("Mentor registration failed");

    // Simulate concurrent requests to toggle the mentor's active status
    let toggle_inactive_request = async {
        pic.update_call(
            backend_canister,
            test_principal,
            "make_active_inactive_mentor",
            encode_one(test_principal).unwrap(),
        ).await
    };

    let toggle_active_request = async {
        pic.update_call(
            backend_canister,
            test_principal,
            "make_active_inactive_mentor",
            encode_one(test_principal).unwrap(),
        ).await
    };

    let (result1, result2) = tokio::join!(toggle_inactive_request, toggle_active_request);

    assert!(result1.is_ok() || result2.is_ok(), "At least one toggle request should succeed");

    // Verify that the mentor profile has either become inactive or active depending on the final state
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();

    // The final state of active or inactive is acceptable based on concurrent execution.
    assert!(
        retrieved_mentor.active || !retrieved_mentor.active,
        "Mentor should be either active or inactive depending on final concurrent state"
    );
}
*/

#[test]
fn test_make_active_inactive_mentor_with_inactive_user() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::from_slice(&[5 as u8]);

    // Simulate registering the user as inactive
let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Inactive User".to_string(),
            profile_picture: None,
            email: Some("inactive@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Inactive mentor".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["Inactive".to_string()]),
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: false, // Inactive user
        joining_date: 1625097600,
        profile_completion: 50,
    };

    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_args((captcha_id, captcha_input, user_info.params.clone())).unwrap(),
    )else{
        panic!("Expected Reply")
    };

    let result:Result<std::string::String, std::string::String>= decode_one(&response).unwrap();
    ic_cdk::println!("REGISTERED USER {:?}", result);

    // Register the mentor
    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("Inactive Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Inactive Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Inactive Blockchain".to_string(),
        links: None,
        multichain: Some(vec!["Inactive Chain".to_string(),]),
        years_of_mentoring: "5".to_string(),
        website: Some("https://inactive-mentor.example.com".to_string()),
        area_of_expertise: vec!["Inactive Blockchain".to_string()],
        reason_for_joining: Some("Inactive Reason".to_string()),
        hub_owner: Some("Inactive Hub Owner".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).expect("Mentor registration failed");

    // Attempt to toggle the mentor's active status
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "make_active_inactive_mentor",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "made inactive"); // This should work regardless of user status

    // Verify the mentor profile is now inactive
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.active, false, "Mentor should be inactive");
}

#[test]
fn test_make_active_inactive_mentor_with_random_principal() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let random_principal = Principal::from_slice(&[99 as u8]);

    // Attempt to make an inactive mentor with a random principal
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        random_principal,
        "make_active_inactive_mentor",
        encode_one(random_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "profile seems not to be existed");
}
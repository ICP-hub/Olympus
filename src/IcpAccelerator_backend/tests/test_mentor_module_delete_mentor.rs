use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{mentor_module::mentor_types:: MentorProfile, user_modules::user_types::{UserInfoInternal, UserInformation}};
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
fn test_delete_mentor() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the initial UserInformation
let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Mentor Test".to_string(),
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
    // Call the register_mentor function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the mentor was registered correctly
    let registration_result: String = decode_one(&response).unwrap();
    assert!(registration_result.contains("Mentor Profile Created With UID"), "Mentor registration failed");

    // Call the delete_mentor function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the deletion was successful
    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile deleted successfully.");

    // Try to retrieve the deleted mentor profile to verify it was deleted
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();

    // Ensure the mentor profile was deleted and is no longer retrievable
    assert!(retrieved_mentor_info.is_none(), "Mentor profile should not be present");
}








#[test]
fn test_delete_non_existent_mentor() {
    let (pic, backend_canister) = setup();

    // Define a test principal that hasn't registered as a mentor
    let test_principal = Principal::anonymous();

        // Define the initial UserInformation
        let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "generate_captcha_with_id",
        encode_one(()).unwrap()
    )else{
        panic!("Expected reply")
    };

    let result: (String,String) = decode_args(&response).unwrap();

    let captcha_id = &result.0;
    let captcha_input=&result.1;
    ic_cdk::println!("CAPTCHA {:?}", result);

    let user_info = UserInfoInternal {
            params: UserInformation {
                full_name: "Mentor Test".to_string(),
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
        pic.update_call(
            backend_canister,
            test_principal,
            "register_user",
            encode_one(user_info.params.clone()).unwrap(),
        ).expect("User registration failed");

    // Attempt to delete a non-existent mentor profile
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the appropriate error message
    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile not found.");
}





#[test]
fn test_delete_multiple_times() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::from_slice(&[1 as u8]);

    // Register as user and mentor
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "generate_captcha_with_id",
        encode_one(()).unwrap()
    )else{
        panic!("Expected reply")
    };

    let result: (String,String) = decode_args(&response).unwrap();

    let captcha_id = &result.0;
    let captcha_input=&result.1;
    ic_cdk::println!("CAPTCHA {:?}", result);

    let user_info = UserInfoInternal {
        uid: "user_uid_1".to_string(),
        params: UserInformation {
            full_name: "User 1".to_string(),
            profile_picture: None,
            email: Some("user1@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user1".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 153518 ,
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
    ).unwrap();

    // Delete the mentor profile
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the deletion was successful
    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile deleted successfully.");

    // Try to delete again to check idempotency
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile not found.");
}







#[test]
fn test_delete_mentor_with_inactive_user() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::from_slice(&[4 as u8]);

    // Register as an inactive user and mentor
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "generate_captcha_with_id",
        encode_one(()).unwrap()
    )else{
        panic!("Expected reply")
    };

    let result: (String,String) = decode_args(&response).unwrap();

    let captcha_id = &result.0;
    let captcha_input=&result.1;
    ic_cdk::println!("CAPTCHA {:?}", result);

    let user_info = UserInfoInternal {
        uid: "user_uid_4".to_string(),
        params: UserInformation {
            full_name: "Inactive User".to_string(),
            profile_picture: None,
            email: Some("inactiveuser@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("Inactive User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("inactiveuser".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: false,  // User is inactive
        joining_date: 151747,
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
    ).unwrap();

    // Attempt to delete the mentor profile
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the deletion was successful despite the user being inactive
    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile deleted successfully.");

    // Verify the mentor profile is no longer retrievable
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_none(), "Mentor profile should be deleted");
}





#[test]
fn test_delete_mentor_with_special_characters_in_profile() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::from_slice(&[5 as u8]);

    // Register as user and mentor with special characters in the profile
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "generate_captcha_with_id",
        encode_one(()).unwrap()
    )else{
        panic!("Expected reply")
    };

    let result: (String,String) = decode_args(&response).unwrap();

    let captcha_id = &result.0;
    let captcha_input=&result.1;
    ic_cdk::println!("CAPTCHA {:?}", result);

    let user_info = UserInfoInternal {
        uid: "user_uid_5".to_string(),
        params: UserInformation {
            full_name: "Special Char User".to_string(),
            profile_picture: None,
            email: Some("specialcharuser@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("Special Char User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("specialcharuser".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 151747,
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

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("✨ICP Hub✨".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("🚀 Blockchain Projects 🚀".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain 🌐".to_string(),
        links: None,
        multichain: Some(vec!["🌍 Ethereum".to_string(), "Solana 🌍".to_string()]),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: vec!["Blockchain 🔒".to_string()],
        reason_for_joining: Some("To help new projects succeed 🌟".to_string()),
        hub_owner: Some("ICP Hub Owner 🌟".to_string()),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Delete the mentor profile
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify the deletion was successful
    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile deleted successfully.");

    // Verify the mentor profile is no longer retrievable
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_none(), "Mentor profile should be deleted");
}





#[test]
fn test_delete_mentor_with_large_profile_data() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::from_slice(&[6 as u8]);

    // Register as user and mentor with large profile data
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "generate_captcha_with_id",
        encode_one(()).unwrap()
    )else{
        panic!("Expected reply")
    };

    let result: (String,String) = decode_args(&response).unwrap();

    let captcha_id = &result.0;
    let captcha_input=&result.1;
    ic_cdk::println!("CAPTCHA {:?}", result);

    let user_info = UserInfoInternal {
        uid: "user_uid_6".to_string(),
        params: UserInformation {
            full_name: "Large Data User".to_string(),
            profile_picture: None,
            email: Some("largedatauser@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("Large Data User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("largedatauser".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 151747,
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

    let large_string = "A".repeat(10_000);

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some(large_string.clone()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some(large_string.clone()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: large_string.clone(),
        links: None,
        multichain: Some(vec![large_string.clone()]),
        years_of_mentoring: large_string.clone(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: vec![large_string.clone()],
        reason_for_joining: Some(large_string.clone()),
        hub_owner: Some(large_string.clone()),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Delete the mentor profile
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify the deletion was successful
    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile deleted successfully.");

    // Verify the mentor profile is no longer retrievable
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_none(), "Mentor profile should be deleted");
}


#[test]
fn test_delete_mentor_after_re_registration() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::from_slice(&[7 as u8]);

    // Register as user and mentor
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "generate_captcha_with_id",
        encode_one(()).unwrap()
    )else{
        panic!("Expected reply")
    };

    let result: (String,String) = decode_args(&response).unwrap();

    let captcha_id = &result.0;
    let captcha_input=&result.1;
    ic_cdk::println!("CAPTCHA {:?}", result);

    let user_info = UserInfoInternal {
        uid: "user_uid_7".to_string(),
        params: UserInformation {
            full_name: "User 7".to_string(),
            profile_picture: None,
            email: Some("user7@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user7".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 151747,
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
    ).unwrap();

    // Delete the mentor profile
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify the deletion was successful
    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile deleted successfully.");

    // Re-register the mentor with the same principal
    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Delete the mentor profile again
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify the deletion was successful
    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile deleted successfully.");

    // Verify the mentor profile is no longer retrievable
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_none(), "Mentor profile should be deleted");
}

#[test]
fn test_delete_mentor_with_unicode_characters() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::from_slice(&[8 as u8]);

    // Register as user and mentor with unicode characters in the profile
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "generate_captcha_with_id",
        encode_one(()).unwrap()
    )else{
        panic!("Expected reply")
    };

    let result: (String,String) = decode_args(&response).unwrap();

    let captcha_id = &result.0;
    let captcha_input=&result.1;
    ic_cdk::println!("CAPTCHA {:?}", result);

    let user_info = UserInfoInternal {
        uid: "user_uid_8".to_string(),
        params: UserInformation {
            full_name: "Unicode User".to_string(),
            profile_picture: None,
            email: Some("unicodeuser@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("Unicode User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("unicodeuser".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 151747,
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

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("हब".to_string()), // Unicode characters
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("प्रोजेक्ट".to_string()), // Unicode characters
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "ब्लॉकचेन".to_string(), // Unicode characters
        links: None,
        multichain: Some(vec!["इथीरियम".to_string(), "सोलाना".to_string()]), // Unicode characters
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: vec!["ब्लॉकचेन".to_string()], // Unicode characters
        reason_for_joining: Some("नई परियोजनाओं को सफल होने में मदद करना".to_string()), // Unicode characters
        hub_owner: Some("आईसीपी हब मालिक".to_string()), // Unicode characters
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Delete the mentor profile
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify the deletion was successful
    let delete_result: String = decode_one(&response).unwrap();
    assert_eq!(delete_result, "Mentor profile deleted successfully.");

    // Verify the mentor profile is no longer retrievable
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_none(), "Mentor profile should be deleted");
}

#[test]
fn test_delete_mentor_with_different_principal() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::from_slice(&[9 as u8]);
    let different_principal = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");


    // Register as user and mentor
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "generate_captcha_with_id",
        encode_one(()).unwrap()
    )else{
        panic!("Expected reply")
    };

    let result: (String,String) = decode_args(&response).unwrap();

    let captcha_id = &result.0;
    let captcha_input=&result.1;
    ic_cdk::println!("CAPTCHA {:?}", result);

    let user_info = UserInfoInternal {
        uid: "user_uid_9".to_string(),
        params: UserInformation {
            full_name: "User 9".to_string(),
            profile_picture: None,
            email: Some("user9@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user9".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 151747,
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
    ).unwrap();

    // Attempt to delete the mentor profile with a different principal
    let result = pic.update_call(
        backend_canister,
        different_principal,
        "delete_mentor",
        encode_one(()).unwrap(),
    );

    assert!(result.is_err(), "Expected an error when trying to delete with a different principal");

    // Verify the original mentor profile is still retrievable
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    
    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor profile should still be present");
}





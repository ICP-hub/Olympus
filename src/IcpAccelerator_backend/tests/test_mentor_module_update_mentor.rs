use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{
    mentor_module::mentor_types:: MentorProfile,
    user_modules::user_types::{UserInfoInternal, UserInformation},
};
use std::fs;

// Define the path to your compiled Wasm file
const BACKEND_WASM: &str = "/Users/mridulyadav/Desktop/ICPAccelerator/target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm";

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
fn test_update_mentor() {
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
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Define the initial MentorProfile
    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
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

    // Define the updated MentorProfile
    let updated_mentor_profile = MentorProfile {
        preferred_icp_hub: Some("New ICP Hub".to_string()),
        existing_icp_mentor: false,
        existing_icp_project_porfolio: Some("Updated Portfolio".to_string()),
        icp_hub_or_spoke: true,
        category_of_mentoring_service: "Updated Service".to_string(),
        links: None,
        multichain: Some("Polkadot, Avalanche".to_string()),
        years_of_mentoring: "15".to_string(),
        website: Some("https://new-mentor.example.com".to_string()),
        area_of_expertise: "Decentralized Finance".to_string(),
        reason_for_joining: Some("To mentor in new areas.".to_string()),
        hub_owner: Some("New Hub Owner".to_string()),
    };

    // Call the update_mentor function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_mentor",
        encode_one(updated_mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the update was successful
    let update_result: String = decode_one(&response).unwrap();
    assert_eq!(update_result, "Mentor profile for has been approved and updated.");

    // Retrieve the updated mentor profile to verify changes
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();

    // Ensure the updated mentor info matches the updated profile
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.preferred_icp_hub, updated_mentor_profile.preferred_icp_hub, "Preferred ICP Hub should match");
    assert_eq!(retrieved_mentor.category_of_mentoring_service, updated_mentor_profile.category_of_mentoring_service, "Category of mentoring service should match");
    assert_eq!(retrieved_mentor.years_of_mentoring, updated_mentor_profile.years_of_mentoring, "Years of mentoring should match");
    assert_eq!(retrieved_mentor.website, updated_mentor_profile.website, "Website should match");
    assert_eq!(retrieved_mentor.area_of_expertise, updated_mentor_profile.area_of_expertise, "Area of expertise should match");
}

use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{mentor_module::mentor_types:: MentorProfile, user_modules::user_types::{UserInfoInternal, UserInformation}};
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
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Define the MentorProfile to be registered
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

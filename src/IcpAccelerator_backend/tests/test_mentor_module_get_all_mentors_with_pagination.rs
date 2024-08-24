use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{
    mentor_module::mentor_types::{MentorInternal, MentorProfile}, types::pagination_types::{PaginationParamMentor, PaginationReturnMentor}, user_modules::user_types::{UserInfoInternal, UserInformation}
};
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
fn test_get_all_mentors_with_pagination() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the UserInformation with some fields set to None
    let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Test Mentor".to_string(),
            profile_picture: None,
            email: Some("mentor@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Experienced mentor with a focus on technology.".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["Contribute to innovative projects.".to_string()]),
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

    // Create a MentorProfile object to simulate mentor registration
    let mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Portfolio of ICP projects".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://mentor.example.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor emerging projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "b7deb0ac398bb66b3d8e1736cd4163d0a8411ec4fda4e8be58de74cdac6c8e08".to_string(),
        active: true,
        approve: true,
        decline: false,
    };

    // Simulate the mentor registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(_)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Define pagination parameters (e.g., page 1 with page size 10)
    let pagination_params = PaginationParamMentor {
        page: 1,
        page_size: 10,
    };

    // Call the get_all_mentors_with_pagination function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_all_mentors_with_pagination",
        encode_one(pagination_params).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the paginated mentor info was retrieved correctly
    let retrieved_mentors: PaginationReturnMentor = decode_one(&response).unwrap();

    // There should be one mentor registered, and it should match the mentor_profile we registered
    assert_eq!(retrieved_mentors.data.len(), 1, "There should be one mentor in the paginated list");
    assert_eq!(retrieved_mentors.count, 1, "The total count of mentors should be 1");

    // Extract the retrieved mentor details
    let retrieved_mentor_info = retrieved_mentors.data.get(&test_principal).expect("Mentor not found");
    assert_eq!(retrieved_mentor_info.mentor_profile.uid, mentor_profile.uid, "Mentor UID should match");
    assert_eq!(retrieved_mentor_info.mentor_profile.profile.area_of_expertise, mentor_profile.profile.area_of_expertise, "Area of expertise should match");

    // Verify user data
    let retrieved_user_info = retrieved_mentors.user_data.get(&test_principal).expect("User not found");
    assert_eq!(retrieved_user_info.full_name, user_info.params.full_name, "User full name should match");

    // Additional assertions for roles (if roles were to be added)
    // assert_eq!(retrieved_mentor_info.roles.len(), expected_role_count, "Expected number of roles should match");
}

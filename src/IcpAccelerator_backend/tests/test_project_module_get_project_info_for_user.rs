use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;

// Define the path to your compiled Wasm file
const BACKEND_WASM: &str = "../../target/wasm32-unknown-unknown/release/user_module_backend.wasm";

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
fn test_get_project_info_for_user() {
    let (pic, backend_canister) = setup();

    // Define test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define a project to register
    let project_info = ProjectInfo {
        project_name: "Tech Project".to_string(),
        project_description: Some("A project focusing on advanced technology.".to_string()),
        project_logo: Some("https://example.com/logo.png".to_string()),
        project_cover: Some("https://example.com/cover.png".to_string()),
        project_website: Some("https://example.com".to_string()),
        promotional_video: Some("https://example.com/video.mp4".to_string()),
        project_team: Some(vec![]),
        dapp_link: Some("https://dapp.example.com".to_string()),
        weekly_active_users: Some(1000),
        mentors_assigned: Some(vec![]),
        vc_assigned: Some(vec![]),
        project_area_of_focus: "Technology".to_string(),
        preferred_icp_hub: Some("United States".to_string()),
        // Add other fields as needed...
        ..Default::default()
    };

    // Register the project
    pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(project_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Retrieve the project ID after registration (assuming there's a way to get the ID)
    let project_id = "some_project_id"; // Replace with actual project ID retrieval logic

    // Call the get_project_info_for_user function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_project_info_for_user",
        encode_one(project_id.to_string()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the data
    let project_info_for_user: Option<ProjectInfoForUserInternal> = decode_one(&response).unwrap();

    // Ensure the project info was retrieved successfully
    assert!(project_info_for_user.is_some(), "Project info should be available");

    let project_info_for_user = project_info_for_user.unwrap();

    // Verify the returned data matches the registered project
    assert_eq!(project_info_for_user.params.project_name.unwrap(), "Tech Project");
    assert_eq!(project_info_for_user.params.project_description, Some("A project focusing on advanced technology.".to_string()));
    assert_eq!(project_info_for_user.params.project_logo, Some("https://example.com/logo.png".to_string()));
    assert_eq!(project_info_for_user.params.project_cover, Some("https://example.com/cover.png".to_string()));
    assert_eq!(project_info_for_user.params.project_website, Some("https://example.com".to_string()));
    assert_eq!(project_info_for_user.params.promotional_video, Some("https://example.com/video.mp4".to_string()));
    assert_eq!(project_info_for_user.params.dapp_link, Some("https://dapp.example.com".to_string()));
    assert_eq!(project_info_for_user.params.weekly_active_users, Some(1000));
    assert_eq!(project_info_for_user.params.area_of_focus.unwrap(), "Technology");
    assert_eq!(project_info_for_user.params.country_of_project, Some("United States".to_string()));
}

#[test]
fn test_get_project_info_for_user_not_found() {
    let (pic, backend_canister) = setup();

    // Define test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Attempt to retrieve a project that does not exist
    let non_existent_project_id = "non_existent_project_id".to_string();

    let result = pic.query_call(
        backend_canister,
        test_principal,
        "get_project_info_for_user",
        encode_one(non_existent_project_id).unwrap(),
    );

    // Ensure that the function returns None for a non-existent project
    match result {
        Ok(WasmResult::Reply(response)) => {
            let project_info_for_user: Option<ProjectInfoForUserInternal> = decode_one(&response).unwrap();
            assert!(project_info_for_user.is_none(), "Project info should not be found");
        }
        _ => panic!("Expected query call to return a reply"),
    }
}

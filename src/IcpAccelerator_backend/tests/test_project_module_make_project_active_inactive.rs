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
fn test_make_project_active_inactive() {
    let (pic, backend_canister) = setup();

    // Define test principal and project ID
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed
    let project_id = "test_project_id".to_string();

    // Register a project for the test principal
    let project_info = ProjectInfo {
        project_name: "Test Project".to_string(),
        project_logo: Some("https://example.com/logo.png".to_string()),
        project_cover: Some("https://example.com/cover.png".to_string()),
        project_description: Some("This is a test project.".to_string()),
        project_team: Some(vec![]),
        dapp_link: Some("https://dapp.example.com".to_string()),
        project_area_of_focus: "Technology".to_string(),
        preferred_icp_hub: Some("United States".to_string()),
        // Add other fields as needed...
        ..Default::default()
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(project_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Test making the project inactive
    let response = pic.update_call(
        backend_canister,
        test_principal,
        "make_project_active_inactive",
        encode_one((test_principal, project_id.clone())).unwrap(),
    );

    let result: String = decode_one(&response.expect("Expected reply").expect("Expected reply data")).unwrap();
    assert_eq!(result, "Project made inactive");

    // Test making the project active again
    let response = pic.update_call(
        backend_canister,
        test_principal,
        "make_project_active_inactive",
        encode_one((test_principal, project_id.clone())).unwrap(),
    );

    let result: String = decode_one(&response.expect("Expected reply").expect("Expected reply data")).unwrap();
    assert_eq!(result, "Project made active");
}

#[test]
fn test_make_project_active_inactive_unauthorized() {
    let (pic, backend_canister) = setup();

    // Define two principals, one to act as the owner and another as an unauthorized user
    let owner_principal = Principal::anonymous();
    let unauthorized_principal = Principal::from_text("aaaaa-aa").unwrap(); // Example principal

    // Register a project for the owner principal
    let project_id = "test_project_id".to_string();
    let project_info = ProjectInfo {
        project_name: "Test Project".to_string(),
        project_logo: Some("https://example.com/logo.png".to_string()),
        project_cover: Some("https://example.com/cover.png".to_string()),
        project_description: Some("This is a test project.".to_string()),
        project_team: Some(vec![]),
        dapp_link: Some("https://dapp.example.com".to_string()),
        project_area_of_focus: "Technology".to_string(),
        preferred_icp_hub: Some("United States".to_string()),
        // Add other fields as needed...
        ..Default::default()
    };

    pic.update_call(
        backend_canister,
        owner_principal,
        "register_project",
        encode_one(project_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Attempt to toggle the project status as an unauthorized user
    let response = pic.update_call(
        backend_canister,
        unauthorized_principal,
        "make_project_active_inactive",
        encode_one((owner_principal, project_id.clone())).unwrap(),
    );

    let result: String = decode_one(&response.expect("Expected reply").expect("Expected reply data")).unwrap();
    assert_eq!(result, "You are not authorized to use this function");
}

#[test]
fn test_make_project_active_inactive_project_not_found() {
    let (pic, backend_canister) = setup();

    // Define a principal and a non-existent project ID
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed
    let non_existent_project_id = "non_existent_project_id".to_string();

    // Attempt to toggle the status of a non-existent project
    let response = pic.update_call(
        backend_canister,
        test_principal,
        "make_project_active_inactive",
        encode_one((test_principal, non_existent_project_id)).unwrap(),
    );

    let result: String = decode_one(&response.expect("Expected reply").expect("Expected reply data")).unwrap();
    assert_eq!(result, "Project not found");
}

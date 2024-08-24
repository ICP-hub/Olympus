use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;
use std::collections::HashMap;

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
fn test_list_all_projects_with_pagination() {
    let (pic, backend_canister) = setup();

    // Define test principals
    let test_principal_1 = Principal::anonymous(); // Replace with specific principals if needed
    let test_principal_2 = Principal::anonymous();

    // Register two projects under two different principals
    let project_info_1 = ProjectInfo {
        project_name: "Project One".to_string(),
        // Fill in other fields with appropriate test data...
        ..Default::default()
    };

    let project_info_2 = ProjectInfo {
        project_name: "Project Two".to_string(),
        // Fill in other fields with appropriate test data...
        ..Default::default()
    };

    // Simulate user information for both principals
    let user_info_1 = UserInfo {
        full_name: "User One".to_string(),
        // Fill in other fields with appropriate test data...
        ..Default::default()
    };

    let user_info_2 = UserInfo {
        full_name: "User Two".to_string(),
        // Fill in other fields with appropriate test data...
        ..Default::default()
    };

    // Register users
    pic.update_call(
        backend_canister,
        test_principal_1,
        "register_user",
        encode_one(user_info_1).unwrap(),
    ).expect("Expected reply");

    pic.update_call(
        backend_canister,
        test_principal_2,
        "register_user",
        encode_one(user_info_2).unwrap(),
    ).expect("Expected reply");

    // Register projects
    pic.update_call(
        backend_canister,
        test_principal_1,
        "register_project",
        encode_one(project_info_1.clone()).unwrap(),
    ).expect("Expected reply");

    pic.update_call(
        backend_canister,
        test_principal_2,
        "register_project",
        encode_one(project_info_2.clone()).unwrap(),
    ).expect("Expected reply");

    // Define pagination parameters (page 1, page size 1)
    let pagination_params = PaginationParams {
        page: 1,
        page_size: 1,
    };

    // Call the list_all_projects_with_pagination function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal_1,
        "list_all_projects_with_pagination",
        encode_one(pagination_params).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the response
    let pagination_result: PaginationReturnProjectData = decode_one(&response).expect("Decoding failed");

    assert_eq!(pagination_result.data.len(), 1, "Should return one project on the first page");

    let first_project = &pagination_result.data[0];

    // Verify the project details for the first page
    assert_eq!(first_project.params.project_name, "Project One", "First project name mismatch");
    assert!(pagination_result.user_data.contains_key(&test_principal_1), "First user's information should be present");

    // Verify total count of projects
    assert_eq!(pagination_result.count, 2, "Total project count should be 2");

    // Fetch the second page
    let pagination_params_page_2 = PaginationParams {
        page: 2,
        page_size: 1,
    };

    let Ok(WasmResult::Reply(response_page_2)) = pic.query_call(
        backend_canister,
        test_principal_1,
        "list_all_projects_with_pagination",
        encode_one(pagination_params_page_2).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let pagination_result_page_2: PaginationReturnProjectData = decode_one(&response_page_2).expect("Decoding failed");

    assert_eq!(pagination_result_page_2.data.len(), 1, "Should return one project on the second page");

    let second_project = &pagination_result_page_2.data[0];

    // Verify the project details for the second page
    assert_eq!(second_project.params.project_name, "Project Two", "Second project name mismatch");
    assert!(pagination_result_page_2.user_data.contains_key(&test_principal_2), "Second user's information should be present");
}

#[test]
fn test_list_all_projects_with_pagination_empty() {
    let (pic, backend_canister) = setup();

    // Define pagination parameters
    let pagination_params = PaginationParams {
        page: 1,
        page_size: 1,
    };

    // Call the list_all_projects_with_pagination function when no projects are registered
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "list_all_projects_with_pagination",
        encode_one(pagination_params).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the response
    let pagination_result: PaginationReturnProjectData = decode_one(&response).expect("Decoding failed");

    assert!(pagination_result.data.is_empty(), "No projects should be returned");
    assert_eq!(pagination_result.count, 0, "Total project count should be 0");
}

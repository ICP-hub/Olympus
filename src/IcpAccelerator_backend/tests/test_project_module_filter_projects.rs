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
fn test_filter_projects() {
    let (pic, backend_canister) = setup();

    // Define test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Register two projects under the test principal
    let project_info_1 = ProjectInfo {
        project_name: "Tech Project".to_string(),
        project_area_of_focus: "Technology".to_string(),
        self_rating_of_project: 8.5,
        vc_assigned: Some(vec![VcInfo {
            name_of_fund: "Tech Fund".to_string(),
            // Fill in other fields with appropriate test data...
            ..Default::default()
        }]),
        // Fill in other fields with appropriate test data...
        ..Default::default()
    };

    let project_info_2 = ProjectInfo {
        project_name: "Health Project".to_string(),
        project_area_of_focus: "Healthcare".to_string(),
        self_rating_of_project: 7.0,
        vc_assigned: Some(vec![VcInfo {
            name_of_fund: "Health Fund".to_string(),
            // Fill in other fields with appropriate test data...
            ..Default::default()
        }]),
        // Fill in other fields with appropriate test data...
        ..Default::default()
    };

    // Register the projects
    pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(project_info_1.clone()).unwrap(),
    ).expect("Expected reply");

    pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(project_info_2.clone()).unwrap(),
    ).expect("Expected reply");

    // Define filter criteria to match Technology projects with rating between 8 and 9
    let criteria = FilterCriteria {
        area_of_focus: Some("Technology".to_string()),
        rating_range: Some((8.0, 9.0)),
        vc_name: Some("Tech Fund".to_string()),
        // Add other criteria as needed...
        ..Default::default()
    };

    // Call the filter_projects function
    let Ok(WasmResult::Reply(filtered_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "filter_projects",
        encode_one(criteria).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the filtering was successful
    let filtered_projects: Vec<ProjectInfo> = decode_one(&filtered_response).unwrap();

    // There should only be one result that matches the criteria
    assert_eq!(filtered_projects.len(), 1, "Should only match one project");

    // Verify the matching project is the Technology project with the correct rating
    let project = &filtered_projects[0];
    assert_eq!(project.project_name, "Tech Project");
    assert_eq!(project.self_rating_of_project, 8.5);
    assert_eq!(project.project_area_of_focus, "Technology");
    assert!(project.vc_assigned.as_ref().unwrap().iter().any(|vc| vc.name_of_fund == "Tech Fund"));
}

#[test]
fn test_filter_projects_no_match() {
    let (pic, backend_canister) = setup();

    // Define test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Register a project under the test principal
    let project_info = ProjectInfo {
        project_name: "Random Project".to_string(),
        project_area_of_focus: "Art".to_string(),
        self_rating_of_project: 5.0,
        vc_assigned: Some(vec![VcInfo {
            name_of_fund: "Art Fund".to_string(),
            // Fill in other fields with appropriate test data...
            ..Default::default()
        }]),
        // Fill in other fields with appropriate test data...
        ..Default::default()
    };

    // Register the project
    pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(project_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Define filter criteria that do not match the registered project
    let criteria = FilterCriteria {
        area_of_focus: Some("Technology".to_string()),
        rating_range: Some((8.0, 9.0)),
        vc_name: Some("Tech Fund".to_string()),
        // Add other criteria as needed...
        ..Default::default()
    };

    // Call the filter_projects function
    let Ok(WasmResult::Reply(filtered_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "filter_projects",
        encode_one(criteria).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify that no projects match the criteria
    let filtered_projects: Vec<ProjectInfo> = decode_one(&filtered_response).unwrap();

    assert!(filtered_projects.is_empty(), "No projects should match the criteria");
}

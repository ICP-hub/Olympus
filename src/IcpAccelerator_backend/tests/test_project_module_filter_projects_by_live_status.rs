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
fn test_filter_projects_by_live_status() {
    let (pic, backend_canister) = setup();

    // Define test principals
    let test_principal_1 = Principal::anonymous(); // Replace with specific principals as needed
    let test_principal_2 = Principal::from_text("some-valid-principal-2").unwrap();

    // Define test projects
    let project_1 = ProjectInfo {
        project_name: "Project 1".to_string(),
        live_on_icp_mainnet: Some(true),
        ..Default::default()  // Fill in other fields as needed
    };

    let project_2 = ProjectInfo {
        project_name: "Project 2".to_string(),
        live_on_icp_mainnet: Some(false),
        ..Default::default()  // Fill in other fields as needed
    };

    // Register the test projects
    pic.update_call(
        backend_canister,
        test_principal_1,
        "register_project",
        encode_one(project_1).unwrap(),
    ).expect("Expected reply");

    pic.update_call(
        backend_canister,
        test_principal_2,
        "register_project",
        encode_one(project_2).unwrap(),
    ).expect("Expected reply");

    // Filter projects that are live on ICP mainnet
    let response_live = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_projects_by_live_status",
        encode_one(true).unwrap(),
    );

    let live_projects: Vec<ProjectInfo> =
        decode_one(&response_live.expect("Expected reply").expect("Expected reply data")).unwrap();

    // Verify only project_1 is returned
    assert_eq!(live_projects.len(), 1);
    assert_eq!(live_projects[0].project_name, "Project 1");

    // Filter projects that are not live on ICP mainnet
    let response_not_live = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_projects_by_live_status",
        encode_one(false).unwrap(),
    );

    let not_live_projects: Vec<ProjectInfo> =
        decode_one(&response_not_live.expect("Expected reply").expect("Expected reply data")).unwrap();

    // Verify only project_2 is returned
    assert_eq!(not_live_projects.len(), 1);
    assert_eq!(not_live_projects[0].project_name, "Project 2");
}

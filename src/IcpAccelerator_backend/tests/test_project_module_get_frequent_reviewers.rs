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
fn test_get_frequent_reviewers() {
    let (pic, backend_canister) = setup();

    // Define multiple test principals and projects
    let test_principal_1 = Principal::anonymous(); // Replace with specific principals as needed
    let test_principal_2 = Principal::from_text("some-valid-principal-2").unwrap();
    let test_principal_3 = Principal::from_text("some-valid-principal-3").unwrap();

    // Define a test project ID
    let project_id = "test_project_id".to_string();

    // Add multiple reviews for test_principal_1
    for _ in 0..6 {
        let project_rating = ProjectRatingStruct {
            project_id: project_id.clone(),
            message: "Great project!".to_string(),
            rating: 5,
        };

        pic.update_call(
            backend_canister,
            test_principal_1,
            "add_project_rating",
            encode_one(project_rating.clone()).unwrap(),
        ).expect("Expected reply");
    }

    // Add fewer reviews for test_principal_2 and test_principal_3
    for _ in 0..3 {
        let project_rating = ProjectRatingStruct {
            project_id: project_id.clone(),
            message: "Good project.".to_string(),
            rating: 4,
        };

        pic.update_call(
            backend_canister,
            test_principal_2,
            "add_project_rating",
            encode_one(project_rating.clone()).unwrap(),
        ).expect("Expected reply");

        pic.update_call(
            backend_canister,
            test_principal_3,
            "add_project_rating",
            encode_one(project_rating.clone()).unwrap(),
        ).expect("Expected reply");
    }

    // Fetch frequent reviewers
    let response = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_frequent_reviewers",
        vec![],
    );

    let frequent_reviewers: Vec<UserInfoInternal> =
        decode_one(&response.expect("Expected reply").expect("Expected reply data")).unwrap();

    // Check if test_principal_1 is in the frequent reviewers list
    assert!(frequent_reviewers.iter().any(|user| user.principal == test_principal_1));

    // Check if test_principal_2 and test_principal_3 are not in the frequent reviewers list
    assert!(!frequent_reviewers.iter().any(|user| user.principal == test_principal_2));
    assert!(!frequent_reviewers.iter().any(|user| user.principal == test_principal_3));
}

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
fn test_get_project_ratings_no_ratings() {
    let (pic, backend_canister) = setup();

    // Define a test project ID
    let project_id = "test_project_id".to_string();

    // Attempt to get project ratings for a project with no ratings
    let response = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_project_ratings",
        encode_one(project_id.clone()).unwrap(),
    );

    let result: Result<(Option<Vec<(Principal, ProjectReview)>>, f32, bool), String> =
        decode_one(&response.expect("Expected reply").expect("Expected reply data")).unwrap();
    
    assert!(result.is_ok());
    let (ratings, average_rating, caller_present) = result.unwrap();
    
    assert!(ratings.is_some());
    assert_eq!(ratings.unwrap().len(), 0); // No ratings should be present
    assert_eq!(average_rating, 0.0); // Average rating should be 0
    assert!(!caller_present); // Caller should not be present in the ratings
}

#[test]
fn test_get_project_ratings_with_ratings() {
    let (pic, backend_canister) = setup();

    // Define a test project ID and test principal
    let project_id = "test_project_id".to_string();
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Register a project rating for the test project
    let project_rating = ProjectRatingStruct {
        project_id: project_id.clone(),
        message: "Great project!".to_string(),
        rating: 5,
    };

    // Simulate adding a project rating
    pic.update_call(
        backend_canister,
        test_principal,
        "add_project_rating",
        encode_one(project_rating).unwrap(),
    ).expect("Expected reply");

    // Get project ratings for the project with a rating
    let response = pic.query_call(
        backend_canister,
        test_principal,
        "get_project_ratings",
        encode_one(project_id.clone()).unwrap(),
    );

    let result: Result<(Option<Vec<(Principal, ProjectReview)>>, f32, bool), String> =
        decode_one(&response.expect("Expected reply").expect("Expected reply data")).unwrap();
    
    assert!(result.is_ok());
    let (ratings, average_rating, caller_present) = result.unwrap();
    
    assert!(ratings.is_some());
    assert_eq!(ratings.unwrap().len(), 1); // One rating should be present
    assert_eq!(average_rating, 5.0); // Average rating should be 5
    assert!(caller_present); // Caller should be present in the ratings
}

#[test]
fn test_get_project_ratings_project_not_found() {
    let (pic, backend_canister) = setup();

    // Define a non-existent project ID
    let non_existent_project_id = "non_existent_project_id".to_string();

    // Attempt to get project ratings for a non-existent project
    let response = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_project_ratings",
        encode_one(non_existent_project_id).unwrap(),
    );

    let result: Result<(Option<Vec<(Principal, ProjectReview)>>, f32, bool), String> =
        decode_one(&response.expect("Expected reply").expect("Expected reply data")).unwrap();

    assert!(result.is_err());
    assert_eq!(result.unwrap_err(), "No ratings found for the specified project ID.");
}

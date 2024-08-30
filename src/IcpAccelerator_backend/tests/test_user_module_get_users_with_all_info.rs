// use candid::{decode_one, Principal};
// use pocket_ic::{PocketIc, WasmResult};
// use std::fs;

// use IcpAccelerator_backend::user_module::{UserInfoInternal, UserInformation};

// // Define the path to your compiled Wasm file
// const BACKEND_WASM: &str = "/Users/mridulyadav/Desktop/ICPAccelerator/target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm";


// // Setup function to initialize PocketIC and install the Wasm module
// fn setup() -> (PocketIc, Principal) {
//     let pic = PocketIc::new();

//     let backend_canister = pic.create_canister();
//     pic.add_cycles(backend_canister, 2_000_000_000_000); // 2T Cycles
//     let wasm = fs::read(BACKEND_WASM).expect("Wasm file not found, run 'dfx build'.");
//     pic.install_canister(backend_canister, wasm, vec![], None);
//     (pic, backend_canister)
// }

// #[test]
// fn test_get_users_with_all_info() {
//     let (pic, backend_canister) = setup();

//     // Define a test principal
//     let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

//     // Simulate the state where the user's internal information is already stored
//     // For simplicity, assume the user's internal info is already present in the state

//     // Call the get_users_with_all_info function
//     let Ok(WasmResult::Reply(response)) = pic.query_call(
//         backend_canister,
//         test_principal,
//         "get_users_with_all_info",
//         Vec::new(), // No arguments needed
//     ) else {
//         panic!("Expected reply");
//     };

//     // Decode the response into a UserInfoInternal
//     let result: UserInfoInternal = decode_one(&response).unwrap();

//     // Define the expected UserInfoInternal based on what should be stored
//     let expected_user_info_internal = UserInfoInternal {
//         uid: "123e4567-e89b-12d3-a456-426614174000".to_string(), // Example UID, replace with expected data
//         params: UserInformation {
//             full_name: "John Doe".to_string(),
//             profile_picture: None, // Replace with expected data if any
//             email: Some("johndoe@example.com".to_string()),
//             country: "United States".to_string(),
//             social_links: None, // Replace with expected data if any
//             bio: Some("Software engineer with a passion for blockchain.".to_string()),
//             area_of_interest: "Blockchain".to_string(),
//             openchat_username: Some("john_doe".to_string()),
//             type_of_profile: Some("Mentor".to_string()),
//             reason_to_join: Some(vec!["Networking".to_string(), "Learning".to_string()]),
//         },
//         is_active: true,
//         joining_date: 1234567890, // Example timestamp, replace with expected data
//     };

//     // Assert that the returned user information matches the expected information
//     assert_eq!(result, expected_user_info_internal);
// }

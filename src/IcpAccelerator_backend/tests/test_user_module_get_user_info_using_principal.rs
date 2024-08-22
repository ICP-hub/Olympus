// use candid::{decode_one, encode_one, Principal};
// use pocket_ic::{PocketIc, WasmResult};
// use std::fs;

// use IcpAccelerator_backend::user_module::{UserInfoInternal, UserInformation};

// // Define the path to your compiled Wasm file
// const BACKEND_WASM: &str = "/home/harman/accelerator/ICPAccelerator/target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm";


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
// fn test_get_user_info_using_principal() {
//     let (pic, backend_canister) = setup();

//     // Define a specific test principal
//     let test_principal = Principal::from_text("w7x7r-cok77-xa").unwrap(); // Example principal, replace with actual

//     // Call the get_user_info_using_principal function
//     let Ok(WasmResult::Reply(response)) = pic.query_call(
//         backend_canister,
//         Principal::anonymous(), // The caller is anonymous, but we're querying info for test_principal
//         "get_user_info_using_principal",
//         encode_one(test_principal).unwrap(),
//     ) else {
//         panic!("Expected reply");
//     };

//     // Decode the response into an Option<UserInfoInternal>
//     let result: Option<UserInfoInternal> = decode_one(&response).unwrap();

//     // Define the expected UserInfoInternal based on what should be stored
//     let expected_user_info_internal = Some(UserInfoInternal {
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
//     });

//     // Assert that the returned user information matches the expected information
//     assert_eq!(result, expected_user_info_internal);
// }
